import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { MainTabScreenProps } from '../../types/navigation';
import { AppIcons } from '../../constants/appConstants';

// This will be replaced with real components later
const BalanceCard = () => (
  <View style={styles.balanceCard}>
    <View style={styles.balanceHeader}>
      <Text style={styles.balanceTitle}>Available Balance</Text>
      <MaterialCommunityIcons name={AppIcons.eye} size={24} color="#5B37B7" />
    </View>
    <Text style={styles.balanceAmount}>$1,254.32</Text>
    <View style={styles.balanceActions}>
      <TouchableOpacity style={styles.balanceActionButton}>
        <MaterialCommunityIcons name={AppIcons.plus} size={20} color="#5B37B7" />
        <Text style={styles.balanceActionText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.balanceActionButton}>
        <MaterialCommunityIcons name={AppIcons.transfer} size={20} color="#5B37B7" />
        <Text style={styles.balanceActionText}>Transfer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.balanceActionButton}>
        <MaterialCommunityIcons name={AppIcons.chart} size={20} color="#5B37B7" />
        <Text style={styles.balanceActionText}>Details</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const GoalProgressCard = () => (
  <View style={styles.goalCard}>
    <Text style={styles.goalTitle}>Spring Break Fund</Text>
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: '65%' }]} />
      </View>
      <Text style={styles.progressText}>65% completed</Text>
    </View>
    <View style={styles.goalDetails}>
      <View>
        <Text style={styles.goalDetailLabel}>Saved</Text>
        <Text style={styles.goalDetailValue}>$650</Text>
      </View>
      <View>
        <Text style={styles.goalDetailLabel}>Goal</Text>
        <Text style={styles.goalDetailValue}>$1,000</Text>
      </View>
      <View>
        <Text style={styles.goalDetailLabel}>Remaining</Text>
        <Text style={styles.goalDetailValue}>$350</Text>
      </View>
    </View>
  </View>
);

const BadgeCard = () => (
  <View style={styles.badgeCard}>
    <Text style={styles.badgeTitle}>Recent Achievements</Text>
    <View style={styles.badgeGrid}>
      <View style={styles.badge}>
        <View style={styles.badgeIcon}>
          <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
        </View>
        <Text style={styles.badgeName}>First Steps</Text>
      </View>
      <View style={styles.badge}>
        <View style={styles.badgeIcon}>
          <MaterialCommunityIcons name="fire" size={24} color="#FF4500" />
        </View>
        <Text style={styles.badgeName}>3-Day Streak</Text>
      </View>
      <View style={styles.badge}>
        <View style={styles.badgeIcon}>
          <MaterialCommunityIcons name="cash" size={24} color="#2E8B57" />
        </View>
        <Text style={styles.badgeName}>Budget Boss</Text>
      </View>
    </View>
  </View>
);

const QuickActionsCard = () => (
  <View style={styles.quickActionsCard}>
    <Text style={styles.quickActionsTitle}>Quick Actions</Text>
    <View style={styles.quickActionsGrid}>
      <TouchableOpacity style={styles.quickActionButton}>
        <View style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="robot" size={24} color="#5B37B7" />
        </View>
        <Text style={styles.quickActionText}>Ask Coach</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickActionButton}>
        <View style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="flag-plus" size={24} color="#5B37B7" />
        </View>
        <Text style={styles.quickActionText}>New Goal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickActionButton}>
        <View style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="cash-register" size={24} color="#5B37B7" />
        </View>
        <Text style={styles.quickActionText}>Transactions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickActionButton}>
        <View style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="chart-pie" size={24} color="#5B37B7" />
        </View>
        <Text style={styles.quickActionText}>Budget</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const DashboardScreen = () => {
  const { user } = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Friend'}</Text>
            <Text style={styles.date}>September 27, 2025</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {user?.level || 1}</Text>
          </View>
        </View>
        
        <BalanceCard />
        <GoalProgressCard />
        <QuickActionsCard />
        <BadgeCard />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: '#5B37B7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 4,
  },
  balanceActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  balanceActionText: {
    marginLeft: 4,
    color: '#5B37B7',
    fontWeight: '500',
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B37B7',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  goalDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badgeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: {
    alignItems: 'center',
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0EBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    color: '#333',
  },
  quickActionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#F9F7FF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 10,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    color: '#333',
    fontSize: 14,
  },
});

export default DashboardScreen;