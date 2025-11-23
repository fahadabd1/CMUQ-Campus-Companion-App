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
import { useColorScheme } from '@/hooks/use-color-scheme';
import { eventsAPI, syncEventsToLocal } from '../services/api';

const AllEventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadFavorites();
    loadEvents();
  }, []);

  // Load favorite event IDs from local database
  const loadFavorites = () => {
    try {
      const result = db.getAllSync('SELECT event_id FROM favorite_events');
      const favoriteIds = new Set(result.map(row => row.event_id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Toggle favorite status for an event
  const toggleFavorite = (eventId) => {
    try {
      if (favorites.has(eventId)) {
        // Remove from favorites
        db.runSync('DELETE FROM favorite_events WHERE event_id = ?', [eventId]);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        // Add to favorites
        db.runSync('INSERT INTO favorite_events (event_id) VALUES (?)', [eventId]);
        setFavorites(prev => new Set([...prev, eventId]));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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
      loadFavorites();
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
        link: event.link || '',
      },
    });
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Academic': colors.info,
      'Student Life': colors.success,
      'Sports': colors.warning,
      'Other': colors.textSecondary
    };
    return categoryColors[category] || categoryColors['Other'];
  };

  // Filter events based on active tab
  const filteredEvents = activeTab === 'favorites'
    ? events.filter(event => favorites.has(event.id))
    : events;

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Events</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
            Starred ({favorites.size})
          </Text>
        </TouchableOpacity>
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
            {filteredEvents.length} {activeTab === 'favorites' ? 'starred' : 'upcoming'} event{filteredEvents.length !== 1 ? 's' : ''}
            {!isOnline && ' (Offline Mode)'}
          </Text>

          {filteredEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {activeTab === 'favorites'
                  ? 'No starred events yet. Tap the star icon to save events!'
                  : 'No upcoming events'}
              </Text>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.headerActions}>
                    <TouchableOpacity
                      style={styles.starButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(event.id);
                      }}
                    >
                      <Text style={styles.starIcon}>
                        {favorites.has(event.id) ? '★' : '☆'}
                      </Text>
                    </TouchableOpacity>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                      <Text style={styles.categoryText}>{event.category}</Text>
                    </View>
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

const createStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance,
  },
  content: {
    padding: Spacing.lg,
  },
  subtitle: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  eventCard: {
    backgroundColor: colors.background,
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
    color: colors.text,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    fontSize: 22,
    color: '#F59E0B', // Amber/gold color for stars
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: colors.background,
    padding: Spacing.lg,
    borderRadius: Components.card.borderRadius,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: Typography.small.fontSize,
    textAlign: 'center',
  },
});

export default AllEventsScreen;
