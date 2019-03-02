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
var PermanentUI = (function (_super) {
    __extends(PermanentUI, _super);
    function PermanentUI() {
        var _this = _super.call(this) || this;
        _this.m_cloud1Speed = 0.6;
        _this.m_cloud2Speed = 0.3;
        _this.m_cloud3Speed = 0.1;
        _this.m_sunSpeed = 0.05;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/permanentUI.exml";
        return _this;
    }
    Object.defineProperty(PermanentUI.prototype, "sceneBg", {
        get: function () {
            return this.m_imgBg;
        },
        enumerable: true,
        configurable: true
    });
    PermanentUI.prototype.updateScene = function (path) {
        this.m_imgBg.source = path;
    };
    PermanentUI.prototype.updateSun = function (path) {
        this.m_imgSun.source = path;
    };
    PermanentUI.prototype.updateCloud = function (a_bottom, a_middle, a_top) {
        this.m_cloud1.source = a_bottom;
        this.m_cloud2.source = a_middle;
        this.m_cloud3.source = a_top;
    };
    PermanentUI.prototype.update = function () {
        if (this.m_cloud1.x >= -this.m_cloud1.width) {
            this.m_cloud1.x -= this.m_cloud1Speed;
        }
        else {
            this.m_cloud1.x = Config.stageWidth;
        }
        if (this.m_cloud2.x >= -this.m_cloud2.width) {
            this.m_cloud2.x -= this.m_cloud2Speed;
        }
        else {
            this.m_cloud2.x = Config.stageWidth;
        }
        if (this.m_cloud3.x <= Config.stageWidth + this.m_cloud3.width) {
            this.m_cloud3.x += this.m_cloud1Speed;
        }
        else {
            this.m_cloud3.x = -this.m_cloud3.width;
        }
        if (this.m_imgSun.x <= Config.stageWidth + this.m_imgSun.width) {
            this.m_imgSun.x += this.m_sunSpeed;
        }
        else {
            this.m_imgSun.x = -this.m_imgSun.width;
        }
    };
    PermanentUI.prototype._OnWaterComplete = function () {
        this.water.play(0);
    };
    PermanentUI.prototype._onComplete = function () {
        ShakeTool.getInstance().setInitPos(this.m_imgBg.x, this.m_imgBg.y);
        this.water.play(0);
        this.water.addEventListener('complete', this._OnWaterComplete, this);
    };
    return PermanentUI;
}(BasePanel));
__reflect(PermanentUI.prototype, "PermanentUI");
//# sourceMappingURL=PermanentUI.js.map