import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {}; // Obter dados passados

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('userData');
        if (user !== null) {
          const { cad_codigo, cadNome, nomeNivel, nivelAcesso } = JSON.parse(user);
          setUserData({ cadCodigo, cadNome, nomeNivel, nivelAcesso }); // Atualiza o estado
        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      }
    };
  
    getUserData();
  }, []);

  const renderCards = () => {
    const commonParams = { cadCodigo, cadNome, nomeNivel, nivelAcesso  }; // Parâmetros comuns

    if (nivelAcesso === 999) {
      //ADM
      return (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CheckList', commonParams)}
          >
            <Image source={require('../../assets/icons/checklist.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>CheckList</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Rastreamento', commonParams)}
          >
            <Image source={require('../../assets/icons/rastreamento.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Rastreamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrdensServico', commonParams)}
          >
            <Image source={require('../../assets/icons/manutencao.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Ordens de Serviço</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('relatoriosScreens', commonParams)}
          >
            <Image source={require('../../assets/icons/relatorios.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('GerenciaRoScreen', commonParams)}
          >
            <Image source={require('../../assets/icons/relatorios.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Gerencia R.O</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Manutencao', commonParams)}
          >
            <Image source={require('../../assets/icons/manutencao.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>DashBoards</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (nivelAcesso == 252) {
      //MOTORISTA
      return (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CheckList', commonParams)}
          >
            <Image source={require('../../assets/icons/checklist.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>CheckList</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Rastreamento', commonParams)}
          >
            <Image source={require('../../assets/icons/rastreamento.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Rastreamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrdensServico', commonParams)}
          >
            <Image source={require('../../assets/icons/manutencao.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Ordens de Serviço</Text>
          </TouchableOpacity>
        
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('GerenciaRoScreen', commonParams)}
          >
            <Image source={require('../../assets/icons/relatorios.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Gerencia R.O</Text>
          </TouchableOpacity>
       
        </>
      );
    }else if (nivelAcesso === 251 || nivelAcesso === 250) {
      //ORCAMENTISTA
      return (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrdensServico', commonParams)}
          >
            <Image source={require('../../assets/icons/manutencao.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Ordens de Serviço</Text>
          </TouchableOpacity>
        </>
      );
    }

  
    if(nivelAcesso == 223 || nivelAcesso == 224 || nivelAcesso == 225 || nivelAcesso == 227 ||  nivelAcesso == 228 ||  nivelAcesso == 229 ) {

      //GERENTE OPERAÇÃO
      //DIRETOR OPERAÇÃO
      //COORDENADOR OPERAÇÃO
      //SUPERVISOR DE FROTA
      //GERENTE DE FROTA
      //DIRETOR DE FROTA
      
      return (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CheckList', commonParams)}
          >
            <Image source={require('../../assets/icons/checklist.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>CheckList</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Rastreamento', commonParams)}
          >
            <Image source={require('../../assets/icons/rastreamento.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Rastreamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrdensServico', commonParams)}
          >
            <Image source={require('../../assets/icons/manutencao.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Ordens de Serviço</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('relatoriosScreens', commonParams)}
          >
            <Image source={require('../../assets/icons/relatorios.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('GerenciaRoScreen', commonParams)}
          >
            <Image source={require('../../assets/icons/relatorios.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Gerencia R.O</Text>
          </TouchableOpacity>
       
        </>
      );
    }
    if(nivelAcesso == 995 || nivelAcesso == 960 || nivelAcesso == 997 || nivelAcesso == 222){
      return (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CheckList', commonParams)}
          >
            <Image source={require('../../assets/icons/checklist.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>CheckList</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Rastreamento', commonParams)}
          >
            <Image source={require('../../assets/icons/rastreamento.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Rastreamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrdensServico', commonParams)}
          >
            <Image source={require('../../assets/icons/manutencao.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Ordens de Serviço</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('relatoriosScreens', commonParams)}
          >
            <Image source={require('../../assets/icons/relatorios.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Relatórios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('GerenciaRoScreen', commonParams)}
          >
            <Image source={require('../../assets/icons/relatorios.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Gerencia R.O</Text>
          </TouchableOpacity>
       
        </>
      );


    }
    return null;
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
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {renderCards()}
      </ScrollView>
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
});

export default HomeScreen;
