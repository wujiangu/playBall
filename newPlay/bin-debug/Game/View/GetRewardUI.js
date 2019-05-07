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
var GetRewardUI = (function (_super) {
    __extends(GetRewardUI, _super);
    function GetRewardUI() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/getReward.exml";
        return _this;
    }
    // 初始化面板
    GetRewardUI.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GetRewardUI.prototype.initData = function (data, type) {
    };
    // 进入面板
    GetRewardUI.prototype.onEnter = function () {
        this.touchChildren = false;
        this._lightShow.play(0);
        this._lightLoop.stop();
        if (GameConfig.rewardType == EReward.Candy) {
            this._imgItem.visible = false;
            this._babyGroup.visible = false;
            this._candCount.visible = false;
        }
        else {
            var data = GameConfig.rewardData;
            this._imgItem.visible = false;
            this._babyGroup.visible = true;
            this._candCount.visible = false;
            this._actorArmatureContainer.clear();
            var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.action, data.action);
            if (this._actorArmature == null) {
                this._actorArmature = new DragonBonesArmature(armatureDisplay);
            }
            this._actorArmature.ArmatureDisplay = armatureDisplay;
            this._actorArmatureContainer.register(this._actorArmature, ["fangdazhao", "idle", "zoulu"]);
            this._actorArmatureContainer.play("idle");
            this._actorArmatureContainer.visible = false;
        }
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GetRewardUI.prototype.onExit = function () {
        Common.gameScene().uiLayer.removeChild(this);
    };
    GetRewardUI.prototype._onClose = function () {
    };
    GetRewardUI.prototype._onShow = function () {
        // this.touchChildren = true
    };
    GetRewardUI.prototype._onHide = function () {
    };
    GetRewardUI.prototype._lightShowComplete = function () {
        this._lightLoop.play(0);
        this.touchChildren = true;
        if (GameConfig.rewardType == EReward.Candy) {
            this._imgItem.visible = true;
            this._candCount.visible = true;
            this._candCount.text = GameConfig.rewardCandy.toString();
        }
        else {
            this._actorArmatureContainer.visible = true;
        }
    };
    GetRewardUI.prototype._lightLoopComplete = function () {
        this._lightLoop.play(0);
    };
    GetRewardUI.prototype._onResult = function () {
        Common.dispatchEvent(MainNotify.closeGetRewardPanel);
    };
    GetRewardUI.prototype.onComplete = function () {
        this._onResize();
        this._actorArmatureContainer = new DragonBonesArmatureContainer();
        this._actorArmatureContainer.x = this._babyGroup.width / 2;
        this._actorArmatureContainer.y = this._babyGroup.height;
        this._babyGroup.addChild(this._actorArmatureContainer);
        this._lightShow.addEventListener('complete', this._lightShowComplete, this);
        this._lightLoop.addEventListener('complete', this._lightLoopComplete, this);
        // this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this)
        this.groupResult.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onResult, this);
    };
    GetRewardUI.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GetRewardUI;
}(BasePanel));
__reflect(GetRewardUI.prototype, "GetRewardUI");
//# sourceMappingURL=GetRewardUI.js.map