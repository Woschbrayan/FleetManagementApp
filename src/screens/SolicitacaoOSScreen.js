import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/solicitacao.php`;
const API_ITENS_URL = `${API_BASE_URL}/ItensChecklistApi.php`;

const SolicitationListScreen = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState({});       // imagens
  const [dropdownVisibleItens, setDropdownVisibleItens] = useState({}); // itens

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === "success") {
          const formattedData = data.data.map((item) => ({
            ...item,
            datainserido: formatDate(item.datainserido),
          }));
          setSolicitacoes(formattedData);
        } else {
          Alert.alert("Erro", data.message || "Erro ao buscar as solicitações");
        }
      } catch (error) {
        Alert.alert("Erro", error.message);
      }
    };

    fetchSolicitacoes();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", options);
  };

  const handleAction = async (id, action) => {
    const actionUrl = `${API_URL}?acao=${action}&id=${id}`;
    try {
      const response = await fetch(actionUrl, { method: "GET" });
      const data = await response.json();
      if (data.status === "success") {
        Alert.alert(
          "Sucesso",
          `Solicitação ${
            action === "aprovar" ? "aprovada" : "recusada"
          } com sucesso.`
        );
        setSolicitacoes((prev) => prev.filter((item) => item.id !== id));
      } else {
        Alert.alert("Erro", data.message || "Erro ao processar a ação.");
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  // Mostrar/ocultar imagens
  const toggleDropdown = async (idvistoria) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [idvistoria]: !prev[idvistoria],
    }));

    if (!dropdownVisible[idvistoria]) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/ConsultaChecklistScreen.php?checklist_id=${idvistoria}`
        );
        const result = await response.json();

        if (result.status === "success") {
          setSolicitacoes((prev) =>
            prev.map((item) =>
              item.idvistoria === idvistoria
                ? { ...item, fotos: result.fotos }
                : item
            )
          );
        } else {
          Alert.alert("Erro", result.message || "Erro ao buscar as imagens.");
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível conectar à API.");
      }
    }
  };

  // Mostrar/ocultar itens
  const toggleDropdownItens = async (idvistoria) => {
    setDropdownVisibleItens((prev) => ({
      ...prev,
      [idvistoria]: !prev[idvistoria],
    }));

    if (!dropdownVisibleItens[idvistoria]) {
      try {
        const response = await fetch(`${API_ITENS_URL}?idCheck=${idvistoria}`);
        const data = await response.json();

        if (data.status === "success") {
          setSolicitacoes((prev) =>
            prev.map((sol) =>
              sol.idvistoria === idvistoria
                ? { ...sol, itensChecklist: data.items }
                : sol
            )
          );
        } else {
          Alert.alert("Erro", data.message || "Erro ao buscar os itens.");
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível conectar à nova API de itens.");
      }
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = dropdownVisible[item.idvistoria] === true;        // imagens
    const isExpandedItens = dropdownVisibleItens[item.idvistoria] === true; // itens

    return (
      <View style={styles.card}>
        {/* Cabeçalho */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🗒 Solicitação: {item.id}</Text>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>👤 Solicitante:</Text> {item.user_name}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>🚗 Veículo:</Text> {item.veiculo_detalhes}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>📅 Data:</Text> {item.datainserido}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>📝 Observações:</Text>{" "}
            {item.observacao || "Sem observação"}
          </Text>

          {/* Status colorido */}
          <Text
            style={[
              styles.status,
              item.status === "cancelado" ? styles.statusRed :
              item.status === "lançado" ? styles.statusmiddle : styles.statusGreen,
            ]}
          >
            <Ionicons name="alert-circle-outline" size={16} /> {item.status}
          </Text>
        </View>

        {/* Botões Aprovar/Recusar se status ainda não estiver definido */}
        {item.status !== "cancelado" && item.status !== "autorizado" && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleAction(item.id, "aprovar")}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Aprovar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleAction(item.id, "recusar")}
            >
              <Ionicons name="close-circle-outline" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Recusar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Linha com 2 botões: Imagens e Itens */}
        <View style={styles.buttonRow}>
          {/* Botão: IMAGENS */}
          <TouchableOpacity
            style={[styles.actionButton, styles.mr5]}
            onPress={() => toggleDropdown(item.idvistoria)}
          >
            <Ionicons name="images-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>
              {isExpanded ? "Ocultar Imagens" : "Ver Imagens"}
            </Text>
          </TouchableOpacity>

          {/* Botão: ITENS */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#6C757D" }, styles.ml5]}
            onPress={() => toggleDropdownItens(item.idvistoria)}
          >
            <Ionicons
              name={isExpandedItens ? "chevron-up-outline" : "chevron-down-outline"}
              size={18}
              color="#FFF"
            />
            <Text style={styles.buttonText}>
              {isExpandedItens ? "Ocultar Itens" : "Ver Itens"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grid de imagens (aparece se isExpanded = true) */}
        {isExpanded && item.fotos && (
          <View style={styles.imageGrid}>
            {item.fotos.length > 0 ? (
              item.fotos.map((foto) => (
                <View key={foto.id} style={styles.imageCard}>
                  <Image source={{ uri: foto.foto_url }} style={styles.image} />
                </View>
              ))
            ) : (
              <Text style={styles.noImagesText}>Nenhuma imagem encontrada.</Text>
            )}
          </View>
        )}

        {/* Itens do checklist (aparece se isExpandedItens = true) */}
        {isExpandedItens && (
          <View style={styles.itensContainer}>
            {item.itensChecklist && item.itensChecklist.length > 0 ? (
              item.itensChecklist.map((obj) => (
                <View key={obj.id} style={styles.itemRow}>
                  <Text style={styles.itemText}>
                    <Text style={styles.bold}>• {obj.item}:</Text>{" "}
                    {obj.status === "OK" ? (
                      <Text style={{ color: "green" }}>{obj.status}</Text>
                    ) : (
                      <Text style={{ color: "red" }}>{obj.status}</Text>
                    )}
                  </Text>
                  {obj.obs ? (
                    <Text style={styles.itemObsText}>Observação: {obj.obs}</Text>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>Nenhum item encontrado.</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={solicitacoes}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma solicitação encontrada.</Text>
        }
      />
    </ScrollView>
  );
};

export default SolicitationListScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 30,
  },
  // CARD
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
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
  },
  cardContent: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  status: {
    fontSize: 16,
    marginTop: 6,
  },
  statusGreen: {
    color: "green",
  },
  statusRed: {
    color: "red",
  },
  statusmiddle: {
    color: "gray",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    justifyContent: "center",
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
  // Dupla de botões (Imagens / Itens)
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    flex: 1,
  },
  // Margens para separar
  mr5: {
    marginRight: 5,
  },
  ml5: {
    marginLeft: 5,
  },
  // Grid de imagens
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "flex-start",
  },
  imageCard: {
    width: "48%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
    marginRight: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  noImagesText: {
    flex: 1,
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginTop: 10,
  },
  // Container de itens do checklist
  itensContainer: {
    marginTop: 10,
    backgroundColor: "#E9ECEF",
    padding: 10,
    borderRadius: 6,
  },
  itemRow: {
    marginBottom: 8,
    padding: 6,
    borderRadius: 4,
    backgroundColor: "#FFF",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
  itemObsText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginTop: 2,
  },
  noItemsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
  },
});
