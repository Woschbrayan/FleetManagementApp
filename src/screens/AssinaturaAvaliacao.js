import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
// import * as ImagePicker from "expo-image-picker";

const assinaturaAvaliacao = ({ route, navigation }) => {
  const { osCodigo } = route.params;
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [foto, setFoto] = useState(null);

  const selecionarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.uri);
    }
  };

  const salvarAssinatura = () => {
    if (!nome || !cpf || !foto) {
      Alert.alert("Erro", "Preencha todos os campos e tire a foto.");
      return;
    }

    // Envie os dados para o backend
    console.log({
      osCodigo,
      nome,
      cpf,
      foto,
    });

    Alert.alert("Sucesso", "Assinatura salva com sucesso!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Assinar OS: ${osCodigo}`}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        keyboardType="numeric"
        value={cpf}
        onChangeText={setCpf}
      />

      <TouchableOpacity style={styles.photoButton} onPress={selecionarFoto}>
        <Text style={styles.photoButtonText}>
          {foto ? "Alterar Foto" : "Tirar Foto"}
        </Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto }} style={styles.image} />}

      <TouchableOpacity style={styles.saveButton} onPress={salvarAssinatura}>
        <Text style={styles.saveButtonText}>Salvar Assinatura</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  photoButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  photoButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default assinaturaAvaliacao;
