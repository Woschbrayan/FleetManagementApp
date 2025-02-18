import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import API_BASE_URL from "./config";

const API_ORDENS = `${API_BASE_URL}/consultar_ordens.php?status=orc`;

const RelatorioOrcamentos = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {};

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);

  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const response = await fetch(API_ORDENS);
        const data = await response.json();
        // Ajuste caso a API retorne { error, message, data }
        // setOrdens(data.data || []);
        setOrdens(data || []);
      } catch (error) {
        console.error("Erro ao buscar ordens:", error);
        Alert.alert("Erro", "Não foi possível carregar as Ordens de Serviço.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  const toggleDropdown = (osCodigo) => {
    setExpandedOS(expandedOS === osCodigo ? null : osCodigo);
  };

  // Renderiza cada item do orçamento
  const renderItemDetails = (itemDetalhe) => {
    const isPeca = itemDetalhe.oit_peca_servico === "1";
    const quantidade = isPeca
      ? parseFloat(itemDetalhe.oit_qtde_pecas_lancado || 0)
      : parseFloat(itemDetalhe.oit_qtde_mao_de_obra_lancado || 0);
    const valor = isPeca
      ? parseFloat(itemDetalhe.oit_vlr_uni_pecas_lancado || 0)
      : parseFloat(itemDetalhe.oit_vlr_uni_mao_de_obra_lancado || 0);
    const valorTotal = quantidade * valor;

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{`Item: ${
          itemDetalhe.oit_descricao_item || "Sem descrição"
        }`}</Text>
        <Text style={styles.itemText}>
          Quantidade:{" "}
          {Number.isFinite(quantidade) ? quantidade.toFixed(1) : "N/A"}
        </Text>
        <Text style={styles.itemText}>
          Valor Unitário: R${" "}
          {Number.isFinite(valor) ? valor.toFixed(2) : "N/A"}
        </Text>
        <Text style={styles.itemText}>
          Valor Total: R${" "}
          {Number.isFinite(valorTotal) ? valorTotal.toFixed(2) : "N/A"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={ordens}
      keyExtractor={(item) => item.os_codigo.toString()}
      renderItem={({ item }) => {
        const isExpanded = expandedOS === item.os_codigo;

        return (
          <View style={styles.card}>
            {/* Título da OS */}
            <Text style={styles.cardTitle}>
              <Ionicons name="document-text-outline" size={18} color="#007BFF" />
              <Text style={{ marginLeft: 6 }}> OS: {item.os_codigo}</Text>
            </Text>

            {/* Conteúdo principal */}
            <View style={styles.cardContent}>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Veículo:</Text>{" "}
                {item.veiculo_detalhes || "Não informado"}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Data:</Text>{" "}
                {item.os_data_lancamento || "N/A"}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Observação:</Text>{" "}
                {item.os_obs || "Sem observação"}
              </Text>
            </View>

            {/* Botão de expandir/recolher */}
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => toggleDropdown(item.os_codigo)}>
                <Ionicons
                  name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                  size={24}
                  color="#28A745"
                />
              </TouchableOpacity>
            </View>

            {/* Se expandido, exibe orçamentos */}
            {isExpanded && (
              <View style={styles.orcamentosContainer}>
                <Text style={styles.dropdownTitle}>Orçamentos</Text>
                {item.orcamentos && item.orcamentos.length > 0 ? (
                  item.orcamentos.map((orc) => {
                    const valorPecas = Number(orc.orc_vlr_total_pecas) || 0;
                    const valorMaoObra =
                      Number(orc.orc_vlr_total_mao_de_obra) || 0;
                    const valorTotal = valorPecas + valorMaoObra;

                    return (
                      <View key={orc.orc_codigo} style={styles.orcamentoItem}>
                        {/* Cabeçalho do orçamento */}
                        <View style={styles.orcamentoHeader}>
                          <Text style={styles.orcamentoTitle}>
                            {`Orçamento: ${orc.orc_codigo}`}
                          </Text>
                          <Text style={styles.orcamentoStatus}>
                            {orc.orc_encerrado === "S"
                              ? "Orçamento Encerrado"
                              : "Lançado"}
                          </Text>
                        </View>

                        {/* Resumo de valores */}
                        <Text style={styles.orcamentoText}>
                          Valor Total: R${" "}
                          {valorTotal.toFixed(2)}
                        </Text>
                        <Text style={styles.orcamentoText}>
                          Valor Peças: R${" "}
                          {valorPecas.toFixed(2)}
                        </Text>
                        <Text style={styles.orcamentoText}>
                          Valor Serviços: R${" "}
                          {valorMaoObra.toFixed(2)}
                        </Text>

                        {/* Lista de itens */}
                        {orc.itens && orc.itens.length > 0 && (
                          <FlatList
                            data={orc.itens}
                            keyExtractor={(itemDetalhe) =>
                              itemDetalhe.id.toString()
                            }
                            renderItem={({ item: itemDetalhe }) =>
                              renderItemDetails(itemDetalhe)
                            }
                          />
                        )}
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.emptyOrcamentos}>
                    Nenhum orçamento encontrado.
                  </Text>
                )}
              </View>
            )}
          </View>
        );
      }}
      ListEmptyComponent={
        <Text style={styles.emptyListText}>
          Nenhuma Ordem de Serviço encontrada.
        </Text>
      }
    />
  );
};

export default RelatorioOrcamentos;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  // Card principal
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 6,
  },
  cardContent: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  orcamentosContainer: {
    marginTop: 10,
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 5,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  orcamentoItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
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
    marginBottom: 5,
    alignItems: "center",
  },
  orcamentoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orcamentoStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  orcamentoText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 3,
  },
  itemContainer: {
    marginVertical: 6,
    padding: 8,
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  emptyOrcamentos: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
});
