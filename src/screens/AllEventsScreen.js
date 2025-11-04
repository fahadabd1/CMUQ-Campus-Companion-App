import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import db from '../database/database';
import { Colors, Spacing, Typography, Components, Container } from '../../constants/theme';
import { eventsAPI, syncEventsToLocal } from '../services/api';

const AllEventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      await loadEventsFromAPI();
    } catch (error) {
      console.log('API not available, loading from local database');
      setIsOnline(false);
      loadEventsFromLocal();
    }
  };

  const loadEventsFromAPI = async () => {
    try {
      const data = await eventsAPI.getUpcoming(100);
      setEvents(data);
      await syncEventsToLocal(db);
      setIsOnline(true);
    } catch (error) {
      console.error('Error loading events from API:', error);
      throw error;
    }
  };

  const loadEventsFromLocal = () => {
    try {
      const result = db.getAllSync(
        `SELECT * FROM events
         WHERE datetime(start_time) >= datetime('now')
         ORDER BY start_time ASC`
      );
      setEvents(result);
    } catch (error) {
      console.error('Error loading events from local database:', error);
      Alert.alert('Error', 'Failed to load events');
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadEventsFromAPI();
    } catch (error) {
      loadEventsFromLocal();
    }
    setRefreshing(false);
  }, []);

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
      },
    });
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Academic': Colors.light.info,
      'Student Life': Colors.light.success,
      'Sports': Colors.light.warning,
      'Other': Colors.light.textSecondary
    };
    return categoryColors[category] || categoryColors['Other'];
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Events</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {events.length} upcoming event{events.length !== 1 ? 's' : ''}
            {!isOnline && ' (Offline Mode)'}
          </Text>

          {events.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No upcoming events</Text>
            </View>
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                    <Text style={styles.categoryText}>{event.category}</Text>
                  </View>
                </View>
                <Text style={styles.eventTime}>
                  {new Date(event.start_time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })} at {new Date(event.start_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                <Text style={styles.eventLocation}>📍 {event.location}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  header: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: Spacing.md,
  },
  backButtonText: {
    color: 'white',
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance,
  },
  content: {
    padding: Spacing.lg,
  },
  subtitle: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },
  eventCard: {
    backgroundColor: Colors.light.background,
    padding: Components.card.padding,
    borderRadius: Components.card.borderRadius,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
  },
  emptyCard: {
    backgroundColor: Colors.light.background,
    padding: Spacing.lg,
    borderRadius: Components.card.borderRadius,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: Typography.small.fontSize,
  },
});

export default AllEventsScreen;
