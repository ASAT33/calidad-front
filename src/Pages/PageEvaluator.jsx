import React from "react";
import { Link } from "react-router-dom";
import "./PageEvaluator.css"; // Asegúrate de tener este archivo CSS para el estilo

const products = [
  { id: 1, name: "Software A", description: "Descripción de Software A" },
  { id: 2, name: "Software B", description: "Descripción de Software B" },
  { id: 3, name: "Software C", description: "Descripción de Software C" },
  // Puedes agregar más productos aquí
];

const PageEvaluator = () => {
  return (
    <div className="page-evaluator">
      <h1>Lista de Espera de Productos para Evaluar</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li className="product-item" key={product.id}>
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            {/* Enlace al formulario de evaluación con el producto como estado */}
            <Link to={`/evaluate/${product.id}`}>
              <button className="evaluate-button">Evaluar</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageEvaluator;
