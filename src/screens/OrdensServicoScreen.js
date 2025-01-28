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
        { id: '7', titulo: 'Digita Orçamento', destino: 'OrcCred' },
        { id: '8', titulo: 'Digita Check List', destino: 'checklistCredencido' },
    ];

    // Função para determinar os cartões permitidos com base no nível de acesso
    const filtrarOrdensServico = () => {
        switch (nivelAcesso) {
            case 251: // Orçamentista - CREDENCIADOS
                return ordensServico.filter(item =>
                    item.destino === 'OrcCred' || item.destino === 'checklistCredencido'
                );
            case 250: // Orçamentista
                return ordensServico.filter(item =>
                    item.destino === 'OrcCred' || item.destino === 'checklistCredencido'
                );
            case 999: // Administrador do Sistema
            return ordensServico.filter(item =>
                item.destino === 'AberturaOSScreen' 
                || item.destino === 'SolicitacaoOSScreen' 
                || item.destino === 'DistribuicaoOS'
                || item.destino === 'OrcamentoOS' 
                || item.destino === 'AvaliacaoOS'
                || item.destino === 'CheckListOS'
            );
            case 222: // Operador do Sistema Suprimentos
                return ordensServico.filter(item =>
                    item.destino === 'OrcamentoOS' || item.destino === 'CheckListOS'
                );
            case 223:
            case 224:
            case 225:
            case 227:
            case 228:
            case 229:
            case 800:
            case 995: // Gerente, Diretor e Gestor de Frota
                return ordensServico.filter(item =>
                    item.destino === 'AvaliacaoOS' || item.destino === 'CheckListOS'
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
                return ordensServico.filter(item =>
                    item.destino === 'AvaliacaoOS' || item.destino === 'CheckListOS'
                );
            default:
                return []; // Sem acesso a nenhum cartão
        }
    };

    const ordensFiltradas = filtrarOrdensServico();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate(item.destino, {
                    cadCodigo,
                    cadNome,
                    nomeNivel,
                    nivelAcesso,
                })
            }
        >
            <Text style={styles.cardText}>{item.titulo}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ordens de Serviço</Text>
            {ordensFiltradas.length === 0 ? (
                <Text style={styles.infoText}>Você não tem acesso a nenhuma funcionalidade.</Text>
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
        marginTop: 20,
        textAlign: 'center',
    },
});

export default OrdensServicoScreen;
