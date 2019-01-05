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
        _this.m_balloons = new Array();
        return _this;
    }
    Monster.prototype.Init = function (data, type) {
        var monsterData = null;
        switch (type) {
            case ELevelType.Normal:
                monsterData = data.normal;
                break;
            case ELevelType.Elite:
                monsterData = data.elite;
                PanelManager.m_gameScenePanel.EliteCount += 1;
                GameConfig.monsterPos = 3;
                break;
        }
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
        // this.m_data = this._RandomMonsterData()
        if (this.m_data) {
            this.InitData();
            this.InitGraph();
        }
        else {
            Error("no wolf data");
        }
    };
    Monster.prototype.InitData = function () {
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
        ]);
        this.m_state = EMonsterState.Ready;
        this.m_speedY = this.m_data.Speed / 100;
        this.m_spFall = 0.7;
        this.m_speedX = 0.2;
        this.m_armatureContainer.scaleX = this.m_data.Scale;
        this.m_armatureContainer.scaleY = this.m_data.Scale;
        this.m_armatureContainer.addFrameCallFunc(this._OnArmatureFrame, this);
        this.m_rect.width = this.m_data.Width;
        this.m_rect.height = this.m_data.Height;
        this.m_width = this.m_data.Width;
        this.m_height = this.m_data.Height;
        this.m_slowDelay = -1;
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
    };
    Monster.prototype.InitGraph = function () {
        this.y = 0;
        // this.filters = [this.m_dropShadowFilter]
        this.GotoIdle();
        this.UpdateSignSlot();
        switch (GameConfig.monsterPos) {
            case 1:
                this.x = MathUtils.getRandom(this.m_rect.width, Config.stageLeft - this.m_rect.width);
                GameConfig.monsterPos = 2;
                break;
            case 2:
                this.x = MathUtils.getRandom(Config.stageCenter + this.m_rect.width, Config.stageWidth - this.m_rect.width);
                GameConfig.monsterPos = 3;
                break;
            case 3:
                this.x = MathUtils.getRandom(Config.stageLeft + this.m_rect.width, Config.stageCenter - this.m_rect.width);
                GameConfig.monsterPos = 1;
                break;
        }
    };
    Monster.prototype.GotoIdle = function () {
        if (this.m_data.ID == 1002) {
            this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0, 1, 1, 0.5);
        }
        else {
            this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0);
        }
    };
    Monster.prototype.GotoHurt = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 0);
    };
    Monster.prototype.GotoDead = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Dead, 1);
        this.m_state = EMonsterState.Dead;
        if (this.m_data.Type == EMonsterType.FallDown)
            this.m_state = EMonsterState.FallDown;
        this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplet, this);
        PanelManager.m_gameScenePanel.Power += this.m_data.Power;
        PanelManager.m_gameScenePanel.Score += this.m_data.Score;
    };
    Monster.prototype.GotoRun = function () {
        this._DestroyBalloon();
        this.m_armatureContainer.play(DragonBonesAnimations.Run, 0);
        GameManager.Instance.Stop();
    };
    Monster.prototype.GotoFallWater = function () {
        this.m_effectArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("shuihua", "shuihua");
        if (this.m_effectArmature == null) {
            this.m_effectArmature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_effectArmature.ArmatureDisplay = armatureDisplay;
        this.m_effectArmatureContainer.register(this.m_effectArmature, ["shuihua"]);
        this.m_effectArmatureContainer.scaleX = 0.8;
        this.m_effectArmatureContainer.scaleY = 0.8;
        this.m_effectArmatureContainer.visible = true;
        this.m_effectArmatureContainer.play("shuihua", 1);
        ShakeTool.getInstance().shakeObj(PanelManager.m_gameScenePanel.MountBg, 2.3, 4, 6);
        this.m_effectArmatureContainer.addCompleteCallFunc(this._OnEffectArmatureComplete, this);
    };
    Monster.prototype.GotoSlow = function () {
    };
    Monster.prototype.ChangeToEasy = function () {
        this.m_gestureData.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            var data = GameConfig.gestureConfig[i];
            if (data.difficult == 1) {
                this.m_gestureData.push(data);
            }
        }
        for (var i = 0; i < this.m_balloons.length; i++) {
            this.m_balloons[i].ChangeToEasy();
        }
    };
    /**
     * 更新怪物身上的特效动画
     */
    Monster.prototype.UpdateEffectArmature = function (data) {
        this.m_effectArmatureContainer.clear();
        if (data.bullet != "") {
            var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.step1, data.step1);
            if (this.m_effectArmature == null) {
                this.m_effectArmature = new DragonBonesArmature(armatureDisplay);
            }
            this.m_effectData = data;
            this.m_effectArmature.ArmatureDisplay = armatureDisplay;
            this.m_effectArmatureContainer.register(this.m_effectArmature, [data.step1]);
            this.m_effectArmatureContainer.visible = false;
            this.m_effectArmatureContainer.scaleX = 0.8;
            this.m_effectArmatureContainer.scaleY = 0.8;
            this.m_effectArmatureContainer.addCompleteCallFunc(this._OnEffectArmatureComplete, this);
            this.m_effectArmatureContainer.addFrameCallFunc(this._OnEffectFrame, this);
        }
    };
    Monster.prototype.PlayEffect = function () {
        this.m_effectArmatureContainer.visible = true;
        this.m_effectArmatureContainer.play(this.m_effectData.step1, 1);
        if (this.m_effectData.type == EEffectType.Fire) {
            this.m_state = EMonsterState.Stop;
            GameConfig.balloonScore = 0;
            PanelManager.m_gameScenePanel.Boom = true;
            PanelManager.m_gameScenePanel.UpdateBatter();
        }
    };
    Monster.prototype.BallExplosion = function (a_ball) {
        if (this.y >= 100 && this.m_state == EMonsterState.Ready) {
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
    Monster.prototype.AllBalloonExplosion = function () {
        while (this.m_balloons.length > 0) {
            var balloon = this.m_balloons.pop();
            balloon.BalloonExplore();
        }
    };
    Monster.prototype.RemoveBalloon = function (a_ball) {
        this.m_groupBalloon.removeChild(a_ball);
    };
    Monster.prototype.BalloonExploreHandle = function () {
        if (this.m_balloons.length <= 0) {
            this.m_sumBalloon = 0;
            // this.GotoDead()
        }
        else {
            if (this.m_sumBalloon == 2 && this.m_balloons.length > 0) {
                var balloon = this.m_balloons[0];
                var posx = 0;
                egret.Tween.get(balloon).to({ x: posx }, 200, egret.Ease.circOut);
                egret.Tween.get(balloon.rop).to({ scaleY: 20, rotation: 0 }, 200, egret.Ease.circOut);
                this.m_sumBalloon = 1;
            }
            if (this.m_sumBalloon == 3 && this.m_balloons.length > 0) {
                this.m_sumBalloon = 2;
                if (this.m_exploreIndex == 2) {
                    this.m_balloons.reverse();
                }
                for (var i = 0; i < this.m_balloons.length; i++) {
                    var balloon = this.m_balloons[i];
                    var posX = i * (balloon.width + 5) - this.m_rect.width / 2;
                    var posY = -this.m_rect.height * 1.1;
                    var rotation = 90 * i - 45;
                    egret.Tween.get(balloon).to({ x: posX, y: posY }, 200, egret.Ease.circOut);
                    egret.Tween.get(balloon.rop).to({ scaleY: 14, rotation: rotation }, 200, egret.Ease.circOut);
                }
            }
        }
    };
    Monster.prototype.Update = function (timeElapsed) {
        if (this.m_state == EMonsterState.Ready) {
            this.y += timeElapsed * this.m_speedY;
            if (this.y >= PanelManager.m_gameScenePanel.GroundPos) {
                this.y = PanelManager.m_gameScenePanel.GroundPos;
                this.m_state = EMonsterState.Run;
                this.GotoRun();
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
    Monster.prototype.Destroy = function () {
        this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this);
        this._DestroyBalloon();
        this.m_armatureContainer.clear();
        this.m_effectArmatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    /**
     * 更新符号槽位
     */
    Monster.prototype.UpdateSignSlot = function () {
        this._DestroyBalloon();
        this.m_sumBalloon = MathUtils.getRandom(this.m_balloonMin, this.m_balloonMax);
        for (var i = 0; i < this.m_sumBalloon; i++) {
            var balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon");
            balloon.Init(this.m_gestureData, this);
            this._SetBallonPosition(balloon, this.m_sumBalloon, i);
            this.m_groupBalloon.addChild(balloon);
            this.m_score += balloon.Score;
            this.m_balloons.push(balloon);
        }
    };
    Object.defineProperty(Monster.prototype, "State", {
        get: function () {
            return this.m_state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "Score", {
        get: function () {
            return this.m_score;
        },
        set: function (value) {
            this.m_score = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "Balloons", {
        get: function () {
            return this.m_balloons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "Type", {
        get: function () {
            return this.m_type;
        },
        enumerable: true,
        configurable: true
    });
    Monster.prototype._OnEffectFrame = function (event) {
        var evt = event.frameLabel;
        switch (evt) {
            case "xiaoshi":
                PanelManager.m_gameScenePanel.Power += this.m_data.Power;
                this._DestroyBalloon();
                this.m_armatureContainer.visible = false;
                break;
        }
    };
    Monster.prototype._OnEffectArmatureComplete = function () {
        if (this.m_state == EMonsterState.Stop || this.m_state == EMonsterState.Drown) {
            this.Destroy();
            PanelManager.m_gameScenePanel.RemoveMonster(this);
        }
    };
    Monster.prototype._OnArmatureFrame = function (event) {
        var evt = event.frameLabel;
        switch (evt) {
            case "vomit":
                if (GameManager.Instance.GameState == EGameState.Start && this.m_summonData != undefined) {
                    var count = MathUtils.getRandom(1, this.m_summonData.count);
                    for (var i = 0; i < count; i++)
                        PanelManager.m_gameScenePanel.CreateSummonActor(this.m_summonData, this.x, this.y);
                }
                break;
        }
    };
    Monster.prototype._OnArmatureComplet = function () {
        if (this.m_state == EMonsterState.Dead) {
            if (this.m_summonData != null) {
                var count = MathUtils.getRandom(1, this.m_summonData.count);
                for (var i = 0; i < count; i++)
                    PanelManager.m_gameScenePanel.CreateSummonActor(this.m_summonData, this.x, this.y, count, i);
            }
            this.Destroy();
            PanelManager.m_gameScenePanel.RemoveMonster(this);
        }
        else if (this.m_state == EMonsterState.FallDown) {
            this.m_armatureContainer.play(DragonBonesAnimations.Dead, 0, 2, 6);
        }
    };
    Monster.prototype._RandomMonsterData = function () {
        var random = MathUtils.getRandom(1, this.m_sumWeight);
        for (var i = 0; i < GameConfig.monsterConfig.length; i++) {
            if (random <= GameConfig.monsterConfig[i].weight) {
                return GameConfig.monsterConfig[i];
            }
        }
        return null;
    };
    Monster.prototype._DestroyBalloon = function () {
        this.m_sumBalloon = 0;
        while (this.m_balloons.length > 0) {
            var balloon = this.m_balloons.pop();
            GameObjectPool.getInstance().destroyObject(balloon);
            this.m_groupBalloon.removeChild(balloon);
        }
    };
    return Monster;
}(BaseActor));
__reflect(Monster.prototype, "Monster");
