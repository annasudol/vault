import { TokensCollection, TokenBalance } from "@/types";

function getHighestBalance(obj: TokensCollection<TokenBalance>) {
  let highest = null; // To store the highest balance object
  let highestKey = null; // To store the key of the highest balance object

  for (const [key, value] of Object.entries(obj)) {
    const currentBalance = parseFloat(value.balanceInt || "0"); // Convert balanceInt to a number for comparison
    if (!highest || currentBalance > parseFloat(highest.balanceInt || "0")) {
      highest = value; // Update the highest balance object
      highestKey = key; // Update the key
    }
  }

  return highestKey ? { [highestKey]: highest } : {}; // Return the key and its associated object
}


export { getHighestBalance }
