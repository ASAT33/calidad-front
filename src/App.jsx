// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import VistaProducto from "./Pages/VistaProducto";
import Perfil from "./Pages/Perfil";
import Producto from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import GestionFincas from "./Pages/GestionFincas";
import FincaForm from "./Pages/FincaForm";
import PrivateRoute from "./Pages/PrivateRoutes";
import PageEvaluator from "./Pages/PageEvaluator";
import EvaluationForm from "./Pages/EvaluationForm";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const farmData = {
    name: "Farm Name",
    description: "Farm description goes here.",
    products: [
      {
        name: "Product 1",
        price: 14.99,
        image: "/path/to/image1.jpg",
        category: "Fruits",
      },
      {
        name: "Product 2",
        price: 9.99,
        image: "/path/to/image2.jpg",
        category: "Vegetables",
      },
      // Añade más productos según sea necesario
    ],
  };
  return (
    <>
      <BrowserRouter>
        
          <Header onLocationChange={handleLocationChange} />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/producto/:id" element={<VistaProducto />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/evaluar" element={<PageEvaluator />} />
          <Route path="/evaluate/:id" element={<EvaluationForm />} />
       
          <Route
            path="/products"
            element={<PrivateRoute element={Producto} />}

          />
          <Route path="/gestionfinca" element={<PrivateRoute element={GestionFincas} />} />

          <Route path="/gestionfinca/anadirfinca" element={<PrivateRoute element={FincaForm} />} />

        

          <Route path="/product/:id" element={<ProductDetail />} />
          {/* Nueva ruta para  productos más vendidos */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
