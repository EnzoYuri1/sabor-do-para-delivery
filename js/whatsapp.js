import { formatBRL } from "./menu.js";

export function createWhatsAppUrl(items, note, config) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const lines = [
    "Olá! Gostaria de fazer o seguinte pedido:",
    "",
    ...items.map(
      (item) =>
        `${item.quantity}x ${item.name} — ${formatBRL(item.price * item.quantity)}`,
    ),
    "",
  ];
  if (note.trim()) lines.push("📝 Observação do pedido:", note.trim(), "");
  lines.push(
    `Subtotal: ${formatBRL(total)}`,
    `💰 Total: ${formatBRL(total)}`,
    "",
    `📍 Referência da operação: ${ORDER_REFERENCE}`,
  );
  return `https://api.whatsapp.com/send?phone=${config.WHATSAPP_NUMBER.replace(/\D/g, "")}&text=${encodeURIComponent(lines.join("\n"))}`;
}
