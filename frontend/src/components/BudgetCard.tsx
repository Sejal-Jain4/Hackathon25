import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { PressableCard } from './Card';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';
import { useTheme } from '../services/theme-service';
import { Budget, BudgetService } from '../services/budget-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BudgetCardProps {
  budget: Budget;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, style, onPress }) => {
  const { theme } = useTheme();
  const { calculateUsagePercentage, getCategoryDetails, getBudgetStatus, isBudgetActive } = BudgetService;
  
  const percentage = calculateUsagePercentage(budget.spent, budget.amount);
  const categoryDetails = getCategoryDetails(budget.category);
  const status = getBudgetStatus(budget.spent, budget.amount);
  const isActive = isBudgetActive(budget);
  
  const getStatusColor = () => {
    switch (status) {
      case 'over':
        return theme.colors.error;
      case 'near':
        return theme.colors.warning;
      default:
        return theme.colors.success;
    }
  };
  
  const statusColor = getStatusColor();
  
  const getStatusText = () => {
    if (!isActive) return 'Inactive';
    
    switch (status) {
      case 'over':
        return 'Over Budget';
      case 'near':
        return 'Almost Used';
      default:
        return 'Under Budget';
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const getDateRangeText = () => {
    return `${formatDate(budget.startDate)} - ${formatDate(budget.endDate)}`;
  };
  
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
            <Text variant="h4" numberOfLines={1}>{budget.name}</Text>
            <Text variant="body2" color={theme.colors.textSecondary} numberOfLines={1}>
              {getDateRangeText()}
            </Text>
          </View>
        </View>
        
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text variant="caption" color="#FFFFFF" style={styles.badgeText}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={percentage} 
          height={10} 
          color={statusColor}
          showPercentage={false}
        />
        
        <View style={styles.progressDetails}>
          <Text variant="body2">
            <Text variant="body2" bold>${budget.spent}</Text>
            <Text variant="body2" color={theme.colors.textSecondary}> / ${budget.amount}</Text>
          </Text>
          
          <Text 
            variant="body2"  
            style={styles.percentText}
            color={statusColor}
          >
            {percentage}%
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="cash"
            size={16}
            color={theme.colors.textSecondary}
            style={styles.infoIcon}
          />
          <Text variant="caption" color={theme.colors.textSecondary}>
            ${budget.amount - budget.spent} remaining
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="refresh"
            size={16}
            color={theme.colors.textSecondary}
            style={styles.infoIcon}
          />
          <Text variant="caption" color={theme.colors.textSecondary}>
            {budget.isRecurring ? 'Recurring' : 'One-time'}
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontWeight: 'bold',
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