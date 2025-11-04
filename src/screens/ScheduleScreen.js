import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import db from '../database/database';
import { parseICSFile, importSchedule } from '../utils/icsParser';
import { Colors, Spacing, Typography, Components, Container } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState({});
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClass, setNewClass] = useState({
    course_name: '',
    start_time: '',
    end_time: '',
    location: '',
    instructor: '',
    selected_day: new Date().getDay()
  });
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = () => {
    try {
      const result = db.getAllSync(
        `SELECT * FROM schedule ORDER BY day_of_week, start_time`
      );

      const scheduleData = {};
      for (let i = 0; i < 7; i++) {
        scheduleData[i] = [];
      }

      result.forEach(item => {
        scheduleData[item.day_of_week].push(item);
      });

      setSchedule(scheduleData);
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const handleImportICS = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/calendar',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const scheduleItems = await parseICSFile(result.assets[0].uri);
      await importSchedule(scheduleItems);
      loadSchedule();
      Alert.alert('Success', 'Schedule imported successfully!');
    } catch (err) {
      console.error('Import error:', err);
      Alert.alert('Error', 'Failed to import schedule');
    }
  };

  const handleAddEvent = () => {
    if (!newClass.course_name || !newClass.start_time || !newClass.end_time) {
      Alert.alert('Error', 'Please fill in class name, start time, and end time');
      return;
    }

    try {
      db.runSync(
        `INSERT INTO schedule (course_code, course_name, location, day_of_week, start_time, end_time, instructor)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          'COURSE',
          newClass.course_name,
          newClass.location || 'TBA',
          newClass.selected_day,
          newClass.start_time,
          newClass.end_time,
          newClass.instructor || null
        ]
      );

      Alert.alert('Success', 'Class added successfully');
      setShowAddForm(false);
      setNewClass({
        course_name: '',
        start_time: '',
        end_time: '',
        location: '',
        instructor: '',
        selected_day: new Date().getDay()
      });
      loadSchedule();
    } catch (error) {
      console.error('Error adding class:', error);
      Alert.alert('Error', 'Failed to add class');
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';

    // Check if it's in simple time format (HH:MM or H:MM)
    const simpleTimeRegex = /^(\d{1,2}):(\d{2})$/;
    const match = timeStr.match(simpleTimeRegex);

    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      let ampm;
      let displayHours;

      // Heuristic for university schedules:
      // 8-11 are probably AM (morning classes)
      // 12-6 are probably PM (afternoon classes)
      if (hours >= 8 && hours <= 11) {
        ampm = 'AM';
        displayHours = hours;
      } else if (hours === 12 || (hours >= 1 && hours <= 6)) {
        ampm = 'PM';
        displayHours = hours;
      } else if (hours >= 13 && hours <= 18) {
        // Convert 13-18 to 1-6 PM (24-hour format support)
        ampm = 'PM';
        displayHours = hours - 12;
      } else {
        // Default 24-hour conversion for other times (7 AM, 7+ PM, etc)
        ampm = hours >= 12 ? 'PM' : 'AM';
        displayHours = hours % 12 || 12;
      }

      return `${displayHours}:${minutes} ${ampm}`;
    }

    // Try to parse as a full datetime
    try {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (e) {
      // Fall through to return original string
    }

    return timeStr;
  };

  if (showAddForm) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Add Class</Text>
            <TouchableOpacity onPress={() => setShowAddForm(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.formLabel}>Select Day *</Text>
            <View style={styles.daySelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {days.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.daySelectButton,
                      newClass.selected_day === index && styles.daySelectButtonActive
                    ]}
                    onPress={() => setNewClass({ ...newClass, selected_day: index })}
                  >
                    <Text style={[
                      styles.daySelectButtonText,
                      newClass.selected_day === index && styles.daySelectButtonTextActive
                    ]}>
                      {dayAbbr[index]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Class Name *"
              value={newClass.course_name}
              onChangeText={(text) => setNewClass({ ...newClass, course_name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Start Time (e.g., 09:00) *"
              value={newClass.start_time}
              onChangeText={(text) => setNewClass({ ...newClass, start_time: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="End Time (e.g., 10:30) *"
              value={newClass.end_time}
              onChangeText={(text) => setNewClass({ ...newClass, end_time: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Location (e.g., Room 101)"
              value={newClass.location}
              onChangeText={(text) => setNewClass({ ...newClass, location: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Instructor Name"
              value={newClass.instructor}
              onChangeText={(text) => setNewClass({ ...newClass, instructor: text })}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddEvent}>
              <Text style={styles.submitButtonText}>Add Class</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Schedule</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.importButton} onPress={handleImportICS}>
              <Text style={styles.importButtonText}>Import .ics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

      <View style={styles.daySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dayAbbr.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[
                styles.dayButtonText,
                selectedDay === index && styles.dayButtonTextActive
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scheduleList} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dayTitle}>{days[selectedDay]}</Text>

        {(!schedule[selectedDay] || schedule[selectedDay].length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No classes scheduled</Text>
            <TouchableOpacity style={styles.addClassButton} onPress={() => setShowAddForm(true)}>
              <Text style={styles.addClassButtonText}>Add a class</Text>
            </TouchableOpacity>
          </View>
        ) : (
          schedule[selectedDay].map((item) => (
            <View key={item.id} style={styles.classCard}>
              <View style={[styles.classIndicator, { backgroundColor: item.color || '#3B82F6' }]} />
              <View style={styles.classContent}>
                <Text style={styles.classTime}>
                  {formatTime(item.start_time)} - {formatTime(item.end_time)}
                </Text>
                <Text style={styles.className}>{item.course_name}</Text>
                <Text style={styles.classLocation}>📍 {item.location}</Text>
                {item.instructor && (
                  <Text style={styles.classInstructor}>👤 {item.instructor}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface, // DESIGN.md: Gray-50
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance, // DESIGN.md: 80px clearance for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md, // DESIGN.md: 16px
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: Colors.light.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  importButton: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: Components.button.borderRadius, // DESIGN.md: 6px
  },
  importButtonText: {
    color: 'white',
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: Colors.light.success, // DESIGN.md: Green
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  daySelector: {
    backgroundColor: Colors.light.background,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dayButton: {
    paddingHorizontal: Spacing.lg, // DESIGN.md: 20px
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  dayButtonActive: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo
  },
  dayButtonText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: 'white',
  },
  scheduleList: {
    flex: 1,
    padding: Spacing.md,
  },
  dayTitle: {
    fontSize: Typography.h1.fontSize, // DESIGN.md: 24px
    fontWeight: Typography.h1.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: Components.card.borderRadius, // DESIGN.md: 8px
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  classIndicator: {
    width: 4, // DESIGN.md: Duration bar 2px (using 4px for visibility)
  },
  classContent: {
    flex: 1,
    padding: Spacing.md, // DESIGN.md: 16px
  },
  classTime: {
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  className: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  classLocation: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  classInstructor: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },
  addClassButton: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Components.button.borderRadius, // DESIGN.md: 6px
  },
  addClassButtonText: {
    color: 'white',
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    fontWeight: '600',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  formTitle: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: Colors.light.text,
  },
  cancelText: {
    color: Colors.light.error, // DESIGN.md: Red
    fontSize: Typography.body.fontSize,
  },
  form: {
    padding: Spacing.md,
  },
  formLabel: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 10,
  },
  daySelectButton: {
    paddingHorizontal: Spacing.lg, // DESIGN.md: 20px
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  daySelectButtonActive: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo
    borderColor: Colors.light.primary,
  },
  daySelectButtonText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  daySelectButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Components.input.borderRadius, // DESIGN.md: 6px
    paddingHorizontal: Components.input.paddingHorizontal, // DESIGN.md: 12px
    paddingVertical: 12,
    marginBottom: Spacing.md,
    fontSize: Components.input.fontSize, // DESIGN.md: 16px (prevents zoom on iOS)
  },
  submitButton: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo
    paddingVertical: 15,
    borderRadius: Components.button.borderRadius, // DESIGN.md: 6px
    alignItems: 'center',
    height: Components.button.height, // DESIGN.md: 48px
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  submitButtonText: {
    color: 'white',
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    fontWeight: '600',
  },
});

export default ScheduleScreen;
