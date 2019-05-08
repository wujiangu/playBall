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
var GameSelectLevel = (function (_super) {
    __extends(GameSelectLevel, _super);
    function GameSelectLevel() {
        var _this = _super.call(this) || this;
        _this._recordTipMessages = new Array();
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/guankajiemian.exml";
        return _this;
    }
    // 初始化面板
    GameSelectLevel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GameSelectLevel.prototype.initData = function () {
        this.groupTip.visible = false;
        this._curChapterIndex = GameConfig.curChpter % 1000;
        this._curSelectChapter = GameConfig.curChpter;
        this._ChangeChapter();
        this._updateChapterInfo();
        if (this._curSelectChapter == GameConfig.curChpter && GameConfig.isOpenNewChapter == true) {
            this.m_imgIcon.visible = false;
            var chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()];
            this.m_imgChapter.source = chapterData.unlockIcon;
            this.m_imgIcon.source = "guankajiemian13_png";
        }
        this.m_imgEndlessBg.source = "guankajiemian12_png";
        this.m_imgEndlessIcon.source = "guankajiemian15_png";
        if (GameConfig.curChpter <= 1001) {
            this.m_imgEndlessBg.source = "guankajiemian16_png";
            this.m_imgEndlessIcon.source = "guankajiemian14_png";
        }
    };
    // 进入面板
    GameSelectLevel.prototype.onEnter = function () {
        Common.getChapterScore();
        Common.getChapterCombo();
        Common.getIsChapterPass();
        this.touchChildren = false;
        this.initData();
        this.show.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameSelectLevel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    Object.defineProperty(GameSelectLevel.prototype, "selectChater", {
        get: function () {
            return this._curSelectChapter;
        },
        enumerable: true,
        configurable: true
    });
    GameSelectLevel.prototype._onShow = function () {
        if (GameConfig.isOpenNewChapter) {
            this.m_groupLock.visible = true;
            this.suo.play(0);
        }
        else {
            this.touchChildren = true;
        }
    };
    GameSelectLevel.prototype._OnHide = function () {
        Common.dispatchEvent(MainNotify.closeGameSelectLevel);
        if (this._status == 1) {
            // Common.dispatchEvent(MainNotify.closeGameStartPanel)
            if (PanelManager.gameScenePanel != null) {
                PanelManager.gameScenePanel.sceneData.continueCount = 0;
                PanelManager.gameScenePanel.sceneData.isScoreRewardGet = false;
                PanelManager.gameScenePanel.sceneData.isComboRewardGet = false;
            }
            Common.dispatchEvent(MainNotify.openGamePanel);
        }
        else {
            Common.dispatchEvent(MainNotify.openGameStartPanel);
        }
    };
    GameSelectLevel.prototype._OnLock = function () {
        this.touchChildren = true;
        this.m_imgIcon.visible = true;
        var chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()];
        this.m_imgChapter.source = chapterData.icon;
        // if(chapterData.candy == 0){//不需要购买，但是未解锁，需要提示通关上一章
        // 	TipsManager.show("通关上一章!")
        // }
        // else if(chapterData.candy > 0)
        // {
        // 	//判断自己的糖果是否足够
        // 	if(GameConfig.candy >= chapterData.candy)
        // 	{
        // 		Common.dispatchEvent(MainNotify.openBuyConfirmPanel)								
        // 	}
        // 	else
        // 	{
        // 		TipsManager.show(`Insufficient candy!`);
        // 	}
        // }
    };
    GameSelectLevel.prototype._onMaskClick = function () {
        this.touchChildren = false;
        this.hide.play(0);
        this._status = 0;
    };
    GameSelectLevel.prototype._onChapterBegin = function () {
        this.m_imgChapter.alpha = 0.8;
    };
    GameSelectLevel.prototype._onChapterEnd = function () {
        this.m_imgChapter.alpha = 1;
    };
    GameSelectLevel.prototype._onChapterClick = function () {
        if (!this._isLock()) {
            this._beforeEnterBattle();
            GameConfig.gameMode = EBattleMode.Level;
        }
    };
    GameSelectLevel.prototype._onEndlessBegin = function () {
        this.m_imgEndlessBg.alpha = 0.8;
    };
    GameSelectLevel.prototype._onEndlessEnd = function () {
        this.m_imgEndlessBg.alpha = 1;
    };
    GameSelectLevel.prototype._onEndlessClick = function () {
        if (GameConfig.curChpter > 1001) {
            this._beforeEnterBattle();
            GameConfig.gameMode = EBattleMode.Endless;
        }
        else {
            TipsManager.show("Chapter 1 Unlocking Endless Mode of \n\t\t\tCustoms Clearance!");
        }
    };
    //进入之前的准备
    GameSelectLevel.prototype._beforeEnterBattle = function () {
        this.touchChildren = false;
        this.hide.play(0);
        this._status = 1;
        if (GameConfig.isPlaySound) {
            GameVoice.beginBGMChannel.stop();
            var voice = GameVoice.vectory.play(0, 1);
            voice.volume = GameConfig.soundValue / 100;
        }
    };
    GameSelectLevel.prototype._isLock = function () {
        if (this._curSelectChapter > GameConfig.curChpter) {
            return true;
        }
        return false;
    };
    GameSelectLevel.prototype._updateChapterInfo = function () {
        var chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()];
        this.m_imgIcon.visible = true;
        this.m_groupLock.visible = false;
        this.m_imgChapter.source = chapterData.icon;
        this.m_labChapter.text = this._curChapterIndex.toString();
        if (this._curSelectChapter == GameConfig.curChpter && GameConfig.curLevel > 0) {
            var levelData = GameConfig.levelTable[GameConfig.curLevel.toString()];
            this.m_labChapter.text = this._curChapterIndex.toString() + "-" + levelData.level.toString();
        }
        this.m_imgIcon.source = "guankajiemian13_png";
        if (this._isLock()) {
            this.m_imgChapter.source = chapterData.unlockIcon;
            this.m_imgIcon.source = "guankajiemian14_png";
        }
    };
    GameSelectLevel.prototype._onNextClick = function () {
        if (this._curChapterIndex < 18) {
            this._curSelectChapter++;
            this._curChapterIndex++;
            this._updateChapterInfo();
            this._ChangeChapter();
        }
    };
    GameSelectLevel.prototype._onLastClick = function () {
        if (this._curChapterIndex > 1) {
            this._curChapterIndex--;
            this._curSelectChapter--;
            this._updateChapterInfo();
            this._ChangeChapter();
        }
    };
    GameSelectLevel.prototype._onRecordIconBg0Begin = function () {
        this._showTip(this._recordTipMessages[0]);
    };
    GameSelectLevel.prototype._onRecordIconBg0End = function () {
        this.groupTip.visible = false;
    };
    GameSelectLevel.prototype._onRecordIconBg0Click = function () {
        //显示对应提示
        this._onRecordIconBg0Begin();
        this.timeNum.start();
    };
    GameSelectLevel.prototype._onRecordIconBg1Begin = function () {
        this._showTip(this._recordTipMessages[1]);
    };
    GameSelectLevel.prototype._onRecordIconBg1End = function () {
        this.groupTip.visible = false;
    };
    GameSelectLevel.prototype._onRecordIconBg1Click = function () {
        //显示对应提示
        this._onRecordIconBg1Begin();
        this.timeNum.start();
    };
    //切换章节界面奖励显示状态
    GameSelectLevel.prototype._ChangeChapter = function () {
        this._recordTipMessages.length = 0;
        var chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()];
        for (var i = 0; i < chapterData.reward.length; i++) {
            var levelData = GameConfig.levelRewardTable[chapterData.reward[i]];
            if (levelData.condition != 4 || levelData.condition != 5) {
                if (levelData.reward == 1000) {
                    var recordNameStr = void 0;
                    if (GameConfig.isGetChapterRecord[chapterData.id][i] == 1) {
                        if (levelData.value >= 200) {
                            recordNameStr = "icon5greyState_png";
                        }
                        else {
                            if (levelData.value > 0)
                                recordNameStr = "icon4greyState_png";
                        }
                    }
                    if (GameConfig.isGetChapterRecord[chapterData.id][i] == 0) {
                        if (levelData.value >= 200) {
                            recordNameStr = "icon5_png";
                        }
                        else {
                            if (levelData.value > 0)
                                recordNameStr = "icon4_png";
                        }
                    }
                    var tipmessageStr = void 0;
                    switch (levelData.condition) {
                        case ELevelRewardCondition.Finish:
                            tipmessageStr = "Get " + levelData.value + " candies through\n\t\t\tchapters.";
                            break;
                        case ELevelRewardCondition.EnoughScore:
                            tipmessageStr = "Getting " + levelData.value + " candy requires\n\t\t\ta score of " + levelData.count + ".";
                            break;
                        case ELevelRewardCondition.EnoughCombo:
                            tipmessageStr = "Getting " + levelData.value + " candy requires\n\t\t\ta combo of " + levelData.count + ".";
                            break;
                        case ELevelRewardCondition.OnesFinish:
                            break;
                        case ELevelRewardCondition.RepeatFinish:
                            break;
                    }
                    if (i == 0) {
                        this.m_recordIcon0.source = recordNameStr;
                        this._recordTipMessages[0] = tipmessageStr;
                    }
                    else if (i == 1) {
                        this.m_recordIcon1.source = recordNameStr;
                        this._recordTipMessages[1] = tipmessageStr;
                    }
                }
                else {
                    if (levelData.reward > 0) {
                        var data = GameConfig.actorTable[levelData.reward];
                        var recordNameStr = void 0;
                        if (GameConfig.isGetChapterRecord[chapterData.id][i] == 1) {
                            recordNameStr = data.getRecordIcon;
                        }
                        if (GameConfig.isGetChapterRecord[chapterData.id][i] == 0) {
                            recordNameStr = data.recordIcon;
                        }
                        if (i == 0) {
                            this.m_recordIcon0.source = recordNameStr;
                            this._recordTipMessages[0] = data.unlockDesc;
                        }
                        else {
                            if (i == 1) {
                                this.m_recordIcon1.source = recordNameStr;
                                this._recordTipMessages[1] = data.unlockDesc;
                            }
                        }
                    }
                }
            }
        }
        this._lblhighestscore.text = GameConfig.chapterMaxScore[(this._curChapterIndex + 1000)];
        this._lblbomba.text = GameConfig.chapterMaxCombo[(this._curChapterIndex + 1000)];
    };
    GameSelectLevel.prototype._showTip = function (message) {
        this._lblBabyDescribe.text = message;
        this.groupTip.visible = true;
    };
    GameSelectLevel.prototype._hideTip = function () {
        if (this.groupTip.visible) {
            this.groupTip.visible = false;
            this.timeNum.stop();
        }
    };
    GameSelectLevel.prototype._onComplete = function () {
        // this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onMaskClick, this)
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onMaskClick, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onChapterBegin, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_END, this._onChapterEnd, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onChapterEnd, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onChapterClick, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onEndlessBegin, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_END, this._onEndlessEnd, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onEndlessEnd, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onEndlessClick, this);
        this.m_btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onNextClick, this);
        this.m_btnLast.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onLastClick, this);
        this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onRecordIconBg0Begin, this);
        this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_END, this._onRecordIconBg0End, this);
        this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onRecordIconBg0End, this);
        this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onRecordIconBg0Click, this);
        this.timeNum = new egret.Timer(100, 1);
        this.timeNum.addEventListener(egret.TimerEvent.TIMER, this._hideTip, this);
        this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onRecordIconBg1Begin, this);
        this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_END, this._onRecordIconBg1End, this);
        this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onRecordIconBg1End, this);
        this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onRecordIconBg1Click, this);
        Common.addTouchBegin(this.m_btnNext);
        Common.addTouchBegin(this.m_btnLast);
        this.show.addEventListener('complete', this._onShow, this);
        this.hide.addEventListener('complete', this._OnHide, this);
        this.suo.addEventListener('complete', this._OnLock, this);
    };
    return GameSelectLevel;
}(BasePanel));
__reflect(GameSelectLevel.prototype, "GameSelectLevel");
//# sourceMappingURL=GameSelectLevel.js.map