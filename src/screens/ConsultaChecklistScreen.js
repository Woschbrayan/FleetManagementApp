import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "./config";

const ConsultaChecklistScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, cadCodigo } = route.params || {};

  const [checklists, setChecklists] = useState([]);
  const [dropdownVisibleFotos, setDropdownVisibleFotos] = useState({});
  const [dropdownVisibleItens, setDropdownVisibleItens] = useState({});

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/ConsultaChecklistScreen.php?groupId=${groupId}`
        );
        const result = await response.json();

        if (result.status === "success") {
          setChecklists(result.checklists);
        } else {
          Alert.alert(
            "Erro",
            result.message || "Não foi possível carregar os checklists."
          );
        }
      } catch (error) {
        console.error("Erro ao buscar checklist:", error);
        Alert.alert("Erro", "Não foi possível conectar à API.");
      }
    };

    fetchChecklist();
  }, [groupId]);

  // Formata data ISO => DD/MM/AAAA
  const formatarData = (dataIso) => {
    if (!dataIso) return "Data não disponível";
    const dataObj = new Date(dataIso);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Toggle de FOTOS
  const toggleDropdownFotos = async (id) => {
    setDropdownVisibleFotos((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));

    // Se não estava visível, buscar fotos
    if (!dropdownVisibleFotos[id]) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/ConsultaChecklistScreen.php?checklist_id=${id}`
        );
        const result = await response.json();

        if (result.status === "success") {
          setChecklists((prevChecklists) =>
            prevChecklists.map((checklist) =>
              checklist.id === id
                ? { ...checklist, fotos: result.fotos }
                : checklist
            )
          );
        } else {
          Alert.alert(
            "Erro",
            result.message || "Não foi possível carregar as fotos."
          );
        }
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        Alert.alert("Erro", "Não foi possível conectar à API.");
      }
    }
  };

  // Toggle de ITENS
  const toggleDropdownItens = async (id) => {
    setDropdownVisibleItens((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));

    // Se não estava visível, buscar itens
    if (!dropdownVisibleItens[id]) {
      try {
        // Nova API que criamos (ItensChecklistApi.php)
        const response = await fetch(
          `${API_BASE_URL}/ItensChecklistApi.php?idCheck=${id}`
        );
        const result = await response.json();

        if (result.status === "success") {
          setChecklists((prevChecklists) =>
            prevChecklists.map((checklist) =>
              checklist.id === id
                ? { ...checklist, itens: result.items }
                : checklist
            )
          );
        } else {
          Alert.alert(
            "Erro",
            result.message || "Não foi possível carregar os itens."
          );
        }
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
        Alert.alert("Erro", "Não foi possível conectar à API.");
      }
    }
  };

  // Navegação para AdicionarFotoScreen
  const handleAddPhoto = (checklistId) => {
    navigation.navigate("AdicionarFotoScreen", { checklistId, cadCodigo });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {checklists.length > 0 ? (
        checklists.map((checklist) => {
          // FOTOS e ITENS
          const fotosVisiveis = dropdownVisibleFotos[checklist.id];
          const itensVisiveis = dropdownVisibleItens[checklist.id];

          return (
            <View key={checklist.id} style={styles.card}>
              {/* Cabeçalho */}
              <View style={styles.cardHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#007BFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.cardTitle}>Checklist: {checklist.id}</Text>
              </View>

              {/* Dados principais */}
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>🚗 Veículo:</Text>{" "}
                  {checklist.detalhes_veiculo}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>👤 Avaliador:</Text>{" "}
                  {checklist.avaliador_nome}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>📅 Data:</Text>{" "}
                  {formatarData(checklist.ava_data)}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>⛽ KM:</Text> {checklist.ava_km}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>🛢️ Troca de Óleo:</Text>{" "}
                  {formatarData(checklist.ava_data_troca_oleo)}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>📝 Observações:</Text>{" "}
                  {checklist.ava_obs || "Nenhuma observação."}
                </Text>
              </View>

              {/* Botões para FOTOS e ITENS */}
              <View style={styles.buttonRow}>
                {/* Botão FOTOS */}
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdownFotos(checklist.id)}
                >
                  <Ionicons
                    name={
                      fotosVisiveis ? "chevron-up-outline" : "chevron-down-outline"
                    }
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.buttonText}>
                    {fotosVisiveis ? "Ocultar Imagens" : "Mostrar Imagens"}
                  </Text>
                </TouchableOpacity>

                {/* Botão ITENS */}
                <TouchableOpacity
                  style={[styles.dropdownButton, { backgroundColor: "#6C757D" }]}
                  onPress={() => toggleDropdownItens(checklist.id)}
                >
                  <Ionicons
                    name={
                      itensVisiveis ? "chevron-up-outline" : "chevron-down-outline"
                    }
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.buttonText}>
                    {itensVisiveis ? "Ocultar Itens" : "Mostrar Itens"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Área de IMAGENS (se fotosVisiveis) */}
              {fotosVisiveis && (
                <View style={styles.imageGrid}>
                  {checklist.fotos && checklist.fotos.length > 0 ? (
                    checklist.fotos.map((foto, index) => (
                      <View
                        key={foto.id}
                        style={[
                          styles.imageCard,
                          index % 2 === 0 ? { marginRight: 10 } : {},
                        ]}
                      >
                        <Image source={{ uri: foto.foto_url }} style={styles.image} />
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noImagesText}>
                      Nenhuma foto encontrada.
                    </Text>
                  )}
                </View>
              )}

              {/* Área de ITENS (se itensVisiveis) */}
              {itensVisiveis && (
                <View style={styles.itensContainer}>
                  {checklist.itens && checklist.itens.length > 0 ? (
                    checklist.itens.map((item) => (
                      <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemText}>
                          <Text style={styles.bold}> {item.item}:</Text>{" "}
                          {item.status === "OK" ? (
                            <Text style={{ color: "green" }}>{item.status}</Text>
                          ) : (
                            <Text style={{ color: "red" }}>{item.status}</Text>
                          )}
                        </Text>
                        {item.obs ? (
                          <Text style={styles.itemObsText}>
                            Obs: {item.obs}
                          </Text>
                        ) : null}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noItemsText}>
                      Nenhum item encontrado.
                    </Text>
                  )}
                </View>
              )}

              {/* Botão Adicionar Foto */}
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => handleAddPhoto(checklist.id)}
              >
                <Ionicons name="camera-outline" size={18} color="#FFF" />
                <Text style={styles.buttonText}>Adicionar Foto</Text>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <Text style={styles.loadingText}>Carregando checklists...</Text>
      )}
    </ScrollView>
  );
};

export default ConsultaChecklistScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
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
  // Linha de Botões (Mostrar Imagens / Mostrar Itens)
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
  // Grid de imagens
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageCard: {
    width: "48%",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  noImagesText: {
    flex: 1,
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
    marginTop: 10,
  },
  // Botão de adicionar foto
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 10,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  // Itens do Checklist
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

    // Sombra
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
