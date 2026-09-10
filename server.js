import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { menuItems } from "./data/menu.js";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "";
const ORDER_REFERENCE = process.env.ORDER_REFERENCE || "Doca / Boulevard, Belém - PA";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function createWhatsAppUrl(order) {
  const lines = [
    "Olá! Gostaria de fazer o seguinte pedido:",
    "",
    ...order.items.map(
      (item) => `${item.quantity}x ${item.name} — ${formatBRL(item.subtotal)}`,
    ),
    "",
  ];

  if (order.note) {
    lines.push("📝 Observação do pedido:", order.note, "");
  }

  lines.push(
    `Subtotal: ${formatBRL(order.total)}`,
    `💰 Total: ${formatBRL(order.total)}`,
    "",
    `📍 Referência da operação: ${ORDER_REFERENCE}`,
  );

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER.replace(/\D/g, "")}&text=${encodeURIComponent(lines.join("\n"))}`;
}

function validateOrder(payload) {
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    return { error: "O pedido precisa conter pelo menos um produto." };
  }

  if (payload.items.length > 50) {
    return { error: "O pedido excede o limite de produtos." };
  }

  const items = [];
  for (const requestedItem of payload.items) {
    const product = menuItems.find((item) => item.id === requestedItem.id);
    const quantity = Number(requestedItem.quantity);

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { error: "O pedido contém um produto ou quantidade inválida." };
    }

    items.push({
      name: product.name,
      quantity,
      subtotal: product.price * quantity,
    });
  }

  const note = typeof payload.note === "string" ? payload.note.trim().slice(0, 2000) : "";
  return {
    order: {
      items,
      note,
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
    },
  };
}

function serveStaticFile(request, response) {
  const requestedPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const filePath = path.resolve(projectRoot, relativePath);

  if (!filePath.startsWith(projectRoot + path.sep)) {
    sendJson(response, 403, { error: "Acesso negado." });
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendJson(response, 404, { error: "Arquivo não encontrado." });
      return;
    }

    const contentTypes = {
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
    };
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method === "GET") {
    serveStaticFile(request, response);
    return;
  }

  if (request.method !== "POST" || request.url !== "/api/whatsapp/order") {
    sendJson(response, 404, { error: "Rota não encontrada." });
    return;
  }

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER.replace(/\D/g, ""))) {
    sendJson(response, 503, { error: "WhatsApp não configurado no servidor." });
    return;
  }

  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
    if (body.length > 100_000) request.destroy();
  });
  request.on("end", () => {
    try {
      const validation = validateOrder(JSON.parse(body));
      if (validation.error) {
        sendJson(response, 400, { error: validation.error });
        return;
      }
      sendJson(response, 200, { url: createWhatsAppUrl(validation.order) });
    } catch {
      sendJson(response, 400, { error: "JSON inválido." });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Sabor do Pará API disponível na porta ${PORT}`);
});
