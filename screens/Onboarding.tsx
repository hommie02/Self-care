import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingProps {
  navigation: any;
}

export default function Onboarding({ navigation }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      emoji: '🎯',
      title: 'Set Your Goals',
      description: 'Choose from popular goals like drinking water, studying, exercising, and more. Track your daily progress easily.',
    },
    {
      emoji: '📊',
      title: 'Track Progress',
      description: 'See your weekly progress, build streaks, and earn badges as you complete your goals consistently.',
    },
    {
      emoji: '🔔',
      title: 'Get Reminders',
      description: 'Receive helpful notifications throughout the day to stay on track with your goals and build healthy habits.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.replace('MainApp');
    }
  };

  const handleSkip = () => {
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>{steps[currentStep].emoji}</Text>
        <Text style={styles.title}>{steps[currentStep].title}</Text>
        <Text style={styles.description}>{steps[currentStep].description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D8F0',
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 30,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
