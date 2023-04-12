const Datastore = require("nedb");

const db = {
  counterDB: new Datastore({
    filename: "POS/server/databases/counter.db",
    autoload: true,
    timestampData: true,
  }),
  categoryDB: new Datastore({
    filename: "POS/server/databases/categories.db",
    autoload: true,
    timestampData: true,
  }),
  inventoryDB: new Datastore({
    filename: "POS/server/databases/inventory.db",
    autoload: true,
    timestampData: true,
  }),
  stockDB: new Datastore({
    filename: "POS/server/databases/stock.db",
    autoload: true,
    timestampData: true,
  }),
  comptoirDB: new Datastore({
    filename: "POS/server/databases/comptoir.db",
    autoload: true,
    timestampData: true,
  }),
  holdDB: new Datastore({
    filename: "POS/server/databases/holds.db",
    autoload: true,
    timestampData: true,
  }),
  expenseDB: new Datastore({
    filename: "POS/server/databases/expenses.db",
    autoload: true,
    timestampData: true,
  }),
  usersDB: new Datastore({
    filename: "POS/server/databases/users.db",
    autoload: true,
  }),
};

module.exports = db;
