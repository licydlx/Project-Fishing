/** 
* 函数说明：判断是否为数组
* @关键字 
*/
const isArrayFn = function (value) {
    if (typeof Array.isArray === "function") {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === "[object Array]";
    }
}

// 返回 -1 至 1
const getRandomNum = function (mul) {
    if (!mul) mul = 1;
    return Math.random() > .5 ? -Math.round(Math.random() * mul) : Math.round(Math.random() * mul);
}

/** 
* 函数说明 
* @关键字 
*/
const getNumFromAssign = function (array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 节点坐标系转换
const curNodeCoordinate = function (event, context) {
    // 鼠标世界空间坐标系位置
    let location = event.getLocation();
    // 转为该节点的空间坐标系位置
    let nodeSpacePos = context.convertToNodeSpaceAR(location);
    return nodeSpacePos;
}

module.exports = {
    getRandomNum: getRandomNum,
    getNumFromAssign: getNumFromAssign,
    curNodeCoordinate: curNodeCoordinate,
    isArrayFn:isArrayFn
};
