import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ícones Ionicons
import API_BASE_URL from "./config";

const API_ORDENS = `${API_BASE_URL}/consultar_ordens.php`;

const RelatorioOsStatus = ({ route }) => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtém o status passado pela navegação
  const { statusOS } = route.params || {};

  useEffect(() => {
    if (statusOS) {
      buscarOrdens(statusOS);
    } else {
      Alert.alert("Erro", "Nenhum status foi informado.");
      setLoading(false);
    }
  }, [statusOS]);

  // Função para buscar as O.S. conforme o status recebido
  const buscarOrdens = async (statusOS) => {
    try {
      const response = await fetch(`${API_ORDENS}?status=${statusOS}`);
      const data = await response.json();

      if (!data.error) {
        setOrdens(data.data);
      } else {
        Alert.alert("Erro", "Nenhuma O.S. encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar Ordens de Serviço:", error);
      Alert.alert("Erro", "Não foi possível carregar as Ordens de Serviço.");
    } finally {
      setLoading(false);
    }
  };

  // Formata data ISO para "DD/MM/AAAA HH:mm"
  const formatarData = (dataIso) => {
    if (!dataIso) return "Data não disponível";
    const dataObj = new Date(dataIso);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, "0");
    const minutos = String(dataObj.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  // Define cores para cada status
  const getStatusColor = (status) => {
    switch (status) {
      case "RO":
        return { color: "#FFC107" }; // Amarelo - Registro de Ocorrência
      case "EO":
        return { color: "#007BFF" }; // Azul - Em Orçamentação
      case "AE":
        return { color: "#28A745" }; // Verde - Autorizada Execução
      case "FN":
        return { color: "#DC3545" }; // Vermelho - Finalizada
      default:
        return { color: "#555" };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const statusStyle = getStatusColor(item.os_status);

    return (
      <View style={styles.card}>
        {/* Cabeçalho da Card */}
        <View style={styles.cardHeader}>
          {/* Ícone Ionicons (document-text-outline) */}
          {/* <Ionicons name="document-text-outline" size={22} color="#007BFF" /> */}
          <Text style={styles.cardTitle}>📝 O.S.: {item.os_codigo}</Text>
        </View>

        <View style={styles.divider} />

        {/* Conteúdo Principal */}
        <View style={styles.cardContent}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>🚗 Veículo:</Text>{" "}
            {item.veiculo_detalhes || "Não informado"}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📅 Data:</Text>{" "}
            {formatarData(item.os_data_lancamento)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>👤 Responsável:</Text>{" "}
            {item.responsavel_nome || "Não informado"}
          </Text>
        </View>

        {/* Status */}
        <Text style={[styles.statusText, statusStyle]}>
          Em Orçamentação
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={ordens}
      keyExtractor={(item) => item.os_codigo.toString()}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma Ordem de Serviço encontrada para este status.
          </Text>
        </View>
      }
    />
  );
};

export default RelatorioOsStatus;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  // Caso não tenha OS
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  // Cartão principal
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    margin: 10,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#CED0CE",
    marginVertical: 8,
  },
  cardContent: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 6,
  },
});
