import React from 'react'
import HeroCard from './HeroCard'
import ProductCard from './ProductCard'

const ProductPage = () => {

  // To-Do : [temp] : temporary styles, temp array

  const tempNumberOfProducts = [1,2,3,4,5,6]

  const styles = {
        margin : '3rem'
  }


  return (
    <div style={styles}>
      {/* Hero Card */}
      <HeroCard/>

      {/* Inventory */}
      <section className='listings'>

        <h3>My Inventory</h3>

        <div className='product-list'>

          {tempNumberOfProducts.map((card) => (
            <ProductCard key={card}/>
          ))}

        </div>
      </section>
    </div>
  )
}

export default ProductPage
