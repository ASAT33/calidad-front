//LocationFilterModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Slider, List, ListItem, ListItemText } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import fincasData from '../datos/fincas.json'; // Importar datos de fincas
import axios from 'axios';

const LocationFilterModal = ({ open, onClose, onSave }) => {
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(65);
    const [results, setResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (location.length > 2) {
            const fetchLocations = async () => {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                    params: {
                        q: location,
                        format: 'json',
                        addressdetails: 1,
                        limit: 5
                    }
                });
                setResults(response.data);
            };
            fetchLocations();
        }
    }, [location]);

    const handleRadiusChange = (event, newValue) => {
        setRadius(newValue);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setLocation(location.display_name);
        setResults([]);
    };

    const handleSave = () => {
        if (selectedLocation) {
            onSave(selectedLocation);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ width: 400, padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '10%', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Cambiar ubicación
                </Typography>
                <TextField
                    label="Buscar por ciudad, localidad o código postal"
                    fullWidth
                    value={location}
                    onChange={handleLocationChange}
                    margin="normal"
                />
                {results.length > 0 && (
                    <List>
                        {results.map((result) => (
                            <ListItem button key={result.place_id} onClick={() => handleSelectLocation(result)}>
                                <ListItemText primary={result.display_name} />
                            </ListItem>
                        ))}
                    </List>
                )}
                <Typography gutterBottom>Ubicación</Typography>
                <Typography variant="body1">{location}</Typography>
                <Typography gutterBottom>Radio</Typography>
                <Slider value={radius} onChange={handleRadiusChange} aria-labelledby="input-slider" max={100} min={1} />
                <Typography variant="body2">{radius} kilómetros</Typography>
                <Box sx={{ height: 200, marginTop: 2 }}>
                    <MapContainer center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : [9.0, -79.5]} zoom={10} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {selectedLocation && (
                            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                <Popup>{location}</Popup>
                            </Marker>
                        )}
                        {fincasData.fincas.map((finca) => (
                            <Marker key={finca.id} position={[finca.ubicacion.lat, finca.ubicacion.lon]}>
                                <Popup>{finca.nombre_finca}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default LocationFilterModal;