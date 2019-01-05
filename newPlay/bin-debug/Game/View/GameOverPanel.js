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
        this.touchChildren = false;
        this.m_isAgain = false;
        this.m_labScore.text = PanelManager.m_gameScenePanel.Score.toString();
        this.m_labHistoryScore.text = GameConfig.maxScore.toString();
        Common.UpdateMaxScore(PanelManager.m_gameScenePanel.Score);
        this.Show.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameOverPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    GameOverPanel.prototype._OnBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeGameOverPanel);
    };
    GameOverPanel.prototype._OnBtnAgain = function () {
        this.m_isAgain = true;
        this.Hide.play(0);
    };
    GameOverPanel.prototype._OnShow = function () {
        this.touchChildren = true;
    };
    GameOverPanel.prototype._OnHide = function () {
        Common.gameScene().uiLayer.removeChild(this);
        if (this.m_isAgain) {
            GameManager.Instance.Start();
            PanelManager.m_gameScenePanel.Init();
        }
        else {
            GameManager.Instance.GameState = EGameState.Ready;
            Common.dispatchEvent(MainNotify.closeGamePanel);
            Common.dispatchEvent(MainNotify.openGameStartPanel);
        }
    };
    GameOverPanel.prototype.onComplete = function () {
        this._OnResize();
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this);
        this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAgain, this);
        Common.addTouchBegin(this.m_btnReturn);
        Common.addTouchBegin(this.m_btnAgain);
        this.Show.addEventListener('complete', this._OnShow, this);
        this.Hide.addEventListener('complete', this._OnHide, this);
    };
    GameOverPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameOverPanel;
}(BasePanel));
__reflect(GameOverPanel.prototype, "GameOverPanel");
