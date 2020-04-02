import Tips from "../popup/Tips"
import SettingPopup from "../popup/SettingPopup"
import MoreGamePopup from "../popup/MoreGamePopup"
import FullScenePopup from "../popup/FullScenePopup"
import InsertPopup from "../popup/InsertPopup"
import BannerPopup from "../popup/BannerPopup"
import ExitPopup from "../popup/ExitPopup"

var UIRegisterInfos = [
  {
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
  },
  {
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
  },
  {
    // 关键字，全局唯一
    key: "moreGameAd",
    // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
    zOrder: 102,
    // 隐藏后是否销毁
    isAutoDestory: false,
    // 管理类，需继承自BaseUI
    cls: MoreGamePopup,
    // 预制体位置
    prefab: "prefab/moreGameAd.json"
  },
  {
    // 关键字，全局唯一
    key: "bannerAd",
    // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
    zOrder: 886,
    // 隐藏后是否销毁
    isAutoDestory: false,
    // 管理类，需继承自BaseUI
    cls: BannerPopup,
    // 预制体位置
    prefab: "prefab/bannerAd.json"
  },
  {
    // 关键字，全局唯一
    key: "insertAd",
    // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
    zOrder: 887,
    // 隐藏后是否销毁
    isAutoDestory: false,
    // 管理类，需继承自BaseUI
    cls: InsertPopup,
    // 预制体位置
    prefab: "prefab/insertAd.json"
  },
  {
    // 关键字，全局唯一
    key: "fullSceneAd",
    // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
    zOrder: 888,
    // 隐藏后是否销毁
    isAutoDestory: false,
    // 管理类，需继承自BaseUI
    cls: FullScenePopup,
    // 预制体位置
    prefab: "prefab/fullSceneAd.json"
  },
  {
    // 关键字，全局唯一
    key: "exitAd",
    // z方向排序顺序，view：10-100，弹出窗：101-799, 广告窗800-999
    zOrder: 889,
    // 隐藏后是否销毁
    isAutoDestory: false,
    // 管理类，需继承自BaseUI
    cls: ExitPopup,
    // 预制体位置
    prefab: "prefab/exitAd.json"
  }
]

// export
export {UIRegisterInfos as default}