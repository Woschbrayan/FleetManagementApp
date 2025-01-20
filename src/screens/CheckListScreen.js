import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CheckListScreen = () => {
  const [grupos, setGrupos] = useState([]);
  const navigation = useNavigation();

  // Função para buscar os grupos de checklist
  const fetchGrupos = async () => {
    try {
      // const response = await fetch('http://192.168.100.63/apis/grupochecklist.php');
      const response = await fetch('https://syntron.com.br/sistemas/apis/grupochecklist.php');
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

  // Função chamada ao clicar em um grupo
  const handleGroupClick = (groupId) => {
    navigation.navigate('FormChecklistScreen', { groupId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Grupos de Checklist</Text>
      {grupos.length > 0 ? (
        grupos.map((grupo) => (
          <TouchableOpacity
            key={grupo.id}
            style={styles.card}
            onPress={() => handleGroupClick(grupo.id)}
          >
            <Text style={styles.cardText}>{grupo.nome}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.loadingText}>Carregando grupos...</Text>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
},
header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff', // Azul do Bootstrap para o header
},
card: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#007bff', // Azul do Bootstrap para o fundo do card
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
},
cardText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ffffff', // Cor branca para o texto
},
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  
});

export default CheckListScreen;
