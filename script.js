const products = [
  { name: "Burger", emoji: "🍔", price: 4.99, count: 0 },
  { name: "Fries", emoji: "🍟", price: 1.49, count: 0 },
  { name: "Hotdog", emoji: "🌭", price: 3.49, count: 0 },
  { name: "Taco", emoji: "🌮", price: 3.99, count: 0 },
  { name: "Pizza", emoji: "🍕", price: 7.99, count: 0 },
];

const menu = document.getElementById("menu");
const orderButton = document.getElementById("view-order");
const orderModal = document.getElementById("order-summary");
const orderList = document.getElementById("order-list");
const payBtn = document.getElementById("pay-btn");

function renderMenu() {
  menu.innerHTML = "";
  products.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "item";

    let content = `
      <div class="icon">${item.emoji}</div>
      <div class="name">${item.name} · $${item.price.toFixed(2)}</div>
      <div class="counter">
        <button class="minus">–</button>
        <span>${item.count}</span>
        <button class="plus">+</button>
      </div>
    `;

    el.innerHTML = content;

    const minusBtn = el.querySelector(".minus");
    const plusBtn = el.querySelector(".plus");

    minusBtn.onclick = () => {
      if (products[index].count > 0) {
        products[index].count--;
        renderMenu();
      }
    };

    plusBtn.onclick = () => {
      products[index].count++;
      renderMenu();
    };

    menu.appendChild(el);
  });
}

function getDescription(name) {
  const map = {
    Pizza: "That's amore",
    Donut: "Hole included",
    Coke: "The liquid kind",
    Icecream: "Cone of shame",
    Cookie: "Milk’s favorite",
    Flan: "Flan-tastic"
  };
  return map[name] || "";
}

// Открыть окно заказа
orderButton.onclick = () => {
  const items = products.filter(p => p.count > 0);
  if (items.length === 0) return alert("Your cart is empty!");

  orderList.innerHTML = "";
  let total = 0;

  items.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="icon">${p.emoji}</div>
      <div class="details">
        <div class="name">${p.name} × ${p.count}</div>
        <div class="desc">${getDescription(p.name)}</div>
      </div>
      <div class="price">$${(p.price * p.count).toFixed(2)}</div>
    `;
    total += p.price * p.count;
    orderList.appendChild(li);
  });

  payBtn.textContent = `PAY $${total.toFixed(2)}`;
  orderModal.classList.remove("hidden");
};

// Закрыть окно заказа
document.getElementById("edit-order").onclick = () => {
  orderModal.classList.add("hidden");
};

// Отправить заказ в Telegram
payBtn.onclick = () => {
  const items = products
    .filter(p => p.count > 0)
    .map(p => ({
      name: p.name,
      count: p.count,
      price: p.price,
    }));

  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const comment = document.querySelector("textarea").value;

  const payload = {
    items,
    total,
    comment,
  };

  Telegram.WebApp.sendData(JSON.stringify(payload));
};

renderMenu();
