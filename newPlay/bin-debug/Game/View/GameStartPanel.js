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
        this.m_actorArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action);
        if (this.m_actorArmature == null) {
            this.m_actorArmature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_actorArmature.ArmatureDisplay = armatureDisplay;
        this.m_actorArmatureContainer.register(this.m_actorArmature, ["fangdazhao", "idle", "zoulu"]);
        this.m_actorArmatureContainer.play("idle");
    };
    // 进入面板
    GameStartPanel.prototype.onEnter = function () {
        Common.curPanel = PanelManager.m_gameStartPanel;
        this.touchChildren = false;
        // this.m_maskRect.visible = false
        // if (!this.m_isInit) {
        // 	this.touchChildren = true
        // 	this.m_isInit = true
        // }else{
        // 	// this.m_groupStart.alpha = 1
        // 	// this.m_maskRect.visible = true
        // }
        GameManager.Instance.updateSceneBg("Bg1_png");
        this.show.play(0);
        var id = GameConfig.itemUseTable[0];
        var data = GameConfig.itemTable[id.toString()];
        this.initData();
        if (GameVoice.beginBGMChannel != null)
            GameVoice.beginBGMChannel.stop();
        GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameStartPanel.prototype.onExit = function () {
        this.touchChildren = false;
        if (this.m_sceneType == 1)
            GameVoice.beginBGMChannel.stop();
        Common.gameScene().uiLayer.removeChild(this);
    };
    GameStartPanel.prototype._OnHideCloth = function () {
        // GameManager.Instance.Start()
        Common.dispatchEvent(MainNotify.closeGameStartPanel);
        Common.dispatchEvent(MainNotify.openGamePanel);
    };
    GameStartPanel.prototype._OnStartGame = function () {
        this.touchChildren = false;
        this.m_sceneType = 1;
        this.m_maskRect.visible = false;
        this.hide.play(0);
        // Common.dispatchEvent(MainNotify.openGameSelectLevel)
    };
    GameStartPanel.prototype._OnBtnSetting = function () {
        Common.dispatchEvent(MainNotify.openSettingPanel);
    };
    GameStartPanel.prototype._OnBtnAddCandy = function () {
        Common.dispatchEvent(MainNotify.openRechargePanel);
    };
    GameStartPanel.prototype._OnBtnProc = function () {
        this.m_maskRect.visible = true;
    };
    GameStartPanel.prototype._OnBtnAd = function () {
    };
    GameStartPanel.prototype._OnActorClick = function () {
        this.touchChildren = false;
        this.m_sceneType = 2;
        this.hide.play(0);
    };
    GameStartPanel.prototype._OnInitGameComplete = function () {
        this.touchChildren = true;
    };
    GameStartPanel.prototype._OnShow = function () {
        this.touchChildren = true;
    };
    GameStartPanel.prototype._OnHide = function () {
        Common.dispatchEvent(MainNotify.closeGameStartPanel);
        switch (this.m_sceneType) {
            case 1:
                Common.dispatchEvent(MainNotify.openGameSelectLevel);
                break;
            case 2:
                Common.dispatchEvent(MainNotify.openActorListPanel);
                break;
            default:
                break;
        }
    };
    GameStartPanel.prototype.onComplete = function () {
        // this.m_imgCloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
        this._OnResize();
        this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this);
        this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnSetting, this);
        this.m_btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAddCandy, this);
        // this.m_btnProc.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnProc, this)
        this.m_btnAd.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAd, this);
        Common.addTouchBegin(this.m_btnGameStart);
        Common.addTouchBegin(this.m_btnSetting);
        Common.addTouchBegin(this.m_btnAd);
        Common.addTouchBegin(this.m_btnAddCandy);
        // Common.addTouchBegin(this.m_btnProc)
        this.m_actorArmatureContainer = new DragonBonesArmatureContainer();
        this.m_actorArmatureContainer.x = this.groupActor.width / 2;
        this.m_actorArmatureContainer.y = this.groupActor.height;
        this.groupActor.addChild(this.m_actorArmatureContainer);
        this.groupActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnActorClick, this);
        this.show.addEventListener('complete', this._OnShow, this);
        this.hide.addEventListener('complete', this._OnHide, this);
    };
    GameStartPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
        _super.prototype._OnResize.call(this, event);
    };
    return GameStartPanel;
}(BasePanel));
__reflect(GameStartPanel.prototype, "GameStartPanel");
//# sourceMappingURL=GameStartPanel.js.map