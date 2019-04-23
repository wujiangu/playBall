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
        this.m_labCount.text = GameConfig.candy.toString();
        this.m_labCount.x = 720 - this.m_labCount.width;
        this.m_imgCandy.x = this.m_labCount.x - this.m_imgCandy.width - 10;
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
        this.touchChildren = false;
        this.hide.play(0);
    };
    RechargeUI.prototype._onShow = function () {
        this.touchChildren = true;
    };
    RechargeUI.prototype._onHide = function () {
        this.touchChildren = false;
        Common.dispatchEvent(MainNotify.closeRechargePanel);
    };
    RechargeUI.prototype._onComplete = function () {
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
        this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
        this.show.addEventListener('complete', this._onShow, this);
        this.hide.addEventListener('complete', this._onHide, this);
    };
    return RechargeUI;
}(BasePanel));
__reflect(RechargeUI.prototype, "RechargeUI");
//# sourceMappingURL=RechargeUI.js.map