import Tips from "../popup/Tips"
import Modal from "../popup/Modal"
import SettingPopup from "../popup/SettingPopup"
import MoreGamePopup from "../popup/MoreGamePopup"
import FullScenePopup from "../popup/FullScenePopup"
import InsertPopup from "../popup/InsertPopup"
import BannerPopup from "../popup/BannerPopup"
import ScrollPopup from "../popup/ScrollPopup"
import ExitPopup from "../popup/ExitPopup"
import ExitBtnPopup from "../popup/ExitBtnPopup"
import NewGameExitPopup from "../popup/NewGameExitPopup"
import ClickPopup from "../popup/ClickPopup"

let clickBtnInfo = {
  // 关键字，全局唯一
  key: "clickBtnMistake",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 99,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: ClickPopup,
  // 预制体位置
  prefab: "prefab/mistake/clickButton.json"
}

let clickBoxInfo = {
  // 关键字，全局唯一
  key: "clickBoxMistake",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 99,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: ClickPopup,
  // 预制体位置
  prefab: "prefab/mistake/clickBox.json"
}

let settingInfo = {
  // 关键字，全局唯一
  key: "setting",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 101,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: SettingPopup,
  // 预制体位置
  prefab: "prefab/settingView.json"
}

let wxMoreGameAdInfo = {
  // 关键字，全局唯一
  key: "moreGameAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 102,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: MoreGamePopup,
  // 预制体位置
  prefab: "prefab/ad/wx/moreGameAd.json"
}

let oppoMoreGameAdInfo = {
  // 关键字，全局唯一
  key: "moreGameAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 102,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: MoreGamePopup,
  // 预制体位置
  prefab: "prefab/ad/oppo/moreGameAd.json"
}

let scrollAdInfo = {
  // 关键字，全局唯一
  key: "scrollAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 885,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: ScrollPopup,
  // 预制体位置
  prefab: "prefab/ad/wx/scrollAd.json"
}

let scrollAdWithNameInfo = {
  // 关键字，全局唯一
  key: "scrollAdWithName",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 885,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: ScrollPopup,
  // 预制体位置
  prefab: "prefab/ad/wx/scrollAd_WithName.json"
}

let bannerAdInfo = {
  // 关键字，全局唯一
  key: "bannerAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 886,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: BannerPopup,
  // 预制体位置
  prefab: "prefab/ad/bannerAd.json"
}

let insertAdInfo = {
  // 关键字，全局唯一
  key: "insertAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 887,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: InsertPopup,
  // 预制体位置
  prefab: "prefab/ad/ov/insertAd.json"
}

let fullSceneAdInfo = {
  // 关键字，全局唯一
  key: "fullSceneAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 888,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: "FullScenePopup",
  // 预制体位置
  prefab: "prefab/ad/wx/fullSceneAd.json"
}

let exitAdInfo = {
  // 关键字，全局唯一
  key: "exitAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 889,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: ExitPopup,
  // 预制体位置
  prefab: "prefab/ad/wx/exitAd.json"
}

let newGameExitAdInfo = {
  // 关键字，全局唯一
  key: "newGameExitAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 889,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: NewGameExitPopup,
  // 预制体位置
  prefab: "prefab/ad/wx/newGameExitAd.json"
}

let exitBtnAdInfo = {
  // 关键字，全局唯一
  key: "exitBtnAd",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 890,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: ExitBtnPopup,
  // 预制体位置
  prefab: "prefab/ad/wx/exitBtnAd.json"
}

let modalInfo = {
  // 关键字，全局唯一
  key: "modal",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 998,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: Modal,
  // 预制体位置
  prefab: "prefab/modalView.json"
}

let tipsInfo = {
  // 关键字，全局唯一
  key: "tips",
  // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
  zOrder: 999,
  // 隐藏后是否销毁
  isAutoDestory: false,
  // 管理类，需继承自BaseUI
  cls: Tips,
  // 预制体位置
  prefab: "prefab/tipsView.json"
}

var UIRegisterInfos = null

if (typeof window.qq !== "undefined") {
  UIRegisterInfos = [clickBtnInfo, clickBoxInfo, settingInfo]
}
else if (typeof window.tt !== "undefined") {
  UIRegisterInfos = [tipsInfo, settingInfo]
}
else if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("oppo") > -1)) {
  UIRegisterInfos = [tipsInfo, settingInfo, oppoMoreGameAdInfo, insertAdInfo]
}
else if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("vivo") > -1)) {
  UIRegisterInfos = [tipsInfo, settingInfo, insertAdInfo]
}
else if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("meizu") > -1)) {
  UIRegisterInfos = [modalInfo, tipsInfo, settingInfo]
}
else if (typeof window.wx !== "undefined") {
  UIRegisterInfos = [clickBtnInfo, settingInfo, wxMoreGameAdInfo, scrollAdInfo, scrollAdWithNameInfo, bannerAdInfo, fullSceneAdInfo, exitAdInfo, newGameExitAdInfo, exitBtnAdInfo]
}
else {
  UIRegisterInfos = [clickBtnInfo, clickBoxInfo, modalInfo, tipsInfo, settingInfo, wxMoreGameAdInfo, scrollAdInfo, scrollAdWithNameInfo, bannerAdInfo, fullSceneAdInfo, exitAdInfo, newGameExitAdInfo, exitBtnAdInfo]
}

// export
export {UIRegisterInfos as default}