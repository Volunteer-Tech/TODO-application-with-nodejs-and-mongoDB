var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var todo = require("./model/todo.js");
//both index.js and things.js should be in same directory
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useMongoClient: true });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  var todoInfo = req.body;
  if (!todoInfo.todo) {
    console.log("No Info");
  } else {
    var c;
    Todo.findOne({}, (err, data) => {
      if (data) {
        c = data.unique_id + 1;
      } else {
        c = 1;
      }

      var newtodo = new Todo({
        unique_id: c,
        title: todoInfo.todo
      });

      newtodo.save((err, Person) => {
        if (err) {
        //   console.log(err);
        } else {
        //   console.log(Person);
        }
      });
    })
      .sort({ _id: -1 })
      .limit(1);
  }
  res.json({ Success: "1" });
});

app.get("/show", (req, res, next) => {
  Todo.find((err, response) => {
    res.json(response);
  });
});

app.delete("/todo/:id", (req, res) => {
  var id = req.params.id;

  Todo.findOneAndRemove({ unique_id: id }, function(err, offer) {
    console.log("deleted");
  });
  res.send("Success");
});

app.listen(3000, () => {
  console.log("Todo in Runing On port 3000");
});
