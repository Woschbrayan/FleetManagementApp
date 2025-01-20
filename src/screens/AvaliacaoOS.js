import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Card, Icon, Button } from "react-native-elements";

// Constantes de URL da API
const API_BASE_URL = "https://syntron.com.br/sistemas/apis/ordensSevico.php?status=avaliacao";
// const API_BASE_URL = "http://192.168.100.63/apis/ordensSevico.php";
// const API_AVALIACAO_URL = "http://192.168.100.63/apis/avaliacaOrc.php";
const API_AVALIACAO_URL = "https://syntron.com.br/sistemas/apis/avaliacaOrc.php";

const AvaliacaoOS = ({ navigation, route }) => {
  const { cadCodigo, nivelAcesso } = route.params || {};

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);

  // Limites de alçada por nível de acesso
  const limitesAlcada = {
    223: 10000, // Gerente Operacional
    224: 50000, // Diretor Operacional
    225: 5000, // Coordenação Operacional
    227: 2000, // Supervisor de Frota
    228: 10000, // Gerente de Frota
    229: 50000,// Diretor de Frota
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
        return { label: "Lançado", color: "#6c757d" }; // Cinza
      default:
        return { label: "Desconhecido", color: "#000000" }; // Preto
    }
  };

  // Fetch Ordens de Serviço
  useEffect(() => {
    fetch(API_BASE_URL)
      .then((response) => response.json())
      .then((data) => {
        setOrdens(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar ordens:", error);
        setLoading(false);
      });
  }, []);

  // Alternar dropdown
  const toggleDropdown = (osId) => {
    setExpandedOS(expandedOS === osId ? null : osId);
  };

  const verificarLimite = (valorTotal) => {
    const limite = limitesAlcada[nivelAcesso];
    if (limite === undefined) {
      console.warn(`Nível de acesso (${nivelAcesso}) não configurado.`);
      return false;
    }
    return valorTotal <= limite;
  };

  const handleConsiderar = (orcCodigo, osCodigo) => {
    navigation.navigate("ConsiderarOrc", { orcCodigo, osCodigo, cadCodigo, nivelAcesso });
  };

  const handleAutorizar = async (orcCodigo, valorTotal) => {
    try {
      const response = await fetch(API_AVALIACAO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acao: 1, // Autorizar
          orcCodigo,
          valorTotal,
          nivelAcesso,
          cad_codigo: cadCodigo,
        }),
      });
      const data = await response.json();
      alert(data.success ? "Orçamento autorizado com sucesso." : `Erro: ${data.message}`);
    } catch (error) {
      alert("Erro ao comunicar com a API.");
    }
  };

  const handleRecusar = async (orcCodigo, valorTotal) => {
    try {
      const response = await fetch(API_AVALIACAO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acao: 2, // Recusar
          orcCodigo,
          valorTotal,
          nivelAcesso,
          cad_codigo: cadCodigo,
        }),
      });
     
      const data = await response.json();
      alert(data.success ? "Orçamento recusado com sucesso." : `Erro: ${data.message}`);
    } catch (error) {
      alert("Erro ao comunicar com a API.");
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

  return (
    <FlatList
      data={ordens}
      keyExtractor={(item) => item.os_codigo.toString()}
      renderItem={({ item }) => {
        return (
          <Card containerStyle={styles.card}>
            <Card.Title style={styles.cardTitle}>{`OS: ${item.os_codigo}`}</Card.Title>
            <Card.Divider />
            <View style={styles.cardContent}>
              <Text style={styles.infoText}>{`Veículo: ${
                item.veiculo_detalhes || "Não informado"
              }`}</Text>
              <Text style={styles.infoText}>{`Data: ${item.os_data_lancamento}`}</Text>
              <Text style={styles.infoText}>{`Observação: ${item.os_obs}`}</Text>
              <Text style={styles.infoText}>{`Status: ${
                item.os_status_nome || "Não informado"
              }`}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleDropdown(item.os_codigo)}>
              <Icon
                name={
                  expandedOS === item.os_codigo ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={30}
                color="#4CAF50"
              />
            </TouchableOpacity>

            {expandedOS === item.os_codigo && (
              <View style={styles.dropdown}>
                <Text style={styles.dropdownTitle}>Orçamentos</Text>
                {item.orcamentos && item.orcamentos.length > 0 ? (
                  item.orcamentos.map((orc) => {
                    const valorTotalOrcamento =
                      Number(orc.orc_vlr_total_pecas) +
                      Number(orc.orc_vlr_total_mao_de_obra);
                    const { label: statusLabel, color: statusColor } = getStatusInfo(
                      orc.orc_status
                    );

                    return (
                      <View key={orc.orc_codigo} style={styles.orcamentoItem}>
                        <View style={styles.orcamentoHeader}>
                          <Text style={styles.orcamentoText}>{`Orçamento: ${orc.orc_codigo}`}</Text>
                          <TouchableOpacity
                          
                            onPress={() =>
                              navigation.navigate("AssinaturasorcScreen", {
                                
                                osCodigo: item.os_codigo,
                                orcCodigo: orc.orc_codigo,
                                
                              })
                              
                            }
                          >
                            <Icon
                              name="edit"
                              type="font-awesome"
                              size={24}
                              color="#007bff"
                              style={styles.signatureIcon}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.orcamentoText}>{`Peças: R$ ${Number(
                          orc.orc_vlr_total_pecas
                        ).toFixed(2)}`}</Text>
                        <Text style={styles.orcamentoText}>{`Mão de Obra: R$ ${Number(
                          orc.orc_vlr_total_mao_de_obra
                        ).toFixed(2)}`}</Text>
                        <Text style={styles.orcamentoText}>{`Responsável: ${
                          orc.orc_responsavel_nome || "Não informado"
                        }`}</Text>
                        <Text
                          style={[
                            styles.orcamentoText,
                            { color: statusColor, fontWeight: "bold" },
                          ]}
                        >{`Status: ${statusLabel}`}</Text>
                        <Text style={styles.orcamentoText}>{`Valor Total: R$ ${valorTotalOrcamento.toFixed(
                          2
                        )}`}</Text>
                        <View style={styles.buttonsContainer}>
                          {!verificarLimite(valorTotalOrcamento) ? (
                            <Button
                              title="Validar"
                              onPress={() =>
                                handleConsiderar(orc.orc_codigo, item.os_codigo)
                              }
                            />
                          ) : (
                            <>
                              <TouchableOpacity
                                style={[styles.button, styles.authorizeButton]}
                                onPress={() =>
                                  handleAutorizar(orc.orc_codigo, valorTotalOrcamento)
                                }
                              >
                                <Text style={styles.authorizeButtonText}>Autorizar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.button, styles.rejectButton]}
                                onPress={() =>
                                  handleRecusar(orc.orc_codigo, valorTotalOrcamento)
                                }
                              >
                                <Text style={styles.rejectButtonText}>Recusar</Text>
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
          </Card>
        );
      }}
    />
  );
};


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

  card: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cardContent: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orcamentoText: {
    fontSize: 14,
    color: "#555",
  },
  noOrcamentosText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  authorizeButton: {
    backgroundColor: "#28a745", // Verde para "Autorizar"
  },
  rejectButton: {
    backgroundColor: "#dc3545", // Vermelho para "Recusar"
  },
  authorizeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signatureButton: {
    backgroundColor: "#007bff", // Azul para o botão "Assinaturas"
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  signatureButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  orcamentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  signatureIcon: {
    marginLeft: 10,
  },
  orcamentoTextStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  
  
});

export default AvaliacaoOS;
