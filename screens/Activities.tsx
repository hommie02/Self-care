import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Activities() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Self-Care Activities</Text>
      <ScrollView style={styles.list}>
        <Text style={styles.activity}>• Take a Walk</Text>
        <Text style={styles.activity}>• Stay Hydrated</Text>
        <Text style={styles.activity}>• Journaling</Text>
        <Text style={styles.activity}>• Evening Wind Down</Text>
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
  activity: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
});