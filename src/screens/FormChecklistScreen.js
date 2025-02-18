import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TextInput, Surface } from 'react-native-paper';
import API_BASE_URL from './config';

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
  const { groupId, cadCodigo } = route.params;

  const fetchVeiculos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos.php?grupoid=${groupId}`);
      const result = await response.json();
      if (result.status === 'success') {
        setVeiculos(result.data);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const formatarData = (dataIso) => {
    if (!dataIso) return "Data não disponível";
    const dataObj = new Date(dataIso);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = () => {
    if (!veiculoSelecionado || !km || !observacoes) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const checklistData = {
      cadCodigo,
      groupId,
      veiculoSelecionado,
      km,
      dataTrocaOleo: dataTrocaOleo.toISOString().split('T')[0],
      observacoes,
    };

    navigation.navigate('ChecklistItemsScreen', { checklistData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Etapa 1: Seleção de Veículo + KM + Data da Troca de Óleo */}
      {etapa === 1 && (
        <Surface style={styles.step}>
          <View style={styles.inputContainer}>
            <Text style={styles.stepHeader}>🚗 Selecione o Veículo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={veiculoSelecionado}
                onValueChange={(itemValue) => setVeiculoSelecionado(itemValue)}
                style={styles.pickerStyled}
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
            </View>
          </View>

          <Text style={styles.stepHeader}>📍 KM Atual</Text>
          <TextInput
            label="Informe o KM"
            mode="outlined"
            keyboardType="numeric"
            value={km}
            onChangeText={setKm}
            style={styles.input}
            theme={{ colors: { primary: '#007BFF' } }} // Azul padrão
          />

          <Text style={styles.stepHeader}>📅 Data da Troca de Óleo</Text>
          <Button
            mode="contained"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {formatarData(dataTrocaOleo)}
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

      {/* Etapa 2: Observações */}
      {etapa === 2 && (
        <Surface style={styles.step}>
          <Text style={styles.stepHeader}>📝 Observações</Text>
          <TextInput
            label="Digite as observações"
            mode="outlined"
            multiline
            value={observacoes}
            onChangeText={setObservacoes}
            style={[styles.input, styles.textArea]}
            theme={{ colors: { primary: '#007BFF' } }} // Azul padrão
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
        {etapa < 2 ? (
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
            style={styles.buttonSubmit}
          >
             Finalizar 
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  step: {
    marginBottom: 20,
    padding: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  stepHeader: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    // borderColor: '#007BFF', // Azul padrão
    borderRadius: 5,
    // paddingVertical: 1,
    paddingHorizontal: 10,
  },
  pickerStyled: {
    height: 50,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    marginTop: 10,
    backgroundColor: '#007BFF', // Azul padrão
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  buttonBack: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: '#007BFF',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  buttonNext: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#007BFF',
  },
  buttonSubmit: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#007BFF',
  },
});

export default FormChecklistScreen;
