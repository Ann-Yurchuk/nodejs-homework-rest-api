const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.resolve(__dirname, "..", "db", "contacts.json");

const getContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error.message);
  }
};

const getContact = async (contactId) => {
  try {
    const contacts = await getContacts();
    return contacts.filter(
      (contact) => String(contact.id) === String(contactId)
    );
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await getContacts();
    const newContactsList = contacts.filter(
      (contact) => String(contact.id) !== String(contactId)
    );

    await fs.writeFile(contactsPath, JSON.stringify(newContactsList, null, 4));
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const id = crypto.randomUUID();
    const contacts = await getContacts();
    const newContact = { id, ...body };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await getContacts();
    const index = contacts.findIndex(
      (contact) => String(contact.id) === String(contactId)
    );

    if (index === -1) {
      return null;
    }
    contacts[index] = { id: contactId, ...body };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
    return contacts[index];
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  getContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
};
