import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Usando Ionicons
import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/distribuicao.php`;

const DistribuicaoOS = ({ navigation }) => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null); // ID da OS expandida

  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("Dados recebidos da API:", data);
        setOrdens(data);
      } catch (error) {
        console.error("Erro ao buscar ordens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  const toggleDropdown = (osId) => {
    setExpandedOS(expandedOS === osId ? null : osId);
  };

  // Navega para formulário de nova cotação
  const goToNovaCotacao = (osCodigo) => {
    navigation.navigate("DistribuicaoForm", { osCodigo });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const isExpanded = expandedOS === item.os_codigo;
    return (
      <View style={styles.card}>
        {/* Cabeçalho da OS */}
        <View style={styles.cardHeader}>
          {/* <Ionicons name="document-text-outline" size={22} color="#007BFF" /> */}
          <Text style={styles.cardTitle}>📝 Ordem de Serviço: {item.os_codigo}</Text>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.cardContent}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>🚗 Veículo:</Text> {item.veiculo_nome}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📅 Data:</Text> {item.os_data_lancamento}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📝 Observação:</Text> {item.os_obs}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>🔖 Status:</Text> {item.os_status_nome}
          </Text>
        </View>

        {/* Ações e botão de expandir */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.dropdownToggle}
            onPress={() => toggleDropdown(item.os_codigo)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="#4CAF50"
            />
          </TouchableOpacity>

          {/* Botão "Novo Orçamentista" */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => goToNovaCotacao(item.os_codigo)}
          >
            <Ionicons name="person-add-outline" size={16} color="#FFF" />
            <Text style={styles.addButtonText}>Novo Orçamentista</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown de Orçamentos (aparece quando isExpanded = true) */}
        {isExpanded && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>🛠️ Orçamentos:</Text>
            {item.orcamentos && item.orcamentos.length > 0 ? (
              item.orcamentos.map((orc) => (
                <View key={orc.orc_codigo} style={styles.orcamentoItem}>
                  <Text style={styles.orcamentoText}>
                    <Text style={styles.bold}>Código:</Text> {orc.orc_codigo}
                  </Text>
                  <Text style={styles.orcamentoText}>
                    <Text style={styles.bold}>Peças (R$):</Text>{" "}
                    {(parseFloat(orc.orc_vlr_total_pecas) || 0).toFixed(2)}
                  </Text>
                  <Text style={styles.orcamentoText}>
                    <Text style={styles.bold}>Mão de Obra (R$):</Text>{" "}
                    {(parseFloat(orc.orc_vlr_total_mao_de_obra) || 0).toFixed(2)}
                  </Text>
                  <Text style={styles.orcamentoText}>
                    <Text style={styles.bold}>Responsável:</Text>{" "}
                    {orc.responsavel_nome}
                  </Text>
                  <Text style={styles.orcamentoText}>
                    <Text style={styles.bold}>Status:</Text> {orc.orc_status_nome}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noOrcamentosText}>
                Nenhum orçamento encontrado.
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
        keyExtractor={(item) => item.os_codigo.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.loadingText}>Nenhuma OS encontrada.</Text>
        }
      />
    </ScrollView>
  );
};

export default DistribuicaoOS;

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
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
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
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
    marginLeft: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownToggle: {
    padding: 6,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  orcamentoItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orcamentoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  noOrcamentosText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});
