
import React, { useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Carrots",
      description: "Fresh carrots harvested this week.",
      price: 2.5,
      quantity: 100,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Free Range Eggs",
      description: "Dozen farm eggs. No chemicals.",
      price: 3.2,
      quantity: 50,
      image: "https://via.placeholder.com/150"
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: ""
  });

  const handleAddProduct = () => {
    const newId = products.length + 1;
    const product = { id: newId, ...newProduct };
    setProducts([...products, product]);
    setNewProduct({ name: "", description: "", price: "", quantity: "", image: "" });
  };

  return (
    <div>
      <Header title="My Listings" />
      <div className="flex justify-end mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-bold mb-2">Add New Product</h2>
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="mb-2"
            />
            <Textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="mb-2"
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="mb-2"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="mb-4"
            />
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

