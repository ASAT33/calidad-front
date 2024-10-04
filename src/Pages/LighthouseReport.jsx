import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';

// Componente para los indicadores circulares de puntajes
const ScoreIndicator = ({ label, score }) => {
  let color;
  
  if (score >= 90) {
    color = green[500];  
  } else if (score >= 50) {
    color = orange[500]; 
  } else {
    color = red[500];   
  }

  return (
    <Box textAlign="center" mb={2}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={80}       
        thickness={5}  
        style={{ color }} 
      />
      <Typography variant="h6">{score !== null ? score : 'N/A'}</Typography>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

// Función para generar sugerencias basadas en las puntuaciones
const generateSuggestions = (category, score) => {
  if (category === 'performance') {
    if (score >= 90) {
      return '¡Excelente! Tu sitio web se carga rápidamente y proporciona una gran experiencia al usuario.';
    } else if (score >= 50) {
      return 'Tu sitio se carga a un ritmo razonable, pero podría ser más rápido. Considera reducir el tamaño de las imágenes o evitar cargar scripts innecesarios.';
    } else {
      return 'Tu sitio tarda demasiado en cargar. Te recomendamos que revises los elementos que podrían estar ralentizando la carga, como imágenes grandes o demasiados scripts.';
    }
  }

  // Sugerencias para la categoría de accesibilidad
  if (category === 'accessibility') {
    if (score >= 90) {
      return 'Muy bien. Tu sitio es accesible para la mayoría de los usuarios, incluyendo aquellos con discapacidades.';
    } else if (score >= 50) {
      return 'Tu sitio es accesible, pero hay algunas áreas que podrían mejorarse para ayudar a más usuarios a navegar fácilmente.';
    } else {
      return 'Es importante que todos los usuarios puedan acceder a tu sitio. Considera mejorar la accesibilidad para que sea más fácil de usar para todos.';
    }
  }

  // Sugerencias para la categoría de mejores prácticas
  if (category === 'best-practices') {
    if (score >= 90) {
      return 'Estás siguiendo las mejores prácticas para el desarrollo web. ¡Sigue así!';
    } else if (score >= 50) {
      return 'Cumples con algunas mejores prácticas, pero hay oportunidades para mejorar la seguridad y la experiencia del usuario.';
    } else {
      return 'Revisa las mejores prácticas recomendadas para el desarrollo web. Mejorar esto puede ayudar a que tu sitio sea más seguro y eficiente.';
    }
  }

  // Sugerencias para la categoría de SEO
  if (category === 'seo') {
    if (score >= 90) {
      return 'Tu sitio está muy bien optimizado para los motores de búsqueda. ¡Sigue trabajando en ello!';
    } else if (score >= 50) {
      return 'Tu sitio tiene un SEO aceptable, pero hay algunas cosas que podrías mejorar para atraer más visitantes.';
    } else {
      return 'Tu sitio necesita mejorar en SEO. Considera optimizar el contenido y asegurarte de que sea fácil de encontrar en los motores de búsqueda.';
    }
  }

  return 'No hay sugerencias disponibles para esta categoría.';
};

const LighthouseReport = ({ evaluationId }) => {
  const [linkExecutable, setLinkExecutable] = useState('');
  const [loading, setLoading] = useState(true);
  const [lighthouseData, setLighthouseData] = useState(null);
  const [lighthouseLoading, setLighthouseLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = ''; // Clave API para acceder a los servicios de Google

  // Fetch del enlace ejecutable basado en el evaluationId
  useEffect(() => {
    const fetchLinkExecutable = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/evaluaciones/comentario/${evaluationId}`);
        const data = await response.json();

        // Verifica si hay un enlace ejecutable en los datos recibidos
        if (data && data.link_or_executable) {
          setLinkExecutable(data.link_or_executable);
        } else {
          setLinkExecutable('Sin enlace ejecutable disponible');
        }
      } catch (error) {
        console.error('Error al cargar el enlace ejecutable:', error);
        setLinkExecutable('Error al cargar el enlace ejecutable.');
      } finally {
        setLoading(false); // Cambia el estado de carga a false después de la fetch
      }
    };

    fetchLinkExecutable();
  }, [evaluationId]);

  // Evaluación con Lighthouse
  const evaluateWithLighthouse = async () => {
    // Verifica que haya un enlace ejecutable para evaluar
    if (!linkExecutable || linkExecutable === 'Sin enlace ejecutable disponible') {
      setError('No hay enlace ejecutable para evaluar.');
      return;
    }

    setLighthouseLoading(true); // Comienza la carga de Lighthouse
    setError(''); // Limpia cualquier error previo

    try {
      // Define las categorías específicas que deseas incluir en la evaluación
      const categories = ['performance', 'accessibility', 'seo', 'best-practices'];
      const categoryParams = categories.map(cat => `category=${cat}`).join('&');

      // Construye la URL con las categorías incluidas
      const response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(linkExecutable)}&key=${apiKey}&${categoryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener datos de Lighthouse: ' + response.statusText);
      }

      const data = await response.json();
      setLighthouseData(data); // Guarda los datos de Lighthouse
      console.log('Datos de Lighthouse:', data); // Muestra los datos recibidos en la consola
    } catch (error) {
      console.error('Error al evaluar con Lighthouse:', error);
      setError('Error al evaluar con Lighthouse.'); // Manejo de errores
    } finally {
      setLighthouseLoading(false); // Finaliza la carga de Lighthouse
    }
  };

  useEffect(() => {
    // Inicia la evaluación con Lighthouse si hay un enlace ejecutable
    if (linkExecutable && linkExecutable !== 'Sin enlace ejecutable disponible') {
      evaluateWithLighthouse();
    }
  }, [linkExecutable]);

  // Mensaje de carga mientras se obtiene el enlace ejecutable
  if (loading) {
    return <Typography variant="h6" align="center">Cargando enlace ejecutable...</Typography>;
  }

  // Mensaje de carga mientras se evalúa con Lighthouse
  if (lighthouseLoading) {
    return <Typography variant="h6" align="center">Evaluando con Lighthouse...</Typography>;
  }

  // Función para obtener el puntaje de una categoría específica
  const getScore = (category) => {
    const categoryData = lighthouseData?.lighthouseResult?.categories?.[category];
    return categoryData ? Math.round(categoryData.score * 100) : null;
  };

  return (
    <Box p={3}>
      <Card style={{ padding: '0px' }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Resultados de Lighthouse</Typography>

          <Typography variant="h6" align="center" gutterBottom>Enlace Ejecutable</Typography>
          <Typography variant="body1" align="center">
            <a href={linkExecutable} target="_blank" rel="noopener noreferrer">
              {linkExecutable}
            </a>
          </Typography>

          {lighthouseData && (
            <>
              <Grid container spacing={3} justifyContent="center" mt={4}>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator label="Rendimiento" score={getScore('performance')} />
                  <Typography variant="body2">{generateSuggestions('performance', getScore('performance'))}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator label="Accesibilidad" score={getScore('accessibility')} />
                  <Typography variant="body2">{generateSuggestions('accessibility', getScore('accessibility'))}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator label="Prácticas recomendadas" score={getScore('best-practices')} />
                  <Typography variant="body2">{generateSuggestions('best-practices', getScore('best-practices'))}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator label="Optimización para Motores de Búsqueda" score={getScore('seo')} />
                  <Typography variant="body2">{generateSuggestions('seo', getScore('seo'))}</Typography>
                </Grid>
              </Grid>

              {/* Detalles de rendimiento representados en círculos */}
              <Typography variant="h6" color="primary" gutterBottom mt={4}>Métricas de Rendimiento</Typography>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={3}>
                <ScoreIndicator label="Primera Pintura de Contenido (FCP)" score={parseFloat(lighthouseData.lighthouseResult.audits['first-contentful-paint'].displayValue) * 100} />
                  <Typography variant="body2">FCP mide el tiempo hasta que aparece el primer contenido visual en la página.</Typography>
                  </Grid>
                <Grid item xs={6} sm={3}>
                <ScoreIndicator label="La Mayor Pintura de Contenido (LCP)" score={parseFloat(lighthouseData.lighthouseResult.audits['largest-contentful-paint'].displayValue) * 100} />
                  <Typography variant="body2">LCP mide el tiempo hasta que aparece el elemento de contenido más grande visible en la ventana del navegador.</Typography>
                        </Grid>
                {/* Otras métricas de rendimiento que podrían ser descomentadas */}
                {/* <Grid item xs={6} sm={3}>
                  <ScoreIndicator label="Total Blocking Time" score={parseFloat(lighthouseData.lighthouseResult.audits['total-blocking-time'].displayValue)} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator label="Cumulative Layout Shift" score={parseFloat(lighthouseData.lighthouseResult.audits['cumulative-layout-shift'].displayValue) * 100} />
                </Grid> */}
              </Grid>
            </>
          )}

          {error && <Typography color="error" align="center">{error}</Typography>} {/* Mensaje de error si ocurre */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LighthouseReport;
