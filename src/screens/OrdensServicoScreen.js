import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const OrdensServicoScreen = ({ navigation, route }) => {
    // Obter dados passados via parâmetros de navegação
    const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {};

    // Verifique se os parâmetros foram recebidos
    console.log(route.params); // Adicione esse log para verificar

    // Dados de ordens de serviço
    const ordensServico = [
        { id: '1', titulo: 'Abrir O.S.', destino: 'AberturaOSScreen' },
        { id: '2', titulo: 'Solicitações de O.S.', destino: 'SolicitacaoOSScreen' },
        { id: '3', titulo: 'Distribuição', destino: 'DistribuicaoOS' },
        { id: '4', titulo: 'Orçamentos', destino: 'OrcamentoOS' },
        { id: '5', titulo: 'Avaliação', destino: 'AvaliacaoOS' },
        { id: '6', titulo: 'Check List', destino: 'CheckListOS' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => 
                navigation.navigate(item.destino, {
                    cadCodigo,
                    cadNome,
                    nomeNivel,
                    nivelAcesso
                })
            }
        >
            <Text style={styles.cardText}>{item.titulo}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ordens de Serviço</Text>         
            <FlatList
                data={ordensServico}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#007bff', // Azul do Bootstrap para o header
    },
    card: {
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#007bff', // Azul do Bootstrap para o fundo do card
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#ffffff', // Cor branca para o texto
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
});

export default OrdensServicoScreen;
