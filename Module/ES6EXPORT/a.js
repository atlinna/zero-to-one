// 直接声明
export const AAA = 1;

// 如果已经声明变量 但是还想用变量名
let age = 13;
export { age }; //这个不是对象  只是将age作为导出的名称 然后将age指向的值作为导出的age的值
