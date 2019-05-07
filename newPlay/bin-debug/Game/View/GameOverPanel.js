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
        if (GameConfig.isChapterPassShow) {
            this._caiDaiGroup.visible = true;
            this.caidai.play(0);
            GameConfig.isChapterPassShow = false;
        }
        this._scoreEffect(0, PanelManager.gameScenePanel.sceneData.realScore, 10);
        this._recordShowPos();
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
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                Common.updateMaxScore(PanelManager.gameScenePanel.sceneData.realScore);
                break;
            case EBattleMode.Endless:
                break;
            case EBattleMode.Timelimite:
                break;
            default:
                break;
        }
        this.Show.play(0);
        if (GameConfig.isPlaySound) {
            if (GameManager.Instance.gameState == EGameState.EndLevel) {
                GameVoice.vectory.play(0, 1).volume = GameConfig.soundValue / 100;
            }
            else {
                GameVoice.jiesuanSound.play(0, 1).volume = GameConfig.soundValue / 100;
            }
        }
        this._labCandy.text = PanelManager.gameScenePanel.sceneData.addCandy.toString();
        PanelManager.gameScenePanel.sceneData.addCandy = 0;
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameOverPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    GameOverPanel.prototype._onBtnReturn = function () {
        this.touchChildren = false;
        // PanelManager.gameScenePanel.updeLevelData(PanelManager.gameScenePanel._data.levelData.next, PanelManager.gameScenePanel._data.levelData.key)
        Common.dispatchEvent(MainNotify.closeGameOverPanel);
    };
    GameOverPanel.prototype._onBtnAgain = function () {
        this.touchChildren = false;
        this.m_isAgain = true;
        this.Hide.play(0);
    };
    GameOverPanel.prototype._onShow = function () {
        this.touchChildren = true;
    };
    GameOverPanel.prototype._onHide = function () {
        Common.gameScene().uiLayer.removeChild(this);
        if (this.m_isAgain) {
            if (GameManager.Instance.gameState == EGameState.EndLevel) {
                PanelManager.gameScenePanel.continueLevel();
            }
            else {
                PanelManager.gameScenePanel.sceneData.continueCount += 1;
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
    GameOverPanel.prototype.onComplete = function () {
        this._onResize();
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
        this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAgain, this);
        Common.addTouchBegin(this.m_btnReturn);
        Common.addTouchBegin(this.m_btnAgain);
        this.Show.addEventListener('complete', this._onShow, this);
        this.Hide.addEventListener('complete', this._onHide, this);
    };
    GameOverPanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    //数字累加效果
    GameOverPanel.prototype._scoreEffect = function (MinScoreNum, MaxScoreNum, speed) {
        var delta;
        if (MaxScoreNum > 100) {
            delta = Math.floor((MaxScoreNum - MinScoreNum) / (speed * 10));
        }
        else {
            delta = 1;
            if (MaxScoreNum < 50)
                speed = 50;
        }
        var result = 0;
        result = MinScoreNum;
        var thisTemp = this;
        var thisTime;
        thisTime = setInterval(function () {
            if (result < MaxScoreNum) {
                result += delta;
                thisTemp.m_labScore.text = result.toString();
            }
            else {
                clearInterval(Number(thisTime));
                thisTemp.m_labScore.text = MaxScoreNum.toString();
            }
        }, speed);
    };
    //奖励显示位置
    GameOverPanel.prototype._recordShowPos = function () {
        if (PanelManager.gameScenePanel.sceneData.addCandy > 0) {
            switch (PanelManager.gameScenePanel.sceneData.recordBabySource.length) {
                case 0://一个奖励
                    this.m_recoredBg.width = 200;
                    this.firstRecordGroup.x = 232;
                    this.thirdRecordGroup.visible = false;
                    break;
                case 1://两个奖励
                    this.m_recoredBg.width = 400;
                    this.firstRecordGroup.x = 150;
                    this.thirdRecordGroup.visible = true;
                    this.m_thirdRecordIcon.source = PanelManager.gameScenePanel.sceneData.recordBabySource[0];
                    break;
                case 2://三个奖励
                    break;
                default:
                    break;
            }
        }
        else {
            this.firstRecordGroup.visible = false;
            this.thirdRecordGroup.visible = false;
            this.m_recoredBg.visible = false;
        }
        PanelManager.gameScenePanel.sceneData.recordBabySource.length = 0; //清空
    };
    return GameOverPanel;
}(BasePanel));
__reflect(GameOverPanel.prototype, "GameOverPanel");
//# sourceMappingURL=GameOverPanel.js.map