const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const async = require("async");
const XLSX = require("xlsx");
const omit = require("lodash.omit");
const createStream = require("./utils/stream");
const { counterDB, holdDB, inventoryDB } = require("./db");

app.use(bodyParser.json());

module.exports = app;

holdDB.ensureIndex({ fieldName: "_id", unique: true });
app.get("/", function (req, res) {
  res.send("Hold API");
});

const products = () => {
  return new Promise((resolve, reject) => {
    inventoryDB.find({}, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

app.get("/all", async function (req, res) {
  const { date, searchQuery, current, pageSize } = req.query;
  const allProducts = await products();
  const formatedProducts = {};
  for (const key of allProducts) {
    formatedProducts[key._id] = { id: key._id, name: key.name };
  }
  const qryDate = date ? { date } : {};
  const qryCustomer = searchQuery
    ? {
        customerName: { $regex: new RegExp(searchQuery.toLowerCase(), "i") },
      }
    : {};
  holdDB
    .find({
      $and: [qryDate, qryCustomer],
    })
    .sort({ createdAt: -1 })
    .skip(!searchQuery ? (current - 1) * pageSize : 0)
    .limit(pageSize)
    .exec(async function (err, docs) {
      const data = docs.map((el) => {
        const doc = {
          ...el,
          products: el.products.map((p) => formatedProducts[p]),
        };
        return doc;
      });
      const count = await countHold({ $and: [qryDate, qryCustomer] });
      return res.status(200).json({
        message: "Credits retrieved successfully",
        data: { items: data, total: count },
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

const countHold = (query) => {
  return new Promise((resolve, reject) => {
    holdDB.count({ ...query }, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

app.post("/hold", async function (req, res) {
  const newHold = req.body;
  const autoInc = await autoIncrement({ id: "hold" });
  holdDB.insert({ ...newHold.data, _id: autoInc }, function (err, hold) {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      return res.status(200).json({
        message: "Credit created successfully",
        data: hold,
      });
    }
  });
});

app.put("/hold/:id", function (req, res) {
  const { id } = req.params;
  const updateHold = req.body;
  holdDB.update(
    { _id: parseInt(id) },
    { $set: { ...updateHold } },
    {},
    function (err, stock) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Credit updated successfully",
          data: stock,
        });
      }
    }
  );
});

app.delete("/hold/:id/delete", function (req, res) {
  const { id } = req.params;
  holdDB.remove({ _id: parseInt(id) }, {}, function (err, stock) {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      return res.status(200).json({
        message: "Credit deleted successfully",
        data: stock,
      });
    }
  });
});

app.get("/hold/total", function (req, res) {
  const { date } = req.query;
  const qryDate = date ? { date } : {};
  holdDB.find({ ...qryDate }, function (err, docs) {
    const total = docs.reduce(
      (accumulator, currentValue) => accumulator + +currentValue.amount,
      0
    );
    return res.status(200).json({
      message: "Credits total retrieved successfully",
      data: total,
    });
  });
});

app.get("/hold/export", async function (req, res) {
  const { date } = req.query;
  const formatedProducts = {};
  const allProducts = await products();
  for (const key of allProducts) {
    formatedProducts[key._id] = { id: key._id, name: key.name };
  }
  const qryDate = date ? { date } : {};
  holdDB.find({ ...qryDate }, function (err, docs) {
    const data = docs.map((el) => {
      const doc = {
        ...el,
        products: el.products.map((p) => formatedProducts[p]),
      };
      return doc;
    });
    const refactoredData = data.map((el, index) => {
      return {
        id: el._id,
        customerName: el.customerName,
        products: el.products.map((p) => p.name).join(", "),
        amount: el.amount,
        description: el.description,
        date: el.date,
      };
    });
    const headings = [
      ["Id", "customerName", "Products", "Amount", "Description", "Date"],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(refactoredData, {
      origin: "A2",
      skipHeader: true,
    });
    XLSX.utils.sheet_add_aoa(ws, headings);
    XLSX.utils.book_append_sheet(wb, ws, "credit");

    const fileStream = createStream.createStream(
      XLSX.write(wb, { bookType: "xlsx", type: "buffer" })
    );

    res.set({
      "Content-Type": "application/xlsx",
      "Content-Disposition": `attachment; filename=credit-report-${
        new Date().toISOString().split("T")[0]
      }.xlsx`,
    });

    return fileStream.pipe(res);
  });
});
