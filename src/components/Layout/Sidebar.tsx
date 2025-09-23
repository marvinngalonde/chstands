import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  ClipboardList,
  CheckCircle,
  User,
  LogOut,
  Building2,

} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed}) => {
  const { user, logout } = useAuth();

  const userNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/register', icon: FileText, label: 'Register Application' },
    { to: '/status', icon: CheckCircle, label: 'Application Status' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const adminNavItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Admin Dashboard' },
    { to: '/admin/applications', icon: ClipboardList, label: 'Applications' },
    { to: '/admin/companies', icon: Building2, label: 'Companies' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <div
      className={`relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-72'} h-screen shadow-lg`}
    >

      {/* Logo Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center py-6' : 'px-6 py-8'} border-b border-gray-200`}>
        <div className={`flex items-center  ${isCollapsed ? 'h-4' : 'h-0 space-x-3 '}`}>
          <div className="w-10  h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-900">StandHub</h1>
              <p className="text-sm text-slate-600">Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col overflow-y-auto py-6">
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className={`flex-shrink-0 h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="font-medium transition-opacity duration-200">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-slate-600 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};