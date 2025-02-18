import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ícones melhorados
import API_BASE_URL from './config';

const RastreamentoScreen = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true); // Indicador de carregamento
  const navigation = useNavigation();

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos.php`);
      const data = await response.json();

      if (data.status === 'success') {
        setVeiculos(data.data);
      } else {
        Alert.alert('Erro', 'Nenhum veículo encontrado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os veículos');
      console.error('Erro ao carregar os veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>🚗 Rastreamento de Veículos</Text> */}

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : veiculos.length > 0 ? (
        veiculos.map((vehicle) => (
          <View key={vehicle.vei_codigo} style={styles.veiculoCard}>
            <View style={styles.veiculoInfo}>
              {/* <Ionicons name="car-outline" size={24} color="#FFF" style={styles.icon} /> */}
              <View>
                <Text style={styles.veiculoText}>
                  <Text style={styles.boldText}>🚘 Veículo:</Text> {vehicle.veiculo_detalhes}
                </Text>
                <Text style={styles.veiculoText}>
                  <Text style={styles.boldText}>🔖 Placa:</Text> {vehicle.vai_placa}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('MapaScreen', {
                  vei_codigo: vehicle.vei_codigo,
                  longitude: vehicle.longitude,
                  latitude: vehicle.latitude,
                })
              }
            >
              <Ionicons name="location-outline" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Ver Localização</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noVehiclesText}>🚫 Nenhum veículo encontrado.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F8FB',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007BFF',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  veiculoCard: {
    // backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  veiculoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  veiculoText: {
    fontSize: 16,
    // color: '#FFF',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
    // color: '#FFF',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28A745',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  noVehiclesText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RastreamentoScreen;
