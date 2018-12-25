var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameConfig = (function () {
    function GameConfig() {
    }
    GameConfig.Init = function () {
        this.itemConfig = RES.getRes("itemConfig_json");
        this.itemTable = {};
        this.itemUseTable = new Array();
        for (var i = 0; i < this.itemConfig.length; i++) {
            var config = this.itemConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["Name"] = config.Name;
            data["Desc"] = config.Desc;
            data["GrayIcon"] = config.GrayIcon;
            data["Icon"] = config.Icon;
            data["IsUse"] = 0;
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
//# sourceMappingURL=GameConfig.js.map