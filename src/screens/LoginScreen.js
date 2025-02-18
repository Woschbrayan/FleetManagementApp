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
  ActivityIndicator,
  Platform,
  Linking, // Importante para abrir links
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants'; // Para ler a versão local
import API_BASE_URL from "./config";    // Ajuste para seu endpoint

/** 
 * Função para comparar semver:
 * Retorna true se serverVersion > localVersion 
 */
function isNewerVersion(serverVersion, localVersion) {
  const sv = serverVersion.split('.').map(Number);
  const lv = localVersion.split('.').map(Number);

  for (let i = 0; i < Math.max(sv.length, lv.length); i++) {
    const s = sv[i] || 0;
    const l = lv[i] || 0;
    if (s > l) return true;
    if (s < l) return false;
  }
  return false; // São iguais
}

 const LoginScreen = ({ navigation }) => {

//   const [bloqueado, setBloqueado] = useState(true); // Defina como true para bloquear

//   if (bloqueado) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Ionicons name="lock-closed-outline" size={50} color="red" />
//         <Text style={styles.loadingText}>Este aplicativo está temporariamente indisponível.</Text>
//       </View>
//     );
//   }


  // ----------------------- Estado do Login -----------------------
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar senha

  // ----------------------- Estados Multi Acesso ------------------
  const [accessLevels, setAccessLevels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ----------------------- Recuperar Senha -----------------------
  const [isRecoverModalVisible, setIsRecoverModalVisible] = useState(false);
  const [recoverLogin, setRecoverLogin] = useState('');

  // ----------------------- Verificação de Versão -----------------
  const [loadingVersion, setLoadingVersion] = useState(true);
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [versionMessage, setVersionMessage] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);

  // Pega a versão local do app, evitando erro "Cannot read property 'version' of null"
  const localVersion = Constants.expoConfig?.version ?? "1.0.0";

  // URL da API de versão
  const VERSION_URL = `${API_BASE_URL}/verificar_versao.php`;
  // URL da API de login
  const LOGIN_URL = `${API_BASE_URL}/cad_usuario.php`;
  // URL da API de recuperar senha
  const RECOVER_URL = `${API_BASE_URL}/recover_password.php`;

  // -----------------------------------------
  // 1) Verifica a versão ao montar
  // -----------------------------------------
  useEffect(() => {
    checkAppVersion();
  }, []);

  const checkAppVersion = async () => {
    try {
      setLoadingVersion(true);
      const response = await fetch(VERSION_URL);
      if (!response.ok) {
        throw new Error(`Erro de conexão: ${response.status} - ${response.statusText}`);
      }
      const result = await response.json();

      if (result.status === 'success') {
        const { latest_version, force_update, message } = result;
        if (isNewerVersion(latest_version, localVersion)) {
          // Está desatualizado
          setVersionMessage(message || `Há uma nova versão disponível! (Atual: v${localVersion} / Nova: v${latest_version})`);
          setForceUpdate(force_update || false);
          setVersionModalVisible(true);
        } else {
          // Versão ok => libera a tela de login
          console.log("Versão do app OK. Prosseguindo para login...");
        }
      } else {
        // Se status != success
        Alert.alert('Erro', result.message || 'Falha ao checar versão. Prosseguindo...');
      }
    } catch (error) {
      console.error("Erro ao verificar versão:", error);
      Alert.alert("Erro", "Não foi possível checar a versão do app. Prosseguindo...");
    } finally {
      setLoadingVersion(false);
    }
  };

  /** Abre a store para atualizar (Android / iOS) */
  const goToStore = () => {
    if (Platform.OS === 'android') {
      // Abre a Play Store
      Linking.openURL("https://play.google.com/store/apps/details?id=com.brayanwosch.eloinfraestrutura");
    } else {
      // Substitua pelo link da App Store
      Linking.openURL("itms-apps://itunes.apple.com/app/id1234567890");
    }
  };

  // -----------------------------------------
  // 2) Lida com o login
  // -----------------------------------------
  const handleLogin = async () => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usu_login: login, usu_senha: senha }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Salva no AsyncStorage
        const userData = {
          cadCodigo: result.cad_codigo,
          cad_mail: result.cad_mail,
          cadNome: result.cad_nome,
          nivelAcesso: result.nivel_acesso,
          nomeNivel: result.nome_nivel,
        };
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));

        // Navega
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
        Alert.alert('Erro', result.message || 'Usuário/Senha inválidos.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    }
  };

  // Seleciona um nível de acesso em caso de multi_acesso
  const handleAccessLevelSelect = async (level) => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usu_login: login, usu_senha: senha }),
      });
      const result = await response.json();

      setIsModalVisible(false);
      // Redireciona à Home com o nivel selecionado
      navigation.navigate('Home', {
        nivelAcesso: level.ace_nivel_acesso,
        nomeNivel: level.niv_nome,
        cadNome: result.cad_nome,
        cadCodigo: result.cad_codigo,
      });
    } catch (error) {
      console.error('Erro ao selecionar nível de acesso:', error);
    }
  };

  // -----------------------------------------
  // 3) Recuperar Senha
  // -----------------------------------------
  const handleRecoverPassword = async () => {
    if (!recoverLogin) {
      Alert.alert('Erro', 'Por favor, insira o login.');
      return;
    }

    try {
      const url = `${RECOVER_URL}?login=${encodeURIComponent(recoverLogin)}`;
      console.log('URL de recuperação:', url);

      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Erro de conexão: ${response.status}`);
      }
      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Sucesso', 'A senha foi enviada para o seu e-mail.');
        setIsRecoverModalVisible(false);
      } else {
        Alert.alert('Erro', result.message || 'Erro ao recuperar senha.');
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro inesperado. Tente novamente.');
    }
  };

  // Se ainda estamos checando a versão, exibe um indicador
  if (loadingVersion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Verificando versão...</Text>
      </View>
    );
  }

  // -----------------------------------------
  // Render da Tela
  // -----------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* --------------- Modal: versão desatualizada --------------- */}
        <Modal
          visible={versionModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => {
            if (!forceUpdate) setVersionModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback 
            onPress={() => {
              if (!forceUpdate) setVersionModalVisible(false);
            }}
          >
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Ionicons name="warning-outline" size={48} color="red" />
            <Text style={styles.modalTitle}>Versão Desatualizada</Text>
            <Text style={styles.modalMessage}>{versionMessage}</Text>
            <View style={styles.modalButtons}>
              {forceUpdate ? (
                // Caso forçado, sem opção de ignorar
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={goToStore}
                >
                  <Text style={styles.updateButtonText}>Atualizar Agora</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={goToStore}
                  >
                    <Text style={styles.updateButtonText}>Atualizar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.updateButton, { backgroundColor: "gray" }]}
                    onPress={() => setVersionModalVisible(false)}
                  >
                    <Text style={styles.updateButtonText}>Mais Tarde</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* --------------- Layout do login --------------- */}
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />

        <TextInput
          placeholder="Usuário"
          value={login}
          onChangeText={setLogin}
          style={styles.input}
        />

        {/* Campo de senha com botão de mostrar/ocultar */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* Botão Login */}
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={versionModalVisible && forceUpdate}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.recoverButton]}
            onPress={() => setIsRecoverModalVisible(true)}
            disabled={versionModalVisible && forceUpdate}
          >
            <Text style={styles.buttonText}>Recuperar Senha</Text>
          </TouchableOpacity>
        </View>

        {/* Modal para seleção de nível de acesso (multi_access) */}
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
            <View style={{ maxHeight: 300 }}>
              <FlatList
                data={accessLevels}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.accessLevelButton}
                    onPress={() => handleAccessLevelSelect(item)}
                  >
                    <Text style={styles.accessLevelText}>
                      {item.niv_nome || 'Nível não especificado'}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
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

export default LoginScreen;

// --------------------------------- Estilos ---------------------------------
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
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
    maxHeight: '80%',
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
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#007BFF",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
});
