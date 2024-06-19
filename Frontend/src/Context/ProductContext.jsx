import { useState, createContext } from "react"

export const ProductsContext = createContext([])

const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([{id : 1, name : 'prod 1'}, {id : 2, name : 'prod 2'}, {id : 3, name : 'prod 3'}])

    const updateProducts = (newProducts) => {
        setProducts((prev) => setProducts([...prev, newProducts]))
    }


    return (
        <ProductsContext.Provider value={{ products, updateProducts}}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider;
