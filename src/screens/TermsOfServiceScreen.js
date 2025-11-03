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

const TermsOfServiceScreen = () => {
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
          <Text style={styles.title}>Terms of Service</Text>
          <View style={{width: 50}} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using Campus Companion, you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to these terms, please
            do not use this application.
          </Text>

          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to use Campus Companion for personal, non-commercial purposes.
            This license shall automatically terminate if you violate any of these restrictions
            and may be terminated by the developers at any time.
          </Text>

          <Text style={styles.sectionTitle}>3. Acceptable Use</Text>
          <Text style={styles.paragraph}>
            You agree to use the app only for lawful purposes. You must not use Campus Companion
            in any way that causes damage to the app, or impairs the availability or accessibility
            of the app, or in any way which is unlawful, illegal, fraudulent or harmful.
          </Text>

          <Text style={styles.sectionTitle}>4. Lost & Found Disclaimers</Text>
          <Text style={styles.paragraph}>
            Items posted in the Lost & Found section are user-generated content. We do not verify
            the accuracy of postings and are not responsible for the return or condition of any
            items. Users should exercise caution when meeting to exchange items.
          </Text>

          <Text style={styles.sectionTitle}>5. Schedule Information</Text>
          <Text style={styles.paragraph}>
            While we strive to provide accurate schedule management tools, you are responsible
            for verifying your class schedules and event information. We are not liable for
            any missed classes or events due to incorrect information in the app.
          </Text>

          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            Campus Companion is provided "as is" without warranty of any kind. The developers
            shall not be liable for any damages arising out of the use or inability to use
            the app.
          </Text>

          <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these terms at any time. We will notify users of
            any material changes. Your continued use of the app after such modifications
            constitutes acceptance of the updated terms.
          </Text>

          <Text style={styles.sectionTitle}>8. Governing Law</Text>
          <Text style={styles.paragraph}>
            These terms shall be governed by and construed in accordance with applicable laws,
            and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </Text>

          <Text style={styles.sectionTitle}>9. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Service, please contact us through
            the "Contact Support" option in Settings.
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

export default TermsOfServiceScreen;
