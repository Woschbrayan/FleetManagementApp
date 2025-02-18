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
const API_BASE_URL_ORDEN = `${API_BASE_URL}/ordensSevico.php?status=orcamentos`;
const API_SEND_URL = `${API_BASE_URL}/enviarAvaliacao.php`;

const OrcamentoOS = ({ navigation, route }) => {
  const { cadCodigo, nivelAcesso } = route.params || {};

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null); // Qual OS está expandida?
  // Novo estado: quais Orçamentos estão expandidos (dropdown de itens)
  const [expandedOrcs, setExpandedOrcs] = useState({}); // { [orcCodigo]: boolean }

  // Mapeia o status para rótulos e cores
  const getStatusInfo = (status) => {
    switch (status) {
      case "RS":
        return { label: "Recusado", color: "#dc3545" };
      case "AT":
        return { label: "Lançada", color: "#28a745" };
      case "RC":
        return { label: "Recusado", color: "#dc3545" };
      case "LC":
        return { label: "Lançado", color: "#6c757d" };
      case "EO":
        return { label: "Em Orçamentação", color: "#007bff" };
      case "EX":
        return { label: "Executada", color: "#28a745" };
      case "EE":
        return { label: "Em Execução", color: "#ff9b00" };
      case "AV":
        return { label: "Autorizada Execução", color: "#ff9b00" };
      case "FA":
        return { label: "Análise Solicitante", color: "#ff9b00" };
      default:
        return { label: "Desconhecido", color: "#000000" };
    }
  };

  // Busca Ordens de Serviço
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

  // Expande/Recolhe OS
  const toggleDropdown = (osId) => {
    setExpandedOS(expandedOS === osId ? null : osId);
  };

  // Enviar OS para avaliação
  const enviarParaAvaliacao = async (osId) => {
    const ordem = ordens.find((o) => o.os_codigo === osId);
    if (!ordem) {
      Alert.alert("Erro", "Ordem de serviço não encontrada.");
      return;
    }
    try {
      const response = await fetch(API_SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ os_codigo: osId }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Sucesso", "Ordem de serviço enviada para avaliação.");
      } else {
        Alert.alert("Erro", data.error || "Erro ao enviar para avaliação.");
      }
    } catch (error) {
      console.error("Erro ao enviar para avaliação:", error);
      Alert.alert("Erro", "Não foi possível enviar para avaliação.");
    }
  };

  // Reabrir orçamento
  const handleReabrirOrcamento = async (orcamentoId, osId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reabreReplica.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orcamentoId, osId, action: "reabrir" }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Sucesso", "Orçamento reaberto com sucesso.");
      } else {
        Alert.alert("Erro", data.error || "Erro ao reabrir orçamento.");
      }
    } catch (error) {
      console.error("Erro ao reabrir orçamento:", error);
      Alert.alert("Erro", "Não foi possível reabrir o orçamento.");
    }
  };

  // Replicar orçamento
  const handleReplicarOrcamento = async (orcamentoId, osId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reabreReplica.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orcamentoId, osId, action: "replicar" }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Sucesso", "Orçamento replicado com sucesso.");
      } else {
        Alert.alert("Erro", data.error || "Erro ao replicar orçamento.");
      }
    } catch (error) {
      console.error("Erro ao replicar orçamento:", error);
      Alert.alert("Erro", "Não foi possível replicar o orçamento.");
    }
  };

  // Toggle para expandir ou recolher os itens de um orçamento
  const toggleOrcItems = (orcCodigo) => {
    setExpandedOrcs((prev) => ({
      ...prev,
      [orcCodigo]: !prev[orcCodigo],
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  const renderOrcamentoItems = (orc, osId) => {
    // Retrieve the status label and color
    const { label: orcStatusLabel, color: orcStatusColor } = getStatusInfo(orc.orc_status);

    // Calculate the total value of the orçamento
    const valorTotalOrcamento = Number(orc.orc_vlr_total_pecas) + Number(orc.orc_vlr_total_mao_de_obra);

    // Check if this orçamento is expanded
    const isOrcExpanded = expandedOrcs[orc.orc_codigo] || false;

    return (
      <View key={orc.orc_codigo} style={styles.orcamentoItem}>
        {/* Cabeçalho do Orçamento + Ações (Reabrir/Replicar) */}
        <View style={styles.orcamentoHeader}>
          <Text style={styles.orcamentoText}>
            <Text style={styles.bold}>Orçamento:</Text> {orc.orc_codigo}
          </Text>
          <View style={styles.actionIcons}>
            <TouchableOpacity
              onPress={() => handleReabrirOrcamento(orc.orc_codigo, osId)}
            >
              <Ionicons
                name="refresh-circle-outline"
                size={24}
                color="#007bff"
                style={styles.iconSpacing}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleReplicarOrcamento(orc.orc_codigo, osId)}
            >
              <Ionicons
                name="copy-outline"
                size={24}
                color="#28a745"
                style={styles.iconSpacing}
              />
            </TouchableOpacity>
          </View>
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

        {/* Status do Orçamento */}
        <Text style={[styles.orcamentoText, { color: orcStatusColor }]}>
          Status: {orcStatusLabel}
        </Text>

        {/* Valor Total */}
        <Text style={styles.orcamentoText}>
          <Text style={styles.bold}>Valor Total (R$):</Text> {valorTotalOrcamento.toFixed(2)}
        </Text>

        {/* Botão Ver Itens */}
        <TouchableOpacity
          style={styles.itemDropdownButton}
          onPress={() => toggleOrcItems(orc.orc_codigo)}
        >
          <Ionicons
            name={isOrcExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color="#FFF"
          />
          <Text style={styles.itemDropdownButtonText}>
            {isOrcExpanded ? "Ocultar Itens" : "Ver Itens"}
          </Text>
        </TouchableOpacity>

        {/* Se expandido, exibe os itens */}
        {isOrcExpanded && orc.itens && orc.itens.length > 0 && (
          <View style={styles.itemListContainer}>
            {orc.itens.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <Text style={styles.itemText}>
                  <Text style={styles.bold}>Item:</Text> {item.oit_descricao_item}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.bold}>Quantidade:</Text> {item.oit_qtde_pecas_lancado || item.oit_qtde_mao_de_obra_lancado}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.bold}>Unitário (R$):</Text>{" "}
                  {item.oit_vlr_uni_pecas_lancado || item.oit_vlr_uni_mao_de_obra_lancado}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.bold}>Total (R$):</Text>{" "}
                  {Number(item.valor_total).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Render de cada OS
  const renderItem = ({ item }) => {
    const { label: statusLabel, color: statusColor } = getStatusInfo(item.os_status);
    const isExpanded = expandedOS === item.os_codigo;

    return (
      <View style={styles.card}>
        {/* Cabeçalho da OS */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📝 Ordem de Serviço: {item.os_codigo}</Text>
        </View>

        {/* Conteúdo principal da OS */}
        <View style={styles.cardContent}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>🚗 Veículo:</Text>{" "}
            {item.veiculo_detalhes || "Não informado"}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📅 Data:</Text> {item.os_data_lancamento}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>📝 Observação:</Text> {item.os_obs}
          </Text>
          <Text
            style={[styles.infoText, { color: statusColor, fontWeight: "bold" }]}
          >
            🔖 Status: {statusLabel}
          </Text>
        </View>

        {/* Botões e Dropdown Toggle */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.dropdownIcon}
            onPress={() => toggleDropdown(item.os_codigo)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="#4CAF50"
            />
          </TouchableOpacity>

          {/* Botão Enviar para Avaliação (só aparece se status for "EO") */}
          {item.os_status === "EO" && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => enviarParaAvaliacao(item.os_codigo)}
            >
              <Ionicons name="send-outline" size={16} color="#FFF" />
              <Text style={styles.sendButtonText}>Enviar Avaliação</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Se expandido, exibe a lista de Orçamentos */}
        {isExpanded && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>🛠️ Orçamentos</Text>
            {item.orcamentos && item.orcamentos.length > 0 ? (
              item.orcamentos.map((orc) => renderOrcamentoItems(orc, item.os_codigo))
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
          <Text style={styles.emptyListText}>
            Nenhuma Ordem de Serviço encontrada.
          </Text>
        }
      />
    </ScrollView>
  );
};

export default OrcamentoOS;

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
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownIcon: {
    padding: 6,
  },

  // Botão "Enviar Avaliação"
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },

  // Dropdown de orçamentos
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
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginLeft: 10,
  },
  noOrcamentosText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },

  // Botão expandir itens
  itemDropdownButton: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  itemDropdownButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  // Lista e container de itens
  itemListContainer: {
    marginTop: 6,
  },
  itemContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    padding: 8,
    marginVertical: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
  },
});
