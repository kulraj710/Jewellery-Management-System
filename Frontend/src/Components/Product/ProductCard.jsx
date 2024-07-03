import React from 'react'
import "../../Styles/Product/ProductCard.css"
import { Link } from "react-router-dom"

// Currently, hard coded data,
// TO-DO : Fetch Data from API

const ProductCard = ({product}) => {
 
  return (
    <div>
      <Link to={"/product/" + product.id} style={{ textDecoration : 'none'}}>
      <div className="product">
        <img src="https://i.ibb.co/pQfxwdL/ring.jpg" alt="Areca Jewelry" />
        <div className="product-info">
          <p><strong>Product Name:</strong> {product.product_name}</p>
          <p><strong>HSN Code:</strong> {product.product_code}</p>
          <p><strong>Gross Weight:</strong>{product.weight} g</p>
          <p><strong>Net Weight:</strong> {product.weight}</p>
          <p><strong>Quantity on Hand:</strong> {product.stock_quantity}</p>
          <p><strong>Category:</strong> {product.category}</p>
        </div>
      </div>
      </Link>
    </div>
  )
}

export default ProductCard
