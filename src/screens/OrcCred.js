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
import { Icon } from "react-native-elements"; // Para ícones (font-awesome)
import API_BASE_URL from "./config";

const OrcCred = ({ navigation, route }) => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);

  // Recebendo parâmetros da rota
  const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {};
  console.log("Parâmetros recebidos:", { cadCodigo, cadNome, nomeNivel, nivelAcesso });

  // Monta a URL com cadCodigo
  const API_BASE_URL_ORDEM = `${API_BASE_URL}/ordensSevicoCredenciado.php?cadCodigo=${cadCodigo}`;

  // Fetch Ordens de Serviço
  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const response = await fetch(API_BASE_URL_ORDEM);
        const data = await response.json();
        console.log("Dados recebidos da API:", JSON.stringify(data, null, 2));
        setOrdens(data);
      } catch (error) {
        console.error("Erro ao buscar ordens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  // Expande ou recolhe a OS
  const toggleDropdown = (osId) => {
    setExpandedOS(expandedOS === osId ? null : osId);
  };

  // Confirmar e encerrar orçamento
  const handleEncerrarOrcamento = (orcCodigo) => {
    Alert.alert(
      "Confirmar Encerramento",
      `Tem certeza que deseja encerrar o orçamento ${orcCodigo}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            fetch(`${API_BASE_URL}/encerrarOrcamento.php`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ orc_codigo: orcCodigo }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  Alert.alert("Sucesso", "Orçamento encerrado com sucesso!");
                  // Atualiza estado local
                  setOrdens((prev) =>
                    prev.map((os) => ({
                      ...os,
                      orcamentos: os.orcamentos.map((orc) =>
                        orc.orc_codigo === orcCodigo
                          ? { ...orc, orc_encerrado: "S" }
                          : orc
                      ),
                    }))
                  );
                } else {
                  Alert.alert(
                    "Erro",
                    data.error || "Erro ao encerrar o orçamento."
                  );
                }
              })
              .catch((error) => {
                console.error("Erro ao encerrar o orçamento:", error);
                Alert.alert("Erro", "Não foi possível encerrar o orçamento.");
              });
          },
        },
      ]
    );
  };

  // Renderiza cada item do orçamento
  const renderItemDetails = (item, orcamentoId, osId, orcEncerrado) => {
    const isPeca = item.oit_peca_servico === "1";
    const quantidade = isPeca
      ? parseFloat(item.oit_qtde_pecas_lancado || 0)
      : parseFloat(item.oit_qtde_mao_de_obra_lancado || 0);
    const valor = isPeca
      ? parseFloat(item.oit_vlr_uni_pecas_lancado || 0)
      : parseFloat(item.oit_vlr_uni_mao_de_obra_lancado || 0);
    const valorTotal = quantidade * valor;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
          <Text style={styles.itemDescription}>{`Item: ${item.oit_descricao_item}`}</Text>
          {orcEncerrado !== "S" && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ItemForm", {
                  osId,
                  orcamentoId,
                  item,
                  editMode: true,
                })
              }
            >
              <Icon name="edit" type="font-awesome" size={18} color="#007BFF" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.itemDetails}>
          Quantidade: {Number.isFinite(quantidade) ? quantidade.toFixed(1) : "N/A"}
        </Text>
        <Text style={styles.itemDetails}>
          Valor Unitário: R${" "}
          {Number.isFinite(valor) ? valor.toFixed(2) : "N/A"}
        </Text>
        <Text style={styles.itemDetails}>
          Valor Total: R${" "}
          {Number.isFinite(valorTotal) ? valorTotal.toFixed(2) : "N/A"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  // Renderiza cada OS
  const renderOS = ({ item }) => {
    const isExpanded = expandedOS === item.os_codigo;

    // Calcula a exibição do "dropdown" e do conteúdo
    return (
      <View style={styles.card}>
        {/* Cabeçalho da OS */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{`Ordem de Serviço: ${item.os_codigo}`}</Text>
          <TouchableOpacity onPress={() => toggleDropdown(item.os_codigo)}>
            <Icon
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={28}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {/* Conteúdo principal da OS */}
        <View style={styles.cardContent}>
          {/* Ícone "🚗" para veículo */}
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
        </View>

        {/* Se expandido, exibe orçamentos */}
        {isExpanded && (
          <View style={styles.orcamentosContainer}>
            <Text style={styles.orcamentosTitle}>Orçamentos</Text>
            {item.orcamentos && item.orcamentos.length > 0 ? (
              item.orcamentos.map((orc) => {
                const valorTotalOrcamento =
                  (parseFloat(orc.orc_vlr_total_pecas) || 0) +
                  (parseFloat(orc.orc_vlr_total_mao_de_obra) || 0);

                return (
                  <View key={orc.orc_codigo} style={styles.orcamentoCard}>
                    <View style={styles.orcamentoHeader}>
                      <Text style={styles.orcamentoTitle}>
                        Orçamento: {orc.orc_codigo}
                      </Text>
                      <Text style={styles.orcamentoStatus}>
                        {orc.orc_encerrado && orc.orc_encerrado.trim() === "S"
                          ? "Encerrado"
                          : "Lançada"}
                      </Text>
                    </View>

                    <Text style={styles.orcamentoText}>
                      Valor Total: R${valorTotalOrcamento.toFixed(2)}
                    </Text>
                    <Text style={styles.orcamentoText}>
                      Valor Peças: R${(parseFloat(orc.orc_vlr_total_pecas) || 0).toFixed(2)}
                    </Text>
                    <Text style={styles.orcamentoText}>
                      Valor Serviços: R${(parseFloat(orc.orc_vlr_total_mao_de_obra) || 0).toFixed(2)}
                    </Text>

                    {/* Botões para encerrar ou adicionar item */}
                    {orc.orc_encerrado !== "S" && (
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() =>
                            navigation.navigate("ItemForm", {
                              osId: item.os_codigo,
                              orcamentoId: orc.orc_codigo,
                              editMode: false,
                            })
                          }
                        >
                          <Icon
                            name="plus"
                            type="font-awesome"
                            size={18}
                            color="#28a745"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleEncerrarOrcamento(orc.orc_codigo)}
                        >
                          <Icon
                            name="lock"
                            type="font-awesome"
                            size={18}
                            color="#dc3545"
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Lista de itens */}
                    <FlatList
                      data={orc.itens}
                      keyExtractor={(detalhe) => detalhe.id.toString()}
                      renderItem={({ item: itemDetalhe }) =>
                        renderItemDetails(
                          itemDetalhe,
                          orc.orc_codigo,
                          item.os_codigo,
                          orc.orc_encerrado
                        )
                      }
                    />
                  </View>
                );
              })
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
    <FlatList
      data={ordens}
      keyExtractor={(item) => item.os_codigo.toString()}
      renderItem={renderOS}
      ListEmptyComponent={
        <Text style={styles.emptyListText}>Nenhuma Ordem de Serviço encontrada.</Text>
      }
    />
  );
};

export default OrcCred;

const styles = StyleSheet.create({
  // Carregando
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
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },

  // Card principal da OS
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 10,
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

  // Container de orçamentos
  orcamentosContainer: {
    marginTop: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
  },
  orcamentosTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 6,
  },
  orcamentoCard: {
    backgroundColor: "#FFF",
    borderRadius: 6,
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
    marginBottom: 5,
  },
  orcamentoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  orcamentoStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  orcamentoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 12,
  },
  noOrcamentosText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },

  // Itens do orçamento
  itemContainer: {
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
    padding: 10,
    marginVertical: 6,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});
