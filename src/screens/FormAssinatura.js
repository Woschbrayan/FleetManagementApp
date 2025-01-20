import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

const FormAssinatura = ({ route }) => {
  const { cadCodigo = "5", nivelAcesso = 999 } = route?.params || {}; // Valores padrão para testes

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    description: "",
    photo: null,
  });

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos da permissão para acessar sua galeria.");
      }
    };
    requestPermissions();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData((prevState) => ({ ...prevState, photo: result.assets[0] }));
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem: ", error);
    }
  };

  const handleSubmit = async () => {
    // Campos obrigatórios simples
    if (!formData.name || !formData.cpf || !formData.description) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    // Cria o payload JSON
    const payload = {
      registro: cadCodigo, // Código do registro
      usuariocodigo: cadCodigo,
      name: formData.name,
      cpf: formData.cpf,
      description: formData.description,
      nivelacesso: nivelAcesso,
      photo: formData.photo ? formData.photo.uri : null,
    };

    console.log("Dados Enviados:", payload);

    try {
      const response = await fetch("https://syntron.com.br/sistemas/apis/regsitro_assinatura.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Resposta da API:", result);

      if (response.ok) {
        Alert.alert("Sucesso", "Registro de assinatura inserido com sucesso!");
        setFormData({
          name: "",
          cpf: "",
          description: "",
          photo: null,
        });
      } else {
        Alert.alert("Erro", result.message || "Erro ao inserir registro. Tente novamente.");
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
          onChangeText={(text) => handleChange("name", text)}
          placeholder="Digite seu nome"
        />
      </View>

      <View>
        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          value={formData.cpf}
          onChangeText={(text) => handleChange("cpf", text)}
          placeholder="Digite seu CPF"
          keyboardType="numeric"
        />
      </View>

      <View>
        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Descrição"
          multiline
        />
      </View>

      <View style={styles.photoSection}>
        <Button title="Escolher Foto da Galeria" onPress={handleFileChange} />
        {formData.photo && formData.photo.uri ? (
          <Image source={{ uri: formData.photo.uri }} style={styles.photoPreview} />
        ) : null}
      </View>

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
