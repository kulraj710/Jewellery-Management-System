import React, { useState } from 'react';
import ProductView from './ProductView';
import ProductEditForm from './ProductEditForm';

const EditProductList = ({ products, setSec4, setCurrentAmt, setCurrentTval, setCalculate }) => {

    const [openViewModes, setOpenViewModes] = useState(Array(products.length).fill(false))

    function calculateTotalTval(arr) {
        let total = 0;
        for (const val of arr) {
            console.log("from the for loop" , val.tval)
            console.log("Type" , typeof(val.tval))
            total += parseFloat(val.tval);
        }
        return isNaN(total) ? 0 : total;
      }
    const onEditProduct = (updatedProduct, index) => {
        const updatedProducts = [...products]
        updatedProducts[index] = updatedProduct;
        const total_to_show = calculateTotalTval(updatedProducts)
        setSec4(updatedProducts)
        setCalculate({tvalTotal : total_to_show})
        
        // close modal
        const updatedModes = [...openViewModes]
        updatedModes[index] = false
        setOpenViewModes(updatedModes)
      }
      const onDeleteProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1)
        setSec4(updatedProducts)
        const total_to_show = calculateTotalTval(updatedProducts)
        setCalculate({tvalTotal : total_to_show})
      }
    return (
      <ul>
        {products.map((product, index) => (
          <li key={index}>
         
              <ProductEditForm
                open={openViewModes[index]}
                setOpen={() => {
                    const updatedModes = [...openViewModes]
                    updatedModes[index] = false
                    setOpenViewModes(updatedModes)
                  }}
                product={product}
                onSave={(updatedProduct) => onEditProduct(updatedProduct, index)}
                setCurrentAmt={setCurrentAmt}
                setCurrentTval={setCurrentTval}
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
  
 
  

  export default EditProductList