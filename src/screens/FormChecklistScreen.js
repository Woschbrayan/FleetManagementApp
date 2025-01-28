import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TextInput, Surface } from 'react-native-paper';

const FormChecklistScreen = () => {
  const [etapa, setEtapa] = useState(1);
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
  const [km, setKm] = useState('');
  const [dataTrocaOleo, setDataTrocaOleo] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const { groupId } = route.params;
console.log("ID do item recebido (idItem):", groupId);
  const fetchVeiculos = async () => {
    try {
      const response = await fetch(`https://syntron.com.br/sistemas/apis/veiculos.php?grupoid=${groupId}`);
      // const response = await fetch('http://192.168.100.63/apis/veiculos.php');
      console.log(response);
      const result = await response.json();
      if (result.status === 'success') {
        setVeiculos(result.data);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const handleSubmit = () => {
    if (!veiculoSelecionado || !km || !observacoes) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    // Dados do formulário
    const checklistData = {
      groupId,
      veiculoSelecionado,
      km,
      dataTrocaOleo: dataTrocaOleo.toISOString().split('T')[0],
      observacoes,
    };
    console.log("ID do item recebido (idItem):", groupId);
    // Navegar para a próxima tela passando os dados do formulário
    navigation.navigate('ChecklistItemsScreen', { checklistData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Preencha os Dados do Checklist</Text>

      {/* Etapa 1 */}
      {etapa === 1 && (
        <Surface style={styles.step}>
          <Text style={styles.stepHeader}>Etapa 1: Selecione o Veículo</Text>
          <Picker
            selectedValue={veiculoSelecionado}
            onValueChange={(itemValue) => setVeiculoSelecionado(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um veículo" value="" />
            {veiculos.map((veiculo) => (
              <Picker.Item
                key={String(veiculo.vei_codigo)}
                label={veiculo.veiculo_detalhes}
                value={String(veiculo.vei_codigo)}
              />
            ))}
          </Picker>
        </Surface>
      )}

      {/* Etapa 2 */}
      {etapa === 2 && (
        <Surface style={styles.step}>
          <Text style={styles.stepHeader}>Etapa 2: Preencha os Dados</Text>
          <TextInput
            label="KM Atual"
            mode="outlined"
            keyboardType="numeric"
            value={km}
            onChangeText={setKm}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={() => setShowDatePicker(true)}
            style={styles.button}
          >
            Data da Troca de Óleo: {dataTrocaOleo.toISOString().split('T')[0]}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={dataTrocaOleo}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDataTrocaOleo(selectedDate);
              }}
            />
          )}
        </Surface>
      )}

      {/* Etapa 3 */}
      {etapa === 3 && (
        <Surface style={styles.step}>
          <Text style={styles.stepHeader}>Etapa 3: Observações</Text>
          <TextInput
            label="Observações"
            mode="outlined"
            multiline
            value={observacoes}
            onChangeText={setObservacoes}
            style={[styles.input, styles.textArea]}
          />
        </Surface>
      )}

      {/* Botões de navegação */}
      <View style={styles.buttonContainer}>
        {etapa > 1 && (
          <Button
            mode="outlined"
            onPress={() => setEtapa(etapa - 1)}
            style={styles.buttonBack}
          >
            Voltar
          </Button>
        )}
        {etapa < 3 ? (
          <Button
            mode="contained"
            onPress={() => setEtapa(etapa + 1)}
            style={styles.buttonNext}
          >
            Próxima Etapa
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.buttonNext}
          >
            Avançar para Itens do Checklist
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  step: { marginBottom: 20, padding: 15,  elevation: 3 },
  stepHeader: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  // picker: { height: 50, marginBottom: 15 },
  input: { marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 120 },
  buttonBack: { flex: 1, marginHorizontal: 5, borderWidth: 1, borderColor: '#ccc', backgroundColor: 'white' },
  buttonNext: { flex: 1, marginHorizontal: 5, backgroundColor: '#007BFF' },
});

export default FormChecklistScreen;
