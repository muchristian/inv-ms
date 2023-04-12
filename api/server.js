const { default: axios } = require("axios");
const path = require("path");
let express = require("express"),
  http = require("http"),
  app = require("express")(),
  server = http.createServer(app),
  bodyParser = require("body-parser");
const PORT = process.env.PORT || 8001;
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});
app.use("/api/inventory", require("./inventory"));
app.use("/api/categories", require("./categories"));
app.use("/api/users", require("./users"));
app.use("/api/hold", require("./holds"));
app.use("/api/expense", require("./expense"));

server.listen(PORT, async () => {
  console.log(`Listening on PORT ${server.address().port}`);
  // await axios.get(
  //   `http://localhost:${server.address().port}/api/customers/customer/check/`
  // );
});
