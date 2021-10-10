export default function toDecimal(frac) {
  let sections = frac.split('-');
  if (sections.length === 1) {
    sections = frac.split(' ');
  }

  if (sections.length > 1 && frac.indexOf('/') !== -1) {
    const integer = parseInt(sections[0], 10);
    const decSection = sections[1].split('/');
    const dec = parseInt(decSection[0], 10) / parseInt(decSection[1], 10);
    return integer + dec;
  }
  if (frac.indexOf('/') !== -1) {
    const decSection = frac.split('/');
    const dec = parseInt(decSection[0], 10) / parseInt(decSection[1], 10);
    return dec;
  }
  return parseInt(frac, 10);
}
