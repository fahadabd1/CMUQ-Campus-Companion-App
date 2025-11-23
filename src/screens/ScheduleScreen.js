import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  TextInput,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import db from '../database/database';
import { parseICSFile, importSchedule } from '../utils/icsParser';
import { syncEventsToLocal } from '../services/api';
import { Colors, Spacing, Typography, Components, Container } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState({});
  const [starredEvents, setStarredEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
  const router = useRouter();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get dates for the current week
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  useEffect(() => {
    loadSchedule();
    loadStarredEvents();
  }, []);

  // Reload starred events when screen gains focus (e.g., after starring an event)
  useFocusEffect(
    useCallback(() => {
      loadStarredEvents();
    }, [])
  );

  // Update selected date when day changes
  useEffect(() => {
    setSelectedDate(weekDates[selectedDay]);
  }, [selectedDay]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Sync events from API to local database
      await syncEventsToLocal(db);
    } catch (error) {
      console.log('Could not sync events from API');
    }
    loadSchedule();
    loadStarredEvents();
    setRefreshing(false);
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

  // Load starred events from favorite_events joined with events
  const loadStarredEvents = () => {
    try {
      const result = db.getAllSync(
        `SELECT e.* FROM events e
         INNER JOIN favorite_events f ON e.id = f.event_id
         ORDER BY e.start_time ASC`
      );
      setStarredEvents(result);
    } catch (error) {
      console.error('Error loading starred events:', error);
    }
  };

  // Get starred events for the selected day of week (same logic as classes)
  const getEventsForDay = (dayOfWeek) => {
    return starredEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.getDay() === dayOfWeek;
    });
  };

  const eventsForSelectedDay = getEventsForDay(selectedDay);

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

  const handleEventPress = (event) => {
    router.push({
      pathname: '/event-details',
      params: {
        id: event.id,
        title: event.title,
        description: event.description || '',
        category: event.category,
        location: event.location,
        start_time: event.start_time,
        end_time: event.end_time || '',
        link: event.link || '',
      },
    });
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

  const formatDateHeader = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const styles = createStyles(colors);

  // Check if there are any items (classes or events) for the selected day
  const hasClasses = schedule[selectedDay] && schedule[selectedDay].length > 0;
  const hasEvents = eventsForSelectedDay.length > 0;
  const hasItems = hasClasses || hasEvents;

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
              placeholderTextColor={colors.textSecondary}
              value={newClass.course_name}
              onChangeText={(text) => setNewClass({ ...newClass, course_name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Start Time (e.g., 09:00) *"
              placeholderTextColor={colors.textSecondary}
              value={newClass.start_time}
              onChangeText={(text) => setNewClass({ ...newClass, start_time: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="End Time (e.g., 10:30) *"
              placeholderTextColor={colors.textSecondary}
              value={newClass.end_time}
              onChangeText={(text) => setNewClass({ ...newClass, end_time: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Location (e.g., Room 101)"
              placeholderTextColor={colors.textSecondary}
              value={newClass.location}
              onChangeText={(text) => setNewClass({ ...newClass, location: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Instructor Name"
              placeholderTextColor={colors.textSecondary}
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
                styles.dayButtonDate,
                selectedDay === index && styles.dayButtonDateActive
              ]}>
                {weekDates[index]?.getDate()}
              </Text>
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

      <ScrollView
        style={styles.scheduleList}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.dayTitle}>
          {days[selectedDay]}, {formatDateHeader(selectedDate)}
        </Text>

        {!hasItems ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No classes or events scheduled</Text>
            <Text style={styles.emptySubtext}>Star events to see them here!</Text>
            <TouchableOpacity style={styles.addClassButton} onPress={() => setShowAddForm(true)}>
              <Text style={styles.addClassButtonText}>Add a class</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Starred Events Section */}
            {hasEvents && (
              <View style={styles.eventsSection}>
                <Text style={styles.sectionTitle}>Starred Events</Text>
                {eventsForSelectedDay.map((event) => (
                  <TouchableOpacity
                    key={`event-${event.id}`}
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event)}
                  >
                    <View style={styles.eventIndicator} />
                    <View style={styles.classContent}>
                      <View style={styles.eventHeader}>
                        <Text style={styles.classTime}>
                          {formatTime(event.start_time)}
                          {event.end_time && ` - ${formatTime(event.end_time)}`}
                        </Text>
                        <Text style={styles.starBadge}>★</Text>
                      </View>
                      <Text style={styles.className}>{event.title}</Text>
                      {event.location && (
                        <Text style={styles.classLocation}>📍 {event.location}</Text>
                      )}
                      {event.category && (
                        <Text style={styles.eventCategory}>{event.category}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Classes Section */}
            {hasClasses && (
              <View style={styles.classesSection}>
                {hasEvents && <Text style={styles.sectionTitle}>Classes</Text>}
                {schedule[selectedDay].map((item) => (
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
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface, // DESIGN.md: Gray-50
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance, // DESIGN.md: 80px clearance for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md, // DESIGN.md: 16px
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  importButton: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
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
    backgroundColor: colors.success, // DESIGN.md: Green
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
    backgroundColor: colors.background,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 50,
  },
  dayButtonActive: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
  },
  dayButtonDate: {
    fontSize: Typography.body.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  dayButtonDateActive: {
    color: 'white',
  },
  dayButtonText: {
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px
    color: colors.textSecondary,
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
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: colors.text,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventsSection: {
    marginBottom: Spacing.lg,
  },
  classesSection: {
    marginBottom: Spacing.lg,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: Components.card.borderRadius, // DESIGN.md: 8px
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: Components.card.borderRadius,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F59E0B', // Gold border for starred events
  },
  classIndicator: {
    width: 4, // DESIGN.md: Duration bar 2px (using 4px for visibility)
  },
  eventIndicator: {
    width: 4,
    backgroundColor: '#F59E0B', // Gold for starred events
  },
  classContent: {
    flex: 1,
    padding: Spacing.md, // DESIGN.md: 16px
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starBadge: {
    fontSize: 16,
    color: '#F59E0B',
  },
  classTime: {
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px
    color: colors.textSecondary,
    marginBottom: 4,
  },
  className: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  classLocation: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: colors.textSecondary,
    marginBottom: 2,
  },
  classInstructor: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: colors.textSecondary,
  },
  eventCategory: {
    fontSize: Typography.caption.fontSize,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    color: colors.textSecondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  addClassButton: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
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
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  formTitle: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: colors.text,
  },
  cancelText: {
    color: colors.error, // DESIGN.md: Red
    fontSize: Typography.body.fontSize,
  },
  form: {
    padding: Spacing.md,
  },
  formLabel: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  daySelectButton: {
    paddingHorizontal: Spacing.lg, // DESIGN.md: 20px
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  daySelectButtonActive: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
    borderColor: colors.primary,
  },
  daySelectButtonText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: colors.textSecondary,
    fontWeight: '500',
  },
  daySelectButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Components.input.borderRadius, // DESIGN.md: 6px
    paddingHorizontal: Components.input.paddingHorizontal, // DESIGN.md: 12px
    paddingVertical: 12,
    marginBottom: Spacing.md,
    fontSize: Components.input.fontSize, // DESIGN.md: 16px (prevents zoom on iOS)
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
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
