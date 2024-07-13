import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../Layouts/ButtonComponent';
import "../../Styles/Product/ProductForm.css"
import { postItem } from '../../Helper/api';
import ProductDetailForm from '../../Layouts/ProductDetailForm';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        product_name: '',
        product_code: '',
        category: '',
        description: '',
        brand: '',
        material_type: '',
        purity: '',
        weight: '',
        gemstones: '',
        design_type: '',
        size: '',
        customizable: false,
        cost_price: '',
        selling_price: '',
        discount: '',
        stock_quantity: '',
        supplier: '',
        product_images: '',
        product_video: '',
        certification_details: '',
        warranty: false,
        care_instructions: '',
        product_tags: '',
        date_of_entry: '',
        entered_by: '',
        product_status: 'Active',
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            setLoading(true)
            await postItem('product/add', formData)
        }
        catch (e) {
            console.error(e)
            setError(e.toString())
        }
        finally {
            setLoading(false)
        }
    };

    const RedirectBackToProducts = () => {
        navigate('/product')
    }

    const formStyles = {
        backgroundColor: '#f5f5f5',
        margin: '2rem'
    }
    return (
        <section id='product-form-container'>
            <div>
                <ButtonComponent title="Back" onClick={RedirectBackToProducts} />
                <ButtonComponent title="Print Label" onClick={RedirectBackToProducts} />
            </div>

            <form className="new-product-form" onSubmit={handleSubmit}>

                <ProductDetailForm formData={formData} setFormData={setFormData} isNewProduct/>
                <button type="submit">Add Product</button>
            </form>
        </section>
    )
}

export default ProductForm
