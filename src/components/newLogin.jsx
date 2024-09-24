import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './newlogin.css';
 
const AuthModal = ({ open, handleClose }) => {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipo_usuario: 'Evaluador',
    fecha_nacimiento: '',
    password: '',
  });
  const navigate = useNavigate();
 
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setRegisterData((prevRegisterData) => ({
      ...prevRegisterData,
      fecha_nacimiento: formattedDate,
    }));
  }, []);
 
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
 
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
 
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };
 
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('token', data.token);
sessionStorage.setItem('user', JSON.stringify(data.user));
 
const storedUser = JSON.parse(sessionStorage.getItem('user'));
const userId = storedUser.user_id;
 
console.log(userId);
        handleClose();
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
 
 
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/register', registerData);
      console.log(response.data);
      handleClose();
    } catch (error) {
      console.error('There was an error registering the user!', error);
    }
  };
 
 
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="auth tabs">
          <Tab label="Iniciar Sesión" />
          <Tab label="Crear Cuenta" />
        </Tabs>
        {tab === 0 && (
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Iniciar Sesión
            </Typography>
            <form onSubmit={handleLoginSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    type="password"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Iniciar Sesión
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
        {tab === 1 && (
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Registro
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tipo de usuario</FormLabel>
              <RadioGroup
                aria-label="tipo_usuario"
                name="tipo_usuario"
                value={registerData.tipo_usuario}
                onChange={handleRegisterChange}
              >
                <FormControlLabel value="Evaluador" control={<Radio />} label="Evaluador" />
                <FormControlLabel value="Usuario" control={<Radio />} label="Usuario" />
              </RadioGroup>
            </FormControl>
            <form onSubmit={handleRegisterSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={registerData.nombre}
                    onChange={handleRegisterChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={registerData.apellido}
                    onChange={handleRegisterChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={registerData.telefono}
                    onChange={handleRegisterChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="hidden"
                    name="fecha_nacimiento"
                    value={registerData.fecha_nacimiento}
                    onChange={handleRegisterChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    type="password"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Crear Cuenta
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
 
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
 
export default AuthModal;
 