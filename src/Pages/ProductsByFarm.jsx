// src/Pages/ProductsByFarm.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, Box, Grid } from '@mui/material';
import Rating from '@mui/material/Rating';
import './ProductsByFarm.css';

const ProductsByFarm = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const fincaName = searchParams.get('finca');
    const categoriaSeleccionada = searchParams.get('category');
    const page = searchParams.get('page');
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState(categoriaSeleccionada || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [finca, setFinca] = useState(null);
    const [farmProducts, setFarmProducts] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        // Obtener finca por nombre
        axios.get(`/api/fincas?nombre=${fincaName}`)
            .then(response => setFinca(response.data))
            .catch(error => console.error(error));

        // Obtener productos de la finca
        axios.get(`/api/productos?finca=${fincaName}`)
            .then(response => setFarmProducts(response.data))
            .catch(error => console.error(error));

        // Obtener calificaciones
        axios.get(`/api/calificaciones?finca=${fincaName}`)
            .then(response => setCalificaciones(response.data))
            .catch(error => console.error(error));

        // Obtener usuarios
        axios.get(`/api/usuarios`)
            .then(response => setUsuarios(response.data))
            .catch(error => console.error(error));
    }, [fincaName]);

    if (!finca) {
        return <div>Finca no encontrada</div>;
    }

    const calcularPrecioMaximo = (productId, precioUnitario) => {
        const unidades = productosUnidadesData.productos_unidades.filter(u => u.id_producto === productId);
        const maxPeso = unidades.reduce((max, unidad) => Math.max(max, unidad.peso), 0);
        const unidadMedida = unidades.length > 0 ? unidades[0].unidad_medida : '';
        return {
            precioTotal: maxPeso * precioUnitario,
            precioPorUnidad: precioUnitario,
            unidadMedida: unidadMedida
        };
    };

    const categoryNames = {
        "1": "Frutas de Temporadas",
        "2": "Granos y Leguminosas",
        "3": "Vegetales y hortalizas",
        "4": "Productos de Exportación"
    };

    const uniqueCategories = new Set(farmProducts.map(product => product.categoria));

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        navigate(`?finca=${finca.nombre_finca}&category=${category}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = farmProducts.filter(product => {
        return (
            (selectedCategory ? product.categoria === selectedCategory : true) &&
            (searchTerm ? product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : true)
        );
    });

    const ventas = productosVentasData.productos_ventas;
    const productoVentasCount = ventas.reduce((acc, venta) => {
        if (farmProducts.some(product => product.id === venta.id_producto)) {
            acc[venta.id_producto] = (acc[venta.id_producto] || 0) + 1;
        }
        return acc;
    }, {});

    const topSellingProducts = [...farmProducts]
        .filter(product => productoVentasCount[product.id] > 0)
        .sort((a, b) => (productoVentasCount[b.id] || 0) - (productoVentasCount[a.id] || 0));

    const getUserNameById = (userId) => {
        const user = usuarios.find(u => u.id === userId);
        return user ? user.nombre : 'Usuario desconocido';
    };

    return (
        <div className="products-by-farm">
            <header className="farm-header">
                <img src={`/src/assets/${finca.banner}`} alt="Banner de la finca" className="farm-banner" />
                <div className="search-profile">
                    <input
                        type="text"
                        placeholder={`Buscar en todos los ${finca.nombre_finca}`}
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <img src={`/src/assets/${finca.foto_perfil}`} alt="Perfil" className="profile-image" />
                </div>
                <h1>{finca.nombre_finca}</h1>
                <p>{finca.Descripcion}</p>
                <div className="categories">
                    <Link to={`?finca=${finca.nombre_finca}`} onClick={() => setSelectedCategory(null)}>Home</Link>
                    <Link to={`?finca=${finca.nombre_finca}&page=about`}>About Us</Link>
                    {[...uniqueCategories].map((category) => (
                        <Link key={category} onClick={() => handleCategoryClick(category)} to={`?finca=${finca.nombre_finca}&category=${category}`}>
                            {categoryNames[category]}
                        </Link>
                    ))}
                </div>
            </header>
            {page === "about" ? (
                <section className="about-us">
                    <h2>About Us</h2>
                    <p>Welcome to {finca.nombre_finca}! We are dedicated to providing the best agricultural products. Our farm is located in {finca.location} and we specialize in {finca.specialties}. Thank you for visiting our page.</p>
                </section>
            ) : (
                <>
                    {!selectedCategory && (
                        <section className="products-carousel">
                            <h2>Los más vendidos de {finca.nombre_finca}</h2>
                            <div className="carousel">
                                {topSellingProducts.map((product, index) => (
                                    <Link to={`/product/${product.id}?finca=${finca.nombre_finca}`} key={index} className="carousel-item">
                                        <img src={`/src/assets/${product.image}`} alt={product.nombre} className="carousel-image" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    <section className="products">
                        <h2>{selectedCategory ? `Productos de ${categoryNames[selectedCategory]}` : 'Todos los productos'}</h2>
                        {filteredProducts.map((product, index) => {
                            const { precioTotal, precioPorUnidad, unidadMedida } = calcularPrecioMaximo(product.id, product.precio);
                            return (
                                <Link to={`/product/${product.id}?finca=${finca.nombre_finca}`} key={index} className="product-link">
                                    <div className="product">
                                        <img src={`/src/assets/${product.image}`} alt={product.nombre} />
                                        <div className="product-info">
                                            <h2>{product.nombre}</h2>
                                            <Typography variant="h4" color="text.primary" sx={{ marginTop: 1 }}>
                                                ${precioTotal.toFixed(2)}
                                                <Typography variant="body2" color="text.secondary" component="span" sx={{ marginLeft: 1 }}>
                                                    (${precioPorUnidad.toFixed(2)} / {unidadMedida})
                                                </Typography>
                                            </Typography>
                                            {/* Aquí podrías mostrar más detalles del producto si es necesario */}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </section>
                    <section className="comments-section">
                        <h2>Comentarios</h2>
                        {calificaciones
                            .map((calificacion, index) => (
                                <Box key={index} sx={{ borderBottom: '1px solid #ddd', padding: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={2}>
                                            <img
                                                src={`/src/assets/${usuarios.find(u => u.id === calificacion.idcliente).foto_perfil}`}
                                                alt="Perfil"
                                                style={{ width: '100%', borderRadius: '50%' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={10}>
                                            <Typography variant="h6">{getUserNameById(calificacion.idcliente)}</Typography>
                                            <Rating value={calificacion.estrellas} readOnly />
                                            <Typography variant="body1">{calificacion.comentario}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {new Date(calificacion.fecha).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                    </section>
                </>
            )}
        </div>
    );
};

export default ProductsByFarm;