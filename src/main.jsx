import React from 'react'
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './components/Root/Root'
import "bootstrap/dist/css/bootstrap.min.css";
import { HelmetProvider } from 'react-helmet-async';
import Invoice from './Pages/Invoice/Invoice';
import Login from './Pages/Authentication/Login';
import Register from './Pages/Authentication/Register';
import AddProduct from './Pages/Products/AddProducts';
import Products from './Pages/Invoice/Products';
const daysInMonth = 30;

const router = createBrowserRouter ( [
  {
    path: "/", 
    element: <Root />,
    children: [
      {path: "/", element: <Invoice />},
      {path: "/invoice", element: <Invoice />},
      {path: "/login", element: <Login />},
      {path: "/products", element: <Products />},
      {path: "/register", element: <Register />},
      {path: "/addproducts", element: <AddProduct />},

    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);