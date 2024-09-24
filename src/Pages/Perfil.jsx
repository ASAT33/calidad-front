import React, { useState } from 'react';
import './Perfil.css';

const Perfil = () => {
  const [fullName, setFullName] = useState("Juan");
  const [userName, setUserName] = useState("JuanG");
  const [password, setPassword] = useState("********");
  const [confirmPassword, setConfirmPassword] = useState("********");
  const [email, setEmail] = useState("juan1234@gmail.com");
  const [confirmEmail, setConfirmEmail] = useState("juan1234@gmail.com");

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Perfil</h2>
        <img src="https://via.placeholder.com/100" alt="Avatar" className="perfil-avatar" />
        <h2 className="perfil-name">{fullName}</h2>
        <p className="perfil-username">#{userName}</p>
        <button className="perfil-upload-btn">Actualizar Foto</button>
        <p className="perfil-upload-info">
          Sube una nueva imagen. Maximo 1 MB.
        </p>
        <p className="perfil-member-since">Miembro desde: 29 Septiembre 2020</p>
      </div>
      <div className="editar-perfil-card">
        <h2>Editar Perfil</h2>
        <form>
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Usuario</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Correo electronico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirmar correo electronico</label>
            <input type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
          </div>
          <button type="submit" className="update-btn">Actualizar Datos</button>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
