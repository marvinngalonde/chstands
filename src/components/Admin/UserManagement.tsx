import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Loader,
  ChevronDown,
  Download,
  FileText,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getAllUsers, updateUser, deleteUser } from '../../api/users';
import { User } from '../../types';
import { toast } from 'react-toastify';
import { generateUsersPDF } from '../../utils/pdfGenerator';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'APPLICANT', label: 'Applicant' },
  { value: 'ADMIN', label: 'Admin' }
];

export const UserManagement: React.FC = () => {
  const { token, user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const {
    data: users = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(token!),
    enabled: !!token
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { full_name?: string; role?: 'APPLICANT' | 'ADMIN' } }) =>
      updateUser(id, data, token!),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
      toast.success('User updated successfully');
      addNotification({
        type: 'success',
        title: 'User Updated',
        message: `${updatedUser.first_name} ${updatedUser.last_name}'s information has been updated.`,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
      addNotification({
        type: 'error',
        title: 'User Update Failed',
        message: 'Failed to update user information. Please try again.',
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id, token!),
    onSuccess: () => {
      const deletedUserName = showDeleteModal ? `${showDeleteModal.first_name} ${showDeleteModal.last_name}` : 'User';
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowDeleteModal(null);
      toast.success('User deleted successfully');
      addNotification({
        type: 'warning',
        title: 'User Deleted',
        message: `${deletedUserName} has been removed from the system.`,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
      addNotification({
        type: 'error',
        title: 'User Deletion Failed',
        message: 'Failed to delete the user. Please try again.',
      });
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === '' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleExportUsers = () => {
    generateUsersPDF(filteredUsers);
    toast.success('Users exported successfully');
    addNotification({
      type: 'success',
      title: 'Export Complete',
      message: 'User list has been exported as PDF file.',
    });
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Users</h3>
          <p className="text-red-700">Failed to load users. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100">
              <Users className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-lg sm:text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100">
              <CheckCircle className="h-5 w-5 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Applicants</p>
              <p className="text-lg sm:text-3xl font-bold text-gray-900">
                {users.filter(u => u.role === 'APPLICANT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100">
              <Shield className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Administrators</p>
              <p className="text-lg sm:text-3xl font-bold text-gray-900">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-amber-100">
              <Calendar className="h-5 w-5 sm:h-8 sm:w-8 text-amber-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">New This Month</p>
              <p className="text-lg sm:text-3xl font-bold text-gray-900">
                {users.filter(u => {
                  const created = new Date(u.created_at);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-sm"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 appearance-none transition-all text-sm"
          >
            {ROLE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <button
          onClick={handleExportUsers}
          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-slate-600 text-white hover:bg-slate-700 transition-all font-medium shadow-lg whitespace-nowrap text-sm"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Export Users
        </button>
      </div>

      {(searchTerm || roleFilter) && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('');
            }}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="hidden sm:table-cell px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="hidden lg:table-cell px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center">
                        {user.role === 'ADMIN' ? (
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        ) : (
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">{user.email}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {user.role === 'ADMIN' ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <Users className="w-3 h-3 mr-1" />
                      )}
                      <span className="hidden sm:inline">{user.role}</span>
                      <span className="sm:hidden">{user.role === 'ADMIN' ? 'ADM' : 'APP'}</span>
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id!)}
                        className="p-1 sm:p-2 hover:bg-gray-100 transition-colors"
                        disabled={currentUser?.id === user.id}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>

                      {openDropdown === user.id && (
                        <div className="dropdown-menu absolute right-0 mt-2 w-40 sm:w-48 bg-white shadow-xl border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setViewingUser(user);
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              View User
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Edit User
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => {
                                setShowDeleteModal(user);
                                setOpenDropdown(null);
                              }}
                              disabled={currentUser?.id === user.id}
                              className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-700 hover:bg-red-50 flex items-center disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Delete User
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || roleFilter ? 'Try adjusting your filters' : 'No users have been created yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View User Modal */}
      {viewingUser && (
        <ViewUserModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(data) => updateUserMutation.mutate({ id: editingUser.id!, data })}
          isLoading={updateUserMutation.isPending}
        />
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <DeleteUserModal
          user={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => deleteUserMutation.mutate(showDeleteModal.id!)}
          isLoading={deleteUserMutation.isPending}
        />
      )}
    </div>
  );
};

// View User Modal Component
interface ViewUserModalProps {
  user: User;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">User Details</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">View user information</p>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 flex items-center justify-center">
              {user.role === 'ADMIN' ? (
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              ) : (
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              )}
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">User ID: {user.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-3">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {user.role === 'ADMIN' ? (
                    <Shield className="w-3 h-3 mr-1" />
                  ) : (
                    <Users className="w-3 h-3 mr-1" />
                  )}
                  {user.role}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <div className="flex items-center text-sm text-gray-900 bg-gray-50 p-3">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {new Date(user.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit User Modal Component
interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (data: { full_name?: string; role?: 'APPLICANT' | 'ADMIN' }) => void;
  isLoading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    full_name: `${user.first_name} ${user.last_name}`,
    role: user.role as 'APPLICANT' | 'ADMIN'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-2xl w-full max-w-lg mx-4">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit User</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Update user information and permissions</p>
        </div>
        <form id="edit-user-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-sm"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'APPLICANT' | 'ADMIN' })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-sm"
            >
              <option value="APPLICANT">Applicant</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </form>
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-user-form"
              disabled={isLoading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-50 transition-all font-medium shadow-lg text-sm"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </div>
              ) : (
                'Update User'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete User Modal Component
interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ user, onClose, onConfirm, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-2xl w-full max-w-md mx-4">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-red-100 mr-3 sm:mr-4">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Delete User</h3>
              <p className="text-xs sm:text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{user.first_name} {user.last_name}</span>?
            All associated data will be permanently removed.
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-all font-medium shadow-lg text-sm"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};