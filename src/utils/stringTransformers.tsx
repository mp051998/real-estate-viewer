
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

