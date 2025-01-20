import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RastreamentoScreen = () => {
  const [veiculos, setVeiculos] = useState([]);
  const navigation = useNavigation(); // Hook para navegação

  useEffect(() => {
    // Chama a função para carregar veículos quando tipoVeiculo mudar
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    try {
      const response = await fetch('https://syntron.com.br/sistemas/apis/veiculos.php');
      const data = await response.json();

      if (data.status === 'success') {
        setVeiculos(data.data); // Armazena os veículos no estado
      } else {
        Alert.alert('Erro', 'Nenhum veículo encontrado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os veículos');
      console.error('Erro ao carregar os veículos:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Veículos</Text>
      <View style={styles.veiculoList}>
        {veiculos.length > 0 ? (
          veiculos.map(vehicle => (
            <View key={vehicle.vei_codigo} style={styles.veiculoItem}>
              <Text style={styles.veiculoText}>
                <Text style={styles.boldText}>Marca:</Text> {vehicle.veiculo_detalhes}
              </Text>
              <Text style={styles.veiculoText}>
                <Text style={styles.boldText}>Placa:</Text> {vehicle.vai_placa}
              </Text>
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
                <Text style={styles.buttonText}>Ver Localização</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noVehiclesText}>Nenhum veículo encontrado.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f8fb', // Fundo claro e suave
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
  },
  veiculoList: {
    marginVertical: 10,
  },
  veiculoItem: {
    backgroundColor: '#007bff', // Azul Bootstrap
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  veiculoText: {
    fontSize: 18,
    color: '#fff', // Texto branco nos cards
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff', // Texto em negrito branco
  },
  button: {
    marginTop: 10,
    backgroundColor: '#28a745', // Verde Bootstrap
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Texto branco
  },
  noVehiclesText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RastreamentoScreen;
