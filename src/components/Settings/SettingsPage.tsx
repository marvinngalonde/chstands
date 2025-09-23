import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Lock,
  Bell,
  Building2,
  Save,
  Eye,
  EyeOff,
  Camera,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllCompanies } from '../../api/companies';
import { toast } from 'react-toastify';

export const SettingsPage: React.FC = () => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'company'>('profile');

  const {
    data: companies = [],
    isLoading: companiesLoading
  } = useQuery({
    queryKey: ['companies', 'active'],
    queryFn: () => getAllCompanies(token!, { active_only: true }),
    enabled: !!token
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'company', label: 'Company', icon: Building2 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <ProfileSettings user={user} companies={companies} companiesLoading={companiesLoading} />
            )}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'company' && (
              <CompanySettings user={user} companies={companies} companiesLoading={companiesLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
interface ProfileSettingsProps {
  user: any;
  companies: any[];
  companiesLoading: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, companies, companiesLoading }) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    company_id: user?.company_id || '',
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      // This would call your update user API
      return Promise.resolve(data);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

      {/* Avatar Section */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div className="ml-6">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </button>
            <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          {companiesLoading ? (
            <div className="flex items-center space-x-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-500">Loading companies...</span>
            </div>
          ) : (
            <select
              value={formData.company_id}
              onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// Security Settings Component
const SecuritySettings: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: any) => {
      // This would call your change password API
      return Promise.resolve(data);
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    },
    onError: () => {
      toast.error('Failed to update password');
    }
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    passwordMutation.mutate(passwords);
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>

      {/* Change Password */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordMutation.isPending}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {passwordMutation.isPending ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Update Password
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    application_updates: true,
    payment_reminders: true,
    system_announcements: false,
    marketing_emails: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return Promise.resolve(data);
    },
    onSuccess: () => {
      toast.success('Notification settings updated');
    }
  });

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateMutation.mutate(newSettings);
  };

  const notifications = [
    {
      key: 'application_updates' as const,
      title: 'Application Updates',
      description: 'Get notified when your application status changes'
    },
    {
      key: 'payment_reminders' as const,
      title: 'Payment Reminders',
      description: 'Receive reminders for upcoming payments'
    },
    {
      key: 'system_announcements' as const,
      title: 'System Announcements',
      description: 'Important system updates and maintenance notices'
    },
    {
      key: 'marketing_emails' as const,
      title: 'Marketing Emails',
      description: 'Promotional content and newsletters'
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>

      <div className="space-y-6">
        {notifications.map((notification) => (
          <div key={notification.key} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-500">{notification.description}</p>
            </div>
            <button
              onClick={() => handleToggle(notification.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[notification.key] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[notification.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Company Settings Component
interface CompanySettingsProps {
  user: any;
  companies: any[];
  companiesLoading: boolean;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ user, companies, companiesLoading }) => {
  const userCompany = companies.find(c => c.id === user?.company_id);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Company Information</h2>

      {companiesLoading ? (
        <div className="flex items-center space-x-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm text-gray-500">Loading company information...</span>
        </div>
      ) : userCompany ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{userCompany.name}</h3>
              {userCompany.description && (
                <p className="text-gray-600 mt-1">{userCompany.description}</p>
              )}
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              userCompany.is_active === 1
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {userCompany.is_active === 1 ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {userCompany.contact_email && (
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">{userCompany.contact_email}</span>
              </div>
            )}
            {userCompany.contact_phone && (
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="ml-2 text-gray-600">{userCompany.contact_phone}</span>
              </div>
            )}
            {userCompany.address && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="ml-2 text-gray-600">{userCompany.address}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">No Company Selected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You haven't selected a company yet. Please update your profile to select a company.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};