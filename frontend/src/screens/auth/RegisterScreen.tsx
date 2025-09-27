import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackScreenProps } from '../../types/navigation';

type StudentType = 'high_school' | 'college_dorm' | 'working_student' | 'graduate';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentType, setStudentType] = useState<StudentType>('college_dorm');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<AuthStackScreenProps<'Register'>['navigation']>();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password, studentType);
    } catch (error) {
      Alert.alert('Registration Failed', 'Could not create your account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  // Helper function to check if a student type is selected
  const isSelected = (type: StudentType) => studentType === type;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Get started with Centsi</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>I am a...</Text>
                <View style={styles.studentTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.studentTypeOption,
                      isSelected('high_school') && styles.selectedStudentType,
                    ]}
                    onPress={() => setStudentType('high_school')}
                  >
                    <Text
                      style={[
                        styles.studentTypeText,
                        isSelected('high_school') && styles.selectedStudentTypeText,
                      ]}
                    >
                      High School Student
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.studentTypeOption,
                      isSelected('college_dorm') && styles.selectedStudentType,
                    ]}
                    onPress={() => setStudentType('college_dorm')}
                  >
                    <Text
                      style={[
                        styles.studentTypeText,
                        isSelected('college_dorm') && styles.selectedStudentTypeText,
                      ]}
                    >
                      College Student (Dorms)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.studentTypeOption,
                      isSelected('working_student') && styles.selectedStudentType,
                    ]}
                    onPress={() => setStudentType('working_student')}
                  >
                    <Text
                      style={[
                        styles.studentTypeText,
                        isSelected('working_student') && styles.selectedStudentTypeText,
                      ]}
                    >
                      Working Student
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.studentTypeOption,
                      isSelected('graduate') && styles.selectedStudentType,
                    ]}
                    onPress={() => setStudentType('graduate')}
                  >
                    <Text
                      style={[
                        styles.studentTypeText,
                        isSelected('graduate') && styles.selectedStudentTypeText,
                      ]}
                    >
                      Graduate Student
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5B37B7',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  studentTypeContainer: {
    width: '100%',
  },
  studentTypeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
  },
  selectedStudentType: {
    borderColor: '#5B37B7',
    backgroundColor: '#F0EBFF',
  },
  studentTypeText: {
    fontSize: 16,
    color: '#555',
  },
  selectedStudentTypeText: {
    fontWeight: 'bold',
    color: '#5B37B7',
  },
  button: {
    backgroundColor: '#5B37B7',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#5B37B7',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;