const express = require("express");
const path = require("path");
const r = require("rethinkdb");
var openConn = null;
const app = express();

const logger = (err, eq, res, next) => {
  console.log(err);
  next(err);
};

app.use(logger);

var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connection = r.connect(
  {
    host: "69.55.55.31",
    port: 28015,
    db: "StoreDB",
    password: "Wishbone15",
    user: "admin",
  },
  (err, conn) => {
    if (err) throw err;
    console.log("db connected");
    openConn = conn;
    BeginRealTimeStream();
  }
);

http.listen(3000);

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

app.get("/api/GetProfit", (req, res) => {
  r.table("Orders")
    .group("Product Category")
    .getField("Profit")
    .sum()
    .run(openConn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, result) => {
        if (result[0].group == "") {
          result[0].group = "(No Group)";
        }
        res.json(result);
      });
    });
});

app.get("/api/GetSales", (req, res) => {
  r.db("StoreDB")
    .table("Orders")
    .group("Product Category")
    .getField("Sales")
    .sum()
    .run(openConn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, result) => {
        if (result[0].group == "") {
          result[0].group = "(No Group)";
        }
        res.json(result);
      });
    });
});

app.get("/api/CountPerProductCategory", (req, res) => {
  r.db("StoreDB")
    .table("Orders")
    .group("Product Category")
    .getField("id")
    .count()
    .run(openConn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, result) => {
        if (result[0].group == "") {
          result[0].group = "(No Group)";
        }
        res.json(result);
      });
    });
});

app.get("/api/OrdersPerDay", (req, res) => {
  r.table("Orders")
    .group("Order Date")
    .getField("id")
    .count()
    .run(openConn, (err, cursor) => {
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
