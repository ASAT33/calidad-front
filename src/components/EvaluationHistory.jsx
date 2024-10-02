import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Importar Link para la navegación

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EvaluationHistory = () => {
  // Estado para almacenar las evaluaciones
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el ID del usuario logueado desde sessionStorage y convertirlo a número
  const userId = parseInt(sessionStorage.getItem('user_id'), 10);
  console.log("User ID from session storage:", userId); // Asegúrate de que el ID sea correcto

  // Llamada al endpoint para obtener las evaluaciones
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/calificado');
        const data = await response.json();

        console.log("All evaluations:", data); // Imprimir todas las evaluaciones para depuración

        // Filtrar las evaluaciones del usuario logueado
        const userEvaluations = data.filter(evaluation => evaluation.id_usuario === userId);
        console.log("Filtered evaluations for user:", userEvaluations); // Imprimir las evaluaciones filtradas para depuración
        
        setEvaluations(userEvaluations);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las evaluaciones:', error);
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [userId]);

  const totalProjects = 10; // Total de proyectos a evaluar
  const evaluatedCount = evaluations.length; // Número de evaluaciones realizadas
  const pendingCount = totalProjects - evaluatedCount; // Número de evaluaciones pendientes

  const data = {
    labels: ['Evaluaciones Realizadas', 'Evaluaciones Pendientes'],
    datasets: [
      {
        label: 'Cantidad de Evaluaciones',
        data: [evaluatedCount, pendingCount],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    animation: false,
    responsive: false,
  };

  if (loading) {
    return <Typography variant="h5" align="center">Cargando evaluaciones...</Typography>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <Box p={3} display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
        <Typography variant="h4" align="center" gutterBottom>
          Historial de Evaluaciones
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} style={{ padding: '20px', maxWidth: '100%' }}>
              <List>
                {evaluations.map((evaluation) => (
                  <Link 
                    to={`/evaluados/${evaluation.id_evaluacion}`} // Cambia a la ruta deseada
                    key={evaluation.id_evaluacion} 
                    style={{ textDecoration: 'none', color: 'inherit' }} // Estilos para el Link
                  >
                    <React.Fragment>
                      <ListItem>
                        <ListItemText
                          primary={`Proyecto: ${evaluation.nombre_proyecto}`} 
                          secondary={`Comentario: ${evaluation.comentario_general}`} 
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  </Link>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} style={{ padding: '20px', maxWidth: '100%', height: '400px' }}>
              <Typography variant="h5" align="center" gutterBottom>
                Gráfico de Evaluaciones
              </Typography>
              <Bar data={data} options={options} height={400} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default EvaluationHistory;
