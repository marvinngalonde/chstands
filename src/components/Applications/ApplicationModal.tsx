import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  X,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  Building,
  Phone,
  MapPin,
  FileText,
  Download,
  Save,
  XCircle
} from 'lucide-react';
import { ApplicationWithRelations } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { updateApplication, deleteApplication } from '../../api/applications';

interface ApplicationModalProps {
  application: ApplicationWithRelations;
  isOpen: boolean;
  onClose: () => void;
  mode?: 'view' | 'edit';
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  application,
  isOpen,
  onClose,
  mode = 'view'
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    name: application.name || '',
    surname: application.surname || '',
    id_number: application.id_number || '',
    dob: application.dob || '',
    residential_address: application.residential_address || '',
    contact_numbers: application.contact_numbers || '',
    employer: application.employer || '',
    department: application.department || '',
    employment_number: application.employment_number || '',
    employer_contact: application.employer_contact || '',
    council_waiting_list_number: application.council_waiting_list_number || '',
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateApplication(application.id!, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application updated successfully');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(application.id!, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application deleted successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete application');
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white  shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Application #{application.id}</h2>
                <p className="text-slate-300">{application.name} {application.surname}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status!)}`}>
                {application.status}
              </span>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Application
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Application
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: application.name || '',
                        surname: application.surname || '',
                        id_number: application.id_number || '',
                        dob: application.dob || '',
                        residential_address: application.residential_address || '',
                        contact_numbers: application.contact_numbers || '',
                        employer: application.employer || '',
                        department: application.department || '',
                        employment_number: application.employment_number || '',
                        employer_contact: application.employer_contact || '',
                        council_waiting_list_number: application.council_waiting_list_number || '',
                      });
                    }}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(application.created_at!).toLocaleDateString()}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.surname}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.id_number}
                    onChange={(e) => handleInputChange('id_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.id_number}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {new Date(application.dob).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Numbers</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.contact_numbers}
                    onChange={(e) => handleInputChange('contact_numbers', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.contact_numbers}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Residential Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.residential_address}
                    onChange={(e) => handleInputChange('residential_address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.residential_address}</p>
                )}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.employer}
                    onChange={(e) => handleInputChange('employer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.employer || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.department || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.employment_number}
                    onChange={(e) => handleInputChange('employment_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.employment_number || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employer Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.employer_contact}
                    onChange={(e) => handleInputChange('employer_contact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.employer_contact || 'N/A'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Council Waiting List Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.council_waiting_list_number}
                    onChange={(e) => handleInputChange('council_waiting_list_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{application.council_waiting_list_number || 'Not assigned'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {application.documents && application.documents.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
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