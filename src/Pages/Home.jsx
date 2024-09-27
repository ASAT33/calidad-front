import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Importar para animaciones
import "./Home.css"; // Asegúrate de tener este archivo CSS para el estilo

const Home = () => {
  return (
    <div className="home">
      <motion.div 
        className="home_container"
        initial={{ opacity: 0, y: -20 }} // Iniciar con opacidad 0 y ligeramente arriba
        animate={{ opacity: 1, y: 0 }} // Finalizar con opacidad 1 y en su posición
        transition={{ duration: 0.5 }} // Duración de la transición
      >
        <div className="home-content">
          <h1>Quality in Every Scope, Precision in Every Line.</h1>
          <p>
            QualityScope es una herramienta de evaluación de software basada en la norma ISO 25010, que permite analizar características de calidad como funcionalidad, fiabilidad y usabilidad. Facilita la identificación de fortalezas y debilidades en el software, promoviendo mejoras y asegurando el cumplimiento de estándares de calidad para aumentar la satisfacción del usuario.
          </p>
          <Link to="/evaluar">
            <button className="shop-now-button">Evaluar Software</button>
          </Link>
        </div>
        <div className="home-image-container">
          <img
            className="home-image"
            src="src/assets/quality-diagram.png" // Cambia esta ruta por la imagen correcta
            alt="Quality Diagram"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
