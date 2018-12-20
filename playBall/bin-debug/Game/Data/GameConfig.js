var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameConfig = (function () {
    function GameConfig() {
    }
    GameConfig.baseFallSpeed = 0.1;
    GameConfig.monsterAddDelay = 1500;
    return GameConfig;
}());
__reflect(GameConfig.prototype, "GameConfig");
