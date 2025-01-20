import React, { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// const API_ENDPOINT ="http://192.168.100.63/apis/inserirCotacao.php?action=inserirCredenciado";

const API_ENDPOINT ="https://syntron.com.br/sistemas/apis/inserirCotacao.php?action=inserirCredenciado";
const DistribuicaoForm = () => {
  const route = useRoute(); // Hook para obter os parâmetros da rota
  const navigation = useNavigation(); // Hook para navegação
  const { osCodigo } = route.params; // Obtém o parâmetro 'osCodigo'
  const [credenciados, setCredenciados] = useState([]);
  const [selectedCredenciado, setSelectedCredenciado] = useState("");

  useEffect(() => {
    fetchCredenciados();
  }, []);

  // Busca lista de credenciados
  const fetchCredenciados = async () => {
    try {
      const response = await fetch(
        API_ENDPOINT.replace("?action=inserirCredenciado", ""),
        { method: "GET" }
      );
      const data = await response.json();
      if (data.success) {
        setCredenciados(data.data);
      } else {
        Alert.alert("Erro", "Não foi possível carregar os credenciados.");
      }
    } catch (error) {
      console.error("Erro ao buscar credenciados:", error);
      Alert.alert("Erro", "Falha ao carregar credenciados.");
    }
  };

  // Insere cotação na API
  const inserirCotacao = async () => {
    if (!selectedCredenciado) {
      Alert.alert("Erro", "Selecione um credenciado válido.");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cad_codigo: selectedCredenciado,
          os: osCodigo,
        }),
      });

      console.log(selectedCredenciado);
      console.log(osCodigo);

      const data = await response.json();

      if (data.success) {
        Alert.alert("Sucesso", "Cotação inserida com sucesso!");
        navigation.goBack();
      } else {
        Alert.alert("Erro", data.error || "Não foi possível inserir a cotação.");
      }
    } catch (error) {
      console.error("Erro ao inserir cotação:", error);
      Alert.alert("Erro", `Falha ao inserir cotação: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Selecione o Credenciado:</Text>
      <Picker
        selectedValue={selectedCredenciado}
        onValueChange={(itemValue) => setSelectedCredenciado(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione..." value="" />
        {credenciados.map((credenciado) => (
         <Picker.Item
         key={credenciado.cad_codigo.toString()}
         label={credenciado.cad_nome}
         value={credenciado.cad_codigo.toString()}
       />
       
        ))}
      </Picker>
      <Button title="Inserir Cotação" onPress={inserirCotacao} color="#4CAF50" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  picker: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
  },
});

export default DistribuicaoForm;
