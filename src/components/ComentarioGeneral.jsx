import React, { useEffect, useState } from 'react';
import { Box, Typography, Card } from '@mui/material';

const ComentarioGeneral = ({ evaluationId }) => {
  const [comentarioGeneral, setComentarioGeneral] = useState('');
  const [analisisIA, setAnalisisIA] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComentarioGeneral = async () => {
      console.log("ID de evaluación en ComentarioGeneral:", evaluationId); 

      try {
        const response = await fetch(`http://localhost:5000/api/evaluaciones/comentario/${evaluationId}`); 
        const data = await response.json();
        if (data) {
          setComentarioGeneral(data.comentario_general || 'Sin comentario disponible');
          setAnalisisIA(data.IA || 'Sin análisis de IA disponible'); 
        } else {
          setComentarioGeneral('Sin comentario disponible');
          setAnalisisIA('Sin análisis de IA disponible');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el comentario general:', error);
        setComentarioGeneral('Error al cargar el comentario general.');
        setAnalisisIA('Error al cargar el análisis de IA.');
        setLoading(false);
      }
    };

    fetchComentarioGeneral();
  }, [evaluationId]);

  if (loading) {
    return <Typography variant="h6" align="center">Cargando comentario general...</Typography>;
  }

  return (
    <Box p={2}>
      <Card style={{ padding: '20px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Comentario General
        </Typography>
        <Typography variant="body1" align="center">
          {comentarioGeneral} 
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          Análisis de la IA
        </Typography>
        <Typography variant="body1" align="center">
          {analisisIA} 
        </Typography>
      </Card>
    </Box>
  );
};

export default ComentarioGeneral;
