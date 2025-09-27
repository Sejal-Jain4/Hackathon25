import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps, 
  ViewStyle, 
  StyleProp,
  View
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../services/theme-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'success' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          borderWidth: 0,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
    }
  };
  
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
        };
    }
  };
  
  const getTextColor = (): string => {
    if (disabled) return theme.colors.textSecondary;
    
    switch (variant) {
      case 'outlined':
      case 'text':
        return theme.colors.primary;
      default:
        return '#FFFFFF';
    }
  };
  
  const getIconColor = (): string => {
    return getTextColor();
  };
  
  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };
  
  const buttonStyles = [
    styles.button,
    getVariantStyles(),
    getSizeStyles(),
    fullWidth && styles.fullWidth,
    disabled && { 
      opacity: 0.6,
      backgroundColor: variant === 'outlined' || variant === 'text' 
        ? 'transparent' 
        : theme.colors.border,
    },
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        {leftIcon && !loading && (
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        )}
        
        {loading ? (
          <ActivityIndicator 
            color={getTextColor()} 
            size={getIconSize()} 
          />
        ) : (
          <Text
            variant="button"
            color={getTextColor()}
            center
          >
            {title}
          </Text>
        )}
        
        {rightIcon && !loading && (
          <MaterialCommunityIcons
            name={rightIcon as any}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.rightIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});