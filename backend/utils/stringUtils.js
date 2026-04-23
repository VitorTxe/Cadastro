// Capitaliza a primeira letra de cada palavra em uma string.
// Ex: "joão da silva" se torna "João Da Silva"
export function capitalize(string) {
  return string
    .split(" ")
    .map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
