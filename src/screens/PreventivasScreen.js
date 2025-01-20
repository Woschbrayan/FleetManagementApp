import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PreventivasScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Preventivas</Text>
            <Text style={styles.description}>
                Aqui você pode visualizar e gerenciar as manutenções preventivas dos veículos da frota.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default PreventivasScreen;