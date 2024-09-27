import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./EvaluationForm.css"; // Asegúrate de tener este archivo CSS para el estilo

const products = [
  { id: 1, name: "Software A" },
  { id: 2, name: "Software B" },
  { id: 3, name: "Software C" },
  // Puedes agregar más productos aquí
];

const EvaluationForm = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const product = products.find((prod) => prod.id === parseInt(id)); // Buscar el producto correspondiente

  const [ratings, setRatings] = useState({
    functionality: [0, 0, 0],
    reliability: [0, 0, 0],
    usability: [0, 0, 0],
    maintainability: [0, 0, 0],
    portability: [0, 0, 0],
    efficiency: [0, 0, 0],
    security: [0, 0, 0],
  });

  const [comments, setComments] = useState(""); // Estado para manejar los comentarios generales
  const [sectionComments, setSectionComments] = useState({
    functionality: "",
    reliability: "",
    usability: "",
    maintainability: "",
    portability: "",
    efficiency: "",
    security: "",
  });

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

  useEffect(() => {
    // Llamar a la API para obtener las preguntas
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
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar el componente

  const handleChange = (category, index, value) => {
    const newRatings = { ...ratings };
    newRatings[category][index] = parseInt(value);
    setRatings(newRatings);
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleSectionCommentsChange = (category, value) => {
    setSectionComments({ ...sectionComments, [category]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Calificaciones:", ratings);
    console.log("Comentarios generales:", comments);
    console.log("Comentarios por sección:", sectionComments);
    // Aquí puedes enviar las calificaciones y los comentarios a un servidor o manejarlas como necesites
  };

  // Verifica si una sección tiene alguna respuesta menor a 3
  const shouldShowComments = (category) => {
    return ratings[category].some((rating) => rating > 0 && rating < 3);
  };

  if (!product) return <div>Producto no encontrado</div>; // Manejo de error si el producto no se encuentra

  return (
    <div className="evaluation-form">
      <h2>Evaluar {product.name}</h2>
      <form onSubmit={handleSubmit}>
        {/* Funcionalidad */}
        <h3>Funcionalidad</h3>
        {questions.functionality.map((question) => (
          <div key={question.id}>
            <label>{question.question_text}:</label>
            <select onChange={(e) => handleChange("functionality", questions.functionality.indexOf(question), e.target.value)}>
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
          </div>
        ))}
        {shouldShowComments("functionality") && (
          <textarea
            value={sectionComments.functionality}
            onChange={(e) => handleSectionCommentsChange("functionality", e.target.value)}
            placeholder="Comentarios sobre la funcionalidad"
            rows="2"
            cols="50"
          />
        )}

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
                <select onChange={(e) => handleChange(key, questions[key].indexOf(question), e.target.value)}>
                  <option value="0">Seleccionar</option>
                  <option value="1">1 - Muy malo</option>
                  <option value="2">2 - Malo</option>
                  <option value="3">3 - Regular</option>
                  <option value="4">4 - Bueno</option>
                  <option value="5">5 - Muy bueno</option>
                </select>
              </div>
            ))}
            {shouldShowComments(key) && (
              <textarea
                value={sectionComments[key]}
                onChange={(e) => handleSectionCommentsChange(key, e.target.value)}
                placeholder={`Comentarios sobre la ${title.toLowerCase()}`}
                rows="2"
                cols="50"
              />
            )}
          </div>
        ))}

        {/* Comentarios generales */}
        <h3>Comentarios generales</h3>
        <textarea
          value={comments}
          onChange={handleCommentsChange}
          placeholder="Escribe tus comentarios generales aquí..."
          rows="4"
          cols="50"
        />

        <button type="submit">Enviar Calificación</button>
        <Link to="/evaluar">Volver a la lista de productos</Link>
      </form>
    </div>
  );
};

export default EvaluationForm;
