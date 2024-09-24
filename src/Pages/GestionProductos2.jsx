import React, { useState } from 'react';
import './GestionProductos2.css';
import {Grid} from '@mui/material';
const GestionProductos2 = ({ fincaId, onClose }) => {
  const [product, setProduct] = useState({
    nombre: '',
    precio: '',
    unidades: [{ cantidad: '', unidad: '' }],
    categoria: '',
    descripcion: '',
    imagenes: ['', '', ''],
  });
  const [urlImages, setUrlImages] = useState([]);
  const[mensaje,setMessage] = useState("")
  const [files, setFiles] = useState(null);
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();

      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          fd.append("images", file);
        });
      } else {
        return alert("no se han cargado imagenes");
      }
      console.log(files);

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: fd,
      });

      console.log(response);
      if (response.ok) {
        const result = await response.json();
        console.log("Files uploaded successfully!", result);
        setMessage("Imagen subida")
        setUrlImages(result.urls);
      } else {
        console.log("File upload failed:", response.statusText);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUnidadChange = (index, e) => {
    const { name, value } = e.target;
    const unidades = [...product.unidades];
    unidades[index][name] = value;
    setProduct({ ...product, unidades });
  };

  const addUnidad = () => {
    setProduct({ ...product, unidades: [...product.unidades, { cantidad: '', unidad: '' }] });
  };

  const removeUnidad = (index) => {
    const unidades = [...product.unidades];
    unidades.splice(index, 1);
    setProduct({ ...product, unidades });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imagenes = [...product.imagenes];
      imagenes[index] = URL.createObjectURL(file);
      setProduct({ ...product, imagenes });
    }
  };

  const handleSave = async () => {
    const newProduct = {
      finca_id: fincaId,
      nombre_producto: product.nombre,
      descripcion: product.descripcion,
      precio: parseFloat(product.precio),
      categoria: product.categoria,
      imagen_producto: urlImages,
      unidades: product.unidades.map(unidad => ({
        cantidad: parseFloat(unidad.cantidad),
        unidad: unidad.unidad,
      })),
    };

    try {
      const response = await fetch('http://localhost:3000/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        console.log('Producto guardado:', savedProduct);
        onClose();
      } else {
        console.error('Error al guardar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div className="product-modal">
      <div className="product-modal-content">
        <div className="modal-header">
          <h2>Gestión de Productoa</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div>
          <label>Nombre del Producto</label>
          <input type="text" name="nombre" value={product.nombre} onChange={handleInputChange} />
        </div>
        <div>
          <label>Precio</label>
          <input type="text" name="precio" value={product.precio} onChange={handleInputChange} />
        </div>
        <div>
          <label>Unidad de Medida</label>
          {product.unidades.map((unidad, index) => (
            <div key={index} className="unidad-container">
              <input
                type="text"
                placeholder="Cantidad"
                name="cantidad"
                value={unidad.cantidad}
                onChange={(e) => handleUnidadChange(index, e)}
              />
              <select
                name="unidad"
                value={unidad.unidad}
                onChange={(e) => handleUnidadChange(index, e)}
              >
                <option value="">Seleccione Unidad</option>
                <option value="kg">Kg</option>
                <option value="lb">Lb</option>
              </select>
              <button type="button" onClick={() => removeUnidad(index)}>
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={addUnidad}>
            Agregar Unidad
          </button>
        </div>
        <div>
          <label>Categoria</label>
          <select name="categoria" value={product.categoria} onChange={handleInputChange}>
            <option value="">Seleccione Categoria</option>
            <option value="Frutas Tropicales">Frutas Tropicales</option>
            <option value="Granos y Leguminosas">Granos y Leguminosas</option>
            <option value="Vegetales">Vegetales</option>
            <option value="Productos de Exportación">Productos de Exportación</option>
            <option value="frutas">Frutas</option>
            <option value="verduras">Verduras</option>
          </select>
        </div>
        <div>
          <label>Descripción del Producto</label>
          <textarea name="descripcion" value={product.descripcion} onChange={handleInputChange}></textarea>
        </div>
        <div className="upload-images">
       
{/*           <div className="image-preview">
            {product.imagenes.map((imagen, index) => (
              <div key={index} className="image-placeholder">
                <input type="file" onChange={(e) => handleImageChange(index, e)} />
                {imagen && <img src={imagen} alt={`Producto ${index + 1}`} />}
              </div>
            ))}
          </div> */}
          <input type="file" multiple onChange={handleFileChange} />
          <Grid container spacing={2}>
            <Grid item xs={7}><button onClick={handleFileUpload} >Subir imágenes de productos</button></Grid>
            <Grid item xs={5}><div style={{fontWeight:"bold",color:"green"}}>{mensaje}</div></Grid>
          </Grid>
        {/*   <button onClick={handleFileUpload} >Subir imágenes de productos</button>  */}
        </div>
        <div className="modal-buttons">
          <button onClick={handleSave}>GUARDAR</button>
          <button onClick={onClose}>CANCELAR</button>
        </div>
      </div>
    </div>
  );
};

export default GestionProductos2;
