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
import { useColorScheme } from '@/hooks/use-color-scheme';

const SettingsScreen = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showBugReportForm, setShowBugReportForm] = useState(false);
  const [bugReport, setBugReport] = useState({
    title: '',
    description: '',
    steps: ''
  });
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
              value={bugReport.title}
              onChangeText={(text) => setBugReport({ ...bugReport, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Bug Description *"
              value={bugReport.description}
              onChangeText={(text) => setBugReport({ ...bugReport, description: text })}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Steps to Reproduce (Optional)"
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
              Enable dark theme (coming soon)
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={darkMode ? '#3B82F6' : '#F3F4F6'}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface, // DESIGN.md: Gray-50
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance, // DESIGN.md: 80px clearance for bottom nav
  },
  header: {
    backgroundColor: Colors.light.background,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: Typography.h1.fontSize, // DESIGN.md: 24px
    fontWeight: Typography.h1.fontWeight,
    color: Colors.light.text,
  },
  section: {
    marginTop: Spacing.lg, // DESIGN.md: 20px
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px uppercase
    fontWeight: '600',
    color: Colors.light.textSecondary, // DESIGN.md: Gray-600
    marginBottom: 10,
    marginTop: Spacing.md, // DESIGN.md: 16px top margin
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: Spacing.md,
    minHeight: TouchTargets.recommended, // DESIGN.md: 48px minimum height
    borderRadius: Components.card.borderRadius,
    marginBottom: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: Spacing.md,
    minHeight: TouchTargets.recommended, // DESIGN.md: 48px minimum height
    borderRadius: Components.card.borderRadius,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    color: Colors.light.text,
    fontWeight: '500',
  },
  actionButtonIcon: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.textSecondary,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  dangerText: {
    color: Colors.light.error, // DESIGN.md: Red
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: Spacing.md,
    minHeight: TouchTargets.recommended, // DESIGN.md: 48px minimum height
    borderRadius: Components.card.borderRadius,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.light.text,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px
    color: Colors.light.textSecondary,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  formTitle: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: Colors.light.text,
  },
  cancelText: {
    color: Colors.light.error, // DESIGN.md: Red
    fontSize: Typography.body.fontSize,
  },
  form: {
    padding: Spacing.md,
  },
  formDescription: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: Typography.small.lineHeight,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Components.input.borderRadius, // DESIGN.md: 6px
    paddingHorizontal: Components.input.paddingHorizontal, // DESIGN.md: 12px
    paddingVertical: 12,
    marginBottom: Spacing.md,
    fontSize: Components.input.fontSize, // DESIGN.md: 16px (prevents zoom on iOS)
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo
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

export default SettingsScreen;
