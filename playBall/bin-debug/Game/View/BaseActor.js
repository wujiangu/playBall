var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var BaseActor = (function (_super) {
    __extends(BaseActor, _super);
    function BaseActor() {
        var _this = _super.call(this) || this;
        _this.m_armatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this.m_armatureContainer);
        var distance = 20; /// 阴影的偏移距离，以像素为单位
        var angle = 45; /// 阴影的角度，0 到 360 度
        var color = 0x000000; /// 阴影的颜色，不包含透明度
        var alpha = 0.7; /// 光晕的颜色透明度，是对 color 参数的透明度设定
        var blurX = 16; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 16; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 0.65; /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 1 /* LOW */; /// 应用滤镜的次数，暂无实现
        var inner = false; /// 指定发光是否为内侧发光
        var knockout = false; /// 指定对象是否具有挖空效果
        _this.m_dropShadowFilter = new egret.DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality, inner, knockout);
        return _this;
    }
    BaseActor.prototype.GotoIdle = function () {
    };
    BaseActor.prototype.GotoHurt = function () {
    };
    BaseActor.prototype.GotoDead = function () {
    };
    BaseActor.prototype.GotoRun = function () {
    };
    BaseActor.prototype.Update = function (timeElapsed) {
    };
    return BaseActor;
}(egret.DisplayObjectContainer));
__reflect(BaseActor.prototype, "BaseActor");
//# sourceMappingURL=BaseActor.js.map