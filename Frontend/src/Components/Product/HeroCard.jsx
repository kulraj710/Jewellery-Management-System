import React, {useState} from 'react'
import "../../Styles/Product/HeroCard.css"

// Currently, data is hardcoded for design purpose
// To-Do : Implement Fetch Data from API 


const HeroCard = () => {

    const [showInventoryValue, setShowInventoryValue] = useState(false);

    const ToggleInventoryValue = () => {
        // TO-DO : later on add calculateValue() function to calc value on 
        // client side. 
        setShowInventoryValue(prev => !prev)
    }

    return (
        <section className='statistics'>
            <div className='stats-card'>
                <div><img src="https://i.ibb.co/pQfxwdL/ring.jpg" alt="Ring" /></div>
                <div className="stats-info">
                    <p><strong>Live Gold Price:</strong> 80,000 Rs.</p>
                    <p><strong>Live Silver Price:</strong> 24,000 Rs.</p>

                    <p>
                        <strong>Total Inventory Value:</strong> 
                        {showInventoryValue ? <span>60,12,344/- </span> : null}
                        <button id="hide-button" onClick={ToggleInventoryValue}>{showInventoryValue ? "Hide" : "Show"}</button>
                    </p>

                    <p><strong>Total Unique Products:</strong> 12</p>
                </div>
            </div>
        </section>
    )
}

export default HeroCard
