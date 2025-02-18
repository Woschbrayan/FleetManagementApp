import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Picker as Select } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import API_BASE_URL from './config';
const OrdemServicoForm = () => {
    const route = useRoute();
    const navigation = useNavigation();
  const [step, setStep] = useState(1); // Controla qual etapa estamos exibindo
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
  const [kmAtual, setKmAtual] = useState('');

  const [cidadeAbertura, setCidadeAbertura] = useState('');
  const [cidades, setCidades] = useState([]);
  const [filteredCidades, setFilteredCidades] = useState([]);
  const [cidadeSearch, setCidadeSearch] = useState('');

  const [inoperante, setInoperante] = useState('');
  const [complementar, setComplementar] = useState('');
  const [tipoOS, setTipoOS] = useState('');
  const [insumo, setInsumo] = useState('');
  const [padraoSelecionado, setPadraoSelecionado] = useState('');
  const [osPadrao, setOsPadrao] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
 

  const [mostrarCampoMotorista, setMostrarCampoMotorista] = useState(false);
const [motoristaSelecionado, setMotoristaSelecionado] = useState("");
const [motoristas, setMotoristas] = useState([]);


const fetchMotoristas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/motoristas.php`);
    const data = await response.json();

    if (data.status === 'success') {
      setMotoristas(data.data);
    } else {
      Alert.alert('Erro', 'Nenhum motorista encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    Alert.alert('Erro', 'Não foi possível carregar a lista de motoristas');
  }
};
useEffect(() => {
  fetchMotoristas();
}, []);


  useEffect(() => {
    // Carregar os dados dos veículos com base no tipo de veículo
    if (tipoVeiculo) {
      fetchVeiculos();
    }
  }, [tipoVeiculo]);


  const fetchVeiculos = async () => {
    try {
      if (!tipoVeiculo) {
        return; // Não faz a requisição se tipoVeiculo não for definido
      }
      const response = await fetch(`${API_BASE_URL}/veiculos.php?tipoVeiculo=${tipoVeiculo}`);
      // const response = await fetch(`http://192.168.100.63/apis/veiculos.php?tipoVeiculo=${tipoVeiculo}`);
      const data = await response.json();
      if (data.status === 'success') {
        setVeiculos(data.data); // Armazena os veículos no estado
      } else {
        Alert.alert('Erro', 'Nenhum veículo encontrado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os veículos');
    }
  };

  const fetchCidades = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/tab_cidades.php?action=getSelectOptions`);
        const data = await response.json();
        if (data.status === 'success') {
            setCidades(data.data);
            setFilteredCidades(data.data);
        } else {
            Alert.alert('Erro', 'Nenhuma cidade encontrada');
        }
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as cidades');
    }
};

const handleCidadeSearch = (text) => {
    setCidadeSearch(text);
    if (text === '') {
        setFilteredCidades(cidades);
    } else {
        const filtered = cidades.filter(cidade => 
            cidade.cidade.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCidades(filtered);
    }
};

  useEffect(() => {
    fetchCidades();
  }, []);



  const fetchPadroesOS = async () => {
    console.log("Iniciando a função fetchPadroesOS...");
  
    try {
      console.log("Fazendo requisição para a API...");
      const response = await fetch(`${API_BASE_URL}/mov_os_especial.php`);
      console.log("Resposta da API recebida:", response);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API (Status não OK):", errorText);
        Alert.alert("Erro", `Falha na requisição: ${response.status} - ${response.statusText}`);
        return;
      }
  
      const textResponse = await response.text();
      console.log("Texto bruto da resposta:", textResponse);
  
      if (!textResponse) {
        console.error("Resposta da API vazia.");
        Alert.alert("Erro", "A resposta da API está vazia.");
        return;
      }
  
      let data;
      try {
        data = JSON.parse(textResponse);
        console.log("Dados retornados pela API:", data);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
        Alert.alert("Erro", "A resposta da API não é um JSON válido.");
        return;
      }
  
      if (data && data.status === 'success') {
        setOsPadrao(data.data || []);
        console.log("Dados definidos no estado com sucesso.");
      } else {
        console.warn("Nenhum padrão encontrado ou status diferente de 'success':", data);
        Alert.alert("Erro", data.message || "Nenhum padrão encontrado");
        setOsPadrao([]);
      }
    } catch (error) {
      console.error("Erro capturado durante a chamada da API:", error);
      Alert.alert("Erro", "Não foi possível carregar os padrões");
      setOsPadrao([]);
    } finally {
      console.log("Função fetchPadroesOS finalizada.");
    }
  };
  
  

  useEffect(() => {
    fetchPadroesOS();
  }, []);

  const handleAvancar = () => {
    if (step === 1 && !tipoVeiculo) {
      Alert.alert('Erro', 'Selecione o tipo de veículo');
      return;
    }

    if (step === 2 && !veiculoSelecionado) {
      Alert.alert('Erro', 'Selecione um veículo');
      return;
    }

    if (step === 3 && (!kmAtual || !cidadeAbertura)) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    // Avançar para a próxima etapa
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!tipoVeiculo || !veiculoSelecionado || !kmAtual || !cidadeAbertura) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }
  
    const payload = {
      tipoVeiculo,
      veiculoSelecionado,
      kmAtual,
      cidadeAbertura,
      inoperante,
      complementar,
      tipoOS,
      padraoSelecionado,
      motoristaSelecionado,
    };
  
    console.log(payload);
  
    try {
      const response = await fetch(`${API_BASE_URL}/insert_mov_os.php`, {
      // const response = await fetch('http://192.168.100.63/apis/insert_mov_os.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Verificar se a resposta da API está OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', errorText);
        Alert.alert('Erro', 'Falha na requisição, verifique o servidor');
        return;
      }
  
      // Obter a resposta como texto
      const textResponse = await response.text();
      console.log(textResponse);
  
      let data;
      try {
        // Tenta fazer o parse do JSON
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e);
        Alert.alert('Erro', 'A resposta da API não é um JSON válido');
        return;
      }
  
      console.log(data);
  
      if (data.status === 'success') {
        Alert.alert('Sucesso', 'Ordem de Serviço aberta com sucesso!');
      }else {
        Alert.alert('Erro', data.message || 'Erro ao abrir Ordem de Serviço');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a Ordem de Serviço');
      console.log('Erro ao acessar a API:', error);
    }
  };
  

  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                {step === 1 && (
                    <>
                        <Text style={styles.label}>Tipo de Veículo:</Text>
                        <Select
                            selectedValue={tipoVeiculo}
                            onValueChange={(itemValue) => setTipoVeiculo(String(itemValue))}
                            style={styles.picker}
                        >
                            <Select.Item label="Selecione" value="" />
                            <Select.Item label="Leves" value="1" />
                            <Select.Item label="Medios" value="2" />
                            <Select.Item label="Pesados" value="3" />
                            <Select.Item label="Maquinas / Equipamentos" value="4" />
                            <Select.Item label="Motos" value="5" />
                            <Select.Item label="Embarcação" value="6" />
                        </Select>

                        <Text style={styles.label}>Selecione um veículo:</Text>
                        {veiculos.length > 0 ? (
                            <Select
                                selectedValue={veiculoSelecionado}
                                onValueChange={(itemValue) => setVeiculoSelecionado(String(itemValue))}
                                style={styles.picker}
                            >
                                <Select.Item label="Selecione um veículo" value="" />
                                {veiculos.map((veiculo) => (
                                    <Select.Item
                                        key={veiculo.vei_codigo}
                                        label={veiculo.veiculo_detalhes}
                                        value={String(veiculo.vei_codigo)}
                                    />
                                ))}
                            </Select>
                        ) : (
                            <Text>Carregando veículos...</Text>
                        )}
                    </>
                )}

                {/* {step === 2 && (
                    <>
                        <Text style={styles.label}>Selecione um veículo:</Text>
                        {veiculos.length > 0 ? (
                            <Select
                                selectedValue={veiculoSelecionado}
                                onValueChange={(itemValue) => setVeiculoSelecionado(String(itemValue))}
                                style={styles.picker}
                            >
                                <Select.Item label="Selecione um veículo" value="" />
                                {veiculos.map((veiculo) => (
                                    <Select.Item
                                        key={veiculo.vei_codigo}
                                        label={veiculo.veiculo_detalhes}
                                        value={String(veiculo.vei_codigo)}
                                    />
                                ))}
                            </Select>
                        ) : (
                            <Text>Carregando veículos...</Text>
                        )}
                    </>
                )} */}
                {step === 2 && (
                    <>
                        <Text style={styles.label}>KM Atual:</Text>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Informe o KM atual"
                            value={kmAtual}
                            onChangeText={setKmAtual}
                            style={styles.input}
                            onBlur={Keyboard.dismiss}
                        />
                       <Text style={styles.label}>Cidade de Abertura:</Text>
                            <TextInput
                                placeholder="Digite para buscar cidade"
                                value={cidadeSearch}
                                onChangeText={handleCidadeSearch}
                                style={styles.input}
                            />
                            <Select
                                selectedValue={cidadeAbertura}
                                onValueChange={(itemValue) => setCidadeAbertura(String(itemValue))}
                                style={styles.picker}
                            >
                                <Select.Item label="Selecione uma cidade" value="" />
                                {filteredCidades.map((cidade) => (
                                    <Select.Item
                                        key={cidade.cid_codigo}
                                        label={cidade.cidade}
                                        value={String(cidade.cid_codigo)}
                                    />
                                ))}
                            </Select>
                            <Text style={styles.label}>Inoperante?</Text>
                        <Select
                            selectedValue={inoperante}
                            onValueChange={(itemValue) => setInoperante(itemValue)}
                            style={styles.picker}
                        >
                            <Select.Item label="Selecione" value="" />
                            <Select.Item label="Sim" value="sim" />
                            <Select.Item label="Não" value="não" />
                        </Select>
                        <Text style={styles.label}>Complementar?</Text>
                         <Select
                             selectedValue={complementar}
                             onValueChange={(itemValue) => setComplementar(itemValue)}
                             style={styles.picker}
                         >
                             <Select.Item label="Selecione" value="" />
                             <Select.Item label="Sim" value="sim" />
                             <Select.Item label="Não" value="não" />
                         </Select>
                         <Text style={styles.label}>Tipo de OS:</Text>
                        <Select
                            selectedValue={tipoOS}
                            onValueChange={(itemValue) => setTipoOS(itemValue)}
                            style={styles.picker}
                        >
                            <Select.Item label="Corretiva" value="1" />
                            <Select.Item label="Preventiva" value="2" />
                            <Select.Item label="Insumos" value="3" />
                        </Select>
                            
                      </>
                )}

                {/* {step === 4 && (
                    <>
                        <Text style={styles.label}>Inoperante?</Text>
                        <Select
                            selectedValue={inoperante}
                            onValueChange={(itemValue) => setInoperante(itemValue)}
                            style={styles.picker}
                        >
                            <Select.Item label="Selecione" value="" />
                            <Select.Item label="Sim" value="sim" />
                            <Select.Item label="Não" value="não" />
                        </Select>

                         <Text style={styles.label}>Complementar?</Text>
                         <Select
                             selectedValue={complementar}
                             onValueChange={(itemValue) => setComplementar(itemValue)}
                             style={styles.picker}
                         >
                             <Select.Item label="Selecione" value="" />
                             <Select.Item label="Sim" value="sim" />
                             <Select.Item label="Não" value="não" />
                         </Select>
                    </>
                )} */}

                {/* {step === 4 && (
                    <>
                        <Text style={styles.label}>Tipo de OS:</Text>
                        <Select
                            selectedValue={tipoOS}
                            onValueChange={(itemValue) => setTipoOS(itemValue)}
                            style={styles.picker}
                        >
                            <Select.Item label="Corretiva" value="1" />
                            <Select.Item label="Preventiva" value="2" />
                            <Select.Item label="Insumos" value="3" />
                        </Select>
                    </>
                )} */}

                {step === 3 && (
                    <>
                        <Text style={styles.label}>Padrão da Ordem de Serviço:</Text>
                        <Select
                            selectedValue={padraoSelecionado}
                            onValueChange={(itemValue) => {
                                setPadraoSelecionado(String(itemValue));
                                if (String(itemValue) === "27") {
                                    setMostrarCampoMotorista(true);
                                } else {
                                    setMostrarCampoMotorista(false);
                                }
                            }}
                            style={styles.picker}
                        >
                            {osPadrao && osPadrao.length > 0 ? (
                                osPadrao.map((padrao) => (
                                    <Select.Item
                                        key={padrao.oes_codigo}
                                        label={padrao.oes_nome}
                                        value={String(padrao.oes_codigo)}
                                    />
                                ))
                            ) : (
                                <Select.Item label="Nenhum padrão disponível" value="" />
                            )}
                        </Select>

                        {mostrarCampoMotorista && (
                                  <>
                                    <Text style={styles.label}>Selecionar Motorista:</Text>
                                    <Select
                                      selectedValue={motoristaSelecionado}
                                      onValueChange={(itemValue) => setMotoristaSelecionado(itemValue)}
                                      style={styles.picker}
                                    >
                                      <Select.Item label="Selecione um motorista" value="" />
                                      {motoristas.map((motorista) => (
                                        <Select.Item
                                          key={motorista.cad_codigo}
                                          label={motorista.cad_nome}
                                          value={String(motorista.cad_codigo)}
                                        />
                                      ))}
                                    </Select>
                                  </>
                                )}

                    </>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={step ===3 ? handleSubmit : handleAvancar}
                >
                    <Text style={styles.buttonText}>{step === 3 ? 'Finalizar' : 'Avançar'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F9', // Cinza claro para fundo mais suave
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    color: '#333',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  input: {
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Sombra para Android
  },
  button: {
    backgroundColor: '#007BFF', // Azul mais chamativo
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Efeito 3D no Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
});


export default OrdemServicoForm;
