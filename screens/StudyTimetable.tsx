import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const TIMETABLE_STORAGE_KEY = '@study_timetable';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Subject {
  name: string;
  color: string;
}

interface Timetable {
  [day: string]: string[];
}

export default function StudyTimetable({ navigation }: any) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<Timetable>({});
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFB6C1');
  const [todaySubject, setTodaySubject] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const colors = ['#FFB6C1', '#B8D8F0', '#FFE4B5', '#D8BFD8', '#98FB98', '#FFD700', '#FFA07A'];

  useEffect(() => {
    loadUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      loadData();
    }
  }, [userEmail]);

  useEffect(() => {
    updateTodaySubject();
  }, [timetable]);

  const loadUserEmail = async () => {
    try {
      const stored = await AsyncStorage.getItem('@user_data');
      if (stored) {
        const userData = JSON.parse(stored);
        setUserEmail(userData.email || '');
      }
    } catch (error) {
      console.error('Error loading user email:', error);
    }
  };

  const loadData = async () => {
    try {
      const storageKey = `${TIMETABLE_STORAGE_KEY}_${userEmail}`;
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        setSubjects(data.subjects || []);
        setTimetable(data.timetable || {});
      } else {
        setSubjects([]);
        setTimetable({});
      }
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const saveData = async (newSubjects: Subject[], newTimetable: Timetable) => {
    try {
      const storageKey = `${TIMETABLE_STORAGE_KEY}_${userEmail}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify({
        subjects: newSubjects,
        timetable: newTimetable,
      }));
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  const updateTodaySubject = () => {
    const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const subjects = timetable[today] || [];
    if (subjects.length === 0) {
      setTodaySubject('No subjects scheduled');
    } else if (subjects.length === 1) {
      setTodaySubject(subjects[0]);
    } else {
      setTodaySubject(subjects.join(', '));
    }
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }

    if (subjects.length >= 7) {
      Alert.alert('Limit Reached', 'You can only add up to 7 subjects');
      return;
    }

    const newSubject: Subject = {
      name: newSubjectName.trim(),
      color: selectedColor,
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    saveData(updatedSubjects, timetable);
    setNewSubjectName('');
    setShowAddSubject(false);
  };

  const deleteSubject = (index: number) => {
    Alert.alert(
      'Delete Subject',
      'Are you sure you want to delete this subject?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const subjectName = subjects[index].name;
            const updatedSubjects = subjects.filter((_, i) => i !== index);
            const updatedTimetable = { ...timetable };
            
            // Remove subject from timetable
            Object.keys(updatedTimetable).forEach(day => {
              updatedTimetable[day] = updatedTimetable[day].filter(s => s !== subjectName);
              if (updatedTimetable[day].length === 0) {
                delete updatedTimetable[day];
              }
            });

            setSubjects(updatedSubjects);
            setTimetable(updatedTimetable);
            saveData(updatedSubjects, updatedTimetable);
          },
        },
      ]
    );
  };

  const assignSubjectToDay = (day: string, subjectName: string) => {
    const currentSubjects = timetable[day] || [];
    
    // Check if subject already assigned to this day
    if (currentSubjects.includes(subjectName)) {
      Alert.alert('Already Added', 'This subject is already scheduled for this day');
      return;
    }

    const updatedTimetable = { 
      ...timetable, 
      [day]: [...currentSubjects, subjectName] 
    };
    setTimetable(updatedTimetable);
    saveData(subjects, updatedTimetable);
  };

  const removeSubjectFromDay = (day: string, subjectName: string) => {
    const currentSubjects = timetable[day] || [];
    
    // Check minimum of 2 subjects
    if (currentSubjects.length <= 2) {
      Alert.alert('Minimum Required', 'Each day must have at least 2 subjects. Add another subject before removing this one.');
      return;
    }

    const updatedSubjects = currentSubjects.filter(s => s !== subjectName);
    const updatedTimetable = { ...timetable };
    
    if (updatedSubjects.length === 0) {
      delete updatedTimetable[day];
    } else {
      updatedTimetable[day] = updatedSubjects;
    }
    
    setTimetable(updatedTimetable);
    saveData(subjects, updatedTimetable);
  };

  const clearDay = (day: string) => {
    Alert.alert(
      'Clear Day',
      'Remove all subjects from this day?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const updatedTimetable = { ...timetable };
            delete updatedTimetable[day];
            setTimetable(updatedTimetable);
            saveData(subjects, updatedTimetable);
          },
        },
      ]
    );
  };

  const getSubjectColor = (subjectName: string) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.color || '#FFB6C1';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>📚 Study Timetable</Text>

      {/* Today's Subject */}
      <View style={[styles.todayCard, { backgroundColor: (timetable[DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]]?.length || 0) > 0 ? '#B8D8F0' : '#E0E0E0' }]}>
        <Text style={styles.todayLabel}>Today's Subjects</Text>
        <Text style={styles.todaySubject}>{todaySubject}</Text>
      </View>

      {/* Subjects List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Subjects ({subjects.length}/7)</Text>
          {subjects.length < 7 && (
            <TouchableOpacity onPress={() => setShowAddSubject(true)}>
              <Ionicons name="add-circle" size={28} color="#4CAF50" />
            </TouchableOpacity>
          )}
        </View>

        {subjects.length === 0 ? (
          <Text style={styles.emptyText}>No subjects added yet. Tap + to add one!</Text>
        ) : (
          subjects.map((subject, index) => (
            <View key={index} style={[styles.subjectCard, { borderLeftColor: subject.color, borderLeftWidth: 5 }]}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <TouchableOpacity onPress={() => deleteSubject(index)}>
                <Ionicons name="trash" size={20} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Weekly Timetable */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Schedule (Min 2 subjects/day)</Text>
        {DAYS.map(day => {
          const daySubjects = timetable[day] || [];
          return (
            <View key={day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{day}</Text>
                {daySubjects.length > 0 && (
                  <TouchableOpacity onPress={() => clearDay(day)}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {daySubjects.length > 0 ? (
                <View style={styles.assignedSubjectsContainer}>
                  {daySubjects.map((subjectName, index) => (
                    <View key={index} style={styles.assignedSubject}>
                      <View style={[styles.colorDot, { backgroundColor: getSubjectColor(subjectName) }]} />
                      <Text style={styles.assignedSubjectText}>{subjectName}</Text>
                      <TouchableOpacity onPress={() => removeSubjectFromDay(day, subjectName)}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noSubjectsScheduled}>No subjects scheduled</Text>
              )}

              {/* Add more subjects */}
              <View style={styles.subjectPicker}>
                {subjects
                  .filter(s => !daySubjects.includes(s.name))
                  .map((subject, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.subjectOption, { backgroundColor: subject.color }]}
                      onPress={() => assignSubjectToDay(day, subject.name)}
                    >
                      <Text style={styles.subjectOptionText}>+ {subject.name.substring(0, 3)}</Text>
                    </TouchableOpacity>
                  ))}
                {subjects.length === 0 && (
                  <Text style={styles.noSubjectsText}>Add subjects first</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Add Subject Modal */}
      <Modal visible={showAddSubject} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Subject</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Subject name (e.g., Mathematics)"
              value={newSubjectName}
              onChangeText={setNewSubjectName}
              maxLength={30}
            />

            <Text style={styles.colorLabel}>Choose Color:</Text>
            <View style={styles.colorPicker}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddSubject(false);
                  setNewSubjectName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addSubject}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  todayCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  todayLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  todaySubject: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  subjectCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dayCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearText: {
    fontSize: 13,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  assignedSubjectsContainer: {
    marginBottom: 10,
  },
  assignedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  assignedSubjectText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  noSubjectsScheduled: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  subjectPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    minWidth: 50,
    alignItems: 'center',
  },
  subjectOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  noSubjectsText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  colorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 3,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
