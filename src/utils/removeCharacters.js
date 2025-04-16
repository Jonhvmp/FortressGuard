

/**
 * Remove caracteres de controle de uma string
 * @param {string} str - String a ser limpa
 * @returns {string} - String sem caracteres de controle
 */

export function removeControlCharacters(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Aceita tabulações e quebras de linha
    if (code === 9 || code === 10 || code === 13) {
      result += str[i];
      continue;
    }
    // Rejeita caracteres de controle
    if (code < 32 || (code >= 127 && code <= 159)) {
      continue;
    }
    result += str[i];
  }
  return result;
}
