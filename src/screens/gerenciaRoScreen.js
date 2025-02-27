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

const API_ORDENS = `${API_BASE_URL}/ordensSevico.php?status=Ro`;
const API_ALTERAR = `${API_BASE_URL}/alterar_os.php`;
const API_BUSCAR_ASSINATURAS = `${API_BASE_URL}/buscar_assinaturas.php`;

const GerenciaRoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Parâmetros recebidos (se houver)
  const { cadCodigo = null, nivelAcesso = null } = route.params || {};

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOS, setExpandedOS] = useState(null);
  const [assinaturas, setAssinaturas] = useState({});

  useEffect(() => {
    buscarOrdens();
  }, []);

  const buscarOrdens = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ORDENS);
      const data = await response.json();
      setOrdens(data);
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
      Alert.alert("Erro", "Não foi possível carregar as Ordens de Serviço.");
    } finally {
      setLoading(false);
    }
  };

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

  const enviarParaOrcamentacao = (osCodigo) => {
    Alert.alert(
      "Confirmação",
      "Deseja enviar o registro de ocorrência para orçamentação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              const response = await fetch(API_ALTERAR, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ os_codigo: osCodigo }).toString(),
              });
              const data = await response.json();
              if (data.error) {
                Alert.alert("Erro", data.message);
              } else {
                Alert.alert(
                  "Sucesso",
                  "Ordem de Serviço enviada para orçamentação com sucesso!"
                );
                // Atualiza o status localmente
                setOrdens((prev) =>
                  prev.map((ordem) =>
                    ordem.os_codigo === osCodigo
                      ? {
                          ...ordem,
                          os_status_nome: "Enviado para Orçamentação",
                          os_status: "ORC", // se quiser, pode alterar aqui também
                        }
                      : ordem
                  )
                );
              }
            } catch (error) {
              console.error("Erro ao enviar para orçamentação:", error);
              Alert.alert("Erro", "Erro ao enviar para orçamentação.");
            }
          },
        },
      ]
    );
  };

  const fetchAssinaturas = async (registro) => {
    try {
      const response = await fetch(`${API_BUSCAR_ASSINATURAS}?registro=${registro}`);
      const data = await response.json();
      setAssinaturas((prev) => ({
        ...prev,
        [registro]: data.data || [],
      }));
    } catch (error) {
      console.error(`Erro ao buscar assinaturas para registro ${registro}:`, error);
      setAssinaturas((prev) => ({
        ...prev,
        [registro]: [],
      }));
    }
  };

  const toggleDropdown = (osCodigo) => {
    if (expandedOS === osCodigo) {
      // Se já está aberto, fecha.
      setExpandedOS(null);
    } else {
      // Abre e busca assinaturas se ainda não foram buscadas
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

  const renderItem = ({ item }) => {
    const isExpanded = expandedOS === item.os_codigo;
    const listaAssinaturas = assinaturas[item.os_codigo] || [];

    return (
      <View style={styles.card}>
        {/* Cabeçalho da Card */}
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={22} color="#007BFF" />
          <Text style={styles.cardTitle}>{`Rgistro de Ocorrencia: ${item.os_codigo || "Não especificado"}`}</Text>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Veículo:</Text> {item.veiculo_detalhes || "Não especificado"}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Data:</Text> {formatarData(item.os_data_lancamento)}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Observação:</Text> {item.os_obs || "Sem observações"}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Status:</Text> {item.os_status_nome || "Desconhecido"}
          </Text>
        </View>

        {/* Botões (visíveis apenas se status == "RO") */}
        {item.os_status === "RO" && (
          <View style={styles.buttonRow}>
            {nivelAcesso !== 252 && (
              <TouchableOpacity
                style={styles.orcamentacaoButton}
                onPress={() => enviarParaOrcamentacao(item.os_codigo)}
              >
                <Ionicons name="arrow-forward-circle-outline" size={18} color="#FFF" />
                <Text style={styles.buttonText}>Enviar Orçamentação</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.assinarButton}
              onPress={() =>
                navigation.navigate("FormAssinatura", {
                  osCodigo: item.os_codigo,
                  cadCodigo: cadCodigo,
                  nivelAcesso: nivelAcesso,
                })
              }
            >
              <Ionicons name="pencil-outline" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Assinar</Text>
            </TouchableOpacity>
          </View>
        )}

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

        {/* Área de assinaturas - aparece somente se expandido */}
        {isExpanded && (
          <View style={styles.assinaturasContainer}>
            <Text style={styles.assinaturasTitle}>Assinaturas realizadas:</Text>
            {listaAssinaturas.length > 0 ? (
              listaAssinaturas.map((assinatura) => (
                <View key={assinatura.id} style={styles.assinaturaItem}>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>Nome:</Text> {assinatura.nome || "N/A"}
                  </Text>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>CPF:</Text> {assinatura.cpf || "N/A"}
                  </Text>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>Observação:</Text> {assinatura.observacao || "N/A"}
                  </Text>
                  <Text style={styles.assinaturaText}>
                    <Text style={styles.bold}>Data:</Text> {formatarData(assinatura.data)}
                  </Text>
                  {assinatura.nivelacesso === 252 && assinatura.foto_url ? (
                    <Image source={{ uri: assinatura.foto_url }} style={styles.assinaturaImagem} />
                  ) : (
                    <Text style={styles.semFoto}>Sem imagem</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.semAssinaturas}>Nenhuma assinatura encontrada.</Text>
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
        <Text style={styles.loadingText}>Nenhuma Ordem de Serviço encontrada.</Text>
      )}
    </View>
  );
};

export default GerenciaRoScreen;

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
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,

    // Sombra/elevation
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  orcamentacaoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    flex: 1,
    marginRight: 5,
  },
  assinarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
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

    // Sombra/elevation
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
