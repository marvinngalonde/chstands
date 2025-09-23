import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertCircle, Info, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-show toast for important notifications
    if (notification.type === 'error' || notification.type === 'success') {
      showToast(notification.type, notification.message, notification.title);
    }

    // Auto-remove non-critical notifications after 10 seconds
    if (notification.type === 'info') {
      setTimeout(() => {
        clearNotification(newNotification.id);
      }, 10000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => {
    const toastContent = (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          {type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
          {type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
        </div>
        <div className="flex-1">
          {title && <div className="font-semibold text-gray-900">{title}</div>}
          <div className={`text-sm ${title ? 'text-gray-600' : 'text-gray-900'}`}>
            {message}
          </div>
        </div>
      </div>
    );

    switch (type) {
      case 'success':
        toast.success(toastContent);
        break;
      case 'error':
        toast.error(toastContent);
        break;
      case 'warning':
        toast.warning(toastContent);
        break;
      case 'info':
        toast.info(toastContent);
        break;
    }
  };


  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    showToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};