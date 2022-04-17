module.exports = function (sourceCode) {
  // console.log(sourceCode)

  return `
        let style = document.createElement('style');
        style.innerHTML = \`${sourceCode}\`
        document.head.appendChild(style)
  `;
};
