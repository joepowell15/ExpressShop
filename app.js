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
  },
  (err, conn) => {
    if (err) throw err;
    openConn = conn;
    BeginRealTimeStream();
  }
);

http.listen(3000);

// setInterval(() => {
//   var allItems = [];
//   r.table("Items").run(openConn, (err, cursor) => {
//     if (err) throw err;
//     cursor.toArray((err, result) => {
//       allItems = result;      
//       var randomIndex = Math.floor(Math.random() * (allItems.length - 1) + 1);
//       var newUnitStockAmount=allItems[randomIndex].UnitsInStock+1;
//       var id=allItems[randomIndex].id;
      
//       r.table("Items").get(id).update({UnitsInStock:newUnitStockAmount}).run(openConn,(err,result)=>{
//         if (err) throw err;
//       });
//     });   
//   });
// },5000);

function BeginRealTimeStream() {
  r.table("Items")
    .changes()
    .run(openConn, function (err, feed) {
      if (err) {
        throw err;
      }

      feed.on("error", function (error) {
        throw error;
      });
      feed.on("data", function (newData) {
        if (newData.new_val != null) {
          newData.new_val.image =
            "https://demos.telerik.com/kendo-ui/content/web/foods/" +
            newData.new_val.ProductID +
            ".jpg";
        }
        io.sockets.emit("broadcast", newData);
      });
    });
}

app.get("/api/Items", (req, res) => {
  r.table("Items").run(openConn, (err, cursor) => {
    if (err) throw err;
    cursor.toArray((err, result) => {
      SetImage(result);
      res.json(result);
    });
  });
});

app.get("/api/EditItem", (req, res) => {
  r.table("Items")
  .get(req.query.id)
  .run(openConn, (err, result) => {
    if (err) throw err;
     res.json(result);
  });
});

app.post("/api/UpdateItem", (req, res) => {
  req.body.ProductName=req.body.ProductName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  r.table("Items")
    .get(req.body.id)
    .update(req.body)
    .run(openConn, (err, result) => {
      if (err) throw err;
       res.json(null);
    });
});

app.post("/api/NewItem", (req, res) => {
  req.body.ProductNamereq.body.ProductName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  r.table("Items")
    .insert(req.body)
    .run(openConn, (err, result) => {
      if (err) throw err;
       res.json(null);
    });
});

app.post("/api/DeleteItem", (req, res) => {
  r.table("Items")
    .get(req.query.id)
    .delete()
    .run(openConn, (err, result) => {
      if (err) throw err;
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

function SetImage(data) {
  data.map(
    (x) =>
      (x.image =
        "https://demos.telerik.com/kendo-ui/content/web/foods/" +
        x.ProductID +
        ".jpg")
  );
}