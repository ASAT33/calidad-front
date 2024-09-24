import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./VistaProducto.css";

function VistaProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducto(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error state if needed
      }
    };

    fetchProducto();
  }, [id]);

  const handleAddToCart = () => {
    const storedProducts = JSON.parse(localStorage.getItem("productCheckout")) || [];
    const existingProduct = storedProducts.find(item => item.id === producto._id);

    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      storedProducts.push({ 
        id: producto._id,
        nombre: producto.nombre_producto,
        precio: producto.precio,
        imagen: producto.imagen_producto ? producto.imagen_producto[0] : "",
        cantidad: 1 
      });
    }

    localStorage.setItem("productCheckout", JSON.stringify(storedProducts));
    alert("El producto se añadio al carrito de compras")
  };

  if (!producto) {
    return <div>Cargando producto...</div>;
  }

  return (
    <div className="vista-producto">
      <div className="producto-detalles">
        <div className="producto-imagen">
          {producto.imagen_producto && producto.imagen_producto.length > 0 && (
            <img src={producto.imagen_producto[0]} alt={producto.nombre_producto} />
          )}
        </div>
        <div className="producto-info">
          <h2>{producto.nombre_producto}</h2>
          <p className="producto-precio">${producto.precio}</p>
          {/* Aquí puedes agregar más detalles del producto según tu API */}
          <div className="producto-rating">
            <span>★★★★☆</span> {/* Puedes poner una especie de puntaje del producto */}
          </div>
          <p className="producto-detalles">Descripción</p>
          <p className="producto-descripcion">{producto.descripcion}</p>

          <button className="agregar-carrito" onClick={handleAddToCart}>
            Añadir al Carrito
          </button>
        </div>
      </div>
      {/* Aquí podrías agregar sección de comentarios o reseñas si es necesario */}
    </div>
  );
}

export default VistaProducto;
