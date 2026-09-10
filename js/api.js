const API_BASE_URL = window.SABOR_API_URL ||
  (window.location.hostname === "localhost" && window.location.port === "4173"
    ? "http://localhost:3000"
    : window.location.origin);

export async function requestWhatsAppUrl(items, note) {
  const response = await fetch(`${API_BASE_URL}/api/whatsapp/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map(({ id, quantity }) => ({ id, quantity })),
      note,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Não foi possível criar o pedido.");
  return result.url;
}
