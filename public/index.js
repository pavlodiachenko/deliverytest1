[...document.querySelectorAll(".sidenav-item")].forEach((item) => {
  item.addEventListener("click", (event) => {
    console.log(event.target.id);
    Product.find({}, (err, result) => console.log(result));
  });
});
