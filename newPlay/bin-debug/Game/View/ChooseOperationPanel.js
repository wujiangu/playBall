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
var ChooseOperationPanel = (function (_super) {
    __extends(ChooseOperationPanel, _super);
    function ChooseOperationPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/chooseOperationPanel.exml";
        return _this;
    }
    // 初始化面板
    ChooseOperationPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    ChooseOperationPanel.prototype.initData = function () {
    };
    // 进入面板
    ChooseOperationPanel.prototype.onEnter = function () {
        this.touchChildren = false;
        this.m_isAgain = false;
        this.Show.play(0);
        PanelManager.gameScenePanel.sceneData.addCandy = 0;
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    ChooseOperationPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    ChooseOperationPanel.prototype._onBtnReturn = function () {
        this.touchChildren = false;
        Common.dispatchEvent(MainNotify.closeChooseOperationPanel);
    };
    ChooseOperationPanel.prototype._onbtnContinue = function () {
        this.touchChildren = false;
        this.m_isAgain = true;
        this.Hide.play(0);
    };
    ChooseOperationPanel.prototype._onShow = function () {
        this.touchChildren = true;
    };
    ChooseOperationPanel.prototype._onHide = function () {
        Common.gameScene().uiLayer.removeChild(this);
        if (this.m_isAgain) {
            if (GameManager.Instance.gameState == EGameState.EndLevel) {
                PanelManager.gameScenePanel.continueLevel();
            }
            else {
                PanelManager.gameScenePanel.init();
                GameManager.Instance.start();
            }
        }
        else {
            GameManager.Instance.gameState = EGameState.Ready;
            Common.dispatchEvent(MainNotify.closeGamePanel);
            Common.dispatchEvent(MainNotify.openGameStartPanel);
        }
    };
    ChooseOperationPanel.prototype.onComplete = function () {
        this._onResize();
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
        this.m_btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onbtnContinue, this);
        Common.addTouchBegin(this.m_btnReturn);
        Common.addTouchBegin(this.m_btnContinue);
        this.Show.addEventListener('complete', this._onShow, this);
        this.Hide.addEventListener('complete', this._onHide, this);
    };
    ChooseOperationPanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return ChooseOperationPanel;
}(BasePanel));
__reflect(ChooseOperationPanel.prototype, "ChooseOperationPanel");
//# sourceMappingURL=ChooseOperationPanel.js.map