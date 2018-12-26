var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameConfig = (function () {
    function GameConfig() {
    }
    /**
     * 初始化骨骼的动画数据
     */
    GameConfig.InitBattleDragonBones = function (name) {
        var skeletonData = RES.getRes(name + "_ske_json");
        var textureData = RES.getRes(name + "_tex_json");
        var texture = RES.getRes(name + "_tex_png");
        DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture);
    };
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
            data["Open"] = config.Open;
            data["Effect"] = config.Effect;
            data["IsUse"] = 0;
            this.itemTable[config.ID.toString()] = data;
        }
        var effectConfig = RES.getRes("effectConfig_json");
        this.effectTable = {};
        for (var i = 0; i < effectConfig.length; i++) {
            var config = effectConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["name"] = config.name;
            data["bullet"] = config.bullet;
            data["step1"] = config.step1;
            data["step2"] = config.step2;
            this.effectTable[config.ID.toString()] = data;
            this.InitBattleDragonBones(config.name);
        }
        this.itemUseTable.push(1003);
    };
    return GameConfig;
}());
GameConfig.game = "HT";
GameConfig.isWebView = true;
GameConfig.baseFallSpeed = 0.1;
GameConfig.monsterAddDelay = 1500;
__reflect(GameConfig.prototype, "GameConfig");
//# sourceMappingURL=GameConfig.js.map