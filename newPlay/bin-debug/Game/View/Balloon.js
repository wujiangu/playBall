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
var Balloon = (function (_super) {
    __extends(Balloon, _super);
    function Balloon() {
        var _this = _super.call(this) || this;
        _this.name = "Balloon";
        _this._gestureData = new Array();
        _this._rop = Common.createBitmap("imgRop_png");
        _this.addChild(_this._rop);
        _this._balloonArmatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this._balloonArmatureContainer);
        _this._animations = ["hong", "huang", "lan", "explore", "lv", "zi"];
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("qiqiu", "qiqiu");
        if (_this._balloonArmature == null) {
            _this._balloonArmature = new DragonBonesArmature(armatureDisplay);
        }
        _this._balloonArmature.ArmatureDisplay = armatureDisplay;
        _this._balloonArmatureContainer.register(_this._balloonArmature, _this._animations);
        _this._balloonArmatureContainer.scaleX = 1;
        _this._balloonArmatureContainer.scaleY = 1;
        _this._effectArmatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this._effectArmatureContainer);
        // let effectArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("bianhua", "bianhua")
        // if (this._effectArmature == null) {
        // 	this._effectArmature = new DragonBonesArmature(effectArmatureDisplay)
        // }
        // this._effectArmature.ArmatureDisplay = effectArmatureDisplay
        // this._effectArmatureContainer.register(this._effectArmature, ["bianhua"])
        // this._effectArmatureContainer.scaleX = 1
        // this._effectArmatureContainer.scaleY = 1
        // this._effectArmatureContainer.addCompleteCallFunc(this._onEffectArmatureComplete, this)
        _this._gesture = new egret.Bitmap();
        _this.addChild(_this._gesture);
        _this._gesture.scaleX = 0.55;
        _this._gesture.scaleY = 0.55;
        // this._balloon.addEventListener(egret.Event.COMPLETE, this._onBalloonComplete, this)
        _this._guideArmatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this._guideArmatureContainer);
        var guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("xinshouyindao", "xinshouyindao");
        var guideArmature = new DragonBonesArmature(guideDisplay);
        guideArmature.ArmatureDisplay = guideDisplay;
        _this._guideArmatureContainer.register(guideArmature, ["xinshouyindao2"]);
        _this._guideArmatureContainer.y = 30;
        _this._guideArmatureContainer.scaleX = 0.8;
        _this._guideArmatureContainer.scaleY = 0.8;
        return _this;
    }
    Balloon.prototype.init = function (data, actor) {
        this._score = 0;
        this._root = actor;
        this._rop.scaleX = 0;
        this._rop.scaleY = 0;
        this._rop.height = 0;
        this._isChangeEasy = false;
        this.updateGesture(data, true);
        this._guideArmatureContainer.visible = false;
        this._effectResult = ESkillResult.Invalid;
        this._effectArmatureContainer.visible = false;
        this._balloonArmatureContainer.removeCompleteCallFunc(this._onBalloonComplete, this);
        // this._guideArmatureContainer.play("xinshouyindao2", 0)
    };
    Balloon.prototype.guideStart = function () {
        this._guideArmatureContainer.visible = true;
        this._guideArmatureContainer.play("xinshouyindao2", 0);
    };
    /**
     * 更新气球身上的特效动画
     */
    Balloon.prototype.updateEffectArmature = function (data) {
        this._effectArmatureContainer.clear();
        var effectArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.skillFile, data.skillFile);
        if (this._effectArmature == null) {
            this._effectArmature = new DragonBonesArmature(effectArmatureDisplay);
        }
        this._effectArmature.ArmatureDisplay = effectArmatureDisplay;
        this._effectArmatureContainer.register(this._effectArmature, [data.skill]);
        this._effectArmatureContainer.scaleX = 1;
        this._effectArmatureContainer.scaleY = 1;
        this._effectArmatureContainer.x = data.skillPosX;
        this._effectArmatureContainer.y = data.skillPosY;
        this._changeType = data.param[1];
        this._effectResult = data.result;
        this._effectArmatureContainer.addCompleteCallFunc(this._onEffectArmatureComplete, this);
    };
    Balloon.prototype.playEffect = function (data) {
        if (this._root.state == EMonsterState.Ready) {
            switch (this._effectResult) {
                case ESkillResult.Kill:
                    this._type = -1;
                    break;
                case ESkillResult.GestureChange:
                    this._type = 0;
                    break;
            }
            this._effectArmatureContainer.visible = true;
            this._effectArmatureContainer.play(data.skill, 1);
        }
    };
    Balloon.prototype.updateGesture = function (data, isInit) {
        if (isInit === void 0) { isInit = false; }
        if (data.length > 0) {
            var random = MathUtils.getRandom(data.length - 1);
            this._gesture.texture = RES.getRes(data[random].path);
            this._gesture.anchorOffsetX = this._gesture.width / 2;
            this._gesture.anchorOffsetY = this._gesture.height / 2;
            this._gesture.x = this._balloonArmatureContainer.x + 1;
            this._gesture.y = this._balloonArmatureContainer.y - 38;
            this._gesture.visible = true;
            this._type = data[random].type;
            this._score = data[random].count;
            this._animationName = data[random].balloon;
            data.splice(random, 1);
            this._balloonArmatureContainer.play(this._animationName, 1);
            this._balloonArmatureContainer.pause(this._animationName);
        }
        this.scaleX = 1;
        this.scaleY = 1;
        if (data.length <= 0)
            this._root.resetGestureData();
    };
    Balloon.prototype.changeToEasy = function () {
        this._isChangeEasy = true;
        this._type = 0;
        this._effectArmatureContainer.play("bianhua", 1, 1, 0, 1.6);
    };
    Balloon.prototype.updateColorAndGesture = function () {
        this._type = 0;
        this._gesture.visible = false;
        this._balloonArmatureContainer.play("explore", 1, 1, 0, 3);
        this._balloonArmatureContainer.addCompleteCallFunc(this._onBalloonComplete, this);
    };
    Balloon.prototype.calculateRop = function (x1, y1) {
        var distance = MathUtils.getDistance(x1, y1, 0, -60);
        var radian = MathUtils.getRadian2(x1, y1, 0, -60);
        var rotation = MathUtils.getAngle(radian) - 90;
        this._ropRotation = rotation;
        this._rop.height = distance;
    };
    Object.defineProperty(Balloon.prototype, "ropRotation", {
        get: function () {
            return this._ropRotation;
        },
        enumerable: true,
        configurable: true
    });
    Balloon.prototype.setLine = function () {
        this._rop.x = this._balloonArmatureContainer.x;
        this._rop.y = this._balloonArmatureContainer.y - 10;
        this.calculateRop(this.x, this.y);
        this._rop.rotation = this._ropRotation;
        this._rop.scaleX = 1;
        this._rop.scaleY = 1;
    };
    Balloon.prototype.balloonExplore = function (isSummon) {
        if (isSummon === void 0) { isSummon = false; }
        this._rop.scaleX = 0;
        this._rop.scaleY = 0;
        this._gesture.visible = false;
        // this._balloon.play(1)
        this._balloonArmatureContainer.play(this._animationName, 1);
        var channel = GameVoice.ballonBoomSound.play(0, 1);
        channel.volume = GameConfig.soundValue / 100;
        GameConfig.balloonScore += this._score;
        if (isSummon == false) {
            this._balloonArmatureContainer.addCompleteCallFunc(this._onBalloonComplete, this);
        }
        if (isSummon == false && this._root.balloons != null && this._root.balloons.length <= 0) {
            this._root.gotoDead();
            // this._balloonArmatureContainer.addCompleteCallFunc(this._onBalloonComplete, this)
        }
        // if (this._root.state == EMonsterState.Ready) {
        // 	let posY = this._root.y - 20
        // 	egret.Tween.get(this._root).to({y:posY}, 50)
        // }
        // egret.setTimeout(this._OnBalloonBoom, this, 200)
    };
    Balloon.prototype._onBalloonBoom = function () {
        // this._boomSound.play(0, 1)
    };
    Balloon.prototype.destroy = function () {
    };
    Balloon.prototype.update = function (delay) {
    };
    Object.defineProperty(Balloon.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Balloon.prototype, "rop", {
        get: function () {
            return this._rop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Balloon.prototype, "width", {
        get: function () {
            // return this._balloon.width
            return 80;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Balloon.prototype, "root", {
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Balloon.prototype, "score", {
        get: function () {
            return this._score;
        },
        enumerable: true,
        configurable: true
    });
    Balloon.prototype._onBalloonComplete = function (e) {
        if (this._type == 0) {
            this.updateGesture(this._root.gestureData);
        }
        else if (this.type == -1) {
            this._root.balloonExploreHandle();
            GameObjectPool.getInstance().destroyObject(this);
        }
        else {
            this._root.balloonExploreHandle();
            GameObjectPool.getInstance().destroyObject(this);
            Common.log("_onBalloonComplete");
            this._root.removeBalloon(this);
        }
    };
    Balloon.prototype._onEffectArmatureComplete = function (e) {
        // this.updateGesture(this._root.gestureData)
        switch (this._effectResult) {
            case ESkillResult.Kill:
                this._effectResult = ESkillResult.Invalid;
                this._root.ballExplosion(this);
                this.balloonExplore();
                break;
            case ESkillResult.GestureChange:
                this._gestureData.length = 0;
                for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
                    if (GameConfig.gestureConfig[i].type == this._changeType) {
                        this._gestureData.push(GameConfig.gestureConfig[i]);
                    }
                }
                Common.log("_onEffectArmatureComplete");
                this.updateGesture(this._gestureData);
                break;
        }
    };
    return Balloon;
}(egret.Sprite));
__reflect(Balloon.prototype, "Balloon");
//# sourceMappingURL=Balloon.js.map