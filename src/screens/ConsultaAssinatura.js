import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  ScrollView,
  Image,
} from "react-native";
import API_BASE_URL from "./config";
const API_ASSINATURA_DETALHES = `${API_BASE_URL}/regsitro_assinatura_insert.php?action=consultar`;

const ConsultaAssinatura = ({ route, navigation }) => {
  const { assinaturaId } = route.params;
  const [assinatura, setAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssinaturaDetalhes = async () => {
      try {
        if (!assinaturaId) {
          alert("Erro: ID da assinatura não fornecido.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_ASSINATURA_DETALHES}&id=${assinaturaId}`);
        if (!response.ok) {
          throw new Error("Erro ao conectar à API");
        }

        const data = await response.json();

        if (data.error) {
          alert(`Erro: ${data.message}`);
        } else {
          setAssinatura(data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da assinatura:", error);
        alert("Erro ao buscar os detalhes da assinatura.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssinaturaDetalhes();
  }, [assinaturaId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando detalhes da assinatura...</Text>
      </View>
    );
  }

  if (!assinatura) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Assinatura não encontrada.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes da Assinatura</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{assinatura.nome || "N/A"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{assinatura.cpf || "N/A"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Observação:</Text>
        <Text style={styles.value}>{assinatura.observacao || "N/A"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Data:</Text>
        <Text style={styles.value}>{assinatura.data || "N/A"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Perfil:</Text>
        <Text style={styles.value}>{assinatura.nivel_acesso_nome || "N/A"}</Text>
      </View>
      {assinatura.foto ? (
        <View style={styles.photoContainer}>
          <Text style={styles.label}>Foto:</Text>
          <Image
            source={{ uri: `data:image/jpeg;base64,${assinatura.foto}` }}
            style={styles.photo}
          />
        </View>
      ) : null}
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
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
    fontSize: 18,
    color: "#D32F2F",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  photoContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default ConsultaAssinatura;
