// Importações principais
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Navegação principal
import { createStackNavigator } from '@react-navigation/stack'; // Stack Navigator

// Importação das telas do aplicativo
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
// import AvaliacaoaOSScreen from './src/screens/AvaliacaoOS';
import CheckListOS from './src/screens/CheckListOS';
import OrcamentoOS from './src/screens/OrcamentoOS';
import AvaliacaoOS from './src/screens/AvaliacaoOS';
import MapaScreen from './src/screens/mapa';
import AssinaturaAvaliacao from './src/screens/AssinaturaAvaliacao';
import FormAssinatura from './src/screens/FormAssinatura';
import GerenciaRoScreen from './src/screens/gerenciaRoScreen';
import ConsiderarOrc from './src/screens/ConsiderarOrc';
import AssinaturasorcScreen from './src/screens/AssinaturasOrcScreen';
import ChecklistForm from './src/screens/checklistForm';
import ReplicaOrcamento from './src/screens/ReplicaOrcamento';
import ConsultaAssinatura from './src/screens/ConsultaAssinatura';
import Credenciadoscreen from './src/screens/credenciadoscreen';
import OrcCred from './src/screens/OrcCred';
import ItemForm from './src/screens/ItemForm';
import checklistCredencido from './src/screens/checklistCredencido';
import RealizarChecklist from './src/screens/RealizarChecklist';
import ConsultaChecklistScreen from './src/screens/ConsultaChecklistScreen';
import AdicionarFotoScreen from './src/screens/AdicionarFotoScreen';
import RelatoriosScreens from './src/screens/relatoriosScreens';
import RelatoriosOs from './src/screens/RelatoriosOs';
import RelatorioOsStatus from './src/screens/RelatorioOsStatus';
import RelatorioRO from './src/screens/RelatorioRO';
import RelatorioOrcamentos from './src/screens/RelatorioOrcamentos';
import RelatorioCheckOs from './src/screens/RelatorioCheckOs';
import RelatorioUsuarios from './src/screens/RelatorioUsuarios';
import Relatoriocred from './src/screens/RelatorioCredenciado';
import RelatorioVeiculos from './src/screens/RelatorioVeiculos';
// Criação do Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* Configuração do Stack Navigator */}
      <Stack.Navigator initialRouteName="Login">
        
        {/* Tela de Login */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />

        {/* Tela principal (Home) */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />

        {/* Check-List */}
        <Stack.Screen name="CheckList" component={CheckListScreen} options={{ title: 'Grupo Check List' }} />
        <Stack.Screen name="ChecklistItemsScreen" component={ChecklistItemsScreen} options={{ title: 'Item do Checklist' }} />
        <Stack.Screen name="checklistForm" component={ChecklistForm} options={{ title: 'Check List' }} />
        <Stack.Screen name="FormChecklistScreen" component={FormChecklistScreen} options={{ title: 'Check List' }} />
        <Stack.Screen name="checklistCredencido" component={checklistCredencido} options={{ title: 'Check List' }} />
        <Stack.Screen name="RealizarChecklist" component={RealizarChecklist} options={{ title: 'Check List' }} />
        <Stack.Screen name="ConsultaChecklistScreen" component={ConsultaChecklistScreen} options={{ title: 'Consulta Check List' }} />

        {/* Preventivas */}
        <Stack.Screen name="Preventivas" component={PreventivasScreen} options={{ title: 'Preventiva' }} />

        {/* Ordens de Serviço */}
        <Stack.Screen name="OrdensServico" component={OrdensServicoScreen} options={{ title: 'Ordem de Serviço' }} />
        <Stack.Screen name="AberturaOSScreen" component={OrdemServicoForm} options={{ title: 'Abertura de Ordem de Serviço' }} />
        <Stack.Screen name="SolicitacaoOSScreen" component={SolicitacaoOSScreen} options={{ title: 'Solicitação de Ordem de Serviço' }} />
        <Stack.Screen name="DistribuicaoOS" component={DistribuicaoOS} options={{ title: 'Distribuição de OS' }} />
        <Stack.Screen name="DistribuicaoForm" component={DistribuicaoForm} options={{ title: 'Distribuição de OS' }} />
        {/* <Stack.Screen name="avaliacaoaOSScreen" component={AvaliacaoaOSScreen} options={{ title: 'Avaliação de OS' }} /> */}
        <Stack.Screen name="CheckListOS" component={CheckListOS} options={{ title: 'Check List' }} />
        <Stack.Screen name="OrcamentoOS" component={OrcamentoOS} options={{ title: 'Orçamentos' }} />
        <Stack.Screen name="AvaliacaoOS" component={AvaliacaoOS} options={{ title: 'Avaliação' }} />

        {/* Rastreamento */}
        <Stack.Screen name="Rastreamento" component={RastreamentoScreen} options={{ title: 'Rastreamento' }} />
        <Stack.Screen name="MapaScreen" component={MapaScreen} options={{ title: 'Mapa de Rastreamento' }} />

        {/* Gerenciamento */}
        <Stack.Screen name="GerenciaRoScreen" component={GerenciaRoScreen} options={{ title: 'Registro de Ocorrência' }} />
        <Stack.Screen name="ConsiderarOrc" component={ConsiderarOrc} options={{ title: 'Avaliar Orçamento' }} />
        <Stack.Screen name="ReplicaOrcamento" component={ReplicaOrcamento} options={{ title: 'Replicar Orçamento' }} />
        <Stack.Screen name="ConsultaAssinatura" component={ConsultaAssinatura} options={{ title: 'Consultar Assinatura' }} />
        <Stack.Screen name="credenciadoscreen" component={Credenciadoscreen} options={{ title: 'Credenciados' }} />
        <Stack.Screen name="OrcCred" component={OrcCred} options={{ title: 'Orçamento Credenciado' }} />
        <Stack.Screen name="ItemForm" component={ItemForm} options={{ title: 'Item do Orçamento' }} />
        <Stack.Screen name="AssinaturasorcScreen" component={AssinaturasorcScreen} options={{ title: 'Assinaturas de Orçamento' }} />

        {/* Assinaturas */}
        <Stack.Screen name="FormAssinatura" component={FormAssinatura} options={{ title: 'Formulário de Assinatura' }} />
        <Stack.Screen name="Assinatura" component={AssinaturaAvaliacao} options={{ title: 'Assinatura' }} />

        {/* Fotos */}
        <Stack.Screen name="AdicionarFotoScreen" component={AdicionarFotoScreen} options={{ title: 'Adicionar Foto' }} />
        
        {/*Relatorios*/}
        <Stack.Screen name="relatoriosScreens" component={RelatoriosScreens} options={{ title: 'Relatórios' }} />
        <Stack.Screen name="RelatoriosOs" component={RelatoriosOs} options={{ title: 'Relatórios de OS' }} />
        <Stack.Screen name="RelatorioOsStatus" component={RelatorioOsStatus} options={{ title: 'Relatório de OS' }} />
        <Stack.Screen name="RelatorioRO" component={RelatorioRO} options={{ title: 'Relatório de RO' }} />
        <Stack.Screen name="RelatorioOrcamentos" component={RelatorioOrcamentos} options={{ title: 'Relatório de Orçamentos' }} />
        <Stack.Screen name="RelatorioCheckOs" component={RelatorioCheckOs} options={{ title: 'Relatório de Check List' }} />
        <Stack.Screen name="RelatorioUsuarios" component={RelatorioUsuarios} options={{ title: 'Relatório de Usuários' }} />
        <Stack.Screen name="Relatoriocred" component={Relatoriocred} options={{ title: 'Relatório de Credenciados' }} />
        <Stack.Screen name="RelatorioVeiculos" component={RelatorioVeiculos} options={{ title: 'Relatório de Veículos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
