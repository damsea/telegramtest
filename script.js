console.log("Telegram WebApp:", window.Telegram?.WebApp)
Telegram.WebApp.ready();

const products = [
  { name: "Лаваш", emoji: "🌯", price: 10000, count: 0, image: "" },
  { name: "Лаваш с сыром", emoji: "🌯", price: 11000, count: 0, image: "" },
  { name: "Донер", emoji: "🥙", price: 10000, count: 0, image: "" },
  { name: "Pepsi", emoji: "", price: 1800, count: 0, image: "img/pepsi.webp" },
  { name: "Айран", emoji: "🥛", price: 3500, count: 0, image: "" },
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
      <div class="icon">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : item.emoji}
      </div>
      <div class="name">${item.name} · ${item.price.toLocaleString("ru-RU")}₩</div>
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
  if (items.length === 0) return alert("Корзина пуста!");

  orderList.innerHTML = "";
  let total = 0;

  items.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="icon">${p.image ? `<img src="${p.image}" alt="${p.name}" />` : p.emoji}</div>
      <div class="details">
        <div class="name">${p.name} × ${p.count}</div>
        <div class="desc">${getDescription(p.name)}</div>
      </div>
      <div class="price">${(p.price * p.count).toLocaleString("ru-RU")}₩</div>
    `;
    total += p.price * p.count;
    orderList.appendChild(li);
  });

  payBtn.textContent = `Заказать ${total.toLocaleString("ru-RU")}₩`;
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
  const comment = document.getElementById("comment")?.value || "";

  const payload = {
    items,
    total,
    comment,
  };
  
  if (Telegram && Telegram.WebApp && typeof Telegram.WebApp.sendData === 'function') {
    try {
      alert("ok")
      Telegram.WebApp.sendData(JSON.stringify(payload));
    } catch (error) {
      alert("Ошибка отправки: " + error.message);
    }
  } else {
    alert('Telegram WebApp не доступен');
  }
};


Telegram.WebApp.onEvent('viewport_changed', () => {
  try {
    Telegram.WebApp.sendData(JSON.stringify({ event: "webapp_opened", timestamp: Date.now() }));
  } catch (error) {
    console.warn("Ошибка при отправке события открытия:", error);
  }
});

renderMenu();