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
import API_BASE_URL from "./config";

// Constantes de URL da API
const API_BASE_URL_ORDEN = `${API_BASE_URL}/ordensSevico.php?status=avaliacao`;
const API_AVALIACAO_URL = `${API_BASE_URL}/avaliacaOrc.php`;

const AvaliacaoOS = ({ navigation, route }) => {
  const { cadCodigo, nivelAcesso } = route.params || {};

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);

  // Limites de alçada por nível de acesso
  const limitesAlcada = {
    223: 10000,  // Gerente Operacional
    224: 50000,  // Diretor Operacional
    225: 5000,   // Coordenação Operacional
    227: 2000,   // Supervisor de Frota
    228: 10000,  // Gerente de Frota
    229: 50000,  // Diretor de Frota
    999: 99999999,
  };

  // Mapeia o status para rótulos e cores
  const getStatusInfo = (status) => {
    switch (status) {
      case "RS":
        return { label: "Recusado", color: "#dc3545" }; // Vermelho
      case "AT":
        return { label: "Autorizado", color: "#28a745" }; // Verde
      case "LC":
        return { label: "Lançado", color: "#6c757d" };   // Cinza
      default:
        return { label: "Desconhecido", color: "#000000" }; // Preto
    }
  };

  // Fetch das Ordens de Serviço
  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const response = await fetch(API_BASE_URL_ORDEN);
        const data = await response.json();
        setOrdens(data);
      } catch (error) {
        console.error("Erro ao buscar ordens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  // Expandir/Recolher o card
  const toggleDropdown = (osId) => {
    setExpandedOS(expandedOS === osId ? null : osId);
  };

  // Verifica se o valor total está dentro do limite de alçada do usuário
  const verificarLimite = (valorTotal) => {
    const limite = limitesAlcada[nivelAcesso];
    if (limite === undefined) {
      console.warn(`Nível de acesso (${nivelAcesso}) não configurado para limite.`);
      return false;
    }
    return valorTotal <= limite;
  };

  // Navega para a tela de considerar o orçamento
  const handleConsiderar = (orcCodigo, osCodigo) => {
    navigation.navigate("ConsiderarOrc", { orcCodigo, osCodigo, cadCodigo, nivelAcesso });
  };

  // Autorizar orçamento
  const handleAutorizar = async (orcCodigo, valorTotal) => {
    try {
      const response = await fetch(API_AVALIACAO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acao: 1, // 1 = Autorizar
          orcCodigo,
          valorTotal,
          nivelAcesso,
          cad_codigo: cadCodigo,
        }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Sucesso", "Orçamento autorizado com sucesso.");
      } else {
        Alert.alert("Erro", data.message || "Erro ao autorizar.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível comunicar com a API.");
    }
  };

  // Recusar orçamento
  const handleRecusar = async (orcCodigo, valorTotal) => {
    try {
      const response = await fetch(API_AVALIACAO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acao: 2, // 2 = Recusar
          orcCodigo,
          valorTotal,
          nivelAcesso,
          cad_codigo: cadCodigo,
        }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Sucesso", "Orçamento recusado com sucesso.");
      } else {
        Alert.alert("Erro", data.message || "Erro ao recusar.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível comunicar com a API.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  // Renderiza cada OS na FlatList
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
            <Text style={styles.bold}>🚗 Veículo:</Text> {item.veiculo_detalhes || "Não informado"}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📅 Data:</Text> {item.os_data_lancamento}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📝 Observação:</Text> {item.os_obs || "Nenhuma."}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>🔖 Status:</Text> {item.os_status_nome || "Não informado"}
          </Text>
        </View>

        {/* Botão para expandir/recolher */}
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => toggleDropdown(item.os_codigo)}>
            <Ionicons
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        {/* Área expandida: listagem dos orçamentos */}
        {isExpanded && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>🛠️ Orçamentos</Text>
            {item.orcamentos && item.orcamentos.length > 0 ? (
              item.orcamentos.map((orc) => {
                const valorTotalOrcamento =
                  Number(orc.orc_vlr_total_pecas) + Number(orc.orc_vlr_total_mao_de_obra);

                const { label: statusLabel, color: statusColor } = getStatusInfo(orc.orc_status);

                return (
                  <View key={orc.orc_codigo} style={styles.orcamentoItem}>
                    {/* Cabeçalho do Orçamento + Ícone para Assinaturas */}
                    <View style={styles.orcamentoHeader}>
                      <Text style={styles.orcamentoText}>
                        <Text style={styles.bold}>Orçamento:</Text> {orc.orc_codigo}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("AssinaturasorcScreen", {
                            osCodigo: item.os_codigo,
                            orcCodigo: orc.orc_codigo,
                          })
                        }
                      >
                        <Ionicons name="create-outline" size={22} color="#007bff" />
                      </TouchableOpacity>
                    </View>

                    {/* Detalhes do Orçamento */}
                    <Text style={styles.orcamentoText}>
                      <Text style={styles.bold}>Peças (R$):</Text>{" "}
                      {Number(orc.orc_vlr_total_pecas).toFixed(2)}
                    </Text>
                    <Text style={styles.orcamentoText}>
                      <Text style={styles.bold}>Mão de Obra (R$):</Text>{" "}
                      {Number(orc.orc_vlr_total_mao_de_obra).toFixed(2)}
                    </Text>
                    <Text style={styles.orcamentoText}>
                      <Text style={styles.bold}>Responsável:</Text>{" "}
                      {orc.orc_responsavel_nome || "Não informado"}
                    </Text>
                    <Text style={[styles.orcamentoText, { color: statusColor, fontWeight: "bold" }]}>
                      Status: {statusLabel}
                    </Text>
                    <Text style={styles.orcamentoText}>
                      <Text style={styles.bold}>Valor Total (R$):</Text>{" "}
                      {valorTotalOrcamento.toFixed(2)}
                    </Text>

                    {/* Botões para Autorizar/Recusar ou Validar (caso exceda limite) */}
                    <View style={styles.buttonsContainer}>
                      {!verificarLimite(valorTotalOrcamento) ? (
                        <TouchableOpacity
                          style={[styles.btn, styles.limiteButton]}
                          onPress={() => handleConsiderar(orc.orc_codigo, item.os_codigo)}
                        >
                          <Ionicons name="shield-checkmark-outline" size={18} color="#FFF" />
                          <Text style={styles.btnText}>Validar</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={[styles.btn, styles.authorizeButton]}
                            onPress={() => handleAutorizar(orc.orc_codigo, valorTotalOrcamento)}
                          >
                            <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                            <Text style={styles.btnText}>Autorizar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.btn, styles.rejectButton]}
                            onPress={() => handleRecusar(orc.orc_codigo, valorTotalOrcamento)}
                          >
                            <Ionicons name="close-circle-outline" size={18} color="#FFF" />
                            <Text style={styles.btnText}>Recusar</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noOrcamentosText}>Nenhum orçamento encontrado.</Text>
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
          <Text style={styles.emptyListText}>Nenhuma Ordem de Serviço encontrada.</Text>
        }
      />
    </ScrollView>
  );
};

export default AvaliacaoOS;

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
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },

  // Card principal
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
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },

  // Dropdown Orçamentos
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
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orcamentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  orcamentoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  noOrcamentosText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },

  // Botões
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 3,
    paddingVertical: 10,
    justifyContent: "center",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
  limiteButton: {
    backgroundColor: "#FFC107", // Amarelo p/ "Validar" (excede limite de alçada)
  },
  authorizeButton: {
    backgroundColor: "#28A745", // Verde p/ "Autorizar"
  },
  rejectButton: {
    backgroundColor: "#DC3545", // Vermelho p/ "Recusar"
  },
});
