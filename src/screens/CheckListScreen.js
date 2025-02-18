import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones
import API_BASE_URL from './config';

const CheckListScreen = () => {
  const [grupos, setGrupos] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params;

  const fetchGrupos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/grupochecklist.php`);
      const result = await response.json();

      if (result.status === 'success') {
        setGrupos(result.data);
      } else {
        Alert.alert('Erro', result.message || 'Não foi possível carregar os grupos.');
      }
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleGroupClick = (groupId) => {
    navigation.navigate('FormChecklistScreen', { groupId, cadCodigo, cadNome, nomeNivel, nivelAcesso });
  };

  const handleConsultaClick = (groupId) => {
    navigation.navigate('ConsultaChecklistScreen', { groupId, cadCodigo, cadNome, nomeNivel, nivelAcesso });
  };

  const handleAdicionarImagem = (groupId) => {
    navigation.navigate('AdicionarImagemScreen', { groupId, cadCodigo, cadNome, nomeNivel, nivelAcesso });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.header}> Grupos de Checklist</Text> */}

      {grupos.length > 0 ? (
        grupos.map((grupo) => (
          <View key={grupo.id} style={styles.cardContainer}>
            {/* Botão principal do checklist */}
            <TouchableOpacity style={styles.card} onPress={() => handleGroupClick(grupo.id)}>
              <View style={styles.cardContent}>
                <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.cardText}>{grupo.nome}</Text>
              </View>
            </TouchableOpacity>

            {/* Botões adicionais */}
            <View style={styles.buttonContainer}>
              {/* Botão "Acervo" */}
              <TouchableOpacity style={styles.consultaButton} onPress={() => handleConsultaClick(grupo.id)}>
                <Ionicons name="image-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Acervo</Text>
              </TouchableOpacity>

              {/* Botão "Adicionar Imagem" */}
              {/* <TouchableOpacity style={styles.imageButton} onPress={() => handleAdicionarImagem(grupo.id)}>
                <Ionicons name="camera-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Imagem</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.loadingText}>🔄 Carregando grupos...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 3, // Sombras no Android
    shadowColor: '#000', // Sombras no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ffffff',
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  consultaButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    height: 60,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  imageButton: {
    backgroundColor: '#28A745',
    width: 80,
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CheckListScreen;
