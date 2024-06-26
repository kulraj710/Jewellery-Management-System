import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../Layouts/ButtonComponent';
import "../../Styles/Product/ProductForm.css"

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        productName: '',
        productCode: '',
        category: '',
        description: '',
        brand: '',
        materialType: '',
        purity: '',
        weight: '',
        gemstones: '',
        designType: '',
        size: '',
        customizable: false,
        costPrice: '',
        sellingPrice: '',
        discount: '',
        stockQuantity: '',
        supplier: '',
        productImages: [],
        productVideo: '',
        certificationDetails: '',
        warranty: false,
        careInstructions: '',
        productTags: '',
        dateOfEntry: '',
        enteredBy: '',
        productStatus: 'Active',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
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
                    <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>HSN Code</label>
                    <input type="text" name="productCode" value={formData.productCode} onChange={handleChange} required />
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
                    <input type="text" name="materialType" value={formData.materialType} onChange={handleChange} required />
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
                    <input type="text" name="designType" value={formData.designType} onChange={handleChange} />
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
                    <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Selling Price</label>
                    <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Discount</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Stock Quantity</label>
                    <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required />
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
                    <textarea name="careInstructions" value={formData.careInstructions} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label>Product Tags/Keywords</label>
                    <input type="text" name="productTags" value={formData.productTags} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Date of Entry</label>
                    <input type="date" name="dateOfEntry" value={formData.dateOfEntry} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Entered By (Staff Member)</label>
                    <input type="text" name="enteredBy" value={formData.enteredBy} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Product Status</label>
                    <select name="productStatus" value={formData.productStatus} onChange={handleChange}>
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
