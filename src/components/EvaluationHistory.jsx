import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion'; // Importar para animaciones

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EvaluationHistory = () => {
  const [evaluations] = useState([
    { id: 1, projectName: 'Proyecto Alpha', rating: 4.5, comment: 'Excelente trabajo, muy bien organizado.' },
    { id: 2, projectName: 'Proyecto Beta', rating: 3.0, comment: 'Falta un poco de documentación y pruebas.' },
    { id: 3, projectName: 'Proyecto Gamma', rating: 5.0, comment: 'Increíble! Superó todas las expectativas.' },
    { id: 4, projectName: 'Proyecto Delta', rating: 2.5, comment: 'No cumple con los requisitos mínimos.' },
  ]);

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
    animation: false, // Desactivar la animación
    responsive: false, // Hacer el gráfico de un tamaño fijo
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} // Iniciar con opacidad 0 y ligeramente arriba
      animate={{ opacity: 1, y: 0 }} // Finalizar con opacidad 1 y en su posición
      transition={{ duration: 0.5 }} // Duración de la transición
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
                  <React.Fragment key={evaluation.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Proyecto: ${evaluation.projectName}`}
                        secondary={`Calificación: ${evaluation.rating} - Comentario: ${evaluation.comment}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
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
