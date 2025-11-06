import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  TextInput,
  Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import db from '../database/database';
import { Colors, Spacing, Typography, Components, TouchTargets, Container } from '../../constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

const SettingsScreen = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showBugReportForm, setShowBugReportForm] = useState(false);
  const [bugReport, setBugReport] = useState({
    title: '',
    description: '',
    steps: ''
  });
  const { colorScheme, isDark, setThemePreference } = useTheme();
  const colors = Colors[colorScheme];

  const handleDarkModeToggle = (value) => {
    setThemePreference(value ? 'dark' : 'light');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              db.execSync('DELETE FROM events');
              db.execSync('DELETE FROM schedule');
              db.execSync('DELETE FROM lost_found');
              db.execSync('DELETE FROM preferences');
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export feature coming soon');
  };

  const handleContactSupport = () => {
    const supportEmail = 'support@campuscompanion.com';
    Clipboard.setString(supportEmail);
    Alert.alert(
      'Email Copied!',
      `Support email (${supportEmail}) has been copied to your clipboard. Please paste it into your email app.`,
      [{ text: 'OK' }]
    );
  };

  const handleSubmitBugReport = () => {
    if (!bugReport.title || !bugReport.description) {
      Alert.alert('Error', 'Please fill in the bug title and description');
      return;
    }

    // In a real app, this would send the bug report to a server
    console.log('Bug Report:', bugReport);

    Alert.alert(
      'Bug Report Submitted',
      'Thank you for helping us improve Campus Companion! We will review your report.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowBugReportForm(false);
            setBugReport({ title: '', description: '', steps: '' });
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  if (showBugReportForm) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Report a Bug</Text>
            <TouchableOpacity onPress={() => setShowBugReportForm(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.formDescription}>
              Help us improve Campus Companion by reporting bugs you encounter.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Bug Title *"
              placeholderTextColor={colors.textSecondary}
              value={bugReport.title}
              onChangeText={(text) => setBugReport({ ...bugReport, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Bug Description *"
              placeholderTextColor={colors.textSecondary}
              value={bugReport.description}
              onChangeText={(text) => setBugReport({ ...bugReport, description: text })}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Steps to Reproduce (Optional)"
              placeholderTextColor={colors.textSecondary}
              value={bugReport.steps}
              onChangeText={(text) => setBugReport({ ...bugReport, steps: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitBugReport}>
              <Text style={styles.submitButtonText}>Submit Bug Report</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive notifications about events and schedule changes
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={notificationsEnabled ? '#3B82F6' : '#F3F4F6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Enable dark theme across the app
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={isDark ? '#3B82F6' : '#F3F4F6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <Text style={styles.actionButtonText}>Export My Data</Text>
          <Text style={styles.actionButtonIcon}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleClearData}
        >
          <Text style={[styles.actionButtonText, styles.dangerText]}>Clear All Data</Text>
          <Text style={[styles.actionButtonIcon, styles.dangerText]}>⚠️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>Campus Companion</Text>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/privacy-policy')}>
          <Text style={styles.actionButtonText}>Privacy Policy</Text>
          <Text style={styles.actionButtonIcon}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/terms-of-service')}>
          <Text style={styles.actionButtonText}>Terms of Service</Text>
          <Text style={styles.actionButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/help-faq')}>
          <Text style={styles.actionButtonText}>Help & FAQ</Text>
          <Text style={styles.actionButtonIcon}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
          <Text style={styles.actionButtonText}>Contact Support</Text>
          <Text style={styles.actionButtonIcon}>✉️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setShowBugReportForm(true)}>
          <Text style={styles.actionButtonText}>Report a Bug</Text>
          <Text style={styles.actionButtonIcon}>🐛</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ♥ for Students</Text>
        <Text style={styles.footerSubtext}>Sprint 4 - Functional Prototype</Text>
      </View>
      </ScrollView>
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
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance, // DESIGN.md: 80px clearance for bottom nav
  },
  header: {
    backgroundColor: colors.background,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
    color: colors.text,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    marginTop: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: Spacing.md,
    minHeight: TouchTargets.recommended,
    borderRadius: Components.card.borderRadius,
    marginBottom: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: Spacing.md,
    minHeight: TouchTargets.recommended,
    borderRadius: Components.card.borderRadius,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: Typography.body.fontSize,
    color: colors.text,
    fontWeight: '500',
  },
  actionButtonIcon: {
    fontSize: Typography.body.fontSize,
    color: colors.textSecondary,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  dangerText: {
    color: colors.error,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: Spacing.md,
    minHeight: TouchTargets.recommended,
    borderRadius: Components.card.borderRadius,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: Typography.body.fontSize,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: Typography.caption.fontSize,
    color: colors.textSecondary,
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
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: colors.text,
  },
  cancelText: {
    color: colors.error,
    fontSize: Typography.body.fontSize,
  },
  form: {
    padding: Spacing.md,
  },
  formDescription: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: Typography.small.lineHeight,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Components.input.borderRadius,
    paddingHorizontal: Components.input.paddingHorizontal,
    paddingVertical: 12,
    marginBottom: Spacing.md,
    fontSize: Components.input.fontSize,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: Components.button.borderRadius,
    alignItems: 'center',
    height: Components.button.height,
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  submitButtonText: {
    color: 'white',
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
});

export default SettingsScreen;
