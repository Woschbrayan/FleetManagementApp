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
import { Card, Button, Icon } from "react-native-elements";

const API_BASE_URL = "https://syntron.com.br/sistemas/apis/ordensSevico.php?status=Ro";
const API_ASSINATURAS_URL = "https://syntron.com.br/sistemas/apis/regsitro_assinatura.php";
const API_ENVIAR_ORCAMENTO = "https://syntron.com.br/sistemas/apis/enviarOrcamento.php";

const GerenciaRoScreen = ({ navigation, route = { params: {} } }) => {
  const { cadCodigo = null, nivelAcesso = null } = route.params; // Valores padrão para evitar erros
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);
  const [assinaturas, setAssinaturas] = useState({});

  useEffect(() => {
    console.log("cadCodigo:", cadCodigo);
    console.log("nivelAcesso:", nivelAcesso);
  }, [cadCodigo, nivelAcesso]);

  useEffect(() => {
    fetch(API_BASE_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos da API:", data);
        setOrdens(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar ordens:", error);
        Alert.alert("Erro", "Não foi possível carregar as Ordens de Serviço.");
        setLoading(false);
      });
  }, []);

  const fetchAssinaturas = (registro) => {
    fetch(`${API_ASSINATURAS_URL}?registro=${registro}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Assinaturas para registro ${registro}:`, data);
        setAssinaturas((prev) => ({ ...prev, [registro]: data.data || [] }));
      })
      .catch((error) => {
        console.error(`Erro ao buscar assinaturas para registro ${registro}:`, error);
        setAssinaturas((prev) => ({ ...prev, [registro]: [] }));
      });
  };

  const enviarParaOrcamentacao = (osCodigo) => {
    fetch(`${API_ENVIAR_ORCAMENTO}?os_codigo=${osCodigo}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Alert.alert("Erro", data.message);
        } else {
          Alert.alert("Sucesso", "Ordem de Serviço enviada para orçamentação com sucesso!");
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar para orçamentação:", error);
        Alert.alert("Erro", "Erro ao enviar para orçamentação.");
      });
  };

  const toggleDropdown = (osId, registro) => {
    if (expandedOS === osId) {
      setExpandedOS(null);
    } else {
      setExpandedOS(osId);
      if (!assinaturas[registro]) {
        fetchAssinaturas(registro);
      }
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
      renderItem={({ item }) => (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>{`OS: ${item.os_codigo || "Não especificado"}`}</Card.Title>
          <Card.Divider />
          <View style={styles.cardContent}>
            <Text style={styles.infoText}>{`Veículo: ${item.veiculo_detalhes || "Não especificado"}`}</Text>
            <Text style={styles.infoText}>{`Data: ${item.os_data_lancamento || "Não especificada"}`}</Text>
            <Text style={styles.infoText}>{`Observação: ${item.os_obs || "Sem observações"}`}</Text>
            <Text style={styles.infoText}>{`Status: ${item.os_status_nome || "Desconhecido"}`}</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => toggleDropdown(item.os_codigo, item.os_codigo)}>
              <Icon
                name={expandedOS === item.os_codigo ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={30}
                color="#4CAF50"
              />
            </TouchableOpacity>
            <Button
              title="Enviar Orçamentação"
              buttonStyle={styles.addButton}
              titleStyle={styles.addButtonText}
              onPress={() => enviarParaOrcamentacao(item.os_codigo)}
            />
            <Button
              title="Assinatura"
              buttonStyle={styles.addButton}
              titleStyle={styles.addButtonText}
              onPress={() =>
                navigation.navigate("FormAssinatura", {
                  osCodigo: item.os_codigo,
                  cadCodigo: cadCodigo,
                  nivelAcesso: nivelAcesso,
                })
              }
            />
          </View>
          {expandedOS === item.os_codigo && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownTitle}>Assinaturas:</Text>
              {assinaturas[item.os_codigo]?.length > 0 ? (
                assinaturas[item.os_codigo].map((assinatura) => (
                  <View key={assinatura.id} style={styles.assinaturaItem}>
                    <Text style={styles.assinaturaText}>{`Nome: ${assinatura.nome || "N/A"}`}</Text>
                    <Text style={styles.assinaturaText}>{`CPF: ${assinatura.cpf || "N/A"}`}</Text>
                    <Text style={styles.assinaturaText}>{`Observação: ${assinatura.observacao || "N/A"}`}</Text>
                    <Text style={styles.assinaturaText}>{`Data: ${assinatura.data || "N/A"}`}</Text>
                    <Text style={styles.assinaturaText}>{`Perfil: ${assinatura.nivel_acesso_nome || "N/A"}`}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ConsultaAssinatura", { assinaturaId: assinatura.id })
                      }
                    >
                      <Icon name="search" size={25} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noAssinaturasText}>Nenhuma assinatura encontrada.</Text>
              )}
            </View>
          )}
        </Card>
      )}
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
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 14,
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
  assinaturaItem: {
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
  assinaturaText: {
    fontSize: 14,
    color: "#555",
  },
  noAssinaturasText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
});

export default GerenciaRoScreen;
