const API = "http://localhost:5062/api/auth/login";
document.getElementById("btn").addEventListener("click", async () => {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({ message: "Đăng nhập thất bại" }));
    document.getElementById("msg").innerText =
      j.message || "Đăng nhập thất bại";
    return;
  }
  const data = await res.json();
  localStorage.setItem("token", data.token);
  const payload = JSON.parse(atob(data.token.split(".")[1]));
  const role =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload["role"] ||
    payload["roles"];
  localStorage.setItem("role", role);
  if (role === "Admin") location.href = "product.html";
  else location.href = "order.html";
});
