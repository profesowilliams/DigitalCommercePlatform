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