const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const async = require("async");
const { counterDB, expenseDB } = require("./db");

app.use(bodyParser.json());

module.exports = app;

expenseDB.ensureIndex({ fieldName: "_id", unique: true });
app.get("/", function (req, res) {
  res.send("Expense API");
});

app.get("/all", function (req, res) {
  const { date, current, pageSize } = req.query;
  const qryDate = date ? { date } : {};
  expenseDB
    .find({
      ...qryDate,
    })
    .sort({ createdAt: -1 })
    .skip((current - 1) * pageSize)
    .limit(pageSize)
    .exec(async function (err, docs) {
      const count = await countExpense({ ...qryDate });
      return res.status(200).json({
        message: "Expenses retrieved successfully",
        data: { items: docs, total: count },
      });
    });
});

const autoIncrement = (value) => {
  return new Promise((resolve, reject) => {
    counterDB.findOne({ ...value }, function (err, docs) {
      if (err) reject(err);
      if (docs === null) {
        counterDB.insert({ ...value, seq: 1 }, (err, counter) => {
          resolve(counter.seq);
        });
      } else {
        counterDB.update(
          { ...value },
          { $inc: { seq: 1 } },
          {},
          function (err, update) {
            resolve(docs.seq + 1);
          }
        );
      }
    });
  });
};

const countExpense = (query) => {
  return new Promise((resolve, reject) => {
    expenseDB.count({ ...query }, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

app.post("/expense", async function (req, res) {
  const newExpense = req.body;
  const autoInc = await autoIncrement({ id: "expense" });
  expenseDB.insert(
    { ...newExpense.data, _id: autoInc },
    function (err, expense) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Expense created successfully",
          data: expense,
        });
      }
    }
  );
});

app.put("/expense/:id", function (req, res) {
  const { id } = req.params;
  const updateExpense = req.body;
  expenseDB.update(
    { _id: parseInt(id) },
    { $set: { ...updateExpense } },
    {},
    function (err, stock) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Expense updated successfully",
          data: stock,
        });
      }
    }
  );
});

app.delete("/expense/:id/delete", function (req, res) {
  const { id } = req.params;
  expenseDB.remove({ _id: parseInt(id) }, {}, function (err, stock) {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      return res.status(200).json({
        message: "Expense deleted successfully",
        data: stock,
      });
    }
  });
});

app.get("/expense/total", function (req, res) {
  const { date } = req.query;
  const qryDate = date ? { date } : {};
  expenseDB.find({ ...qryDate }, function (err, docs) {
    const total = docs.reduce(
      (accumulator, currentValue) => accumulator + +currentValue.amount,
      0
    );
    return res.status(200).json({
      message: "Expense total retrieved successfully",
      data: total,
    });
  });
});
