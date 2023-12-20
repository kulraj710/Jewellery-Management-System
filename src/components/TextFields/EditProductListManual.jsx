import React, { useState } from 'react';
import ProductView from './ProductView';
import ProductEditFormManual from './ProductEditFormManual';

const EditProductListManual = ({ products, setSec4 }) => {

    const [openViewModes, setOpenViewModes] = useState(Array(products.length).fill(false))

    const onEditProduct = (updatedProduct, index) => {
        const updatedProducts = [...products]
        updatedProducts[index] = updatedProduct
        setSec4(updatedProducts)
        
        // close modal
        const updatedModes = [...openViewModes]
        updatedModes[index] = false
        setOpenViewModes(updatedModes)
      }
      const onDeleteProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1)
        setSec4(updatedProducts)
      }
    return (
      <ul>
        {products.map((product, index) => (
          <li key={index}>
         
              <ProductEditFormManual
                open={openViewModes[index]}
                setOpen={() => {
                    const updatedModes = [...openViewModes]
                    updatedModes[index] = false
                    setOpenViewModes(updatedModes)
                  }}
                product={product}
                onSave={(updatedProduct) => onEditProduct(updatedProduct, index)}
              />
          <ProductView
                product={product}
                setOpen={setOpenViewModes}
                index={index}
                open={openViewModes}
                onDelete={() => onDeleteProduct(index)}
              />
          </li>
        ))}
      </ul>
    );
  };
  
 
  

  export default EditProductListManual