import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './newlogin.css';

const AuthModal = ({ open, handleClose }) => {
    const [tab, setTab] = useState(0);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'evaluator', 
    });

    const navigate = useNavigate();

    
    useEffect(() => {
        if (open) {
            setTab(0); 
            setLoginData({ email: '', password: '' }); 
            setRegisterData({ name: '', email: '', password: '', role: 'evaluator' }); 
        }
    }, [open]);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleRoleChange = (e) => {
        setRegisterData({ ...registerData, role: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/users/login', loginData);
            const { token, user } = response.data;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', user.role);
            sessionStorage.setItem('user_id', user.id);
            console.log("Login exitoso:", user.id);

            handleClose();
            navigate('/'); 
        } catch (error) {
            console.error('Error al iniciar sesión!', error);
            alert('Error al iniciar sesión: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/users/register', registerData);

            
            console.log("Registro exitoso:", response.data.message);

         
            setRegisterData({ name: '', email: '', password: '', role: 'evaluator' });
            handleClose();
            navigate('/'); 
        } catch (error) {
            console.error('Error al registrar el usuario!', error);
            alert('Error al registrar el usuario: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="auth tabs">
                    <Tab label="Iniciar Sesión" />
                    <Tab label="Crear Cuenta" />
                </Tabs>

                {/* Iniciar Sesión */}
                {tab === 0 && (
                    <Box p={3}>
                        <Typography variant="h4" gutterBottom>
                            Iniciar Sesión
                        </Typography>
                        <form onSubmit={handleLoginSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        type="email"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contraseña"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        type="password"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>
                                        Iniciar Sesión
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                )}

                {/* Crear Cuenta */}
                {tab === 1 && (
                    <Box p={3}>
                        <Typography variant="h4" gutterBottom>
                            Registro
                        </Typography>
                        <form onSubmit={handleRegisterSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Correo"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        type="email"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contraseña"
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        type="password"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Rol</FormLabel>
                                        <RadioGroup row value={registerData.role} onChange={handleRoleChange}>
                                            <FormControlLabel value="evaluator" control={<Radio />} label="Evaluador" />
                                            <FormControlLabel value="user" control={<Radio />} label="Usuario" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>
                                        Crear Cuenta
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default AuthModal;
