import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

const ProfileItem = ({ icon, title, value, color = '#5B37B7' }) => (
  <View style={styles.profileItem}>
    <View style={[styles.profileItemIcon, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={20} color="white" />
    </View>
    <View style={styles.profileItemContent}>
      <Text style={styles.profileItemLabel}>{title}</Text>
      <Text style={styles.profileItemValue}>{value}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
  </View>
);

const SettingsItem = ({ icon, title, onPress, color = '#5B37B7' }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={[styles.settingsItemIcon, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={20} color="white" />
    </View>
    <Text style={styles.settingsItemTitle}>{title}</Text>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };
  
  const studentTypeMap = {
    high_school: 'High School Student',
    college_dorm: 'College Student (Dorms)',
    working_student: 'Working Student',
    graduate: 'Graduate Student',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>
              {user?.name.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.xpPoints || 0}</Text>
              <Text style={styles.statLabel}>XP Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <ProfileItem
            icon="school"
            title="Student Type"
            value={user?.studentType ? studentTypeMap[user.studentType] : 'Not set'}
            color="#FF8C00"
          />
          <ProfileItem
            icon="trophy"
            title="Achievements"
            value="3 unlocked"
            color="#2E8B57"
          />
          <ProfileItem
            icon="flag"
            title="Goals"
            value="2 active"
            color="#5B37B7"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <SettingsItem
            icon="bell"
            title="Notifications"
            onPress={() => Alert.alert('Notifications', 'Notification settings would open here')}
            color="#FF8C00"
          />
          <SettingsItem
            icon="account"
            title="Account Settings"
            onPress={() => Alert.alert('Account', 'Account settings would open here')}
            color="#5B37B7"
          />
          <SettingsItem
            icon="credit-card"
            title="Connected Accounts"
            onPress={() => Alert.alert('Connected Accounts', 'Bank connection settings would open here')}
            color="#2E8B57"
          />
          <SettingsItem
            icon="shield"
            title="Privacy"
            onPress={() => Alert.alert('Privacy', 'Privacy settings would open here')}
            color="#CD5C5C"
          />
          <SettingsItem
            icon="help-circle"
            title="Help Center"
            onPress={() => Alert.alert('Help', 'Help center would open here')}
            color="#4682B4"
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Centsi v1.0.0</Text>
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
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5B37B7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    backgroundColor: '#F0EBFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B37B7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0D4FF',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 14,
    color: '#666',
  },
  profileItemValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 24,
  },
});

export default ProfileScreen;