import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; 
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "./config";

// URL base da sua API, que já inclui o endpoint "veiculos_api.php" ou algo similar
// Caso utilize a exata rota do seu script, inclua ? ou / etc.
const BASE_URL = `${API_BASE_URL}/veiculos.php`;

const RelatorioVeiculos = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Se você receber "tipoVeiculo" e "grupoid" via parâmetros de navegação, pode pegar aqui:
  const { tipoVeiculo = null, grupoid = null } = route.params || {};

  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    // Monta a URL com ou sem parâmetros
    // Ex.: se existirem, ?tipoVeiculo=...&grupoid=...
    let url = BASE_URL; 
    // se já tiver "?...", concatenar com & ou algo do tipo
    let params = [];
    if (tipoVeiculo) {
      params.push(`tipoVeiculo=${tipoVeiculo}`);
    }
    if (grupoid) {
      params.push(`grupoid=${grupoid}`);
    }
    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const fetchVeiculos = async () => {
      try {
        setLoading(true);
        console.log("Requisição para:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        if (data.status === "success") {
          setVeiculos(data.data || []); 
        } else {
          // Se a API retorna status='error' ou algo do tipo
          throw new Error(data.message || "Erro desconhecido na API.");
        }
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVeiculos();
  }, [tipoVeiculo, grupoid]);

  // Renderiza cada veículo em um card
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Ícone de "carro" para enfeitar (opcional) */}
        <Ionicons name="car-sport-outline" size={22} color="#007BFF" />
        <Text style={styles.cardTitle}>
          {item.veiculo_detalhes 
            ? `Veículo: ${item.veiculo_detalhes}`
            : "Veículo sem código"}
        </Text>
      </View>

      <View style={styles.cardContent}>
        {/* <Text style={styles.infoText}>
          <Text style={styles.bold}>Detalhes:</Text>{" "}
          {item.veiculo_detalhes || "Sem detalhes"}
        </Text> */}
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Chassi:</Text>{" "}
          {item.vei_chassi || "N/A"}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Renavam:</Text>{" "}
          {item.vei_renavam || "N/A"}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Cor:</Text>{" "}
          {item.vei_cor || "N/A"}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Placa:</Text>{" "}
          {item.vai_placa || "N/A"}
        </Text>
        {/* Adicione mais campos se precisar */}
      </View>
    </View>
  );

  // Se estiver carregando, exibe indicador de atividade
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  // Se houve erro, mostra mensagem
  if (erro) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.errorText}>Ocorreu um erro: {erro}</Text>
        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => {
            setErro(null);
            setLoading(true);
          }}
        >
          <Text style={styles.reloadText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Caso não tenha erro e não esteja carregando
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Lista de Veículos</Text> */}

      {veiculos.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum veículo encontrado.</Text>
      ) : (
        <FlatList
          data={veiculos}
          keyExtractor={(item, index) => String(item.vei_codigo || index)}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default RelatorioVeiculos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "#007BFF",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  reloadButton: {
    backgroundColor: "#007BFF",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  reloadText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  // Estilos do Card
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 25,
    marginVertical: 8,

    // sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    // padding:15,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007BFF",
    marginLeft: 8,
  },
  cardContent: {
    marginTop: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold",
  },
});
