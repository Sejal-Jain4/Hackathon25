import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { PressableCard } from './Card';
import { Text } from './Text';
import { useTheme } from '../services/theme-service';
import { InsightMessage } from '../services/analytics-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InsightCardProps {
  insight: InsightMessage;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, style, onPress }) => {
  const { theme } = useTheme();
  
  const getIconAndColor = () => {
    switch (insight.type) {
      case 'warning':
        return {
          icon: 'alert-circle',
          color: theme.colors.warning,
          backgroundColor: `${theme.colors.warning}20`, // 20% opacity
        };
      case 'achievement':
        return {
          icon: 'trophy',
          color: theme.colors.success,
          backgroundColor: `${theme.colors.success}20`,
        };
      case 'tip':
      default:
        return {
          icon: 'lightbulb',
          color: theme.colors.info,
          backgroundColor: `${theme.colors.info}20`,
        };
    }
  };
  
  const { icon, color, backgroundColor } = getIconAndColor();
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <PressableCard 
      variant={insight.isRead ? 'outlined' : 'elevated'} 
      style={[
        styles.container, 
        insight.isRead && styles.readContainer,
        style
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor }]}>
          <MaterialCommunityIcons 
            name={icon as any} 
            size={24} 
            color={color} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text 
            variant="h4" 
            style={[
              styles.title, 
              insight.isRead && styles.readText
            ]}
          >
            {insight.title}
          </Text>
          
          <Text 
            variant="body2" 
            color={insight.isRead ? theme.colors.textSecondary : theme.colors.text}
            style={styles.message}
          >
            {insight.message}
          </Text>
          
          <View style={styles.footer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={theme.colors.textSecondary}
              style={styles.timeIcon}
            />
            <Text variant="caption" color={theme.colors.textSecondary}>
              {formatTimestamp(insight.timestamp)}
            </Text>
          </View>
        </View>
      </View>
      
      {!insight.isRead && (
        <View style={styles.unreadIndicator} />
      )}
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readContainer: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  message: {
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5B37B7',
    marginLeft: 8,
  },
  readText: {
    opacity: 0.8,
  },
});