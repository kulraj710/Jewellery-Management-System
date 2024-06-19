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
          <p><strong>Product Name:</strong> {product.name}</p>
          <p><strong>HSN Code:</strong> 71031000</p>
          <p><strong>Gross Weight:</strong> 10 g</p>
          <p><strong>Net Weight:</strong> 8 g</p>
          <p><strong>Quantity on Hand:</strong> 50</p>
          <p><strong>Category:</strong> Rings</p>
        </div>
      </div>
      </Link>
    </div>
  )
}

export default ProductCard
