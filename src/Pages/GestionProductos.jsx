import React, { useState, useEffect } from 'react';
import './GestionProductos.css';

function GestionProductos({ onClose, fincaId }) {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/finca/${fincaId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [fincaId]);

  const handleInputChange = (id, field, value) => {
    setProducts(products.map(product =>
      product._id === id ? { ...product, [field]: value } : product
    ));
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }
      
      // Actualizar localmente los datos después de la actualización en el servidor
      const updatedProducts = products.map(product =>
        product._id === id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
      
      // Mostrar el mensaje de éxito
      showMessageWithTimeout('¡Producto actualizado correctamente!');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
      setProducts(products.filter(product => product._id !== id));
      showMessageWithTimeout('¡Producto eliminado correctamente!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const showMessageWithTimeout = (message) => {
    setMessage(message);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, 3000);
  };

  return (
    <div className="pk-modal">
      <div className="pk-modal-content gestion-productos">
        <header>
          <h1>Productos de la Finca :</h1>
          <span className="pk-close" onClick={onClose}>&times;</span>
        </header>
        <div className="productos-list">
          {products.map(product => (
            <div key={product._id} className="producto">
              <div className="producto-header">
                <h2>{product.nombre_producto}</h2>
                <button className="edit-btn" onClick={() => updateProduct(product._id, product)}>EDITAR</button>
                <button className="delete-btn" onClick={() => deleteProduct(product._id)}>ELIMINAR</button>
              </div>
              <div>
                <label>Precio:</label>
                <input
                  type="text"
                  value={product.precio}
                  onChange={(e) => handleInputChange(product._id, 'precio', e.target.value)}
                />
              </div>
              <div>
                <label>Categoría:</label>
                <input
                  type="text"
                  value={product.categoria}
                  onChange={(e) => handleInputChange(product._id, 'categoria', e.target.value)}
                />
              </div>
              <div>
                <label>Descripción del producto:</label>
                <textarea
                  value={product.descripcion}
                  onChange={(e) => handleInputChange(product._id, 'descripcion', e.target.value)}
                  className="descripcion-textarea"
                />
              </div>
              <div>
                <label>Imágenes del producto:</label>
                {product.imagen_producto && product.imagen_producto.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="preview-image"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mensaje emergente (popup) */}
      {showMessage && (
        <div className="popup">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default GestionProductos;
