
export function capitalizeFirstLetter(string: string) {
  if (!string) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeAllWords(string: string) {
  if (!string) {
    return '';
  }
  return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function formatNumberWithCommas(number: string): string {
  if (!number) {
    return '';
  }
  const parts = number.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedNumber = parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  return formattedNumber;
}

