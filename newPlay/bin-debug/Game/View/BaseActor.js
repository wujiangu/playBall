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
var BaseActor = (function (_super) {
    __extends(BaseActor, _super);
    function BaseActor() {
        var _this = _super.call(this) || this;
        _this.m_groupBalloon = new egret.DisplayObjectContainer();
        _this.addChild(_this.m_groupBalloon);
        _this.m_armatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this.m_armatureContainer);
        _this.m_effectArmatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this.m_effectArmatureContainer);
        _this.m_gestureData = new Array();
        _this.m_normalGesture = new Array();
        _this.m_hardGesture = new Array();
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
                _this.m_normalGesture.push(GameConfig.gestureConfig[i]);
            }
            else {
                _this.m_hardGesture.push(GameConfig.gestureConfig[i]);
            }
        }
        // var distance:number = 20;           /// 阴影的偏移距离，以像素为单位
        // var angle:number = 45;              /// 阴影的角度，0 到 360 度
        // var color:number = 0x000000;        /// 阴影的颜色，不包含透明度
        // var alpha:number = 0.7;             /// 光晕的颜色透明度，是对 color 参数的透明度设定
        // var blurX:number = 16;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        // var blurY:number = 16;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        // var strength:number = 0.65;                /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        // var quality:number = egret.BitmapFilterQuality.LOW;              /// 应用滤镜的次数，暂无实现
        // var inner:boolean = false;            /// 指定发光是否为内侧发光
        // var knockout:boolean = false;            /// 指定对象是否具有挖空效果
        // this.m_dropShadowFilter = new egret.DropShadowFilter(distance, angle, color, alpha, blurX, blurY,
        // strength, quality, inner, knockout)
        _this.m_rect = new egret.Rectangle();
        return _this;
        // this.m_shape = new egret.Shape()
        // this.addChild(this.m_shape)
        // this.m_shape.graphics.beginFill( 0xff0000, 0.5);
    }
    BaseActor.prototype.ResetNormalGesture = function () {
        this.m_normalGesture.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
                this.m_normalGesture.push(GameConfig.gestureConfig[i]);
            }
        }
    };
    BaseActor.prototype.ResetHardGesture = function () {
        this.m_hardGesture.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Hard) {
                this.m_hardGesture.push(GameConfig.gestureConfig[i]);
            }
        }
    };
    BaseActor.prototype.GotoIdle = function () {
    };
    BaseActor.prototype.GotoHurt = function () {
    };
    BaseActor.prototype.GotoDead = function () {
    };
    BaseActor.prototype.GotoExplore = function () { };
    BaseActor.prototype.GotoRun = function () {
    };
    BaseActor.prototype.GotoSlow = function () { };
    Object.defineProperty(BaseActor.prototype, "w", {
        get: function () {
            return this.m_width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "h", {
        get: function () {
            return this.m_height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "Balloons", {
        get: function () {
            return this.m_balloons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "GestureData", {
        get: function () {
            return this.m_gestureData;
        },
        set: function (value) {
            this.m_gestureData = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "SpeedVertical", {
        set: function (value) {
            this.m_speedY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "SpeedHorizon", {
        set: function (value) {
            this.m_speedX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "ActorTableData", {
        get: function () {
            return this.m_data;
        },
        enumerable: true,
        configurable: true
    });
    BaseActor.prototype.Update = function (timeElapsed) {
    };
    BaseActor.prototype.ResetGestureData = function () {
    };
    BaseActor.prototype.SetVertical = function (addNum) {
        this.ResetVertical();
        this.m_addNum = this.m_speedY * addNum;
        this.m_speedY += this.m_addNum;
    };
    BaseActor.prototype.ResetVertical = function () {
        this.m_speedY -= this.m_addNum;
    };
    BaseActor.prototype.BalloonExploreHandle = function () { };
    BaseActor.prototype.RemoveBalloon = function (balloon) { };
    BaseActor.prototype.PlayEffect = function () { };
    BaseActor.prototype._SetBallonPosition = function (balloon, count, value) {
        if (value === void 0) { value = 0; }
        if (count == 1) {
            balloon.x = 0;
            balloon.y = -this.m_rect.height * 1.1;
            balloon.SetLine();
        }
        else if (count == 2) {
            balloon.x = value * (balloon.width + 5) - this.m_rect.width / 2;
            balloon.y = -this.m_rect.height * 1.3;
            balloon.SetLine(count, value);
        }
        else if (count == 3) {
            if (value == 0) {
                balloon.x = 0;
                balloon.y = -this.m_rect.height * 1.5;
            }
            else {
                balloon.x = (value - 1) * (balloon.width + this.m_rect.width / 2) - this.m_rect.width * 0.7;
                balloon.y = -this.m_rect.height * 1.2;
            }
            balloon.SetLine(count, value);
        }
    };
    return BaseActor;
}(egret.DisplayObjectContainer));
__reflect(BaseActor.prototype, "BaseActor");
//# sourceMappingURL=BaseActor.js.map