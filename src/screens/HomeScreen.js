import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import db from '../database/database';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Components, Container } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const HomeScreen = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
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
    </SafeAreaView>
  );
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.primary, // Match header color
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface, // DESIGN.md: Gray-50 (#F9FAFB)
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance, // DESIGN.md: 80px clearance for bottom nav
  },
  header: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo (#3F51B5)
    padding: Spacing.lg,
    paddingTop: Spacing.lg, // SafeAreaView handles top spacing now
  },
  welcomeText: {
    color: 'white',
    fontSize: Typography.h1.fontSize, // DESIGN.md: 24px
    fontWeight: Typography.h1.fontWeight,
  },
  subtitle: {
    color: 'white',
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    marginTop: 5,
    opacity: 0.9,
  },
  mapCard: {
    margin: Spacing.md, // DESIGN.md: 16px
    borderRadius: Components.map.borderRadius, // DESIGN.md: 8px
    overflow: 'hidden',
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPreviewPlaceholder: {
    width: '100%',
    height: Components.map.previewHeight, // DESIGN.md: 200px
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: Typography.h3.fontSize, // DESIGN.md: 18px
    color: Colors.light.textSecondary,
    fontWeight: Typography.h3.fontWeight,
  },
  mapText: {
    padding: 12,
    textAlign: 'center',
    color: Colors.light.primary, // DESIGN.md: Indigo
    fontWeight: '600',
  },
  section: {
    margin: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize, // DESIGN.md: 18px
    fontWeight: Typography.h3.fontWeight,
    color: Colors.light.text, // DESIGN.md: Gray-900
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: Colors.light.background,
    padding: Components.card.padding, // DESIGN.md: 16px
    borderRadius: Components.card.borderRadius, // DESIGN.md: 8px
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
    marginBottom: Spacing.sm,
  },
  eventTitle: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Typography.caption.fontSize, // 12px
    marginLeft: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px
    fontWeight: '600',
  },
  eventTime: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
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
  viewMoreButton: {
    marginTop: 10,
  },
  viewMoreText: {
    color: Colors.light.primary, // DESIGN.md: Indigo
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
  },
});

export default HomeScreen;
