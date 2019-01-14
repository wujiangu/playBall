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
var LuckyActor = (function (_super) {
    __extends(LuckyActor, _super);
    function LuckyActor() {
        var _this = _super.call(this) || this;
        _this.m_balloon = new Balloon();
        _this.m_groupBalloon.addChild(_this.m_balloon);
        return _this;
    }
    LuckyActor.prototype.Init = function () {
        this.m_sumWeight = 0;
        for (var i = 0; i < GameConfig.luckyConfig.length; i++) {
            this.m_sumWeight += GameConfig.luckyConfig[i].Prob;
            GameConfig.luckyConfig[i].weight = this.m_sumWeight;
        }
        this.m_data = this._RandomLuckyActorData();
        if (this.m_data) {
            this.InitData();
            this.InitGraph();
        }
        else {
            Error("no wolf data");
        }
    };
    LuckyActor.prototype.InitData = function () {
        var name = this.m_data.Animation;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this.m_armature == null) {
            this.m_armature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_armature.ArmatureDisplay = armatureDisplay;
        this.m_armatureContainer.visible = true;
        this.m_armatureContainer.register(this.m_armature, [
            DragonBonesAnimations.Idle,
            DragonBonesAnimations.Dead,
            DragonBonesAnimations.Run,
            DragonBonesAnimations.Hurt,
            DragonBonesAnimations.Explore,
        ]);
        this.m_state = EMonsterState.Ready;
        this.m_speedY = 0;
        this.m_speedX = 0.18;
        this.m_armatureContainer.scaleX = this.m_data.Scale;
        this.m_armatureContainer.scaleY = this.m_data.Scale;
        this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplete, this);
        this.m_rect.width = this.m_data.Width;
        this.m_rect.height = this.m_data.Height;
        this.m_width = this.m_data.Width;
        this.m_height = this.m_data.Height;
        this.ResetGestureData();
    };
    LuckyActor.prototype.ResetGestureData = function () {
        this.m_gestureData.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal)
                this.m_gestureData.push(GameConfig.gestureConfig[i]);
        }
    };
    LuckyActor.prototype.InitGraph = function () {
        this.x = Config.stageWidth + this.m_width / 2;
        this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200);
        this.GotoIdle();
        this.m_balloon.Init(this.m_gestureData, this);
        this._SetBallonPosition(this.m_balloon, 1, 0);
    };
    LuckyActor.prototype.GotoIdle = function () {
        this.m_state = EMonsterState.Ready;
        this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0);
    };
    LuckyActor.prototype.GotoHurt = function () {
        this.m_state = EMonsterState.Hurt;
        this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 1);
    };
    LuckyActor.prototype.Destroy = function () {
        // this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
        this.m_armatureContainer.clear();
        this.m_effectArmatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    LuckyActor.prototype.Update = function (timeElapsed) {
        if (this.m_state == EMonsterState.Ready) {
            this.x -= timeElapsed * this.m_speedX;
            if (this.x <= -this.m_width / 2) {
                this.x = -this.m_width / 2;
                this.m_state = EMonsterState.Dead;
                this.Destroy();
                PanelManager.m_gameScenePanel.RemoveLuckyActor(this);
                // this.GotoRun()
            }
        }
    };
    LuckyActor.prototype.UpdateGesture = function () {
        this.m_balloon.UpdateColorAndGesture();
        var channel = GameVoice.ballonBoomSound.play(0, 1);
        channel.volume = GameConfig.soundValue / 100;
        GameConfig.balloonScore += this.m_balloon.Score;
        PanelManager.m_gameScenePanel.Boom = true;
        this.GotoHurt();
    };
    Object.defineProperty(LuckyActor.prototype, "ballon", {
        get: function () {
            return this.m_balloon;
        },
        enumerable: true,
        configurable: true
    });
    LuckyActor.prototype._OnArmatureComplete = function () {
        if (this.m_state == EMonsterState.Hurt) {
            this.GotoIdle();
        }
    };
    LuckyActor.prototype._RandomLuckyActorData = function () {
        var random = MathUtils.getRandom(1, this.m_sumWeight);
        for (var i = 0; i < GameConfig.luckyConfig.length; i++) {
            if (random <= GameConfig.luckyConfig[i].weight) {
                return GameConfig.luckyConfig[i];
            }
        }
        return null;
    };
    return LuckyActor;
}(BaseActor));
__reflect(LuckyActor.prototype, "LuckyActor");
//# sourceMappingURL=LuckyActor.js.map