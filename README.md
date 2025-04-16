# FortressGuard API

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-green)

API de segurança digital para proteção de dados e senhas, fornecendo ferramentas para geração e validação de senhas seguras e criptografia de texto.

## 🔒 Recursos Principais

- **Geração de Senhas**: Criação de senhas seguras com parâmetros personalizáveis
- **Validação de Senhas**: Análise da força e segurança de senhas
- **Criptografia de Texto**: Criptografia e descriptografia de textos
- **Estatísticas de Uso**: Monitoramento das operações realizadas pela API

## 🚀 Demonstração

- **Aplicação Web**: [https://fortressguard.vercel.app/](https://fortressguard.vercel.app/)
- **Documentação API**: [https://fortressguard.onrender.com/docs/](https://fortressguard.onrender.com/docs/)

## 🛠️ Tecnologias

- Node.js
- Express.js
- Crypto (Node.js nativo)
- YAML/JSON para documentação OpenAPI
- Jest para testes

## 📋 Pré-requisitos

- Node.js (v18.0.0 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Jonhvmp/fortressguard.git
   cd fortressguard
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp env.example .env
   ```
   (Edite o arquivo .env com suas configurações)

4. Inicie o servidor:
   ```bash
   npm run dev  # Modo desenvolvimento
   npm start    # Modo produção
   ```

## 📚 Principais Endpoints

- `GET /api/v1/generate-password` - Gera uma senha segura
- `GET /api/v1/validate-password` - Valida a força de uma senha
- `GET /api/v1/encrypt-text` - Criptografa um texto
- `GET /api/v1/decrypt-text` - Descriptografa um texto
- `GET /api/v1/statistics` - Retorna estatísticas de uso

## 🧪 Testes

Execute os testes com o comando:
```bash
npm test
```

Para verificar a cobertura de testes:
```bash
npm run test:coverage
```

## 📖 Documentação

Gere a documentação OpenAPI com:
```bash
npm run docs:generate
```

Acesse a documentação em: `http://localhost:3000/docs`

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## 👤 Autor

- [Jonh Alex](https://www.linkedin.com/in/jonhvmp/)
