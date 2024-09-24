import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Typography, Button, Box, TextField, Grid } from '@mui/material';
import Rating from '@mui/material/Rating';
import calificacionesData from '../datos/calificacion.json';
import productosData from '../datos/productos_finca.json';
import productosUnidadesData from '../datos/productos_unidad.json';
import fincasData from '../datos/fincas.json';
import usuariosData from '../datos/usuarios.json';

const ProductDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const fincaName = searchParams.get('finca');

    const product = productosData.productos.find(p => p.id === parseInt(id));
    const finca = fincasData.fincas.find(f => f.nombre_finca === fincaName);

    if (!product || !finca) {
        return <div>Producto o finca no encontrado</div>;
    }

    const productCalificaciones = calificacionesData.calificaciones.filter(c => c.idproducto === product.id);
    const promedioEstrellas = productCalificaciones.length > 0
        ? productCalificaciones.reduce((sum, c) => sum + c.estrellas, 0) / productCalificaciones.length
        : 0;

    const unidades = productosUnidadesData.productos_unidades.filter(u => u.id_producto === product.id);
    const [selectedUnidad, setSelectedUnidad] = useState(unidades[0]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [cantidad, setCantidad] = useState(1); // Estado para la cantidad seleccionada

    const handleUnidadChange = (unidad) => {
        setSelectedUnidad(unidad);
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (event, newValue) => {
        setNewRating(newValue);
    };

    const handleCantidadChange = (event) => {
        // Asegurarse de que la cantidad sea un número positivo
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value > 0) {
            setCantidad(value);
        } else {
            setCantidad(1); // Establecer un valor predeterminado si no es válido
        }
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const newCommentData = {
            idcliente: 1, // Este debería ser el ID del usuario autenticado
            idproducto: product.id,
            idfinca: finca.id,
            estrellas: newRating,
            comentario: newComment,
            fecha: new Date().toISOString().split('T')[0]
        };
        // Aquí debes añadir la lógica para guardar el nuevo comentario (ej. llamar a una API)
        calificacionesData.calificaciones.push(newCommentData);
        setNewComment('');
        setNewRating(0);
    };

    const getUserNameById = (userId) => {
        const user = usuariosData.usuarios.find(u => u.id === userId);
        return user ? user.nombre : 'Usuario desconocido';
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    maxHeight: '300px', // Ajusta este valor según tus necesidades
                }}
            >
                <img src={`/src/assets/${product.image}`} alt={product.nombre} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <Typography variant="h3" component="div" sx={{ marginTop: 2 }}>
                {product.nombre}
            </Typography>
            <Link to={`/farm-products?finca=${finca.nombre_finca}`}>
                <Typography variant="h6" color="text.secondary">
                    Visita la finca {finca.nombre_finca}
                </Typography>
            </Link>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <Rating value={promedioEstrellas} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 0.5 }}>
                    ({productCalificaciones.length} calificaciones)
                </Typography>
            </Box>
            <Typography variant="h4" color="text.primary" sx={{ marginTop: 2 }}>
                ${(selectedUnidad.peso * product.precio).toFixed(2)}
                <Typography variant="body2" color="text.secondary" component="span" sx={{ marginLeft: 1 }}>
                    (${product.precio.toFixed(2)} / {selectedUnidad.unidad_medida})
                </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2 }}>
                Disponibles: {product.cantidad_disponible} {selectedUnidad.unidad_medida}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                {unidades.map((unidad, index) => (
                    <Button key={index} onClick={() => handleUnidadChange(unidad)}>
                        {unidad.peso} {unidad.unidad_medida}
                    </Button>
                ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4, width: '100%' }}>
                <TextField
                    label="Cantidad"
                    type="number"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
                    Add to cart ({cantidad})
                </Button>
                <Button variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
                    Comprar ahora ({cantidad})
                </Button>
            </Box>
            <section className="comments-section" style={{ width: '100%', marginTop: '20px' }}>
                <h2>Comentarios</h2>
                {calificacionesData.calificaciones
                    .filter(c => c.idproducto === product.id)
                    .map((calificacion, index) => (
                        <Box key={index} sx={{ borderBottom: '1px solid #ddd', padding: 2, width: '100%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={2}>
                                    <img
                                        src={`/src/assets/${usuariosData.usuarios.find(u => u.id === calificacion.idcliente).foto_perfil}`}
                                        alt="Perfil"
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <Typography variant="h6">{getUserNameById(calificacion.idcliente)}</Typography>
                                    <Rating value={calificacion.estrellas} readOnly />
                                    <Typography variant="body1">{calificacion.comentario}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {calificacion.fecha}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                <Box component="form" onSubmit={handleCommentSubmit} sx={{ marginTop: 4, width: '100%' }}>
                    <Typography variant="h6">Añadir un comentario</Typography>
                    <Rating
                        name="new-rating"
                        value={newRating}
                        onChange={handleRatingChange}
                    />
                    <TextField
                        label="Comentario"
                        multiline
                        rows={4}
                        fullWidth
                        value={newComment}
                        onChange={handleCommentChange}
                        sx={{ marginY: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Enviar
                    </Button>
                </Box>
            </section>
        </Box>
    );
};

export default ProductDetail;
