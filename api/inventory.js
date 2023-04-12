const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const async = require("async");
const fs = require("fs");
const pick = require("lodash.pick");
const dayjs = require("dayjs");
const omit = require("lodash.omit");
const XLSX = require("xlsx");
const createStream = require("./utils/stream");
const {
  counterDB,
  categoryDB,
  inventoryDB,
  stockDB,
  comptoirDB,
  holdDB,
} = require("./db");

app.use(bodyParser.json());

module.exports = app;

stockDB.ensureIndex({ fieldName: "_id", unique: true });

comptoirDB.ensureIndex({ fieldName: "_id", unique: true });

inventoryDB.ensureIndex({ fieldName: "_id", unique: true });

app.get("/", function (req, res) {
  res.send("Inventory API");
});

app.get("/product/:productId", function (req, res) {
  if (!req.params.productId) {
    res.status(500).send("ID field is required.");
  } else {
    inventoryDB.findOne(
      {
        _id: parseInt(req.params.productId),
      },
      function (err, product) {
        res.send(product);
      }
    );
  }
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

const findOne = (id) => {
  return new Promise((resolve, reject) => {
    inventoryDB.findOne({ _id: parseInt(id) }, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

const categories = () => {
  return new Promise((resolve, reject) => {
    categoryDB.find({}, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

const countHolds = (product) => {
  return new Promise((resolve, reject) => {
    holdDB.count({ products: { $in: [product] } }, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

const countInventory = (query) => {
  return new Promise((resolve, reject) => {
    inventoryDB.count({ ...query }, function (err, docs) {
      if (err) reject(err);
      resolve(docs);
    });
  });
};

app.get("/products", async function (req, res) {
  const { searchQuery, current, pageSize } = req.query;
  const allCategories = await categories();
  const formatedCategories = {};
  for (const key of allCategories) {
    formatedCategories[key._id] = { id: key._id, name: key.name };
  }
  inventoryDB
    .find({
      name: { $regex: new RegExp(searchQuery.toLowerCase(), "i") },
    })
    .sort({ createdAt: -1 })
    .skip(!searchQuery ? (current - 1) * pageSize : 0)
    .limit(pageSize)
    .exec(async (err, docs) => {
      const data = docs.map((el) => {
        const doc = {
          ...el,
          category: formatedCategories[el.category],
          key: el._id,
        };
        return doc;
      });
      const count = await countInventory({
        name: { $regex: new RegExp(searchQuery.toLowerCase(), "i") },
      });
      return res.status(200).json({
        message: "Products retrieved successfully",
        data: { items: data, total: count },
      });
    });
});

app.get("/products/all", function (req, res) {
  inventoryDB.find({}).exec(async (err, docs) => {
    const newDocs = docs.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    const data = newDocs.map((el) => {
      const dd = {
        ...el,
        key: el._id,
      };
      return dd;
    });
    return res.status(200).json({
      message: "All products retrieved successfully",
      data,
    });
  });
});

app.post("/product", function (req, res) {
  const newProduct = req.body;
  const { name } = newProduct;
  inventoryDB.findOne({ name: name.toLowerCase() }, async function (err, doc) {
    if (doc) {
      return res.status(409).json({
        message: "Product already exist",
      });
    }
    const autoInc = await autoIncrement({ id: "inventory" });
    const Product = {
      ...pick(newProduct, ["price", "category", "name", "description"]),
      _id: autoInc,
    };
    inventoryDB.insert(Product, function (err, product) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Product created successfully",
          data: product,
        });
      }
    });
  });
});

app.put("/product/:id", function (req, res) {
  const { id } = req.params;
  const updateProduct = req.body;
  inventoryDB.update(
    { _id: parseInt(id) },
    { $set: { ...updateProduct } },
    {},
    function (err, product) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Product updated successfully",
          data: product,
        });
      }
    }
  );
});

app.delete("/product/:id/delete", async function (req, res) {
  const { id } = req.params;
  const product = await findOne(id);
  if (!product) {
    return res.status(404).json({
      message: "Product does not exist",
    });
  }
  const holds = await countHolds(product._id);
  if (holds > 0) {
    return res.status(409).json({
      message: "Product can't be deleted, it is assigned to holds",
    });
  }
  inventoryDB.remove({ _id: parseInt(id) }, {}, function (err, product) {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      return res.status(200).json({
        message: "Product deleted successfully",
        data: product,
      });
    }
  });
});

app.post("/product/sku", function (req, res) {
  var request = req.body;
  inventoryDB.findOne(
    {
      _id: parseInt(request.skuCode),
    },
    function (err, product) {
      res.send(product);
    }
  );
});

app.decrementInventory = function (products) {
  async.eachSeries(products, function (transactionProduct, callback) {
    inventoryDB.findOne(
      {
        _id: parseInt(transactionProduct.id),
      },
      function (err, product) {
        if (!product || !product.quantity) {
          callback();
        } else {
          let updatedQuantity =
            parseInt(product.quantity) - parseInt(transactionProduct.quantity);

          inventoryDB.update(
            {
              _id: parseInt(product._id),
            },
            {
              $set: {
                quantity: updatedQuantity,
              },
            },
            {},
            callback
          );
        }
      }
    );
  });
};

app.get("/stock/all", function (req, res) {
  const { date, searchQuery, current, pageSize } = req.query;
  stockDB.find({ date }, function (err, stockDocs) {
    inventoryDB
      .find({
        name: { $regex: new RegExp(searchQuery.toLowerCase(), "i") },
      })
      .sort({ name: 1 })
      .skip(!searchQuery ? (current - 1) * pageSize : 0)
      .limit(pageSize)
      .exec(async (err, docs) => {
        const data = docs.map((el) => {
          const stockProduct =
            stockDocs.find((s) => s.productId === el._id) || {};
          const obj = {
            productId: el._id,
            productName: el.name,
            productPrice: el.price,
            ...omit(stockProduct, ["productName"]),
          };
          return obj;
        });
        // const newDocs = data.sort((a, b) => {
        //   return b.productName - a.productName;
        // });
        const count = await countInventory({
          name: { $regex: new RegExp(searchQuery.toLowerCase(), "i") },
        });
        return res.status(200).json({
          message: "Stock retrieved successfully",
          data: { items: data, total: count },
        });
      });
  });
});

app.post("/stock/stock", async function (req, res) {
  const newStock = req.body;
  const autoInc = await autoIncrement({ id: "stock" });
  stockDB.insert({ ...newStock.data, _id: autoInc }, function (err, stock) {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      return res.status(200).json({
        message: "Stock record created successfully",
        data: stock,
      });
    }
  });
});

app.put("/stock/:id", function (req, res) {
  const updateStock = req.body;
  const { id } = req.params;
  stockDB.update(
    { _id: parseInt(id) },
    { $set: { ...updateStock } },
    {},
    function (err, stock) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Stock record updated successfully",
          data: stock,
        });
      }
    }
  );
});

