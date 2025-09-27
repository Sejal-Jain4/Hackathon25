import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../types/navigation';
import { IconName, AppIcons } from '../../constants/appConstants';

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  deadline?: Date;
  category: 'savings' | 'budget';
  icon: IconName;
  color: string;
}

// Mock goals data
const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Spring Break Fund',
    currentAmount: 650,
    targetAmount: 1000,
    deadline: new Date('2026-03-15'),
    category: 'savings',
    icon: 'palm-tree' as IconName,
    color: '#5B37B7',
  },
  {
    id: '2',
    name: 'Emergency Fund',
    currentAmount: 300,
    targetAmount: 500,
    category: 'savings',
    icon: 'shield-check' as IconName,
    color: '#2E8B57',
  },
  {
    id: '3',
    name: 'Food Budget',
    currentAmount: 130,
    targetAmount: 200,
    deadline: new Date('2025-10-31'),
    category: 'budget',
    icon: 'food' as IconName,
    color: '#FF8C00',
  },
];

const GoalsScreen = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'savings' | 'budget'>('savings');

  const handleAddGoal = () => {
    if (!newGoalName || !newGoalAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(newGoalAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: newGoalName,
      currentAmount: 0,
      targetAmount: amount,
      category: selectedCategory,
      icon: selectedCategory === 'savings' ? AppIcons.bank : AppIcons.cash,
      color: selectedCategory === 'savings' ? '#5B37B7' : '#FF8C00',
    };

    setGoals((prev) => [...prev, newGoal]);
    setModalVisible(false);
    setNewGoalName('');
    setNewGoalAmount('');
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Goals</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.goalsContainer}>
        {goals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalHeaderLeft}>
                <View style={[styles.iconContainer, { backgroundColor: goal.color }]}>
                  <MaterialCommunityIcons name={goal.icon} size={24} color="white" />
                </View>
                <View>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalCategory}>
                    {goal.category === 'savings' ? 'Savings Goal' : 'Budget Limit'}
                  </Text>
                </View>
              </View>
              <View>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="#666" />
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { 
                      width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(0)}%
              </Text>
            </View>

            <View style={styles.amountsContainer}>
              <View>
                <Text style={styles.amountLabel}>Current</Text>
                <Text style={styles.amountValue}>${goal.currentAmount.toFixed(2)}</Text>
              </View>
              <View>
                <Text style={styles.amountLabel}>Target</Text>
                <Text style={styles.amountValue}>${goal.targetAmount.toFixed(2)}</Text>
              </View>
              <View>
                <Text style={styles.amountLabel}>Remaining</Text>
                <Text style={styles.amountValue}>
                  ${(goal.targetAmount - goal.currentAmount).toFixed(2)}
                </Text>
              </View>
            </View>

            {goal.deadline && (
              <View style={styles.deadlineContainer}>
                <MaterialCommunityIcons name="calendar" size={16} color="#666" />
                <Text style={styles.deadlineText}>
                  Deadline: {goal.deadline.toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Goal</Text>
            
            <View style={styles.categorySelector}>
              <TouchableOpacity
                style={[
                  styles.categoryOption,
                  selectedCategory === 'savings' && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory('savings')}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === 'savings' && styles.selectedCategoryText,
                  ]}
                >
                  Savings Goal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.categoryOption,
                  selectedCategory === 'budget' && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory('budget')}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === 'budget' && styles.selectedCategoryText,
                  ]}
                >
                  Budget Limit
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Goal Name</Text>
              <TextInput
                style={styles.input}
                value={newGoalName}
                onChangeText={setNewGoalName}
                placeholder={
                  selectedCategory === 'savings'
                    ? 'e.g., Spring Break Fund'
                    : 'e.g., Monthly Food Budget'
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {selectedCategory === 'savings' ? 'Target Amount' : 'Budget Limit'}
              </Text>
              <TextInput
                style={styles.input}
                value={newGoalAmount}
                onChangeText={setNewGoalAmount}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleAddGoal}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  addButton: {
    backgroundColor: '#5B37B7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsContainer: {
    flex: 1,
    padding: 16,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  deadlineText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedCategory: {
    borderColor: '#5B37B7',
    backgroundColor: '#F0EBFF',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: '#5B37B7',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  createButton: {
    backgroundColor: '#5B37B7',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GoalsScreen;