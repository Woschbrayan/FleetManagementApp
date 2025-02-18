import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Ícones Ionicons
import API_BASE_URL from "./config";

// Usando a nova rota consultada, que recebe ?status=RO
const API_ORDENS = `${API_BASE_URL}/consultar_ordens.php?status=RO`;
// Se usar a exata, sem status=RO, o status deve ser enviado via param.

const RelatorioRO = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Se precisar receber cadCodigo e nivelAcesso de outra tela (não é mais usado aqui, mas deixamos disponível).
  const { cadCodigo = null, nivelAcesso = null } = route.params || {};

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null); // Qual OS está expandida
  const [assinaturas, setAssinaturas] = useState({}); // Guarda as assinaturas de cada OS

  useEffect(() => {
    buscarOrdens();
  }, []);

  // Busca as ordens com status = RO
  const buscarOrdens = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ORDENS);
      const data = await response.json();
      if (data.error) {
        Alert.alert("Erro", data.message || "Não foi possível carregar as OS.");
        setOrdens([]);
      } else {
        // data.data deve ter o array de OS
        setOrdens(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
      Alert.alert("Erro", "Não foi possível carregar as Ordens de Serviço.");
    } finally {
      setLoading(false);
    }
  };

  // Formata data ISO no formato DD/MM/AAAA HH:MM
  const formatarData = (dataIso) => {
    if (!dataIso) return "Data não disponível";
    const dataObj = new Date(dataIso);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, "0");
    const minutos = String(dataObj.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  // Busca assinaturas para a OS
  const fetchAssinaturas = async (osCodigo) => {
    // Substitua por sua rota real, ex: `${API_BASE_URL}/buscar_assinaturas.php`
    const API_BUSCAR_ASSINATURAS = `${API_BASE_URL}/buscar_assinaturas.php`;

    try {
      const response = await fetch(`${API_BUSCAR_ASSINATURAS}?registro=${osCodigo}`);
      const data = await response.json();
      setAssinaturas((prev) => ({
        ...prev,
        [osCodigo]: data.data || [],
      }));
    } catch (error) {
      console.error(`Erro ao buscar assinaturas para OS ${osCodigo}:`, error);
      setAssinaturas((prev) => ({
        ...prev,
        [osCodigo]: [],
      }));
    }
  };

  // Toggle para expandir ou recolher as assinaturas de uma OS
  const toggleDropdown = (osCodigo) => {
    if (expandedOS === osCodigo) {
      // Se já está aberto, fecha
      setExpandedOS(null);
    } else {
      // Abre e, se ainda não tem assinaturas carregadas, busca
      setExpandedOS(osCodigo);
      if (!assinaturas[osCodigo]) {
        fetchAssinaturas(osCodigo);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando Ordens de Serviço...</Text>
      </View>
    );
  }

  // Renderiza cada OS
  const renderItem = ({ item }) => {
    const isExpanded = expandedOS === item.os_codigo;
    const listaAssinaturas = assinaturas[item.os_codigo] || [];

    return (
      <View style={styles.card}>
        {/* Cabeçalho */}
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={22} color="#007BFF" />
          <Text style={styles.cardTitle}>
            Registro de Ocorrência: {item.os_codigo || "Não especificado"}
          </Text>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>🚗 Veículo:</Text>{" "}
            {item.veiculo_detalhes || "Não especificado"}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>📅 Data:</Text>{" "}
            {formatarData(item.os_data_lancamento)}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>📝 Observação:</Text>{" "}
            {item.os_obs || "Sem observações"}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>🔖 Status:</Text>{" "}
            {item.os_status || "Desconhecido"}
          </Text>
        </View>

        {/* Botão para Expandir/Recolher Assinaturas */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => toggleDropdown(item.os_codigo)}
        >
          <Ionicons
            name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={18}
            color="#FFF"
          />
          <Text style={styles.buttonText}>
            {isExpanded ? "Ocultar Assinaturas" : "Mostrar Assinaturas"}
          </Text>
        </TouchableOpacity>

        {/* Se expandido, mostra assinaturas */}
        {isExpanded && (
          <View style={styles.assinaturasContainer}>
            <Text style={styles.assinaturasTitle}>Assinaturas realizadas:</Text>
            {listaAssinaturas.length > 0 ? (
              listaAssinaturas.map((assinatura) => (
                <View key={assinatura.id} style={styles.assinaturaItem}>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>Nome:</Text>{" "}
                    {assinatura.nome || "N/A"}
                  </Text>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>CPF:</Text>{" "}
                    {assinatura.cpf || "N/A"}
                  </Text>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>Observação:</Text>{" "}
                    {assinatura.observacao || "N/A"}
                  </Text>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>Data:</Text>{" "}
                    {formatarData(assinatura.data)}
                  </Text>

                  {/* Se for nível de acesso 252 e houver foto, exibe */}
                  {assinatura.nivelacesso === 252 && assinatura.foto_url ? (
                    <Image
                      source={{ uri: assinatura.foto_url }}
                      style={styles.assinaturaImagem}
                    />
                  ) : (
                    <Text style={styles.semFoto}>Sem imagem</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.semAssinaturas}>
                Nenhuma assinatura encontrada.
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {ordens && ordens.length > 0 ? (
        <FlatList
          data={ordens}
          keyExtractor={(item) => item.os_codigo.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.loadingText}>
          Nenhuma Ordem de Serviço encontrada.
        </Text>
      )}
    </View>
  );
};

export default RelatorioRO;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  // Card OS
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#007BFF",
  },
  cardContent: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
  // Container de assinaturas
  assinaturasContainer: {
    marginTop: 10,
    backgroundColor: "#E9F7EF",
    padding: 10,
    borderRadius: 6,
  },
  assinaturasTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  assinaturaItem: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  assinaturaText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  assinaturaImagem: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    marginTop: 8,
    resizeMode: "cover",
  },
  semFoto: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
  semAssinaturas: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
