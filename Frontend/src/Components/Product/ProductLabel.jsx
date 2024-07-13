import React from 'react';

const ProductLabel = ({ productId }) => {
  const handlePrintLabel = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/generate-label/${productId}/`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `label_${productId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to generate label');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handlePrintLabel}>Print Label</button>
  );
};

export default ProductLabel;
