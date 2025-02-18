import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import API_BASE_URL from "./config";
const API_SIGNATURES_URL =  `${API_BASE_URL}/signatures.php`;

const AssinaturasorcScreen = ({ route }) => {
  const { orcCodigo } = route.params;
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getValidationInfo = (validacao) => {
    switch (validacao) {
      case 1:
        return { label: "Aprovado", color: "#28a745" }; // Verde
      case 2:
        return { label: "Reprovado", color: "#dc3545" }; // Vermelho
      default:
        return { label: "Pendente", color: "#6c757d" }; // Cinza
    }
  };

  useEffect(() => {
    if (!orcCodigo) {
      setError("Parâmetro 'orcCodigo' não fornecido.");
      setLoading(false);
      return;
    }

    fetch(`${API_SIGNATURES_URL}?orcamento=${orcCodigo}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success" && data.data.length > 0) {
          setSignatures(data.data);
        } else {
          Alert.alert("Aviso", "Ainda não houve nenhuma assinatura para esta ordem.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orcCodigo]);

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{`Erro: ${error}`}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando assinaturas...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={signatures}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const { label: statusLabel, color: statusColor } = getValidationInfo(item.validacao);

        return (
          <View style={styles.signatureCard}>
            <Text style={styles.signatureText}>{`Responsável: ${item.responsavel_nome}`}</Text>
            <Text style={styles.signatureText}>{`Tipo de Usuário: ${item.tipo_user_nome}`}</Text>
            <Text style={styles.signatureText}>{`Data: ${item.data_assinatura}`}</Text>
            <Text style={[styles.signatureText, { color: statusColor }]}>
              {`Status: ${statusLabel}`}
            </Text>
          
          </View>
        );
      }}
      ListEmptyComponent={
        <Text style={styles.loadingText}>Nenhuma assinatura encontrada.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
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
  signatureCard: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  signatureText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
});

export default AssinaturasorcScreen;
