import React, { useState, useEffect } from "react";
import "./Product.css";
import { Link } from "react-router-dom";

function Products() {
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("default");
  const [categoria, setCategoria] = useState("all");
  const [productosCargados, setProductosCargados] = useState(false); // Estado para controlar la carga inicial

  useEffect(() => {
    // Solo realizar la solicitud si los productos aún no se han cargado
    if (!productosCargados) {
      const fetchProductos = async () => {
        try {
          const response = await fetch("http://localhost:3000/products");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setProductosFiltrados(data);
          setProductosCargados(true); // Marcar como cargados después de la primera carga
        } catch (error) {
          console.error("Error fetching data:", error);
          // Manejar el estado de error si es necesario
        }
      };

      fetchProductos();
    }
  }, [productosCargados]); // Dependencia: productosCargados

  const handleOrdenChange = (e) => {
    setOrden(e.target.value);
  };

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const filteredProductos = productosFiltrados.filter((producto) =>
    producto.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoria === "all" || producto.categoria === categoria)
  ).sort((a, b) => {
    if (orden === "menor_precio") {
      return parseFloat(a.precio) - parseFloat(b.precio);
    } else if (orden === "mayor_precio") {
      return parseFloat(b.precio) - parseFloat(a.precio);
    } else {
      return 0;
    }
  });

  return (
    <div className="products">
      <div className="search-filter-container">
        {/* Buscador */}
        <input
          className="search-filter-container-input"
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={handleBusquedaChange}
        />
        <div className="filtro">
          <label>Ordenar por:</label>
          <select value={orden} onChange={handleOrdenChange}>
            <option value="default">Por defecto</option>
            <option value="menor_precio">Menor precio</option>
            <option value="mayor_precio">Mayor precio</option>
          </select>

          <label>Filtrar por Categoria:</label>
          <select value={categoria} onChange={handleCategoriaChange}>
            <option value="all">Todas</option>
            <option value="Frutas Tropicales">Frutas Tropicales</option>
            <option value="Frutas de Temporada">Frutas de Temporada</option>
            {/* Agregar más opciones según la respuesta de tu API */}
          </select>
        </div>
      </div>
      <div className="products">
        {filteredProductos.map((producto) => (
          <Link key={producto._id} to={`/producto/${producto._id}`} className="products_link">
            <div className="product">
              <div className="product_info">
                <p>{producto.nombre_producto}</p>
                <p className="product_price">
                  <small>$</small>
                  <strong>{producto.precio}</strong>
                </p>
                <div className="product_rating"></div>
              </div>
              {producto.imagen_producto && producto.imagen_producto.length > 0 && (
                <img className="product_image" src={producto.imagen_producto[0]} alt={producto.nombre_producto} />
              )}
              {/* <button className="product_button">Agregar al carrito</button> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
