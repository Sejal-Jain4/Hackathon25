import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// In a real app, we would use a charting library like react-native-chart-kit
// For this demo, we'll create a simple visualization
const SpendingBarChart = () => {
  const categories = [
    { name: 'Food', percentage: 40, color: '#5B37B7' },
    { name: 'Entertainment', percentage: 20, color: '#FF8C00' },
    { name: 'Transport', percentage: 15, color: '#2E8B57' },
    { name: 'Shopping', percentage: 25, color: '#CD5C5C' },
  ];

  return (
    <View style={styles.chartContainer}>
      {categories.map((category, index) => (
        <View key={index} style={styles.chartItem}>
          <Text style={styles.chartLabel}>{category.name}</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                { width: `${category.percentage}%`, backgroundColor: category.color },
              ]}
            />
            <Text style={styles.barPercentage}>{category.percentage}%</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const InsightCard = ({ title, icon, description, color }) => (
  <View style={styles.insightCard}>
    <View style={[styles.insightIconContainer, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color="white" />
    </View>
    <View style={styles.insightContent}>
      <Text style={styles.insightTitle}>{title}</Text>
      <Text style={styles.insightDescription}>{description}</Text>
    </View>
  </View>
);

const InsightsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Spending Breakdown</Text>
          <SpendingBarChart />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Insights</Text>
          <InsightCard
            title="Food spending up 40%"
            icon="food"
            description="You spent $320 on food this month, which is 40% more than your usual average of $230."
            color="#FF8C00"
          />
          <InsightCard
            title="Unused subscription detected"
            icon="bell-alert"
            description="You haven't used your $9.99 streaming subscription in 3 months. Consider cancelling it."
            color="#5B37B7"
          />
          <InsightCard
            title="Weekend spending pattern"
            icon="calendar-weekend"
            description="You tend to spend 65% more on weekends compared to weekdays."
            color="#2E8B57"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementContainer}>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FFD700' }]}>
                <MaterialCommunityIcons name="star" size={24} color="white" />
              </View>
              <Text style={styles.achievementName}>5-Day Streak</Text>
            </View>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#5B37B7' }]}>
                <MaterialCommunityIcons name="trophy" size={24} color="white" />
              </View>
              <Text style={styles.achievementName}>Budget Master</Text>
            </View>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#2E8B57' }]}>
                <MaterialCommunityIcons name="cash-plus" size={24} color="white" />
              </View>
              <Text style={styles.achievementName}>First Savings</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Money Tip of the Day</Text>
            <Text style={styles.tipContent}>
              The 50/30/20 rule suggests allocating 50% of your budget to needs, 30% to wants, and 20% to savings and debt repayment.
            </Text>
            <TouchableOpacity style={styles.tipButton}>
              <Text style={styles.tipButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartItem: {
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  barPercentage: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  achievementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievement: {
    alignItems: 'center',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#F0EBFF',
    borderRadius: 12,
    padding: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B37B7',
    marginBottom: 12,
  },
  tipContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  tipButton: {
    backgroundColor: '#5B37B7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  tipButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default InsightsScreen;