app.get("/stock/export", function (req, res) {
  const { date } = req.query;
  stockDB.find({ date }, function (err, stockDocs) {
    inventoryDB.find({}, function (err, docs) {
      const data = docs.map((el) => {
        const stockProduct =
          stockDocs.find((s) => s.productId === el._id) || {};
        const obj = {
          id: stockProduct._id,
          productName: el.name,
          lastNight: stockProduct.lastNight,
          new: stockProduct.new,
          now: stockProduct.now,
          consumed: stockProduct.consumed,
          productId: el._id,
          productPrice: el.price,
          date: stockProduct.date,
        };
        return obj;
      });
      const refactoredData = data.map((el, index) => {
        return {
          ...omit(el, ["productId", "productPrice", "createdAt", "updatedAt"]),
        };
      });

      const newDocs = refactoredData.sort((a, b) => {
        return b.productName - a.productName;
      });
      const headings = [
        ["Id", "ProductName", "LastNight", "New", "Now", "Consumed", "Date"],
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newDocs, {
        origin: "A2",
        skipHeader: true,
      });
      XLSX.utils.sheet_add_aoa(ws, headings);
      XLSX.utils.book_append_sheet(wb, ws, "stock");

      const fileStream = createStream.createStream(
        XLSX.write(wb, { bookType: "xlsx", type: "buffer" })
      );

      res.set({
        "Content-Type": "application/xlsx",
        "Content-Disposition": `attachment; filename=stock-report-${
          new Date().toISOString().split("T")[0]
        }.xlsx`,
      });

      return fileStream.pipe(res);
    });
  });
});

