import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Container, Components } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const HelpFAQScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How do I add a class to my schedule?",
      answer: "Go to the Schedule tab, tap the '+' button in the top right, and fill in your class details including the day, time, location, and instructor."
    },
    {
      question: "How do I import my schedule from a .ics file?",
      answer: "In the Schedule tab, tap 'Import .ics' button and select your calendar file. The app will automatically parse and add your classes."
    },
    {
      question: "How do I report a lost or found item?",
      answer: "Go to the Lost & Found tab, tap 'Report Item', select whether it's lost or found, fill in the details, and optionally add a photo."
    },
    {
      question: "How do I search for a room on campus?",
      answer: "Go to the Map tab, enter the room number in the search box, and tap 'Find'. The map will show you the location with a marker."
    },
    {
      question: "Can I delete a class from my schedule?",
      answer: "Currently, you can clear all data from Settings > Clear All Data. Individual class deletion will be added in a future update."
    },
    {
      question: "How do I change between different floors on the map?",
      answer: "Use the floor tabs (1st Floor, 2nd Floor, 3rd Floor) at the top of the map screen to switch between different building levels."
    },
    {
      question: "Is my data backed up?",
      answer: "All data is stored locally on your device. We recommend regularly exporting your schedule. Cloud backup will be available in future updates."
    },
    {
      question: "How do I contact someone about a lost & found item?",
      answer: "Lost & Found items display contact information provided by the person who posted them. Use that information to get in touch."
    },
    {
      question: "Can I use dark mode?",
      answer: "Dark mode is currently in development and will be available in a future update."
    },
    {
      question: "How do I clear all my data?",
      answer: "Go to Settings > Data Management > Clear All Data. Note: This action cannot be undone, so make sure to export important data first."
    }
  ];

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Help & FAQ</Text>
          <View style={{width: 50}} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.intro}>
            Find answers to common questions about Campus Companion.
          </Text>

          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleExpanded(index)}
              activeOpacity={0.7}
            >
              <View style={styles.questionRow}>
                <Text style={styles.question}>{faq.question}</Text>
                <Text style={styles.expandIcon}>
                  {expandedIndex === index ? '−' : '+'}
                </Text>
              </View>
              {expandedIndex === index && (
                <Text style={styles.answer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactText}>
              If you couldn't find an answer to your question, please contact our support team
              through Settings > Support > Contact Support.
            </Text>
          </View>
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
  intro: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },
  faqItem: {
    backgroundColor: Colors.light.background,
    borderRadius: Components.card.borderRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  question: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  expandIcon: {
    fontSize: 24,
    color: Colors.light.primary,
    fontWeight: '300',
    width: 24,
    textAlign: 'center',
  },
  answer: {
    fontSize: Typography.small.fontSize,
    lineHeight: Typography.small.lineHeight,
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  contactSection: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderRadius: Components.card.borderRadius,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  contactTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  contactText: {
    fontSize: Typography.small.fontSize,
    lineHeight: Typography.small.lineHeight,
    color: Colors.light.textSecondary,
  },
});

export default HelpFAQScreen;
