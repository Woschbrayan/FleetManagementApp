import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RelatoriosScreens = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {};

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('userData');
        if (user !== null) {
          const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = JSON.parse(user);
          setUserData({ cadCodigo, cadNome, nomeNivel, nivelAcesso });
        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      }
    };

    getUserData();
  }, []);

  const renderCards = () => {
    const commonParams = { cadCodigo, cadNome, nomeNivel, nivelAcesso };

    const permissoes = {
      999: ['RelatoriosOs','RelatorioRO', 'RelatorioOrcamentos', 'RelatorioCheckOs', 'ChecklistMotoristas', 'RelatorioUsuarios', 'Relatoriocred', 'RelatorioVeiculos', 'Motoristas'], // Admin
      222:  ['RelatoriosOs','RelatorioRO', 'RelatorioOrcamentos', 'RelatorioCheckOs', 'ChecklistMotoristas', 'RelatorioUsuarios', 'Relatoriocred', 'RelatorioVeiculos', 'Motoristas'], // Admin
      223:  ['RelatoriosOs','RelatorioRO', 'RelatorioOrcamentos', 'RelatorioCheckOs', 'ChecklistMotoristas', 'RelatorioUsuarios', 'Relatoriocred', 'RelatorioVeiculos', 'Motoristas'], // Admin
      224:  ['RelatoriosOs','RelatorioRO', 'RelatorioOrcamentos', 'RelatorioCheckOs', 'ChecklistMotoristas', 'RelatorioUsuarios', 'Relatoriocred', 'RelatorioVeiculos', 'Motoristas'], // Admin
      250: ['RelatoriosOs','RelatorioRO', 'RelatorioOrcamentos', 'RelatorioCheckOs', 'ChecklistMotoristas', 'RelatorioUsuarios', 'Relatoriocred', 'RelatorioVeiculos', 'Motoristas'], // Admin
      252: ['RelatoriosOs','RelatorioRO', 'RelatorioOrcamentos', 'RelatorioCheckOs', 'ChecklistMotoristas', 'RelatorioUsuarios', 'Relatoriocred', 'RelatorioVeiculos', 'Motoristas'], // Admin
      998:  ['RelatoriosOs','RelatorioRO', 'RelatorioOrcamentos', 'RelatorioCheckOs', 'ChecklistMotoristas', 'RelatorioUsuarios', 'Relatoriocred', 'RelatorioVeiculos', 'Motoristas'], // Admin
    };

    const opcoes = [
      { id: '1', titulo: 'Ordens de Serviço', destino: 'RelatoriosOs', icone: require('../../assets/icons/ordensdeservico.png') },
      { id: '2', titulo: 'Registros de Ocorrência', destino: 'RelatorioRO', icone: require('../../assets/icons/registroOcorrenciaicon.png') },
      { id: '3', titulo: 'Orçamentos', destino: 'RelatorioOrcamentos', icone: require('../../assets/icons/orcamentoss.png') },
      { id: '4', titulo: 'Checklists', destino: 'RelatorioCheckOs', icone: require('../../assets/icons/checkos.png') },
      { id: '5', titulo: 'Checklist (Motoristas)', destino: 'ChecklistMotoristas', icone: require('../../assets/icons/credenciados.png') },
      { id: '6', titulo: 'Usuários', destino: 'RelatorioUsuarios', icone: require('../../assets/icons/users.png') },
      { id: '7', titulo: 'Credenciados', destino: 'Relatoriocred', icone: require('../../assets/icons/credenciados.png') },
      { id: '8', titulo: 'Veículos', destino: 'RelatorioVeiculos', icone: require('../../assets/icons/veiculosicon.png') },
      // { id: '9', titulo: 'Motoristas', destino: 'Motoristas', icone: require('../../assets/icons/motoristaicon.png') },
    ];

    // Filtrar as opções com base no nível de acesso
    const permissoesUsuario = permissoes[nivelAcesso] || [];
    const opcoesFiltradas = opcoes.filter(opcao => permissoesUsuario.includes(opcao.destino));

    if (opcoesFiltradas.length === 0) {
      return <Text style={styles.infoText}>Você não tem acesso a nenhuma funcionalidade.</Text>;
    }

    return opcoesFiltradas.map(opcao => (
      <TouchableOpacity
        key={opcao.id}
        style={styles.card}
        onPress={() => navigation.navigate(opcao.destino, commonParams)}
      >
        <Image source={opcao.icone} style={styles.cardIcon} />
        <Text style={styles.cardText}>{opcao.titulo}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardsContainer}>{renderCards()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    height: 60,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  headerLogo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  userInfoContainer: {
    padding: 20,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userAccess: {
    fontSize: 14,
    color: '#666',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    width: '45%',
    height: 120,
    backgroundColor: '#007BFF',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cardIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RelatoriosScreens;
