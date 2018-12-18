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
var BackpackPanel = (function (_super) {
    __extends(BackpackPanel, _super);
    function BackpackPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/backpackPanel.exml";
        return _this;
    }
    // 初始化面板
    BackpackPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    BackpackPanel.prototype.initData = function () {
    };
    // 进入面板
    BackpackPanel.prototype.onEnter = function () {
        this.touchChildren = true;
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    BackpackPanel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    BackpackPanel.prototype._OnBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeBackpackPanel);
        Common.dispatchEvent(MainNotify.openGameStartPanel);
    };
    BackpackPanel.prototype._OnBtnUse = function () {
    };
    BackpackPanel.prototype._OnBtnLeft = function () {
    };
    BackpackPanel.prototype._OnBtnRight = function () {
    };
    BackpackPanel.prototype.onComplete = function () {
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this);
        this.m_btnUse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnUse, this);
        this.m_btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLeft, this);
        this.m_btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRight, this);
        this._OnResize();
    };
    BackpackPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return BackpackPanel;
}(BasePanel));
__reflect(BackpackPanel.prototype, "BackpackPanel");
//# sourceMappingURL=BackpackPanel.js.map