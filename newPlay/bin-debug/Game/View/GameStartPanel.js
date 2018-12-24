var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        Common.curPanel = PanelManager.m_gameStartPanel;
        this.touchChildren = true;
        // this.m_imgCloth.y = Config.stageHeight - 1375
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameStartPanel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    GameStartPanel.prototype._OnHideCloth = function () {
        GameManager.Instance.Start();
        Common.dispatchEvent(MainNotify.closeGameStartPanel);
        Common.dispatchEvent(MainNotify.openGamePanel);
    };
    GameStartPanel.prototype._OnStartGame = function () {
        this.touchChildren = false;
        this._OnHideCloth();
        // egret.Tween.get(this.m_imgCloth).to({y:-this.m_imgCloth.height}, 1000, egret.Ease.backOut).call(this._OnHideCloth, this)
        // Common.dispatchEvent(MainNotify.closeBottomBtnPanel)
    };
    GameStartPanel.prototype._OnBtnSetting = function () {
        Common.dispatchEvent(MainNotify.openSettingPanel);
    };
    GameStartPanel.prototype._OnBtnRank = function () {
        Common.UpdateMaxScore(10);
    };
    GameStartPanel.prototype._OnBtnProc = function () {
    };
    GameStartPanel.prototype.onComplete = function () {
        // this.m_imgCloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
        this._OnResize();
        this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this);
        this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnSetting, this);
        this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this);
        this.m_btnProc.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnProc, this);
    };
    GameStartPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameStartPanel;
}(BasePanel));
__reflect(GameStartPanel.prototype, "GameStartPanel");
