import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

const LoginScreen = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [accessLevels, setAccessLevels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecoverModalVisible, setIsRecoverModalVisible] = useState(false);
  const [recoverLogin, setRecoverLogin] = useState('');

  // useEffect(() => {
  //   // Verificar se o usuário já está logado ao iniciar o app
  //   const checkLoginStatus = async () => {
  //     const userData = await AsyncStorage.getItem('user_data');
  //     if (userData) {
  //       const user = JSON.parse(userData);
  //       navigation.navigate('Home', {
  //         cad_codigo: user.cad_codigo,
  //         cad_mail: user.cad_mail,
  //         cadNome: user.cadNome,
  //         nivelAcesso: user.nivelAcesso,
  //         nomeNivel: user.nomeNivel,
  //       });
  //     }
  //   };
  //   checkLoginStatus();
  // }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://syntron.com.br/sistemas/apis/cad_usuario.php', {
      // const response = await fetch('http://192.168.100.63/apis/cad_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usu_login: login, usu_senha: senha }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        console.log('Dados Recebidos:');
        console.log('cad_codigo:', result.cad_codigo);
        console.log('cad_mail:', result.cad_mail);
        console.log('cad_nome:', result.cad_nome);
        console.log('nivel_acesso:', result.nivel_acesso);
        console.log('nomeNivel:', result.nome_nivel);

        // Salvar os dados do usuário no AsyncStorage
        const userData = {
          cadCodigo: result.cad_codigo,
          cad_mail: result.cad_mail,
          cadNome: result.cad_nome,
          nivelAcesso: result.nivel_acesso,
          nomeNivel: result.nome_nivel,
        };
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));

        // Redirecionar para Home
        navigation.navigate('Home', {
          cadCodigo: result.cad_codigo,
          cad_mail: result.cad_mail,
          cadNome: result.cad_nome,
          nivelAcesso: result.nivel_acesso,
          nomeNivel: result.nome_nivel,
        });
      } else if (result.status === 'multi_access') {
        setAccessLevels(result.niveis_acesso);
        setIsModalVisible(true);
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    }
  };

  const handleAccessLevelSelect = async (level) => {
    try {
      const response = await fetch('https://syntron.com.br/sistemas/apis/cad_usuario.php', {
      // const response = await fetch('http://192.168.100.63/apis/cad_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usu_login: login, usu_senha: senha }),
      });

      const result = await response.json();
      console.log('Dados Recebidos:', result);

      // Navega para a tela de Home somente após garantir que result foi recebido
      setIsModalVisible(false);
      navigation.navigate('Home', {
        nivelAcesso: level.ace_nivel_acesso,
        nomeNivel: level.niv_nome,
        cadNome: result.cad_nome,
        cadCodigo: result.cad_codigo // Acessa cad_nome de forma segura
      });
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleRecoverPassword = async () => {
    if (!recoverLogin) {
      Alert.alert('Erro', 'Por favor, insira o login.');
      return;
    }

    try {
      const response = await fetch('http://192.168.100.63/apis/recover_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usu_login: recoverLogin }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Sucesso', 'A senha foi enviada para o seu e-mail.');
        setIsRecoverModalVisible(false);
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a senha.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <TextInput
          placeholder="Usuário"
          value={login}
          onChangeText={setLogin}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.recoverButton]}
          onPress={() => setIsRecoverModalVisible(true)}
        >
          <Text style={styles.buttonText}>Recuperar Senha</Text>
        </TouchableOpacity>

        {/* Modal para seleção de nível de acesso */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione o Nível de Acesso</Text>
            <FlatList
              data={accessLevels}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.accessLevelButton}
                  onPress={() => handleAccessLevelSelect(item)}
                >
                  <Text style={styles.accessLevelText}>
                    {item.niv_nome}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        {/* Modal para recuperação de senha */}
        <Modal
          visible={isRecoverModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsRecoverModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsRecoverModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Recuperar Senha</Text>
            <TextInput
              placeholder="Usuário"
              value={recoverLogin}
              onChangeText={setRecoverLogin}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleRecoverPassword}
            >
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  recoverButton: {
    backgroundColor: 'darkorange',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  accessLevelButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  accessLevelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;