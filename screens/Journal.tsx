import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Journal() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.comingSoon}>📝 Coming Soon!</Text>
        <Text style={styles.description}>
          Write your thoughts, reflect on your day, and track your mood.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: '#B8D8F0',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  content: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  comingSoon: {
    fontSize: 48,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
