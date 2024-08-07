import React from 'react'
import AsyncSelect from './AsyncSelect';

const ProductDetailForm = ({ setFormData, formData, isNewProduct = false }) => {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    return (
        <>
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
                    <AsyncSelect display_access_key={'category_name'} NoDefaultOption={isNewProduct} DefaultSelectedValue={formData.category} endpoint={'products/categories/'} onChange={handleChange}/>
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
                    <AsyncSelect display_access_key={'material_type'} NoDefaultOption={isNewProduct} DefaultSelectedValue={formData.material_type} endpoint={'products/material-types/'} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>Purity</label>
                    <input type="text" name="purity" value={formData.purity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Gross Weight (in grams)</label>
                    <input type="number" name="weight" value={formData.grweight} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Net Weight (in grams)</label>
                    <input type="number" name="weight" value={formData.ntweight} onChange={handleChange} required />
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
                    <AsyncSelect display_access_key={'partner_name'} NoDefaultOption={isNewProduct} DefaultSelectedValue={formData.supplier} endpoint={'products/suppliers/'} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label>Product Images</label>
                    <input type="file" name="productImages" onChange={(e) => setFormData({ ...formData, product_image: e.target.files[0] })} />

                    {formData.product_image && (
                        <div style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                            {isNewProduct ? <img src={URL.createObjectURL(formData.product_image)} width={'200px'} height={'200px'} alt="Uploaded preview 1" />
                                :
                                <img src={`http://localhost:8000/api${formData.product_image}`} width={'200px'} height={'200px'} alt="Uploaded preview 2" />}
                        </div>
                    )}
                    <button onClick={() => setFormData({...formData, product_image : null})}>clear</button>
                </div>

                <div className="form-group">
                    <label>Certification Details</label>
                    <input type="text" name="certification_details" value={formData.certification_details} onChange={handleChange} />
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

                {/* TO-DO : need to handle, sql datetime field to be properly displayed here
                currently, no date will be shown */}
                <div className="form-group">
                    <label>Date of Entry</label>
                    <input type="date" name="date_of_entry" value={formData.date_of_entry} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Entered By (Staff Member)</label>
                    <AsyncSelect display_access_key={'username'} NoDefaultOption={isNewProduct} DefaultSelectedValue={formData.entered_by} endpoint={'products/users/'} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>Product Status</label>
                    <select name="product_status" value={formData.product_status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </section>
        </>
    )
}

export default ProductDetailForm