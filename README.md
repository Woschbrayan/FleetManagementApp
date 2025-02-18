# Fleet Management App

##  Sobre o Projeto

O **Fleet Management App** é uma solução completa para **monitoramento, gerenciamento e controle de frotas**.  
Empresas podem acompanhar veículos em tempo real, otimizar a manutenção, controlar abastecimentos e gerar relatórios detalhados para melhorar a eficiência operacional.

---

##  Tecnologias Utilizadas

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Native" width="80"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" width="80"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://logowik.com/content/uploads/images/expo4769.logowik.com.webp" alt="Expo" width="80"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://www.php.net/images/logos/new-php-logo.svg" alt="PHP" width="100"/>
</p>


###  **Principais Tecnologias**
- **React Native** - Desenvolvimento Mobile
- **JavaScript (ES6+)** - Linguagem de Programação
- **Expo** - Plataforma para desenvolvimento e deploy
- **PHP** - Desenvolvimento do Backend e APIs
- **MySQL** - Banco de Dados para armazenamento das informações da frota
- **Firebase Firestore** - Alternativa para dados em tempo real e autenticação

---

##  Funcionalidades
✅ **Cadastro e Gerenciamento de Veículos** - Registre e acompanhe informações detalhadas dos veículos.  
✅ **Monitoramento de Manutenção** - Alertas automáticos para revisões periódicas.  
✅ **Controle de Abastecimento** - Registre o consumo de combustível e previna desperdícios.  
✅ **Gestão de Motoristas** - Cadastro de condutores e rastreamento de atividades.  
✅ **Relatórios e Análises** - Geração de relatórios detalhados sobre consumo e desempenho.  
✅ **Integração com GPS** - (Opcional) Rastreio de veículos em tempo real.

---

## 📡 **APIs e Banco de Dados**
O backend foi desenvolvido em **PHP**, utilizando **MySQL** para armazenar as informações da frota.  

### 📡 **Endpoints da API**
🔹 **Autenticação**: `POST /api/auth/login`  
🔹 **Cadastro de Veículos**: `POST /api/veiculos`  
🔹 **Listagem de Veículos**: `GET /api/veiculos`  
🔹 **Registro de Manutenção**: `POST /api/manutencao`  
🔹 **Consulta de Manutenção**: `GET /api/manutencao/:id`  
🔹 **Controle de Abastecimento**: `POST /api/abastecimento`  
🔹 **Relatórios**: `GET /api/relatorios`

---

##  Como Rodar o Projeto

###  **Pré-requisitos**
Antes de começar, você precisará ter instalado em sua máquina:
- **Node.js** e **npm** ou **yarn**
- **Expo CLI**
- **PHP** (se for rodar a API localmente)
- **MySQL** (Banco de dados)
- **Git**

###  **Passo a Passo**
```sh
# Clone o repositório
git clone https://github.com/Woschbrayan/FleetManagementApp

# Acesse a pasta do projeto
cd FleetManagementApp

# Instale as dependências do frontend
npm install
# ou
yarn install

# Inicie o Expo
expo start
