import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ROOM_DATABASE, FLOOR_NAMES } from '../utils/roomDatabase';
import { Colors, Spacing, Typography, Components, RoomStates, Container } from '../../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const FLOOR_IMAGES = [
  require('../../assets/pdf/FirstFloor.png'),
  require('../../assets/pdf/SecondFloor.png'),
  require('../../assets/pdf/ThirdFloor.png'),
];

const MapScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [currentFloor, setCurrentFloor] = useState(0);
  const [foundRoom, setFoundRoom] = useState(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSearch = () => {
    const roomNumber = searchText.trim();
    if (!roomNumber) {
      Alert.alert('Error', 'Please enter a room number');
      return;
    }

    const room = ROOM_DATABASE[roomNumber];
    if (room) {
      setFoundRoom(room);
      setCurrentFloor(room.image);
      Alert.alert('Room Found!', `Room ${roomNumber} is on the ${room.floor}`);
    } else {
      setFoundRoom(null);
      Alert.alert('Not Found', `Room ${roomNumber} not found`);
    }
  };

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
        <TextInput style={styles.input} placeholder="Room number" value={searchText} onChangeText={setSearchText} keyboardType="number-pad" onSubmitEditing={handleSearch} />
        <TouchableOpacity style={styles.btn} onPress={handleSearch}>
          <Text style={styles.btnText}>Find</Text>
        </TouchableOpacity>
      </View>

      {foundRoom && <View style={styles.info}><Text style={styles.infoText}>📍 Room {searchText} - {foundRoom.floor}</Text></View>}

      <View style={styles.tabs}>
        {FLOOR_NAMES.map((name, i) => (
          <TouchableOpacity key={i} style={[styles.tab, currentFloor === i && styles.tabActive]} onPress={() => setCurrentFloor(i)}>
            <Text style={[styles.tabText, currentFloor === i && styles.tabTextActive]}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.map} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapWrapper}>
          <Image source={FLOOR_IMAGES[currentFloor]} style={styles.img} resizeMode="contain" />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface // DESIGN.md: Gray-50
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
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border
  },
  backText: {
    color: Colors.light.primary, // DESIGN.md: Indigo
    fontSize: Typography.body.fontSize,
    fontWeight: '600'
  },
  title: {
    fontSize: Typography.h2.fontSize, // DESIGN.md: 20px
    fontWeight: Typography.h2.fontWeight,
    color: Colors.light.text
  },
  search: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 10
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: Components.input.borderRadius, // DESIGN.md: 6px
    paddingHorizontal: Components.input.paddingHorizontal, // DESIGN.md: 12px
    paddingVertical: 10,
    fontSize: Components.input.fontSize, // DESIGN.md: 16px (prevents zoom on iOS)
    borderWidth: 1,
    borderColor: Colors.light.border
  },
  btn: {
    backgroundColor: Colors.light.primary, // DESIGN.md: Indigo
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
    backgroundColor: Colors.light.success, // DESIGN.md: Green
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
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent'
  },
  tabActive: {
    borderBottomColor: Colors.light.primary, // DESIGN.md: Indigo
    backgroundColor: '#EFF6FF'
  },
  tabText: {
    fontSize: Typography.small.fontSize, // DESIGN.md: 14px
    color: Colors.light.textSecondary,
    fontWeight: '500'
  },
  tabTextActive: {
    color: Colors.light.primary, // DESIGN.md: Indigo
    fontWeight: '700'
  },
  map: {
    flex: 1,
    backgroundColor: Colors.light.border
  },
  mapWrapper: {
    width: width - 20,
    height: (width - 20) * 0.7,
    margin: 10,
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
});

export default MapScreen;
