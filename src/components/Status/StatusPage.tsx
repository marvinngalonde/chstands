import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  Calendar,
  Download,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserApplications } from '../../api/applications';
import { Link } from 'react-router-dom';

export const StatusPage: React.FC = () => {
  const { token } = useAuth();

  const {
    data: applications = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getUserApplications(token!),
    enabled: !!token
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Applications</h3>
              <p className="text-sm text-red-700 mt-1">
                Failed to load your applications. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600 mb-4">
            You haven't submitted any applications yet.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create New Application
          </Link>
        </div>
      </div>
    );
  }

  const application = applications[0]; // Show the latest application
  const totalPaid = application.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  const timeline = [
    {
      date: new Date(application.created_at!),
      event: 'Application Submitted',
      description: 'Your application has been successfully submitted',
      status: 'completed'
    },
    {
      date: application.status !== 'NOT YET APPROVED' ? new Date(application.created_at!) : null,
      event: 'Document Verification',
      description: 'Documents are being verified by our team',
      status: application.status !== 'NOT YET APPROVED' ? 'completed' : 'current'
    },
    {
      date: application.status === 'APPROVED' || application.status === 'DISAPPROVED' ? new Date(application.created_at!) : null,
      event: 'Council Review',
      description: 'Application reviewed by council members',
      status: application.status === 'APPROVED' || application.status === 'DISAPPROVED' ? 'completed' : 'pending'
    },
    {
      date: application.status === 'APPROVED' ? new Date(application.created_at!) : null,
      event: 'Final Approval',
      description: application.status === 'APPROVED' ? 'Stand allocation completed' : 'Final decision pending',
      status: application.status === 'APPROVED' ? 'completed' : 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'DISAPPROVED':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'NOT YET APPROVED':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return <CheckCircle className="w-6 h-6" />;
      case 'DISAPPROVED':
        return <XCircle className="w-6 h-6" />;
      case 'NOT YET APPROVED':
        return <Clock className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
            <p className="text-gray-600 mt-2">Application ID: #{application.id}</p>
          </div>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)}
            <span className="ml-2 capitalize">{application.status}</span>
          </div>
        </div>
      </div>

      {/* Application Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Application Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Applicant Name:</span>
              <span className="text-sm font-medium text-gray-900">{application.name} {application.surname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Waiting List Number:</span>
              <span className="text-sm font-medium text-gray-900">{application.council_waiting_list_number || 'Not assigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Submitted:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(application.created_at!).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Last Updated:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(application.created_at!).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Payment Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payment Status:</span>
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                totalPaid > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {totalPaid > 0 ? 'Payment Made' : 'No Payments'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Paid:</span>
              <span className="text-sm font-medium text-gray-900">${totalPaid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Remaining Balance:</span>
              <span className="text-sm font-medium text-gray-900">${10000 - totalPaid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Next Payment Due:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Application Progress
        </h3>
        <div className="relative">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start mb-8 last:mb-0">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                item.status === 'completed'
                  ? 'bg-green-500 border-green-500'
                  : item.status === 'current'
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-gray-200 border-gray-300'
              }`}>
                {item.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : item.status === 'current' ? (
                  <Clock className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <h4 className={`font-medium ${
                  item.status === 'completed' || item.status === 'current'
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}>
                  {item.event}
                </h4>
                <p className={`text-sm mt-1 ${
                  item.status === 'completed' || item.status === 'current'
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>
                  {item.description}
                </p>
                {item.date && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.date.toLocaleDateString()}
                  </p>
                )}
              </div>
              {index < timeline.length - 1 && (
                <div className={`absolute left-5 w-px h-8 ${
                  item.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} style={{ top: `${(index + 1) * 96 - 32}px` }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Submitted Documents
        </h3>
        <div className="space-y-3">
          {application.documents && application.documents.length > 0 ? (
            application.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.kind.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500">
                      Document ID: {doc.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    Submitted
                  </span>
                  <button className="text-blue-600 hover:text-blue-500 p-1">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Required (if any) */}
      {application.status === 'NOT YET APPROVED' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Action Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your application is currently being reviewed. You will receive an email notification once the review is complete.
                Please ensure your contact information is up to date.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};