import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image
} from 'react-native';
import db from '../database/database';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTodayEvents();
    loadUpcomingEvents();
  }, []);

  const loadTodayEvents = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = db.getAllSync(
        `SELECT * FROM events
         WHERE date(start_time) = date(?)
         ORDER BY start_time ASC`,
        [today]
      );
      setTodayEvents(result);
    } catch (error) {
      console.error('Error loading today events:', error);
    }
  };

  const loadUpcomingEvents = () => {
    try {
      const result = db.getAllSync(
        `SELECT * FROM events
         WHERE date(start_time) > date('now')
         ORDER BY start_time ASC
         LIMIT 5`
      );
      setUpcomingEvents(result);
    } catch (error) {
      console.error('Error loading upcoming events:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTodayEvents();
    loadUpcomingEvents();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>University Companion</Text>
        <Text style={styles.subtitle}>Welcome back! Here's what's happening today</Text>
      </View>

      <TouchableOpacity
        style={styles.mapCard}
        onPress={() => router.push('/map')}
      >
        <View style={styles.mapPreviewPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Campus Map</Text>
        </View>
        <Text style={styles.mapText}>View Full Map</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Events</Text>
        <Text style={styles.sectionSubtitle}>Today</Text>

        {todayEvents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No events scheduled for today</Text>
          </View>
        ) : (
          todayEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => {}}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                  <Text style={styles.categoryText}>{event.category}</Text>
                </View>
              </View>
              <Text style={styles.eventTime}>
                {new Date(event.start_time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={styles.eventLocation}>📍 {event.location}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tomorrow</Text>
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => {}}
        >
          <Text style={styles.viewMoreText}>View All Events →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    'Academic': '#3B82F6',
    'Student Life': '#10B981',
    'Sports': '#F59E0B',
    'Other': '#6B7280'
  };
  return colors[category] || colors['Other'];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
  mapCard: {
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPreviewPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  mapText: {
    padding: 12,
    textAlign: 'center',
    color: '#3B82F6',
    fontWeight: '600',
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
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
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
    fontSize: 12,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  viewMoreButton: {
    marginTop: 10,
  },
  viewMoreText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
