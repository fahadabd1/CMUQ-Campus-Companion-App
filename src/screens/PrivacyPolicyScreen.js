import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Container } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PrivacyPolicyScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
          <View style={{width: 50}} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            Campus Companion collects and stores information locally on your device to provide
            schedule management, lost and found tracking, and campus navigation features. This
            includes class schedules, event information, and items you report in the lost and found system.
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            All data is stored locally on your device and is used solely to provide the app's
            functionality. We do not transmit your personal information to external servers or
            third parties.
          </Text>

          <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
          <Text style={styles.paragraph}>
            Your information is stored in a local database on your device. The security of this
            data depends on your device's security settings. We recommend using device encryption
            and lock screen protection.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Sharing</Text>
          <Text style={styles.paragraph}>
            We do not share, sell, or distribute your personal information to third parties.
            Information you post in the Lost & Found section may be visible to other users of
            the app within your institution.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to access, modify, or delete your data at any time through the
            app's settings. You can clear all data using the "Clear All Data" option in Settings.
          </Text>

          <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy in the app.
          </Text>

          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about this Privacy Policy, please contact us through the
            "Contact Support" option in Settings.
          </Text>
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
    backgroundColor: Colors.light.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backText: {
    color: Colors.light.primary,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance,
  },
  lastUpdated: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  paragraph: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
});

export default PrivacyPolicyScreen;
