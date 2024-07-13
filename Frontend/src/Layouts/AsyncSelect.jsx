import React, { useState, useEffect } from 'react';
import { getItems } from '../Helper/api';

const AsyncSelect = ({ DefaultSelectedValue, onChange, endpoint, required = false, display_access_key, NoDefaultOption }) => {
    const [categories, setCategories] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        if (!isFetched) {
            try {
                setLoading(true)
                const response = await getItems(endpoint);

                if (!NoDefaultOption) {
                    const index = response.indexOf(DefaultSelectedValue);
                    response.splice(index, 1);
                }

                setCategories(response);
                setIsFetched(true);
                console.log("Category : ", response)


            } catch (error) {
                console.error('Error fetching categories:', error);
                setError(error.toString() || "Something went Wrong")
            } finally {
                setLoading(false)
            }
        }
    };

    // this makes sure, select component rerenders so fetched data is displayed 
    useEffect(() => {
        if (!isFetched) {
            fetchData();
        }
    }, [isFetched]);


    return (
        <select onChange={onChange} onClick={() => !isFetched && fetchData()} defaultValue={DefaultSelectedValue.id} required={required}>
            <option value={DefaultSelectedValue.id}>{DefaultSelectedValue[display_access_key]}</option>

            {loading ? <option value=''>Loading...</option> : <>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category[display_access_key]}
                    </option>
                ))}
            </>
            }
        </select>
    );
};

export default AsyncSelect;
