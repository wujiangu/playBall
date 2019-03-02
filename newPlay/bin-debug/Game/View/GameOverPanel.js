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
        this.m_labLianji.text = "X" + GameConfig.curCombo.toString();
        var comboScore = "C";
        if (GameConfig.curCombo <= 3)
            comboScore = "C";
        else if (GameConfig.curCombo > 3 && GameConfig.curCombo <= 6)
            comboScore = "B";
        else if (GameConfig.curCombo > 6 && GameConfig.curCombo <= 10)
            comboScore = "A";
        else if (GameConfig.curCombo > 10 && GameConfig.curCombo <= 15)
            comboScore = "S";
        else
            comboScore = "S+";
        this.m_labPingfen.text = comboScore;
        Common.UpdateMaxScore(PanelManager.m_gameScenePanel.Score);
        this.Show.play(0);
        GameVoice.jiesuanSound.play(0, 1).volume = GameConfig.soundValue / 100;
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameOverPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    Object.defineProperty(GameOverPanel.prototype, "Channel", {
        get: function () {
            return this.channel;
        },
        set: function (value) {
            this.channel = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameOverPanel.prototype, "IsClose", {
        get: function () {
            return this.m_isClose;
        },
        set: function (value) {
            this.m_isClose = value;
        },
        enumerable: true,
        configurable: true
    });
    GameOverPanel.prototype._OnBtnReturn = function () {
        this.touchChildren = false;
        Common.dispatchEvent(MainNotify.closeGameOverPanel);
    };
    GameOverPanel.prototype._OnBtnAgain = function () {
        this.touchChildren = false;
        this.m_isAgain = true;
        this.Hide.play(0);
    };
    GameOverPanel.prototype._OnShow = function () {
        this.touchChildren = true;
    };
    GameOverPanel.prototype._OnHide = function () {
        Common.gameScene().uiLayer.removeChild(this);
        if (this.m_isAgain) {
            if (GameManager.Instance.GameState == EGameState.EndLevel) {
                PanelManager.m_gameScenePanel.ContinueLevel();
            }
            else {
                PanelManager.m_gameScenePanel.Init();
                GameManager.Instance.Start();
            }
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
//# sourceMappingURL=GameOverPanel.js.map