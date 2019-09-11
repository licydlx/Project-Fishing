/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-09 14:21:06
 * @LastEditTime: 2019-09-09 14:21:23
 * @LastEditors: Please set LastEditors
 */
let DeviceDetect = {};
let ua = navigator.userAgent.toLowerCase();
let s;
// 是否是IE浏览器
DeviceDetect.isIE = (s = ua.match(/(msie\s|trident.*rv:)([\d.]+)/)) ? parseInt(s[2]) : false;
// 是否是火狐浏览器
DeviceDetect.isFirefox = (s = ua.match(/firefox\/([\d.]+)/)) ? parseInt(s[1]) : false;
// 是否是谷歌浏览器
DeviceDetect.isChrome = (s = ua.match(/chrome\/([\d.]+)/)) ? parseInt(s[1]) : false;
// 是否是isOpera浏览器
DeviceDetect.isOpera = (s = ua.match(/opera.([\d.]+)/)) ? parseInt(s[1]) : false;
// 是否是safari浏览器
DeviceDetect.isSafari = (s = ua.match(/version\/([\d.]+).*safari/)) ? parseInt(s[1]) : false;
// 是否是UC浏览器
DeviceDetect.isUcweb = (s = ua.match(/ucbrowser/)) ? !!s : false;
// 是否是QQ浏览器
DeviceDetect.isMqq = (s = ua.match(/mqqbrowser/)) ? !!s : false;

// 是否是android 
DeviceDetect.isAndroid = (s = ua.match(/android/)) ? s : false;
// 是否是iphone
DeviceDetect.isIphone = (s = ua.match(/iphone os/)) ? s : false;
// 是否是ipad
DeviceDetect.isIpad = (s = ua.match(/ipad/)) ? s : false;
// 是否是ios
DeviceDetect.isIos = DeviceDetect.isIpad || DeviceDetect.isIphone;
// 是否是Win32 
DeviceDetect.isWin32 = /win32/i.test(window.navigator.platform);
// 是否是微信
DeviceDetect.isWeixin = (s = ua.match(/MicroMessenger/i)) ? !!s : false;
// 是否是微博
DeviceDetect.isWeiBo = (s = ua.match(/__weibo__/)) ? !!s : false;

module.exports = DeviceDetect;