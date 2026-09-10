# Sabor do Pará

Cardápio digital para delivery de comida paraense, com uma experiência simples, responsiva e orientada a pedidos pelo WhatsApp.

## Demonstração

- Site: https://sabor-do-para-delivery.onrender.com
- Repositório: https://github.com/EnzoYuri1/sabor-do-para-delivery

## Sobre o projeto

O Sabor do Pará apresenta pratos típicos da culinária paraense em uma interface otimizada para celular, tablet e desktop. O visitante pode filtrar categorias, adicionar produtos ao carrinho, informar observações e enviar o pedido pelo WhatsApp.

## Funcionalidades

- Cardápio organizado por categorias
- Filtros para pratos, açaí, bebidas e combos
- Carrinho com controle de quantidades
- Resumo de subtotal e total
- Campo de observações do pedido
- Redirecionamento para o WhatsApp
- API com validação de produtos e quantidades
- Configuração do WhatsApp protegida no backend
- Layout responsivo
- Deploy gratuito com Render

## Tecnologias

- HTML5
- CSS3
- JavaScript moderno com módulos ES
- Node.js
- API HTTP nativa do Node.js
- Render

## Estrutura

```text
.
├── css/
│   └── style.css
├── data/
│   └── menu.js
├── js/
│   ├── api.js
│   ├── app.js
│   ├── cart.js
│   └── menu.js
├── .env.example
├── index.html
├── package.json
├── render.yaml
└── server.js
```

## Executar localmente

Pré-requisito: Node.js 18 ou superior.

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente no terminal:

PowerShell:

```powershell
$env:WHATSAPP_NUMBER="SEU_NUMERO_COM_DDI_E_DDD"
$env:ORDER_REFERENCE="Doca / Boulevard, Belem - PA"
```

3. Inicie o servidor:

```bash
npm start
```

Acesse `http://localhost:3000`.

Para desenvolvimento com reinício automático:

```bash
npm run dev
```

Para validar a sintaxe dos arquivos:

```bash
npm run check
```

## API

### `GET /health`

Verifica se o serviço está ativo.

### `POST /api/whatsapp/order`

Recebe os IDs e quantidades dos produtos, valida os dados no servidor, calcula o total e retorna uma URL de redirecionamento para o WhatsApp.

Exemplo de requisição:

```json
{
  "items": [
    {
      "id": "tacaca-tradicional",
      "quantity": 1
    }
  ],
  "note": "Sem pimenta"
}
```

## Deploy

O arquivo `render.yaml` contém a configuração do Web Service no Render.

No painel do Render, configure a variável secreta:

```text
WHATSAPP_NUMBER=seu_numero_com_codigo_do_pais_e_ddd
```

As variáveis `ORDER_REFERENCE` e `ALLOWED_ORIGIN` também podem ser ajustadas no ambiente do serviço. O arquivo `.env` nunca deve ser enviado ao Git.

## Segurança

O número do WhatsApp não é armazenado no frontend publicado. Ele é lido pelo backend através da variável de ambiente `WHATSAPP_NUMBER`. Nunca inclua senhas, tokens ou chaves privadas neste repositório.

## Status

Projeto publicado e funcional como demonstração de portfólio. Melhorias futuras podem incluir persistência de pedidos, cálculo de entrega, painel administrativo e integração com pagamentos.
