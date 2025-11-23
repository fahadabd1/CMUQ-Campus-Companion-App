import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions, ScrollView, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ROOM_DATABASE, FLOOR_NAMES, CATEGORY_DATABASE } from '../utils/roomDatabase';
import { Colors, Spacing, Typography, Components, RoomStates, Container } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const FLOOR_IMAGES = [
  require('../../assets/pdf/CMU1st.jpg'),
  require('../../assets/pdf/SecondFloor.png'),
  require('../../assets/pdf/ThirdFloor.png'),
];

// @param room: string
function get_room_type(room) {
  let r = Number.parseInt(room);
  let floor;
  if (room[0] === '1') {floor = FLOOR_NAMES[0]};
  if (room[0] === '2') {floor = FLOOR_NAMES[1]};
  if (room[0] === '3') {floor = FLOOR_NAMES[2]};

  for (let category in CATEGORY_DATABASE) {
    if (r in CATEGORY_DATABASE[floor][category]) {
      return category;
    }
  }
  return null;
}

// category can only be one of: ['staff', 'study-rooms', 'restrooms', 'class-rooms', 'facility']
// floor must be an element of FLOOR_NAMES
function get_rooms_of_type(category, floor) {
  let string_rooms = CATEGORY_DATABASE[floor][category].copy();
  string_rooms.map((value, index, array) => {
    return value.toString();
  });
  return string_rooms;
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'facility', label: 'Facilities' },
  { key: 'class-rooms', label: 'Classrooms' },
  { key: 'restrooms', label: 'Restrooms' },
  { key: 'study-rooms', label: 'Study Rooms' },
  { key: 'staff', label: 'Staff Offices' },
];

const MapScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [currentFloor, setCurrentFloor] = useState(0);
  const [foundRoom, setFoundRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Get rooms for selected category (First Floor only)
  const getCategoryRooms = () => {
    if (selectedCategory === 'all' || currentFloor !== 0) return [];
    const categoryData = CATEGORY_DATABASE['First Floor']?.[selectedCategory];
    if (!categoryData?.rooms) return [];

    return categoryData.rooms
      .map(roomNum => {
        const roomData = ROOM_DATABASE[roomNum.toString()];
        if (roomData && roomData.image === 0) {
          return { ...roomData, roomNumber: roomNum.toString() };
        }
        return null;
      })
      .filter(Boolean);
  };

  const categoryRooms = getCategoryRooms();

  const handleSearch = () => {
    const roomNumber = searchText.trim();
    if (!roomNumber) {
      Alert.alert(
        'No Room Number',
        'Please enter a room number to search.\n\nExamples:\n• 1051 (First Floor)\n• 2034 (Second Floor)\n• 3001 (Third Floor)\n\nOr use the category filters below to browse rooms.',
        [
          {
            text: 'Try Again',
            style: 'cancel'
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
      return;
    }

    const room = ROOM_DATABASE[roomNumber];
    if (room) {
      Keyboard.dismiss(); // Hide keyboard for better map visibility
      setFoundRoom(room);
      setCurrentFloor(room.image);
    } else {
      setFoundRoom(null);
      Alert.alert(
        'Room Not Found',
        `Room "${roomNumber}" could not be found.\n\nTips:\n• Check the room number format (e.g., 1051, 2034, 3001)\n• First digit indicates the floor (1=First, 2=Second, 3=Third)\n• Try browsing by category using the filters below`,
        [
          {
            text: 'Retry',
            onPress: () => setSearchText(''),
            style: 'cancel'
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>CMUQ Map</Text>
          <View style={{width: 50}} />
        </View>

      <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder="Room number"
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          keyboardType="number-pad"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.btn} onPress={handleSearch}>
          <Text style={styles.btnText}>Find</Text>
        </TouchableOpacity>
      </View>

      {foundRoom && <View style={styles.info}><Text style={styles.infoText}>📍 Room {searchText} - {foundRoom.floor}</Text></View>}

      {/* Category Filter - First Floor Only */}
      {currentFloor === 0 && (
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryBtn, selectedCategory === cat.key && styles.categoryBtnActive]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat.key && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Category info banner */}
      {selectedCategory !== 'all' && currentFloor === 0 && categoryRooms.length > 0 && (
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryInfoText}>
            🏷️ {categoryRooms.length} {CATEGORIES.find(c => c.key === selectedCategory)?.label} on First Floor
          </Text>
        </View>
      )}

      <View style={styles.tabs}>
        {FLOOR_NAMES.map((name, i) => (
          <TouchableOpacity key={i} style={[styles.tab, currentFloor === i && styles.tabActive]} onPress={() => setCurrentFloor(i)}>
            <Text style={[styles.tabText, currentFloor === i && styles.tabTextActive]}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Zoom hint */}
      <View style={styles.zoomHint}>
        <Text style={styles.zoomHintText}>Pinch to zoom • Drag to pan</Text>
      </View>

      <ScrollView
        style={styles.map}
        contentContainerStyle={styles.mapScrollContent}
        maximumZoomScale={4}
        minimumZoomScale={1}
        bouncesZoom={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        centerContent={true}
      >
        <View style={styles.mapWrapper}>
          <Image source={FLOOR_IMAGES[currentFloor]} style={styles.img} resizeMode="contain" />
          {/* Category markers (blue) */}
          {categoryRooms.map((room) => (
            <View
              key={room.roomNumber}
              style={[styles.categoryMarker, { left: `${room.x}%`, top: `${room.y}%` }]}
            >
              <View style={styles.categoryPulse} />
            </View>
          ))}
          {/* Search result marker (red) */}
          {foundRoom && foundRoom.image === currentFloor && foundRoom.x && foundRoom.y && (
            <View style={[styles.marker, { left: `${foundRoom.x}%`, top: `${foundRoom.y}%` }]}>
              <View style={styles.pulse} />
            </View>
          )}
        </View>
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
    backgroundColor: colors.surface // DESIGN.md: Gray-50
  },
  scrollContent: {
    paddingBottom: Container.bottomNavClearance, // DESIGN.md: 80px clearance for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md, // DESIGN.md: 16px
    paddingTop: 40,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backText: {
    color: colors.primary, // DESIGN.md: Indigo
    fontSize: Typography.body.fontSize,
    fontWeight: '600'
  },
  title: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: colors.text
  },
  search: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: Components.input.borderRadius, // DESIGN.md: 6px
    paddingHorizontal: Components.input.paddingHorizontal, // DESIGN.md: 12px
    paddingVertical: 10,
    fontSize: Components.input.fontSize, // DESIGN.md: 16px (prevents zoom on iOS)
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text
  },
  btn: {
    backgroundColor: colors.primary, // DESIGN.md: Indigo
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Components.button.borderRadius, // DESIGN.md: 6px
    justifyContent: 'center'
  },
  btnText: {
    color: 'white',
    fontSize: Typography.body.fontSize,
    fontWeight: '600'
  },
  info: {
    backgroundColor: colors.success, // DESIGN.md: Green
    padding: 12,
    alignItems: 'center'
  },
  infoText: {
    color: 'white',
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    fontWeight: '600'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent'
  },
  tabActive: {
    borderBottomColor: colors.primary, // DESIGN.md: Indigo
    backgroundColor: colors.surface
  },
  tabText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: colors.textSecondary,
    fontWeight: '500'
  },
  tabTextActive: {
    color: colors.primary, // DESIGN.md: Indigo
    fontWeight: '700'
  },
  zoomHint: {
    backgroundColor: colors.background,
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  zoomHintText: {
    fontSize: Typography.caption.fontSize,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  map: {
    flex: 1,
    backgroundColor: colors.border
  },
  mapScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapWrapper: {
    width: width,
    height: width * 0.75,
    position: 'relative'
  },
  img: {
    width: '100%',
    height: '100%'
  },
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    marginLeft: -15,
    marginTop: -15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pulse: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.5)',
    borderWidth: 3,
    borderColor: RoomStates.occupied // DESIGN.md: Red for occupied rooms
  },
  // Category Filter Styles
  categoryContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: Typography.small.fontSize,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  categoryInfo: {
    backgroundColor: colors.primary,
    padding: 10,
    alignItems: 'center',
  },
  categoryInfoText: {
    color: 'white',
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
  },
  categoryMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderWidth: 2,
    borderColor: '#3B82F6', // Blue for category markers
  },
});

export default MapScreen;
