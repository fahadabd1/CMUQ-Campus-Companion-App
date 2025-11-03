import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ROOM_DATABASE, FLOOR_NAMES } from '../utils/roomDatabase';

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

      <ScrollView style={styles.map}>
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingTop: 40, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backText: { color: '#3B82F6', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  search: { flexDirection: 'row', padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', gap: 10 },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, borderWidth: 1, borderColor: '#D1D5DB' },
  btn: { backgroundColor: '#3B82F6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, justifyContent: 'center' },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  info: { backgroundColor: '#10B981', padding: 12, alignItems: 'center' },
  infoText: { color: 'white', fontSize: 14, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  tabText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  tabTextActive: { color: '#3B82F6', fontWeight: '700' },
  map: { flex: 1, backgroundColor: '#E5E7EB' },
  mapWrapper: { width: width - 20, height: (width - 20) * 0.7, margin: 10, position: 'relative' },
  img: { width: '100%', height: '100%' },
  marker: { position: 'absolute', width: 30, height: 30, marginLeft: -15, marginTop: -15, justifyContent: 'center', alignItems: 'center' },
  pulse: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(239, 68, 68, 0.5)', borderWidth: 3, borderColor: '#EF4444' },
});

export default MapScreen;
