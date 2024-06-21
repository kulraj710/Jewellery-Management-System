import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../Layouts/ButtonComponent';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const RedirectBackToProducts = () => {
        navigate('/product')
    }

    const containerStyles = {
        
    }
    const formStyles = {
        backgroundColor : '#f5f5f5',
        margin : '2rem'
    }
    return (
        <section style={containerStyles}>
            <div>
                <ButtonComponent title="Back" onClick={RedirectBackToProducts} />
            </div>

            <div style={formStyles}>
                this is product with id : {id}
            </div>
        </section>
    )
}

export default ProductForm
