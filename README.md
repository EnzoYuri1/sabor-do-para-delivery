# Sabor do Pará

Digital menu for Pará-style food delivery, offering a simple, responsive, order-focused experience via WhatsApp.

## Demo

- Site: https://sabor-do-para-delivery.onrender.com
- Repository: https://github.com/EnzoYuri1/sabor-do-para-delivery

## About the project

Sabor do Pará showcases traditional dishes from Pará cuisine in an interface optimized for mobile, tablet, and desktop. Visitors can filter categories, add products to the cart, add notes, and send their order via WhatsApp.

## Features

- Menu organized by category
- Filters for dishes, açaí, drinks, and combos
- Cart with quantity controls
- Subtotal and total summary
- Order notes field
- WhatsApp redirect
- API with product and quantity validation
- WhatsApp configuration protected on the backend
- Responsive layout
- Free deployment with Render

## Technologies

- HTML5
- CSS3
- Modern JavaScript with ES modules
- Node.js
- Node.js native HTTP API
- Render

## Structure

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

## Running locally

Requirement: Node.js 18 or higher.

1. Install dependencies:

```bash
npm install
```

2. Set the environment variables in your terminal:

PowerShell:

```powershell
$env:WHATSAPP_NUMBER="YOUR_NUMBER_WITH_COUNTRY_AND_AREA_CODE"
$env:ORDER_REFERENCE="Doca / Boulevard, Belem - PA"
```

3. Start the server:

```bash
npm start
```

Access `http://localhost:3000`.

For development with automatic restart:

```bash
npm run dev
```

To validate the syntax of the files:

```bash
npm run check
```

## API

### `GET /health`

Checks whether the service is active.

### `POST /api/whatsapp/order`

Receives product IDs and quantities, validates the data server-side, calculates the total, and returns a redirect URL to WhatsApp.

Example request:

```json
{
  "items": [
    {
      "id": "tacaca-tradicional",
      "quantity": 1
    }
  ],
  "note": "No pepper"
}
```

## Deployment

The `render.yaml` file contains the Web Service configuration for Render.

In the Render dashboard, configure the secret variable:

```text
WHATSAPP_NUMBER=your_number_with_country_and_area_code
```

The `ORDER_REFERENCE` and `ALLOWED_ORIGIN` variables can also be adjusted in the service environment. The `.env` file should never be pushed to Git.

## Security

The WhatsApp number is not stored on the published frontend. It's read by the backend via the `WHATSAPP_NUMBER` environment variable. Never include passwords, tokens, or private keys in this repository.

## Status

Project published and functional as a portfolio demo. Future improvements may include order persistence, delivery cost calculation, an admin panel, and payment integration.
