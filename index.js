import { Command } from "commander";
import contacts from "./contacts.js";

const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  try {
    switch (action) {
      case "list":
        const allContacts = await contacts.listContacts();
        console.table(allContacts);
        break;

      case "get":
        const contact = await contacts.getContactById(id);
        if (!contact) {
          throw new Error(`Contact with id=${id} not found`);
        }
        console.log(contact);
        break;

      case "add":
        const newContact = await contacts.addContact(name, email, phone);
        console.log(newContact);
        break;

      case "remove":
        const removedContact = await contacts.removeContact(id);
        console.log(removedContact);
        break;

      default:
        console.warn("\x1B[31m Unknown action type!");
    }
  } catch (error) {
    console.error(error.message);
  }
}

invokeAction(argv);
