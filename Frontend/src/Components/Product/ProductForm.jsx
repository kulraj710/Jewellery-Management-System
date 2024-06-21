import React from 'react'
import { useParams } from 'react-router-dom';

const ProductForm = () => {
    const { id } = useParams();
  return (
    <div>
      this is product with id : {id}
    </div>
  )
}

export default ProductForm
