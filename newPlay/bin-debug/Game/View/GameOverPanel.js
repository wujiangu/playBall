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
        this._rewardGroups = new Array();
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
        this.m_labLianji.text = GameConfig.curCombo.toString();
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
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameOverPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    GameOverPanel.prototype._onBtnReturn = function () {
        this.touchChildren = false;
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
        GameConfig.isShowEndlessModePanelNow = false;
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
        //有宠物或者是糖果
        Common.log(PanelManager.gameScenePanel.sceneData.addCandy, PanelManager.gameScenePanel.sceneData.recordBabySource.length);
        this.m_rewardGroup.removeChildren();
        this.m_recoredBg.visible = true;
        if (PanelManager.gameScenePanel.sceneData.addCandy != 0) {
            var rewardIR_1 = new RewardIR();
            rewardIR_1.init(1000, PanelManager.gameScenePanel.sceneData.addCandy);
            switch (PanelManager.gameScenePanel.sceneData.recordBabySource.length) {
                case 0://一个奖励	
                    this.m_recoredBg.width = 150;
                    rewardIR_1.x = 175;
                    rewardIR_1.y = 14;
                    break;
                case 1://两个奖励
                    this.m_recoredBg.width = 300;
                    rewardIR_1.x = 90;
                    rewardIR_1.y = 14;
                    var rewardIR11 = new RewardIR();
                    rewardIR11.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1);
                    rewardIR11.x = 260;
                    rewardIR11.y = 14;
                    this.m_rewardGroup.addChild(rewardIR11);
                    this._rewardGroups.push(rewardIR11);
                    break;
                case 2://三个奖励
                    this.m_recoredBg.width = 450;
                    rewardIR_1.x = 50;
                    rewardIR_1.y = 14;
                    var rewardIR21 = new RewardIR();
                    rewardIR21.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1);
                    rewardIR21.x = 175;
                    rewardIR21.y = 14;
                    this.m_rewardGroup.addChild(rewardIR21);
                    this._rewardGroups.push(rewardIR21);
                    var rewardIR22 = new RewardIR();
                    rewardIR22.init(PanelManager.gameScenePanel.sceneData.recordBabySource[1], 1);
                    rewardIR22.x = 300;
                    rewardIR22.y = 14;
                    this.m_rewardGroup.addChild(rewardIR22);
                    this._rewardGroups.push(rewardIR22);
                    break;
                default:
                    break;
            }
            this.m_rewardGroup.addChild(rewardIR_1);
            this._rewardGroups.push(rewardIR_1);
        }
        else {
            if (PanelManager.gameScenePanel.sceneData.recordBabySource.length != 0) {
                switch (PanelManager.gameScenePanel.sceneData.recordBabySource.length) {
                    case 1://一个奖励
                        this.m_recoredBg.width = 150;
                        var rewardIR1 = new RewardIR();
                        rewardIR1.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1);
                        rewardIR1.x = 175;
                        rewardIR1.y = 14;
                        this.m_rewardGroup.addChild(rewardIR1);
                        this._rewardGroups.push(rewardIR1);
                        break;
                    case 2://两个奖励
                        this.m_recoredBg.width = 300;
                        var rewardIR21 = new RewardIR();
                        rewardIR21.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1);
                        rewardIR21.x = 90;
                        rewardIR21.y = 14;
                        this.m_rewardGroup.addChild(rewardIR21);
                        this._rewardGroups.push(rewardIR21);
                        var rewardIR22 = new RewardIR();
                        rewardIR22.init(PanelManager.gameScenePanel.sceneData.recordBabySource[1], 1);
                        rewardIR22.x = 260;
                        rewardIR22.y = 14;
                        this.m_rewardGroup.addChild(rewardIR22);
                        this._rewardGroups.push(rewardIR22);
                        break;
                    case 3://三个奖励
                        this.m_recoredBg.width = 450;
                        var rewardIR31 = new RewardIR();
                        rewardIR31.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1);
                        rewardIR31.x = 50;
                        rewardIR31.y = 14;
                        this.m_rewardGroup.addChild(rewardIR31);
                        this._rewardGroups.push(rewardIR31);
                        var rewardIR32 = new RewardIR();
                        rewardIR32.init(PanelManager.gameScenePanel.sceneData.recordBabySource[1], 1);
                        rewardIR32.x = 175;
                        rewardIR32.y = 14;
                        this.m_rewardGroup.addChild(rewardIR32);
                        this._rewardGroups.push(rewardIR32);
                        var rewardIR33 = new RewardIR();
                        rewardIR33.init(PanelManager.gameScenePanel.sceneData.recordBabySource[2], 1);
                        rewardIR33.x = 300;
                        rewardIR33.y = 14;
                        this.m_rewardGroup.addChild(rewardIR33);
                        this._rewardGroups.push(rewardIR33);
                        break;
                    default:
                        break;
                }
            }
        }
        if (PanelManager.gameScenePanel.sceneData.recordBabySource.length == 0 && PanelManager.gameScenePanel.sceneData.addCandy == 0) {
            this.m_recoredBg.visible = false;
        }
        PanelManager.gameScenePanel.sceneData.addCandy = 0;
        PanelManager.gameScenePanel.sceneData.recordBabySource.length = 0;
    };
    return GameOverPanel;
}(BasePanel));
__reflect(GameOverPanel.prototype, "GameOverPanel");
var RewardIR = (function (_super) {
    __extends(RewardIR, _super);
    function RewardIR() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/rewardIR.exml";
        return _this;
    }
    //初始化奖项
    RewardIR.prototype.init = function (rewardType, rewardNum) {
        if (rewardType == 1000) {
            this.m_rewardIcon.source = "icon4_png";
            this._lblRewardName.text = "Candy";
        }
        else {
            if (rewardType > 0) {
                var data = GameConfig.actorTable[rewardType];
                this.m_rewardIcon.source = data.recordIcon;
                this._lblRewardName.text = "Monster";
            }
        }
        this._lblRewardNum.text = rewardNum.toString();
    };
    RewardIR.prototype._onComplete = function () {
    };
    return RewardIR;
}(eui.Component));
__reflect(RewardIR.prototype, "RewardIR");
//# sourceMappingURL=GameOverPanel.js.map