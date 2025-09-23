import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { getUserApplications } from '../../api/applications';
import {
  FileText,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Bell,
  Eye,
  Download,
  Edit3,
  Trash2,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationModal } from '../Applications/ApplicationModal';
import { ApplicationWithRelations } from '../../types';

export const UserDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithRelations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: applications = []
  } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getUserApplications(token!),
    enabled: !!token
  });

  const latestApplication = applications[0];

  const handleViewApplication = (app: ApplicationWithRelations) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Dynamic notifications based on application status
  const notifications = [];
  if (latestApplication) {
    notifications.push({
      id: 1,
      message: `Your application (#${latestApplication.id}) has been ${latestApplication.status?.toLowerCase()}`,
      date: new Date(latestApplication.created_at!),
      type: latestApplication.status === 'APPROVED' ? 'success' : latestApplication.status === 'DISAPPROVED' ? 'error' : 'info',
      read: false
    });

    notifications.push({
      id: 2,
      message: `Application submitted successfully and is under review`,
      date: new Date(latestApplication.created_at!),
      type: 'info',
      read: true
    });
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DISAPPROVED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NOT YET APPROVED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'DISAPPROVED':
        return <FileText className="w-4 h-4" />;
      case 'NOT YET APPROVED':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Show different content if no applications
  if (applications.length === 0) {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-navy-700 to-navy-900  shadow-lg text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user?.first_name}!</h1>
              <p className="text-gray-500 mt-2">
                Get started by submitting your first stand application
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* No Applications State */}
        <div className="bg-white  shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't submitted any stand applications yet. Start your journey by creating your first application.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-navy-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-700 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Create New Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      {/* <div className="bg-gradient-to-r from-navy-700 to-navy-900  shadow-lg text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back, {user?.first_name}!</h1>
            <p className="text-gray-200 mt-2">
              Here's your application status and account overview
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white  shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50  flex items-center justify-center border border-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-lg font-semibold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white  shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50  flex items-center justify-center border border-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Application Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{latestApplication?.status?.toLowerCase() || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white  shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-50  flex items-center justify-center border border-amber-100">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Submitted</p>
              <p className="text-lg font-semibold text-gray-900">
                {latestApplication ? new Date(latestApplication.created_at!).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50  flex items-center justify-center border border-purple-100">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-lg font-semibold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Status Card */}
        <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-3 text-navy-600" />
              Application Details
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(latestApplication?.status || 'NOT YET APPROVED')}`}>
                {getStatusIcon(latestApplication?.status || 'NOT YET APPROVED')}
                <span className="ml-2 capitalize">{latestApplication?.status?.toLowerCase() || 'not yet approved'}</span>
              </div>
              <span className="text-sm text-gray-500">ID: #{latestApplication?.id || 'N/A'}</span>
            </div>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Submitted</span>
                <span className="text-sm font-medium text-gray-900">
                  {latestApplication?.created_at ? new Date(latestApplication.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {latestApplication?.created_at ? new Date(latestApplication.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Review</span>
                <span className="text-sm font-medium text-gray-900">5-7 business days</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => latestApplication && handleViewApplication(latestApplication)}
                className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button
                onClick={() => latestApplication && handleViewApplication(latestApplication)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-3 text-navy-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {notifications.length > 0 ? notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start p-4 rounded-lg border ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    notification.type === 'success' 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  } ${notification.read ? 'opacity-50' : ''}`} />
                  <div className="ml-3 flex-1">
                    <p className={`text-sm ${
                      notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.date.toLocaleDateString()} • {notification.date.toLocaleTimeString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                  )}
                </div>
              )) : (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>
            
            <button className="w-full mt-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/register"
              className="p-5 border border-gray-200  hover:border-navy-300 hover:shadow-md transition-all group bg-white"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">New Application</h4>
              <p className="text-sm text-gray-500">Register for a new stand</p>
            </Link>
            
            <Link
              to="/status"
              className="p-5 border border-gray-200  hover:border-green-300 hover:shadow-md transition-all group bg-white"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Check Status</h4>
              <p className="text-sm text-gray-500">View application progress</p>
            </Link>
            
            <button
              onClick={() => latestApplication && handleViewApplication(latestApplication)}
              className="p-5 border border-gray-200  hover:border-blue-300 hover:shadow-md transition-all group bg-white text-left"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Edit Application</h4>
              <p className="text-sm text-gray-500">Update your application details</p>
            </button>
            
            <Link
              to="/support"
              className="p-5 border border-gray-200  hover:border-purple-300 hover:shadow-md transition-all group bg-white"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Help</h4>
              <p className="text-sm text-gray-500">Contact support</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length > 1 && (
        <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-3 text-slate-600" />
              All Applications
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Application #{app.id}</p>
                      <p className="text-sm text-gray-500">
                        Submitted {new Date(app.created_at!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status!)}`}>
                      {app.status}
                    </span>
                    <button
                      onClick={() => handleViewApplication(app)}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};