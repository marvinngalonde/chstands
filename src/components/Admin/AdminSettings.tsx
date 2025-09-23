import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Mail,
  Globe,
  Lock,
  Users,
  FileText,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Server,
  HardDrive,
  Clock,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { toast } from 'react-toastify';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

const SETTING_SECTIONS: SettingSection[] = [
  {
    id: 'general',
    title: 'General Settings',
    icon: Settings,
    description: 'Basic system configuration and preferences'
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    description: 'User authentication and data protection settings'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Email and system notification preferences'
  },
  {
    id: 'database',
    title: 'Database & Backup',
    icon: Database,
    description: 'Data management and backup configuration'
  },
  {
    id: 'system',
    title: 'System Health',
    icon: Server,
    description: 'System monitoring and performance settings'
  }
];

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [activeSection, setActiveSection] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'StandHub Management System',
    siteDescription: 'Comprehensive stand application management platform',
    timezone: 'Africa/Johannesburg',
    dateFormat: 'DD/MM/YYYY',
    language: 'en',
    maxFileSize: '10',

    // Security Settings
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      expiryDays: 90
    },
    sessionTimeout: 480, // 8 hours in minutes
    twoFactorAuth: false,
    ipWhitelist: '',

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    adminEmailAlerts: true,
    applicationStatusEmails: true,
    weeklyReports: true,
    systemMaintenanceAlerts: true,

    // Database Settings
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    databaseHost: 'localhost',

    // System Settings
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    cacheEnabled: true,
    compressionEnabled: true
  });

  const handleSettingChange = (section: string, key: string, value: any) => {
    if (section === 'passwordPolicy') {
      setSettings(prev => ({
        ...prev,
        passwordPolicy: {
          ...prev.passwordPolicy,
          [key]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSaveSettings = () => {
    // TODO: Implement actual API call to save settings
    toast.success('Settings saved successfully');
    addNotification({
      type: 'success',
      title: 'Settings Updated',
      message: 'System settings have been saved successfully.',
    });
  };

  const handleExportSettings = () => {
    const settingsData = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `standhub-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success('Settings exported successfully');
    addNotification({
      type: 'success',
      title: 'Export Complete',
      message: 'System settings have been exported as JSON file.',
    });
  };

  const handleBackupDatabase = () => {
    // TODO: Implement actual database backup
    toast.success('Database backup initiated');
    addNotification({
      type: 'info',
      title: 'Backup Started',
      message: 'Database backup process has been initiated. You will be notified when complete.',
    });
  };

  const handleRestoreDatabase = () => {
    // TODO: Implement actual database restore
    if (window.confirm('Are you sure you want to restore the database? This action cannot be undone.')) {
      toast.warning('Database restore would be initiated');
      addNotification({
        type: 'warning',
        title: 'Restore Process',
        message: 'Database restore functionality requires careful implementation.',
      });
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          >
            <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          >
            <option value="en">English</option>
            <option value="af">Afrikaans</option>
            <option value="zu">Zulu</option>
            <option value="xh">Xhosa</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max File Size (MB)
          </label>
          <input
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => handleSettingChange('general', 'maxFileSize', e.target.value)}
            min="1"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Security Warning</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Changes to security settings will affect all users. Please review carefully before saving.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            value={settings.passwordPolicy.minLength}
            onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
            min="6"
            max="20"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            min="15"
            max="1440"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Password Requirements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireUppercase}
              onChange={(e) => handleSettingChange('passwordPolicy', 'requireUppercase', e.target.checked)}
              className="mr-3 w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
            <span className="text-sm text-gray-700">Require uppercase letters</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireLowercase}
              onChange={(e) => handleSettingChange('passwordPolicy', 'requireLowercase', e.target.checked)}
              className="mr-3 w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
            <span className="text-sm text-gray-700">Require lowercase letters</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireNumbers}
              onChange={(e) => handleSettingChange('passwordPolicy', 'requireNumbers', e.target.checked)}
              className="mr-3 w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
            <span className="text-sm text-gray-700">Require numbers</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireSymbols}
              onChange={(e) => handleSettingChange('passwordPolicy', 'requireSymbols', e.target.checked)}
              className="mr-3 w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
            <span className="text-sm text-gray-700">Require symbols</span>
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="mr-3 w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
          />
          <span className="text-sm font-semibold text-gray-700">Enable Two-Factor Authentication</span>
        </label>
        <p className="text-sm text-gray-500 mt-1">Require users to use 2FA for enhanced security</p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Email Notifications</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <p className="text-sm text-gray-500">Send email notifications to users</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Application Status Emails</span>
              <p className="text-sm text-gray-500">Notify users when application status changes</p>
            </div>
            <input
              type="checkbox"
              checked={settings.applicationStatusEmails}
              onChange={(e) => handleSettingChange('notifications', 'applicationStatusEmails', e.target.checked)}
              className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Admin Email Alerts</span>
              <p className="text-sm text-gray-500">Send important alerts to administrators</p>
            </div>
            <input
              type="checkbox"
              checked={settings.adminEmailAlerts}
              onChange={(e) => handleSettingChange('notifications', 'adminEmailAlerts', e.target.checked)}
              className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Weekly Reports</span>
              <p className="text-sm text-gray-500">Send weekly summary reports to admins</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyReports}
              onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
              className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">System Maintenance Alerts</span>
              <p className="text-sm text-gray-500">Notify users of scheduled maintenance</p>
            </div>
            <input
              type="checkbox"
              checked={settings.systemMaintenanceAlerts}
              onChange={(e) => handleSettingChange('notifications', 'systemMaintenanceAlerts', e.target.checked)}
              className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Database className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Database Status</h3>
            <p className="text-sm text-blue-700 mt-1">
              Database is healthy and running optimally. Last backup: 2 hours ago
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm font-semibold text-gray-700">Automatic Backups</span>
              <p className="text-sm text-gray-500">Enable scheduled database backups</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => handleSettingChange('database', 'autoBackup', e.target.checked)}
              className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
            />
          </label>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange('database', 'backupFrequency', e.target.value)}
              disabled={!settings.autoBackup}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all disabled:bg-gray-100"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Retention Period (days)
          </label>
          <input
            type="number"
            value={settings.retentionPeriod}
            onChange={(e) => handleSettingChange('database', 'retentionPeriod', parseInt(e.target.value))}
            min="7"
            max="365"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
          <p className="text-sm text-gray-500 mt-1">How long to keep backup files</p>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleBackupDatabase}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Backup Now
        </button>
        <button
          onClick={handleRestoreDatabase}
          className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-medium shadow-lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Restore Database
        </button>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">System Status</p>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">Disk Usage</p>
              <p className="text-sm text-blue-600">45% Used</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-amber-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-800">Performance</p>
              <p className="text-sm text-amber-600">Good</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">Maintenance Mode</span>
            <p className="text-sm text-gray-500">Temporarily disable access for maintenance</p>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
            className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">Debug Mode</span>
            <p className="text-sm text-gray-500">Enable detailed error logging (not recommended for production)</p>
          </div>
          <input
            type="checkbox"
            checked={settings.debugMode}
            onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
            className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">Cache Enabled</span>
            <p className="text-sm text-gray-500">Enable system caching for better performance</p>
          </div>
          <input
            type="checkbox"
            checked={settings.cacheEnabled}
            onChange={(e) => handleSettingChange('system', 'cacheEnabled', e.target.checked)}
            className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">Compression Enabled</span>
            <p className="text-sm text-gray-500">Compress responses to reduce bandwidth usage</p>
          </div>
          <input
            type="checkbox"
            checked={settings.compressionEnabled}
            onChange={(e) => handleSettingChange('system', 'compressionEnabled', e.target.checked)}
            className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Log Level
        </label>
        <select
          value={settings.logLevel}
          onChange={(e) => handleSettingChange('system', 'logLevel', e.target.value)}
          className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
        >
          <option value="error">Error</option>
          <option value="warn">Warning</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'database':
        return renderDatabaseSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system preferences and security settings</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExportSettings}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-medium shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Settings
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex items-center px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all font-medium shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <nav className="space-y-2">
              {SETTING_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-slate-100 text-slate-900 border border-slate-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{section.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {SETTING_SECTIONS.find(s => s.id === activeSection)?.title}
            </h2>
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};