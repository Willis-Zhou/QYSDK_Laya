// oppo
var tjconf = {
    // OPPO小游戏的appid
    app_key: "",
    company: "quyou"
};

// vivo
if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("vivo") > -1)) {
    // VIVO小游戏的appid
    tjconf.app_key = ""
}

// export
export {tjconf as default}