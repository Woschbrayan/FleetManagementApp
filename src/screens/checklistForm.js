import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

const checklistForm = ({ route, navigation }) => {
  const { osCodigo, tipo } = route.params;
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [km, setKm] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [checklist, setChecklist] = useState({
    vidros: "",
    pintura: "",
    limpeza: "",
    manuais: "",
    palhetas: "",
  });
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    console.log(`OS Código: ${osCodigo}, Tipo: ${tipo}`);
  }, []);

  const handleSubmit = async () => {
    const payload = {
      osCodigo,
      tipo,
      nome,
      cpf,
      km,
      combustivel,
      checklist,
      observacao,
    };

    try {
      const response = await fetch("https://syntron.com.br/sistemas/apis/checkListEnvia.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log(response)
      if (response.ok) {
        const result = await response.json();
        Alert.alert("Sucesso", "Checklist enviado com sucesso!");
        console.log(result)
        navigation.goBack();
      } else {
        Alert.alert("Erro", "Falha ao enviar o checklist. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar checklist:", error);
      Alert.alert("Erro", "Ocorreu um erro ao enviar os dados. Verifique sua conexão.");
    }
  };

  const renderChecklistItem = (label, key) => (
    <View style={styles.checklistItem} key={key}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={
            checklist[key] === "S"
              ? [styles.optionButton, styles.optionSelected]
              : styles.optionButton
          }
          onPress={() => setChecklist({ ...checklist, [key]: "S" })}
        >
          <Text style={styles.optionText}>SIM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            checklist[key] === "N"
              ? [styles.optionButton, styles.optionSelected]
              : styles.optionButton
          }
          onPress={() => setChecklist({ ...checklist, [key]: "N" })}
        >
          <Text style={styles.optionText}>NÃO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCombustivelOptions = () => (
    <View style={styles.optionsContainer}>
      {["1", "2", "3", "4", "5"].map((value, index) => (
        <TouchableOpacity
          key={index}
          style={
            combustivel === value
              ? [styles.optionButton, styles.optionSelected]
              : styles.optionButton
          }
          onPress={() => setCombustivel(value)}
        >
          <Text style={styles.optionText}>{`Nível ${value}`}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Formulário de Checklist</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Km do veículo"
        value={km}
        onChangeText={setKm}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nível do Combustível</Text>
      {renderCombustivelOptions()}

      {renderChecklistItem("Vidros", "vidros")}
      {renderChecklistItem("Pintura", "pintura")}
      {renderChecklistItem("Limpeza Interna", "limpeza")}
      {renderChecklistItem("Manuais", "manuais")}
      {renderChecklistItem("Palhetas", "palhetas")}

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Observação"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar Checklist</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  optionButton: {
    padding: 10,
    backgroundColor: "#EEE",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  optionText: {
    fontSize: 14,
  },
  checklistItem: {
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default checklistForm;