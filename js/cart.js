import { menuItems } from "../data/menu.js";
import { formatBRL } from "./menu.js";

export function createCart(elements) {
  const cart = new Map();
  let note = "";
  const findItem = (id) => menuItems.find((item) => item.id === id);
  const total = () =>
    [...cart.values()].reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  const count = () =>
    [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  const render = () => {
    const items = [...cart.values()];
    const itemCount = count();
    const value = total();
    document.body.classList.toggle("has-cart", itemCount > 0);
    elements.count.textContent = `${itemCount} ${itemCount === 1 ? "item" : "itens"}`;
    elements.total.textContent = formatBRL(value);
    elements.bar.classList.toggle("hidden", itemCount === 0);
    elements.list.innerHTML = items
      .map(
        (item) => `
          <div class="modal-item">
            <div class="modal-item-top">
              <div class="modal-item-details">
                <span class="modal-item-title">${item.name}</span>
                <span class="modal-item-price">
                  ${formatBRL(item.price * item.quantity)}
                </span>
              </div>
              <div class="qty-control">
                <button class="btn-qty" type="button" data-action="decrease" data-id="${item.id}">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="btn-qty" type="button" data-action="increase" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        `,
      )
      .join("");
    elements.subtotal.textContent = formatBRL(value);
    elements.modalTotal.textContent = formatBRL(value);
    elements.note.value = note;
    updateNoteCounter();
    syncCards();
    elements.list
      .querySelectorAll("[data-action]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          change(
            button.dataset.id,
            button.dataset.action === "increase" ? 1 : -1,
          ),
        ),
      );
  };
  const syncCards = () =>
    elements.products.querySelectorAll(".product-card").forEach((card) => {
      const id = card.dataset.productId;
      const footer = card.querySelector(".product-footer");
      const add = footer.querySelector(".btn-add");
      const current = card.querySelector(".qty-control");
      if (current) current.remove();
      const item = cart.get(id);
      if (!item) {
        add.hidden = false;
        return;
      }
      add.hidden = true;
      const control = document.createElement("div");
      control.className = "qty-control";
      control.innerHTML = `
        <button class="btn-qty" type="button" data-action="decrease">−</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="btn-qty" type="button" data-action="increase">+</button>
      `;
      control
        .querySelector('[data-action="decrease"]')
        .addEventListener("click", () => change(id, -1));
      control
        .querySelector('[data-action="increase"]')
        .addEventListener("click", () => change(id, 1));
      footer.append(control);
    });
  const change = (id, amount) => {
    const item = cart.get(id) || { ...findItem(id), quantity: 0 };
    item.quantity += amount;
    if (item.quantity <= 0) cart.delete(id);
    else cart.set(id, item);
    render();
  };
  const updateNoteCounter = () => {
    const lines = elements.note.value.split("\n");
    if (lines.length > 100)
      elements.note.value = lines.slice(0, 100).join("\n");
    elements.counter.textContent = `${elements.note.value.split("\n").length}/100 linhas`;
  };
  elements.note.addEventListener("input", () => {
    updateNoteCounter();
    note = elements.note.value;
  });
  return {
    add: (id) => change(id, 1),
    render,
    entries: () => [...cart.values()],
    total: () => total(),
    getNote: () => note,
  };
}
