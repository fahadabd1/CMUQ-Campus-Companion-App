import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
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
    Alert.prompt(
      'Add Class',
      'Enter class name',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (text) => {
            try {
              db.runSync(
                `INSERT INTO schedule (course_code, course_name, location, day_of_week, start_time, end_time)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                ['COURSE', text || 'New Class', 'Room 101', selectedDay, '09:00', '10:00']
              );
              loadSchedule();
            } catch (error) {
              console.error('Error adding class:', error);
              Alert.alert('Error', 'Failed to add class');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Schedule</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.importButton} onPress={handleImportICS}>
              <Text style={styles.importButtonText}>Import .ics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
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
            <TouchableOpacity style={styles.addClassButton} onPress={handleAddEvent}>
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
});

export default ScheduleScreen;
