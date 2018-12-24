var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Balloon = (function (_super) {
    __extends(Balloon, _super);
    function Balloon() {
        var _this = _super.call(this) || this;
        _this.name = "Balloon";
        var data = RES.getRes("balloonBlue_json");
        var texture = RES.getRes("balloonBlue_png");
        _this._balloonData = new egret.MovieClipDataFactory(data, texture);
        _this._balloon = new egret.MovieClip(_this._balloonData.generateMovieClipData("balloonBlue"));
        // this._balloon = Common.createBitmap("balloon_png")
        _this.addChild(_this._balloon);
        _this._balloon.anchorOffsetX = _this._balloon.width / 2;
        _this._balloon.anchorOffsetY = _this._balloon.height / 2;
        _this._gesture = new egret.Bitmap();
        _this.addChild(_this._gesture);
        _this._rop = Common.createBitmap("imgRop_png");
        _this.addChild(_this._rop);
        // this._boomSound = RES.getRes("balloonBoom_mp3")
        // this._boomSound.load(AudioManager.balloonBoom)
        _this._balloon.addEventListener(egret.Event.COMPLETE, _this._OnBalloonComplete, _this);
        return _this;
    }
    Balloon.prototype.Init = function (data, actor) {
        this._score = 0;
        this._root = actor;
        this._rop.scaleX = 0;
        this._rop.scaleY = 0;
        var random = MathUtils.getRandom(data.length - 1);
        this._ChangeBalloonAnimate(data[random].balloon);
        this._balloon.gotoAndStop(1);
        this._balloon.anchorOffsetY = this._balloon.height;
        this._balloon.x = -20;
        this._gesture.texture = RES.getRes(data[random].path);
        this._gesture.anchorOffsetX = this._gesture.width / 2;
        this._gesture.anchorOffsetY = this._gesture.height / 2;
        this._gesture.x = 8;
        this._gesture.visible = true;
        this._type = data[random].type;
        this._score = data[random].count;
        this.anchorOffsetY = this.height;
        data.splice(random, 1);
    };
    Balloon.prototype.SetLine = function (count, value) {
        if (count === void 0) { count = 1; }
        if (value === void 0) { value = 0; }
        this._rop.x = this._balloon.x + 30;
        this._rop.y = this._balloon.y + this._balloon.height / 2;
        this._rop.scaleX = 2;
        if (count == 1) {
            this._rop.rotation = 0;
            this._rop.scaleY = 40;
        }
        else if (count == 2) {
            this._rop.scaleY = 55;
            if (value == 0) {
                this._rop.rotation = -45;
            }
            else {
                this._rop.rotation = 45;
            }
        }
        else if (count == 3) {
            this._rop.scaleY = 80;
            if (value == 0) {
                this._rop.rotation = 0;
            }
            else if (value == 1) {
                this._rop.rotation = -60;
            }
            else {
                this._rop.rotation = 60;
            }
        }
    };
    Balloon.prototype.BalloonExplore = function () {
        this._rop.scaleX = 0;
        this._rop.scaleY = 0;
        this._gesture.visible = false;
        this._balloon.play(1);
        if (this._root.State == EMonsterState.Ready) {
            var posY = this._root.y - 20;
            egret.Tween.get(this._root).to({ y: posY }, 50);
        }
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
            return this._balloon.width;
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
        this._root.BalloonExploreHandle();
        GameObjectPool.getInstance().destroyObject(this);
        this._root.removeChild(this);
    };
    Balloon.prototype._ChangeBalloonAnimate = function (name) {
        this._balloonData.mcDataSet = RES.getRes(name + "_json");
        this._balloonData.texture = RES.getRes(name + "_png");
        this._balloon.movieClipData = this._balloonData.generateMovieClipData(name);
    };
    return Balloon;
}(egret.Sprite));
__reflect(Balloon.prototype, "Balloon");
//# sourceMappingURL=Balloon.js.map