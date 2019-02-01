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
        _this._balloonArmatureContainer.addCompleteCallFunc(_this._OnBalloonComplete, _this);
        _this._effectArmatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this._effectArmatureContainer);
        var effectArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("bianhua", "bianhua");
        if (_this._effectArmature == null) {
            _this._effectArmature = new DragonBonesArmature(effectArmatureDisplay);
        }
        _this._effectArmature.ArmatureDisplay = effectArmatureDisplay;
        _this._effectArmatureContainer.register(_this._effectArmature, ["bianhua"]);
        _this._effectArmatureContainer.scaleX = 1;
        _this._effectArmatureContainer.scaleY = 1;
        _this._effectArmatureContainer.addCompleteCallFunc(_this._OnEffectArmatureComplete, _this);
        _this._gesture = new egret.Bitmap();
        _this.addChild(_this._gesture);
        _this._gesture.scaleX = 0.55;
        _this._gesture.scaleY = 0.55;
        // this._balloon.addEventListener(egret.Event.COMPLETE, this._OnBalloonComplete, this)
        _this.m_guideArmatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this.m_guideArmatureContainer);
        var guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("xinshouyindao", "xinshouyindao");
        var guideArmature = new DragonBonesArmature(guideDisplay);
        guideArmature.ArmatureDisplay = guideDisplay;
        _this.m_guideArmatureContainer.register(guideArmature, ["xinshouyindao2"]);
        _this.m_guideArmatureContainer.y = 30;
        _this.m_guideArmatureContainer.scaleX = 0.8;
        _this.m_guideArmatureContainer.scaleY = 0.8;
        return _this;
    }
    Balloon.prototype.Init = function (data, actor) {
        this._score = 0;
        this._root = actor;
        this._rop.scaleX = 0;
        this._rop.scaleY = 0;
        this._isChangeEasy = false;
        this.UpdateGesture(data, true);
        this.m_guideArmatureContainer.visible = false;
        // this.m_guideArmatureContainer.play("xinshouyindao2", 0)
    };
    Balloon.prototype.GuideStart = function () {
        this.m_guideArmatureContainer.visible = true;
        this.m_guideArmatureContainer.play("xinshouyindao2", 0);
    };
    Balloon.prototype.UpdateGesture = function (data, isInit) {
        if (isInit === void 0) { isInit = false; }
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
        // let colorIndex = MathUtils.getRandom(2)
        // this._animationName = this._animations[colorIndex]
        this._balloonArmatureContainer.play(this._animationName, 1);
        this._balloonArmatureContainer.pause(this._animationName);
        this.scaleX = 1;
        this.scaleY = 1;
        if (data.length <= 0)
            this._root.ResetGestureData();
    };
    Balloon.prototype.ChangeToEasy = function () {
        this._isChangeEasy = true;
        this._type = 0;
        this._effectArmatureContainer.play("bianhua", 1, 1, 0, 1.6);
        // this.UpdateColorAndGesture()		
    };
    Balloon.prototype.UpdateColorAndGesture = function () {
        this._type = 0;
        this._gesture.visible = false;
        this._balloonArmatureContainer.play("explore", 1, 1, 0, 3);
    };
    Balloon.prototype.SetLine = function (count, value) {
        if (count === void 0) { count = 1; }
        if (value === void 0) { value = 0; }
        this._rop.x = this._balloonArmatureContainer.x;
        this._rop.y = this._balloonArmatureContainer.y - 10;
        this._rop.scaleX = 1;
        if (count == 1) {
            this._rop.rotation = 0;
            this._rop.scaleY = 15;
        }
        else if (count == 2) {
            this._rop.scaleY = 18;
            if (value == 0) {
                this._rop.rotation = -35;
            }
            else {
                this._rop.rotation = 35;
            }
        }
        else if (count == 3) {
            this._rop.scaleY = 24;
            if (value == 0) {
                this._rop.rotation = 0;
            }
            else if (value == 1) {
                this._rop.rotation = -50;
            }
            else {
                this._rop.rotation = 50;
            }
        }
    };
    Balloon.prototype.BossSetLine = function (count, value) {
        if (count === void 0) { count = 1; }
        if (value === void 0) { value = 0; }
        this._rop.x = this._balloonArmatureContainer.x;
        this._rop.y = this._balloonArmatureContainer.y - 10;
        this._rop.scaleX = 0.5;
        if (count == 1) {
            this._rop.rotation = 0;
            this._rop.scaleY = 30;
        }
        else if (count == 2) {
            this._rop.scaleY = 50;
            if (value == 0) {
                this._rop.rotation = -15;
            }
            else {
                this._rop.rotation = 15;
            }
        }
        else if (count == 3) {
            this._rop.scaleY = 30;
            if (value == 0) {
                this._rop.rotation = 0;
            }
            else if (value == 1) {
                this._rop.rotation = -30;
            }
            else {
                this._rop.rotation = 30;
            }
        }
    };
    Balloon.prototype.BalloonExplore = function (isGestureExplore) {
        if (isGestureExplore === void 0) { isGestureExplore = true; }
        this._rop.scaleX = 0;
        this._rop.scaleY = 0;
        this._gesture.visible = false;
        // this._balloon.play(1)
        this._balloonArmatureContainer.play(this._animationName, 1);
        var channel = GameVoice.ballonBoomSound.play(0, 1);
        channel.volume = GameConfig.soundValue / 100;
        GameConfig.balloonScore += this._score;
        // if (PanelManager.m_gameScenePanel != null) {
        // 	PanelManager.m_gameScenePanel.Score += this._score
        // }
        if (isGestureExplore)
            PanelManager.m_gameScenePanel.Boom = true;
        if (this._root.Balloons != null && this._root.Balloons.length <= 0) {
            this._root.GotoDead();
        }
        // if (this._root.State == EMonsterState.Ready) {
        // 	let posY = this._root.y - 20
        // 	egret.Tween.get(this._root).to({y:posY}, 50)
        // }
        // egret.setTimeout(this._OnBalloonBoom, this, 200)
    };
    Balloon.prototype._OnBalloonBoom = function () {
        // this._boomSound.play(0, 1)
    };
    Balloon.prototype.Destroy = function () {
    };
    Balloon.prototype.Update = function (delay) {
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
    Object.defineProperty(Balloon.prototype, "Score", {
        get: function () {
            return this._score;
        },
        enumerable: true,
        configurable: true
    });
    Balloon.prototype._OnBalloonComplete = function (e) {
        if (this._type == 0) {
            this.UpdateGesture(this._root.GestureData);
        }
        else {
            this._root.BalloonExploreHandle();
            GameObjectPool.getInstance().destroyObject(this);
            this._root.RemoveBalloon(this);
        }
    };
    Balloon.prototype._OnEffectArmatureComplete = function (e) {
        this.UpdateGesture(this._root.GestureData);
    };
    return Balloon;
}(egret.Sprite));
__reflect(Balloon.prototype, "Balloon");
//# sourceMappingURL=Balloon.js.map