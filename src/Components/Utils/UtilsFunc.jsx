export function generateTransactionId(phoneNumber) {
    phoneNumber = String(phoneNumber);
  
    const seed = Date.now();
  
    const combinedString = phoneNumber + seed;
  
    const hashCode = combinedString.split("").reduce((hash, char) => {
      const charCode = char.charCodeAt(0);
      return (hash << 5) - hash + charCode;
    }, 0);
  
    const positiveHashCode = Math.abs(hashCode) % 100000000;
  
    const transactionId = positiveHashCode.toString().padStart(8, "0");
  
    return transactionId;
  }