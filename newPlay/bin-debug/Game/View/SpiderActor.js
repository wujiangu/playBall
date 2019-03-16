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
var SpiderActor = (function (_super) {
    __extends(SpiderActor, _super);
    function SpiderActor() {
        var _this = _super.call(this) || this;
        _this._balloons = new Array();
        return _this;
    }
    SpiderActor.prototype.Init = function (data) {
        var monsterData = data.elite;
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
                this._summonData = monsterData[i].summon;
                this._data = GameConfig.monsterTable[monsterData[i].id.toString()];
                this._type = this._data.Difficult;
                break;
            }
        }
        if (this._data) {
            this.initData();
            this.initGraph();
        }
        else {
            Error("no wolf data");
        }
    };
    SpiderActor.prototype.initData = function () {
        var name = this._data.Animation;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this._armature == null) {
            this._armature = new DragonBonesArmature(armatureDisplay);
        }
        this._armature.ArmatureDisplay = armatureDisplay;
        this._effectArmatureContainer.visible = false;
        this._armatureContainer.register(this._armature, [
            DragonBonesAnimations.Idle,
            DragonBonesAnimations.Dead,
            DragonBonesAnimations.Run,
            DragonBonesAnimations.Hurt,
            DragonBonesAnimations.Explore,
            DragonBonesAnimations.Arrive,
            DragonBonesAnimations.Attack,
            DragonBonesAnimations.ReadyFall,
            DragonBonesAnimations.Move,
        ]);
        this._state = EMonsterState.Arrive;
        this._speedY = this._data.Speed / 100 * GameConfig.gameSpeedPercent;
        this._spFall = 0.7;
        this._speedX = 0.2;
        this._armatureContainer.scaleX = this._data.Scale;
        this._armatureContainer.scaleY = this._data.Scale;
        this._armatureContainer.addCompleteCallFunc(this._onArmatureComplete, this);
        this._armatureContainer.addFrameCallFunc(this._onArmatureFrame, this);
        this._armatureContainer.visible = false;
        this._rect.width = this._data.Width;
        this._rect.height = this._data.Height;
        this._width = this._data.Width;
        this._height = this._data.Height;
        this._gestureData.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (this._gesturDiff == EGestureDifficult.Mix) {
                this._gestureData.push(GameConfig.gestureConfig[i]);
            }
            else {
                if (GameConfig.gestureConfig[i].difficult == this._gesturDiff)
                    this._gestureData.push(GameConfig.gestureConfig[i]);
            }
        }
        this._sumBalloon = 0;
        this._summonWave = 0;
        this._spitStage = 1;
        this._sumonDelay = -1;
    };
    SpiderActor.prototype.initGraph = function () {
        this.y = Config.stageHalfHeight - 350;
        this.x = Config.stageHalfWidth;
        this.ePos = EMonsterPos.Middle;
        // this.filters = [this.m_dropShadowFilter]
        this._armatureContainer.visible = true;
        this.gotoArrival();
    };
    SpiderActor.prototype.gotoArrival = function () {
        this._state = EMonsterState.Arrive;
        this._armatureContainer.play(DragonBonesAnimations.Arrive, 1);
        var battleVolume = 0.8 * GameConfig.bgmValue / 100;
        egret.Tween.get(GameVoice.battleBGMChannel).to({ volume: 0.2 }, 500).call(function () {
            var channel = GameVoice.spiderKingArrive.play(0, 1);
            channel.volume = 0;
            egret.Tween.get(channel).to({ volume: GameConfig.soundValue / 100 }, 2000).call(function () {
                egret.Tween.get(GameVoice.battleBGMChannel).to({ volume: battleVolume }, 500);
            });
        });
    };
    SpiderActor.prototype.Summon = function (a_count) {
        if (a_count === void 0) { a_count = 2; }
        for (var i = 0; i < a_count; i++) {
            PanelManager.gameScenePanel.createSummonActor(this._summonData, this._ePos, this.x - 100, this.y - 400, a_count, i, true);
        }
    };
    SpiderActor.prototype.gotoIdle = function () {
        if (GameManager.Instance.gameState == EGameState.Start || GameManager.Instance.gameState == EGameState.Pause) {
            this._state = EMonsterState.Ready;
            // this.Summon()
            this._armatureContainer.play(DragonBonesAnimations.Idle, 1);
            PanelManager.gameScenePanel.playSpiderWebArmature("idle", 4);
        }
    };
    SpiderActor.prototype.gotoAttack = function () {
        if (GameManager.Instance.gameState == EGameState.Start || GameManager.Instance.gameState == EGameState.Pause) {
            this._state = EMonsterState.Attack;
            this._isSpit = false;
            this._armatureContainer.play(DragonBonesAnimations.Attack, 1);
            PanelManager.gameScenePanel.playSpiderWebArmature("attack", 3);
        }
    };
    SpiderActor.prototype.gotoSummonFinish = function () {
        if (GameManager.Instance.gameState == EGameState.Start || GameManager.Instance.gameState == EGameState.Pause) {
            this._state = EMonsterState.SummonFinish;
            PanelManager.gameScenePanel.playSpiderWebArmature("dead", 5);
            // this._armatureContainer.play(DragonBonesAnimations.ReadyFall, 1)
        }
    };
    SpiderActor.prototype.gotoMove = function () {
        if (GameManager.Instance.gameState == EGameState.Start || GameManager.Instance.gameState == EGameState.Pause) {
            this._state = EMonsterState.Move;
            this._sumonDelay = 0;
            this.updateSignSlot();
            // this.Summon(3)
            this._armatureContainer.play(DragonBonesAnimations.Move, 0);
        }
    };
    SpiderActor.prototype.gotoDead = function () {
        if (GameManager.Instance.gameState == EGameState.Start) {
            this._armatureContainer.play(DragonBonesAnimations.Dead, 1);
            this._state = EMonsterState.FallDown;
            PanelManager.gameScenePanel.sceneData.addPower += this._data.Power;
            // PanelManager.gameScenePanel.Score += this._data.Score
            GameManager.Instance.gameSlow();
        }
    };
    SpiderActor.prototype.gotoExplore = function () { };
    SpiderActor.prototype.gotoRun = function () {
        this._destroyBalloon();
        this._armatureContainer.play(DragonBonesAnimations.Run, 0);
        GameManager.Instance.stop();
    };
    SpiderActor.prototype.GotoFallWater = function () {
        this._effectArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("shuihua", "shuihua");
        if (this._effectArmature == null) {
            this._effectArmature = new DragonBonesArmature(armatureDisplay);
        }
        this._effectArmature.ArmatureDisplay = armatureDisplay;
        this._effectArmatureContainer.register(this._effectArmature, ["shuihua"]);
        this._effectArmatureContainer.scaleX = 1;
        this._effectArmatureContainer.scaleY = 1;
        this._effectArmatureContainer.visible = true;
        this._effectArmatureContainer.play("shuihua", 1);
        ShakeTool.getInstance().shakeObj(GameManager.Instance.imageScene, 2.3, 4, 6);
        this._effectArmatureContainer.addCompleteCallFunc(this._onEffectArmatureComplete, this);
    };
    SpiderActor.prototype.gotoSlow = function () {
    };
    SpiderActor.prototype.ballExplosion = function (a_ball) {
        if (this.y >= 200 && this._state == EMonsterState.Move) {
            PanelManager.gameScenePanel.boom = true;
            this._exploreIndex = 0;
            for (var i = 0; i < this._balloons.length; i++) {
                var balloon = this._balloons[i];
                if (balloon == a_ball) {
                    this._balloons.splice(i, 1);
                    balloon.balloonExplore();
                    this._exploreIndex = i;
                    break;
                }
            }
        }
    };
    SpiderActor.prototype.updateSignSlot = function () {
        this._destroyBalloon();
        this._sumBalloon = MathUtils.getRandom(this._balloonMin, this._balloonMax);
        for (var i = 0; i < this._sumBalloon; i++) {
            var balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon");
            balloon.init(this._gestureData, this);
            balloon.scaleX = 1.2;
            balloon.scaleY = 1.2;
            this._setBallonPosition(balloon, this._sumBalloon, i);
            this._groupBalloon.addChild(balloon);
            this._score += balloon.score;
            this._balloons.push(balloon);
        }
    };
    SpiderActor.prototype._setBallonPosition = function (balloon, count, value) {
        if (value === void 0) { value = 0; }
        if (count == 1) {
            balloon.x = 0;
            balloon.y = -this._rect.height * 1.1;
        }
        else if (count == 2) {
            balloon.x = value * (balloon.width + 100) - 100;
            balloon.y = -this._rect.height * 1.1;
        }
        else if (count == 3) {
            if (value == 0) {
                balloon.x = 0;
                balloon.y = -this._rect.height * 1.1;
            }
            else {
                balloon.x = (value - 1) * (balloon.width + 120) - 100;
                balloon.y = -this._rect.height * 0.8;
            }
        }
        balloon.setLine();
    };
    Object.defineProperty(SpiderActor.prototype, "gestureData", {
        get: function () {
            return this._gestureData;
        },
        set: function (value) {
            this._gestureData = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpiderActor.prototype, "speedVertical", {
        set: function (value) {
            this._speedY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpiderActor.prototype, "speedHorizon", {
        set: function (value) {
            this._speedX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpiderActor.prototype, "actorTableData", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    SpiderActor.prototype.update = function (timeElapsed) {
        _super.prototype.update.call(this, timeElapsed);
        if (this._state == EMonsterState.Move) {
            this.y += timeElapsed * this._speedY;
            if (this.y >= PanelManager.gameScenePanel.groundPos) {
                this.y = PanelManager.gameScenePanel.groundPos;
                this._state = EMonsterState.Run;
                this.gotoRun();
            }
            if (this._sumonDelay >= 0 && GameManager.Instance.gameState == EGameState.Start) {
                this._sumonDelay += timeElapsed;
                if (this._sumonDelay >= GameConfig.spiderDelay) {
                    this._sumonDelay = 0;
                    // this.Summon()
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
    SpiderActor.prototype.destroy = function () {
        this._destroyBalloon();
        this._armatureContainer.clear();
        this._effectArmatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    // public balloonExploreHandle() {
    // 	if (this._balloons.length <= 0) {
    // 		this._sumBalloon = 0
    // 		// this.gotoDead()
    // 	}else{
    // 		if (this._sumBalloon == 2 && this._balloons.length > 0) {
    // 			let balloon:Balloon = this._balloons[0]
    // 			let posx = 0
    // 			egret.Tween.get(balloon).to({x:posx}, 200, egret.Ease.circOut)
    // 			egret.Tween.get(balloon.rop).to({rotation:0}, 200, egret.Ease.circOut)
    // 			this._sumBalloon = 1
    // 		}
    // 		if (this._sumBalloon == 3 && this._balloons.length > 0) {
    // 			this._sumBalloon = 2
    // 			if (this._exploreIndex == 2) {
    // 				this._balloons.reverse()
    // 			}
    // 			for (let i = 0; i < this._balloons.length; i++) {
    // 				let balloon:Balloon = this._balloons[i]
    // 				let posX = i * (balloon.width+20) - this._rect.width / 5
    // 				let posY = -this._rect.height * 1
    // 				balloon.calculateRop(posX, posY)
    // 				egret.Tween.get(balloon).to({x:posX, y:posY}, 200, egret.Ease.circOut)
    // 				egret.Tween.get(balloon.rop).to({rotation:balloon.ropRotation}, 200, egret.Ease.circOut)
    // 			}
    // 		}
    // 	}
    // }
    SpiderActor.prototype.removeBalloon = function (balloon) {
    };
    SpiderActor.prototype._onEffectArmatureComplete = function () {
        if (this._state == EMonsterState.Drown) {
            this.destroy();
            PanelManager.gameScenePanel.removeSpiderActor(this);
        }
    };
    SpiderActor.prototype._onArmatureComplete = function () {
        switch (this._state) {
            case EMonsterState.Arrive:
                this.gotoAttack();
                // PanelManager.gameScenePanel.playSpiderWebArmature("arrive2", 2)
                break;
            case EMonsterState.Ready:
                this.gotoAttack();
                break;
            case EMonsterState.Attack:
                if (this._summonWave >= 6) {
                    this.gotoSummonFinish();
                }
                else {
                    this._spitStage++;
                    if (this._spitStage > 3)
                        this._spitStage = 1;
                    this.gotoIdle();
                }
                break;
            case EMonsterState.Move:
                // this._armatureContainer.play(DragonBonesAnimations.ReadyFall, 1, 2, 35)
                break;
            case EMonsterState.FallDown:
                break;
        }
    };
    SpiderActor.prototype._onArmatureFrame = function (event) {
        var evt = event.frameLabel;
        var posX = 0;
        var posY = 0;
        switch (evt) {
            case "summon1":
                this._isSpit = true;
                posX = this.x;
                posY = this.y + 200;
                break;
            case "summon2":
                this._isSpit = true;
                posX = this.x - 100;
                posY = this.y + 200;
                break;
            case "summon3":
                this._isSpit = true;
                posX = this.x + 100;
                posY = this.y + 200;
                break;
            case "readyFall":
                // this.gotoMove()
                break;
        }
        if (this._isSpit) {
            this._isSpit = false;
            this._summonWave++;
            var count = MathUtils.getRandom(1, 2);
            var data = { "id": 1003, "diff": 1, "ids": [], "count": 2 };
            for (var i = 0; i < count; i++) {
                egret.setTimeout(this._spide, this, i * 400, data, posX, posY, count, i);
            }
        }
    };
    SpiderActor.prototype._spide = function (data, posX, posY, count, i) {
        var channel = GameVoice.spiderKingDrug.play(0, 1);
        channel.volume = GameConfig.soundValue / 100;
        PanelManager.gameScenePanel.createSummonActor(data, this._ePos, posX, posY, count, i);
    };
    return SpiderActor;
}(BaseActor));
__reflect(SpiderActor.prototype, "SpiderActor");
//# sourceMappingURL=SpiderActor.js.map