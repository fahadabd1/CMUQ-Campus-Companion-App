import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Typography, Components } from '../../constants/theme';

const EventDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse the event data from params
  const event = {
    id: params.id,
    title: params.title,
    description: params.description,
    category: params.category,
    location: params.location,
    start_time: params.start_time,
    end_time: params.end_time,
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>

          {/* Event Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Date & Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📅 Date & Time</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{formatDate(event.start_time)}</Text>
              <Text style={styles.infoSubtext}>
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </Text>
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📍 Location</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{event.location || 'TBD'}</Text>
            </View>
          </View>

          {/* Description Section */}
          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>📝 Description</Text>
              <View style={styles.infoCard}>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            </View>
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
  content: {
    padding: Spacing.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  categoryText: {
    color: 'white',
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    backgroundColor: Colors.light.background,
    padding: Spacing.lg,
    borderRadius: Components.card.borderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
  },
  descriptionText: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.text,
    lineHeight: 24,
  },
});

export default EventDetailsScreen;
