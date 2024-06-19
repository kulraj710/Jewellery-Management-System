import React, { useContext} from 'react'
import HeroCard from './HeroCard'
import ProductCard from './ProductCard'
import { ProductsContext } from '../../Context/ProductContext'

const ProductPage = () => {

  // To-Do : [temp] : temporary styles, temp array

  const { products } = useContext(ProductsContext)

  const styles = {
        margin : '3rem'
  }


  return (
    <div style={styles}>
      {/* Hero Card */}
      <HeroCard ProductCount={products.length}/>

      {/* Inventory */}
      <section className='listings'>

        <h3>My Inventory</h3>

        <div className='product-list'>

          {products.map((card) => (
            <ProductCard key={card.id} product={card}/>
          ))}

        </div>
      </section>
    </div>
  )
}

export default ProductPage
