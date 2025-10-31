function type(str, element, endCallback) {
    if (str.length) {
      element.textContent += str.charAt(0);
      setTimeout(() => type(str.slice(1), element, endCallback), 100);
    }
    else
      endCallback();
}

type(
  "Desenvolvedor\nFront-End &\nUX/UI Designer\n Musico e Desenhista",
  document.querySelector(".all-tilte"),
  () => document.querySelector(".barra").classList.remove("barra")
);
