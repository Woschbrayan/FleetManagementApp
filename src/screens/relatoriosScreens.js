import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const relatoriosScreens = ({ navigation }) => {
    const ordensServico = [
        { id: '1', titulo: 'Orden de serviços', destino: 'AberturaOSScreen' },
        { id: '2', titulo: 'Orçamentos', destino: 'SolicitacaoOSScreen' },
        { id: '3', titulo: 'Veiculos', destino: 'DistribuicaoOS' },
        { id: '4', titulo: 'Financeiro', destino: 'OrcamentoOS' },
        { id: '5', titulo: 'Usuarios', destino: 'AvaliacaoOS' },
        { id: '6', titulo: 'Credenciados', destino: 'CheckListOS' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(item.destino)}
        >
            <Text style={styles.cardText}>{item.titulo}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Relatorios</Text>
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
});

export default relatoriosScreens;
