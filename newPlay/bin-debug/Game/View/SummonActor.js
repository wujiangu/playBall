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
var SummonActor = (function (_super) {
    __extends(SummonActor, _super);
    function SummonActor() {
        var _this = _super.call(this) || this;
        // this.m_balloon = new Balloon()
        // this._groupBalloon.addChild(this.m_balloon)
        _this._balloons = new Array();
        _this.m_gesture = new egret.Bitmap();
        _this.addChild(_this.m_gesture);
        _this.m_gesture.scaleX = 0.55;
        _this.m_gesture.scaleY = 0.55;
        return _this;
    }
    SummonActor.prototype.init = function (a_data, a_x, a_y, beginX, beginY) {
        this._sumWeight = 0;
        this._type = EMonsterDifficult.Summon;
        this._data = GameConfig.summonTable[a_data.id.toString()];
        this._animations = this._data.Actions;
        this._gesturDiff = a_data.diff;
        this._gestureData.length = 0;
        if (a_data.ids != undefined && a_data.ids.length > 0) {
            for (var i = 0; i < a_data.ids.length; i++) {
                var id = a_data.ids[i];
                for (var i_1 = 0; i_1 < GameConfig.gestureConfig.length; i_1++) {
                    if (GameConfig.gestureConfig[i_1].type == id) {
                        this._gestureData.push(GameConfig.gestureConfig[i_1]);
                    }
                }
            }
        }
        else {
            for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
                if (this._gesturDiff == EGestureDifficult.Mix) {
                    this._gestureData.push(GameConfig.gestureConfig[i]);
                }
                else {
                    if (GameConfig.gestureConfig[i].difficult == this._gesturDiff)
                        this._gestureData.push(GameConfig.gestureConfig[i]);
                }
            }
        }
        if (this._data) {
            this.initData();
            this.initGraph();
            this._endX = a_x;
            this._endY = a_y;
            if (this._data.Type == ESummonType.Balloon) {
                this.x = beginX;
                this.y = beginY;
            }
            else if (this._data.Type == ESummonType.Monster) {
                this.x = a_x;
                this.y = beginY - this.master.actorTableData.Height / 2;
            }
            // Common.log("位置", this._endX, this._endY)
        }
        else {
            Error("no wolf data");
        }
    };
    SummonActor.prototype.initData = function () {
        _super.prototype.initData.call(this);
        var name = this._data.Animation;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this._armature == null) {
            this._armature = new DragonBonesArmature(armatureDisplay);
        }
        this._armature.ArmatureDisplay = armatureDisplay;
        this._armatureContainer.register(this._armature, this._animations);
        this._state = EMonsterState.Ready;
        this._addNum = 0;
        this._speedY = this._data.Speed / 100 * GameConfig.gameSpeedPercent;
        this._baseSpeedY = this._speedY;
        this._speedX = 0.1;
        this._effectArmatureContainer.visible = false;
        this._armatureContainer.scaleX = this._data.Scale;
        this._armatureContainer.scaleY = this._data.Scale;
        this._rect.width = this._data.Width;
        this._rect.height = this._data.Height;
        this._width = this._data.Width;
        this._height = this._data.Height;
    };
    SummonActor.prototype.initGraph = function () {
        this.x = Config.stageWidth + this._width / 2;
        this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200);
        this.m_gesture.visible = false;
        this._groupBalloon.visible = false;
        this._armatureContainer.visible = true;
        this._destroyBalloon();
        if (this._data.Type == ESummonType.Balloon) {
            this._isArrive = false;
            this.updateGesture();
            // let colorIndex = MathUtils.getRandom(this._animations.length - 1)
            // this._animationName = this._animations[colorIndex]
            this._armatureContainer.play(this._animationName, 1);
            this._armatureContainer.pause(this._animationName);
        }
        else if (this._data.Type == ESummonType.Monster) {
            this._isArrive = true;
            this._sumBalloon = 1;
            for (var i = 0; i < this._sumBalloon; i++) {
                var balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon");
                balloon.init(this._gestureData, this);
                this._setBallonPosition(balloon, this._sumBalloon, i);
                this._groupBalloon.addChild(balloon);
                this._balloons.push(balloon);
            }
            // this.m_balloon.Init(this._gestureData, this)
            // this._setBallonPosition(this.m_balloon, 1, 0)
            // this._armatureContainer.play(DragonBonesAnimations.Idle, 0)
            this._animationName = DragonBonesAnimations.Dead;
            this._gestureType = this._balloons[0].type;
            this._state = EMonsterState.Summon;
            this._armatureContainer.play(DragonBonesAnimations.Arrive, 1, 1, 0, 3);
            this._armatureContainer.addCompleteCallFunc(this._onArmatureComplet, this);
            // this.x = MathUtils.getRandom(this._rect.width, Config.stageWidth - this._rect.width)
            // this.y = MathUtils.getRandom(200, PanelManager.gameScenePanel.groundPos - 200)
        }
    };
    SummonActor.prototype.updateGesture = function () {
        var random = MathUtils.getRandom(this._gestureData.length - 1);
        this.m_gesture.texture = RES.getRes(this._gestureData[random].path);
        this.m_gesture.anchorOffsetX = this.m_gesture.width / 2;
        this.m_gesture.anchorOffsetY = this.m_gesture.height / 2;
        this.m_gesture.x = this._armatureContainer.x + 1;
        this.m_gesture.y = this._armatureContainer.y - 38;
        this.m_gesture.visible = true;
        this._gestureType = this._gestureData[random].type;
        this._score = this._gestureData[random].count;
        this._animationName = this._gestureData[random].balloon;
        this._gestureData.splice(random, 1);
    };
    SummonActor.prototype.gotoIdle = function () {
        // this._armatureContainer.play(DragonBonesAnimations.Idle, 0)
    };
    SummonActor.prototype.gotoRun = function () {
        // this._armatureContainer.play(DragonBonesAnimations.Run, 0)
        GameManager.Instance.stop();
    };
    Object.defineProperty(SummonActor.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    SummonActor.prototype.gotoDead = function () {
        // if (this._state == EMonsterState.Ready && this.y >= 100) {
        this._master.summonBeKill();
        PanelManager.gameScenePanel.boom = true;
        this._gestureType = -1;
        this.m_gesture.visible = false;
        this._armatureContainer.play(this._animationName, 1);
        this._state = EMonsterState.Dead;
        this._armatureContainer.addCompleteCallFunc(this._onArmatureComplet, this);
        PanelManager.gameScenePanel.sceneData.addPower += this._data.Power;
        // if (PanelManager.gameScenePanel.levelStage == ELevelType.Normal) {
        // 	PanelManager.gameScenePanel.Score += this._score
        // }
        if (this._data.Type == ESummonType.Balloon) {
            GameConfig.balloonScore += this._score;
            PanelManager.gameScenePanel.boom = true;
            if (GameConfig.isPlaySound) {
                var channel = GameVoice.ballonBoomSound.play(0, 1);
                channel.volume = GameConfig.soundValue / 100;
            }
        }
        else if (this._data.Type == ESummonType.Monster) {
            if (this._balloons[0] != null) {
                this._balloons[0].balloonExplore(true);
            }
        }
        // }
    };
    SummonActor.prototype.destroy = function () {
        this._armatureContainer.removeCompleteCallFunc(this._onArmatureComplet, this);
        this._destroyBalloon();
        this._armatureContainer.clear();
        this._armatureContainer.visible = false;
        GameObjectPool.getInstance().destroyObject(this);
    };
    SummonActor.prototype.destroyAndRemove = function () {
        _super.prototype.destroyAndRemove.call(this);
        this.destroy();
        PanelManager.gameScenePanel.removeSummonActor(this);
    };
    SummonActor.prototype.update = function (timeElapsed) {
        _super.prototype.update.call(this, timeElapsed);
        if (this._state == EMonsterState.Ready) {
            if (this._isArrive) {
                this.y += timeElapsed * this._speedY;
                if (this.y >= PanelManager.gameScenePanel.groundPos) {
                    this.y = PanelManager.gameScenePanel.groundPos;
                    this._state = EMonsterState.Run;
                    this.gotoRun();
                }
            }
            else {
                var distance = MathUtils.getDistance(this._endX, this._endY, this.x, this.y);
                if (distance <= 10) {
                    this._isArrive = true;
                    return;
                }
                var radian = MathUtils.getRadian2(this.x, this.y, this._endX, this._endY);
                var speed = timeElapsed / 2;
                var tempX = Math.cos(radian) * speed;
                var tempY = Math.sin(radian) * speed;
                var deltaX = parseFloat(tempX.toFixed(2));
                var deltaY = parseFloat(tempY.toFixed(2));
                this.x += deltaX;
                this.y += deltaY;
            }
        }
    };
    Object.defineProperty(SummonActor.prototype, "gestureType", {
        get: function () {
            return this._gestureType;
        },
        set: function (value) {
            this._gestureType = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 更新怪物身上的特效动画
     */
    SummonActor.prototype.updateEffectArmature = function (data) {
        _super.prototype.updateEffectArmature.call(this, data);
    };
    SummonActor.prototype.playEffect = function (data) {
        if (this._state == EMonsterState.Ready) {
            this._effectArmatureContainer.visible = true;
            this._effectArmatureContainer.play(data.skill, 1);
            if (data.result != ESkillResult.SlowSpeed && data.result != ESkillResult.GestureChange) {
                this._state = EMonsterState.Stop;
            }
            if (data.result == ESkillResult.GestureChange) {
                this._gestureType = -1;
                this._changeType = data.param[1];
            }
        }
        // if (this._effectData.type == EEffectType.Fire) {
        // 	this.m_gesture.visible = false
        // 	this._groupBalloon.visible = false
        // 	this._armatureContainer.visible = false
        // 	this._state = EMonsterState.Stop
        // 	GameConfig.balloonScore = 0
        // 	PanelManager.gameScenePanel.boom = true
        // 	PanelManager.gameScenePanel.updateBatter()
        // }
    };
    SummonActor.prototype.changeGestureType = function (a_gestureType) {
        this.gestureType = a_gestureType;
    };
    SummonActor.prototype.onEffectArmatureComplete = function () {
        _super.prototype.onEffectArmatureComplete.call(this);
        if (this._data.Type == ESummonType.Balloon && this._state == EMonsterState.Ready && this._effectResult == ESkillResult.GestureChange) {
            this._gestureData.length = 0;
            for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
                if (GameConfig.gestureConfig[i].type == this._changeType) {
                    this._gestureData.push(GameConfig.gestureConfig[i]);
                }
            }
            this.updateGesture();
        }
    };
    SummonActor.prototype.onEffectArmatureFram = function (event) {
        _super.prototype.onEffectArmatureFram.call(this, event);
        var evt = event.frameLabel;
        switch (evt) {
            case "xiaoshi":
                this._destroyBalloon();
                this._armatureContainer.visible = false;
                break;
        }
    };
    SummonActor.prototype._onArmatureComplet = function () {
        if (this._state == EMonsterState.Dead) {
            this.destroyAndRemove();
        }
        if (this._state == EMonsterState.Summon) {
            this._groupBalloon.visible = true;
            this._armatureContainer.play(DragonBonesAnimations.Idle, 0);
            this._state = EMonsterState.Ready;
            this._armatureContainer.removeCompleteCallFunc(this._onArmatureComplet, this);
        }
    };
    return SummonActor;
}(BaseActor));
__reflect(SummonActor.prototype, "SummonActor");
//# sourceMappingURL=SummonActor.js.map