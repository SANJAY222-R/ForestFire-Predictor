# Theme System Documentation

This document describes the comprehensive theme system for the Forest Fire Predictor app.

## Overview

The theme system provides a consistent design language across the entire application with support for light and dark modes, automatic theme persistence, and comprehensive color management.

## File Structure

```
theme/
├── colors.js          # Color definitions for light/dark themes
├── ThemeContext.js    # React context for theme management
├── themeUtils.js      # Utility functions for theming
├── typography.js      # Typography definitions
└── README.md         # This documentation
```

## Core Components

### 1. ThemeContext.js

The main theme provider that manages theme state and provides theme data to components.

**Features:**
- Automatic theme persistence using AsyncStorage
- Fallback colors for safety
- Loading state management
- Theme switching with animation support

**Usage:**
```jsx
import { useTheme } from '../theme/ThemeContext';

const MyComponent = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello World</Text>
    </View>
  );
};
```

### 2. colors.js

Defines color palettes for light and dark themes.

**Color Categories:**
- **Primary Colors**: Main brand colors
- **Background Colors**: App backgrounds and surfaces
- **Text Colors**: Text and typography colors
- **Risk Level Colors**: Fire risk assessment colors
- **Status Colors**: Success, warning, error states
- **UI Element Colors**: Borders, shadows, overlays
- **Navigation Colors**: Tab bar and drawer colors

**Usage:**
```jsx
import { lightColors, darkColors, fallbackColors } from './colors';

// Use specific theme colors
const colors = isDark ? darkColors : lightColors;
```

### 3. themeUtils.js

Utility functions for consistent theming across the app.

**Available Functions:**
- `getThemeColors(isDark)`: Get theme colors
- `getColorWithOpacity(color, opacity)`: Add opacity to colors
- `getRiskColor(riskLevel, isDark)`: Get risk level colors
- `getStatusColor(status, isDark)`: Get status colors
- `createShadow(colors, elevation, opacity)`: Create shadow styles
- `createCardStyle(colors, borderRadius)`: Create card styles
- `createButtonStyle(colors, variant, disabled)`: Create button styles
- `createInputStyle(colors, focused, error)`: Create input styles
- `getTextStyle(colors, variant)`: Get text styles

**Usage:**
```jsx
import { createCardStyle, getRiskColor } from '../theme/themeUtils';

const MyComponent = () => {
  const { colors, isDark } = useTheme();
  
  const cardStyle = createCardStyle(colors);
  const riskColor = getRiskColor('high', isDark);
  
  return (
    <View style={cardStyle}>
      <Text style={{ color: riskColor }}>High Risk</Text>
    </View>
  );
};
```

## Theme Integration

### 1. App Layout Integration

The theme provider should wrap your entire app:

```jsx
// app/_layout.jsx
import { ThemeProvider } from '../theme/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
```

### 2. Component Integration

Always use the `useTheme` hook in components:

```jsx
import { useTheme } from '../theme/ThemeContext';

const MyComponent = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  
  // Use colors safely with fallbacks
  const safeColors = colors || fallbackColors;
  
  return (
    <View style={{ backgroundColor: safeColors.background }}>
      <Text style={{ color: safeColors.text }}>Content</Text>
    </View>
  );
};
```

### 3. Navigation Integration

For navigation components, use fallback colors:

```jsx
const DrawerNavigator = () => {
  const { colors } = useTheme();
  
  const fallbackColors = {
    primary: '#FFA500',
    background: '#FFF8DC',
    surface: '#FFFFFF',
  };
  
  const safeColors = colors || fallbackColors;
  
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: safeColors.primary },
        // ... other options
      }}
    >
      {/* Screens */}
    </Drawer.Navigator>
  );
};
```

## Best Practices

### 1. Always Use Fallbacks

```jsx
// ❌ Bad - No fallback
const { colors } = useTheme();
const style = { backgroundColor: colors.background };

// ✅ Good - With fallback
const { colors } = useTheme();
const safeColors = colors || fallbackColors;
const style = { backgroundColor: safeColors.background };
```

### 2. Use Theme Utilities

```jsx
// ❌ Bad - Manual styling
const style = {
  backgroundColor: colors.primary,
  borderRadius: 8,
  padding: 16,
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

// ✅ Good - Using utilities
const style = createButtonStyle(colors, 'primary');
```

### 3. Consistent Color Usage

```jsx
// Use semantic color names
const riskColor = getRiskColor(riskLevel, isDark);
const statusColor = getStatusColor(status, isDark);

// Instead of hardcoded colors
const riskColor = riskLevel === 'high' ? '#FF4444' : '#4CAF50';
```

### 4. Theme-Aware Components

```jsx
const ThemeAwareComponent = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.background }
    ]}>
      <Text style={[
        styles.text,
        { color: colors.text }
      ]}>
        Content
      </Text>
    </View>
  );
};
```

## Theme Switching

### 1. Toggle Theme

```jsx
const SettingsScreen = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <Switch
      value={isDark}
      onValueChange={toggleTheme}
    />
  );
};
```

### 2. Set Specific Theme

```jsx
const { setTheme } = useTheme();

// Set to dark mode
setTheme(true);

// Set to light mode
setTheme(false);
```

## Color System

### Light Theme Colors

- **Primary**: `#FFA500` (Orange)
- **Secondary**: `#FFD700` (Gold)
- **Background**: `#FFF8DC` (Cream)
- **Surface**: `#FFFFFF` (White)
- **Text**: `#000000` (Black)
- **Text Secondary**: `#666666` (Gray)

### Dark Theme Colors

- **Primary**: `#FFA500` (Orange)
- **Secondary**: `#FFD700` (Gold)
- **Background**: `#121212` (Dark Gray)
- **Surface**: `#1E1E1E` (Darker Gray)
- **Text**: `#FFFFFF` (White)
- **Text Secondary**: `#BBBBBB` (Light Gray)

### Risk Level Colors

- **High Risk**: `#FF4444` (Red)
- **Moderate Risk**: `#FFA500` (Orange)
- **Low Risk**: `#4CAF50` (Green)

## Troubleshooting

### Common Issues

1. **ThemeContext not found**: Ensure ThemeProvider wraps your app
2. **Colors undefined**: Always use fallback colors
3. **Theme not persisting**: Check AsyncStorage permissions
4. **Navigation theme issues**: Use fallback colors in navigation components

### Debug Tips

```jsx
// Add this to debug theme issues
const { colors, isDark } = useTheme();
console.log('Theme Debug:', { colors, isDark });
```

## Migration Guide

### From Hardcoded Colors

```jsx
// Old way
const style = {
  backgroundColor: '#FFA500',
  color: '#000000',
};

// New way
const { colors } = useTheme();
const style = {
  backgroundColor: colors.primary,
  color: colors.text,
};
```

### From Inline Styles

```jsx
// Old way
<View style={{ backgroundColor: '#FFF8DC', borderRadius: 8 }}>

// New way
<View style={[styles.container, { backgroundColor: colors.background }]}>
```

This theme system provides a robust foundation for consistent, maintainable, and accessible theming across the Forest Fire Predictor application. 