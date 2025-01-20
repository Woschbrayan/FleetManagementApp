import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

const ReplicaOrcamento = ({ route }) => {
  const [credenciados, setCredenciados] = useState([]);
  const [selectedCredenciado, setSelectedCredenciado] = useState("");
  const [loading, setLoading] = useState(false);

  const API_REPLICAR_URL = "https://syntron.com.br/sistemas/apis/reabreReplica.php";

  // Função para buscar os credenciados
  const fetchCredenciados = async (osId, orcamentoId) => {
    setLoading(true);
    try {
      const API_CREDENCIADOS_URL = "https://syntron.com.br/sistemas/apis/reabreReplica.php";
      console.log("Enviando parâmetros:", { osId, orcamentoId });

      const response = await fetch(API_CREDENCIADOS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "buscacred", // Ação definida no backend
          osId: osId,
          orcamentoId: orcamentoId,
        }),
      });

      const rawResponse = await response.text();
      console.log("Resposta da API (bruta):", rawResponse);

      const data = JSON.parse(rawResponse);
      console.log("Resposta da API (JSON):", data);

      if (data.success) {
        const formattedData = data.data.map((credenciado) => ({
          ...credenciado,
          cad_codigo: String(credenciado.cad_codigo), // Garante que o código seja string
        }));
        setCredenciados(formattedData);
      } else {
        Alert.alert("Erro", data.message || "Não foi possível carregar os credenciados.");
      }
    } catch (error) {
      console.error("Erro ao buscar credenciados:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os credenciados.");
    } finally {
      setLoading(false);
    }
  };

  // Função para replicar o orçamento
  const handleReplicar = async () => {
    if (!selectedCredenciado) {
      Alert.alert("Erro", "Selecione um credenciado antes de replicar.");
      return;
    }

    try {
      setLoading(true);

      const { orcamentoId, osId } = route.params;
      const response = await fetch(API_REPLICAR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orcamentoId: orcamentoId,
            osId: osId,
          cad_codigo: selectedCredenciado,
          action: "replicar", // Ação definida no backend
        }),
      });

      const data = await response.json();
      console.log("Resposta da API para replicação:", data);

      if (data.success) {
        Alert.alert("Sucesso", "Orçamento replicado com sucesso!");
      } else {
        Alert.alert("Erro", data.message || "Erro ao replicar orçamento.");
      }
    } catch (error) {
      console.error("Erro ao replicar orçamento:", error);
      Alert.alert("Erro", "Ocorreu um erro ao replicar o orçamento.");
    } finally {
      setLoading(false);
    }
  };

  // Chamar a API ao montar o componente
  useEffect(() => {
    const { orcamentoId, osId } = route.params;
    fetchCredenciados(osId, orcamentoId);
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Replicar Orçamento</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Text style={styles.label}>Selecione um Credenciado:</Text>
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={selectedCredenciado}
              onValueChange={(itemValue) => setSelectedCredenciado(itemValue)}
              style={styles.select}
            >
              <Picker.Item label="Selecione um credenciado" value="" />
              {credenciados.map((credenciado) => (
                <Picker.Item
                  key={credenciado.cad_codigo}
                  label={`${credenciado.usuario_nome} (${credenciado.cad_codigo})`}
                  value={credenciado.cad_codigo}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleReplicar}>
            <Text style={styles.buttonText}>Replicar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  
  select: {
    height: 50,
    padding: 10,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 220,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReplicaOrcamento;
