/**
 * Compares two URLs to determine if they are identical.
 * 
 * @param {string|URL} url1 - The first URL to compare.
 * @param {string|URL} url2 - The second URL to compare.
 * @returns {boolean} - Returns true if the URLs are identical, otherwise false.
 */
export function compareURLs(url1, url2) {
  // Convert inputs to URL objects if they are strings
  const parsedUrl1 = typeof url1 === 'string' ? new URL(url1) : url1;
  const parsedUrl2 = typeof url2 === 'string' ? new URL(url2) : url2;

  // Compare the base URLs (protocol, host, pathname)
  if (parsedUrl1.origin + parsedUrl1.pathname !== parsedUrl2.origin + parsedUrl2.pathname) {
    return false;
  }

  // Get search parameters from both URLs and convert them to arrays
  const params1 = Array.from(parsedUrl1.searchParams.entries()).map(([key, value]) => [key.toLowerCase(), value.toLowerCase()]);
  const params2 = Array.from(parsedUrl2.searchParams.entries()).map(([key, value]) => [key.toLowerCase(), value.toLowerCase()]);

  // Sort parameters arrays to ensure order doesn't matter
  params1.sort();
  params2.sort();

  // Compare the sorted parameters arrays
  if (params1.length !== params2.length) {
    return false;
  }

  for (let i = 0; i < params1.length; i++) {
    if (params1[i][0] !== params2[i][0] || params1[i][1] !== params2[i][1]) {
      return false;
    }
  }

  return true;
}

/**
* Compares two arrays and checks if they contain the same elements,
* regardless of the order of elements.
*
* @param {Array} arr1 - The first array to compare.
* @param {Array} arr2 - The second array to compare.
* @returns {boolean} True if arrays contain the same elements, false otherwise.
*/
export function arraysEqual(arr1, arr2) {
  // Check if arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }
  // Create copies of arrays to avoid modifying originals
  const arr1Copy = [...arr1];
  const arr2Copy = [...arr2];
  // Sort both copies of arrays
  arr1Copy.sort();
  arr2Copy.sort();
  // Compare sorted arrays element by element
  for (let i = 0; i < arr1Copy.length; i++) {
    if (arr1Copy[i] !== arr2Copy[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Creates a debounced version of the provided function, which delays its execution until after
 * a specified timeout has elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} [timeout=300] - The number of milliseconds to delay execution. Defaults to 300ms.
 * @returns {Function} A debounced version of the provided function.
 */
export const debounce = (func, timeout = 300) => {
  let timer;

  /**
   * The debounced function that delays the execution of the original function.
   *
   * @param {...any} args - The arguments to pass to the original function.
   */
  return (...args) => {
    // Clear the previous timer, if any
    clearTimeout(timer);

    // Set a new timer to execute the function after the specified timeout
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};