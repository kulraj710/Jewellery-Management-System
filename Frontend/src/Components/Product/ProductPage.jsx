import React, { useContext, useEffect, useState} from 'react'
import HeroCard from './HeroCard'
import ProductCard from './ProductCard'
import { ProductsContext } from '../../Context/ProductContext'
import { getItems } from "../../Helper/api"
import SearchBar from '../../Layouts/SearchBar'

const ProductPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const { products, setProducts, updateProducts } = useContext(ProductsContext)

  // To-DO : make sure to add dependency to this array which will trigger the fetchData function
  // so if new new data is supposed to be fetched, it will fetch it
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getItems('product/add'); 
        console.log(data)

        if (data.length > 0){
          setProducts(data);
        }

      } catch (err) {
        setError(err);

      } finally {
        setIsLoading(false);
      }
    };

    if (products < 1){
      fetchData();
    }
  }, []);


  const styles = {
        margin : '3rem'
  }


  return (
    <div style={styles}>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Searchbar */}
      {<SearchBar/>}

      {/* Hero Card */}
      {/* To-DO : Temporarily hidden from UI, as styling and positioning of this component needs to be figured for proper UI-UX */}
      {/* {!isLoading && <HeroCard ProductCount={products.length}/>} */}

      {/* Inventory */}

     {products.length > 0 && (
       <section className='listings'>

       <h3>My Inventory</h3>

       <div className='product-list'>

         {products.map((card) => (
           <ProductCard key={card.id} product={card}/>
         ))}

       </div>
     </section>
     )}
    </div>
  )
}

export default ProductPage
