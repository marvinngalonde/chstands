import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Loader,
  ChevronDown,
  Calendar,
  User,
  MoreVertical,
  Download,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getAllApplications, updateApplicationStatus } from '../../api/applications';
import { ApplicationWithRelations } from '../../types';

import { generateApplicationPDF } from '../../utils/pdfGenerator';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'NOT YET APPROVED', label: 'Not Yet Approved' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DISAPPROVED', label: 'Disapproved' }
];

export const ApplicationManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithRelations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { token } = useAuth();
  const { addNotification, showToast } = useNotifications();
  const queryClient = useQueryClient();

  const {
    data: applications = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['applications', 'all'],
    queryFn: () => getAllApplications(token!),
    enabled: !!token
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: number; status: 'NOT YET APPROVED' | 'APPROVED' | 'DISAPPROVED' }) => {
      if (!token) throw new Error('No authentication token');
      return updateApplicationStatus(applicationId, status, token);
    },
    onSuccess: (_, { applicationId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });

      // Find the application that was updated
      const application = applications.find(app => app.id === applicationId);
      const applicantName = application ? `${application.name} ${application.surname}` : `Application #${applicationId}`;

      // Show toast notification
      const statusText = status.replace('_', ' ').toLowerCase();
      toast.success(`Application ${statusText} successfully`);

      // Add notification to the notification center
      addNotification({
        type: status === 'APPROVED' ? 'success' : status === 'DISAPPROVED' ? 'warning' : 'info',
        title: `Application ${status === 'APPROVED' ? 'Approved' : status === 'DISAPPROVED' ? 'Disapproved' : 'Updated'}`,
        message: `${applicantName}'s application has been ${statusText}.`,
      });

      setSelectedApplication(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application status');
      addNotification({
        type: 'error',
        title: 'Status Update Failed',
        message: 'Failed to update application status. Please try again.',
      });
    }
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' ||
      `${app.name} ${app.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.id && app.id.toString().includes(searchTerm));

    const matchesStatus = statusFilter === '' || app.status === statusFilter;

    const matchesCompany = companyFilter === '' ||
      (app.employer && app.employer.toLowerCase().includes(companyFilter.toLowerCase()));

    const matchesDateFrom = dateFromFilter === '' ||
      (app.created_at && new Date(app.created_at) >= new Date(dateFromFilter));

    const matchesDateTo = dateToFilter === '' ||
      (app.created_at && new Date(app.created_at) <= new Date(dateToFilter + 'T23:59:59'));

    return matchesSearch && matchesStatus && matchesCompany && matchesDateFrom && matchesDateTo;
  });

  // Get unique companies for filter dropdown
  const uniqueCompanies = Array.from(new Set(
    applications
      .map(app => app.employer)
      .filter(employer => employer && employer.trim() !== '')
  )).sort();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'DISAPPROVED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'NOT YET APPROVED':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DISAPPROVED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NOT YET APPROVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = (applicationId: number, status: 'NOT YET APPROVED' | 'APPROVED' | 'DISAPPROVED') => {
    updateStatusMutation.mutate({ applicationId, status });
  };

  const handleViewApplication = (application: ApplicationWithRelations) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <XCircle className="h-6 w-6 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Applications</h3>
              <p className="text-sm text-red-700 mt-1">Failed to load applications. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
     

      {/* Filters */}
      <div className="bg-white  shadow-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              
              placeholder="Search by name, ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 appearance-none transition-all"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="relative">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 appearance-none transition-all"
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="relative">
            <input
              type="date"
              placeholder="From Date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm transition-all"
            />
          </div>

          <div className="relative">
            <input
              type="date"
              placeholder="To Date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm transition-all"
            />
          </div>
        </div>

        {(searchTerm || statusFilter || companyFilter || dateFromFilter || dateToFilter) && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCompanyFilter('');
                setDateFromFilter('');
                setDateToFilter('');
              }}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white  shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  App ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{application.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.name} {application.surname}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.id_number}</div>
                    {application.council_waiting_list_number && (
                      <div className="text-sm text-gray-500">
                        WL: {application.council_waiting_list_number}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.employer || 'N/A'}</div>
                    {application.department && (
                      <div className="text-sm text-gray-500">
                        {application.department}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(application.created_at!).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status!)}`}>
                      {getStatusIcon(application.status!)}
                      <span className="ml-1">{application.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === application.id ? null : application.id!)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>

                      {openDropdown === application.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleViewApplication(application)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                generateApplicationPDF(application);
                                toast.success('Application downloaded successfully');
                                addNotification({
                                  type: 'success',
                                  title: 'Download Complete',
                                  message: `Application for ${application.name} ${application.surname} has been downloaded.`,
                                });
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => {
                                handleStatusUpdate(application.id!, 'APPROVED');
                                setOpenDropdown(null);
                              }}
                              disabled={updateStatusMutation.isPending || application.status === 'APPROVED'}
                              className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                handleStatusUpdate(application.id!, 'DISAPPROVED');
                                setOpenDropdown(null);
                              }}
                              disabled={updateStatusMutation.isPending || application.status === 'DISAPPROVED'}
                              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Disapprove
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this application?')) {
                                  // TODO: Implement delete functionality
                                  toast.info('Delete functionality will be implemented');
                                }
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter ? 'Try adjusting your filters' : 'No applications have been submitted yet'}
              </p>
            </div>
          )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Details - #{selectedApplication.id}
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedApplication.name} {selectedApplication.surname}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID Number</label>
                    <p className="text-gray-900">{selectedApplication.id_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{new Date(selectedApplication.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Numbers</label>
                    <p className="text-gray-900">{selectedApplication.contact_numbers}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Residential Address</label>
                    <p className="text-gray-900">{selectedApplication.residential_address}</p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employer</label>
                    <p className="text-gray-900">{selectedApplication.employer || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Department</label>
                    <p className="text-gray-900">{selectedApplication.department || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employment Number</label>
                    <p className="text-gray-900">{selectedApplication.employment_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employer Contact</label>
                    <p className="text-gray-900">{selectedApplication.employer_contact || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Actions</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-500">Current Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication.status!)}`}>
                      {getStatusIcon(selectedApplication.status!)}
                      <span className="ml-1">{selectedApplication.status}</span>
                    </span>
                  </div>

                  {selectedApplication.status === 'NOT YET APPROVED' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id!, 'APPROVED')}
                        disabled={updateStatusMutation.isPending}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id!, 'DISAPPROVED')}
                        disabled={updateStatusMutation.isPending}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Disapprove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};