import { menuItems } from "../data/menu.js";

export function renderMenu(container, onAdd) {
  container.innerHTML = menuItems
    .map(
      (item) => `
    <article
      class="product-card"
      data-category="${item.category}"
      data-product-id="${item.id}">
      <img src="${item.image}" alt="${item.alt}" loading="lazy">
      <div class="product-info">
        <h3>${item.displayName || item.name}</h3>
        <p>${item.description}</p>
        <div class="product-footer">
          <span class="price">${formatBRL(item.price)}</span>
          <button class="btn-add" type="button" data-product-id="${item.id}">
            + Adicionar
          </button>
        </div>
      </div>
    </article>`,
    )
    .join("");
  container
    .querySelectorAll(".btn-add")
    .forEach((button) =>
      button.addEventListener("click", () => onAdd(button.dataset.productId)),
    );
}

export function filterMenu(pills, container, category) {
  pills.forEach((pill) =>
    pill.classList.toggle("active", pill.dataset.category === category),
  );
  container.querySelectorAll(".product-card").forEach((card) => {
    card.hidden = category !== "todos" && card.dataset.category !== category;
  });
}

export function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
