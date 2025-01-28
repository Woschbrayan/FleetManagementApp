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
import { Card, Icon } from "react-native-elements";


const OrcCred = ({ navigation, route }) => {
 
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);
  const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {};

  console.log("Parâmetros recebidos:", { cadCodigo, cadNome, nomeNivel, nivelAcesso });
  const API_BASE_URL = `https://syntron.com.br/sistemas/apis/ordensSevicoCredenciado.php?cadCodigo=${cadCodigo}`;

  // Fetch Ordens de Serviço
  useEffect(() => {
    fetch(API_BASE_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos da API:", JSON.stringify(data, null, 2));
        setOrdens(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar ordens:", error);
        setLoading(false);
      });
  }, []);

  const toggleDropdown = (osId) => {
    setExpandedOS(expandedOS === osId ? null : osId);
  };

  const handleEncerrarOrcamento = (orcCodigo) => {
    Alert.alert(
      "Confirmar Encerramento",
      `Tem certeza que deseja encerrar o orçamento ${orcCodigo}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            fetch("https://syntron.com.br/sistemas/apis/encerrarOrcamento.php", {
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
        <Text style={styles.itemDetails}>{`Quantidade: ${
          !isNaN(quantidade) ? quantidade.toFixed(1) : "N/A"
        }`}</Text>
        <Text style={styles.itemDetails}>{`Valor Unitário: R$ ${
          !isNaN(valor) ? valor.toFixed(2) : "N/A"
        }`}</Text>
        <Text style={styles.itemDetails}>{`Valor Total: R$ ${
          !isNaN(valorTotal) ? valorTotal.toFixed(2) : "N/A"
        }`}</Text>
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

  return (
    <FlatList
      data={ordens}
      keyExtractor={(item) => item.os_codigo.toString()}
      renderItem={({ item }) => (
        <Card containerStyle={styles.card}>
          <Card.Title>{`OS: ${item.os_codigo}`}</Card.Title>
          <Card.Divider />
          <View style={styles.cardContent}>
            <Text>{`Veículo: ${item.veiculo_detalhes || "Não informado"}`}</Text>
            <Text>{`Data: ${item.os_data_lancamento}`}</Text>
            <Text>{`Observação: ${item.os_obs}`}</Text>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => toggleDropdown(item.os_codigo)}>
              <Icon
                name={
                  expandedOS === item.os_codigo
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={30}
                color="#4CAF50"
              />
            </TouchableOpacity>
          </View>

          {expandedOS === item.os_codigo && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownTitle}>Orçamentos</Text>
              {item.orcamentos && item.orcamentos.length > 0 ? (
                item.orcamentos.map((orc) => (
                  <View key={orc.orc_codigo} style={styles.orcamentoItem}>
                    <View style={styles.orcamentoHeader}>
                      <Text style={styles.orcamentoTitle}>{`Orçamento: ${orc.orc_codigo}`}</Text>
                      <Text style={styles.orcamentoStatus}>
                        {orc.orc_encerrado && orc.orc_encerrado.trim() === "S"
                          ? "Orçamento Encerrado"
                          : "Lançada"}
                      </Text>
                    </View>

                    <Text>{`Valor Total: R$ ${(
                      Number(orc.orc_vlr_total_pecas) +
                      Number(orc.orc_vlr_total_mao_de_obra)
                    ).toFixed(2)}`}</Text>
                    <Text>{`Valor Peças: R$ ${orc.orc_vlr_total_pecas}`}</Text>
                    <Text>{`Valor Serviços: R$ ${orc.orc_vlr_total_mao_de_obra}`}</Text>

                    {orc.orc_encerrado !== "S" && (
                      <View style={styles.orcamentoActions}>
                        <TouchableOpacity
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
                          onPress={() =>
                            handleEncerrarOrcamento(orc.orc_codigo)
                          }
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

                    <FlatList
                      data={orc.itens}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) =>
                        renderItemDetails(
                          item,
                          orc.orc_codigo,
                          item.os_codigo,
                          orc.orc_encerrado
                        )
                      }
                    />
                  </View>
                ))
              ) : (
                <Text>Nenhum orçamento encontrado.</Text>
              )}
            </View>
          )}
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  card: {
    borderRadius: 10,
    padding: 15,
  },
  dropdown: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F9F9F9",
  },
  orcamentoItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  itemContainer: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetails: {
    fontSize: 14,
    color: "#555",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orcamentoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orcamentoStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginTop: 5,
  },
  orcamentoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default OrcCred;
