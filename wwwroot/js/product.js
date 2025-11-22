const API = "http://localhost:5062/api/products";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "Admin") {
  alert("Không có quyền");
  location.href = "login.html";
}

async function load() {
  const res = await fetch(API, {
    headers: { Authorization: "Bearer " + token },
  });

  const data = await res.json();
  const t = document.getElementById("list");

  t.innerHTML = "";
  data.forEach((p) => {
    t.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.stock}</td>
        <td>${p.description}</td>
        <td>
          <button onclick="edit(${p.id})">Sửa</button>
          <button onclick="del(${p.id})">Xóa</button>
        </td>
      </tr>
    `;
  });
}
load();

function clearForm() {
  document.getElementById("pId").value = "";
  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pStock").value = "";
  document.getElementById("pDesc").value = "";
}

async function save() {
  const id = document.getElementById("pId").value;

  const dto = {
    id: id ? Number(id) : 0,
    name: document.getElementById("pName").value,
    price: Number(document.getElementById("pPrice").value),
    stock: Number(document.getElementById("pStock").value),
    description: document.getElementById("pDesc").value,
  };

  if (isNaN(dto.price) || isNaN(dto.stock)) {
    alert("Giá và Tồn kho phải là số hợp lệ!");
    return;
  }

  const opt = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(dto),
  };

  if (id) {
    opt.method = "PUT";
    await fetch(`${API}/${id}`, opt);
  } else {
    opt.method = "POST";
    await fetch(API, opt);
  }

  clearForm();
  load();
}

async function edit(id) {
  const res = await fetch(`${API}/${id}`, {
    headers: { Authorization: "Bearer " + token },
  });

  const p = await res.json();

  document.getElementById("pId").value = p.id;
  document.getElementById("pName").value = p.name;
  document.getElementById("pPrice").value = p.price;
  document.getElementById("pStock").value = p.stock;
  document.getElementById("pDesc").value = p.description || "";
}

async function del(id) {
  if (!confirm("Xóa sản phẩm này?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  load();
}

function logout() {
  localStorage.clear();
  location.href = "login.html";
}
