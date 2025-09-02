const API_URL = "https://jsonplaceholder.typicode.com/users"; // mock API
const contactList = document.getElementById("contactList");
const contactForm = document.getElementById("contactForm");
const searchInput = document.getElementById("search");

// ✅ Fetch all contacts
async function fetchContacts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch contacts");
    const data = await res.json();
    renderContacts(data);
  } catch (error) {
    console.error(error);
  }
}

// ✅ Render contacts in UI
function renderContacts(contacts) {
  contactList.innerHTML = "";
  contacts.forEach(contact => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${contact.name} - ${contact.phone}</span>
      <div>
        <button onclick="editContact(${contact.id})">✏️</button>
        <button onclick="deleteContact(${contact.id})">❌</button>
      </div>
    `;
    contactList.appendChild(li);
  });
}

// ✅ Add contact
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone })
    });
    const newContact = await res.json();
    console.log("Added:", newContact);
    fetchContacts();
  } catch (error) {
    console.error("Error adding contact:", error);
  }
});

// ✅ Delete contact
async function deleteContact(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    console.log("Deleted contact with id:", id);
    fetchContacts();
  } catch (error) {
    console.error(error);
  }
}

// ✅ Edit contact (example: update phone number)
async function editContact(id) {
  const newPhone = prompt("Enter new phone number:");
  if (!newPhone) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: newPhone })
    });
    const updated = await res.json();
    console.log("Updated:", updated);
    fetchContacts();
  } catch (error) {
    console.error(error);
  }
}

// ✅ Search contacts
searchInput.addEventListener("input", async (e) => {
  const searchValue = e.target.value.toLowerCase();
  const res = await fetch(API_URL);
  const data = await res.json();
  const filtered = data.filter(contact =>
    contact.name.toLowerCase().includes(searchValue) ||
    contact.phone.includes(searchValue)
  );
  renderContacts(filtered);
});

// Initial load
fetchContacts();