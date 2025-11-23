import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import db from '../database/database';
import { Colors, Spacing, Typography, Components } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const EventDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Parse the event data from params
  const event = {
    id: parseInt(params.id),
    title: params.title,
    description: params.description,
    category: params.category,
    location: params.location,
    start_time: params.start_time,
    end_time: params.end_time,
    link: params.link,
  };

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = () => {
    try {
      const result = db.getAllSync(
        'SELECT * FROM favorite_events WHERE event_id = ?',
        [event.id]
      );
      setIsFavorite(result.length > 0);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = () => {
    try {
      if (isFavorite) {
        db.runSync('DELETE FROM favorite_events WHERE event_id = ?', [event.id]);
        setIsFavorite(false);
      } else {
        db.runSync('INSERT INTO favorite_events (event_id) VALUES (?)', [event.id]);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLinkPress = async () => {
    if (event.link) {
      try {
        const supported = await Linking.canOpenURL(event.link);
        if (supported) {
          await Linking.openURL(event.link);
        } else {
          Alert.alert('Error', 'Cannot open this link');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open link');
      }
    }
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

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.starButton}>
          <Text style={styles.starIcon}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
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
            <Text style={styles.sectionLabel}>Date & Time</Text>
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
            <Text style={styles.sectionLabel}>Location</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{event.location || 'TBD'}</Text>
            </View>
          </View>

          {/* Description Section */}
          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Description</Text>
              <View style={styles.infoCard}>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            </View>
          )}

          {/* Link Section */}
          {event.link && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Link</Text>
              <TouchableOpacity style={styles.linkButton} onPress={handleLinkPress}>
                <Text style={styles.linkText}>{event.link}</Text>
                <Text style={styles.linkArrow}>→</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
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
    flex: 2,
    textAlign: 'center',
  },
  starButton: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 4,
  },
  starIcon: {
    fontSize: 26,
    color: '#F59E0B', // Amber/gold color for stars
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
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
    color: colors.text,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.background,
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
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
  },
  descriptionText: {
    fontSize: Typography.body.fontSize,
    color: colors.text,
    lineHeight: 24,
  },
  linkButton: {
    backgroundColor: colors.background,
    padding: Spacing.lg,
    borderRadius: Components.card.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  linkText: {
    fontSize: Typography.body.fontSize,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  linkArrow: {
    fontSize: Typography.body.fontSize,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});

export default EventDetailsScreen;
