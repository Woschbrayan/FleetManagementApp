import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { cardId, cardTitle } = route.params;

  const handleAction = () => {
    alert(`Ação realizada para o card: ${cardTitle}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes: {cardTitle}</Text>
      <Text style={styles.description}>
        Esta é a tela de detalhes para o card com ID {cardId}. Aqui você pode visualizar mais informações e realizar ações.
      </Text>
      <Button title="Realizar Ação" onPress={handleAction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default DetailsScreen;
