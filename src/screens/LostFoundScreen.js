import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import db from '../database/database';
import { Colors, Spacing, Typography, Components, Container } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { lostFoundAPI, syncLostFoundToLocal, uploadAPI } from '../services/api';

const LostFoundScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [newItem, setNewItem] = useState({
    type: 'lost',
    item_name: '',
    description: '',
    location_lost: '',
    contact_info: '',
    image_path: null
  });
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const styles = createStyles(colors);

  const loadItems = async () => {
    try {
      // Try to sync from API first
      await syncFromAPI();
    } catch (error) {
      console.log('API not available, loading from local database');
      setIsOnline(false);
    }

    // Load from local database (either fresh sync or cached data)
    loadFromLocal();
  };

  const syncFromAPI = async () => {
    try {
      await syncLostFoundToLocal(db);
      setIsOnline(true);
    } catch (error) {
      console.error('Error syncing from API:', error);
      throw error;
    }
  };

  const loadFromLocal = () => {
    try {
      let query = 'SELECT * FROM lost_found WHERE status = "active"';
      const params = [];

      if (activeTab !== 'all') {
        query += ' AND type = ?';
        params.push(activeTab);
      }

      query += ' ORDER BY created_at DESC';

      const result = db.getAllSync(query, params);
      setItems(result);
    } catch (error) {
      console.error('Error loading items from local:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [activeTab]);

  const handleTakePhoto = async () => {
    Alert.alert(
      'Select Photo',
      'Choose from where you want to select an image',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission needed', 'Camera permission is required');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });
            if (!result.canceled) {
              setNewItem({ ...newItem, image_path: result.assets[0].uri });
            }
          }
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission needed', 'Media library permission is required');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });
            if (!result.canceled) {
              setNewItem({ ...newItem, image_path: result.assets[0].uri });
            }
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!newItem.item_name || !newItem.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      let imageUrl = null;

      // Upload image to Cloudinary if one is selected
      if (newItem.image_path) {
        Alert.alert('Uploading', 'Uploading image, please wait...');
        try {
          imageUrl = await uploadAPI.uploadImage(newItem.image_path);
          console.log('✓ Image uploaded:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          Alert.alert('Warning', 'Failed to upload image, but posting item without image');
        }
      }

      // Post to backend API
      const itemData = {
        type: newItem.type,
        item_name: newItem.item_name,
        description: newItem.description,
        location_lost: newItem.location_lost || '',
        contact_info: newItem.contact_info || '',
        image_url: imageUrl,
        category: 'Other' // Default category
      };

      await lostFoundAPI.create(itemData);

      Alert.alert('Success', 'Item posted successfully and shared with all users!');

      // Reset form
      setShowAddForm(false);
      setNewItem({
        type: 'lost',
        item_name: '',
        description: '',
        location_lost: '',
        contact_info: '',
        image_path: null
      });

      // Reload items from API
      await loadItems();
    } catch (error) {
      console.error('Error posting item:', error);
      Alert.alert('Error', 'Failed to post item. Please try again.');
    }
  };

  if (showAddForm) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Report Item</Text>
            <TouchableOpacity onPress={() => setShowAddForm(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        <View style={styles.form}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, newItem.type === 'lost' && styles.typeButtonActive]}
              onPress={() => setNewItem({ ...newItem, type: 'lost' })}
            >
              <Text style={[styles.typeButtonText, newItem.type === 'lost' && styles.typeButtonTextActive]}>
                Lost Item
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, newItem.type === 'found' && styles.typeButtonActive]}
              onPress={() => setNewItem({ ...newItem, type: 'found' })}
            >
              <Text style={[styles.typeButtonText, newItem.type === 'found' && styles.typeButtonTextActive]}>
                Found Item
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Item Name *"
            placeholderTextColor={colors.textSecondary}
            value={newItem.item_name}
            onChangeText={(text) => setNewItem({ ...newItem, item_name: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description *"
            placeholderTextColor={colors.textSecondary}
            value={newItem.description}
            onChangeText={(text) => setNewItem({ ...newItem, description: text })}
            multiline
            numberOfLines={4}
          />

          <TextInput
            style={styles.input}
            placeholder="Location Lost/Found"
            placeholderTextColor={colors.textSecondary}
            value={newItem.location_lost}
            onChangeText={(text) => setNewItem({ ...newItem, location_lost: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Info"
            placeholderTextColor={colors.textSecondary}
            value={newItem.contact_info}
            onChangeText={(text) => setNewItem({ ...newItem, contact_info: text })}
          />

          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
            {newItem.image_path ? (
              <Image source={{ uri: newItem.image_path }} style={styles.photoPreview} />
            ) : (
              <Text style={styles.photoButtonText}>📷 Add Photo</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Post Item</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lost & Found</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
            <Text style={styles.addButtonText}>Report Item</Text>
          </TouchableOpacity>
        </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All ({items.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lost' && styles.tabActive]}
          onPress={() => setActiveTab('lost')}
        >
          <Text style={[styles.tabText, activeTab === 'lost' && styles.tabTextActive]}>
            Lost Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'found' && styles.tabActive]}
          onPress={() => setActiveTab('found')}
        >
          <Text style={[styles.tabText, activeTab === 'found' && styles.tabTextActive]}>
            Found Items
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.itemsList}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items to display</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              {item.image_path && (
                <Image source={{ uri: item.image_path }} style={styles.itemImage} />
              )}
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.item_name}</Text>
                  <View style={[styles.typeBadge, item.type === 'lost' ? styles.lostBadge : styles.foundBadge]}>
                    <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                {item.location_lost && (
                  <Text style={styles.itemLocation}>📍 {item.location_lost}</Text>
                )}
                <Text style={styles.itemDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      </View>
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
    backgroundColor: colors.surface, // DESIGN.md: Gray-50
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance, // DESIGN.md: 80px clearance for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: Components.button.borderRadius, // DESIGN.md: 6px
  },
  addButtonText: {
    color: 'white',
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary, // DESIGN.md: Indigo with underline
  },
  tabText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary, // DESIGN.md: Indigo
    fontWeight: '600',
  },
  itemsList: {
    flex: 1,
    padding: Spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: Components.card.borderRadius, // DESIGN.md: 8px
    marginBottom: 10,
    padding: Components.card.padding, // DESIGN.md: 16px
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: Components.card.borderRadius,
    marginRight: Spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lostBadge: {
    backgroundColor: '#FEE2E2',
  },
  foundBadge: {
    backgroundColor: '#D1FAE5',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  itemDescription: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: colors.textSecondary,
    marginBottom: 5,
  },
  itemLocation: {
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px
    color: colors.textSecondary,
    marginBottom: 3,
  },
  itemDate: {
    fontSize: Typography.caption.fontSize, // DESIGN.md: 12px
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: Typography.body.fontSize,
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
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: colors.text,
  },
  cancelText: {
    color: colors.error, // DESIGN.md: Red
    fontSize: Typography.body.fontSize,
  },
  form: {
    padding: Spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Components.button.borderRadius, // DESIGN.md: 6px
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButtonActive: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: colors.textSecondary,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Components.input.borderRadius, // DESIGN.md: 6px
    paddingHorizontal: Components.input.paddingHorizontal, // DESIGN.md: 12px
    paddingVertical: 12,
    marginBottom: Spacing.md,
    fontSize: Components.input.fontSize, // DESIGN.md: 16px (prevents zoom on iOS)
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Components.card.borderRadius, // DESIGN.md: 8px
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  photoButtonText: {
    fontSize: Typography.body.fontSize,
    color: colors.textSecondary,
  },
  photoPreview: {
    width: '100%',
    height: Components.map.previewHeight, // DESIGN.md: 200px
    borderRadius: Components.card.borderRadius,
  },
  submitButton: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
    paddingVertical: 15,
    borderRadius: Components.button.borderRadius, // DESIGN.md: 6px
    alignItems: 'center',
    height: Components.button.height, // DESIGN.md: 48px
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: Typography.body.fontSize, // DESIGN.md: 16px
    fontWeight: '600',
  },
});

export default LostFoundScreen;
