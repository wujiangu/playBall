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
var GameStartPanel = (function (_super) {
    __extends(GameStartPanel, _super);
    function GameStartPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameStart.exml";
        return _this;
    }
    // 初始化面板
    GameStartPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GameStartPanel.prototype.initData = function () {
    };
    // 进入面板
    GameStartPanel.prototype.onEnter = function () {
        this.touchChildren = true;
        Common.gameScene().uiLayer.addChild(this);
        // this._ShowBtn()
    };
    // 退出面板
    GameStartPanel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
        // this._HideBtn()
    };
    // private _OnBtnItem(){
    // 	// Common.dispatchEvent(MainNotify.closeGameStartPanel)
    // 	// TipsManager.Show(GameTips.test)
    // }
    // private _OnBtnAchieve() {
    // }
    // private _OnBtnRank() {
    // }
    GameStartPanel.prototype._OnStartGame = function () {
        Common.dispatchEvent(MainNotify.closeGameStartPanel);
        Common.dispatchEvent(MainNotify.closeBottomBtnPanel);
    };
    GameStartPanel.prototype.onComplete = function () {
        // this.m_btnItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnItem, this)
        // this.m_btnAchieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAchieve, this)
        // this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this)
        this.m_imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this);
        this._OnResize();
    };
    // private _OnShowBtn() {
    // }
    // private _ShowBtn() {
    // 	this.m_groupBtn.alpha = 0
    // 	this.m_groupBtn.y = Config.stageHeight
    // 	egret.Tween.get(this.m_groupBtn).to({ alpha: 1.0, y:Config.stageHeight - this.m_groupBtn.height}, 500, egret.Ease.backIn).call(this._OnShowBtn, this)
    // }
    // private _OnHideBtn() {
    // 	Common.gameScene().uiLayer.removeChild(this)
    // }
    // private _HideBtn() {
    // 	egret.Tween.get(this.m_groupBtn).to({ alpha: 0, y:Config.stageHeight}, 500, egret.Ease.backOut).call(this._OnHideBtn, this)
    // }
    GameStartPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameStartPanel;
}(BasePanel));
__reflect(GameStartPanel.prototype, "GameStartPanel");
//# sourceMappingURL=GameStartPanel.js.map