import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';

const API_URL = 'https://syntron.com.br/sistemas/apis/solicitacao.php';

const SolicitationListScreen = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.status === 'success') {
          // Atualiza as solicitações no estado
          const formattedData = data.data.map((item) => ({
            ...item,
            datainserido: formatDate(item.datainserido),
          }));

          setSolicitacoes(formattedData);
        } else {
          Alert.alert('Erro', data.message || 'Erro ao buscar as solicitações');
        }
      } catch (error) {
        Alert.alert('Erro', error.message);
      }
    };

    fetchSolicitacoes();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
  };

  const handleAction = async (id, action) => {
    const actionUrl = `${API_URL}?acao=${action}&id=${id}`;
    try {
      const response = await fetch(actionUrl, {
        method: 'GET',
      });
      console.log(actionUrl);
      const data = await response.json();
      if (data.status === 'success') {
        Alert.alert('Sucesso', `Solicitação ${action === 'aprovar' ? 'aprovada' : 'recusada'} com sucesso.`);
        setSolicitacoes((prevSolicitacoes) =>
          prevSolicitacoes.filter((item) => item.id !== id)
        );
      } else {
        Alert.alert('Erro', data.message || 'Erro ao processar a ação.');
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Solicitação: {item.id}</Text>
      <Text style={styles.itemText}>Usuário: {item.user_name}</Text>
      <Text style={styles.itemText}>Veiculo: {item.veiculo_detalhes}</Text>
      <Text style={styles.itemText}>Data: {item.datainserido}</Text>
      <Text style={styles.itemText}>Observação: {item.obseravcao || 'Sem observação'}</Text>
      <Text style={[styles.status, item.status === 'cancelado' ? styles.statusRed : styles.statusGreen]}>
        Status: {item.status}
      </Text>
      {/* Exibe os botões conforme o status */}
      {item.status !== 'cancelado' && item.status !== 'autorizado' && (
        <View style={styles.buttonGroup}>
          <Button title="Aprovar" onPress={() => handleAction(item.id, 'aprovar')} />
          <Button title="Recusar" color="red" onPress={() => handleAction(item.id, 'recusar')} />
        </View>
      )}
     
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Solicitações</Text>
      <FlatList
        data={solicitacoes}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma solicitação encontrada.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusRed: {
    color: 'red',
  },
  statusGreen: {
    color: 'green',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
    marginTop: 20,
  },
});

export default SolicitationListScreen;
