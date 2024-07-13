import React from 'react';

const Badge = ({ title, bgcolor = 'lightgrey', color = 'white', border = 'none', addClass = null }) => {
  const styles = {
    backgroundColor: bgcolor,
    color: color,
    border : border,
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem',
  };

  return <span className={addClass} style={styles}>{title}</span>;
};

export default Badge;
