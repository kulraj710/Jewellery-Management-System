// Note : As previous project was merged into this one
// some functions might be duplicated.
// Need proper refactoring to reduce redundancy, for now
// leaving it as it is.

export const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  export const numberWithComma = (number : any) => {
    if (!isNaN(number)) {
        const n = parseFloat(number); // Convert the input to a number
        return n.toLocaleString('en-IN'); // Format as Indian numbering system
      } else {
        // If it's not a number, return the input as is
        return number;
      }
  };