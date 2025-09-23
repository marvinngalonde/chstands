// Design System and Theme Configuration

export const theme = {
  colors: {
    // Primary Colors (Dark Navy Blue)
    primary: {
      50: '#f0f4ff',
      100: '#e0e9ff',
      200: '#c7d8ff',
      300: '#a4bcff',
      400: '#8193ff',
      500: '#5b6eff',
      600: '#4c63d2',
      700: '#3d4f9f',
      800: '#2e3b6b',
      900: '#1a2332', // Main primary (Dark Navy)
    },

    // Navy accent for better contrast
    navy: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a', // Deep Navy
    },

    // Secondary Colors (Professional Gray)
    secondary: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280', // Main secondary
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Status Colors
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Main success
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main error
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Neutral Colors
    white: '#ffffff',
    black: '#000000',
  },

  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    }
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  }
};

// Utility classes for consistent styling
export const buttonVariants = {
  primary: `
    bg-gradient-to-r from-navy-800 to-navy-900
    hover:from-navy-900 hover:to-primary-900
    text-white font-medium px-4 py-2 rounded-lg
    transition-all duration-200
    shadow-sm hover:shadow-md
    focus:outline-none focus:ring-2 focus:ring-navy-600 focus:ring-offset-2
  `,
  secondary: `
    bg-white border border-gray-300
    hover:bg-gray-50 hover:border-gray-400
    text-gray-700 font-medium px-4 py-2 rounded-lg
    transition-all duration-200
    shadow-sm hover:shadow-md
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
  `,
  success: `
    bg-gradient-to-r from-green-600 to-green-700
    hover:from-green-700 hover:to-green-800
    text-white font-medium px-4 py-2 rounded-lg
    transition-all duration-200
    shadow-sm hover:shadow-md
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
  `,
  danger: `
    bg-gradient-to-r from-red-600 to-red-700
    hover:from-red-700 hover:to-red-800
    text-white font-medium px-4 py-2 rounded-lg
    transition-all duration-200
    shadow-sm hover:shadow-md
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
  `,
  ghost: `
    bg-transparent hover:bg-gray-100
    text-gray-600 hover:text-gray-900
    font-medium px-4 py-2 rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
  `
};

export const cardVariants = {
  base: `
    bg-white rounded-xl border border-gray-200
    shadow-sm hover:shadow-md transition-shadow duration-200
  `,
  elevated: `
    bg-white rounded-xl border border-gray-200
    shadow-lg hover:shadow-xl transition-shadow duration-200
  `,
  flat: `
    bg-white rounded-xl border border-gray-200
  `
};

export const inputVariants = {
  base: `
    block w-full px-3 py-2 border border-gray-300 rounded-lg
    shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
  `,
  error: `
    block w-full px-3 py-2 border border-red-300 rounded-lg
    shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
    transition-all duration-200
  `
};

export const statusColors = {
  'NOT YET APPROVED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'APPROVED': 'bg-green-100 text-green-800 border-green-200',
  'DISAPPROVED': 'bg-red-100 text-red-800 border-red-200',
  'ACTIVE': 'bg-green-100 text-green-800 border-green-200',
  'INACTIVE': 'bg-gray-100 text-gray-800 border-gray-200',
};

// Component size variants
export const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};