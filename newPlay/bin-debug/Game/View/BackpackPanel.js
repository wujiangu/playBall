var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BackpackPanel = (function (_super) {
    __extends(BackpackPanel, _super);
    function BackpackPanel() {
        var _this = _super.call(this) || this;
        _this.m_itemIDs = new Array();
        _this.m_btnItems = new Array();
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
        // this._UpdateAllItemList()
    };
    // 进入面板
    BackpackPanel.prototype.onEnter = function () {
        Common.curPanel = PanelManager.m_backpackPanel;
        this.touchChildren = true;
        this.itemGroup.play(0);
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
        // if (a_id != null) {
        // 	if (!a_isRemove) {
        // 		if (this.m_btnItem1.name.length <= 0) this.m_btnItem1.name = a_id
        // 		else if (this.m_btnItem2.name.length <= 0) this.m_btnItem2.name = a_id
        // 		else{}
        // 	}else{
        // 		a_target.name = ""
        // 		GameConfig.itemTable[a_id].IsUse = 0
        // 		let id = parseInt(a_id)
        // 		let index = GameConfig.itemUseTable.indexOf(id)
        // 		GameConfig.itemUseTable.splice(index)
        // 	}
        // }
        // if (this.m_btnItem1.name.length > 0) {
        // 	this.m_btnItem1.visible = true
        // 	let image:eui.Image = <eui.Image>this.m_btnItem1.getChildAt(0)
        // 	image.source = GameConfig.itemTable[this.m_btnItem1.name].Icon
        // }else{
        // 	this.m_btnItem1.visible = false
        // }
        // if (this.m_btnItem2.name.length > 0) {
        // 	this.m_btnItem2.visible = true
        // 	let image:eui.Image = <eui.Image>this.m_btnItem2.getChildAt(0)
        // 	image.source = GameConfig.itemTable[this.m_btnItem2.name].Icon
        // }else{
        // 	this.m_btnItem2.visible = false
        // }
        for (var i = 0; i < this.m_btnItems.length; i++) {
            this.m_btnItems[i].visible = false;
        }
        for (var i = 0; i < GameConfig.itemUseTable.length; i++) {
            var id = GameConfig.itemUseTable[i];
            this.m_btnItems[i].visible = true;
            var image = this.m_btnItems[i].getChildAt(0);
            image.source = GameConfig.itemTable[id.toString()].Icon;
        }
        this._UpdateAllItemList();
    };
    BackpackPanel.prototype._UpdateAllItemList = function () {
        this.m_itemLeft.texture = RES.getRes(GameConfig.itemConfig[this.m_itemIDs[0]].GrayIcon);
        this.m_itemCenter.texture = RES.getRes(GameConfig.itemConfig[this.m_itemIDs[1]].Icon);
        this.m_itemRight.texture = RES.getRes(GameConfig.itemConfig[this.m_itemIDs[2]].GrayIcon);
        var currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID.toString();
        // if (GameConfig.itemTable[currentId].IsUse == 1) {
        // 	this.m_labUse.visible = true
        // }else{
        // 	this.m_labUse.visible = false
        // }
        this._UpdateItemInfo();
    };
    BackpackPanel.prototype._UpdateItemInfo = function () {
        var itemTableData = GameConfig.itemConfig[this.m_itemIDs[1]];
        this.m_labItemName.text = itemTableData.Name;
        this.m_labItemDesc.text = itemTableData.Desc;
    };
    BackpackPanel.prototype._OnBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeBackpackPanel);
        Common.dispatchEvent(MainNotify.openGameStartPanel);
    };
    BackpackPanel.prototype._OnBtnUse = function () {
        var currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID;
        var strId = currentId.toString();
        if (GameConfig.itemTable[strId].Open) {
            if (GameConfig.itemTable[strId].IsUse == 1) {
                TipsManager.Show(GameConfig.itemTable[strId].Name + "装备中！");
            }
            else {
                GameConfig.itemTable[strId].IsUse = 1;
                if (GameConfig.itemUseTable.length >= 2) {
                    var id = GameConfig.itemUseTable[0];
                    GameConfig.itemTable[id.toString()].IsUse = 0;
                    GameConfig.itemUseTable.splice(0, 1);
                }
                GameConfig.itemUseTable.push(currentId);
                Common.UpdateUseItem();
                this._UpdateBtnItem();
            }
        }
        else {
            TipsManager.Show(GameConfig.itemTable[strId].Name + "功能未开放！");
        }
    };
    BackpackPanel.prototype._OnBtnLeft = function () {
        for (var i = 0; i < this.m_itemIDs.length; i++) {
            this.m_itemIDs[i] -= 1;
            if (this.m_itemIDs[i] < 0) {
                this.m_itemIDs[i] = GameConfig.itemConfig.length - 1;
            }
        }
        this._UpdateAllItemList();
    };
    BackpackPanel.prototype._OnBtnRight = function () {
        for (var i = 0; i < this.m_itemIDs.length; i++) {
            this.m_itemIDs[i] += 1;
            if (this.m_itemIDs[i] >= GameConfig.itemConfig.length) {
                this.m_itemIDs[i] = 0;
            }
        }
        this._UpdateAllItemList();
    };
    BackpackPanel.prototype._OnTweenGroupComplete = function () {
        this.itemGroup.play(0);
    };
    BackpackPanel.prototype._OnBtnItem1 = function () {
        // this._UpdateBtnItem(this.m_btnItem1.name, true, this.m_btnItem1)
    };
    BackpackPanel.prototype._OnBtnItem2 = function () {
        // this._UpdateBtnItem(this.m_btnItem2.name, true, this.m_btnItem2)
    };
    BackpackPanel.prototype.onComplete = function () {
        this.m_btnItem1.name = "";
        this.m_btnItem2.name = "";
        this.m_btnItems.push(this.m_btnItem1);
        this.m_btnItems.push(this.m_btnItem2);
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this);
        this.m_btnUse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnUse, this);
        this.m_btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLeft, this);
        this.m_btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRight, this);
        Common.addTouchBegin(this.m_btnReturn);
        Common.addTouchBegin(this.m_btnUse);
        Common.addTouchBegin(this.m_btnLeft);
        Common.addTouchBegin(this.m_btnRight);
        this.itemGroup.addEventListener('complete', this._OnTweenGroupComplete, this);
        // this.m_btnItem1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnItem1, this)
        // this.m_btnItem2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnItem2, this)
        this._OnResize();
    };
    BackpackPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return BackpackPanel;
}(BasePanel));
__reflect(BackpackPanel.prototype, "BackpackPanel");
//# sourceMappingURL=BackpackPanel.js.map