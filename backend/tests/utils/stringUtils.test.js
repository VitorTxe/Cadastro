import { capitalize } from "../../utils/stringUtils.js";

describe("stringUtils - capitalize", () => {
  it("deve capitalizar a primeira letra de cada palavra e converter o restante para minúsculo", () => {
    const input = "joão da silva";
    const expected = "João Da Silva";
    expect(capitalize(input)).toBe(expected);
  });

  it("deve tratar corretamente palavras com letras maiúsculas misturadas", () => {
    const input = "mARIA eDUARDA";
    const expected = "Maria Eduarda";
    expect(capitalize(input)).toBe(expected);
  });

  it("deve retornar string vazia ao receber string vazia", () => {
    const input = "";
    const expected = "";
    expect(capitalize(input)).toBe(expected);
  });
});
