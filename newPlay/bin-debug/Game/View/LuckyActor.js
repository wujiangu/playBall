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
        _this._balloon = new Balloon();
        _this._groupBalloon.addChild(_this._balloon);
        return _this;
    }
    LuckyActor.prototype.init = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        this._sumWeight = 0;
        for (var i = 0; i < GameConfig.luckyConfig.length; i++) {
            this._sumWeight += GameConfig.luckyConfig[i].Prob;
            GameConfig.luckyConfig[i].weight = this._sumWeight;
        }
        this._data = this._randomLuckyActorData();
        if (this._data) {
            this.initData();
            this.initGraph(x, y);
        }
        else {
            Error("no wolf data");
        }
    };
    LuckyActor.prototype.initData = function () {
        var name = this._data.Animation;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this._armature == null) {
            this._armature = new DragonBonesArmature(armatureDisplay);
        }
        this._armature.ArmatureDisplay = armatureDisplay;
        this._armatureContainer.visible = true;
        this._armatureContainer.register(this._armature, [
            DragonBonesAnimations.Idle,
            DragonBonesAnimations.Dead,
            DragonBonesAnimations.Run,
            DragonBonesAnimations.Hurt,
            DragonBonesAnimations.Explore,
        ]);
        this._state = EMonsterState.Ready;
        this._speedY = 0;
        this._speedX = this._data.Speed / 10;
        this._armatureContainer.scaleX = this._data.Scale;
        this._armatureContainer.scaleY = this._data.Scale;
        this._armatureContainer.addCompleteCallFunc(this._onArmatureComplete, this);
        this._rect.width = this._data.Width;
        this._rect.height = this._data.Height;
        this._width = this._data.Width;
        this._height = this._data.Height;
        this.resetGestureData();
    };
    LuckyActor.prototype.resetGestureData = function () {
        this._gestureData.length = 0;
        for (var i = 0; i < this._data.balloon.length; i++) {
            var id = this._data.balloon[i];
            if (this._data.balloon.length == 1)
                id = id.toString();
            this._gestureData.push(GameConfig.gestureTable[id]);
        }
    };
    LuckyActor.prototype.initGraph = function (x, y) {
        this.x = Config.stageWidth + this._width / 2;
        this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200);
        if (x != null && y != null) {
            this.x = x;
            this.y = y;
        }
        this.gotoIdle();
        this._balloon.init(this._gestureData, this);
        this._setBallonPosition(this._balloon, 1, 0);
    };
    LuckyActor.prototype.gotoIdle = function () {
        this._speedX = 0.16 * 1.3;
        this._state = EMonsterState.Ready;
        this._armatureContainer.play(DragonBonesAnimations.Idle, 0);
    };
    LuckyActor.prototype.gotoHurt = function () {
        // this._state = EMonsterState.Hurt
        this._speedX = 0.05;
        this._armatureContainer.play(DragonBonesAnimations.Hurt, 1);
    };
    LuckyActor.prototype.destroy = function () {
        // this._armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
        this._armatureContainer.clear();
        this._effectArmatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    LuckyActor.prototype.update = function (timeElapsed) {
        if (this._state == EMonsterState.Ready) {
            this.x -= timeElapsed * this._speedX;
            if (this.x <= -this._width / 2) {
                this.x = -this._width / 2;
                this._state = EMonsterState.Dead;
                this.destroy();
                PanelManager.gameScenePanel.removeLuckyActor(this);
                // this.gotoRun()
            }
        }
    };
    LuckyActor.prototype.updateGesture = function () {
        // if (this._state == EMonsterState.Ready) {
        this._balloon.updateColorAndGesture();
        var channel = GameVoice.ballonBoomSound.play(0, 1);
        channel.volume = GameConfig.soundValue / 100;
        GameConfig.balloonScore += this._balloon.score;
        PanelManager.gameScenePanel.boom = true;
        this.gotoHurt();
        // }
    };
    Object.defineProperty(LuckyActor.prototype, "ballon", {
        get: function () {
            return this._balloon;
        },
        enumerable: true,
        configurable: true
    });
    LuckyActor.prototype._onArmatureComplete = function () {
        // if (this._state == EMonsterState.Hurt) {
        this.gotoIdle();
        // }
    };
    LuckyActor.prototype._randomLuckyActorData = function () {
        var random = MathUtils.getRandom(1, this._sumWeight);
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