import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import { useRoute } from '@react-navigation/native';

const ConsiderarOrc = () => {
    const route = useRoute(); // Hook para acessar os parâmetros da navegação

    // Recebendo os valores enviados pela tela anterior
    const { orcCodigo, osCodigo, cadCodigo, nivelAcesso } = route.params;

    const [value, setValue] = useState(1);

    const radio_props = [
        { label: 'Aprovado', value: 1 },
        { label: 'Não Aprovado', value: 2 }
    ];

    const handleSubmit = () => {
        // Enviando os parâmetros junto com o status para a API
        fetch('https://syntron.com.br/sistemas/apis/avaliacaOrc.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: value,
                orcCodigo,
                osCodigo,
                cadCodigo,
                nivelAcesso
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                Alert.alert('Sucesso', data.message, [{ text: 'OK' }]);
            } else {
                Alert.alert('Erro', data.message, [{ text: 'OK' }]);
            }
        })
        .catch((error) => {
            Alert.alert('Erro', 'Falha ao se comunicar com o servidor.', [{ text: 'OK' }]);
            console.error('Error:', error);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Considerar Orçamento</Text>
            <RadioForm
                radio_props={radio_props}
                initial={0}
                onPress={(value) => setValue(value)}
                formHorizontal={true}
                labelHorizontal={false}
                buttonColor={'#2196f3'}
                selectedButtonColor={'#2196f3'}
                labelStyle={styles.radioLabel}
            />
            <Button title="Confirmar" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    title: {
        fontSize: 24,
        marginBottom: 20
    },
    radioLabel: {
        marginRight: 20
    }
});

export default ConsiderarOrc;
