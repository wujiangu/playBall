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
var BuyConfirmPanel = (function (_super) {
    __extends(BuyConfirmPanel, _super);
    function BuyConfirmPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/buyConfirmPanel.exml";
        return _this;
    }
    // 初始化面板
    BuyConfirmPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    BuyConfirmPanel.prototype.initData = function () {
    };
    // 进入面板
    BuyConfirmPanel.prototype.onEnter = function () {
        this.touchChildren = false;
        this.Show.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    BuyConfirmPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.Hide.play(0);
    };
    BuyConfirmPanel.prototype._onBtnNotBuy = function () {
        this.touchChildren = false;
        Common.dispatchEvent(MainNotify.closeBuyConfirmPanel);
    };
    BuyConfirmPanel.prototype._onbtnSureBuy = function () {
        this.touchChildren = false;
        //更新自己的糖果数目
        Common.updateAfterBuyCurCandy(GameConfig.candy - this.babyData.petPrice);
        GameConfig.babyUnlockList.push(this.babyData.id);
        Common.updateUnlockBaby();
        this.Hide.play(0);
        //刷新宠物面板 获得改宠物
        PanelManager.actorListPanel.updateBabyInfo(this.babyData.id);
        PanelManager.actorListPanel._currentChooseBaby = this.babyData.id;
        // 判断是否在已解锁列表中
        var index = GameConfig.babyUnlockList.indexOf(this.babyData.id);
        if (index >= 0) {
            Common.updateCurBaby(this.babyData.id);
        }
    };
    BuyConfirmPanel.prototype._onShow = function () {
        this.touchChildren = true;
        this.babyIndex = GameConfig.babyUnlockList.indexOf(PanelManager.actorListPanel._currentChooseBaby);
        this.babyData = GameConfig.actorTable[PanelManager.actorListPanel._currentChooseBaby.toString()];
        this._lblPrice.text = "-" + this.babyData.petPrice;
    };
    BuyConfirmPanel.prototype._onHide = function () {
        Common.gameScene().uiLayer.removeChild(this);
    };
    BuyConfirmPanel.prototype.onComplete = function () {
        this._onResize();
        this.m_btnNotBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnNotBuy, this);
        this.m_btnSureBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onbtnSureBuy, this);
        this.Show.addEventListener('complete', this._onShow, this);
        this.Hide.addEventListener('complete', this._onHide, this);
    };
    BuyConfirmPanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return BuyConfirmPanel;
}(BasePanel));
__reflect(BuyConfirmPanel.prototype, "BuyConfirmPanel");
//# sourceMappingURL=BuyConfirmPanel.js.map