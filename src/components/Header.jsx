import React, { useState, useEffect } from "react";
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
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";
import logo from "../assets/logo2.png";
import "./Header.css";
import { logout } from "../utils/auth"; // Assuming you have a logout utility function
import AuthModal from "./newLogin"; // Your AuthModal component

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

// Define the navigation items based on roles
const navItems = {
  evaluator: [
    { label: "Evaluar", path: "/evaluar" },
    { label: "Historial de evalauciones", path: "/historial" },
  ],
  user: [
    { label: "Subir Proyecto", path: "/enviar" },
    { label: "Evaluados", path: "/evaluados" },
  ],
  common: [
    { label: "Inicio", path: "/" },
    //{ label: "Norma ISO25010", href: "https://iso25000.com/index.php/normas-iso-25000/iso-25010" },
  ],
};

function Header() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Modal for login
  const [isAuthenticated, setIsAuthenticated] = useState(false); // To track login status
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('role'); // Get user role from sessionStorage

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token); // Check if the user is authenticated
  }, []);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(navigate); // Perform the logout function
    setIsAuthenticated(false); // Update state
    handleClose(); // Close the menu
  };

  const handleLoginClick = () => {
    setModalOpen(true); // Open the login modal
    handleClose(); // Close the menu
  };

  const handleModalClose = () => {
    setModalOpen(false);
    // Check again if the user is logged in after the modal is closed
    const token = sessionStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  };

  return (
    <Box sx={{ display: "flex", padding: "0px" }}>
      <CssBaseline />
      <AppBar style={{ background: "#5d6d7e", padding: "0px" }} position="absolute" open={open}>
        <Toolbar>
          <MenuIcon
            className="menu-icon"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          />
          <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 2 }}>
            <img className="logo" src={logo} onClick={() => navigate("/")} alt="logo" />
          </Typography>

          {/* Render common nav items for all users */}
          {navItems.common.map((item) => (
            <Button
              className="header-button"
              key={item.label}
              sx={{ color: "#fff" }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}

          {/* Render role-specific nav items only if authenticated */}
          {isAuthenticated && (
            <>
              {(userRole === "evaluator" ? navItems.evaluator : navItems.user).map((item) => (
                <Button
                  className="header-button"
                  key={item.label}
                  sx={{ color: "#fff" }}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </>
          )}

          <IconButton
            className="profile-icon"
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
            className="menu-appbar"
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
            {!isAuthenticated ? (
              <MenuItem onClick={handleLoginClick}>Login</MenuItem>
            ) : (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            )}
          </Menu>
          <AuthModal open={modalOpen} handleClose={handleModalClose} />
        </Toolbar>
      </AppBar>
      <MuiDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f8f9fa",
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
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* Add drawer navigation items based on authentication */}
        <div className="menu-item">
          <Link to="/perfil" className="sidebar-links">
            <PersonIcon className="icon" />
            Perfil
          </Link>
        </div>
        {isAuthenticated && (
          <>
            {/* Render role-specific items in the drawer */}
            {(userRole === "evaluator" ? navItems.evaluator : navItems.user).map((item) => (
              <div className="menu-item" key={item.label}>
                <Link to={item.path} className="sidebar-links">
                  <AssessmentIcon className="icon" />
                  {item.label}
                </Link>
              </div>
            ))}
          </>
        )}
        <div className="menu-item">
          <Link to="/" className="sidebar-links">
            <HomeIcon className="icon" />
            Inicio
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/Iso" className="sidebar-links">
            <DescriptionIcon className="icon" />
            Norma ISO25010
          </Link>
        </div>
        <Divider />
      </MuiDrawer>
      <Main style={{ padding: "0px" }} open={open}>
        <DrawerHeader />
        <Typography paragraph>{/* Content goes here */}</Typography>
      </Main>
    </Box>
  );
}

export default Header;
