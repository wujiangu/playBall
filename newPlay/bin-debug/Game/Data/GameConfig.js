var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameConfig = (function () {
    function GameConfig() {
    }
    GameConfig.Init = function () {
        this.itemConfig = RES.getRes("itemConfig_json");
        this.itemTable = {};
        for (var i = 0; i < this.itemConfig.length; i++) {
            var config = this.itemConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["Name"] = config.Name;
            data["Desc"] = config.Desc;
            data["Icon"] = config.Icon;
            this.itemTable[config.ID.toString()] = data;
        }
    };
    return GameConfig;
}());
GameConfig.game = "HT";
GameConfig.isWebView = true;
GameConfig.baseFallSpeed = 0.1;
GameConfig.monsterAddDelay = 1500;
__reflect(GameConfig.prototype, "GameConfig");
