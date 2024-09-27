import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Importar para animaciones
import "./PageEvaluator.css"; // Asegúrate de tener este archivo CSS para el estilo

const products = [
  { id: 1, name: "Software A", description: "Descripción de Software A" },
  { id: 2, name: "Software B", description: "Descripción de Software B" },
  { id: 3, name: "Software C", description: "Descripción de Software C" },
  // Puedes agregar más productos aquí
];

const PageEvaluator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} // Iniciar con opacidad 0 y ligeramente arriba
      animate={{ opacity: 1, y: 0 }} // Finalizar con opacidad 1 y en su posición
      transition={{ duration: 0.5 }} // Duración de la transición
      className="page-evaluator"
    >
      <h1>Lista de Espera de Productos para Evaluar</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li className="product-item" key={product.id}>
            <Link to={`/evaluar/${product.id}`} className="product-link">
              <div className="product-content">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PageEvaluator;
