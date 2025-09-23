import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  X,
  User,
  Building,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,

  Hash,
  Users,
  Loader
} from 'lucide-react';
import { ApplicationWithRelations } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { updateApplicationStatus, deleteApplication } from '../../api/applications';
import { generateApplicationPDF } from '../../utils/pdfGenerator';

interface ApplicationDetailsModalProps {
  application: ApplicationWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: number; status: 'NOT YET APPROVED' | 'APPROVED' | 'DISAPPROVED' }) => {
      if (!token) throw new Error('No authentication token');
      return updateApplicationStatus(applicationId, status, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(application!.id!, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application deleted successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete application');
    }
  });

  const handleStatusUpdate = (status: 'NOT YET APPROVED' | 'APPROVED' | 'DISAPPROVED') => {
    if (application?.id) {
      updateStatusMutation.mutate({ applicationId: application.id, status });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handleDownloadPDF = () => {
    if (application) {
      generateApplicationPDF(application);
      toast.success('Application downloaded successfully');
      addNotification({
        type: 'success',
        title: 'Download Complete',
        message: `Application for ${application.name} ${application.surname} has been downloaded.`,
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'DISAPPROVED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'NOT YET APPROVED':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white  shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Application Details</h2>
                <p className="text-slate-300">#{application.id} - {application.name} {application.surname}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status!)}`}>
                {getStatusIcon(application.status!)}
                <span className="ml-2">{application.status}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-3">
            {application.status === 'NOT YET APPROVED' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('APPROVED')}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate('DISAPPROVED')}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Disapprove
                </button>
              </>
            )}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </button>
            <div className="ml-auto text-sm text-gray-500">
              Submitted: {new Date(application.created_at!).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{application.name} {application.surname}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID Number</p>
                  <p className="font-medium text-gray-900">{application.id_number}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{new Date(application.dob).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Numbers</p>
                  <p className="font-medium text-gray-900">{application.contact_numbers}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 md:col-span-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Residential Address</p>
                  <p className="font-medium text-gray-900">{application.residential_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-green-600" />
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employer</p>
                  <p className="font-medium text-gray-900">{application.employer || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{application.department || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Number</p>
                  <p className="font-medium text-gray-900">{application.employment_number || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employer Contact</p>
                  <p className="font-medium text-gray-900">{application.employer_contact || 'N/A'}</p>
                </div>
              </div>

              {application.council_waiting_list_number && (
                <div className="flex items-center space-x-3 md:col-span-2">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Council Waiting List Number</p>
                    <p className="font-medium text-gray-900">{application.council_waiting_list_number}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next of Kin */}
          {application.next_of_kin && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Next of Kin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{application.next_of_kin.name} {application.next_of_kin.surname}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Number</p>
                    <p className="font-medium text-gray-900">{application.next_of_kin.id_number}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium text-gray-900">{application.next_of_kin.relation}</p>
                  </div>
                </div>

                {application.next_of_kin.cell && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium text-gray-900">{application.next_of_kin.cell}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Spouse Information */}
          {application.spouse && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-pink-600" />
                Spouse Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{application.spouse.name} {application.spouse.surname}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Number</p>
                    <p className="font-medium text-gray-900">{application.spouse.id_number}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">{new Date(application.spouse.dob).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Beneficiaries */}
          {application.beneficiaries && application.beneficiaries.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Beneficiaries
              </h3>
              <div className="space-y-4">
                {application.beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{beneficiary.name}</p>
                        <p className="text-sm text-gray-500">ID: {beneficiary.id_number}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      DOB: {new Date(beneficiary.dob).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {application.documents && application.documents.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Documents
              </h3>
              <div className="space-y-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.kind.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">Document ID: {doc.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        Uploaded
                      </span>
                      <button className="text-blue-600 hover:text-blue-500 p-2 hover:bg-blue-50 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};