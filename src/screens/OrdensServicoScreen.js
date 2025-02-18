import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';

const OrdensServicoScreen = ({ navigation, route }) => {
    const { cadCodigo, cadNome, nomeNivel, nivelAcesso } = route.params || {};

    console.log(route.params); // Log para debug

    const ordensServico = [
        { id: '1', titulo: ' Abrir O.S.', destino: 'AberturaOSScreen' },
        { id: '2', titulo: ' Solicitações ', destino: 'SolicitacaoOSScreen' },
        { id: '3', titulo: ' Distribuição', destino: 'DistribuicaoOS' },
        { id: '4', titulo: ' Orçamentos', destino: 'OrcamentoOS' },
        { id: '5', titulo: ' Avaliação', destino: 'AvaliacaoOS' },
        { id: '6', titulo: ' Check List', destino: 'CheckListOS' },
        { id: '7', titulo: ' Digita Orçamento', destino: 'OrcCred' },
        { id: '8', titulo: ' Digita Check List', destino: 'checklistCredencido' },
    ];

    const filtrarOrdensServico = () => {
        switch (nivelAcesso) {
            case 251: // Orçamentista - CREDENCIADOS
            case 250: // Orçamentista
                return ordensServico.filter(item =>
                    item.destino === 'OrcCred' || item.destino === 'checklistCredencido'
                );
            case 999: // Administrador do Sistema
                return ordensServico.filter(item =>
                    item.destino !== 'OrcCred' && item.destino !== 'checklistCredencido'
                );
            case 222: // Operador do Sistema Suprimentos
                return ordensServico.filter(item =>
                    item.destino === 'OrcamentoOS' || item.destino === 'CheckListOS'
                );
            case 960: // Gestão da Frota Lança O.S Nível 1
                return ordensServico.filter(item =>
                    item.destino === 'AberturaOSScreen' ||
                    item.destino === 'SolicitacaoOSScreen' ||
                    item.destino === 'DistribuicaoOS' ||
                    item.destino === 'OrcamentoOS'
                );
            case 997: // Gestão de Frota Avaliador Nível 1
            case 998: // Gestão da Frota Nível 1
            case 223:
            case 224:
            case 225:
            case 227:
            case 228:
            case 229:
            case 800:
            case 995:
                return ordensServico.filter(item =>
                    item.destino === 'AvaliacaoOS' || item.destino === 'CheckListOS'
                );
            default:
                return [];
        }
    };

    const ordensFiltradas = filtrarOrdensServico();

    const renderItem = ({ item }) => {
        const scaleValue = new Animated.Value(1);

        const handlePressIn = () => {
            Animated.spring(scaleValue, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
            }).start(() => {
                navigation.navigate(item.destino, { cadCodigo, cadNome, nomeNivel, nivelAcesso });
            });
        };

        return (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity
                    style={styles.card}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={styles.cardText}>{item.titulo}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>⚙️ Ordens de Serviço</Text> */}
            {ordensFiltradas.length === 0 ? (
                <Text style={styles.infoText}>🚫 Você não tem acesso a nenhuma funcionalidade.</Text>
            ) : (
                <FlatList
                    data={ordensFiltradas}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            )}
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
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#007bff',
        textAlign: 'center',
    },
    card: {
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#007bff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    infoText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default OrdensServicoScreen;
