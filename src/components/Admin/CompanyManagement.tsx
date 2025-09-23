import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Users,
  CheckCircle,
  XCircle,
  Loader,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getAllCompanies, createCompany, updateCompany, deleteCompany, Company, CompanyCreate, CompanyUpdate } from '../../api/companies';
import { toast } from 'react-toastify';
import { generateCompaniesPDF } from '../../utils/pdfGenerator';

export const CompanyManagement: React.FC = () => {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Company | null>(null);

  const {
    data: companies = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['companies'],
    queryFn: () => getAllCompanies(token!, { active_only: false }),
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (data: CompanyCreate) => createCompany(data, token!),
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setShowCreateModal(false);
      toast.success('Company created successfully');
      addNotification({
        type: 'success',
        title: 'Company Created',
        message: `${newCompany.name} has been successfully added to the system.`,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create company');
      addNotification({
        type: 'error',
        title: 'Company Creation Failed',
        message: 'Failed to create the company. Please try again.',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompanyUpdate }) =>
      updateCompany(id, data, token!),
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setEditingCompany(null);
      toast.success('Company updated successfully');
      addNotification({
        type: 'info',
        title: 'Company Updated',
        message: `${updatedCompany.name} information has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update company');
      addNotification({
        type: 'error',
        title: 'Company Update Failed',
        message: 'Failed to update the company. Please try again.',
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCompany(id, token!),
    onSuccess: () => {
      const deletedCompanyName = showDeleteModal?.name || 'Company';
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setShowDeleteModal(null);
      toast.success('Company deleted successfully');
      addNotification({
        type: 'warning',
        title: 'Company Deleted',
        message: `${deletedCompanyName} has been permanently removed from the system.`,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete company');
      addNotification({
        type: 'error',
        title: 'Company Deletion Failed',
        message: 'Failed to delete the company. Please try again.',
      });
    }
  });

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200  p-6 text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Companies</h3>
          <p className="text-red-700">Failed to load companies. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900  shadow-2xl border border-slate-700 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Company Management</h1>
            <p className="text-slate-300 mt-2">Manage companies and organizations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-slate-800/50 px-4 py-2  border border-slate-600">
              <span className="text-sm text-slate-300">
                {companies.length} companies
              </span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-white text-slate-900  hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Company
            </button>
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white  shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-slate-100 ">
              <Building2 className="h-8 w-8 text-slate-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 font-medium">Total Companies</p>
              <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white  shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 ">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 font-medium">Active Companies</p>
              <p className="text-3xl font-bold text-gray-900">
                {companies.filter(c => c.is_active === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white  shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 ">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 font-medium">Inactive Companies</p>
              <p className="text-3xl font-bold text-gray-900">
                {companies.filter(c => c.is_active === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search companies by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
        </div>
        <button
          onClick={() => {
            generateCompaniesPDF(filteredCompanies);
            toast.success('Companies exported successfully');
            addNotification({
              type: 'success',
              title: 'Export Complete',
              message: 'Company list has been exported as PDF file.',
            });
          }}
          className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-medium shadow-lg whitespace-nowrap"
        >
          <Download className="w-5 h-5 mr-2" />
          Export PDF
        </button>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-6 py-3 bg-slate-600 text-white  hover:bg-slate-700 transition-all font-medium shadow-lg whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Company
        </button>
      </div>

      {searchTerm && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
          <div className="text-sm text-gray-600">
            Showing {filteredCompanies.length} of {companies.length} companies
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Companies Table */}
      <div className="bg-white  shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Companies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">{company.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{company.contact_email}</div>
                    <div className="text-sm text-gray-500">{company.contact_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      company.is_active === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {company.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(company.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingCompany(company)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100  transition-all"
                        title="Edit Company"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(company)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50  transition-all"
                        title="Delete Company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No companies have been created yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-slate-600 text-white  hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Company
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCompany) && (
        <CompanyModal
          company={editingCompany}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCompany(null);
          }}
          onSubmit={(data) => {
            if (editingCompany) {
              updateMutation.mutate({ id: editingCompany.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          company={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => deleteMutation.mutate(showDeleteModal.id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

// Company Form Modal Component
interface CompanyModalProps {
  company?: Company | null;
  onClose: () => void;
  onSubmit: (data: CompanyCreate | CompanyUpdate) => void;
  isLoading: boolean;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ company, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    description: company?.description || '',
    contact_email: company?.contact_email || '',
    contact_phone: company?.contact_phone || '',
    address: company?.address || '',
    is_active: company?.is_active ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white  shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {company ? 'Edit Company' : 'Create Company'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {company ? 'Update company information' : 'Add a new company to the system'}
          </p>
        </div>
        <div className="p-6">
        <form id="company-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
              placeholder="Enter company description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
              placeholder="Enter company address"
            />
          </div>
          <div className="flex items-center p-4 bg-gray-50 ">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active === 1}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
              className="mr-3 w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 rounded focus:ring-slate-500"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
              Active Company
            </label>
          </div>
        </form>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300  hover:bg-gray-100 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="company-form"
              disabled={isLoading}
              className="px-6 py-3 bg-slate-600 text-white  hover:bg-slate-700 disabled:opacity-50 transition-all font-medium shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </div>
              ) : (
                company ? 'Update Company' : 'Create Company'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
interface DeleteModalProps {
  company: Company;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ company, onClose, onConfirm, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white  shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100  mr-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Delete Company</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{company.name}</span>?
            All associated data will be permanently removed.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300  hover:bg-gray-100 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-3 bg-red-600 text-white  hover:bg-red-700 disabled:opacity-50 transition-all font-medium shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Company
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};