import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';

export default function Activities() {
  const activities = [
    'Take a Walk',
    'Stay Hydrated',
    'Journaling',
    'Evening Wind Down',
  ];

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Self-Care Activities</Text>
      <ScrollView style={styles.list}>
        {activities.map((activity, index) => (
          <TouchableOpacity
            key={index}
            style={styles.activityBox}
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View style={[styles.animatedBox, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.activityText}>{activity}</Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB6C1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  activityBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  animatedBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 30, // Increased height
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
  activityText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
});