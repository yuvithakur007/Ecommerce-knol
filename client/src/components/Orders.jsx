import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/order.css'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://ecommerce-knol.onrender.com/api/orders`, {
          headers: {
            Authorization: token,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };


    const fetchProduct = async (id) => {
            try {
              const response = await axios.get(
                `https://ecommerce-knol.onrender.com/api/products/${id}`
              );
              return response.data;
            } catch (error) {
              console.error("Error fetching product:", error);
            }
          };

    const fetchAllOrderProducts = async () => {
      try {
        const productPromises = orders.map(fetchProduct);
        const products = await Promise.all(productPromises);
        setOrderProducts(products);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };
  
    fetchCartItems();
    fetchAllOrderProducts();
  }, [orders]);


  return (
    <div className="orders-container">
      <h1>Orders</h1>
      {orderProducts.length > 0 ? (
        <div className="order-products">
          <table className="order-table">
            <thead>
              <tr className="order-table-header">
                <th>Number</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderProducts.map( (order,index) => (
                <tr key={index} className="order-item">
                  <td>
                    {index+1}</td>
                  <td>{order.name}</td>
                  <td>${order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p style={{ margin: "1.5rem" }}>No orders available.</p>
          {/* <p>Loading...</p> */}

        </div>

      )}
    </div>
  );
  
  
};

export default Orders;
