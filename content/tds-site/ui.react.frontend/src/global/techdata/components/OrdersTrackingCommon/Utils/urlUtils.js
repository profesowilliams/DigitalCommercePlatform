/**
 * Function to build a query string from an array of elements
 * Each element will be prefixed with `?id=` for the first element
 * and `&id=` for the subsequent elements.
 *
 * @param {Array} elements - Array of elements to be included in the query string
 * @returns {string} - The constructed query string
 */
export function buildQueryString(elements) {
  // Check if the input array is empty, return an empty string if true
  if (elements.length === 0) {
    return '';
  }

  // Initialize the query string with the first element prefixed by ?id=
  let queryString = `?id=${elements[0]}`;

  // Loop through the rest of the elements, starting from the second element
  for (let i = 1; i < elements.length; i++) {
    // Append each element to the query string, prefixed by &id=
    queryString += `&id=${elements[i]}`;
  }

  // Return the constructed query string
  return queryString;
}