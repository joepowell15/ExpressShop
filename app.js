const express = require("express");
const path = require("path");
const r = require("rethinkdb");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var openConn = null;
const app = express();

const tokenSecret =
  "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

const logger = (err, eq, res, next) => {
  console.log(err);
  next(err);
};

app.use(logger);

if (process.env.NODE_ENV=="prod") {
  const options={
    key:fs.readFileSync('/etc/letsencrypt/live/www.jovaughnpowell.com/privkey.pem'),
    cert:fs.readFileSync('/etc/letsencrypt/live/www.jovaughnpowell.com/fullchain.pem')
  };
  
  var http = require("https").CreateServer(options,app);
}
else{
  var http = require("http").Server(app);  
  http.listen(3000);
}

var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connection = r.connect(
  {
    host: "69.55.55.31",
    port: 28015,
    db: "StoreDB",
    user: "admin",
    password: "Wishbone15",
  },
  (err, conn) => {
    if (err) throw err;
    console.log("db connected");
    openConn = conn;
    BeginRealTimeStream();
  }
);



// setInterval(() => {
//   var allOrders = [];
//   r.table("Orders").run(openConn, (err, cursor) => {
//     if (err) throw err;
//     cursor.toArray((err, result) => {
//       allOrders = result;
//       var randomIndex = Math.floor(Math.random() * (allOrders.length - 1) + 1);
//       var newUnitStockAmount=allOrders[randomIndex].UnitsInStock+1;
//       var id=allOrders[randomIndex].id;

//       r.table("Orders").get(id).update({UnitsInStock:newUnitStockAmount}).run(openConn,(err,result)=>{
//         if (err) throw err;
//       });
//     });
//   });
// },5000);

function BeginRealTimeStream() {
  r.table("Orders")
    .changes()
    .run(openConn, function (err, feed) {
      if (err) {
        throw err;
      }

      feed.on("error", function (error) {
        throw error;
      });
      feed.on("data", function (newData) {
        io.sockets.emit("broadcast", newData);
      });
    });
}

app.get("/api/Orders", (req, res) => {
  r.table("Orders").run(openConn, (err, cursor) => {
    if (err) throw err;
    cursor.toArray((err, result) => {
      res.json(result);
    });
  });
});

app.get("/api/EditOrder", (req, res) => {
  r.table("Orders")
    .get(req.query.id)
    .run(openConn, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

app.get("/Authenticate", (req, res) => {
  var token = req.query.token;
  jwt.verify(token, tokenSecret, (err, verifiedJwt) => {
    if (err) {
      res.json({ authenticated: false });
    } else {
      res.json({ authenticated: true });
    }
  });
});

app.post("/Register", (req, res) => {
  var user = req.body;
  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    Register({ username: user.username, password: hash });
    res.json({});
  });
});

app.post("/Login", (req, res) => {
  var user = req.body;
  r.table("TaskUsers")
    .filter({ username: user.username })
    .getField("password")
    .limit(1)
    .run(openConn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, result) => {
        var hash = result[0];

        if (!hash) {
          return res.json(null);
        }

        bcrypt.compare(user.password, hash, function (err, success) {
          if (err) throw err;

          if (success) {
            var token = jwt.sign(user.username, tokenSecret);
            res.json({ token, username: user.username });
          } else {
            res.json(null);
          }
        });
      });
    });
});

app.get("/CheckUsername", (req, res) => {
  var username = req.query.username;

  r.table("TaskUsers")
    .filter({ username })
    .count()
    .run(openConn, (err, count) => {
      res.json({ usernameFree: count == 0 });
    });
});

app.post("/api/UpdateOrder", (req, res) => {
  r.table("Orders")
    .get(req.body.id)
    .update(req.body)
    .run(openConn, (err, result) => {
      if (err) throw err;
      res.json(null);
    });
});

app.post("/api/NewOrder", (req, res) => {
  r.table("Orders")
    .insert(req.body)
    .run(openConn, (err, result) => {
      if (err) throw err;
      res.json(null);
    });
});

app.post("/api/DeleteOrder", (req, res) => {
  r.table("Orders")
    .get(req.query.id)
    .delete()
    .run(openConn, (err, result) => {
      if (err) throw err;
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

function Register(user) {
  r.table("TaskUsers")
    .insert(user)
    .run(openConn, (err, result) => {
      if (err) throw err;
    });
}
