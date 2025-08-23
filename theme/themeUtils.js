import { lightColors, darkColors, fallbackColors } from './colors';

// Theme utility functions
export const getThemeColors = (isDark = false) => {
  if (isDark) {
    return darkColors;
  }
  return lightColors;
};

// Get color with opacity
export const getColorWithOpacity = (color, opacity = 1) => {
  if (typeof color !== 'string') return color;
  
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
  
  return color;
};

// Get risk level color
export const getRiskColor = (riskLevel, isDark = false) => {
  const colors = getThemeColors(isDark);
  
  switch (riskLevel?.toLowerCase()) {
    case 'high':
    case 'critical':
      return colors.highRisk;
    case 'moderate':
    case 'medium':
      return colors.moderateRisk;
    case 'low':
      return colors.lowRisk;
    default:
      return colors.textSecondary;
  }
};

// Get status color
export const getStatusColor = (status, isDark = false) => {
  const colors = getThemeColors(isDark);
  
  switch (status?.toLowerCase()) {
    case 'success':
    case 'completed':
      return colors.success;
    case 'warning':
    case 'pending':
      return colors.warning;
    case 'error':
    case 'failed':
      return colors.error;
    case 'info':
    case 'processing':
      return colors.info;
    default:
      return colors.textSecondary;
  }
};

// Create shadow style
export const createShadow = (colors, elevation = 3, opacity = 0.25) => {
  return {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: opacity,
    shadowRadius: elevation,
    elevation: elevation,
  };
};

// Create card style
export const createCardStyle = (colors, borderRadius = 12) => {
  return {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    ...createShadow(colors, 2, 0.1),
  };
};

// Create button style
export const createButtonStyle = (colors, variant = 'primary', disabled = false) => {
  const baseStyle = {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  if (disabled) {
    return {
      ...baseStyle,
      backgroundColor: colors.disabled,
    };
  }

  switch (variant) {
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
      };
    case 'danger':
      return {
        ...baseStyle,
        backgroundColor: colors.error,
      };
    case 'success':
      return {
        ...baseStyle,
        backgroundColor: colors.success,
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: colors.primary,
      };
  }
};

// Create input style
export const createInputStyle = (colors, focused = false, error = false) => {
  return {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: error ? colors.error : focused ? colors.primary : colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  };
};

// Get text style based on variant
export const getTextStyle = (colors, variant = 'body') => {
  const baseStyle = {
    color: colors.text,
  };

  switch (variant) {
    case 'title':
      return {
        ...baseStyle,
        fontSize: 24,
        fontWeight: 'bold',
      };
    case 'subtitle':
      return {
        ...baseStyle,
        fontSize: 18,
        fontWeight: '600',
      };
    case 'heading':
      return {
        ...baseStyle,
        fontSize: 16,
        fontWeight: '600',
      };
    case 'caption':
      return {
        ...baseStyle,
        fontSize: 12,
        color: colors.textSecondary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        color: colors.textSecondary,
      };
    default:
      return {
        ...baseStyle,
        fontSize: 14,
      };
  }
};

// Theme constants
export const THEME_CONSTANTS = {
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
}; 