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
var GameLosePanel = (function (_super) {
    __extends(GameLosePanel, _super);
    function GameLosePanel() {
        var _this = _super.call(this) || this;
        _this.sumNum = 0;
        _this.isStartCountDown = false;
        _this.isShowConflict = false;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameLosePanel.exml";
        return _this;
    }
    // 初始化面板
    GameLosePanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GameLosePanel.prototype.initData = function () {
    };
    // 进入面板
    GameLosePanel.prototype.onEnter = function () {
        this.touchChildren = false;
        this.countDown = 5;
        this.Show.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameLosePanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    GameLosePanel.prototype.update = function (time) {
        this.sumNum += time;
        if (this.sumNum >= 1000) {
            if (this.isStartCountDown) {
                if (this.countDown > 0) {
                    this._lblCountDown.text = this.countDown.toString();
                    this.countDown--;
                }
                else {
                    this.isStartCountDown = false;
                    //倒计时结束，跳转到选择界面
                    if (!this.isShowConflict) {
                        Common.dispatchEvent(MainNotify.closeGameLosePanel);
                        Common.dispatchEvent(MainNotify.openGameOverPanel);
                    }
                }
            }
            this.sumNum = 0;
        }
    };
    GameLosePanel.prototype._onBtnReturn = function () {
        this.touchChildren = false;
        Common.dispatchEvent(MainNotify.closeGameLosePanel);
    };
    GameLosePanel.prototype._onBtnAgain = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    GameLosePanel.prototype._onBtnClose = function () {
        //关闭当前界面
        this.touchChildren = false;
        this.isShowConflict = true;
        this.Hide.play(0);
        //跳转到重新开始返回主界面
        Common.dispatchEvent(MainNotify.openGameOverPanel);
    };
    GameLosePanel.prototype._onBtnResurgence = function () {
        // this.touchChildren = false
        // Common.dispatchEvent(MainNotify.closeGameLosePanel)
        // //跳转广告界面
    };
    GameLosePanel.prototype._onShow = function () {
        this.touchChildren = true;
        this.isStartCountDown = true;
        this.isShowConflict = false;
        this._lblCountDown.visible = true;
        this._lblCountDown.text = "5";
    };
    GameLosePanel.prototype._onHide = function () {
        GameConfig.isShowPanelNow = false;
        this._lblCountDown.visible = false;
        this._lblCountDown.text = "5";
        Common.gameScene().uiLayer.removeChild(this);
    };
    GameLosePanel.prototype.onComplete = function () {
        this._onResize();
        this.m_btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnClose, this);
        this.m_btnResurgence.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnResurgence, this);
        Common.addTouchBegin(this.m_btnClose);
        Common.addTouchBegin(this.m_btnResurgence);
        this.Show.addEventListener('complete', this._onShow, this);
        this.Hide.addEventListener('complete', this._onHide, this);
    };
    GameLosePanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameLosePanel;
}(BasePanel));
__reflect(GameLosePanel.prototype, "GameLosePanel");
//# sourceMappingURL=GameLosePanel.js.map