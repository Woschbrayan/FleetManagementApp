import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const RelatoriosOs = ({ navigation, route }) => {
    const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {};

    // Lista de status das O.S.
    const statusOS = [
        { id: '1', titulo: 'Em Orçamentação', destino: 'RelatorioOsStatus', status: 'EO', cor: '#007BFF' }, 
        { id: '2', titulo: 'Em Avaliação', destino: 'RelatorioOsStatus', status: 'AV', cor: '#007BFF' },
        { id: '3', titulo: 'Autorizada a Execução', destino: 'RelatorioOsStatus', status: 'AE', cor: '#007BFF' }, 
        { id: '4', titulo: 'Finalizados', destino: 'RelatorioOsStatus', status: 'FN', cor: '#007BFF' }, 
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: item.cor }]}
            onPress={() =>
                navigation.navigate(item.destino, {
                    cadCodigo,
                    cadNome,
                    nomeNivel,
                    nivelAcesso,
                    statusOS: item.status, // Envia o status da O.S.
                })
            }
        >
            <Text style={styles.cardText}>{item.titulo}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Status das Ordens de Serviço</Text>
            <FlatList
                data={statusOS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#007BFF',
    },
    card: {
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default RelatoriosOs;
