import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ChecklistItemsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { checklistData } = route.params;
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solicitacao, setSolicitacao] = useState(null);

  // Obtém o ID do item a partir dos dados do checklist
  const idItem = checklistData?.groupId;

  useEffect(() => {
    const fetchItens = async () => {
      if (!idItem) {
        Alert.alert('Erro', 'ID do item não encontrado.');
        setLoading(false);
        return;
      }
  
      try {
        console.log(`Requisitando itens com idItem: ${idItem}`);
        const response = await fetch(`https://syntron.com.br/sistemas/apis/CheckItemsA.php?tipoCheck=${idItem}`);
        const contentType = response.headers.get("Content-Type");
        console.log("Content-Type da resposta:", contentType);
  
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          console.log("Itens retornados pela API:", result);
  
          if (result.status === 'success') {
            setItens(result.data);
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
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const handleSubmit = async () => {
    const allItemsMarked = itens.every(item => item.status !== undefined);
    if (!allItemsMarked) {
      Alert.alert('Aviso', 'Por favor, marque todos os itens.');
      return;
    }

    if (solicitacao === null) {
      Alert.alert('Aviso', 'Por favor, informe se deseja inserir uma solicitação.');
      return;
    }

    const completedChecklist = {
      
      checklistData: {
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
      solicitacao: solicitacao,
    };


    console.log('Dados enviados para a API:', JSON.stringify(completedChecklist));

    try {
      const response = await fetch('https://syntron.com.br/sistemas/apis/submit_checklist.php', {
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

  const handleSolicitacaoAlert = () => {
    Alert.alert(
      'Deseja Inserir Solicitação?',
      'Escolha uma opção para inserir uma solicitação.',
      [
        {
          text: 'Sim',
          onPress: async () => {
            setSolicitacao(1);
            await new Promise(resolve => setTimeout(resolve, 100));
            handleSubmit();
          },
        },
        {
          text: 'Não',
          onPress: async () => {
            setSolicitacao(2);
            await new Promise(resolve => setTimeout(resolve, 100));
            handleSubmit();
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Carregando itens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Itens do Checklist</Text>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <View style={styles.radioButtonsContainer}>
              <TouchableOpacity
                style={[styles.radioButton, item.status === true && styles.selectedButton]}
                onPress={() => handleStatusChange(item.id, true)}
              >
                <Text style={styles.radioText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, item.status === false && styles.selectedButton]}
                onPress={() => handleStatusChange(item.id, false)}
              >
                <Text style={styles.radioText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.finalizarButton} onPress={handleSolicitacaoAlert}>
        <Text style={styles.finalizarButtonText}>Finalizar Checklist</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  item: {
    flexDirection: 'column', // Empilha texto e botões
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10, // Espaçamento entre texto e botões
    flexWrap: 'wrap', // Permite quebra de linha no texto
  },
  radioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Garante espaçamento uniforme
    alignItems: 'center',
    flexWrap: 'wrap', // Botões se ajustam se o espaço for pequeno
  },
  radioButton: {
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 5, // Adiciona espaçamento vertical
    borderRadius: 5,
    backgroundColor: '#ddd',
    minWidth: 80, // Garante que os botões tenham um tamanho mínimo
    alignItems: 'center', // Centraliza o texto dentro do botão
  },
  selectedButton: { backgroundColor: '#80deea' },
  radioText: { fontSize: 16 },
  finalizarButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  finalizarButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});


export default ChecklistItemsScreen;
