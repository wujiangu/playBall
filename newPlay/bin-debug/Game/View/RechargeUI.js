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
var RechargeUI = (function (_super) {
    __extends(RechargeUI, _super);
    function RechargeUI() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/chongzhi.exml";
        return _this;
    }
    // 初始化面板
    RechargeUI.prototype.initPanel = function () {
    };
    // 初始化面板数据
    RechargeUI.prototype.initData = function () {
    };
    // 进入面板
    RechargeUI.prototype.onEnter = function () {
        this.touchChildren = false;
        this.initData();
        this.show.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    RechargeUI.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    RechargeUI.prototype._onBtnReturn = function () {
        this.touchEnabled = false;
        this.hide.play(0);
    };
    RechargeUI.prototype._OnShow = function () {
        this.touchChildren = true;
    };
    RechargeUI.prototype._OnHide = function () {
        Common.dispatchEvent(MainNotify.closeRechargePanel);
    };
    RechargeUI.prototype._onComplete = function () {
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
        this.show.addEventListener('complete', this._OnShow, this);
        this.hide.addEventListener('complete', this._OnHide, this);
    };
    return RechargeUI;
}(BasePanel));
__reflect(RechargeUI.prototype, "RechargeUI");
//# sourceMappingURL=RechargeUI.js.map