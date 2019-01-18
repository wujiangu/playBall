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
var BackpackPanel = (function (_super) {
    __extends(BackpackPanel, _super);
    function BackpackPanel() {
        var _this = _super.call(this) || this;
        _this.swapIndex = 0;
        _this.m_itemIDs = new Array();
        _this.m_itemIRs = new Array();
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/backpackPanel.exml";
        return _this;
    }
    // 初始化面板
    BackpackPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    BackpackPanel.prototype.initData = function () {
        this.m_itemIDs = [0, 1, 2];
    };
    // 进入面板
    BackpackPanel.prototype.onEnter = function () {
        Common.curPanel = PanelManager.m_backpackPanel;
        this.touchChildren = true;
        this.initData();
        this._UpdateBtnItem();
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    BackpackPanel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    BackpackPanel.prototype._UpdateBtnItem = function () {
        this.m_curItem.visible = false;
        this.m_itemTypeBg.visible = false;
        for (var i = 0; i < GameConfig.itemUseTable.length; i++) {
            var id = GameConfig.itemUseTable[i];
            this.m_curItem.visible = true;
            this.m_itemTypeBg.visible = true;
            this.m_curItem.texture = RES.getRes(GameConfig.itemTable[id.toString()].Icon);
            this.m_itemTypeBg.texture = RES.getRes(GameConfig.itemTable[id.toString()].ItemBg);
        }
        this._UpdateAllItemList();
    };
    BackpackPanel.prototype._UpdateAllItemList = function () {
        for (var i = 0; i < this.m_itemIRs.length; i++) {
            var itemId = GameConfig.itemConfig[this.m_itemIDs[i]].ID;
            this.m_itemIRs[i].UpdateItem(itemId.toString(), i);
        }
        var currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID.toString();
        var itemData = GameConfig.itemTable[currentId];
        var image = this.m_btnUse.getChildAt(0);
        image.source = "btnUse_png";
        if (!itemData.Open) {
            image.source = "btnLock_png";
        }
        this._UpdateItemInfo();
    };
    BackpackPanel.prototype._UpdateItemInfo = function () {
        var itemTableData = GameConfig.itemConfig[this.m_itemIDs[1]];
        this.m_curItemName.text = itemTableData.Name;
        this.m_curItemDesc.text = itemTableData.Desc;
    };
    BackpackPanel.prototype._OnBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeBackpackPanel);
        Common.dispatchEvent(MainNotify.openGameStartPanel);
    };
    BackpackPanel.prototype._OnBtnUse = function () {
        var currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID;
        var strId = currentId.toString();
        if (GameConfig.itemTable[strId].Open) {
            this.selectItem.play(0);
            this.m_curItem.visible = false;
            this.m_itemAnimate.visible = true;
            this.m_itemAnimate.play("1003", 1);
            if (GameConfig.itemTable[strId].IsUse == 1) {
                // TipsManager.Show(GameConfig.itemTable[strId].Name + "装备中！", Common.TextColors.red, ETipsType.DownToUp, 40, "", Config.stageHalfWidth, Config.stageHalfHeight - 190)
            }
            else {
                GameConfig.itemTable[strId].IsUse = 1;
                if (GameConfig.itemUseTable.length >= 1) {
                    var id = GameConfig.itemUseTable[0];
                    GameConfig.itemTable[id.toString()].IsUse = 0;
                    GameConfig.itemUseTable.splice(0, 1);
                }
                GameConfig.itemUseTable.push(currentId);
                Common.UpdateUseItem();
                this._UpdateBtnItem();
                // this.selectItem.play(0)
            }
        }
        else {
            this.selectItem.play(0);
            // TipsManager.Show(GameConfig.itemTable[strId].Name + "功能未开放！", Common.TextColors.red, ETipsType.DownToUp, 40, "", Config.stageHalfWidth, Config.stageHalfHeight - 175)
        }
    };
    BackpackPanel.prototype._OnBtnLeft = function () {
        if (this.swapIndex == 0) {
            this.m_groupItemIR.swapChildren(this.m_itemIRLeft1, this.m_itemIRRight1);
            this.swapIndex = 1;
        }
        this.leftAnimation.play(0);
    };
    BackpackPanel.prototype._OnBtnRight = function () {
        if (this.swapIndex == 1) {
            this.m_groupItemIR.swapChildren(this.m_itemIRLeft1, this.m_itemIRRight1);
            this.swapIndex = 0;
        }
        this.rightAnimation.play(0);
    };
    BackpackPanel.prototype._OnLeftComplete = function () {
        for (var i = 0; i < this.m_itemIDs.length; i++) {
            this.m_itemIDs[i] += 1;
            if (this.m_itemIDs[i] >= GameConfig.itemConfig.length) {
                this.m_itemIDs[i] = 0;
            }
        }
        this._UpdateAllItemList();
    };
    BackpackPanel.prototype._OnRightComplete = function () {
        for (var i = 0; i < this.m_itemIDs.length; i++) {
            this.m_itemIDs[i] -= 1;
            if (this.m_itemIDs[i] < 0) {
                this.m_itemIDs[i] = GameConfig.itemConfig.length - 1;
            }
        }
        this._UpdateAllItemList();
    };
    BackpackPanel.prototype._OnItemAnimate = function () {
        this.m_itemAnimate.visible = false;
        this.m_curItem.visible = true;
    };
    BackpackPanel.prototype.onComplete = function () {
        this.m_itemIRs.push(this.m_itemIRLeft1);
        this.m_itemIRs.push(this.m_itemIRCenter);
        this.m_itemIRs.push(this.m_itemIRRight1);
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this);
        this.m_btnUse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnUse, this);
        this.m_btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLeft, this);
        this.m_btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRight, this);
        this.leftAnimation.addEventListener("complete", this._OnLeftComplete, this);
        this.rightAnimation.addEventListener("complete", this._OnRightComplete, this);
        Common.addTouchBegin(this.m_btnReturn);
        Common.addTouchBegin(this.m_btnUse);
        Common.addTouchBegin(this.m_btnLeft);
        Common.addTouchBegin(this.m_btnRight);
        this.m_itemAnimate = new DragonBonesArmatureContainer();
        this.addChild(this.m_itemAnimate);
        var guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("ItemAnimate", "ItemAnimate");
        var guideArmature = new DragonBonesArmature(guideDisplay);
        guideArmature.ArmatureDisplay = guideDisplay;
        this.m_itemAnimate.register(guideArmature, ["1003"]);
        this.m_itemAnimate.x = Config.stageHalfWidth;
        this.m_itemAnimate.y = 1300;
        this.m_itemAnimate.scaleX = 0.8;
        this.m_itemAnimate.scaleY = 0.8;
        this.m_itemAnimate.addCompleteCallFunc(this._OnItemAnimate, this);
        this.m_curItem.visible = true;
        this.m_itemAnimate.visible = false;
        // this.m_itemAnimate.play("1003", 0)
        // this.m_itemAnimate.play("1003", 0)
        this._OnResize();
    };
    BackpackPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return BackpackPanel;
}(BasePanel));
__reflect(BackpackPanel.prototype, "BackpackPanel");
var NewItemIR = (function (_super) {
    __extends(NewItemIR, _super);
    function NewItemIR() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/newItemIR.exml";
        return _this;
    }
    NewItemIR.prototype.UpdateItem = function (strId, index) {
        var itemData = GameConfig.itemTable[strId];
        // if (GameConfig.itemTable[strId].IsUse == 0) this.m_labstatus.text = "Idle"
        // else this.m_labstatus.text = "Equipped"
        // if (!itemData.Open) this.m_labstatus.text = "Unlock"
        this.m_imgMask.alpha = 1;
        if (index == 1) {
            this.m_imgMask.visible = false;
            if (!itemData.Open) {
                this.m_imgLock.visible = true;
                this.m_imgMask.visible = true;
                this.m_imgMask.alpha = 0.5;
            }
            else
                this.m_imgLock.visible = false;
        }
        else {
            this.m_imgMask.visible = true;
            this.m_imgLock.visible = false;
        }
        if (!itemData.Open) {
            this.m_imgItem.texture = RES.getRes(itemData.LockIcon);
            this.m_itemBg.texture = RES.getRes("LockBg_png");
            // this.m_imgLock.visible = true
        }
        else {
            this.m_imgItem.texture = RES.getRes(itemData.Icon);
            this.m_itemBg.texture = RES.getRes(itemData.Bg);
            // this.m_imgLock.visible = false
        }
        // this.m_labName.text = itemData.Name
        // // this.m_labDesc.text = itemData.Desc
        // this.m_imgItem.texture = RES.getRes(itemData.Icon)
        // this.m_itemBg.texture = RES.getRes(itemData.Bg)
    };
    NewItemIR.prototype.onComplete = function () {
    };
    return NewItemIR;
}(eui.Component));
__reflect(NewItemIR.prototype, "NewItemIR");
var ItemIR = (function (_super) {
    __extends(ItemIR, _super);
    function ItemIR() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/itemIR.exml";
        return _this;
    }
    ItemIR.prototype.UpdateItem = function (strId, index) {
        var itemData = GameConfig.itemTable[strId];
        if (GameConfig.itemTable[strId].IsUse == 0)
            this.m_labstatus.text = "Idle";
        else
            this.m_labstatus.text = "Equipped";
        if (!itemData.Open)
            this.m_labstatus.text = "Unlock";
        if (index == 1)
            this.m_groupMask.visible = false;
        else
            this.m_groupMask.visible = true;
        this.m_labName.text = itemData.Name;
        this.m_labDesc.text = itemData.Desc;
        this.m_imgItem.texture = RES.getRes(itemData.Icon);
        this.m_itemBg.texture = RES.getRes(itemData.Bg);
    };
    ItemIR.prototype.onComplete = function () {
        var mask = Common.createBitmap("");
    };
    return ItemIR;
}(eui.Component));
__reflect(ItemIR.prototype, "ItemIR");
//# sourceMappingURL=BackpackPanel.js.map