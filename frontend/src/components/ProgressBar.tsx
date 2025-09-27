import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../services/theme-service';

interface ProgressBarProps {
  progress: number;
  height?: number;
  width?: number | string;
  color?: string;
  backgroundColor?: string;
  radius?: number;
  showPercentage?: boolean;
  style?: StyleProp<ViewStyle>;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  width = '100%',
  color,
  backgroundColor,
  radius = 4,
  showPercentage = false,
  style,
  label,
  animated = true,
}) => {
  const { theme } = useTheme();
  
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  const progressText = `${Math.round(normalizedProgress)}%`;
  
  const progressColor = color || theme.colors.primary;
  const bgColor = backgroundColor || theme.colors.border;
  
  return (
    <View style={[styles.container, { width }, style]}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text variant="body2" color={theme.colors.textSecondary}>
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text variant="body2" color={progressColor} bold>
              {progressText}
            </Text>
          )}
        </View>
      )}
      
      <View 
        style={[
          styles.background, 
          { 
            height, 
            backgroundColor: bgColor, 
            borderRadius: radius,
          }
        ]}
      >
        <View
          style={[
            styles.progress,
            {
              width: `${normalizedProgress}%`,
              height,
              backgroundColor: progressColor,
              borderRadius: radius,
            },
            animated && styles.animated,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  background: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  animated: {
    transition: 'width 0.3s ease',
  },
});