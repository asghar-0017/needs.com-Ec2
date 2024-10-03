const { CreateProduct, upload, GetProduct, GetOneProduct,productUpdate,deleteProduct } = require("../controllers/ProductController.js");
  const Routes = (app) => {

    app.post("/create", upload.single("image"), CreateProduct);
    app.put('/product-update/:id',upload.single("image"), productUpdate); 
    app.delete('/product-delete/:id', deleteProduct);  
    app.get("/get-product",GetProduct);
    app.get("/get-product/:id",GetOneProduct);
  };
  
  module.exports = Routes;
  