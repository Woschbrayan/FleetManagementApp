import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

const ItemForm = ({ route, navigation }) => {
  const { osId, orcamentoId, item, editMode } = route.params || {};

  const [formData, setFormData] = useState({
    itemType: item?.oit_peca_servico || "1", // Tipo de item: "1" para peça, "2" para serviço
    itemName: item?.oit_descricao_item || "", // Nome do item
    unitValue: item?.oit_peca_servico === "1"
      ? item?.oit_vlr_uni_pecas_lancado || ""
      : item?.oit_vlr_uni_mao_de_obra_lancado || "",
    quantity: item?.oit_peca_servico === "1"
      ? item?.oit_qtde_pecas_lancado || ""
      : item?.oit_qtde_mao_de_obra_lancado || "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  useEffect(() => {
    console.log("Dados recebidos no ItemForm:", {
      osId,
      orcamentoId,
      item,
      editMode,
    });
  }, [route.params]);
  
  const handleSubmit = () => {
    // Monta o payload para a API
    const payload = {
      id: editMode ? item?.id : null, // Se for edição, envia o ID do item
      mov_orcamento_orc_codigo: orcamentoId,
      oit_peca_servico: formData.itemType,
      oit_descricao_item: formData.itemName,
      oit_qtde:
        formData.itemType === "1" // Verifica o tipo para usar os valores corretos
          ? parseFloat(formData.quantity) // Para peça
          : parseFloat(formData.quantity), // Para serviço
      oit_vlr_unitario:
        formData.itemType === "1"
          ? parseFloat(formData.unitValue) // Para peça
          : parseFloat(formData.unitValue), // Para serviço
    };
  
    console.log("Payload enviado para a API:", payload);
  
    // URL da API
    const API_URL = "https://syntron.com.br/sistemas/apis/saveItem.php";
  
    // Faz a requisição para a API
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert(
            "Sucesso",
            editMode
              ? "Item atualizado com sucesso!"
              : "Item cadastrado com sucesso!"
          );
          navigation.goBack(); // Retorna à tela anterior
        } else {
          Alert.alert("Erro", data.error || "Erro ao salvar o item.");
        }
      })
      .catch((error) => {
        console.error("Erro ao salvar o item:", error);
        Alert.alert("Erro", "Não foi possível salvar o item.");
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de Item:</Text>
      <View style={styles.radioGroup}>
        {/* Opção: Peça */}
        <TouchableOpacity
          style={[
            styles.radioOption,
            formData.itemType === "1" && styles.radioOptionSelected,
          ]}
          onPress={() => handleInputChange("itemType", "1")}
        >
          <Text
            style={formData.itemType === "1" ? styles.radioTextSelected : styles.radioText}
          >
            Peça
          </Text>
        </TouchableOpacity>

        {/* Opção: Serviço */}
        <TouchableOpacity
          style={[
            styles.radioOption,
            formData.itemType === "2" && styles.radioOptionSelected,
          ]}
          onPress={() => handleInputChange("itemType", "2")}
        >
          <Text
            style={formData.itemType === "2" ? styles.radioTextSelected : styles.radioText}
          >
            Serviço
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nome do Item:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Item"
        value={formData.itemName}
        onChangeText={(text) => handleInputChange("itemName", text)}
      />

      <Text style={styles.label}>Valor Unitário:</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor Unitário"
        value={formData.unitValue}
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange("unitValue", text)}
      />

      <Text style={styles.label}>Quantidade:</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={formData.quantity}
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange("quantity", text)}
      />

      <Button title={editMode ? "Atualizar Item" : "Cadastrar Item"} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 15,
  },
  radioOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginRight: 5,
  },
  radioOptionSelected: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  radioText: {
    color: "#555",
  },
  radioTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ItemForm;
