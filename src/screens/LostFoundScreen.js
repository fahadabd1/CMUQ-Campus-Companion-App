import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import db from '../database/database';

const LostFoundScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'lost',
    item_name: '',
    description: '',
    location_lost: '',
    contact_info: '',
    image_path: null
  });

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = () => {
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
      console.error('Error loading items:', error);
    }
  };

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

  const handleSubmit = () => {
    if (!newItem.item_name || !newItem.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const expires_at = new Date();
      expires_at.setDate(expires_at.getDate() + 30);

      db.runSync(
        `INSERT INTO lost_found (type, item_name, description, location_lost, contact_info, image_path, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newItem.type,
          newItem.item_name,
          newItem.description,
          newItem.location_lost,
          newItem.contact_info,
          newItem.image_path,
          expires_at.toISOString()
        ]
      );

      Alert.alert('Success', 'Item posted successfully');
      setShowAddForm(false);
      setNewItem({
        type: 'lost',
        item_name: '',
        description: '',
        location_lost: '',
        contact_info: '',
        image_path: null
      });
      loadItems();
    } catch (error) {
      console.error('Error posting item:', error);
      Alert.alert('Error', 'Failed to post item');
    }
  };

  if (showAddForm) {
    return (
      <ScrollView style={styles.container}>
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
            value={newItem.item_name}
            onChangeText={(text) => setNewItem({ ...newItem, item_name: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description *"
            value={newItem.description}
            onChangeText={(text) => setNewItem({ ...newItem, description: text })}
            multiline
            numberOfLines={4}
          />

          <TextInput
            style={styles.input}
            placeholder="Location Lost/Found"
            value={newItem.location_lost}
            onChangeText={(text) => setNewItem({ ...newItem, location_lost: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Info"
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
    );
  }

  return (
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

      <ScrollView style={styles.itemsList}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  itemsList: {
    flex: 1,
    padding: 15,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
    color: '#6B7280',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  itemLocation: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cancelText: {
    color: '#EF4444',
    fontSize: 16,
  },
  form: {
    padding: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  typeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LostFoundScreen;
