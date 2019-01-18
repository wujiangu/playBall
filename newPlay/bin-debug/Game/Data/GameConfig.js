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
    GameConfig.InitSound = function () {
        GameVoice.beginBGMSound = RES.getRes(GameVoice.beginBGM_mp3);
        GameVoice.battleBGMSound = RES.getRes(GameVoice.battleBGM_mp3);
        GameVoice.btnSound = RES.getRes(GameVoice.btn_mp3);
        GameVoice.ballonBoomSound = RES.getRes(GameVoice.ballonBoom_mp3);
        GameVoice.burnSound = RES.getRes(GameVoice.burn_mp3);
        GameVoice.fireBallSound = RES.getRes(GameVoice.fireBall_mp3);
        GameVoice.iceEffectSound = RES.getRes(GameVoice.iceEffect_mp3);
        GameVoice.skillBeginSound = RES.getRes(GameVoice.skillBegin_mp3);
        GameVoice.staffSound = RES.getRes(GameVoice.staff_mp3);
        GameVoice.combo1Sound = RES.getRes(GameVoice.combo1_mp3);
        GameVoice.combo2Sound = RES.getRes(GameVoice.combo2_mp3);
        GameVoice.combo3Sound = RES.getRes(GameVoice.combo3_mp3);
        GameVoice.combo4Sound = RES.getRes(GameVoice.combo4_mp3);
        GameVoice.spiderKingArrive = RES.getRes(GameVoice.spiderKingArrive_mp3);
        GameVoice.jiesuanSound = RES.getRes(GameVoice.jiesuan_mp3);
        GameVoice.readyGoSound = RES.getRes(GameVoice.readyGo_mp3);
        GameVoice.smallBossSound = RES.getRes(GameVoice.smallBoss_mp3);
        GameVoice.fallDownWaterSound = RES.getRes(GameVoice.fallDownWater_mp3);
        GameVoice.bossWarning = RES.getRes(GameVoice.bossWarning_mp3);
    };
    GameConfig.Init = function () {
        this.summonConfig = RES.getRes("summonConfig_json");
        this.levelConfig = RES.getRes("levelConfig_json");
        this.itemConfig = RES.getRes("itemConfig_json");
        this.itemTable = {};
        // this.itemUseTable = new Array()
        this.itemUseTable.push(1003);
        var itemList = {};
        for (var i = 0; i < this.itemUseTable.length; i++) {
            itemList[this.itemUseTable[i].toString()] = 1;
        }
        for (var i = 0; i < this.itemConfig.length; i++) {
            var config = this.itemConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["Name"] = config.Name;
            data["Desc"] = config.Desc;
            data["Bg"] = config.Bg;
            data["Icon"] = config.Icon;
            data["LockIcon"] = config.LockIcon;
            data["ItemBg"] = config.ItemBg;
            data["Open"] = config.Open;
            data["Effect"] = config.Effect;
            data["IsUse"] = 0;
            if (itemList[config.ID.toString()] != null && itemList[config.ID.toString()] > 0)
                data["IsUse"] = 1;
            this.itemTable[config.ID.toString()] = data;
        }
        var effectConfig = RES.getRes("effectConfig_json");
        this.effectTable = {};
        for (var i = 0; i < effectConfig.length; i++) {
            var config = effectConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["name"] = config.name;
            data["release"] = config.release;
            data["bullet"] = config.bullet;
            data["step1"] = config.step1;
            data["step2"] = config.step2;
            data["type"] = config.type;
            data["count"] = config.count;
            this.effectTable[config.ID.toString()] = data;
            this.InitBattleDragonBones(config.name);
        }
        this.monsterConfig = RES.getRes("monsterConfig_json");
        this.gestureConfig = RES.getRes("gesture_json");
        this.luckyConfig = RES.getRes("luckyConfig_json");
        this.monsterTable = {};
        for (var i = 0; i < this.monsterConfig.length; i++) {
            var config = this.monsterConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["Type"] = config.Type;
            data["Difficult"] = config.Difficult;
            data["Animation"] = config.Animation;
            data["Speed"] = config.Speed;
            data["Score"] = config.Score;
            data["Power"] = config.Power;
            data["Scale"] = config.Scale;
            data["Width"] = config.Width;
            data["Height"] = config.Height;
            this.monsterTable[config.ID.toString()] = data;
            this.InitBattleDragonBones(config.Animation);
        }
        for (var i = 0; i < this.luckyConfig.length; i++) {
            var data = this.luckyConfig[i];
            this.InitBattleDragonBones(data.Animation);
        }
        this.InitSound();
        Common.GetGuide();
        // this.itemUseTable.push(1002)
        // this.itemUseTable.push(1003)
    };
    GameConfig.game = "HT";
    GameConfig.isWebView = true;
    GameConfig.baseFallSpeed = 0.1;
    GameConfig.monsterAddDelay = 2000;
    GameConfig.luckyActorAddDelay = 18000;
    GameConfig.slowDuration = 3000;
    GameConfig.comboDelay = 1000;
    GameConfig.spiderDelay = 4000;
    GameConfig.bgmValue = 100;
    GameConfig.soundValue = 100;
    GameConfig.monsterPos = 1;
    GameConfig.testSelectLevel = 1001;
    GameConfig.gameSpeedPercent = 0;
    GameConfig.isGuide = false;
    return GameConfig;
}());
__reflect(GameConfig.prototype, "GameConfig");
//# sourceMappingURL=GameConfig.js.map