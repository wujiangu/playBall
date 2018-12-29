var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SummonActor = (function (_super) {
    __extends(SummonActor, _super);
    function SummonActor() {
        var _this = _super.call(this) || this;
        _this.m_gesture = new egret.Bitmap();
        _this.addChild(_this.m_gesture);
        _this.m_gesture.scaleX = 0.5;
        _this.m_gesture.scaleY = 0.5;
        _this._animations = ["hong", "huang", "lan"];
        return _this;
    }
    SummonActor.prototype.Init = function (a_data, a_x, a_y) {
        this.m_sumWeight = 0;
        // for (let i = 0; i < GameConfig.luckyConfig.length; i++) {
        // 	this.m_sumWeight += GameConfig.luckyConfig[i].Prob
        // 	GameConfig.luckyConfig[i].weight = this.m_sumWeight
        // }
        // this.m_data = this._RandomSummonActorData()
        this.m_data = GameConfig.summonConfig[a_data.id.toString()];
        this.m_gesturDiff = a_data.diff;
        this.m_gestureData.length = 0;
        if (a_data.ids.length > 0) {
            for (var i = 0; i < a_data.ids.length; i++) {
                var id = a_data.ids[i];
                for (var i_1 = 0; i_1 < GameConfig.gestureConfig.length; i_1++) {
                    if (GameConfig.gestureConfig[i_1].type == id) {
                        this.m_gestureData.push(GameConfig.gestureConfig[i_1]);
                    }
                }
            }
        }
        else {
            for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
                if (this.m_gesturDiff == EGestureDifficult.Mix) {
                    this.m_gestureData.push(GameConfig.gestureConfig[i]);
                }
                else {
                    if (GameConfig.gestureConfig[i].difficult == this.m_gesturDiff)
                        this.m_gestureData.push(GameConfig.gestureConfig[i]);
                }
            }
        }
        this.m_isArrive = false;
        if (this.m_data) {
            this.InitData();
            this.InitGraph();
            this.m_endX = Math.max(a_x, this.w);
            this.m_endY = Math.min(a_y, Config.stageWidth - this.w);
        }
        else {
            Error("no wolf data");
        }
    };
    SummonActor.prototype.InitData = function () {
        var name = this.m_data.Animation;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this.m_armature == null) {
            this.m_armature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_armature.ArmatureDisplay = armatureDisplay;
        this.m_armatureContainer.register(this.m_armature, this._animations);
        this.m_state = EMonsterState.Ready;
        this.m_speedY = this.m_data.Speed / 100;
        this.m_speedX = 0.1;
        this.m_armatureContainer.scaleX = this.m_data.Scale;
        this.m_armatureContainer.scaleY = this.m_data.Scale;
        this.m_rect.width = this.m_data.Width;
        this.m_rect.height = this.m_data.Height;
        this.m_width = this.m_data.Width;
        this.m_height = this.m_data.Height;
        // this.m_gestureData.length = 0
        // for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
        // 	this.m_gestureData.push(GameConfig.gestureConfig[i])
        // }
    };
    SummonActor.prototype.InitGraph = function () {
        this.x = Config.stageWidth + this.m_width / 2;
        this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200);
        this.UpdateGesture();
    };
    SummonActor.prototype.UpdateGesture = function () {
        var random = MathUtils.getRandom(this.m_gestureData.length - 1);
        this.m_gesture.texture = RES.getRes(this.m_gestureData[random].path);
        this.m_gesture.anchorOffsetX = this.m_gesture.width / 2;
        this.m_gesture.anchorOffsetY = this.m_gesture.height / 2;
        this.m_gesture.x = this.m_armatureContainer.x + 2;
        this.m_gesture.y = this.m_armatureContainer.y - 38;
        this.m_gesture.visible = true;
        this.m_gestureType = this.m_gestureData[random].type;
        this.m_score = this.m_gestureData[random].count;
        this.m_gestureData.splice(random, 1);
        var colorIndex = MathUtils.getRandom(this._animations.length - 1);
        this._animationName = this._animations[colorIndex];
        this.m_armatureContainer.play(this._animationName, 1);
        this.m_armatureContainer.pause(this._animationName);
    };
    SummonActor.prototype.GotoIdle = function () {
        // this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
    };
    SummonActor.prototype.GotoRun = function () {
        // this.m_armatureContainer.play(DragonBonesAnimations.Run, 0)
        GameManager.Instance.Stop();
    };
    SummonActor.prototype.GotoDead = function () {
        this.m_gesture.visible = false;
        this.m_armatureContainer.play(this._animationName, 1);
        this.m_state = EMonsterState.Dead;
        this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplet, this);
        PanelManager.m_gameScenePanel.Power += this.m_data.Power;
        GameVoice.ballonBoomSound.play(0, 1);
    };
    SummonActor.prototype.Destroy = function () {
        // this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
        this.m_armatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    SummonActor.prototype.Update = function (timeElapsed) {
        if (this.m_state == EMonsterState.Ready) {
            if (this.m_isArrive) {
                this.y += timeElapsed * this.m_speedY;
                if (this.y >= PanelManager.m_gameScenePanel.GroundPos) {
                    this.y = PanelManager.m_gameScenePanel.GroundPos;
                    this.m_state = EMonsterState.Run;
                    this.GotoRun();
                }
            }
            else {
                var distance = MathUtils.getDistance(this.m_endX, this.m_endY, this.x, this.y);
                if (distance <= 10) {
                    this.m_isArrive = true;
                    return;
                }
                var radian = MathUtils.getRadian2(this.x, this.y, this.m_endX, this.m_endY);
                var speed = timeElapsed;
                var tempX = Math.cos(radian) * speed;
                var tempY = Math.sin(radian) * speed;
                var deltaX = parseFloat(tempX.toFixed(2));
                var deltaY = parseFloat(tempY.toFixed(2));
                this.x += deltaX;
                this.y += deltaY;
            }
        }
    };
    Object.defineProperty(SummonActor.prototype, "GestureType", {
        get: function () {
            return this.m_gestureType;
        },
        enumerable: true,
        configurable: true
    });
    // public UpdateGesture() {
    // 	// this.m_balloon.UpdateColorAndGesture()
    // 	// if (PanelManager.m_gameScenePanel != null) {
    // 	// 	PanelManager.m_gameScenePanel.Score += this.m_balloon.Score
    // 	// }
    // }
    SummonActor.prototype._OnArmatureComplet = function () {
        if (this.m_state == EMonsterState.Dead) {
            this.Destroy();
            PanelManager.m_gameScenePanel.RemoveSummonActor(this);
        }
    };
    SummonActor.prototype._RandomSummonActorData = function () {
        var random = MathUtils.getRandom(1, this.m_sumWeight);
        for (var i = 0; i < GameConfig.luckyConfig.length; i++) {
            if (random <= GameConfig.luckyConfig[i].weight) {
                return GameConfig.luckyConfig[i];
            }
        }
        return null;
    };
    return SummonActor;
}(BaseActor));
__reflect(SummonActor.prototype, "SummonActor");
//# sourceMappingURL=SummonActor.js.map