app.get("/comptoir/all", function (req, res) {
  const { date, searchQuery, current, pageSize } = req.query;
  comptoirDB.find({ date }, function (err, comptoirDocs) {
    inventoryDB
      .find({
        name: { $regex: new RegExp(searchQuery.toLowerCase(), "i") },
      })
      .sort({ name: 1 })
      .skip(!searchQuery ? (current - 1) * pageSize : 0)
      .limit(pageSize)
      .exec(async (err, docs) => {
        const data = docs.map((el) => {
          const comptoirProduct =
            comptoirDocs.find((s) => s.productId === el._id) || {};
          const obj = {
            productId: el._id,
            productName: el.name,
            productPrice: el.price,
            ...omit(comptoirProduct, ["productName"]),
          };
          return obj;
        });
        const count = await countInventory({
          name: { $regex: new RegExp(searchQuery.toLowerCase(), "i") },
        });
        return res.status(200).json({
          message: "Comptior retrieved successfully",
          data: { items: data, total: count },
        });
      });
  });
});

app.post("/comptoir/comptoir", async function (req, res) {
  const newComptior = req.body;
  const autoInc = await autoIncrement({ id: "category" });
  comptoirDB.insert(
    { ...newComptior.data, _id: autoInc },
    function (err, comptoir) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Comptior record created successfully",
          data: comptoir,
        });
      }
    }
  );
});

app.put("/comptoir/:id", function (req, res) {
  const updateComptior = req.body;
  const { id } = req.params;

  comptoirDB.update(
    { _id: parseInt(id) },
    { $set: { ...updateComptior } },
    {},
    function (err, comptoir) {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "Comptior record updated successfully",
          data: comptoir,
        });
      }
    }
  );
});

app.get("/comptoir/total", function (req, res) {
  const { date } = req.query;
  comptoirDB.find({ date }, function (err, comptoirDocs) {
    const total = comptoirDocs.reduce(
      (accumulator, currentValue) => accumulator + +currentValue.amount,
      0
    );
    return res.status(200).json({
      message: "Comptoir total retrieved successfully",
      data: total,
    });
  });
});

app.get("/comptoir/export", function (req, res) {
  const { date } = req.query;
  comptoirDB.find({ date }, function (err, comptoirDocs) {
    inventoryDB.find({}, function (err, docs) {
      const data = docs.map((el) => {
        const comptoirProduct =
          comptoirDocs.find((c) => c.productId === el._id) || {};
        const obj = {
          id: comptoirProduct._id,
          productName: el.name,
          lastNight: comptoirProduct.lastNight,
          new: comptoirProduct.new,
          now: comptoirProduct.now,
          consumed: comptoirProduct.consumed,
          productId: el._id,
          productPrice: el.price,
          amount: comptoirProduct.amount,
          date: comptoirProduct.date,
        };
        return obj;
      });
      const refactoredData = data.map((el, index) => {
        return {
          ...omit(el, ["productId", "productPrice", "createdAt", "updatedAt"]),
        };
      });

      const newDocs = refactoredData.sort((a, b) => {
        return b.productName - a.productName;
      });
      const headings = [
        [
          "Id",
          "ProductName",
          "LastNight",
          "New",
          "Now",
          "Consumed",
          "Amount",
          "Date",
        ],
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(newDocs, {
        origin: "A2",
        skipHeader: true,
      });
      XLSX.utils.sheet_add_aoa(ws, headings);
      XLSX.utils.book_append_sheet(wb, ws, "comptoir");

      const fileStream = createStream.createStream(
        XLSX.write(wb, { bookType: "xlsx", type: "buffer" })
      );

      res.set({
        "Content-Type": "application/xlsx",
        "Content-Disposition": `attachment; filename=comptoir-report-${
          new Date().toISOString().split("T")[0]
        }.xlsx`,
      });

      return fileStream.pipe(res);
    });
  });
});
