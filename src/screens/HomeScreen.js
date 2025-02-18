import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, route }) => {
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
      999: ['CheckList', 'Rastreamento', 'OrdensServico', 'relatoriosScreens', 'GerenciaRoScreen', 'Manutencao'], // Administrador
      222: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Operador Suprimentos
      223: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Gerente Operação
      224: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Diretor Operação
      225: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Coordenador Operação
      227: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Supervisor de Frota
      228: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Gerente de Frota
      229: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Diretor de Frota
      800: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Gestor Operacional
      995: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Gestor da Frota
      250: ['OrdensServico'], // Orçamentista
      251: ['OrdensServico'], // Orçamentista - Credenciados
      252: ['CheckList', 'GerenciaRoScreen'], // Motorista
      960: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Gestão de Frota Lança O.S
      997: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Gestão de Frota Avaliador
      998: ['CheckList', 'OrdensServico', 'GerenciaRoScreen'], // Gestão de Frota Nível 1
    };

    const opcoes = [
      { id: '1', titulo: 'Check Lsit', destino: 'CheckList', icone: require('../../assets/icons/checklsitveiculo.png') },
      { id: '2', titulo: 'Rastreamento', destino: 'Rastreamento', icone: require('../../assets/icons/rastreio.png') },
      { id: '3', titulo: 'Ordens de Serviço', destino: 'OrdensServico', icone: require('../../assets/icons/ordensdeservico.png') },
      { id: '4', titulo: 'Relatórios', destino: 'relatoriosScreens', icone: require('../../assets/icons/relatorio.png') },
      { id: '5', titulo: 'Gerencia R.O', destino: 'GerenciaRoScreen', icone: require('../../assets/icons/registroOcorrenciaicon.png') },
      { id: '6', titulo: 'DashBoards', destino: 'Manutencao', icone: require('../../assets/icons/dash.png') },
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
      {/* Barra superior */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Gestão de Frotas</Text>
        <Image source={require('../../assets/icon.png')} style={styles.headerLogo} />
      </View>

      {/* Exibição do nome do usuário e nível de acesso */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>Usuário: {cadNome || userData?.cadNome}</Text>
        <Text style={styles.userAccess}>Nível de Acesso: {nomeNivel || userData?.nomeNivel}</Text>
      </View>

      {/* Cards principais */}
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

export default HomeScreen;
