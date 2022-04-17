/**
 * 将style-loader 导出的css module样式关联 挂载到元素
 */
export function domCssModule(styles) {
  let arr = Object.keys(styles);
  arr.forEach((item) => {
    let ele = document.getElementsByClassName(item)[0];
    ele && (ele.className = styles[item]);
  });
}
