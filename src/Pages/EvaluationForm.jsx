import React, { useState, useEffect, useMemo } from "react"; // Importar useMemo desde React
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Importar para animaciones
import "./EvaluationForm.css"; // Asegúrate de tener este archivo CSS para el estilo

const EvaluationForm = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const userId = useMemo(() => parseInt(sessionStorage.getItem('user_id'), 10), []); // Asegurarse de obtener el userId correctamente

  // Estado para el producto cargado
  const [product, setProduct] = useState(null);

  // Estado para almacenar las preguntas
  const [questions, setQuestions] = useState({
    functionality: [],
    reliability: [],
    usability: [],
    maintainability: [],
    portability: [],
    security: [],
    compatibility: [],  // Nueva categoría
    fiability: [],      // Nueva categoría
  });

  const [ratings, setRatings] = useState({
    functionality: [0, 0, 0],
    reliability: [0, 0, 0],
    usability: [0, 0, 0],
    maintainability: [0, 0, 0],
    portability: [0, 0, 0],
    security: [0, 0, 0],
    compatibility: [0, 0, 0],  // Nueva categoría
    fiability: [0, 0, 0],      // Nueva categoría
  });

  const [comments, setComments] = useState({
    general: '', // Initialize general comments
  });

  const [loading, setLoading] = useState(false); // Estado para manejar la carga del envío
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error
  const [isFormLocked, setIsFormLocked] = useState(false); // Estado para bloquear el formulario

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
    setLoading(true); // Disable submit button while processing

    // Check for any empty ratings or comments
    const allRatingsComplete = Object.values(ratings).every((categoryRatings) =>
      categoryRatings.every((rating) => rating > 0)
    );

    const allCommentsComplete = Object.keys(comments).every((key) => {
      if (key === 'general') {
        return comments[key].trim() !== ''; // General comments must not be empty
      }
      // Check for individual comments
      return Object.keys(ratings).some((category) =>
        questions[category].some((question) => {
          const questionId = question.id;
          return comments[`${category}_${questionId}`] && comments[`${category}_${questionId}`].trim() !== '';
        })
      );
    });

    if (!allRatingsComplete || !allCommentsComplete) {
      setErrorMessage("Por favor, completa todas las calificaciones y comentarios.");
      setLoading(false); // Re-enable the button
      return; // Stop submission if validation fails
    }

    const evaluationData = {
      software_id: id, // Product ID
      evaluator_id: userId, // Make sure userId is correct
      comentario_general: comments.general || '', // Include general comment
      answers: Object.keys(ratings).map((category) => {
        return ratings[category].map((calificacion, index) => {
          // Check if there are questions in the category and if the index is valid
          if (questions[category] && questions[category][index]) {
            return {
              question_id: questions[category][index].id,
              calificacion: calificacion,
              comentario_categoria: comments[`${category}_${questions[category][index].id}`] || '', // Get comment per question
            };
          }
          return null; // Return null if there is no question
        }).filter(answer => answer !== null); // Filter out null answers
      }).flat(), // Flatten the array
    };

    try {
      await axios.post('http://localhost:5000/api/evaluations', evaluationData);
      setSuccessMessage("¡Evaluación enviada con éxito! 🎉"); // Show success message
      setErrorMessage(''); // Clear error messages
      setIsFormLocked(true); // Lock the form after successful submission
      setLoading(false); // Re-enable the button
      setRatings({ // Clear ratings
        functionality: [0, 0, 0],
        reliability: [0, 0, 0],
        usability: [0, 0, 0],
        maintainability: [0, 0, 0],
        portability: [0, 0, 0],
        security: [0, 0, 0],
        compatibility: [0, 0, 0],  // Nueva categoría
        fiability: [0, 0, 0],      // Nueva categoría
      });
      setComments({ general: '' }); // Clear comments
    } catch (error) {
      setErrorMessage("Hubo un error al enviar la evaluación. Inténtalo nuevamente.");
      setSuccessMessage(''); // Clear success messages
      setLoading(false); // Re-enable the button
    }
  };

  // Verificar si todos los campos están completos
  const isFormComplete = () => {
    return Object.values(ratings).every((categoryRatings) =>
      categoryRatings.every((rating) => rating > 0)
    );
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
              value={ratings.functionality[questions.functionality.indexOf(question)]}
              disabled={isFormLocked} // Deshabilitar si el formulario está bloqueado
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
                disabled={isFormLocked} // Deshabilitar si el formulario está bloqueado
              />
            )}
          </div>
        ))}

        {/* Repetir para otras categorías */}
        {[  
          { key: "reliability", title: "Fiabilidad" },
          { key: "compatibility", title: "Compatibilidad" },  // Nueva categoría
          { key: "usability", title: "Usabilidad" },
          { key: "fiability", title: "Fiabilidad" }, 
          { key: "security", title: "Seguridad" }, 
          { key: "maintainability", title: "Mantenibilidad" },
          { key: "portability", title: "Portabilidad" },
        ].map(({ key, title }) => (
          <div key={key}>
            <h3>{title}</h3>
            {questions[key].map((question) => (
              <div key={question.id}>
                <label>{question.question_text}:</label>
                <select 
                  onChange={(e) => handleChange(key, questions[key].indexOf(question), e.target.value)} 
                  className="evaluation-select"
                  value={ratings[key][questions[key].indexOf(question)]}
                  disabled={isFormLocked} // Deshabilitar si el formulario está bloqueado
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
                    disabled={isFormLocked} // Deshabilitar si el formulario está bloqueado
                  />
                )}
              </div>
            ))} 
          </div>
        ))}

        <h3>Comentario General</h3>
        <textarea
          value={comments.general}
          onChange={(e) => handleGeneralCommentChange(e.target.value)}
          placeholder="Escribe tu comentario general aquí..."
          rows="3"
          className="evaluation-textarea"
          disabled={isFormLocked} // Deshabilitar si el formulario está bloqueado
        />

        {/* Mostrar mensajes de éxito o error */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <motion.button 
          type="submit" 
          className="evaluation-submit"
          disabled={isFormLocked} // Deshabilitar si el formulario está bloqueado
          whileHover={!loading && isFormComplete() ? { scale: 1.05 } : {}} // Desactivar animación si está deshabilitado
        >
          {loading ? "Enviando..." : "Enviar Calificación"}
          
        </motion.button>
        <motion.button 
          className="back-button"
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/evaluar" className="back-link">Regresar a las evaluaciones</Link>
        </motion.button>

      </form>

      
    </motion.div>
  );
};

export default EvaluationForm;
