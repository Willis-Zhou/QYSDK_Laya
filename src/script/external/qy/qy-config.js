// wx
var tjconf = {
  // 微信小游戏的appid
  app_key: "",
  getLocation: false,
  company: "quyou"
};

// qq
if (typeof window.qq !== "undefined") {
  // qq小游戏的appid
  tjconf.app_key = ""
}

// export
export {tjconf as default}