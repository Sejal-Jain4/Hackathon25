import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { PressableCard } from './Card';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';
import { useTheme } from '../services/theme-service';
import { Goal, GoalsService } from '../services/goals-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GoalCardProps {
  goal: Goal;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, style, onPress }) => {
  const { theme } = useTheme();
  const { calculateProgress, getCategoryDetails, getTimeRemaining } = GoalsService;
  
  const categoryDetails = getCategoryDetails(goal.category);
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const timeRemaining = getTimeRemaining(goal.deadline);
  
  return (
    <PressableCard 
      variant="elevated" 
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryDetails.color }]}>
            <MaterialCommunityIcons 
              name={categoryDetails.icon as any} 
              size={18} 
              color="#FFFFFF" 
            />
          </View>
          <View style={styles.titleContent}>
            <Text variant="h4" numberOfLines={1}>{goal.title}</Text>
            <Text variant="body2" color={theme.colors.textSecondary} numberOfLines={1}>
              {goal.description}
            </Text>
          </View>
        </View>
        
        {goal.isCompleted && (
          <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
            <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
            <Text variant="caption" color="#FFFFFF" style={styles.badgeText}>
              Completed
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={progress} 
          height={10} 
          color={goal.colorTag || categoryDetails.color}
          showPercentage={false}
        />
        
        <View style={styles.progressDetails}>
          <Text variant="body2">
            <Text variant="body2" bold>${goal.currentAmount}</Text>
            <Text variant="body2" color={theme.colors.textSecondary}> / ${goal.targetAmount}</Text>
          </Text>
          
          <Text 
            variant="body2" 
            color={theme.colors.textSecondary}
            style={styles.percentText}
          >
            {progress}%
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={theme.colors.textSecondary}
            style={styles.infoIcon}
          />
          <Text variant="caption" color={theme.colors.textSecondary}>
            {goal.deadline ? timeRemaining : 'No deadline'}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="trending-up"
            size={16}
            color={theme.colors.textSecondary}
            style={styles.infoIcon}
          />
          <Text variant="caption" color={theme.colors.textSecondary}>
            ${goal.targetAmount - goal.currentAmount} to go
          </Text>
        </View>
      </View>
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleContent: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    marginLeft: 4,
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  percentText: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 4,
  },
});