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
import { Card, Icon, Button } from "react-native-elements";

// Constantes de URL da API
const API_BASE_URL = "https://syntron.com.br/sistemas/apis/ordensSevico.php?status=orcamentos";
const API_SEND_URL = "https://syntron.com.br/sistemas/apis/enviarAvaliacao.php";

const credenciadoscreen = ({ navigation, route }) => {
  const { cadCodigo, nivelAcesso } = route.params || {};

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);

  // Mapeia o status para rótulos e cores
  const getStatusInfo = (status) => {
    switch (status) {
      case "RS":
        return { label: "Recusado", color: "#dc3545" }; // Vermelho
      case "AT":
        return { label: "Lançada", color: "#28a745" }; // Verde
      case "RC":
        return { label: "Recusado", color: "#dc3545" }; // Vermelho
      case "LC":
        return { label: "Lançado", color: "#6c757d" }; // Cinza
      case "EO":
        return { label: "Em Orçamentação", color: "#007bff" }; // Azul
        case "EX":
        return { label: "Executada", color: "#28a745" }; // Verde
        case "EE":
          return { label: "Em Execução", color: "#ff9b00" }; // Verde
        case "AV":
          return { label: "Autorizada Execução", color: "#ff9b00" }; // laranja
          case "FA":
            return { label: "Análise Solicitante", color: "#ff9b00" }; // laranja
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

  // Função para enviar a OS para avaliação
  const enviarParaAvaliacao = (osId) => {
    const ordem = ordens.find((o) => o.os_codigo === osId);

    if (!ordem) {
      Alert.alert("Erro", "Ordem de serviço não encontrada.");
      return;
    }

    fetch(API_SEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ os_codigo: osId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Sucesso", "Ordem de serviço enviada para avaliação.");
        } else {
          Alert.alert("Erro", data.error || "Erro ao enviar para avaliação.");
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar para avaliação:", error);
        Alert.alert("Erro", "Não foi possível enviar para avaliação.");
      });
  };

  const handleReabrirOrcamento = (orcamentoId, osId) => {
    fetch("https://syntron.com.br/sistemas/apis/reabreReplica.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orcamentoId,
        osId,
        action: "reabrir",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Sucesso", "Orçamento reaberto com sucesso.");
        } else {
          Alert.alert("Erro", data.error || "Erro ao reabrir orçamento.");
        }
      })
      .catch((error) => {
        console.error("Erro ao reabrir orçamento:", error);
        Alert.alert("Erro", "Não foi possível reabrir o orçamento.");
      });
  };
  
  const handleReplicarOrcamento = (orcamentoId, osId) => {
    fetch("https://syntron.com.br/sistemas/apis/reabreReplica.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orcamentoId,
        osId,
        action: "replicar",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Sucesso", "Orçamento replicado com sucesso.");
        } else {
          Alert.alert("Erro", data.error || "Erro ao replicar orçamento.");
        }
      })
      .catch((error) => {
        console.error("Erro ao replicar orçamento:", error);
        Alert.alert("Erro", "Não foi possível replicar o orçamento.");
      });
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
        const { label: statusLabel, color: statusColor } = getStatusInfo(item.os_status);

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
              <Text
                style={[styles.infoText, { color: statusColor, fontWeight: "bold" }]}
              >{`Status: ${statusLabel}`}</Text>
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

              {item.os_status === "EO" && (
                <Button
                  title="Enviar para Avaliação"
                  buttonStyle={styles.sendButton}
                  onPress={() => enviarParaAvaliacao(item.os_codigo)}
                />
              )}
            </View>

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

                  })
                ) : (
                  <Text style={styles.noOrcamentosText}>
                    Nenhum orçamento encontrado.
                  </Text>
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
  actionIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  
  
  
});

export default credenciadoscreen;
