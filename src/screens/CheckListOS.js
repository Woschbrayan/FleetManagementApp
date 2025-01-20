import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Card, Icon } from "react-native-elements";

const API_BASE_URL = "https://syntron.com.br/sistemas/apis/ordensSevico.php?status=checklist";

const CustomButton = ({ title = "Clique aqui", onPress, style }) => (
  <TouchableOpacity style={[styles.customButton, style]} onPress={onPress}>
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

const CheckListOS = ({ navigation }) => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);

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
        setLoading(false);
      });
  }, []);

  const toggleDropdown = (osId) => {
    setExpandedOS(expandedOS === osId ? null : osId);
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.os_status);

    return (
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>{`OS: ${item.os_codigo}`}</Card.Title>
        <Card.Divider />
        <View style={styles.cardContent}>
          <Text style={styles.infoText}>{`Veículo: ${item.veiculo_detalhes}`}</Text>
          <Text style={styles.infoText}>{`Data: ${item.os_data_lancamento}`}</Text>
          <Text style={styles.infoText}>{`Observação: ${item.os_obs}`}</Text>
          <Text style={[styles.infoText, { color: statusInfo.color }]}>
            {`Status: ${statusInfo.label}`}
          </Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => toggleDropdown(item.os_codigo)}>
            <Icon
              name={expandedOS === item.os_codigo ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={30}
              color="#4CAF50"
            />
          </TouchableOpacity>
          <CustomButton
              title="Entrada"
              style={styles.addButton}
              onPress={() => navigation.navigate('checklistForm', { osCodigo: item.os_codigo, tipo: 'entrada' })}
            />
            <CustomButton
              title="Saída"
              style={styles.addButton}
              onPress={() => navigation.navigate('checklistForm', { osCodigo: item.os_codigo, tipo: 'saida' })}
            />
        </View>

        {expandedOS === item.os_codigo && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Orçamentos:</Text>
            {item.orcamentos && item.orcamentos.length > 0 ? (
              item.orcamentos.map((orc) => (
                <View key={orc.orc_codigo} style={styles.orcamentoItem}>
                  <Text style={styles.orcamentoText}>{`Código: ${orc.orc_codigo}`}</Text>
                  <Text style={styles.orcamentoText}>{`Peças: R$ ${(parseFloat(orc.orc_vlr_total_pecas) || 0).toFixed(2)}`}</Text>
                  <Text style={styles.orcamentoText}>{`Mão de Obra: R$ ${(parseFloat(orc.orc_vlr_total_mao_de_obra) || 0).toFixed(2)}`}</Text>
                  <Text style={styles.orcamentoText}>{`Responsável: ${orc.orc_responsavel_nome}`}</Text>
                  <Text style={styles.orcamentoText}>{`Status: ${orc.orc_status}`}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noOrcamentosText}>Nenhum orçamento encontrado.</Text>
            )}
          </View>
        )}
      </Card>
    );
  };

  return (
    <FlatList
      data={ordens}
      keyExtractor={(item) => item.os_codigo.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
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
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
  },
  customButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  customButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: "#E8F5E9",
    padding: 15,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orcamentoItem: {
    marginBottom: 10,
    padding: 10,
  },
  orcamentoText: {
    fontSize: 14,
    color: "#555",
  },
  noOrcamentosText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default CheckListOS;
