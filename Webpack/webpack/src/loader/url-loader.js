module.exports = function (sourceCode) {
  let s = sourceCode.replace(/@\//g, "/src/");
  console.log(s);
  return s;
};
