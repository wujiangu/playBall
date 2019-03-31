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
        this.m_isInit = false;
    };
    // 初始化面板数据
    GameStartPanel.prototype.initData = function () {
        this._actorArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action);
        if (this._actorArmature == null) {
            this._actorArmature = new DragonBonesArmature(armatureDisplay);
        }
        this._actorArmature.ArmatureDisplay = armatureDisplay;
        this._actorArmatureContainer.register(this._actorArmature, ["fangdazhao", "idle", "zoulu"]);
        this._actorArmatureContainer.play("idle");
        this.m_labCandy.text = GameConfig.candy.toString();
        var curChapterIndex = GameConfig.curChpter % 1000;
        this.m_labEvent.text = GameConfig.maxScore.toString();
        this.m_labGrade.text = curChapterIndex.toString();
        this.m_btnAddCandy.x = 100 + this.m_labCandy.width;
    };
    // 进入面板
    GameStartPanel.prototype.onEnter = function () {
        this.touchChildren = false;
        var chapterData = GameConfig.chapterTable[GameConfig.curChpter.toString()];
        if (GameConfig.curBattleChapter > 0) {
            chapterData = GameConfig.chapterTable[GameConfig.curBattleChapter.toString()];
        }
        GameManager.Instance.updateSceneBg(chapterData.bg, chapterData.water);
        GameManager.Instance.updateSceneCloud(chapterData.cloud1, chapterData.cloud2);
        GameManager.Instance.updateSceneSun(chapterData.sun);
        this.show.play(0);
        this.initData();
        this._onDialog();
        if (GameVoice.beginBGMChannel != null)
            GameVoice.beginBGMChannel.stop();
        GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameStartPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.groupDialog.visible = false;
        // if (this._sceneType == 1) GameVoice.beginBGMChannel.stop()
        Common.gameScene().uiLayer.removeChild(this);
    };
    GameStartPanel.prototype._onHideCloth = function () {
        // GameManager.Instance.Start()
        Common.dispatchEvent(MainNotify.closeGameStartPanel);
        Common.dispatchEvent(MainNotify.openGamePanel);
    };
    GameStartPanel.prototype._onStartGame = function () {
        this.touchChildren = false;
        this._sceneType = 1;
        this.m_maskRect.visible = false;
        this.hide.play(0);
        // Common.dispatchEvent(MainNotify.openGameSelectLevel)
    };
    GameStartPanel.prototype._onBtnSetting = function () {
        Common.dispatchEvent(MainNotify.openSettingPanel);
    };
    GameStartPanel.prototype._onBtnAddCandy = function () {
        Common.dispatchEvent(MainNotify.openRechargePanel);
    };
    GameStartPanel.prototype._onBtnGift = function () {
        GameConfig.sceneType = 0;
        Common.dispatchEvent(MainNotify.openCapsulePanel);
        // Common.dispatchEvent(MainNotify.openSignPanel)
    };
    GameStartPanel.prototype._onBtnAd = function () {
        // Common.dispatchEvent(MainNotify.openSignPanel)
    };
    GameStartPanel.prototype._onActorClick = function () {
        this.touchChildren = false;
        this._sceneType = 2;
        this.hide.play(0);
    };
    GameStartPanel.prototype._onInitGameComplete = function () {
        this.touchChildren = true;
    };
    GameStartPanel.prototype._onShow = function () {
        this.touchChildren = true;
    };
    GameStartPanel.prototype._onHide = function () {
        Common.dispatchEvent(MainNotify.closeGameStartPanel);
        switch (this._sceneType) {
            case 1:
                GameConfig.isOpenNewChapter = false;
                Common.dispatchEvent(MainNotify.openGameSelectLevel);
                break;
            case 2:
                Common.dispatchEvent(MainNotify.openActorListPanel);
                break;
            default:
                break;
        }
    };
    GameStartPanel.prototype._onBtnSign = function () {
        Common.dispatchEvent(MainNotify.openSignPanel);
    };
    GameStartPanel.prototype._updateCandy = function () {
        this.m_labCandy.text = GameConfig.candy.toString();
        this.m_btnAddCandy.x = 100 + this.m_labCandy.width;
    };
    GameStartPanel.prototype._onDialog = function () {
        this.groupDialog.visible = false;
        if (GameConfig.babylistIndex == 0) {
            this._setTimeOut(10 * 1000);
        }
        else {
            this._setTimeOut(120 * 1000);
        }
    };
    GameStartPanel.prototype._showDialog = function () {
        this.groupDialog.visible = true;
        this.yuye.play(0);
    };
    GameStartPanel.prototype._setTimeOut = function (delay) {
        egret.setTimeout(this._showDialog, this, delay);
    };
    GameStartPanel.prototype.onComplete = function () {
        this._onResize();
        this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onStartGame, this);
        this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSetting, this);
        this.m_btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAddCandy, this);
        this.m_btnGift.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnGift, this);
        this.m_btnAd.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAd, this);
        this.m_btnSign.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSign, this);
        Common.addTouchBegin(this.m_btnGameStart);
        Common.addTouchBegin(this.m_btnSetting);
        Common.addTouchBegin(this.m_btnAd);
        Common.addTouchBegin(this.m_btnAddCandy);
        Common.addTouchBegin(this.m_btnGift);
        Common.addTouchBegin(this.m_btnSign);
        this._actorArmatureContainer = new DragonBonesArmatureContainer();
        this._actorArmatureContainer.x = this.groupActor.width / 2;
        this._actorArmatureContainer.y = this.groupActor.height;
        this.groupActor.addChild(this._actorArmatureContainer);
        this.groupActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this);
        this._liheArmatureContainer = new DragonBonesArmatureContainer();
        this._liheArmatureContainer.x = 200;
        this._liheArmatureContainer.y = 80;
        this.groupTopRight.addChild(this._liheArmatureContainer);
        var liheArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("lihe", "lihe");
        var liheArmature = new DragonBonesArmature(liheArmatureDisplay);
        liheArmature.ArmatureDisplay = liheArmatureDisplay;
        this._liheArmatureContainer.register(liheArmature, ["newAnimation"]);
        this._liheArmatureContainer.play("newAnimation");
        this._adArmatureContainer = new DragonBonesArmatureContainer();
        this._adArmatureContainer.x = 84;
        this._adArmatureContainer.y = 146;
        this.groupBtnAd.addChild(this._adArmatureContainer);
        var adArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("tubiao", "tubiao");
        var adArmature = new DragonBonesArmature(adArmatureDisplay);
        adArmature.ArmatureDisplay = adArmatureDisplay;
        this._adArmatureContainer.register(adArmature, ["newAnimation"]);
        this._adArmatureContainer.play("newAnimation");
        this.show.addEventListener('complete', this._onShow, this);
        this.hide.addEventListener('complete', this._onHide, this);
        this.yuye.addEventListener('complete', this._onDialog, this);
        Common.addEventListener(MainNotify.updateCandy, this._updateCandy, this);
    };
    GameStartPanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
        _super.prototype._onResize.call(this, event);
    };
    return GameStartPanel;
}(BasePanel));
__reflect(GameStartPanel.prototype, "GameStartPanel");
//# sourceMappingURL=GameStartPanel.js.map