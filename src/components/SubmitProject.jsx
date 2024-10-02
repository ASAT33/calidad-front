import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Grid, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { motion } from 'framer-motion'; // Importar para animaciones

const SubmitProject = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    link_or_executable: '',
    description: '', // Campo de descripción agregado
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = sessionStorage.getItem('user_id'); // Obtener user_id desde sessionStorage

    if (!user_id) {
      console.error('User ID no encontrado en sessionStorage');
      setErrorMessage('No se encontró el ID del usuario. Asegúrate de estar logueado.');
      return; // Detener la ejecución si no hay user_id
    }

    try {
      const response = await axios.post('http://localhost:5000/api/software-projects', {
        ...projectData,
        user_id, // Pasamos el user_id
      });
      setSuccessMessage('¡Proyecto enviado con éxito! 🎉');
      setProjectData({ name: '', link_or_executable: '', description: '' }); // Resetear el formulario
    } catch (error) {
      setErrorMessage('Error al enviar el proyecto: ' + error.message);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      p: 3, 
      bgcolor: '#f4f6f9', // Fondo suave
      minHeight: '100vh', 
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
          ¡Sube Tu Proyecto de Software!
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          Solicita tu evaluación y lleva tus proyectos al siguiente nivel.
        </Typography>
        {successMessage && (
          <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
            <Alert onClose={() => setSuccessMessage('')} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
        )}
        {errorMessage && (
          <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
            <Alert onClose={() => setErrorMessage('')} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                transition={{ duration: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="Nombre del Proyecto"
                  name="name"
                  value={projectData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  color="primary"
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                transition={{ duration: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="Link del Proyecto"
                  name="link_or_executable"
                  value={projectData.link_or_executable}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  color="primary"
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                transition={{ duration: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="Descripción del Proyecto"
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  variant="outlined"
                  color="primary"
                  multiline
                  rows={4}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 'bold',
                    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                      backgroundColor: '#3f51b5',
                    },
                  }}
                >
                  ¡Subir Proyecto!
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </form>
      </motion.div>
    </Box>
  );
};

export default SubmitProject;
