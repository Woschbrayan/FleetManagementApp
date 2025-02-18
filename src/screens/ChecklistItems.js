import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import API_BASE_URL from './config';

const ChecklistItemsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { checklistData } = route.params;
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solicitacao, setSolicitacao] = useState(null);

  const idItem = checklistData?.groupId;

  useEffect(() => {
    const fetchItens = async () => {
      if (!idItem) {
        Alert.alert('Erro', 'ID do item não encontrado.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/CheckItemsA.php?tipoCheck=${idItem}`);
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();

          if (result.status === 'success') {
            const itensIniciais = result.data.map(item => ({
              ...item,
              status: true, // 🟢 Inicia como "Sim"
            }));
            setItens(itensIniciais);
          } else {
            Alert.alert('Erro', result.message || 'Erro desconhecido na API.');
          }
        } else {
          const text = await response.text();
          console.error('Resposta inesperada:', text);
          Alert.alert('Erro', 'A resposta da API não é válida.');
        }
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
        Alert.alert('Erro', 'Não foi possível carregar os itens do checklist.');
      } finally {
        setLoading(false);
      }
    };

    fetchItens();
  }, [idItem]);

  const handleStatusChange = (id, status) => {
    setItens(prevItens =>
      prevItens.map(item =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const handleSubmit = async () => {
    const completedChecklist = {
      checklistData: {
        cadCodigo: checklistData.cadCodigo,
        groupId: checklistData.groupId,
        veiculoSelecionado: checklistData.veiculoSelecionado,
        km: checklistData.km,
        dataTrocaOleo: checklistData.dataTrocaOleo,
        observacoes: checklistData.observacoes,
      },
      tipoCheck: idItem,
      itens: itens.map(item => ({
        id: item.id,
        status: item.status ? 1 : 2,
      })),
      solicitacao: solicitacao || 1, // Se não for selecionado, mantém como "Sim"
    };

    console.log('Dados enviados para a API:', JSON.stringify(completedChecklist));

    try {
      const response = await fetch(`${API_BASE_URL}/submit_checklist.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completedChecklist),
      });

      const text = await response.text();
      console.log('Resposta da API (Texto):', text);

      try {
        const result = JSON.parse(text);
        if (result.status === 'success') {
          Alert.alert('Checklist Finalizado', 'Checklist realizado com sucesso!');
        } else {
          Alert.alert('Erro', result.message || 'Erro ao processar os dados.');
        }
      } catch (e) {
        console.error('Erro ao parsear JSON:', e);
        Alert.alert('Erro', 'A resposta da API não está no formato JSON válido.');
      }
    } catch (error) {
      console.error('Erro ao enviar checklist:', error);
      Alert.alert('Erro', 'Não foi possível enviar os dados.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando itens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>📋 Itens do Checklist</Text> */}
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>{item.nome}</Text>
            <View style={styles.radioButtonsContainer}>
              <TouchableOpacity
                style={[styles.radioButton, item.status === true && styles.selectedButtonSim]}
                onPress={() => handleStatusChange(item.id, true)}
              >
                <Text style={styles.radioText}>✅ Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, item.status === false && styles.selectedButtonNao]}
                onPress={() => handleStatusChange(item.id, false)}
              >
                <Text style={styles.radioText}>❌ Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.finalizarButton} onPress={handleSubmit}>
        <Text style={styles.finalizarButtonText}>Finalizar Checklist</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#666', marginTop: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#007bff', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  radioButtonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  radioButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: '#ccc',
    // backgroundColor: '#f8f9fa',
  },
  selectedButtonSim: { backgroundColor: '#28a745', borderColor: '#28a745' },
  selectedButtonNao: { backgroundColor: '#dc3545', borderColor: '#dc3545' },
  radioText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  finalizarButton: { backgroundColor: '#007bff', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 20 },
  finalizarButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ChecklistItemsScreen;
