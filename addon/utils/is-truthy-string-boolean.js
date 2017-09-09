export default function isTruthyStringBoolean(val) {
  const typeStr = Object.prototype.toString.call(val);
  if (typeStr === '[object String]') {
    return val.toLowerCase() === 'true';
  } else if (typeStr === '[object Boolean]') {
    return val;
  } else {
    return false;
  }
}
