const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const async = require("async");
const { counterDB, categoryDB, inventoryDB } = require("./db");

app.use(bodyParser.json());

module.exports = app;

categoryDB.ensureIndex({ fieldName: "_id", unique: true });
app.get("/", function (req, res) {
  res.send("Category API");
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

const countCategories = () => {
  return new Promise((resolve, reject) => {
    categoryDB.count({}, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

const countAll = (query) => {
  return new Promise((resolve, reject) => {
    inventoryDB.count({ ...query }, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

const isCategoryInUse = (id) => {
  return new Promise((resolve, reject) => {
    categoryDB.findOne({ _id: parseInt(id) }, async function (err, docs) {
      if (err) reject(err);
      const allData = await countAll({ category: docs._id });
      resolve(allData);
    });
  });
};

app.get("/categories", function (req, res) {
  const { current, pageSize } = req.query;
  categoryDB
    .find({})
    .sort({ createdAt: -1 })
    .skip((current - 1) * pageSize)
    .limit(pageSize)
    .exec(async function (err, docs) {
      // const newDocs = docs.sort((a, b) => {
      //   return b.createdAt - a.createdAt;
      // });
      const count = await countCategories();
      return res.status(200).json({
        message: "Category retrieved successfully",
        data: { items: docs, total: count },
      });
    });
});

app.get("/categories/all", function (req, res) {
  categoryDB.find({}).exec(async function (err, docs) {
    const newDocs = docs.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return res.status(200).json({
      message: "All categories retrieved successfully",
      data: newDocs,
    });
  });
});

app.post("/category", function (req, res) {
  const newCategory = req.body;
  const { name } = newCategory.data;
  categoryDB.findOne({ name: name.toLowerCase() }, async function (err, doc) {
    if (doc) {
      return res.status(409).json({
        message: "Category already exist",
      });
    }
    const autoInc = await autoIncrement({ id: "category" });
    categoryDB.insert(
      { ...newCategory.data, _id: autoInc, name: name.toLowerCase() },
      function (err, category) {
        if (err) {
          return res.status(500).json({
            message: err,
          });
        } else {
          return res.status(200).json({
            message: "Category created successfully",
            data: category,
          });
        }
      }
    );
  });
});

app.put("/category/:id", function (req, res) {
  const { id } = req.params;
  const updateCategory = req.body;
  categoryDB.update(
    { _id: parseInt(id) },
    { $set: { ...updateCategory } },
    {},
    function (err, stock) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Category updated successfully",
          data: stock,
        });
      }
    }
  );
});

app.delete("/category/:id/delete", async function (req, res) {
  const { id } = req.params;
  const totalDependOnProducts = await isCategoryInUse(id);
  if (totalDependOnProducts > 0) {
    return res.status(409).json({
      message: "Category can't be deleted, it is assigned to products",
    });
  }
  categoryDB.remove({ _id: parseInt(id) }, {}, function (err, category) {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      return res.status(200).json({
        message: "Category deleted successfully",
        data: category,
      });
    }
  });
});
