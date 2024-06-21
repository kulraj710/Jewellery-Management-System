import React from 'react'
import PropTypes from 'prop-types';


const ButtonComponent = ({title, 
  padding = '10px',
  width = 'default',
  backgroundColor = '#007bff',
  color = 'white',
  border = 'none', 
  borderRadius = '4px',
  onClick,
  cursor = 'pointer'}) => {

  // TO-DO : Implement primary and secondary button styling

  const styles = {
    padding : padding,
    width: width,
    backgroundColor: backgroundColor,
    color: color,
    border: border,
    borderRadius: borderRadius,
    cursor: cursor
  }

  return (
    <button style={styles} onClick={onClick}>
        {title}
    </button>

  )
}

export default ButtonComponent
