export const numberWithComma = (number) => {
    if (!isNaN(number)) {
        const n = parseFloat(number); // Convert the input to a number
        return n.toLocaleString('en-IN'); // Format as Indian numbering system
      } else {
        // If it's not a number, return the input as is
        return number;
      }
  };