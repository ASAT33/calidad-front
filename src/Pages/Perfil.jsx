import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Perfil.css';

const Perfil = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Estado para el rol
  const [createdAt, setCreatedAt] = useState(""); // Estado para la fecha de creación

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, email, role, created_at } = response.data;
        setFullName(name);
        setUserName(name); // Asumimos que el nombre de usuario es el nombre completo por ahora
        setEmail(email);
        setConfirmEmail(email);
        setRole(role);
        setCreatedAt(created_at); // Convertir la fecha a un formato legible
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        alert('Error al cargar los datos del perfil');
      }
    };

    fetchProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email !== confirmEmail) {
      alert('Los correos electrónicos no coinciden');
      return;
    }
    if (password && password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/profile',
        { name: fullName, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Perfil</h2>
        <h2 className="perfil-name">{fullName}</h2>
        <p className="perfil-username">#{userName}</p>
        <p className="perfil-role">Rol: {role}</p> {/* Mostrar rol */}
        <p className="perfil-member-since">Miembro desde: {createdAt}</p> {/* Mostrar fecha de creación */}
      </div>
      <div className="editar-perfil-card">
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Usuario</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} disabled />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirmar correo electrónico</label>
            <input type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <button type="submit" className="update-btn">Actualizar Datos</button>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
