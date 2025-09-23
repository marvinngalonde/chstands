import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Building2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllApplications } from '../../api/applications';
import { getAllUsers } from '../../api/users';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const {
    data: applications = [],
    isLoading: applicationsLoading
  } = useQuery({
    queryKey: ['applications', 'all'],
    queryFn: () => getAllApplications(token!),
    enabled: !!token
  });

  const {
    data: users = [],
    isLoading: usersLoading
  } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => getAllUsers(token!),
    enabled: !!token
  });

  const isLoading = applicationsLoading || usersLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'NOT YET APPROVED');
  const approvedApplications = applications.filter(app => app.status === 'APPROVED');
  const rejectedApplications = applications.filter(app => app.status === 'DISAPPROVED');

  // Get unique companies
  const uniqueCompanies = Array.from(new Set(
    applications
      .map(app => app.employer)
      .filter(employer => employer && employer.trim() !== '')
  ));

  const recentApplications = applications
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 3)
    .map(app => ({
      id: app.id!.toString(),
      applicantName: `${app.name} ${app.surname}`,
      submittedAt: new Date(app.created_at!),
      status: app.status!.toLowerCase()
    }));

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white  shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12  flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800  shadow-lg text-white p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-300 mt-2">
          Overview of all applications, payments, and system activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={applications.length.toLocaleString()}
          icon={FileText}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Not Yet Approved"
          value={pendingApplications.length}
          icon={Clock}
          color="bg-yellow-500"
          change={-8}
        />
        <StatCard
          title="Total Companies"
          value={uniqueCompanies.length.toLocaleString()}
          icon={Building2}
          color="bg-green-500"
          change={5}
        />
        <StatCard
          title="Total Users"
          value={users.length.toLocaleString()}
          icon={Users}
          color="bg-purple-500"
          change={7}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white  shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved Applications</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{approvedApplications.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white  shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Disapproved Applications</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{rejectedApplications.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white  shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Companies</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{uniqueCompanies.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white  shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 ">
                  <div>
                    <p className="font-medium text-gray-900">{app.applicantName}</p>
                    <p className="text-sm text-gray-500">
                      Submitted {app.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/admin/applications')}
              className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
            >
              View All Applications →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white  shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/applications')}
                className="w-full text-left p-3 border border-gray-200  hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 group-hover:text-blue-700" />
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-gray-800">Review Applications</p>
                    <p className="text-sm text-gray-500">{pendingApplications.length} applications waiting approval</p>
                  </div>
                </div>
              </button>
              
              
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full text-left p-3 border border-gray-200  hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-3 group-hover:text-purple-700" />
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-gray-800">Manage Users</p>
                    <p className="text-sm text-gray-500">Add or edit user accounts</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/admin/reports')}
                className="w-full text-left p-3 border border-gray-200  hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-orange-600 mr-3 group-hover:text-orange-700" />
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-gray-800">Generate Reports</p>
                    <p className="text-sm text-gray-500">Export data and analytics</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};