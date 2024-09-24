import React, { useState, useEffect } from "react";
import "./FincaForm.css";
import { Link } from "react-router-dom";

const FincaForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    provincia: "",
    distrito: "",
    corregimiento: "",
    inicioHorario: "",
    finHorario: "",
    telefono: "",
    email: "",
    descripcion: "",
    ubicacion: {
      type: "Point",
      coordinates: [],
    },
  });
  const [mensaje, setMessage] = useState("");
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const userId = storedUser ? storedUser.user_id : null;
  
  const [data, setData] = useState(null);

  useEffect(() => {
    if (userId && !data) {
      console.log("Fetching data...");
      fetchData();
    }
  }, [userId, data]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/fincas/user/by-user?user_id=${userId}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGuardarClick = async () => {
    const fincaData = {
      user_id: userId,
      nombre_finca: formData.nombre,
      descripcion: formData.descripcion,
      provincia: formData.provincia,
      distrito: formData.distrito,
      corregimiento: formData.corregimiento,
      horario_atencion: `${formatTime(formData.inicioHorario)} - ${formatTime(formData.finHorario)}`,
      telefono_contacto: formData.telefono,
      email_contacto: formData.email,
      ubicacion: formData.ubicacion,
      imagen_finca: `placeholder-image-${Math.random().toString(36).substring(7)}`, // Random placeholder value
    };
    console.log(fincaData);

    try {
      const response = await fetch("http://localhost:3000/fincas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fincaData),
      });

      if (response.ok) {
        console.log("Finca creada exitosamente");
        setFormData({
          nombre: "",
          provincia: "",
          distrito: "",
          corregimiento: "",
          inicioHorario: "",
          finHorario: "",
          telefono: "",
          email: "",
          descripcion: "",
          ubicacion: {
            type: "Point",
            coordinates: [],
          },
        });
        setMessage("");
      } else {
        console.error("Error al crear la finca");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUbicacionActualClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            ubicacion: {
              type: "Point",
              coordinates: [latitude, longitude],
            },
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          alert("No se pudo obtener la ubicación actual.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("La geolocalización no está soportada por este navegador.");
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="finca-form">
      <header>
        <h1>Gestión de Fincas</h1>
      </header>
      <div className="form-content">
        <div className="form-row">
          <div className="form-group full-width">
            <label>Nombre de la finca</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Ubicación</label>
            <input
              type="text"
              name="provincia"
              placeholder="Provincia"
              value={formData.provincia}
              onChange={handleChange}
            />
            <input
              type="text"
              name="distrito"
              placeholder="Distrito"
              value={formData.distrito}
              onChange={handleChange}
            />
            <input
              type="text"
              name="corregimiento"
              placeholder="Corregimiento"
              value={formData.corregimiento}
              onChange={handleChange}
            />
            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              readOnly
              value={formData.ubicacion.coordinates.join(", ")}
              onChange={handleChange}
            />
            <button onClick={handleUbicacionActualClick}>
              Obtener Ubicación Actual
            </button>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label>Horario de Atención (Lunes a Viernes)</label>
            <input
              type="time"
              name="inicioHorario"
              value={formData.inicioHorario}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>&nbsp;</label>
            <input
              type="time"
              name="finHorario"
              value={formData.finHorario}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Métodos de contacto</label>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Descripción de la Finca</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="form-actions">
          <button onClick={handleGuardarClick} className="save-btn">
            Guardar
          </button>
          <Link to="/gestionfinca" className="cancel-btn">
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FincaForm;
