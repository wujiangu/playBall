var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameOverPanel = (function (_super) {
    __extends(GameOverPanel, _super);
    function GameOverPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameOverPanel.exml";
        return _this;
    }
    // 初始化面板
    GameOverPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GameOverPanel.prototype.initData = function () {
    };
    // 进入面板
    GameOverPanel.prototype.onEnter = function () {
        // Common.curPanel = PanelManager.m_backpackPanel
        Common.gameScene().uiLayer.addChild(this);
        this.m_btnReturn.enabled = false;
        Animations.popupOut(this.m_groupGameOver, 300, function () {
            this.m_btnReturn.enabled = true;
        }.bind(this));
    };
    // 退出面板
    GameOverPanel.prototype.onExit = function () {
        Animations.popupIn(this.m_groupGameOver, 300, function () {
            Common.gameScene().uiLayer.removeChild(this);
        }.bind(this));
    };
    GameOverPanel.prototype._OnBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeGameOverPanel);
    };
    GameOverPanel.prototype._OnBtnAgain = function () {
    };
    GameOverPanel.prototype.onComplete = function () {
        this._OnResize();
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this);
        this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAgain, this);
    };
    GameOverPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameOverPanel;
}(BasePanel));
__reflect(GameOverPanel.prototype, "GameOverPanel");
