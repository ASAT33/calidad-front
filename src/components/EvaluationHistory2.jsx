import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EvaluationHistory2 = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = useMemo(() => parseInt(sessionStorage.getItem('user_id'), 10), []);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/calificado');
        const data = await response.json();

        const userEvaluations = data.filter(evaluation => evaluation.id_evaluador === userId);
        
        setEvaluations(userEvaluations);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las evaluaciones:', error);
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [userId]);

  const evaluatedCount = evaluations.length;
  const totalProjects = 10;
  const pendingCount = useMemo(() => totalProjects - evaluatedCount, [evaluatedCount]);

  const data = useMemo(() => ({
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
  }), [evaluatedCount, pendingCount]);

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
                    to={`/historial/${evaluation.id_evaluacion}`} 
                    key={evaluation.id_evaluacion} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={`Proyecto: ${evaluation.nombre_proyecto}`} 
                        secondary={`Comentario: ${evaluation.comentario_general}`} 
                      />
                    </ListItem>
                    <Divider />
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

export default EvaluationHistory2;
