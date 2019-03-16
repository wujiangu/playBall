var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Config = (function () {
    function Config() {
    }
    // 用户的数据
    Config.UserInfo = { nickName: "", avatarUrl: "" };
    // // 地面的宽度
    // public static groundHeight:number = 0
    // public static test:number = 0
    // // 手势的类型
    // public static gestureType:number = -1
    // public static WolfConfig:Array<any>
    // public static IsPause:boolean
    // public static WolfSpeed:number = 1500
    // public static WolfFallSpeed:number = 0.1
    // 舞台数据
    Config.stageWidth = 0;
    Config.stageHeight = 0;
    Config.stageHalfWidth = 0;
    Config.stageHalfHeight = 0;
    Config.stageLeft = 0;
    Config.stageCenter = 0;
    Config.stageRight = 0;
    return Config;
}());
__reflect(Config.prototype, "Config");
//# sourceMappingURL=Config.js.map