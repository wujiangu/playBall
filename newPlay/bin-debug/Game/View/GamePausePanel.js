var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GamePausePanel = (function (_super) {
    __extends(GamePausePanel, _super);
    function GamePausePanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/quitPanel.exml";
        return _this;
    }
    // 初始化面板
    GamePausePanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GamePausePanel.prototype.initData = function () {
    };
    // 进入面板
    GamePausePanel.prototype.onEnter = function () {
        this.touchChildren = false;
        this.show.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GamePausePanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.hide.play(0);
    };
    GamePausePanel.prototype._OnBtnReturn = function () {
        this.m_state = EGamePauseState.Return;
        Common.dispatchEvent(MainNotify.closeGamePausePanel);
    };
    GamePausePanel.prototype._OnBtnAgain = function () {
        this.m_state = EGamePauseState.Again;
        Common.dispatchEvent(MainNotify.closeGamePausePanel);
    };
    GamePausePanel.prototype._OnBtnContinue = function () {
        this.m_state = EGamePauseState.Continue;
        Common.dispatchEvent(MainNotify.closeGamePausePanel);
        // GameManager.Instance.Start()
    };
    GamePausePanel.prototype._OnShow = function () {
        this.touchChildren = true;
    };
    GamePausePanel.prototype._OnHide = function () {
        Common.gameScene().uiLayer.removeChild(this);
        switch (this.m_state) {
            case EGamePauseState.Continue:
                GameManager.Instance.Start();
                break;
            case EGamePauseState.Again:
                GameManager.Instance.Start();
                PanelManager.m_gameScenePanel.Init();
                break;
            case EGamePauseState.Return:
                GameManager.Instance.GameState = EGameState.Ready;
                Common.dispatchEvent(MainNotify.closeGamePanel);
                Common.dispatchEvent(MainNotify.openGameStartPanel);
                break;
        }
    };
    GamePausePanel.prototype.onComplete = function () {
        this._OnResize();
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this);
        this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAgain, this);
        this.m_btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnContinue, this);
        this.show.addEventListener('complete', this._OnShow, this);
        this.hide.addEventListener('complete', this._OnHide, this);
    };
    GamePausePanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GamePausePanel;
}(BasePanel));
__reflect(GamePausePanel.prototype, "GamePausePanel");
//# sourceMappingURL=GamePausePanel.js.map