const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const btoa = require("btoa");
const pick = require("lodash.pick");
const { generateToken } = require("./utils/auth");
const { default: axios } = require("axios");
const omit = require("lodash.omit");
const { usersDB } = require("./db");
app.use(bodyParser.json());

module.exports = app;

usersDB.ensureIndex({ fieldName: "_id", unique: true });

app.get("/", function (req, res) {
  res.send("Users API");
});

app.get("/user/:userId", function (req, res) {
  if (!req.params.userId) {
    res.status(500).send("ID field is required.");
  } else {
    usersDB.findOne(
      {
        _id: parseInt(req.params.userId),
      },
      function (err, docs) {
        res.send(docs);
      }
    );
  }
});

app.get("/logout/:userId", function (req, res) {
  if (!req.params.userId) {
    res.status(500).send("ID field is required.");
  } else {
    usersDB.update(
      {
        _id: parseInt(req.params.userId),
      },
      {
        $set: {
          status: "Logged Out_" + new Date(),
        },
      },
      {}
    );

    res.sendStatus(200);
  }
});

app.post("/login", async function (req, res) {
  // const getUser = axios.get()
  const { username, password } = req.body;
  usersDB.findOne(
    {
      username: username,
      // password: btoa(password),
    },
    function (err, docs) {
      if (!docs) {
        axios
          .post(
            "https://invms-verification-backend.vercel.app/api/user/verify",
            {
              username: username,
              password,
            }
          )
          .then((user) => {
            if (typeof user.data === "object" && "result" in user.data) {
              usersDB.insert(
                {
                  ...pick(user.data.result, [
                    "fullname",
                    "username",
                    "uniqueId",
                  ]),
                  password: btoa(password),
                },
                function (err, docs) {
                  const token = generateToken(pick(docs, ["username"]), "1yr");
                  usersDB.update(
                    {
                      _id: docs._id,
                    },
                    {
                      $set: {
                        status: "Logged In_" + new Date(),
                        token,
                      },
                    },
                    {}
                  );
                  return res.status(200).json({
                    message: "Logged in successfully",
                    payload: { ...omit(docs, ["fullname", "password"]), token },
                  });
                }
              );
            } else {
              return res.status(400).json({
                message: user.data,
              });
            }
          })
          .catch((error) => {
            if (error.message.includes("EAI_AGAIN")) {
              return res.status(400).json({
                message: "Please check your network",
              });
            }
          });
      } else {
        if (btoa(password) !== docs.password) {
          return res.status(400).json({
            message: "incorrect password",
          });
        }
        axios
          .post(
            "https://invms-verification-backend.vercel.app/api/user/login",
            {
              uniqueId: docs.uniqueId,
            }
          )
          .then((user) => {
            if (typeof user.data === "object" && "result" in user.data) {
              const token = generateToken(pick(user.data, ["username"]), "1yr");
              usersDB.update(
                {
                  uniqueId: user.data.uniqueId,
                },
                {
                  $set: {
                    status: "Logged In_" + new Date(),
                    token,
                  },
                },
                {}
              );
              return res.status(200).json({
                message: "Logged in successfully",
                payload: { ...omit(docs, ["fullname", "password"]), token },
              });
            } else {
              return res.status(400).json({
                message: user.data,
              });
            }
          })
          .catch((error) => {
            if (error.message.includes("EAI_AGAIN")) {
              return res.status(400).json({
                message: "Please check your network",
              });
            }
          });
      }
    }
  );
});

app.post("/change-password", async function (req, res) {
  // const getUser = axios.get()
  const { username, password } = req.body;
  usersDB.findOne(
    {
      username: username,
    },
    function (err, docs) {
      if (!docs) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }
      axios
        .put(
          `https://invms-verification-backend.vercel.app/api/user/change-password/${username}`,
          {
            password,
          }
        )
        .then((user) => {
          if (typeof user.data === "object" && "result" in user.data) {
            if (user.data.result === 0) {
              return res.status(200).json({
                message: "You already changed the password",
                data: user.data.result,
              });
            } else {
              usersDB.update(
                {
                  uniqueId: docs.uniqueId,
                },
                {
                  $set: {
                    password: btoa(password),
                  },
                },
                {}
              );
              return res.status(200).json({
                message: user.data.message,
                data: user.data.result,
              });
            }
          } else {
            return res.status(400).json({
              message: user.data,
            });
          }
        })
        .catch((error) => {
          if (error.message.includes("EAI_AGAIN")) {
            return res.status(400).json({
              message: "Please check your network",
            });
          }
        });
    }
  );
});

app.get("/all", function (req, res) {
  usersDB.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.delete("/user/:userId", function (req, res) {
  usersDB.remove(
    {
      _id: parseInt(req.params.userId),
    },
    function (err, numRemoved) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

app.post("/register", function (req, res) {
  const { uniqueId, password } = req.body;
  usersDB.findOne(
    {
      uniqueId,
    },
    function (err, docs) {
      if (!docs) {
        let User = {
          _id: 1,
          password: btoa(password),
          ...pick(req.body, ["username", "fullname"]),
          uniqueId,
          status: "",
        };
        usersDB.insert(User, function (err, user) {});
      }
    }
  );
});
