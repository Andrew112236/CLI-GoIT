import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = path.join(__dirname, "db", "contacts.json"); // Locatie date de tip json

console.log(contactsPath);

// TODO: documentare fiecare funcție
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Eroare la citirea fisierului:", error);
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const idToString = String(contactId);
    const contactById = contacts.find((contact) => contact.id === idToString);
    if (contactById) {
      return contactById;
    } else {
      throw new Error(`Contactul cu ID-ul ${contactId} nu a fost găsit.`);
    }
  } catch (error) {
    console.error("Eroare:", error.message);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const idToString = String(contactId);
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === idToString
    );

    if (contactIndex === -1) {
      throw new Error(
        `Contactul cu ID-ul ${contactId} nu a fost găsit in sistem.`
      );
    }

    contacts.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(`Contactul cu ID-ul ${contactId} a fost eliminat cu succes.`);
  } catch (error) {
    console.error("Eroare:", error.message);
  }
}

async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    console.error("Trebuie să completezi cu un contact");
    return;
  }
  try {
    const data = await fs.readFile(contactsPath, "utf-8");

    const contacts = JSON.parse(data);
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);

    console.table(contacts);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("Contactul a fost adăugat!");
  } catch (err) {
    console.error("Eroare:", err);
  }
}

export default { listContacts, getContactById, removeContact, addContact };
