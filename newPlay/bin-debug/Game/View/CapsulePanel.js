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
var CapsulePanel = (function (_super) {
    __extends(CapsulePanel, _super);
    function CapsulePanel() {
        var _this = _super.call(this) || this;
        _this._btnDelay = -1;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/choujiang.exml";
        return _this;
    }
    // 初始化面板
    CapsulePanel.prototype.initPanel = function () {
        this._data = new CapsuleData();
        this._data.init();
    };
    // 初始化面板数据
    CapsulePanel.prototype.initData = function () {
    };
    // 进入面板
    CapsulePanel.prototype.onEnter = function () {
        this._hookStop();
        this._btnStop();
        this._remoteStop();
        this._candy.text = GameConfig.candy.toString();
        this._candy.x = 650 - this._candy.width;
        this._imgCandy.x = this._candy.x - 73;
        this._btnDelay = -1;
        this._isCapture = false;
        this._data.isEnough = true;
        this._hookMove.play(0);
        this.anjian.play(0);
        if (GameVoice.beginBGMChannel != null)
            GameVoice.beginBGMChannel.stop();
        this._bgmChannel = GameVoice.rewardBGM.play(0);
        this.touchChildren = true;
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    CapsulePanel.prototype.onExit = function () {
        this._btnDelay = -1;
        this._bgmChannel.stop();
        GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0);
        if (this._data.isEnough == false) {
            Common.dispatchEvent(MainNotify.openRechargePanel);
        }
        Common.gameScene().uiLayer.removeChild(this);
    };
    CapsulePanel.prototype.update = function (timeElapsed) {
        if (this._btnDelay < 0)
            return;
        this._btnDelay += timeElapsed;
        if (this._btnDelay >= 2000) {
            this._btnDelay = -1;
            this.anjian.play(0);
        }
    };
    CapsulePanel.prototype._onClose = function () {
        Common.dispatchEvent(MainNotify.closeCapsulePanel);
        if (GameConfig.sceneType == 0)
            Common.dispatchEvent(MainNotify.openGameStartPanel);
    };
    CapsulePanel.prototype._onBtnCapsule = function () {
        if (GameConfig.candy < this._data.consume) {
            // TipsManager.show("no enough candy!", Common.TextColors.grayWhite)
            this._data.isEnough = false;
            this.touchChildren = false;
            Common.dispatchEvent(MainNotify.closeCapsulePanel);
            return;
        }
        this.touchChildren = false;
        this._isCapture = true;
        this._btnDelay = -1;
        this._btnStop();
        GameConfig.rewardData = Common.cloneObj(this._data.result);
        this.anjian.play(0);
        this.yaogan.play(0);
        Common.updateCurCandy(-this._data.consume);
        Common.dispatchEvent(MainNotify.updateCandy);
    };
    CapsulePanel.prototype._onShow = function () {
        this.touchChildren = true;
    };
    CapsulePanel.prototype._onHide = function () {
        Common.dispatchEvent(MainNotify.closeCapsulePanel);
    };
    CapsulePanel.prototype._onHookComplete = function () {
        this._hookMove.play();
        this._hookStop();
        this.touchChildren = true;
        var sound = RES.getRes("getBaby_mp3");
        if (GameConfig.rewardType == EReward.Candy) {
            sound = RES.getRes("getCandy_mp3");
        }
        var channel = sound.play(0, 1);
        Common.dispatchEvent(MainNotify.openGetRewardPanel);
    };
    CapsulePanel.prototype._onBtnComplete = function () {
        if (this._isCapture) {
            this._isCapture = false;
            this._hookMove.pause();
            this._btnDelay = 0;
            this.zhua.play(0);
            if (GameConfig.isPlaySound) {
                var channel = GameVoice.rewardVoice.play(0, 1);
                channel.volume = GameConfig.soundValue / 100;
            }
            this._hook.alpha = 1;
        }
        else {
            this._btnDelay = 0;
        }
    };
    CapsulePanel.prototype._hookMoveComplete = function () {
        this._hookMove.play(0);
    };
    CapsulePanel.prototype._updateCandy = function () {
        this._candy.text = GameConfig.candy.toString();
        this._candy.x = 650 - this._candy.width;
        this._imgCandy.x = this._candy.x - 73;
    };
    CapsulePanel.prototype._onBtnRecharge = function () {
        Common.dispatchEvent(MainNotify.openRechargePanel);
    };
    CapsulePanel.prototype._remoteStop = function () {
        this._remote1.alpha = 1;
        this._remote2.alpha = 0;
        this._remote3.alpha = 0;
    };
    CapsulePanel.prototype._btnStop = function () {
        this._btnCapture.alpha = 1;
        this._imgCapture.alpha = 0;
    };
    CapsulePanel.prototype._hookStop = function () {
        this._hook.alpha = 0;
        this._hookFirst.alpha = 1;
    };
    CapsulePanel.prototype.onComplete = function () {
        this._onResize();
        this._hookMove.addEventListener('complete', this._hookMoveComplete, this);
        this.anjian.addEventListener('complete', this._onBtnComplete, this);
        this.zhua.addEventListener('complete', this._onHookComplete, this);
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this);
        this._btnCapture.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnCapsule, this);
        this._btnRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnRecharge, this);
        Common.addTouchBegin(this.m_btnReturn);
        Common.addTouchBegin(this._btnCapture);
        Common.addEventListener(MainNotify.updateCandy, this._updateCandy, this);
    };
    CapsulePanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return CapsulePanel;
}(BasePanel));
__reflect(CapsulePanel.prototype, "CapsulePanel");
//# sourceMappingURL=CapsulePanel.js.map