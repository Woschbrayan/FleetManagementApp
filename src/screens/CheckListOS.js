import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ícones Ionicons
import moment from "moment";
import "moment/locale/pt-br"; // Se quiser forçar local para pt-BR
import API_BASE_URL from "./config";

// Substitua "API_BASE_URL" pela URL real da sua API, se necessário
const API_URL = `${API_BASE_URL}/ordensSevicoCheck.php`;

const CheckListOS = ({ navigation, route }) => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null); // Controla a OS expandida
  const { cadCodigo } = route.params || {};

  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Erro ao buscar dados: " + response.statusText);
        }
        const data = await response.json();
        // Confirma se a resposta é um array
        if (Array.isArray(data)) {
          setOrdens(data);
        } else {
          console.error("Resposta da API não é um array válido:", data);
          setOrdens([]);
        }
      } catch (error) {
        console.error("Erro ao buscar ordens:", error);
        Alert.alert("Erro", "Não foi possível carregar as ordens de serviço.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  // Formata data com Moment
  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY HH:mm");
  };

  // Renderiza detalhes de um checklist (Entrada ou Saída)
  const renderChecklistDetails = (checklist) => {
    // Converte "S"/"N" em "Ok"/"Não Ok"
    const formatField = (field) => (field === "S" ? "Ok" : "Não Ok");

    return (
      <View style={styles.checklistCard}>
        {/* Título do Checklist (Entrada ou Saída) */}
        <View style={styles.checklistHeader}>
          <Text style={styles.checklistTitle}>
            {checklist.chc_entrada === "S"
              ? "📌 Checklist de Entrada"
              : "📌 Checklist de Saída"}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Dados de Entrada */}
        {checklist.chc_entrada === "S" && (
          <>
            <Text style={styles.checklistText}>
              <Text style={styles.bold}>👤 Entrada por:</Text>{" "}
              {checklist.usuario_entrada_nome || "N/A"}
            </Text>
            <Text style={styles.checklistText}>
              <Text style={styles.bold}>📅 Data Entrada:</Text>{" "}
              {formatDate(checklist.chc_data_entrada)}
            </Text>
            <Text style={styles.checklistText}>
              <Text style={styles.bold}>📝 Obs. Entrada:</Text>{" "}
              {checklist.chc_obs_entrada || "Sem observação"}
            </Text>
          </>
        )}

        {/* Dados de Saída */}
        {checklist.chc_saida === "S" && (
          <>
            <Text style={styles.checklistText}>
              <Text style={styles.bold}>👤 Saída por:</Text>{" "}
              {checklist.usuario_saida_nome || "N/A"}
            </Text>
            <Text style={styles.checklistText}>
              <Text style={styles.bold}>📅 Data Saída:</Text>{" "}
              {formatDate(checklist.chc_data_saida)}
            </Text>
            <Text style={styles.checklistText}>
              <Text style={styles.bold}>📝 Obs. Saída:</Text>{" "}
              {checklist.chc_obs_saida || "Sem observação"}
            </Text>
          </>
        )}

        {/* Demais campos do checklist */}
        <Text style={styles.checklistText}>
          <Text style={styles.bold}>Vidros:</Text> {formatField(checklist.e1)}
        </Text>
        <Text style={styles.checklistText}>
          <Text style={styles.bold}>Pintura:</Text> {formatField(checklist.e2)}
        </Text>
        <Text style={styles.checklistText}>
          <Text style={styles.bold}>Limpeza Interna:</Text>{" "}
          {formatField(checklist.e3)}
        </Text>
        <Text style={styles.checklistText}>
          <Text style={styles.bold}>Manuais:</Text> {formatField(checklist.e4)}
        </Text>
        <Text style={styles.checklistText}>
          <Text style={styles.bold}>Palhetas:</Text> {formatField(checklist.e5)}
        </Text>
      </View>
    );
  };

  // Se está carregando, exibe o indicador de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  // Renderiza cada OS no FlatList
  const renderItem = ({ item }) => {
    const isExpanded = expandedOS === item.os_codigo;

    return (
      <View style={styles.card}>
        {/* Cabeçalho da OS */}
        <View style={styles.cardHeader}>
          {/* <Ionicons name="document-text-outline" size={22} color="#007BFF" /> */}
          <Text style={styles.cardTitle}>📝 Ordem de Serviço: {item.os_codigo}</Text>
        </View>

        <View style={styles.divider} />

        {/* Informações básicas da OS */}
        <View style={styles.cardContent}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>🚗 Veículo:</Text>{" "}
            {item.veiculo_detalhes || "Não informado"}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📅 Data:</Text> {item.os_data_lancamento}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📝 Observação:</Text> {item.os_obs || "N/A"}
          </Text>
        </View>

        {/* Ícone para expandir/recolher checklists */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.dropdownIcon}
            onPress={() => setExpandedOS(isExpanded ? null : item.os_codigo)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={26}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        {/* Se expandido, mostra checklists */}
        {isExpanded && (
          <View style={styles.expandedArea}>
            {item.checklists && item.checklists.length > 0 ? (
              item.checklists.map((checklist, index) => (
                <View key={index} style={styles.checklistWrapper}>
                  {renderChecklistDetails(checklist)}
                </View>
              ))
            ) : (
              <Text style={styles.emptyChecklistText}>
                Nenhum checklist encontrado.
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={ordens}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={22} color="#007BFF" />
              <Text style={styles.cardTitle}>Nenhuma Ordem de Serviço</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.emptyText}>
              Ainda não há OS disponível para checklist.
            </Text>
          </View>
        }
      />
    </ScrollView>
  );
};

export default CheckListOS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },

  // Card principal
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,

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
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
    marginLeft: 2,
  },
  divider: {
    // height:1 ,
    // backgroundColor: "#CED0CE",
    marginVertical: 8,
  },
  cardContent: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dropdownIcon: {
    padding: 4,
  },
  expandedArea: {
    marginTop: 10,
  },

  // Cartão do Checklist (Entrada/Saída)
  checklistWrapper: {
    marginBottom: 8,
  },
  checklistCard: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    padding: 10,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checklistHeader: {
    marginBottom: 6,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  checklistText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },

  emptyChecklistText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 8,
  },
});
