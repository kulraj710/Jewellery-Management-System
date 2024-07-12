import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../Layouts/ButtonComponent';
import "../../Styles/Product/ProductForm.css"
import { postItem } from '../../Helper/api';

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
        productImages: [],
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try{
            setLoading(true)
            await postItem('product/add', formData)
        }
        catch (e){
            console.error(e)
            setError(e.toString())
        }
        finally{
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

                <section className='product-column1'>
                <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>HSN Code</label>
                    <input type="text" name="product_code" value={formData.product_code} onChange={handleChange} required />
                    <button>Enter Manually</button>
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Brand/Designer</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Material Type</label>
                    <input type="text" name="material_type" value={formData.material_type} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Purity</label>
                    <input type="text" name="purity" value={formData.purity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Weight (in grams)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Gemstones</label>
                    <input type="text" name="gemstones" value={formData.gemstones} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Design Type</label>
                    <input type="text" name="design_type" value={formData.design_type} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Size</label>
                    <input type="text" name="size" value={formData.size} onChange={handleChange} />
                </div>
                </section>

                <section className='product-column1'>
                <div className="form-group">
                    <label>Customizable</label>
                    <input type="checkbox" name="customizable" checked={formData.customizable} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Cost Price</label>
                    <input type="number" name="cost_price" value={formData.cost_price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Selling Price</label>
                    <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Discount</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Stock Quantity</label>
                    <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Supplier/Vendor Information</label>
                    <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Product Images</label>
                    <input type="file" name="productImages" multiple onChange={(e) => setFormData({ ...formData, productImages: [...e.target.files] })} />
                </div>
                <div className="form-group">
                    <label>Video</label>
                    <input type="file" name="video" onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })} />
                </div>
                <div className="form-group">
                    <label>Certification Details</label>
                    <input type="text" name="certification" value={formData.certification} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Warranty</label>
                    <input type="checkbox" name="warranty" checked={formData.warranty} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Care Instructions</label>
                    <textarea name="care_instructions" value={formData.care_instructions} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label>Product Tags/Keywords</label>
                    <input type="text" name="product_tags" value={formData.product_tags} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Date of Entry</label>
                    <input type="date" name="date_of_entry" value={formData.date_of_entry} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Entered By (Staff Member)</label>
                    <input type="text" name="entered_by" value={formData.entered_by} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Product Status</label>
                    <select name="product_status" value={formData.product_status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                </section>
                <button type="submit">Add Product</button>
            </form>
        </section>
    )
}

export default ProductForm
