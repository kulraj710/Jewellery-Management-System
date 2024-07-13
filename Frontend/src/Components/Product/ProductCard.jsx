import React from 'react'
import "../../Styles/Product/ProductCard.css"
import { Link } from "react-router-dom"
import placeholderImage from "../../assets/placeholder.png"
import Badge from '../../Layouts/Badge'

// Currently, hard coded data,
// TO-DO : Fetch Data from API

const ProductCard = ({ product }) => {

  return (
    <div className='product-card-container'>
      <Link to={"/product/" + product.id} style={{ textDecoration: 'none' }}>
        <div className="product" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>

          {product.product_image ? <img src={`http://localhost:8000/api${product.product_image}`} width={'200px'} height={'200px'} alt={product.product_name} /> :
            <img src={placeholderImage} width={'200px'} height={'200px'} alt={"No Image"} />
          }

          <div className="product-info">
            <p id='product-name-text'> {product.product_name}</p>
            <p id='product-hsn-text'>HSN :  <strong>{product.product_code}</strong></p>
            <p><strong>Qty:</strong> {product.stock_quantity}</p>

            <Badge addClass='product-gr-text' title={`Gr Wt : ${product.grweight} g`} bgcolor='lightgrey' color='black' border='2px solid lightgrey'/>
            <Badge addClass='product-nt-text' title={`Nt Wt : ${product.ntweight} g`} bgcolor='lightgrey' color='black' border='2px solid lightgrey'/>
            
            <p id='product-category-text'><strong>{product.category}</strong></p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
