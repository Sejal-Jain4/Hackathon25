import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../types/navigation';

const OnboardingScreen = () => {
  const navigation = useNavigation<AuthStackScreenProps<'Onboarding'>['navigation']>();

  const handleGetStarted = () => {
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centsi</Text>
        <Text style={styles.subtitle}>Your AI Finance Coach</Text>
      </View>

      <View style={styles.imageContainer}>
        {/* Replace with actual image later */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>App Logo</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Student-focused financial coaching</Text>
        <View style={styles.feature}>
          <Text style={styles.featureText}>🎯 Set and track financial goals</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>🎮 Level up your finance skills</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>🤖 Talk to your AI finance coach</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogin}>
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5B37B7',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: '#E0D4FF',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#5B37B7',
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#444',
  },
  buttonsContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#5B37B7',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#5B37B7',
    fontSize: 16,
  },
});

export default OnboardingScreen;