import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API_BASE_URL from './config';

const AdicionarFotoScreen = ({ route, navigation }) => {
  const { checklistId, cadCodigo } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);

  // Função para capturar foto com a câmera 📷
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'É necessário conceder permissão para usar a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Função para selecionar uma foto da galeria 🖼
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'É necessário conceder permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Função para upload da imagem 📤
  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert('Erro', 'Por favor, selecione ou tire uma foto.');
      return;
    }

    if (!checklistId || !cadCodigo) {
      Alert.alert('Erro', 'Parâmetros inválidos (checklistId ou cadCodigo ausente).');
      console.error('Erro: checklistId ou cadCodigo está ausente', { checklistId, cadCodigo });
      return;
    }

    let formData = new FormData();
    formData.append('checklist_id', String(checklistId)); // Converte para string
    formData.append('cadcodigo', String(cadCodigo)); // Converte para string
    formData.append('foto', {
      uri: selectedImage,
      name: `foto_${Date.now()}.jpg`,
      type: 'image/jpeg',
    });

    try {
      const response = await fetch(`${API_BASE_URL}/UploadFotoChecklist.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const text = await response.text(); // Captura a resposta antes do parse JSON
      console.log('Resposta da API:', text);

      try {
        const result = JSON.parse(text); // Agora faz o parse, se for JSON válido

        if (result.status === 'success') {
          Alert.alert('Sucesso', 'Foto enviada com sucesso!');
          navigation.goBack();
        } else {
          Alert.alert('Erro', result.message || 'Erro ao enviar a foto.');
        }
      } catch (jsonError) {
        // console.error('Erro ao analisar JSON:', jsonError);
        // Alert.alert('Erro', 'A resposta do servidor não é um JSON válido.');
      }
    } catch (error) {
      // console.error('Erro de rede:', error);
      // Alert.alert('Erro', 'Não foi possível conectar à API.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adicionar Foto</Text>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📷 Tirar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>🖼 Escolher da Galeria</Text>
      </TouchableOpacity>

      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.buttonText}>📤 Enviar Foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
    elevation: 3, // Sombras no Android
    shadowColor: '#000', // Sombras no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  uploadButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
    elevation: 3, // Sombras no Android
    shadowColor: '#000', // Sombras no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
});

export default AdicionarFotoScreen;
