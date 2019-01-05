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
var BottomBtnPanel = (function (_super) {
    __extends(BottomBtnPanel, _super);
    function BottomBtnPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/bottomBtn.exml";
        return _this;
    }
    // 初始化面板
    BottomBtnPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    BottomBtnPanel.prototype.initData = function () {
    };
    // 进入面板
    BottomBtnPanel.prototype.onEnter = function () {
        this.touchChildren = true;
        Common.gameScene().mainUILayer.addChild(this);
        this._ShowBtn();
    };
    // 退出面板
    BottomBtnPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this._HideBtn();
    };
    BottomBtnPanel.prototype._OnBtnItem = function () {
        if (Common.curPanel != PanelManager.m_backpackPanel) {
            Common.dispatchEvent(MainNotify.closeGameStartPanel);
            Common.dispatchEvent(MainNotify.openBackpackPanel);
        }
    };
    BottomBtnPanel.prototype._OnBtnAchieve = function () {
    };
    BottomBtnPanel.prototype._OnBtnRank = function () {
    };
    BottomBtnPanel.prototype.onComplete = function () {
        this.m_btnItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnItem, this);
        this.m_btnAchieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAchieve, this);
        this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this);
        this._OnResize();
    };
    BottomBtnPanel.prototype._OnShowBtn = function () {
    };
    BottomBtnPanel.prototype._ShowBtn = function () {
        this.alpha = 0;
        this.y = Config.stageHeight;
        egret.Tween.get(this).to({ alpha: 1.0, y: Config.stageHeight - this.height }, 500, egret.Ease.backIn).call(this._OnShowBtn, this);
    };
    BottomBtnPanel.prototype._OnHideBtn = function () {
        Common.gameScene().mainUILayer.removeChild(this);
    };
    BottomBtnPanel.prototype._HideBtn = function () {
        egret.Tween.get(this).to({ alpha: 0, y: Config.stageHeight }, 500, egret.Ease.backOut).call(this._OnHideBtn, this);
    };
    BottomBtnPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return BottomBtnPanel;
}(BasePanel));
__reflect(BottomBtnPanel.prototype, "BottomBtnPanel");
//# sourceMappingURL=BottomBtnPanel.js.map