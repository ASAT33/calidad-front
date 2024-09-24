import React, { useState, useEffect } from 'react';
import './GestionFincas.css';
import { Link,useNavigate } from 'react-router-dom';
import GestionProductos2 from './GestionProductos2';
import GestionProductos from './GestionProductos';

const GestionFincas = () => {
  const [fincas, setFincas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFinca, setSelectedFinca] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para modal de añadir producto
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Estado para modal de ver productos
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const userId = storedUser ? storedUser.user_id : null;

  const navigate = useNavigate();
 
  useEffect(() => {
    // Verificar si el usuario está autenticado y tiene el tipo adecuado
    if (!storedUser || storedUser.tipo_usuario !== 'Agricultor') {
      navigate('/');
      return; // Detener la ejecución si el usuario no es válido
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/fincas/user/by-user?user_id=${userId}`);
        const data = await response.json();
        setFincas(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, navigate]);

  const openModal = (finca) => {
    setSelectedFinca({
      ...finca,
      inicioHorario: finca.horario_atencion.substring(0, finca.horario_atencion.indexOf(' - ')),
      finHorario: finca.horario_atencion.substring(finca.horario_atencion.indexOf(' - ') + 3)
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFinca(null);
    setShowModal(false);
  };

  const handleEditClick = (finca) => {
    openModal(finca);
  };

  const handleDeleteClick = async (fincaId) => {
    try {
      const response = await fetch(`http://localhost:3000/fincas/${fincaId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFincas(fincas.filter((finca) => finca._id !== fincaId));
        alert('Finca eliminada exitosamente');
      } else {
        alert('Error al eliminar la finca');
      }
    } catch (error) {
      console.error('Error deleting finca:', error);
      alert('Error al eliminar la finca');
    }
  };

  const handleSave = async () => {
    if (!selectedFinca.inicioHorario || !selectedFinca.finHorario) {
      alert('Por favor ingresa un horario válido.');
      return;
    }
  
    try {
      const inicioHorarioFormatted = formatTime(selectedFinca.inicioHorario);
      const finHorarioFormatted = formatTime(selectedFinca.finHorario);
  
      const updatedFinca = {
        ...selectedFinca,
        horario_atencion: `${inicioHorarioFormatted} - ${finHorarioFormatted}`
      };
  
      const response = await fetch(`http://localhost:3000/fincas/${selectedFinca._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFinca),
      });
      if (response.ok) {
        setFincas(fincas.map((finca) =>
          finca._id === selectedFinca._id ? updatedFinca : finca
        ));
        closeModal();
        alert('Finca actualizada exitosamente');
      } else {
        alert('Error al actualizar la finca');
      }
    } catch (error) {
      console.error('Error updating finca:', error);
      alert('Error al actualizar la finca');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return ''; 
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleGeolocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedFinca({
            ...selectedFinca,
            ubicacion: {
              type: 'Point',
              coordinates: [latitude, longitude]
            },
            latitud: latitude,
            longitud: longitude  
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          alert('No se pudo obtener la ubicación actual.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('La geolocalización no está soportada por este navegador.');
    }
  };

  const handleAddProductClick = (fincaId) => {
    setIsAddModalOpen(true);
    setSelectedFinca(fincas.find((finca) => finca._id === fincaId)); 
  };

  const handleProductClick = (fincaId) => {
    const selected = fincas.find((finca) => finca._id === fincaId);
    if (selected) {
      setSelectedFinca(selected);
      setIsViewModalOpen(true);
    }
  };

  return (
    <div className="gestion-fincas">
      <header>
        <h1>Gestión de Evaluaciones</h1>
      </header>
      <Link to="/gestionfinca/anadirfinca" className="add-finca-btn">
        Agregar Nueva Evaluacion
      </Link>
      <div className="fincas-list">
        <h2>Listado de Proyectos</h2>
        {fincas.map((finca) => (
          <div className="finca" key={finca._id}>
            <span>{finca.nombre_finca}</span>
            <button className="edit-btn" onClick={() => handleProductClick(finca._id)}>
              Evaluar
            </button>
            <button className="edit-btn" onClick={() => handleAddProductClick(finca._id)}>
              Comentarios adicionales 
            </button>
            <button className="edit-btn" onClick={() => handleEditClick(finca)}>
              Editar
            </button>
            <button className="delete-btn" onClick={() => handleDeleteClick(finca._id)}>
              Eliminar
            </button>
            
          </div>
        ))}
      </div>
      {showModal && (
        <>
          <div className="custom-modal-overlay" onClick={closeModal}></div>
          <div className="custom-modal">
            <div className="custom-modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <div className="finca-form">
                <header>
                  <h1>Editar Finca</h1>
                </header>
                <div className="form-content">
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Nombre de la finca</label>
                      <input
                        type="text"
                        name="nombre"
                        value={selectedFinca.nombre_finca}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            nombre_finca: e.target.value,
                          })
                        }
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
                        value={selectedFinca.provincia}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            provincia: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        name="distrito"
                        placeholder="Distrito"
                        value={selectedFinca.distrito}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            distrito: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        name="corregimiento"
                        placeholder="Corregimiento"
                        value={selectedFinca.corregimiento}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            corregimiento: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        name="coordenadas"
                        placeholder="Coordenadas"
                        readOnly
                        value={`${selectedFinca.latitud || ''}, ${selectedFinca.longitud || ''}`}
                      />
                      <button className="geolocation-btn" onClick={handleGeolocationClick}>
                        Obtener Ubicación Actual
                      </button>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group half-width">
                      <label>Horario de Atención</label>
                      <input
                        type="time"
                        name="inicioHorario"
                        value={selectedFinca.inicioHorario}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            inicioHorario: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group half-width">
                      <label>&nbsp;</label>
                      <input
                        type="time"
                        name="finHorario"
                        value={selectedFinca.finHorario}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            finHorario: e.target.value,
                          })
                        }
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
                        value={selectedFinca.telefono_contacto}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            telefono_contacto: e.target.value,
                          })
                        }
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={selectedFinca.email_contacto}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            email_contacto: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    
                      {/* <label>Subir imágenes de la Finca</label>
                      <button className="upload-btn">Cargar imágenes de la finca</button>
                      <button className="upload-btn">Subir imágenes de productos</button>Modal para añadir productos */}
                   
                    <div className="form-group full-width">
                      <label>Descripción de la Finca</label>
                      <textarea
                        name="descripcion"
                        value={selectedFinca.descripcion}
                        onChange={(e) =>
                          setSelectedFinca({
                            ...selectedFinca,
                            descripcion: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group half-width">
                      <label>Imágenes de la Finca</label>
                      {selectedFinca.imagen_finca &&
                        selectedFinca.imagen_finca.slice(0, 3).map((imagenUrl, index) => (
                          <img
                            key={index}
                            src={imagenUrl}
                            alt={`Imagen ${index + 1}`}
                            className="preview-image"
                            style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '10px' }}
                          />
                        ))}
                      {selectedFinca.imagen_finca && selectedFinca.imagen_finca.length > 3 && (
                        <p style={{ marginTop: '5px' }}>Y más imágenes disponibles...</p>
                      )}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button  className="save-btn" onClick={handleSave}>
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Modal para añadir productos */}
      {isAddModalOpen && (
        <GestionProductos2
          fincaId={selectedFinca._id}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newProduct) => {
            // Implementa la lógica para guardar el nuevo producto
            console.log('Guardar producto:', newProduct);
            setIsAddModalOpen(false);
          }}
        />
      )}
      {/* Modal para ver lista de productos */}
      {isViewModalOpen && (
        <GestionProductos
          fincaId={selectedFinca._id}
          onClose={() => setIsViewModalOpen(false)}
          onSave={(newProduct) => {
            // Aquí podrías implementar la lógica para guardar el nuevo producto
            console.log('Guardar producto:', newProduct);
            setIsViewModalOpen(false);
          }}
        />
      )}
      <footer className="footer">
        <div className="help">Centro de ayuda</div>
        <div className="profile">ISO 25010</div>
      </footer>
    </div>
  );
};

export default GestionFincas;
