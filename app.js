import express from "express";
import path from "path";
import r from "rethinkdb";
import jwt from "jsonwebtoken";
import fs from "fs";
import bcrypt from "bcryptjs";
import helmet from "helmet";
var saltRounds = 10;
var openConn = null;
import https from "https";
import http from "http";
import compression from 'compression';
import minify from 'express-minify';
import bodyParser from 'body-parser';
const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//schemas
import loginSchema from "./public/js/schemas/loginSchema.mjs";
import orderSchema from "./public/js/schemas/orderSchema.mjs";

const tokenSecret =
  "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

if (process.env.NODE_ENV == "prod") {
  const options = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/www.jovaughnpowell.com/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/www.jovaughnpowell.com/fullchain.pem"
    ),
  };

  https.createServer(options, app).listen(443);
} else {
  var httpServer = http.Server(app);
  httpServer.listen(3000);
}

import io from "socket.io";

app.use(helmet());
app.use(compression());
app.use(minify());

app.use(express.static(path.resolve(__dirname, './react-app/build')));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

r.connect(
  {
    host: process.env.RETHINKDB_HOST,
    port: process.env.RETHINKDB_PORT,
    db: process.env.RETHINKDB_DEFAULT_DB,
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
  // r.table("Orders")
  //   .changes()
  //   .run(openConn, function (err, feed) {
  //     if (err) {
  //       throw err;
  //     }

  //     feed.on("error", function (error) {
  //       io.sockets.emit("socketError", error);
  //     });
  //     feed.on("data", function (newData) {
  //       io.sockets.emit("broadcast", newData);
  //     });
  //   });
}

app.get("/api/Orders", (req, res, next) => {
  const sort = req.query.sort || "AToZ";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const search = req.query.search || "";

  var rethinkDBSearch = null;
  switch (sort) {
    case "AToZ":
      rethinkDBSearch = r.row("Customer Name").downcase();
      break;
    case "ZToA":
      rethinkDBSearch = r.desc(r.row("Customer Name").downcase());
      break;
    case "AscendingPrice":
      rethinkDBSearch = r.row("Unit Price");
      break;
    case "DescendingPrice":
      rethinkDBSearch = r.desc((r.row("Unit Price")));
      break;
  }


  r.table("Orders")
    .orderBy(rethinkDBSearch)
    .filter(!search || r.row("Customer Name").downcase().match(search.toLowerCase()))
    .slice((pageSize * page) - pageSize, pageSize).run(openConn, (err, cursor) => {
      if (err) return next(err);

      cursor.toArray((err, result) => {
        if (err) return next(err);
        res.json(result);
      });
    });
});

app.get("/api/GetProfit", (req, res, next) => {
  r.table("Orders")
    .group("Product Category")
    .getField("Profit")
    .sum()
    .run(openConn, (err, cursor) => {
      if (err) return next(err);

      cursor.toArray((err, result) => {
        if (err) return next(err);

        if (result[0]?.group == "") {
          result[0].group = "(No Group)";
        }
        res.json(result);
      });
    });
});

app.get("/api/GetSales", (req, res, next) => {
  r.db("StoreDB")
    .table("Orders")
    .group("Product Category")
    .getField("Sales")
    .sum()
    .run(openConn, (err, cursor) => {
      if (err) return next(err);

      cursor.toArray((err, result) => {
        if (err) return next(err);

        if (result[0]?.group == "") {
          result[0].group = "(No Group)";
        }
        res.json(result);
      });
    });
});

app.get("/api/CountPerProductCategory", (req, res, next) => {
  r.db("StoreDB")
    .table("Orders")
    .group("Product Category")
    .getField("id")
    .count()
    .run(openConn, (err, cursor) => {
      if (err) return next(err);

      cursor.toArray((err, result) => {
        if (err) return next(err);

        if (result[0]?.group == "") {
          result[0].group = "(No Group)";
        }
        res.json(result);
      });
    });
});

app.get("/api/OrdersPerDay", (req, res, next) => {
  r.table("Orders")
    .group("Order Date")
    .getField("id")
    .count()
    .run(openConn, (err, cursor) => {
      if (err) return next(err);

      cursor.toArray((err, result) => {
        if (err) return next(err);
        res.json(result);
      });
    });
});

app.get("/api/EditOrder", (req, res, next) => {
  r.table("Orders")
    .get(req.query.id)
    .run(openConn, (err, result) => {
      if (err) return next(err);
      res.json(result);
    });
});

app.get("/Authenticate", (req, res, next) => {
  var token = req.query.token;
  jwt.verify(token, tokenSecret, (err, verifiedJwt) => {
    if (err) {
      res.json({ authenticated: false });
    } else {
      res.json({ authenticated: true });
    }
  });
});

app.post("/Register", (req, res, next) => {
  var user = req.body;

  var result = loginSchema.validate(req.body);

  if (result.error)
    return res.status(422).send(result.error.details[0].message);

  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(err);

    Register({ username: user.username, password: hash });
    res.json({});
  });
});

app.post("/Login", (req, res, next) => {
  var user = req.body;

  var result = loginSchema.validate(req.body);

  if (result.error)
    return res.status(422).send(result.error.details[0].message);

  r.table("TaskUsers")
    .filter({ username: user.username })
    .getField("password")
    .limit(1)
    .run(openConn, (err, cursor) => {
      if (err) return next(err);

      cursor.toArray((err, result) => {
        var hash = result[0];

        if (!hash) {
          return res.json(null);
        }

        bcrypt.compare(user.password, hash, function (err, success) {
          if (err) return next(err);

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

app.get("/CheckUsername", (req, res, next) => {
  var username = req.query.username;

  r.table("TaskUsers")
    .filter({ username })
    .count()
    .run(openConn, (err, count) => {
      if (err) return next(err);
      res.json({ usernameFree: count == 0 });
    });
});

app.post("/api/UpdateOrder", (req, res, next) => {
  var result = orderSchema.validate(req.body);

  if (result.error)
    return res.status(422).send(result.error.details[0].message);

  r.table("Orders")
    .get(req.body.id)
    .update(req.body, { returnChanges: true })
    .run(openConn, (err, result) => {
      if (err) return next(err);

      res.json(result.changes.map(x => x.new_val));
    });
});

app.post("/api/NewOrder", (req, res, next) => {
  var result = orderSchema.validate(req.body);

  if (result.error) return res.status(422).send({ message: result.error.details[0].message });

  delete req.body.id;

  r.table("Orders")
    .insert(req.body, { returnChanges: true })
    .run(openConn, (err, result) => {
      if (err) return next(err);
      res.json(result.changes.map(x => x.new_val));
    });
});

app.delete("/api/DeleteOrder", (req, res, next) => {
  r.table("Orders")
    .get(req.query.id)
    .delete()
    .run(openConn, (err, result) => {
      if (err) return next(err);
      res.json({});
    });
});

//middleware error logging
app.use((err, req, res, next) => {
  r.table("Log").insert(err).run(openConn);
  next(err);
});

//middleware end point
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "Error On Server. Try Again" }).end();
});

const PORT = process.env.SOCKET_POLLING_PORT || 5000;

if (process.env.NODE_ENV != "prod") {
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

function Register(user) {
  r.table("TaskUsers")
    .insert(user)
    .run(openConn, (err, result) => {
      if (err) throw err;
    });
}
