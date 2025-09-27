import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../services/theme-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BadgeProps {
  text?: string;
  color?: string;
  backgroundColor?: string;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  color,
  backgroundColor,
  icon,
  size = 'medium',
  style,
  borderRadius,
}) => {
  const { theme } = useTheme();
  
  const textColor = color || theme.colors.text;
  const bgColor = backgroundColor || theme.colors.primary;
  
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 2, paddingHorizontal: 6 };
      case 'large':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      default:
        return { paddingVertical: 4, paddingHorizontal: 8 };
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };
  
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'caption';
      case 'large':
        return 'body';
      default:
        return 'caption';
    }
  };
  
  const getBorderRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    
    switch (size) {
      case 'small':
        return 4;
      case 'large':
        return 8;
      default:
        return 6;
    }
  };
  
  return (
    <View
      style={[
        styles.badge,
        getPadding(),
        { backgroundColor: bgColor, borderRadius: getBorderRadius() },
        style,
      ]}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={getIconSize()}
          color={textColor}
          style={text ? styles.iconWithText : undefined}
        />
      )}
      
      {text && (
        <Text
          variant={getTextSize() as any}
          color={textColor}
          bold
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWithText: {
    marginRight: 4,
  },
});