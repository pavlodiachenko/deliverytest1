const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://demo:admin@cluster0.osrpc.mongodb.net/shopDB");
const itemsSchema = {
  name: String,
  price: Number,
  img: String,
  shop: String,
};
const Product = mongoose.model("Product", itemsSchema);
const ordersSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    tel: String,
    adress: String,
    totalPrice: Number,
  },
  { strict: false }
);
const Order = mongoose.model("Order", ordersSchema);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("home", { header: "Start Shopping!" });
});

app.get("/McDonalds", (req, res) => {
  Product.find({ shop: "McDonalds" }, (err, products) => {
    res.render("products", { products: products });
  });
});

app.get("/KFC", (req, res) => {
  Product.find({ shop: "KFC" }, (err, products) => {
    res.render("products", { products: products });
  });
});

app.get("/Burger_King", (req, res) => {
  Product.find({ shop: "Burger_King" }, (err, products) => {
    res.render("products", { products: products });
  });
});

app.get("/cart", (req, res) => {
  Product.find({ shop: req.cookies.shop }, (err, products) => {
    res.render("cart", { products: products, cookies: req.cookies });
  });
});

app.post("/", (req, res) => {
  Product.find({ shop: req.body.shop }, (err, products) => {
    let newOrder = JSON.parse(JSON.stringify(req.body));
    let totalPrice = products.reduce((sum, item) => {
      return req.body.hasOwnProperty(item.id)
        ? sum + item.price * +req.body[item.id]
        : sum + 0;
    }, 0);
    newOrder.totalPrice = totalPrice;

    const order = new Order(newOrder);
    order.save();
  });
  res.render("home", { header: "Order Placed!" });
});

app.listen(process.env.PORT);
