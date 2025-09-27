import React from 'react';
import { 
  Text as RNText, 
  TextStyle, 
  StyleSheet, 
  TextProps as RNTextProps 
} from 'react-native';
import { useTheme } from '../services/theme-service';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body2' | 'caption' | 'button';
  color?: string;
  center?: boolean;
  bold?: boolean;
  italic?: boolean;
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body',
  color,
  center = false,
  bold = false,
  italic = false,
  style,
  ...props 
}) => {
  const { theme } = useTheme();
  
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'h4':
        return styles.h4;
      case 'body2':
        return styles.body2;
      case 'caption':
        return styles.caption;
      case 'button':
        return styles.button;
      default:
        return styles.body;
    }
  };
  
  const textStyle: TextStyle = {
    ...getVariantStyle(),
    color: color || theme.colors.text,
    textAlign: center ? 'center' : 'left',
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    ...style,
  };
  
  return <RNText style={textStyle} {...props} />;
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
});