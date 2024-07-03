import { useState, createContext } from "react"

export const ProductsContext = createContext([])

const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([])

    const updateProducts = (newProducts) => {
        for (let i=0; i < newProducts.length; i++){
            setProducts([...products, newProducts[i]])
        }
    }


    return (
        <ProductsContext.Provider value={{ products, setProducts, updateProducts}}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider;
