const API_PRODUCTS = "http://localhost:5062/api/products";
const API_ORDERS = "http://localhost:5062/api/orders";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
if (!token || role !== "User") {
  alert("Không có quyền");
  location.href = "login.html";
}

let cart = [];

async function load() {
  const res = await fetch(API_PRODUCTS, {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await res.json();
  const div = document.getElementById("prods");
  div.innerHTML = "";
  data.forEach((p) => {
    div.innerHTML += `<div><b>${p.name}</b> - ${p.price} - Tồn: ${p.stock}<br>
      <input id="q_${p.id}" type="number" placeholder="Số lượng" style="width:80px"><button onclick="add(${p.id},'${p.name}',${p.price})">Thêm</button></div>`;
  });
}
load();

function add(id, name, price) {
  const q = Number(document.getElementById("q_" + id).value);
  if (!q || q <= 0) {
    alert("Số lượng > 0");
    return;
  }
  const e = cart.find((x) => x.productId === id);
  if (e) e.qty += q;
  else cart.push({ productId: id, name, price, qty: q });
  renderCart();
}

function renderCart() {
  const div = document.getElementById("cart");
  if (cart.length === 0) {
    div.innerHTML = "<i>Chưa có sản phẩm</i>";
    return;
  }
  let s = "<ul>";
  cart.forEach(
    (c, i) =>
      (s += `<li>${c.name} x ${c.qty} - ${
        c.price * c.qty
      } <button onclick="remove(${i})">X</button></li>`)
  );
  s += "</ul>";
  div.innerHTML = s;
}

function remove(i) {
  cart.splice(i, 1);
  renderCart();
}

async function submitOrder() {
  if (cart.length === 0) {
    alert("Chưa có sản phẩm");
    return;
  }
  const dto = {
    customerId: 1,
    items: cart.map((c) => ({ productId: c.productId, quantity: c.qty })),
  };
  const res = await fetch(API_ORDERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({ message: "Lỗi" }));
    document.getElementById("msg").innerText = j.message || "Tạo lỗi";
    return;
  }
  const j = await res.json();
  document.getElementById("ok").innerText =
    "Tạo đơn thành công, ID: " + (j.id || j.orderId || "");
  cart = [];
  renderCart();
}

function logout() {
  localStorage.clear();
  location.href = "login.html";
}
