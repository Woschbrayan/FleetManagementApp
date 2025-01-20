import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';

const MapaScreen = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const route = useRoute();  // Pegando os parâmetros passados pela tela anterior

  useEffect(() => {
    // Pegando a latitude e longitude da rota (passados da tela anterior)
    if (route.params) {
      const { latitude, longitude } = route.params;
      setLatitude(latitude);
      setLongitude(longitude);
    }
  }, [route.params]);

  if (latitude === null || longitude === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Localização não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,  // Zoom
          longitudeDelta: 0.0421, // Zoom
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>Latitude:</Text> {latitude}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>Longitude:</Text> {longitude}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MapaScreen;
