import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CheckListScreen from './src/screens/CheckListScreen'; 
import PreventivasScreen from './src/screens/PreventivasScreen';
import OrdensServicoScreen from './src/screens/OrdensServicoScreen';
import ChecklistItemsScreen from './src/screens/ChecklistItems'; 
import RastreamentoScreen from './src/screens/RastreamentoScreen';
import FormChecklistScreen from './src/screens/FormChecklistScreen';
import OrdemServicoForm from './src/screens/AberturaOSScreen'; 
import SolicitacaoOSScreen from './src/screens/SolicitacaoOSScreen'; 
import DistribuicaoOS from './src/screens/DistribuicaoOS'; 
import DistribuicaoForm from './src/screens/DistribuicaoForm'; 
import avaliacaoaOSScreen from './src/screens/AvaliacaoOS'; 
import CheckListOS from './src/screens/CheckListOS'; 
import OrcamentoOS from './src/screens/OrcamentoOS';
import AvaliacaoOS from './src/screens/AvaliacaoOS';
import MapaScreen from './src/screens/mapa';
import assinaturaAvaliacao from './src/screens/AssinaturaAvaliacao';
import FormAssinatura from './src/screens/FormAssinatura';
import GerenciaRoScreen from './src/screens/gerenciaRoScreen';
import ConsiderarOrc  from './src/screens/ConsiderarOrc';
import AssinaturasorcScreen from './src/screens/AssinaturasOrcScreen';
import checklistForm from './src/screens/checklistForm';
import ReplicaOrcamento from  './src/screens/ReplicaOrcamento';
import ConsultaAssinatura from './src/screens/ConsultaAssinatura';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="CheckList" component={CheckListScreen} options={{ title: 'Check-List' }} />
        <Stack.Screen name="Preventivas" component={PreventivasScreen} options={{ title: 'Preventiva' }} />
        <Stack.Screen name="OrdensServico" component={OrdensServicoScreen} options={{ title: 'Ordem de serviço' }} />
        <Stack.Screen name="Assinatura" component={assinaturaAvaliacao} options={{ title: 'Assinatura' }} />
        <Stack.Screen name="ConsiderarOrc" component={ConsiderarOrc} options={{ title: 'Avaliar' }} />
        <Stack.Screen name="AssinaturasorcScreen" component={AssinaturasorcScreen} options={{ title: 'Assinaturas' }} />
        <Stack.Screen name="Rastreamento" component={RastreamentoScreen} options={{ title: 'Rastreamento' }} />
        <Stack.Screen name="AberturaOSScreen" component={OrdemServicoForm} options={{ title: 'Ordem de Serviço' }} />
        <Stack.Screen name="SolicitacaoOSScreen" component={SolicitacaoOSScreen} options={{ title: 'Solicitação' }} />
        <Stack.Screen name="DistribuicaoOS" component={DistribuicaoOS} options={{ title: 'Distribuição' }} />
        <Stack.Screen name="DistribuicaoForm" component={DistribuicaoForm} options={{ title: 'Distribuição' }} />
        <Stack.Screen name="avaliacaoaOSScreen" component={avaliacaoaOSScreen} options={{ title: 'Avaliação' }} />
        <Stack.Screen name="CheckListOS" component={CheckListOS} options={{ title: 'Check-List' }} />
        <Stack.Screen name="OrcamentoOS" component={OrcamentoOS} options={{ title: 'Orçamentos' }} />
        <Stack.Screen name="AvaliacaoOS" component={AvaliacaoOS} options={{ title: 'Avaliação' }} />
        <Stack.Screen name="MapaScreen" component={MapaScreen}  options={{ title: 'Rastreamento' }} />
        <Stack.Screen name="GerenciaRoScreen" component={GerenciaRoScreen} options={{ title: 'Registro de Ocorrencia' }} />
        <Stack.Screen name="FormChecklistScreen" component={FormChecklistScreen} options={{ title: 'Check-List' }} />
        <Stack.Screen name="FormAssinatura" component={FormAssinatura} options={{ title: 'Assinatura' }} />
        <Stack.Screen name="ChecklistItemsScreen" component={ChecklistItemsScreen} options={{ title: 'Itens do Checklist' }} />
        <Stack.Screen name="checklistForm" component={checklistForm} options={{ title: 'Checklist' }} />
        <Stack.Screen name="ReplicaOrcamento" component={ReplicaOrcamento} options={{ title: 'Replicar' }} />
        <Stack.Screen name="ConsultaAssinatura" component={ConsultaAssinatura} options={{ title: 'Assinatura' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
