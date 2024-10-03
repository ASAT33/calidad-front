// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import Perfil from "./Pages/Perfil";
import PageEvaluator from "./Pages/PageEvaluator";
import EvaluationForm from "./Pages/EvaluationForm";
import PrivateRoute from "./Pages/PrivateRoutes";
import SubmitProject from "./components/SubmitProject";
import EvaluationHistory from "./components/EvaluationHistory";
import EvaluationHistory2 from "./components/EvaluationHistory2";
import Calificacion2 from "./Pages/Calificacion2"
import Calificacion from "./Pages/Calificacion"


function App() {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleLocationChange = (location) => {
      setSelectedLocation(location);
    };

  return (
    <>
      <BrowserRouter>
        
          <Header onLocationChange={handleLocationChange} />

        <Routes>
          <Route path="/" element={<Home />}></Route>
         { <Route path="/enviar" element={<PrivateRoute requiredRole="user"> <SubmitProject /></PrivateRoute>} />}
          <Route path="/evaluar" element={<PrivateRoute requiredRole="evaluator"> <PageEvaluator /></PrivateRoute>} />
          <Route path="/evaluar/:id" element={<PrivateRoute requiredRole="evaluator"> <EvaluationForm /></PrivateRoute>} />
         <Route path="/evaluados" element={<PrivateRoute requiredRole="user"> <EvaluationHistory /></PrivateRoute>} />
         <Route path="/evaluados/:id" element={<PrivateRoute requiredRole="user"> <Calificacion/></PrivateRoute>} />

         <Route path="/historial" element={<PrivateRoute requiredRole="evaluator"> <EvaluationHistory2 /></PrivateRoute>} />
         <Route path="/historial/:id" element={<PrivateRoute requiredRole="evaluator"> <Calificacion2/></PrivateRoute>} />
         
         <Route path="/perfil" element={<PrivateRoute requiredRole="evaluator"> <Perfil /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute requiredRole="user"> <Perfil /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}
//<Route path="/iso25010" element={<Iso25010/>} />
//<Route path="/perfil" element={<Perfil />} />
export default App;
