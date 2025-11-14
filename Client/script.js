/**@type {HTMLInputElement} */
const must = (sel) => {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
};

const jsonFetch = async (url, opts) => {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${url} -> ${res.status} ${res.statusText}`);
  return res.json();
};

// async function loadData() {
//   //using AJAX
//   try {
//     //Fetch contact data from server
//     fetch("/api/admin/contact")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(`Data loaded in script ${data}`);
//         const tbody = document.querySelector("#contacts tbody");
//         tbody.innerHTML = "";
//         data.forEach((c) => {
//           const tr = document.createElement("tr");
//           tr.innerHTML = `<td>${c.name}</td><td>${c.job}</td><td>${c.message}</td><td>${c.created_at}</td>`;
//           tbody.appendChild(tr);
//         });
//       });
//   } catch (e) {
//     console.error(e);
//     const tbody = document.querySelector("#contacts tbody");
//     if (tbody)
//       tbody.innerHTML = `<tr><td colspan="4">Failed to load contacts.</td></tr>`;
//   }
// }

async function mainPage() {
  // Theme toggle
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") root.classList.add("light");
  toggle.addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem(
      "theme",
      root.classList.contains("light") ? "light" : "dark"
    );
  });

  // Fetch profile data from server
  const res = await fetch("/api/profile_json");
  const p = await res.json();

  // Populate header
  document.getElementById("name").textContent = p.name;
  document.getElementById("title").textContent = `${p.title} — ${p.location}`;
  document.getElementById("summary").textContent = p.summary;

  // Links
  const linksUl = document.getElementById("links");
  p.links.forEach((l) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = l.label;
    li.appendChild(a);
    linksUl.appendChild(li);
  });

  // Skills
  const skillsUl = document.getElementById("skills");
  p.skills.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    skillsUl.appendChild(li);
  });

  // Experience
  const expDiv = document.getElementById("experience");
  p.experience.forEach((exp) => {
    const wrap = document.createElement("div");
    wrap.className = "item";
    wrap.innerHTML = `
      <div class="role">${exp.role} — ${exp.company}</div>
      <div class="meta">${exp.period}</div>
      <ul>${exp.points.map((x) => `<li>${x}</li>`).join("")}</ul>
    `;
    expDiv.appendChild(wrap);
  });

  // Education
  const eduUl = document.getElementById("education");
  p.education.forEach((ed) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${ed.school}</strong> — ${ed.program} <span class="meta">(${ed.period})</span>`;
    eduUl.appendChild(li);
  });

  // Contact form submit
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    const resp = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await resp.json();
    status.textContent =
      json.msg ||
      "An error was encounter (missing fields or incorrect email), data not saved!";
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.toLowerCase();
  console.log(`${path}`);
  if (path === "/" || path.endsWith("/index") || path.endsWith("/index.html")) {
    mainPage();
  } else if (path.endsWith("/contacts.html")) {
    loadData();
  }
});
