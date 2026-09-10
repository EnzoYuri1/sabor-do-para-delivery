import { renderMenu, filterMenu } from "./menu.js";
import { createCart } from "./cart.js";
import { createWhatsAppUrl } from "./whatsapp.js";

const config = await import("./config.local.js").catch(() => ({
  WHATSAPP_NUMBER: "SEU_NUMERO_COM_DDI_E_DDD",
  ORDER_REFERENCE: "SUA_REFERENCIA_DE_OPERACAO",
}));

const $ = (selector) => document.querySelector(selector);
const elements = {
  products: $("#productList"),
  pills: document.querySelectorAll(".pill"),
  bar: $("#cartBar"),
  count: $("#cartCount"),
  total: $("#cartTotal"),
  modal: $("#cartModal"),
  list: $("#modalItemList"),
  subtotal: $("#modalSubtotal"),
  modalTotal: $("#modalTotal"),
  note: $("#orderNoteInput"),
  counter: $("#orderNoteCounter"),
};
const cart = createCart(elements);
const confirmation = $("#confirmationModal");

renderMenu(elements.products, (id) => cart.add(id));
elements.pills.forEach((pill) =>
  pill.addEventListener("click", () =>
    filterMenu(elements.pills, elements.products, pill.dataset.category),
  ),
);
const openModal = () => {
  if (cart.entries().length) {
    cart.render();
    elements.modal.classList.add("active");
    document.body.classList.add("modal-open");
  }
};
const closeModal = () => {
  elements.modal.classList.remove("active");
  document.body.classList.remove("modal-open");
};
$("#btnOpenModal").addEventListener("click", openModal);
$("#btnCloseModal").addEventListener("click", closeModal);
elements.modal.addEventListener("click", (event) => {
  if (event.target === elements.modal) closeModal();
});
$("#btnWhatsapp").addEventListener("click", () => {
  if (cart.entries().length) confirmation.classList.add("active");
});
$("#btnNoConfirm").addEventListener("click", () =>
  confirmation.classList.remove("active"),
);
confirmation.addEventListener("click", (event) => {
  if (event.target === confirmation) confirmation.classList.remove("active");
});
$("#btnYesConfirm").addEventListener("click", () => {
  if (!cart.entries().length) return;
  window.location.href = createWhatsAppUrl(
    cart.entries(),
    cart.getNote(),
    config,
  );
});
cart.render();
