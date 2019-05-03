var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        var _this = _super.call(this) || this;
        _this._balloons = new Array();
        return _this;
    }
    Monster.prototype.Init = function (data, type) {
        var monsterData = null;
        this._summonType = -1;
        switch (type) {
            case ELevelType.Normal:
                monsterData = data.normal;
                this._sumWeight = 0;
                for (var i = 0; i < monsterData.length; i++) {
                    this._sumWeight += monsterData[i].prob;
                    monsterData[i].weight = this._sumWeight;
                }
                var random = MathUtils.getRandom(1, this._sumWeight);
                for (var i = 0; i < monsterData.length; i++) {
                    if (random <= monsterData[i].weight) {
                        this._gesturDiff = monsterData[i].diff;
                        this._balloonMin = monsterData[i].min;
                        this._balloonMax = monsterData[i].max;
                        var summonId_1 = monsterData[i].summon;
                        if (summonId_1 > 0) {
                            this._summonData = GameConfig.summonSkillTable[summonId_1];
                            this._summonType = this._summonData.type;
                        }
                        this._data = GameConfig.monsterTable[monsterData[i].id.toString()];
                        this._type = this._data.Difficult;
                        break;
                    }
                }
                break;
            case ELevelType.Elite:
                this._gesturDiff = PanelManager.gameScenePanel.boss.diff;
                this._balloonMin = PanelManager.gameScenePanel.boss.min;
                this._balloonMax = PanelManager.gameScenePanel.boss.max;
                var summonId = PanelManager.gameScenePanel.boss.summon;
                if (summonId > 0) {
                    this._summonData = GameConfig.summonSkillTable[summonId];
                    this._summonType = this._summonData.type;
                }
                this._data = GameConfig.monsterTable[PanelManager.gameScenePanel.boss.id.toString()];
                this._type = this._data.Difficult;
                GameConfig.monsterPos = 3;
                var battleVolume_1 = 0.8 * GameConfig.bgmValue / 100;
                egret.Tween.get(GameVoice.battleBGMChannel).to({ volume: 0.2 }, 500).call(function () {
                    var channel = GameVoice.smallBossSound.play(0, 1);
                    channel.volume = 0;
                    egret.Tween.get(channel).to({ volume: GameConfig.soundValue / 100 }, 2000).call(function () {
                        egret.Tween.get(GameVoice.battleBGMChannel).to({ volume: battleVolume_1 }, 500);
                    });
                });
                break;
        }
        if (this._data) {
            this.initData();
            this.initGraph();
        }
        else {
            Error("no wolf data");
        }
    };
    Monster.prototype.initData = function () {
        _super.prototype.initData.call(this);
        var name = this._data.Animation;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this._armature == null) {
            this._armature = new DragonBonesArmature(armatureDisplay);
        }
        this._armature.ArmatureDisplay = armatureDisplay;
        this._armatureContainer.visible = true;
        this._effectArmatureContainer.visible = false;
        this._armatureContainer.register(this._armature, [
            DragonBonesAnimations.Idle,
            DragonBonesAnimations.Dead,
            DragonBonesAnimations.Run,
            DragonBonesAnimations.Hurt,
            DragonBonesAnimations.Explore,
        ]);
        this._state = EMonsterState.Ready;
        this._addNum = 0;
        this._speedY = this._data.Speed / 100 * GameConfig.gameSpeedPercent;
        this._baseSpeedY = this._speedX;
        this._spFall = 0.9;
        this._speedX = 0.2;
        this._armatureContainer.scaleX = this._data.Scale;
        this._armatureContainer.scaleY = this._data.Scale;
        this._armatureContainer.addFrameCallFunc(this._onArmatureFrame, this);
        this._rect.width = this._data.Width;
        this._rect.height = this._data.Height;
        this._width = this._data.Width;
        this._height = this._data.Height;
        this._slowDelay = -1;
        this._gestureData.length = 0;
        this.resetHardGesture();
        this.resetCenterGesture();
        this.resetNormalGesture();
        switch (this._gesturDiff) {
            case EGestureDifficult.Mix:
                for (var i = 0; i < GameConfig.gestureConfig.length; i++)
                    this._gestureData.push(GameConfig.gestureConfig[i]);
                break;
            case EGestureDifficult.Easy:
            case EGestureDifficult.Normal:
            case EGestureDifficult.Center:
            case EGestureDifficult.Hard:
                for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
                    if (GameConfig.gestureConfig[i].difficult == this._gesturDiff) {
                        this._gestureData.push(GameConfig.gestureConfig[i]);
                    }
                }
                break;
            case EGestureDifficult.NAndH:
                var random1 = MathUtils.getRandom(this._normalGesture.length - 1);
                this._gestureData.push(this._normalGesture[random1]);
                random1 = MathUtils.getRandom(this._hardGesture.length - 1);
                this._gestureData.push(this._hardGesture[random1]);
                break;
            case EGestureDifficult.NAndHH:
                var random2 = MathUtils.getRandom(this._normalGesture.length - 1);
                this._gestureData.push(this._normalGesture[random2]);
                random2 = MathUtils.getRandom(this._hardGesture.length - 1);
                this._gestureData.push(this._hardGesture[random2]);
                this._hardGesture.splice(random2, 1);
                random2 = MathUtils.getRandom(this._hardGesture.length - 1);
                this._gestureData.push(this._hardGesture[random2]);
                break;
            case EGestureDifficult.NNAndH:
                var random3 = MathUtils.getRandom(this._hardGesture.length - 1);
                this._gestureData.push(this._hardGesture[random3]);
                random3 = MathUtils.getRandom(this._normalGesture.length - 1);
                this._gestureData.push(this._normalGesture[random3]);
                this._normalGesture.splice(random3, 1);
                random3 = MathUtils.getRandom(this._normalGesture.length - 1);
                this._gestureData.push(this._normalGesture[random3]);
                break;
        }
        if (GameConfig.isGuide) {
            this._gestureData.length = 0;
            if (GameConfig.guideIndex == 0)
                this._gestureData.push(GameConfig.gestureTable["1002"]);
            if (GameConfig.guideIndex == 1)
                this._gestureData.push(GameConfig.gestureTable["1001"]);
            if (GameConfig.guideIndex == 2)
                this._gestureData.push(GameConfig.gestureTable["1002"]);
            if (GameConfig.guideIndex == 3)
                this._gestureData.push(GameConfig.gestureTable["1001"]);
        }
        this._sumBalloon = 0;
    };
    Monster.prototype.initGraph = function () {
        this.y = 0;
        // this.filters = [this.m_dropShadowFilter]
        this.gotoIdle();
        this.updateSignSlot();
        switch (GameConfig.monsterPos) {
            case 1:
                this.x = MathUtils.getRandom(this._rect.width + 50, Config.stageLeft - this._rect.width);
                this.ePos = EMonsterPos.Left;
                GameConfig.monsterPos = 2;
                break;
            case 2:
                this.x = MathUtils.getRandom(Config.stageCenter + this._rect.width, Config.stageWidth - this._rect.width - 50);
                this.ePos = EMonsterPos.Right;
                GameConfig.monsterPos = 3;
                break;
            case 3:
                this.x = MathUtils.getRandom(Config.stageLeft + this._rect.width, Config.stageCenter - this._rect.width);
                this.ePos = EMonsterPos.Middle;
                GameConfig.monsterPos = 1;
                break;
        }
    };
    Monster.prototype.gotoIdle = function () {
        if (this._data.ID == 1009) {
            this._armatureContainer.play(DragonBonesAnimations.Idle, 0, 1, 1, 0.65);
        }
        else if (this._data.ID == 1002) {
            this._armatureContainer.play(DragonBonesAnimations.Idle, 0, 1, 1, 0.9);
        }
        else if (this._data.ID == 1011) {
            this._armatureContainer.play(DragonBonesAnimations.Idle, 0, 1, 1, 0.65);
        }
        else if (this._data.ID == 1012) {
            this._armatureContainer.play(DragonBonesAnimations.Idle, 0, 1, 1, 0.9);
        }
        else {
            this._armatureContainer.play(DragonBonesAnimations.Idle, 0);
        }
    };
    Monster.prototype.gotoHurt = function () {
        this._armatureContainer.play(DragonBonesAnimations.Hurt, 0);
    };
    Monster.prototype.gotoDead = function () {
        this._armatureContainer.play(DragonBonesAnimations.Dead, 1);
        this._state = EMonsterState.Dead;
        if (this._data.Type == EMonsterType.FallDown)
            this._state = EMonsterState.FallDown;
        this._armatureContainer.addCompleteCallFunc(this._onArmatureComplet, this);
        PanelManager.gameScenePanel.sceneData.addPower += this._data.Power;
        GameConfig.balloonScore += this._data.Score;
        PanelManager.gameScenePanel.boom = true;
        // 精英怪死亡游戏速度变慢
        if (PanelManager.gameScenePanel.levelStage == ELevelType.Elite) {
            GameManager.Instance.gameSlow();
        }
    };
    Monster.prototype.gotoRun = function () {
        this._destroyBalloon();
        this._armatureContainer.play(DragonBonesAnimations.Run, 0);
        GameManager.Instance.stop();
    };
    Monster.prototype.GotoFallWater = function () {
        this._effectArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("shuihua", "shuihua");
        if (this._effectArmature == null) {
            this._effectArmature = new DragonBonesArmature(armatureDisplay);
        }
        this._effectArmature.ArmatureDisplay = armatureDisplay;
        this._effectArmatureContainer.register(this._effectArmature, ["shuihua"]);
        this._effectArmatureContainer.scaleX = 0.8;
        this._effectArmatureContainer.scaleY = 0.8;
        var curChapterData = GameConfig.chapterTable[PanelManager.gameSelectLevel.selectChater.toString()];
        if (curChapterData.water == 1) {
            this._effectArmatureContainer.visible = true;
        }
        else {
            this._effectArmatureContainer.visible = false;
        }
        this._effectArmatureContainer.play("shuihua", 1);
        ShakeTool.getInstance().shakeObj(GameManager.Instance.imageScene, 2.3, 4, 8);
        this._effectArmatureContainer.addCompleteCallFunc(this.onEffectArmatureComplete, this);
    };
    Monster.prototype.gotoSlow = function () {
    };
    Monster.prototype.changeToEasy = function () {
        this._gestureData.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            var data = GameConfig.gestureConfig[i];
            if (data.type == 2) {
                for (var j = 0; j < 3; j++)
                    this._gestureData.push(data);
            }
        }
        for (var i = 0; i < this._balloons.length; i++) {
            this._balloons[i].changeToEasy();
        }
    };
    /**
     * 更新怪物身上的特效动画
     */
    Monster.prototype.updateEffectArmature = function (data) {
        _super.prototype.updateEffectArmature.call(this, data);
    };
    Monster.prototype.playEffect = function (data) {
        this._effectArmatureContainer.visible = true;
        this._effectArmatureContainer.play(data.skill, 1);
        if (this._state == EMonsterState.Ready)
            this._state = EMonsterState.Stop;
    };
    Monster.prototype.ballExplosion = function (a_ball) {
        if ((this.y >= 200 && this._state == EMonsterState.Ready) || GameConfig.isGuide) {
            this._exploreIndex = 0;
            for (var i = 0; i < this._balloons.length; i++) {
                var balloon = this._balloons[i];
                if (balloon == a_ball) {
                    PanelManager.gameScenePanel.boom = true;
                    this._balloons.splice(i, 1);
                    balloon.balloonExplore();
                    this._exploreIndex = i;
                    break;
                }
            }
        }
    };
    Monster.prototype.allBalloonExplosion = function () {
        while (this._balloons.length > 0) {
            var balloon = this._balloons.pop();
            balloon.balloonExplore();
        }
    };
    Monster.prototype.removeBalloon = function (a_ball) {
        if (this._groupBalloon.contains(a_ball)) {
            this._groupBalloon.removeChild(a_ball);
        }
        else {
            a_ball.parent.removeChild(a_ball);
        }
    };
    Monster.prototype.update = function (timeElapsed) {
        _super.prototype.update.call(this, timeElapsed);
        if (this._state == EMonsterState.Ready) {
            this.y += timeElapsed * this._speedY;
            if (GameConfig.isGuide) {
                if (this.y >= PanelManager.gameScenePanel.guidePos) {
                    this.y = PanelManager.gameScenePanel.guidePos;
                    this._state = EMonsterState.Stop;
                    PanelManager.gameScenePanel.guideStart();
                }
            }
            else {
                if (this.y >= PanelManager.gameScenePanel.groundPos) {
                    this.y = PanelManager.gameScenePanel.groundPos;
                    this._state = EMonsterState.Run;
                    this.gotoRun();
                }
            }
        }
        else if (this._state == EMonsterState.FallDown) {
            this.y += timeElapsed * this._spFall;
            if (this.y >= PanelManager.gameScenePanel.waterPos) {
                this.y = PanelManager.gameScenePanel.waterPos;
                this._state = EMonsterState.Drown;
                this._armatureContainer.visible = false;
                var curChapterData = GameConfig.chapterTable[PanelManager.gameSelectLevel.selectChater.toString()];
                if (curChapterData.water == 1) {
                    GameVoice.fallDownWaterSound.play(0, 1);
                }
                else {
                    var sound = RES.getRes("fallDownGround_mp3");
                    var channel = sound.play(0, 1);
                }
                this.GotoFallWater();
            }
        }
    };
    Monster.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this._armatureContainer.removeCompleteCallFunc(this._onArmatureComplet, this);
        this._effectArmatureContainer.removeCompleteCallFunc(this.onEffectArmatureComplete, this);
        this._effectArmatureContainer.removeFrameCallFunc(this.onEffectArmatureFram, this);
        this._destroyBalloon();
        this._armatureContainer.clear();
        this._effectArmatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    Monster.prototype.destroyAndRemove = function () {
        _super.prototype.destroyAndRemove.call(this);
        this.destroy();
        PanelManager.gameScenePanel.removeMonster(this);
    };
    /**
     * 更新符号槽位
     */
    Monster.prototype.updateSignSlot = function () {
        this._destroyBalloon();
        this._sumBalloon = MathUtils.getRandom(this._balloonMin, this._balloonMax);
        for (var i = 0; i < this._sumBalloon; i++) {
            var balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon");
            balloon.init(this._gestureData, this);
            this._setBallonPosition(balloon, this._sumBalloon, i);
            this._groupBalloon.addChild(balloon);
            this._score += balloon.score;
            this._balloons.push(balloon);
        }
    };
    Object.defineProperty(Monster.prototype, "Score", {
        get: function () {
            return this._score;
        },
        set: function (value) {
            this._score = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Monster.prototype.onEffectArmatureComplete = function () {
        _super.prototype.onEffectArmatureComplete.call(this);
    };
    Monster.prototype.onEffectArmatureFram = function (event) {
        _super.prototype.onEffectArmatureFram.call(this, event);
        var evt = event.frameLabel;
        switch (evt) {
            case "xiaoshi":
                this._destroyBalloon();
                this._armatureContainer.visible = false;
                break;
        }
    };
    Monster.prototype._spide = function (data, posX, posY, count, i) {
        var channel = GameVoice.spideBall.play(0, 1);
        channel.volume = GameConfig.soundValue / 100;
        PanelManager.gameScenePanel.createSummonActor(data, this._ePos, posX, posY, count, i);
    };
    Monster.prototype._onArmatureFrame = function (event) {
        var evt = event.frameLabel;
        switch (evt) {
            case "vomit":
                if (GameManager.Instance.gameState == EGameState.Start && this._summonData != undefined && this._summonType == 1) {
                    var count = 0;
                    if (this._summonData.count > 0)
                        count = this._summonData.count;
                    else
                        count = MathUtils.getRandom(this._summonData.min, this._summonData.max);
                    for (var i = 0; i < count; i++) {
                        egret.setTimeout(this._spide, this, i * 200, this._summonData, this.x, this.y, count, i);
                    }
                }
                // this._summonType = -1
                break;
        }
    };
    Monster.prototype._summon = function (data, posX, posY, count, i) {
        var channel = GameVoice.summon.play(0, 1);
        channel.volume = GameConfig.soundValue / 100;
        PanelManager.gameScenePanel.createSummonActor(data, this._ePos, posX, posY, count, i);
    };
    Monster.prototype._onArmatureComplet = function () {
        if (this._state == EMonsterState.Dead) {
            this._effectArmatureContainer.visible = false;
            if (this._summonData != null && this._summonType == 2) {
                var count = 0;
                if (this._summonData.count > 0)
                    count = this._summonData.count;
                else
                    count = MathUtils.getRandom(this._summonData.min, this._summonData.max);
                for (var i = 0; i < count; i++) {
                    this._summon(this._summonData, this.x, this.y, count, i);
                    // egret.setTimeout(this._summon, this, i*100, this._summonData, this.x, this.y, count, i)
                }
            }
            this.destroyAndRemove();
            this._summonType = -1;
            this._state = EMonsterState.SummonFinish;
        }
        else if (this._state == EMonsterState.FallDown) {
            this._armatureContainer.play(DragonBonesAnimations.Dead, 0, 2, 6);
        }
    };
    Monster.prototype._randomMonsterData = function () {
        var random = MathUtils.getRandom(1, this._sumWeight);
        for (var i = 0; i < GameConfig.monsterConfig.length; i++) {
            if (random <= GameConfig.monsterConfig[i].weight) {
                return GameConfig.monsterConfig[i];
            }
        }
        return null;
    };
    return Monster;
}(BaseActor));
__reflect(Monster.prototype, "Monster");
//# sourceMappingURL=Monster.js.map