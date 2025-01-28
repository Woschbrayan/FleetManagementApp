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
import moment from "moment";

const CheckListOS = ({ navigation, route }) => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null); // Controla a OS expandida
  const { cadCodigo } = route.params || {};

  const API_BASE_URL = `https://syntron.com.br/sistemas/apis/ordensSevicoCheck.php`;

  useEffect(() => {
    fetch(API_BASE_URL) 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar dados: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrdens(data);
        } else {
          console.error("Resposta da API não é um array válido:", data);
          setOrdens([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar ordens:", error);
        Alert.alert("Erro", "Não foi possível carregar as ordens de serviço.");
        setLoading(false);
      });
  }, []);

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY HH:mm");
  };

  const renderChecklistDetails = (checklist) => {
    const formatField = (field) => (field === "S" ? "Ok" : "Não Ok");

    return (
      <View style={styles.checklistContainer}>
        <Card containerStyle={styles.checklistCard}>
          <Card.Title>
            {checklist.chc_entrada === "S"
              ? "Checklist de Entrada"
              : "Checklist de Saída"}
          </Card.Title>
          <Card.Divider />
          <View>
            {checklist.chc_entrada === "S" && (
              <>
                <Text style={styles.checklistText}>
                  Entrada realizada por:{" "}
                  {checklist.usuario_entrada_nome || "N/A"}
                </Text>
                <Text style={styles.checklistText}>
                  Data Entrada: {formatDate(checklist.chc_data_entrada)}
                </Text>
                <Text style={styles.checklistText}>
                  Observação Entrada: {checklist.chc_obs_entrada || "Sem observação"}
                </Text>
              </>
            )}
            {checklist.chc_saida === "S" && (
              <>
                <Text style={styles.checklistText}>
                  Saída realizada por: {checklist.usuario_saida_nome || "N/A"}
                </Text>
                <Text style={styles.checklistText}>
                  Data Saída: {formatDate(checklist.chc_data_saida)}
                </Text>
                <Text style={styles.checklistText}>
                  Observação Saída: {checklist.chc_obs_saida || "Sem observação"}
                </Text>
              </>
            )}
            <Text style={styles.checklistText}>
            Vidros: {formatField(checklist.e1)}
            </Text>
            <Text style={styles.checklistText}>
            Pintura: {formatField(checklist.e2)}
            </Text>
            <Text style={styles.checklistText}>
            Limpeza Interna: {formatField(checklist.e3)}
            </Text>
            <Text style={styles.checklistText}>
             Manuais: {formatField(checklist.e4)}
            </Text>
            <Text style={styles.checklistText}>
             Palhetas: {formatField(checklist.e5)}
            </Text>
           
          </View>
        </Card>
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
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={
        <Card containerStyle={styles.card}>
          <Card.Title>Nenhuma Ordem de Serviço</Card.Title>
          <Card.Divider />
          <Text style={styles.emptyText}>
            Ainda não houve ordem de serviço para o checklist.
          </Text>
        </Card>
      }
      renderItem={({ item }) => (
        <Card containerStyle={styles.card}>
          <Card.Title>{`OS: ${item.os_codigo}`}</Card.Title>
          <Card.Divider />
          <View>
            <Text>{`Veículo: ${item.veiculo_detalhes || "Não informado"}`}</Text>
            <Text>{`Data: ${item.os_data_lancamento}`}</Text>
            <Text>{`Observação: ${item.os_obs}`}</Text>
          </View>

          <TouchableOpacity
            style={styles.dropdownIcon}
            onPress={() =>
              setExpandedOS(expandedOS === item.os_codigo ? null : item.os_codigo)
            }
          >
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

          {expandedOS === item.os_codigo && (
            <View>
              {item.checklists.length > 0 ? (
                item.checklists.map((checklist, index) => (
                  <View key={index}>{renderChecklistDetails(checklist)}</View>
                ))
              ) : (
                <Text style={styles.emptyText}>Nenhum checklist encontrado.</Text>
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
    marginBottom: 10,
  },
  dropdownIcon: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  checklistCard: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#EFEFEF",
    marginVertical: 5,
  },
  checklistText: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default CheckListOS;
