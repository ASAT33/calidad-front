import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Importar para animaciones
import "./PageEvaluator.css"; // Asegúrate de tener este archivo CSS para el estilo

const PageEvaluator = () => {
  const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga

  // Función para obtener los proyectos de la API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/software-projects");
        if (!response.ok) {
          throw new Error("Error al obtener los proyectos.");
        }
        const data = await response.json();
        setProjects(data); // Guardar los proyectos en el estado
        setLoading(false); // Terminar el estado de carga
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false); // Asegurar que se deja de cargar incluso en caso de error
      }
    };

    fetchProjects(); // Llamar a la función al montar el componente
  }, []); // El array vacío asegura que se ejecute solo al montar el componente

  if (loading) {
    return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>Cargando proyectos...</motion.p>; // Mostrar un mensaje mientras carga
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} // Iniciar con opacidad 0 y ligeramente arriba
      animate={{ opacity: 1, y: 0 }} // Finalizar con opacidad 1 y en su posición
      transition={{ duration: 0.5 }} // Duración de la transición
      className="page-evaluator"
    >
      <h1 className="page-title">Lista de Proyectos para Evaluar</h1>
      {projects.length === 0 ? ( // Verificar si no hay proyectos
        <p>No hay proyectos disponibles para evaluar.</p>
      ) : (
        <ul className="product-list">
          {projects.map((project) => (
            <motion.li
              className="product-item"
              key={project.id}
              whileHover={{ scale: 1.02 }} // Animación de hover
              transition={{ duration: 0.3 }}
            >
              <Link to={`/evaluar/${project.id}`} className="product-link">
                <div className="product-content">
                  <h2 className="product-name">{project.name}</h2>
                  <p className="product-description">{project.description}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default PageEvaluator;
