import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
        {[
          "La funcionalidad del software cumple con las expectativas.",
          "El software proporciona características adecuadas.",
          "El software es capaz de realizar tareas específicas.",
        ].map((q, index) => (
          <div key={index}>
            <label>{q}:</label>
            <select onChange={(e) => handleChange("functionality", index, e.target.value)}>
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

        {/* Fiabilidad */}
        <h3>Fiabilidad</h3>
        {[
          "El software es confiable en su funcionamiento.",
          "El software tiene un rendimiento constante.",
          "El software presenta errores mínimos.",
        ].map((q, index) => (
          <div key={index}>
            <label>{q}:</label>
            <select onChange={(e) => handleChange("reliability", index, e.target.value)}>
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
          </div>
        ))}
        {shouldShowComments("reliability") && (
          <textarea
            value={sectionComments.reliability}
            onChange={(e) => handleSectionCommentsChange("reliability", e.target.value)}
            placeholder="Comentarios sobre la fiabilidad"
            rows="2"
            cols="50"
          />
        )}

        {/* Usabilidad */}
        <h3>Usabilidad</h3>
        {[
          "El software es fácil de usar.",
          "La interfaz del software es intuitiva.",
          "El software ofrece una documentación clara.",
        ].map((q, index) => (
          <div key={index}>
            <label>{q}:</label>
            <select onChange={(e) => handleChange("usability", index, e.target.value)}>
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
          </div>
        ))}
        {shouldShowComments("usability") && (
          <textarea
            value={sectionComments.usability}
            onChange={(e) => handleSectionCommentsChange("usability", e.target.value)}
            placeholder="Comentarios sobre la usabilidad"
            rows="2"
            cols="50"
          />
        )}

        {/* Mantenibilidad */}
        <h3>Mantenibilidad</h3>
        {[
          "El software se puede modificar fácilmente.",
          "Es sencillo realizar actualizaciones.",
          "El software permite la resolución rápida de problemas.",
        ].map((q, index) => (
          <div key={index}>
            <label>{q}:</label>
            <select onChange={(e) => handleChange("maintainability", index, e.target.value)}>
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
          </div>
        ))}
        {shouldShowComments("maintainability") && (
          <textarea
            value={sectionComments.maintainability}
            onChange={(e) => handleSectionCommentsChange("maintainability", e.target.value)}
            placeholder="Comentarios sobre la mantenibilidad"
            rows="2"
            cols="50"
          />
        )}

        {/* Portabilidad */}
        <h3>Portabilidad</h3>
        {[
          "El software se puede instalar en diferentes entornos.",
          "El software es compatible con varios sistemas operativos.",
          "El software permite la migración a nuevas plataformas.",
        ].map((q, index) => (
          <div key={index}>
            <label>{q}:</label>
            <select onChange={(e) => handleChange("portability", index, e.target.value)}>
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
          </div>
        ))}
        {shouldShowComments("portability") && (
          <textarea
            value={sectionComments.portability}
            onChange={(e) => handleSectionCommentsChange("portability", e.target.value)}
            placeholder="Comentarios sobre la portabilidad"
            rows="2"
            cols="50"
          />
        )}

        {/* Eficiencia */}
        <h3>Eficiencia</h3>
        {[
          "El software utiliza los recursos de manera efectiva.",
          "El rendimiento del software es adecuado para su propósito.",
          "El software responde rápidamente a las acciones del usuario.",
        ].map((q, index) => (
          <div key={index}>
            <label>{q}:</label>
            <select onChange={(e) => handleChange("efficiency", index, e.target.value)}>
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
          </div>
        ))}
        {shouldShowComments("efficiency") && (
          <textarea
            value={sectionComments.efficiency}
            onChange={(e) => handleSectionCommentsChange("efficiency", e.target.value)}
            placeholder="Comentarios sobre la eficiencia"
            rows="2"
            cols="50"
          />
        )}

        {/* Seguridad */}
        <h3>Seguridad</h3>
        {[
          "El software protege adecuadamente los datos del usuario.",
          "El software tiene mecanismos de autenticación efectivos.",
          "El software es resistente a ataques externos.",
        ].map((q, index) => (
          <div key={index}>
            <label>{q}:</label>
            <select onChange={(e) => handleChange("security", index, e.target.value)}>
              <option value="0">Seleccionar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Regular</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Muy bueno</option>
            </select>
          </div>
        ))}
        {shouldShowComments("security") && (
          <textarea
            value={sectionComments.security}
            onChange={(e) => handleSectionCommentsChange("security", e.target.value)}
            placeholder="Comentarios sobre la seguridad"
            rows="2"
            cols="50"
          />
        )}

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
