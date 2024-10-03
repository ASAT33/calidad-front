import React, { useEffect, useState } from 'react';
import { Box, Typography, Card } from '@mui/material';

const LighthouseReport = ({ evaluationId }) => {
  const [linkExecutable, setLinkExecutable] = useState('');
  const [loading, setLoading] = useState(true);
  const [lighthouseData, setLighthouseData] = useState(null);
  const [lighthouseLoading, setLighthouseLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = ''; // Reemplaza esto con tu API key o usa import.meta.env.VITE_GOOGLE_LIGHTHOUSE_API_KEY

  // Fetch del enlace ejecutable basado en el evaluationId
  useEffect(() => {
    const fetchLinkExecutable = async () => {
      console.log("ID de evaluación en LinkExecutable:", evaluationId);

      try {
        const response = await fetch(`http://localhost:5000/api/evaluaciones/comentario/${evaluationId}`);
        const data = await response.json();

        if (data && data.link_or_executable) {
          setLinkExecutable(data.link_or_executable);
        } else {
          setLinkExecutable('Sin enlace ejecutable disponible');
        }
      } catch (error) {
        console.error('Error al cargar el enlace ejecutable:', error);
        setLinkExecutable('Error al cargar el enlace ejecutable.');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkExecutable();
  }, [evaluationId]);

  // Evaluación con Lighthouse
  const evaluateWithLighthouse = async () => {
    if (!linkExecutable || linkExecutable === 'Sin enlace ejecutable disponible') {
      setError('No hay enlace ejecutable para evaluar.');
      return;
    }

    setLighthouseLoading(true);
    setError('');

    try {
      const response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(linkExecutable)}&key=${apiKey}`);
      
      // Comprobar si la respuesta es OK
      if (!response.ok) {
        throw new Error('Error al obtener datos de Lighthouse: ' + response.statusText);
      }

      const data = await response.json();
      setLighthouseData(data);
    } catch (error) {
      console.error('Error al evaluar con Lighthouse:', error);
      setError('Error al evaluar con Lighthouse.');
    } finally {
      setLighthouseLoading(false);
    }
  };

  // Evaluar con Lighthouse cuando el enlace ejecutable se haya obtenido
  useEffect(() => {
    if (linkExecutable && linkExecutable !== 'Sin enlace ejecutable disponible') {
      evaluateWithLighthouse();
    }
  }, [linkExecutable]);

  if (loading) {
    return <Typography variant="h6" align="center">Cargando enlace ejecutable...</Typography>;
  }

  if (lighthouseLoading) {
    return <Typography variant="h6" align="center">Evaluando con Lighthouse...</Typography>;
  }

  return (
    <Box p={1}>
      <Card style={{ padding: '20px', width: '1200px', height: 'auto' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Enlace Ejecutable
        </Typography>
        <Typography variant="body1" align="center">
          <a href={linkExecutable} target="_blank" rel="noopener noreferrer">
            {linkExecutable}
          </a>
        </Typography>

        {lighthouseData && (
          <Box mt={3}>
            <Typography variant="h6" align="center">Resultados de Lighthouse</Typography>
            <pre>{JSON.stringify(lighthouseData, null, 2)}</pre>
          </Box>
        )}

        {error && (
          <Typography color="error" align="center">{error}</Typography>
        )}
      </Card>
    </Box>
  );
};

export default LighthouseReport;
