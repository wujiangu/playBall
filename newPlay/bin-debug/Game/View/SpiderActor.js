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
        _this.m_balloons = new Array();
        return _this;
    }
    SpiderActor.prototype.Init = function (data) {
        var monsterData = data.elite;
        PanelManager.m_gameScenePanel.EliteCount += 1;
        this.m_sumWeight = 0;
        for (var i = 0; i < monsterData.length; i++) {
            this.m_sumWeight += monsterData[i].prob;
            monsterData[i].weight = this.m_sumWeight;
        }
        var random = MathUtils.getRandom(1, this.m_sumWeight);
        for (var i = 0; i < monsterData.length; i++) {
            if (random <= monsterData[i].weight) {
                this.m_gesturDiff = monsterData[i].diff;
                this.m_balloonMin = monsterData[i].min;
                this.m_balloonMax = monsterData[i].max;
                this.m_summonData = monsterData[i].summon;
                this.m_data = GameConfig.monsterTable[monsterData[i].id.toString()];
                this.m_type = this.m_data.Difficult;
                break;
            }
        }
        if (this.m_data) {
            this.InitData();
            this.InitGraph();
        }
        else {
            Error("no wolf data");
        }
    };
    SpiderActor.prototype.InitData = function () {
        var name = this.m_data.Animation;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this.m_armature == null) {
            this.m_armature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_armature.ArmatureDisplay = armatureDisplay;
        this.m_armatureContainer.visible = true;
        this.m_effectArmatureContainer.visible = false;
        this.m_armatureContainer.register(this.m_armature, [
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
        this.m_state = EMonsterState.Arrive;
        this.m_speedY = this.m_data.Speed / 100;
        this.m_spFall = 0.7;
        this.m_speedX = 0.2;
        this.m_armatureContainer.scaleX = this.m_data.Scale;
        this.m_armatureContainer.scaleY = this.m_data.Scale;
        this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplete, this);
        this.m_armatureContainer.addFrameCallFunc(this._OnArmatureFrame, this);
        this.m_rect.width = this.m_data.Width;
        this.m_rect.height = this.m_data.Height;
        this.m_width = this.m_data.Width;
        this.m_height = this.m_data.Height;
        this.m_gestureData.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (this.m_gesturDiff == EGestureDifficult.Mix) {
                this.m_gestureData.push(GameConfig.gestureConfig[i]);
            }
            else {
                if (GameConfig.gestureConfig[i].difficult == this.m_gesturDiff)
                    this.m_gestureData.push(GameConfig.gestureConfig[i]);
            }
        }
        this.m_sumBalloon = 0;
        this.m_summonWave = 0;
        this.m_spitStage = 1;
        this.m_sumonDelay = -1;
    };
    SpiderActor.prototype.InitGraph = function () {
        this.y = Config.stageHalfHeight - 100;
        // this.filters = [this.m_dropShadowFilter]
        this.GotoArrival();
        this.x = Config.stageHalfWidth;
    };
    SpiderActor.prototype.GotoArrival = function () {
        this.m_state = EMonsterState.Arrive;
        GameVoice.spiderKingArrive.play(0, 1).volume = GameConfig.soundValue / 100;
        this.m_armatureContainer.play(DragonBonesAnimations.Arrive, 1);
    };
    SpiderActor.prototype.Summon = function (a_count) {
        if (a_count === void 0) { a_count = 2; }
        for (var i = 0; i < a_count; i++) {
            PanelManager.m_gameScenePanel.CreateSummonActor(this.m_summonData, this.x - 100, this.y - 400, a_count, i, true);
        }
    };
    SpiderActor.prototype.GotoIdle = function () {
        if (GameManager.Instance.GameState == EGameState.Start) {
            this.m_state = EMonsterState.Ready;
            this.Summon();
            this.m_armatureContainer.play(DragonBonesAnimations.Idle, 1);
        }
    };
    SpiderActor.prototype.GotoAttack = function () {
        if (GameManager.Instance.GameState == EGameState.Start) {
            this.m_state = EMonsterState.Attack;
            this.m_isSpit = false;
            this.m_armatureContainer.play(DragonBonesAnimations.Attack, 1);
        }
    };
    SpiderActor.prototype.GotoSummonFinish = function () {
        if (GameManager.Instance.GameState == EGameState.Start) {
            this.m_state = EMonsterState.SummonFinish;
            this.m_armatureContainer.play(DragonBonesAnimations.ReadyFall, 1);
        }
    };
    SpiderActor.prototype.GotoMove = function () {
        if (GameManager.Instance.GameState == EGameState.Start) {
            this.m_state = EMonsterState.Move;
            this.m_sumonDelay = 0;
            this.UpdateSignSlot();
            this.Summon(3);
            this.m_armatureContainer.play(DragonBonesAnimations.ReadyFall, 1, 2, 35);
        }
    };
    SpiderActor.prototype.GotoDead = function () {
        if (GameManager.Instance.GameState == EGameState.Start) {
            this.m_armatureContainer.play(DragonBonesAnimations.Dead, 1);
            this.m_state = EMonsterState.FallDown;
            PanelManager.m_gameScenePanel.Power += this.m_data.Power;
            PanelManager.m_gameScenePanel.Score += this.m_data.Score;
            GameManager.Instance.GameSlow();
        }
    };
    SpiderActor.prototype.GotoExplore = function () { };
    SpiderActor.prototype.GotoRun = function () {
        this._DestroyBalloon();
        this.m_armatureContainer.play(DragonBonesAnimations.Run, 0);
        GameManager.Instance.Stop();
    };
    SpiderActor.prototype.GotoFallWater = function () {
        this.m_effectArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("shuihua", "shuihua");
        if (this.m_effectArmature == null) {
            this.m_effectArmature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_effectArmature.ArmatureDisplay = armatureDisplay;
        this.m_effectArmatureContainer.register(this.m_effectArmature, ["shuihua"]);
        this.m_effectArmatureContainer.scaleX = 1;
        this.m_effectArmatureContainer.scaleY = 1;
        this.m_effectArmatureContainer.visible = true;
        this.m_effectArmatureContainer.play("shuihua", 1);
        ShakeTool.getInstance().shakeObj(PanelManager.m_gameScenePanel.MountBg, 2.3, 4, 6);
        this.m_effectArmatureContainer.addCompleteCallFunc(this._OnEffectArmatureComplete, this);
    };
    SpiderActor.prototype.GotoSlow = function () {
    };
    SpiderActor.prototype.BallExplosion = function (a_ball) {
        if (this.y >= 100 && this.m_state == EMonsterState.Move) {
            this.m_exploreIndex = 0;
            for (var i = 0; i < this.m_balloons.length; i++) {
                var balloon = this.m_balloons[i];
                if (balloon == a_ball) {
                    this.m_balloons.splice(i, 1);
                    balloon.BalloonExplore();
                    this.m_exploreIndex = i;
                    break;
                }
            }
        }
    };
    SpiderActor.prototype.UpdateSignSlot = function () {
        this._DestroyBalloon();
        this.m_sumBalloon = MathUtils.getRandom(this.m_balloonMin, this.m_balloonMax);
        for (var i = 0; i < this.m_sumBalloon; i++) {
            var balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon");
            balloon.Init(this.m_gestureData, this);
            balloon.scaleX = 1.2;
            balloon.scaleY = 1.2;
            this._SetBallonPosition(balloon, this.m_sumBalloon, i);
            this.m_groupBalloon.addChild(balloon);
            this.m_score += balloon.Score;
            this.m_balloons.push(balloon);
        }
    };
    SpiderActor.prototype._SetBallonPosition = function (balloon, count, value) {
        if (value === void 0) { value = 0; }
        if (count == 1) {
            balloon.x = 0;
            balloon.y = -this.m_rect.height * 1.1;
            balloon.BossSetLine();
        }
        else if (count == 2) {
            balloon.x = value * (balloon.width + 100) - 100;
            balloon.y = -this.m_rect.height * 1.1;
            balloon.BossSetLine(count, value);
        }
        else if (count == 3) {
            if (value == 0) {
                balloon.x = 0;
                balloon.y = -this.m_rect.height * 1.1;
            }
            else {
                balloon.x = (value - 1) * (balloon.width + 120) - 100;
                balloon.y = -this.m_rect.height;
            }
            balloon.BossSetLine(count, value);
        }
    };
    Object.defineProperty(SpiderActor.prototype, "Balloons", {
        get: function () {
            return this.m_balloons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpiderActor.prototype, "GestureData", {
        get: function () {
            return this.m_gestureData;
        },
        set: function (value) {
            this.m_gestureData = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpiderActor.prototype, "SpeedVertical", {
        set: function (value) {
            this.m_speedY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpiderActor.prototype, "SpeedHorizon", {
        set: function (value) {
            this.m_speedX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpiderActor.prototype, "ActorTableData", {
        get: function () {
            return this.m_data;
        },
        enumerable: true,
        configurable: true
    });
    SpiderActor.prototype.Update = function (timeElapsed) {
        if (this.m_state == EMonsterState.Move) {
            this.y += timeElapsed * this.m_speedY;
            if (this.y >= PanelManager.m_gameScenePanel.GroundPos) {
                this.y = PanelManager.m_gameScenePanel.GroundPos;
                this.m_state = EMonsterState.Run;
                this.GotoRun();
            }
            if (this.m_sumonDelay >= 0 && GameManager.Instance.GameState == EGameState.Start) {
                this.m_sumonDelay += timeElapsed;
                if (this.m_sumonDelay >= GameConfig.spiderDelay) {
                    this.m_sumonDelay = 0;
                    this.Summon();
                }
            }
        }
        else if (this.m_state == EMonsterState.FallDown) {
            this.y += timeElapsed * this.m_spFall;
            if (this.y >= PanelManager.m_gameScenePanel.WaterPos) {
                this.y = PanelManager.m_gameScenePanel.WaterPos;
                this.m_state = EMonsterState.Drown;
                this.m_armatureContainer.visible = false;
                this.GotoFallWater();
            }
        }
    };
    SpiderActor.prototype.Destroy = function () {
        this._DestroyBalloon();
        this.m_armatureContainer.clear();
        this.m_effectArmatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    SpiderActor.prototype.BalloonExploreHandle = function () {
    };
    SpiderActor.prototype.RemoveBalloon = function (balloon) {
    };
    SpiderActor.prototype.PlayEffect = function () { };
    SpiderActor.prototype._OnEffectArmatureComplete = function () {
        if (this.m_state == EMonsterState.Stop || this.m_state == EMonsterState.Drown) {
            this.Destroy();
            PanelManager.m_gameScenePanel.RemoveSpiderActor(this);
        }
    };
    SpiderActor.prototype._OnArmatureComplete = function () {
        switch (this.m_state) {
            case EMonsterState.Arrive:
                this.GotoAttack();
                break;
            case EMonsterState.Ready:
                this.GotoAttack();
                break;
            case EMonsterState.Attack:
                if (this.m_summonWave >= 6) {
                    this.GotoSummonFinish();
                }
                else {
                    this.m_spitStage++;
                    if (this.m_spitStage > 3)
                        this.m_spitStage = 1;
                    this.GotoIdle();
                }
                break;
            case EMonsterState.Move:
                this.m_armatureContainer.play(DragonBonesAnimations.ReadyFall, 1, 2, 35);
                break;
            case EMonsterState.FallDown:
                break;
        }
    };
    SpiderActor.prototype._OnArmatureFrame = function (event) {
        var evt = event.frameLabel;
        var posX = 0;
        var posY = 0;
        switch (evt) {
            case "summon1":
                this.m_isSpit = true;
                posX = this.x;
                posY = this.y - 50;
                break;
            case "summon2":
                this.m_isSpit = true;
                posX = this.x - 100;
                posY = this.y - 50;
                break;
            case "summon3":
                this.m_isSpit = true;
                posX = this.x + 100;
                posY = this.y - 50;
                break;
            case "readyFall":
                this.GotoMove();
                break;
        }
        if (this.m_isSpit) {
            this.m_isSpit = false;
            this.m_summonWave++;
            var count = MathUtils.getRandom(1, 2);
            var data = { "id": 1003, "diff": 1, "ids": [], "count": 2 };
            for (var i = 0; i < count; i++) {
                egret.setTimeout(this._Spide, this, i * 400, data, posX, posY, count, i);
            }
        }
    };
    SpiderActor.prototype._Spide = function (data, posX, posY, count, i) {
        PanelManager.m_gameScenePanel.CreateSummonActor(data, posX, posY, count, i);
    };
    SpiderActor.prototype._DestroyBalloon = function () {
        this.m_sumBalloon = 0;
        while (this.m_balloons.length > 0) {
            var balloon = this.m_balloons.pop();
            GameObjectPool.getInstance().destroyObject(balloon);
            this.m_groupBalloon.removeChild(balloon);
        }
    };
    return SpiderActor;
}(BaseActor));
__reflect(SpiderActor.prototype, "SpiderActor");
//# sourceMappingURL=SpiderActor.js.map