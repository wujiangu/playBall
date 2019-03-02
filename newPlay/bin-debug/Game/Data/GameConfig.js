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
        GameVoice.spiderKingDrug = RES.getRes(GameVoice.spiderKingDrug_mp3);
        GameVoice.jiesuanSound = RES.getRes(GameVoice.jiesuan_mp3);
        GameVoice.readyGoSound = RES.getRes(GameVoice.readyGo_mp3);
        GameVoice.smallBossSound = RES.getRes(GameVoice.smallBoss_mp3);
        GameVoice.fallDownWaterSound = RES.getRes(GameVoice.fallDownWater_mp3);
        GameVoice.bossWarning = RES.getRes(GameVoice.bossWarning_mp3);
        GameVoice.spideBall = RES.getRes(GameVoice.spideBall_mp3);
        GameVoice.summon = RES.getRes(GameVoice.summon_mp3);
        GameVoice.unlockItem = RES.getRes(GameVoice.unlockItem_mp3);
    };
    GameConfig.Init = function () {
        this.summonConfig = RES.getRes("summonConfig_json");
        this.levelConfig = RES.getRes("levelConfig_json");
        this.itemConfig = RES.getRes("itemConfig_json");
        this.summonSkillConfig = RES.getRes("summonSkillConfig_json");
        this.itemTable = {};
        // this.itemUseTable = new Array()
        // this.itemUseTable.push(1003)
        var itemList = {};
        for (var i = 0; i < this.itemUseTable.length; i++) {
            itemList[this.itemUseTable[i].toString()] = 1;
        }
        var unlockList = {};
        for (var i = 0; i < this.itemUnlockList.length; i++) {
            unlockList[this.itemUnlockList[i].toString()] = 1;
        }
        for (var i = 0; i < this.itemConfig.length; i++) {
            var config = this.itemConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["Name"] = config.Name;
            data["Desc"] = config.Desc;
            data["LockDesc"] = config.LockDesc;
            data["Bg"] = config.Bg;
            data["Icon"] = config.Icon;
            data["LockIcon"] = config.LockIcon;
            data["ItemBg"] = config.ItemBg;
            data["Scene"] = config.Scene;
            data["Sun"] = config.Sun;
            data["cloud1"] = config.cloud1;
            data["cloud2"] = config.cloud2;
            data["cloud3"] = config.cloud3;
            data["Open"] = config.Open;
            data["Effect"] = config.Effect;
            data["IsUse"] = 0;
            if (itemList[config.ID.toString()] != null && itemList[config.ID.toString()] > 0)
                data["IsUse"] = 1;
            if (unlockList[config.ID.toString()] != null && unlockList[config.ID.toString()] > 0)
                data["Open"] = true;
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
            data["Actions"] = config.Actions;
            data["Speed"] = config.Speed;
            data["Score"] = config.Score;
            data["Power"] = config.Power;
            data["Scale"] = config.Scale;
            data["Width"] = config.Width;
            data["Height"] = config.Height;
            data["BalloonScale"] = config.BalloonScale;
            data["BalloonX"] = config.BalloonX;
            data["BalloonY"] = config.BalloonY;
            this.monsterTable[config.ID.toString()] = data;
            if (config.Animation != null && config.Animation != "") {
                this.InitBattleDragonBones(config.Animation);
            }
        }
        for (var i = 0; i < this.luckyConfig.length; i++) {
            var data = this.luckyConfig[i];
            this.InitBattleDragonBones(data.Animation);
        }
        this.InitConfig();
        this.InitSound();
        Common.GetGuide();
    };
    GameConfig.InitConfig = function () {
        this.summonTable = {};
        for (var i = 0; i < this.summonConfig.length; i++) {
            var config = this.summonConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["Type"] = config.Type;
            data["Actions"] = config.Actions;
            data["Animation"] = config.Animation;
            data["Speed"] = config.Speed;
            data["Score"] = config.Score;
            data["Power"] = config.Power;
            data["Scale"] = config.Scale;
            data["Width"] = config.Width;
            data["Height"] = config.Height;
            this.summonTable[config.ID.toString()] = data;
        }
        this.levelTable = {};
        for (var i = 0; i < this.levelConfig.length; i++) {
            var config = this.levelConfig[i];
            var data = {};
            data["key"] = config.key;
            data["next"] = config.next;
            data["addTime"] = config.addTime;
            data["speed"] = config.speed;
            data["normalCount"] = config.normalCount;
            data["eliteCount"] = config.eliteCount;
            data["unlockItem"] = config.unlockItem;
            data["normal"] = config.normal;
            data["elite"] = config.elite;
            data["section"] = config.section;
            if (config.key != null && config.key > 0) {
                this.levelTable[config.key.toString()] = data;
            }
        }
        this.summonSkillTable = {};
        for (var i = 0; i < this.summonSkillConfig.length; i++) {
            var config = this.summonSkillConfig[i];
            var data = {};
            data["id"] = config.id;
            data["type"] = config.type;
            data["diff"] = config.diff;
            data["key"] = config.key;
            data["max"] = config.max;
            data["min"] = config.min;
            data["count"] = config.count;
            data["ids"] = config.ids;
            this.summonSkillTable[config.key.toString()] = data;
        }
        this.actorConfig = RES.getRes("actorConfig_json");
        this.actorTable = {};
        this.babyOpenList.length = 0;
        for (var i = 0; i < this.actorConfig.length; i++) {
            var config = this.actorConfig[i];
            var data = {};
            data["id"] = config.id;
            data["level"] = config.level;
            data["nextId"] = config.nextId;
            data["name"] = config.name;
            data["desc"] = config.desc;
            data["action"] = config.action;
            data["icon"] = config.icon;
            data["lockIcon"] = config.lockIcon;
            data["direction"] = config.direction;
            data["skillId"] = config.skillId;
            data["fusion"] = config.fusion;
            if (config.level <= 1)
                this.babyOpenList.push(config.id);
            this.actorTable[config.id.toString()] = data;
            if (config.action != null && config.action != "") {
                this.InitBattleDragonBones(config.action);
            }
        }
        // 修改开放宝宝表数据
        for (var i = 0; i < this.babyOpenList.length; i++) {
            var openId = this.babyOpenList[i];
            for (var j = 0; j < this.babyUnlockList.length; j++) {
                var unlockId = this.babyUnlockList[j];
                var level = this.actorTable[unlockId.toString()].level;
                if (level >= 2 && unlockId - level - 1 == openId) {
                    this.babyOpenList[i] = unlockId;
                    break;
                }
            }
        }
        this.curBabyData = this.actorTable[this.curBaby.toString()];
        // 章节配置
        this.chapterConfig = RES.getRes("chapterConfig_json");
        this.chapterTable = {};
        for (var i = 0; i < this.chapterConfig.length; i++) {
            var config = this.chapterConfig[i];
            var data = {};
            data["id"] = config.id;
            data["name"] = config.name;
            data["icon"] = config.icon;
            data["unlockIcon"] = config.unlockIcon;
            data["bg"] = config.bg;
            data["bgm"] = config.bgm;
            data["begin"] = config.begin;
            this.chapterTable[config.id.toString()] = data;
        }
        var babySkillConfig = RES.getRes("babySkillConfig_json");
        this.babySkillTable = {};
        for (var i = 0; i < babySkillConfig.length; i++) {
            var config = babySkillConfig[i];
            var data = {};
            data["id"] = config.id;
            data["skillFile"] = config.skillFile;
            data["skillHang"] = config.skillHang;
            data["boss"] = config.boss;
            data["auto"] = config.auto;
            data["param"] = config.param;
            data["skillPosX"] = config.skillPosX;
            data["range"] = config.range;
            data["result"] = config.result;
            data["time"] = config.time;
            data["skill"] = config.skill;
            data["method"] = config.method;
            data["sceneEffect"] = config.sceneEffect;
            data["skillPosY"] = config.skillPosY;
            data["rangeType"] = config.rangeType;
            this.babySkillTable[config.id.toString()] = data;
        }
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
    GameConfig.testSelectLevel = 10001;
    GameConfig.gameSpeedPercent = 0;
    GameConfig.isGuide = false;
    // 开放的宝宝ID
    GameConfig.babyOpenList = new Array();
    // 挑战模式
    GameConfig.gameMode = EBattleMode.Level;
    return GameConfig;
}());
__reflect(GameConfig.prototype, "GameConfig");
//# sourceMappingURL=GameConfig.js.map