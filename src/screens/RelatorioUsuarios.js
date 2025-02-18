import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // para ícones (opcional)
import API_BASE_URL from "./config";
const API_URL = `${API_BASE_URL}/usuarios.php?status=user`;

const ListarUsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.message || "Erro na API");
        }
        // data.data deve ser o array de usuários, ex:
        // [
        //   {
        //     "cad_codigo": "101957",
        //     "cad_nome": "E&P INFRA...",
        //     "cad_status": "AT",
        //     "ace_nivel_acesso": "222",
        //     "nome_nivel": "Operador do sistema (Suprimentos)"
        //   },
        //   ...
        // ]
        setUsuarios(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Renderiza cada usuário em um "card"
  const renderUsuario = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {/* Ícone de usuário (opcional) */}
          <Ionicons name="person-circle-outline" size={24} color="#007BFF" />
          <Text style={styles.cardTitle}>Usuário: {item.cad_nome}</Text>
        </View>

        <View style={styles.cardContent}>
          {/* <Text style={styles.infoText}>
            <Text style={styles.bold}>Nome: </Text>
            {item.cad_nome}
          </Text> */}
          <Text style={styles.infoText}>
            <Text style={styles.bold}>CPF / CNPJ: </Text>
            {item.cad_cpf_cnpj || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>E-mail: </Text>
            {item.cad_mail || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Telefone: </Text>
            {item.cad_fone_1 || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Nível Acesso: </Text>
            {item.nome_nivel || "N/A"}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando usuários...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            // dispara o fetch de novo
            // ou recarrega a tela, etc.
          }}
        >
          <Text style={styles.reloadText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Lista de Usuários</Text> */}

      {usuarios.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum usuário encontrado.</Text>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item, index) => String(item.cad_codigo || index)}
          renderItem={renderUsuario}
        />
      )}
    </View>
  );
};

export default ListarUsuariosScreen;

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
    backgroundColor: "#F8F9FA",
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
    color: "#fff",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  // Estilos do card
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,

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
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
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
