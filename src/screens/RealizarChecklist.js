import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Card, Button, CheckBox } from "react-native-elements";
import moment from "moment";
import API_BASE_URL from "./config";
const RealizarChecklist = ({ route, navigation }) => {
  const { osId, type, cadCodigo } = route.params;
  const [step, setStep] = useState(1); // Controla a etapa do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [km, setKm] = useState(""); // Campo de quilometragem
  const [observacao, setObservacao] = useState("");
  const [items, setItems] = useState({
    e1: null,
    e2: null,
    e3: null,
    e4: null,
    e5: null,
  });

  const handleItemChange = (key, value) => {
    setItems((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      osId,
      cadCodigo,
      type,
      nome,
      cpf,
      observacao,
      km,
      items,
      dataAtual: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    console.log("Payload enviado:", JSON.stringify(payload, null, 2)); // Log para verificar o payload

    fetch(`${API_BASE_URL}/saveChecklist.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Resposta da API:", data); // Log para verificar a resposta da API

        if (data.success) {
          Alert.alert("Sucesso", "Checklist salvo com sucesso!", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Erro", data.error || "Erro ao salvar checklist.");
        }
      })
      .catch((error) => {
        console.error("Erro ao salvar checklist:", error);
        Alert.alert("Erro", "Não foi possível salvar o checklist.");
      });
  };

  const itemLabels = {
    e1: "Vidros",
    e2: "Pintura",
    e3: "Limpeza Interna",
    e4: "Manuais",
    e5: "Palhetas",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 && (
        <Card containerStyle={styles.card}>
          <Card.Title>{`Realizar Checklist de ${type === "entrada" ? "Entrada" : "Saída"}`}</Card.Title>
          <Card.Divider />

          <Text style={styles.label}>
            Nome de quem {type === "entrada" ? "entregou" : "retirou"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Digite o nome de quem ${type === "entrada" ? "entregou" : "retirou"}`}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>
            CPF de quem {type === "entrada" ? "entregou" : "retirou"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Digite o CPF de quem ${type === "entrada" ? "entregou" : "retirou"}`}
            value={cpf}
            keyboardType="numeric"
            onChangeText={setCpf}
          />

          <Text style={styles.label}>
            Quilometragem {type === "entrada" ? "de entrada" : "de saída"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Digite a quilometragem ${type === "entrada" ? "de entrada" : "de saída"}`}
            value={km}
            keyboardType="numeric"
            onChangeText={setKm}
          />

          <Text style={styles.label}>Observação</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite uma observação (opcional)"
            value={observacao}
            multiline={true}
            numberOfLines={4}
            onChangeText={setObservacao}
          />

          <Button
            title="Próxima Etapa"
            onPress={() => setStep(2)}
            buttonStyle={styles.button}
          />
        </Card>
      )}

      {step === 2 && (
        <Card containerStyle={styles.card}>
          <Card.Title>Seleção de Itens</Card.Title>
          <Card.Divider />

          {Object.keys(items).map((key) => (
            <View key={key} style={styles.itemContainer}>
              {/* Usa o mapeamento itemLabels para exibir o nome amigável */}
              <Text style={styles.itemLabel}>{itemLabels[key] || `Item ${key.toUpperCase()}`}</Text>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  title="Ok"
                  checked={items[key] === "S"}
                  onPress={() => handleItemChange(key, "S")}
                  containerStyle={styles.checkbox}
                />
                <CheckBox
                  title="Não Ok"
                  checked={items[key] === "N"}
                  onPress={() => handleItemChange(key, "N")}
                  containerStyle={styles.checkbox}
                />
              </View>
            </View>
          ))}

          <Button
            title="Salvar Checklist"
            onPress={handleSubmit}
            buttonStyle={styles.button}
          />
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50",
    marginTop: 20,
  },
  itemContainer: {
    marginBottom: 15,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  checkbox: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
});

export default RealizarChecklist;
