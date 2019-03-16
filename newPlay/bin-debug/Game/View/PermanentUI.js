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
    PermanentUI.prototype.updateScene = function (path, water) {
        this.m_imgBg.source = path;
        if (water == 0) {
            this.groupRiver.visible = false;
        }
        else {
            this.groupRiver.visible = true;
        }
    };
    PermanentUI.prototype.updateSun = function (path) {
        if (path == null)
            this.m_imgSun.visible = false;
        else {
            this.m_imgSun.visible = true;
            this.m_imgSun.source = path;
        }
    };
    PermanentUI.prototype.updateCloud = function (a_bottom, a_top) {
        // this.m_cloud1.source = a_middle
        this.m_cloud2.source = a_top;
        this.m_cloud3.source = a_bottom;
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
    PermanentUI.prototype._onWaterComplete = function () {
        this.water.play(0);
    };
    PermanentUI.prototype._onComplete = function () {
        ShakeTool.getInstance().setInitPos(this.m_imgBg.x, this.m_imgBg.y);
        this.water.play(0);
        this.water.addEventListener('complete', this._onWaterComplete, this);
    };
    return PermanentUI;
}(BasePanel));
__reflect(PermanentUI.prototype, "PermanentUI");
//# sourceMappingURL=PermanentUI.js.map