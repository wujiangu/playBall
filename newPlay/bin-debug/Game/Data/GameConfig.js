var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameConfig = (function () {
    function GameConfig() {
    }
    /**
     * 初始化骨骼的动画数据
     */
    GameConfig.initBattleDragonBones = function (name) {
        var skeletonData = RES.getRes(name + "_ske_json");
        var textureData = RES.getRes(name + "_tex_json");
        var texture = RES.getRes(name + "_tex_png");
        DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture);
    };
    GameConfig.initSound = function () {
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
        GameVoice.battleBefore = RES.getRes(GameVoice.battleBefore_mp3);
        GameVoice.vectory = RES.getRes(GameVoice.vectory_mp3);
        GameVoice.rewardBGM = RES.getRes(GameVoice.rewardBGM_mp3);
        GameVoice.rewardVoice = RES.getRes(GameVoice.rewardVoice_mp3);
        GameVoice.gestureVoice = RES.getRes(GameVoice.gesture_mp3);
    };
    GameConfig.init = function () {
        this.summonConfig = RES.getRes("summonConfig_json");
        this.levelConfig = RES.getRes("levelConfig_json");
        this.summonSkillConfig = RES.getRes("summonSkillConfig_json");
        var effectConfig = RES.getRes("effectConfig_json");
        this.effectTable = {};
        for (var i = 0; i < effectConfig.length; i++) {
            var config = effectConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["name"] = config.name;
            this.effectTable[config.ID.toString()] = data;
            this.initBattleDragonBones(config.name);
        }
        this.monsterConfig = RES.getRes("monsterConfig_json");
        this.gestureConfig = RES.getRes("gesture_json");
        this.luckyConfig = RES.getRes("luckyConfig_json");
        this.luckyTable = {};
        for (var i = 0; i < this.luckyConfig.length; i++) {
            var config = this.luckyConfig[i];
            var data = {};
            data["ID"] = config.ID;
            data["Type"] = config.Type;
            data["Animation"] = config.Animation;
            data["Speed"] = config.Speed;
            data["Score"] = config.Score;
            data["Power"] = config.Power;
            data["Scale"] = config.Scale;
            data["Width"] = config.Width;
            data["Height"] = config.Height;
            data["Prob"] = config.Prob;
            data["balloon"] = config.balloon;
            this.luckyTable[config.ID.toString()] = data;
            if (config.Animation != null && config.Animation != "") {
                this.initBattleDragonBones(config.Animation);
            }
        }
        this.gestureTable = {};
        for (var i = 0; i < this.gestureConfig.length; i++) {
            var config = this.gestureConfig[i];
            var data = {};
            data["difficult"] = config.difficult;
            data["type"] = config.type;
            data["data"] = config.data;
            data["count"] = config.count;
            data["path"] = config.path;
            data["balloon"] = config.balloon;
            data["color"] = config.color;
            this.gestureTable[config.type.toString()] = data;
        }
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
                this.initBattleDragonBones(config.Animation);
            }
        }
        this.initConfig();
        this.initSound();
        Common.getGuide();
    };
    GameConfig.initConfig = function () {
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
            data["candy"] = config.candy;
            data["unlockItem"] = config.unlockItem;
            data["normal"] = config.normal;
            data["elite"] = config.elite;
            data["section"] = config.section;
            data["level"] = config.level;
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
            data["quality"] = config.quality;
            data["weight"] = config.weight;
            data["candy"] = config.candy;
            data["name"] = config.name;
            data["unlockDesc"] = config.unlockDesc;
            data["desc"] = config.desc;
            data["action"] = config.action;
            data["icon"] = config.icon;
            data["lockIcon"] = config.lockIcon;
            data["direction"] = config.direction;
            data["skillId"] = config.skillId;
            data["fusion"] = config.fusion;
            data["range"] = 0;
            if (config.level <= 1)
                this.babyOpenList.push(config.id);
            this.actorTable[config.id.toString()] = data;
            if (config.action != null && config.action != "") {
                this.initBattleDragonBones(config.action);
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
            data["sun"] = config.sun;
            data["cloud1"] = config.cloud1;
            data["cloud2"] = config.cloud2;
            data["water"] = config.water;
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
            data["music"] = config.music;
            data["scale"] = config.scale;
            this.babySkillTable[config.id.toString()] = data;
        }
        this.signConfig = RES.getRes("signConfig_json");
        this.signTable = {};
        for (var i = 0; i < this.signConfig.length; i++) {
            var config = this.signConfig[i];
            var data = {};
            data["id"] = config.id;
            data["name"] = config.name;
            data["desc"] = config.desc;
            data["boss"] = config.boss;
            data["rewardType"] = config.rewardType;
            data["reward"] = config.reward;
            data["icon"] = config.icon;
            data["isGet"] = false;
            if (i < this.signCount)
                data["isGet"] = true;
            if (i == this.signCount && this.sign == 1)
                data["isGet"] = true;
            this.signTable[config.id.toString()] = data;
        }
        this.capsuleConfig = RES.getRes("capsuleConfig_json");
        this.capsuleTable = {};
        for (var i = 0; i < this.capsuleConfig.length; i++) {
            var config = this.capsuleConfig[i];
            var data = {};
            data["id"] = config.id;
            data["type"] = config.type;
            data["value"] = config.value;
            data["weight"] = config.weight;
            data["range"] = 0;
            this.capsuleTable[config.id.toString()] = data;
        }
    };
    GameConfig.game = "HT";
    GameConfig.isWebView = true;
    GameConfig.baseFallSpeed = 0.1;
    GameConfig.monsterAddDelay = 2000;
    GameConfig.luckyActorAddDelay = 23000;
    GameConfig.slowDuration = 3000;
    GameConfig.comboDelay = 1000;
    GameConfig.spiderDelay = 4000;
    GameConfig.bgmValue = 100;
    GameConfig.soundValue = 100;
    GameConfig.monsterPos = 1;
    GameConfig.gameSpeedPercent = 0;
    GameConfig.isGuide = false;
    // 开放的宝宝ID
    GameConfig.babyOpenList = new Array();
    // 挑战模式
    GameConfig.gameMode = EBattleMode.Level;
    // 签到标记(0:未签到 1:已签到)
    GameConfig.sign = 0;
    // 签到次数
    GameConfig.signCount = 0;
    // 当前挑战的章节
    GameConfig.curBattleChapter = 0;
    // 临时配置，后续修改
    GameConfig.sceneType = 0;
    return GameConfig;
}());
__reflect(GameConfig.prototype, "GameConfig");
//# sourceMappingURL=GameConfig.js.map