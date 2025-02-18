import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  Alert, 
  StyleSheet, 
  Image 
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import API_BASE_URL from "./config"; // Importando a variável

const FormAssinatura = ({ route }) => {
  const { cadCodigo, nivelAcesso, osCodigo } = route?.params || {}; // Valores padrão para testes

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    description: "",
    photo: null,
  });

  useEffect(() => {
    if (nivelAcesso === 252) {
      const requestPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão necessária", "Precisamos da permissão para acessar sua câmera.");
        }
      };
      requestPermissions();
    }
  }, []);

  // Função para validar CPF (verifica se tem 11 números)
  const validarCPF = (cpf) => {
    const cpfNumerico = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    return cpfNumerico.length === 11;
  };

  // Função para formatar CPF no padrão 000.000.000-00
  const formatarCPF = (cpf) => {
    const cpfNumerico = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cpfNumerico.length === 11) {
      return cpfNumerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf; // Retorna sem alteração se não tiver 11 dígitos
  };

  // Função para capturar imagem
  const handleFileChange = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setFormData((prevState) => ({ ...prevState, photo: result.assets[0] }));
      }
    } catch (error) {
      console.error("Erro ao capturar imagem: ", error);
    }
  };

  // Função para validar e enviar os dados
  const handleSubmit = async () => {
    // Verifica se todos os campos foram preenchidos
    if (!formData.name || !formData.cpf || !formData.description) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Valida o CPF antes de enviar
    if (!validarCPF(formData.cpf)) {
      Alert.alert("Erro", "CPF inválido. Certifique-se de que possui 11 dígitos numéricos.");
      return;
    }

    // Formata o CPF corretamente
    const cpfFormatado = formatarCPF(formData.cpf);

    const payload = new FormData();
    payload.append("registro", osCodigo);
    payload.append("usuariocodigo", cadCodigo);
    payload.append("name", formData.name);
    payload.append("cpf", cpfFormatado);
    payload.append("description", formData.description);
    payload.append("nivelacesso", nivelAcesso);
    
    if (nivelAcesso === 252 && formData.photo) {
      payload.append("photo", {
        uri: formData.photo.uri,
        name: `foto_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }

    console.log("Enviando dados:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/regsitro_assinatura.php?acao=Assinado`,{
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: payload,
        }
      );

      const text = await response.text();
      console.log("Resposta do servidor:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (jsonError) {
        console.error("Erro ao converter JSON:", jsonError);
        Alert.alert("Erro", "A resposta do servidor não está no formato JSON esperado.");
        return;
      }

      console.log("Resposta JSON da API:", result);

      if (response.ok) {
        Alert.alert("Sucesso", "Registro de assinatura inserido com sucesso!");
        setFormData({
          name: "",
          cpf: "",
          description: "",
          photo: null,
        });
      } else {
        Alert.alert("Erro", result.message || "Erro ao inserir registro.");
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Erro de rede ao enviar os dados.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Formulário de Assinatura</Text>

      <View>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Digite seu nome"
        />
      </View>

      <View>
        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          value={formData.cpf}
          onChangeText={(text) => setFormData({ ...formData, cpf: formatarCPF(text) })}
          placeholder="Digite seu CPF"
          keyboardType="numeric"
          maxLength={14} // Garante que o CPF não ultrapasse o formato correto
        />
      </View>

      <View>
        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Descrição"
          multiline
        />
      </View>

      {nivelAcesso === 252 && (
        <View style={styles.photoSection}>
          <Button title="Tirar Foto" onPress={handleFileChange} />
          {formData.photo && formData.photo.uri ? (
            <Image source={{ uri: formData.photo.uri }} style={styles.photoPreview} />
          ) : null}
        </View>
      )}

      <Button title="Assinar" onPress={handleSubmit} color="#28a745" />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  photoSection: {
    marginVertical: 20,
    alignItems: "center",
  },
  photoPreview: {
    marginTop: 10,
    width: 150,
    height: 150,
    borderRadius: 8,
  },
});

export default FormAssinatura;
