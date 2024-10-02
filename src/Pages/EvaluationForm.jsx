import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Importar para animaciones
import "./EvaluationForm.css"; // Asegúrate de tener este archivo CSS para el estilo

const EvaluationForm = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL

  // Estado para el producto cargado
  const [product, setProduct] = useState(null);

  // Estado para almacenar las preguntas
  const [questions, setQuestions] = useState({
    functionality: [],
    reliability: [],
    usability: [],
    maintainability: [],
    portability: [],
    efficiency: [],
    security: [],
  });

  const [ratings, setRatings] = useState({
    functionality: [0, 0, 0],
    reliability: [0, 0, 0],
    usability: [0, 0, 0],
    maintainability: [0, 0, 0],
    portability: [0, 0, 0],
    efficiency: [0, 0, 0],
    security: [0, 0, 0],
  });

  const [comments, setComments] = useState({
    general: '', // Initialize general comments
  }); // Estado para manejar los comentarios por pregunta

  // Llamada a la API para obtener el producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/software-projects/${id}`);
        setProduct(response.data); // Guardar el producto en el estado
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProduct(); // Llamar a la función cuando se monta el componente
  }, [id]);

  // Llamar a la API para obtener las preguntas
  useEffect(() => {
    const fetchQuestions = async (category) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/evaluation_questions/${category}`);
        return response.data;
      } catch (error) {
        console.error("Error al obtener preguntas:", error);
        return [];
      }
    };

    // Obtener preguntas para cada categoría
    const loadQuestions = async () => {
      const categories = Object.keys(questions);
      const fetchedQuestions = {};

      for (let category of categories) {
        fetchedQuestions[category] = await fetchQuestions(category);
      }

      setQuestions(fetchedQuestions);
    };

    loadQuestions();
  }, []);

  const handleChange = (category, index, value) => {
    const newRatings = { ...ratings };
    newRatings[category][index] = parseInt(value);
    setRatings(newRatings);
  };

  const handleCommentChange = (category, questionId, value) => {
    setComments({ ...comments, [`${category}_${questionId}`]: value });
  };

  const handleGeneralCommentChange = (value) => {
    setComments({ ...comments, general: value }); // Update general comments
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const evaluationData = {
      software_id: id, // ID del producto
      evaluator_id: product.user_id, 
      comentario_general: comments.general || '', // Asegúrate de incluir el comentario general
      answers: Object.keys(ratings).map((category) => {
        return ratings[category].map((calificacion, index) => ({
          question_id: questions[category][index].id,
          calificacion: calificacion,
          comentario_categoria: comments[`${category}_${questions[category][index].id}`] || '', // Obtener el comentario por pregunta
        }));
      }).flat(), // Aplana el array
    };

    try {
      const response = await axios.post('http://localhost:5000/api/evaluations', evaluationData);
      console.log("Evaluación guardada:", response.data);
      // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error al guardar la evaluación:", error);
    }
  };

  // Mostrar mensaje de carga si no se ha obtenido el producto
  if (!product) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Cargando producto...</motion.div>;

  return (
    <motion.div 
      className="evaluation-form"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h2>Evaluar {product.name}</h2>
      
      {/* Mostrar el link del proyecto y el ID de la persona que lo subió */}
      <div className="product-details">
        <p>
          <strong>Descripción del Proyecto: </strong>
          {product.description}
        </p>
        <p>
          <strong>Link del Proyecto: </strong>
          <a href={product.link_or_executable} target="_blank" rel="noopener noreferrer">
            {product.link_or_executable}
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Funcionalidad */}
        <h3>Funcionalidad</h3>
        {questions.functionality.map((question) => (
          <div key={question.id}>
            <label>{question.question_text}:</label>
            <select 
              onChange={(e) => handleChange("functionality", questions.functionality.indexOf(question), e.target.value)} 
              className="evaluation-select"
            >
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
            {(ratings.functionality[questions.functionality.indexOf(question)] >= 1 && 
              ratings.functionality[questions.functionality.indexOf(question)] <= 3) && (
              <textarea
                value={comments[`functionality_${question.id}`] || ''}
                onChange={(e) => handleCommentChange("functionality", question.id, e.target.value)}
                placeholder="Comentario sobre esta pregunta"
                rows="2"
                className="evaluation-textarea"
              />
            )}
          </div>
        ))}

        {/* Repetir para otras categorías */}
        {[  
          { key: "reliability", title: "Fiabilidad" },
          { key: "usability", title: "Usabilidad" },
          { key: "maintainability", title: "Mantenibilidad" },
          { key: "portability", title: "Portabilidad" },
          { key: "efficiency", title: "Eficiencia" },
          { key: "security", title: "Seguridad" },
        ].map(({ key, title }) => (
          <div key={key}>
            <h3>{title}</h3>
            {questions[key].map((question) => (
              <div key={question.id}>
                <label>{question.question_text}:</label>
                <select 
                  onChange={(e) => handleChange(key, questions[key].indexOf(question), e.target.value)} 
                  className="evaluation-select"
                >
                  <option value="0">Seleccionar</option>
                  <option value="1">1 - Muy malo</option>
                  <option value="2">2 - Malo</option>
                  <option value="3">3 - Regular</option>
                  <option value="4">4 - Bueno</option>
                  <option value="5">5 - Muy bueno</option>
                </select>
                {(ratings[key][questions[key].indexOf(question)] >= 1 && 
                  ratings[key][questions[key].indexOf(question)] <= 3) && (
                  <textarea
                    value={comments[`${key}_${question.id}`] || ''}
                    onChange={(e) => handleCommentChange(key, question.id, e.target.value)}
                    placeholder="Comentario sobre esta pregunta"
                    rows="2"
                    className="evaluation-textarea"
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Comentarios generales */}
        <h3>Comentarios generales</h3>
        <textarea
          value={comments.general} 
          onChange={(e) => handleGeneralCommentChange(e.target.value)} 
          placeholder="Escribe tus comentarios generales aquí..."
          rows="4"
          className="evaluation-textarea"
        />

        <motion.button 
          type="submit" 
          className="evaluation-submit"
          whileHover={{ scale: 1.05 }}
        >
          Enviar Calificación
        </motion.button>
        <Link to="/evaluar" className="evaluation-link">Volver a la lista de productos</Link>
      </form>
    </motion.div>
  );
};

export default EvaluationForm;
