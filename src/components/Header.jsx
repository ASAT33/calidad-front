// src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo2.png";
import LocationFilterModal from "./LocationFilterModal"; // Importar el componente
import "./Header.css";
import { logout } from "../utils/auth";
import AuthModal from "./newLogin";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const navItems = [
  { label: "Evaluar", path: "/gestionfinca" },
  { label: "Norma ISO/IEC 25010", href: "https://iso25000.com/index.php/normas-iso-25000/iso-25010" },
  { label: "Ayuda", path: "/" },
  { label: "Idioma", path: "/" }, // Updated
  { label: "Certificaciones", path: "/" },
  // { label: "Más Vendidos", path: "/top-selling" },
];

function Header({ onLocationChange }) {
  const [opens, setModalLoginOpen] = useState(false);
  const handleOpen = () => setModalLoginOpen(true);
  const handleCloses = () => setModalLoginOpen(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    displayName: "",
    details: "",
  });
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocationClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleLocationSave = (location) => {
    const newLocation = {
      displayName: location.display_name,
      details: `${location.address.city || location.address.town || location.address.village}, ${location.address.state || location.address.region}`,
      lat: location.lat,
      lon: location.lon,
    };
    setCurrentLocation(newLocation);
    onLocationChange(newLocation);
    handleModalClose();
  };

  const handleLogout = () => {
    logout(navigate);
  };

  // Language options
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    // Add more languages as needed
  ];

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (language) => {
    console.log("Language selected:", language); // Replace with your language change logic
    handleLanguageMenuClose();
  };

  return (
    <Box sx={{ display: "flex", padding: "0px" }}>
      <CssBaseline />
      <AppBar style={{ background: "#5d6d7e", padding: "0px" }} position="absolute" open={open}>
        <Toolbar>
          <MenuIcon
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          />
          <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 2 }}>
            <img
              className="logo"
              src={logo}
              onClick={() => handleNavigation("/")}
              alt="logo"
            />
          </Typography>

          {navItems.map((item) => (
            item.href ? (
              <Button
                key={item.label}
                sx={{ color: "#fff" }}
                onClick={() => window.open(item.href, "_blank")}
              >
                {item.label}
              </Button>
            ) : item.label === "Idioma" ? (
              <Button
                key={item.label}
                sx={{ color: "#fff" }}
                onClick={handleLanguageMenuOpen}
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                sx={{ color: "#fff" }}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </Button>
            )
          ))}

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleOpen(); handleClose(); }}>
              Login
            </MenuItem>
            <AuthModal open={opens} handleClose={handleCloses} />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          {/* Language Menu */}
          <Menu
            anchorEl={languageMenuAnchor}
            open={Boolean(languageMenuAnchor)}
            onClose={handleLanguageMenuClose}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} onClick={() => handleLanguageChange(lang)}>
                {lang.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <MuiDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <div className="divlogo">
            <img src={logo} className="logo" alt="logo" />
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <div className="menu-item">
          <Link to="/perfil" className="sidebar-links">
            <i className="icon user-icon"></i>
            Perfil
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/" className="sidebar-links">
            <i className="icon home-icon"></i>
            Inicio
          </Link>
        </div>
        <div className="menu-item">
          <i className="icon favorites-icon"></i>
          <span>Favoritos</span>
        </div>
        <div className="menu-item">
          <i className="icon orders-icon"></i>
          <span>Ordenes</span>
        </div>
        <div className="menu-item">
          <i className="icon notifications-icon"></i>
          <span>Notificaciones</span>
        </div>
      </MuiDrawer>
      <Main style={{ padding: "0px" }} open={open}>
        <DrawerHeader />
        <Typography paragraph>{/* Content goes here */}</Typography>
      </Main>
      <LocationFilterModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleLocationSave}
      />
    </Box>
  );
}

export default Header;
