var isNeedSupportSubPackage = true

/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "portrait";

//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.d3.js")
if (!isNeedSupportSubPackage || (typeof window.wx === "undefined" && typeof window.qq === "undefined")) {
    // only load when on windows platform
    // do not load which on sub package...
    loadLib("libs/laya.physics3D.js")
}
//-----libs-end-------

//-----external-begin-----
loadLib("external/md5/md5.js")
loadLib("external/proto/protobuf.js")
loadLib("external/bignumber/bignumber.js")
//-----external-end-------

if (!isNeedSupportSubPackage || (typeof window.wx === "undefined" && typeof window.qq === "undefined")) {
    // only load when on windows platform or support subpackage
    loadLib("js/bundle.js");
}
else {
    loadLib("js/main.js");
}
