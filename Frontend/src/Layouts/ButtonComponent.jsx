import React from 'react'


const ButtonComponent = (title, padding = '1rem') => {

  // TO-DO : Implement primary and secondary button styling
  const styles = {
    padding : padding
  }

  return (
    <button style={styles}>
        {title}
    </button>

  )
}

export default ButtonComponent
