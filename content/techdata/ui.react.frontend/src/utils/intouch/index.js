
export const getUrlParamsCaseInsensitive = () => {
  const newParams = new URLSearchParams();
  const params = new URLSearchParams(window.location.search);
  for (const [name, value] of params) {
    newParams.append(name.toLowerCase(), value);
  }
  return newParams;
}
