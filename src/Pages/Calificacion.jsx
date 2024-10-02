import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Divider, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { motion } from 'framer-motion'; // Importar motion
import ComentarioGeneral from '../components/ComentarioGeneral';

const Calificacion = () => {
  const { id } = useParams(); 
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCalificaciones, setFilteredCalificaciones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categoryTranslations = {
    functionality: 'Funcionalidad',
    reliability: 'Fiabilidad',
    compatibility: 'Compatibilidad',
    usability: 'Usabilidad',
    fiability: 'Fiabilidad',
    security: 'Seguridad',
    maintainability: 'Mantenibilidad',
    portability: 'Portabilidad',
  };

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/evaluaciones/${id}`); 
        const data = await response.json();

        setCalificaciones(data);
        setFilteredCalificaciones(data); 

        // Extraer categorías únicas
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las calificaciones:', error);
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, [id]);

  // Manejar el cambio de categoría
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    // Filtrar calificaciones según la categoría seleccionada
    if (category) {
      const filtered = calificaciones.filter(item => item.category === category);
      setFilteredCalificaciones(filtered);
    } else {
      setFilteredCalificaciones(calificaciones); 
    }
  };

  if (loading) {
    return <Typography variant="h5" align="center">Cargando calificaciones...</Typography>;
  }

  return (
    <Box p={8} display="flex" justifyContent="center">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
          >
            <Card style={{ minWidth: 300, maxWidth: 600, width: '100%' }}>
              <CardContent>
                <Typography variant="h4" align="center" gutterBottom>
                  Calificaciones de Evaluación
                </Typography>

                {/* Filtro por categoría */}
                <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
                  <InputLabel id="category-select-label">Filtrar por Categoría</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    label="Filtrar por Categoría"
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {categoryTranslations[category]} 
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <List>
                  {filteredCalificaciones.map((item) => (
                    <React.Fragment key={item.answer_id}>
                      <ListItem>
                        <ListItemText
                          primary={item.question_text} 
                          secondary={`Calificación: ${item.calificacion}, Comentario: ${item.comentario_categoria}`} 
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Componente de Comentario General */}
        <Grid item xs={12} sm={6}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
          >
            <ComentarioGeneral evaluationId={id} /> 
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calificacion;
