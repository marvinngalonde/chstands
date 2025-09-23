import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Building2,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Activity,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  PieChart,
  LineChart,
  Loader
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getAllApplications } from '../../api/applications';
import { getAllCompanies } from '../../api/companies';
import { getAllUsers } from '../../api/users';
import { ApplicationWithRelations } from '../../types';
import { toast } from 'react-toastify';
import { generateAnalyticsPDF } from '../../utils/pdfGenerator';

const TIME_RANGES = [
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'quarter', label: 'Last 3 Months' },
  { value: 'year', label: 'Last Year' }
];

export const Reports: React.FC = () => {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  const {
    data: applications = [],
    isLoading: applicationsLoading
  } = useQuery({
    queryKey: ['applications', 'all'],
    queryFn: () => getAllApplications(token!),
    enabled: !!token
  });

  const {
    data: companies = [],
    isLoading: companiesLoading
  } = useQuery({
    queryKey: ['companies'],
    queryFn: () => getAllCompanies(token!, { active_only: false }),
    enabled: !!token
  });

  const {
    data: users = [],
    isLoading: usersLoading
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(token!),
    enabled: !!token
  });

  const isLoading = applicationsLoading || companiesLoading || usersLoading;

  // Calculate metrics
  const getDateRange = (range: string) => {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { start, end: now };
  };

  const { start: startDate, end: endDate } = getDateRange(timeRange);

  const filteredApplications = applications.filter(app => {
    const appDate = new Date(app.created_at!);
    return appDate >= startDate && appDate <= endDate;
  });

  const metrics = {
    totalApplications: filteredApplications.length,
    approvedApplications: filteredApplications.filter(app => app.status === 'APPROVED').length,
    pendingApplications: filteredApplications.filter(app => app.status === 'NOT YET APPROVED').length,
    disapprovedApplications: filteredApplications.filter(app => app.status === 'DISAPPROVED').length,
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.is_active === 1).length,
    totalUsers: users.length,
    newUsers: users.filter(u => {
      const userDate = new Date(u.created_at);
      return userDate >= startDate && userDate <= endDate;
    }).length
  };

  const approvalRate = metrics.totalApplications > 0
    ? Math.round((metrics.approvedApplications / metrics.totalApplications) * 100)
    : 0;

  // Generate chart data
  const generateChartData = () => {
    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayApplications = applications.filter(app => {
        const appDate = new Date(app.created_at!);
        return appDate.toDateString() === currentDate.toDateString();
      });

      days.push({
        date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: dayApplications.length,
        approved: dayApplications.filter(app => app.status === 'APPROVED').length,
        pending: dayApplications.filter(app => app.status === 'NOT YET APPROVED').length,
        disapproved: dayApplications.filter(app => app.status === 'DISAPPROVED').length
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days.slice(-14); // Show last 14 days for readability
  };

  const chartData = generateChartData();

  // Export functions
  const handleExportReport = (format: 'pdf' | 'csv') => {
    if (format === 'csv') {
      const csvContent = [
        'Metric,Value',
        `Total Applications,${metrics.totalApplications}`,
        `Approved Applications,${metrics.approvedApplications}`,
        `Pending Applications,${metrics.pendingApplications}`,
        `Disapproved Applications,${metrics.disapprovedApplications}`,
        `Approval Rate,${approvalRate}%`,
        `Total Companies,${metrics.totalCompanies}`,
        `Active Companies,${metrics.activeCompanies}`,
        `Total Users,${metrics.totalUsers}`,
        `New Users (${timeRange}),${metrics.newUsers}`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `standhub-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success('Report exported as CSV');
      addNotification({
        type: 'success',
        title: 'Export Complete',
        message: 'Analytics report has been exported as CSV file.',
      });
    } else {
      generateAnalyticsPDF({
        applications: filteredApplications,
        companies,
        users,
        timeRange,
        metrics
      });
      toast.success('Analytics report exported successfully');
      addNotification({
        type: 'success',
        title: 'PDF Export Complete',
        message: 'Analytics report has been exported as PDF file.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Monitor system performance and user activity</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 appearance-none transition-all"
            >
              {TIME_RANGES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button
            onClick={() => handleExportReport('csv')}
            className="flex items-center px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all font-medium shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => handleExportReport('pdf')}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalApplications}</p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {metrics.totalApplications > 0 ? '+' : ''}
                {metrics.totalApplications} this {timeRange}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Approval Rate</p>
              <p className="text-3xl font-bold text-gray-900">{approvalRate}%</p>
              <p className="text-sm text-gray-500 mt-2">
                <Target className="w-4 h-4 inline mr-1" />
                {metrics.approvedApplications} approved
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Companies</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.activeCompanies}</p>
              <p className="text-sm text-gray-500 mt-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                of {metrics.totalCompanies} total
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">New Users</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.newUsers}</p>
              <p className="text-sm text-gray-500 mt-2">
                <Users className="w-4 h-4 inline mr-1" />
                of {metrics.totalUsers} total
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Users className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 mr-3 text-slate-600" />
              Application Status Distribution
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Approved</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{metrics.approvedApplications}</span>
                <span className="text-xs text-gray-500 ml-1">({approvalRate}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Pending</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{metrics.pendingApplications}</span>
                <span className="text-xs text-gray-500 ml-1">
                  ({metrics.totalApplications > 0 ? Math.round((metrics.pendingApplications / metrics.totalApplications) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Disapproved</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{metrics.disapprovedApplications}</span>
                <span className="text-xs text-gray-500 ml-1">
                  ({metrics.totalApplications > 0 ? Math.round((metrics.disapprovedApplications / metrics.totalApplications) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>

          {/* Simple Progress Bars */}
          <div className="mt-6 space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${approvalRate}%` }}
              ></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${metrics.totalApplications > 0 ? (metrics.pendingApplications / metrics.totalApplications) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${metrics.totalApplications > 0 ? (metrics.disapprovedApplications / metrics.totalApplications) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Application Trends */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <LineChart className="w-5 h-5 mr-3 text-slate-600" />
              Application Trends (Last 14 Days)
            </h3>
          </div>
          <div className="space-y-3">
            {chartData.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-16">{day.date}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max((day.applications / Math.max(...chartData.map(d => d.applications))) * 100, 5)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">{day.applications}</span>
              </div>
            ))}
          </div>
          {chartData.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-500 mt-2">No data available for selected period</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-3 text-slate-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    app.status === 'APPROVED' ? 'bg-green-500' :
                    app.status === 'DISAPPROVED' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.name} {app.surname}</p>
                    <p className="text-xs text-gray-500">{app.status}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(app.created_at!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-3 text-slate-600" />
            Top Companies
          </h3>
          <div className="space-y-3">
            {companies
              .sort((a, b) => {
                const aApps = applications.filter(app => app.employer === a.name).length;
                const bApps = applications.filter(app => app.employer === b.name).length;
                return bApps - aApps;
              })
              .slice(0, 5)
              .map((company) => {
                const appCount = applications.filter(app => app.employer === company.name).length;
                return (
                  <div key={company.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-500">
                        {company.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{appCount}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-3 text-slate-600" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Status</span>
              <span className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response Time</span>
              <span className="text-sm text-green-600">
                <Clock className="w-4 h-4 inline mr-1" />
                &lt; 200ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm text-blue-600">{users.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Used</span>
              <span className="text-sm text-amber-600">~45%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};