var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameTips = (function () {
    function GameTips() {
    }
    return GameTips;
}());
GameTips.test = "测试提示";
__reflect(GameTips.prototype, "GameTips");
//# sourceMappingURL=GameTips.js.map