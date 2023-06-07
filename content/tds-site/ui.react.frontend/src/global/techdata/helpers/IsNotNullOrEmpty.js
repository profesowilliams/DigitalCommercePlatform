
//helper for checking if object is empty, null or undefined
export default function IsNotNullOrEmpty(object) {
  if (object) {
    if (Array.isArray(object) && object.length === 0) {
      return false;
    }
    if (Object.keys(object).length === 0) {
      return false;
    }
    return true;
  } else if (object === false || object === 0) {
    return true;
  } else {
    return false;
  }
}
