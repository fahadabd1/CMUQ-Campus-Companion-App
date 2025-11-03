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
import * as DocumentPicker from 'expo-document-picker';
import db from '../database/database';
import { parseICSFile, importSchedule } from '../utils/icsParser';

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState({});
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

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

      <ScrollView style={styles.scheduleList}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  importButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  importButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#10B981',
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
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  dayButtonActive: {
    backgroundColor: '#3B82F6',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: 'white',
  },
  scheduleList: {
    flex: 1,
    padding: 15,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  classIndicator: {
    width: 4,
  },
  classContent: {
    flex: 1,
    padding: 15,
  },
  classTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  classLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  classInstructor: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  addClassButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addClassButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ScheduleScreen;
