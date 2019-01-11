class BackpackPanel extends BasePanel {
	public constructor() {
		super()

		this.m_itemIDs = new Array()
		this.m_itemIRs = new Array()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/backpackPanel.exml"
	}

	// 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData():void{
		this.m_itemIDs = [0, 1, 2]
    }

    // 进入面板
    public onEnter():void{
		Common.curPanel = PanelManager.m_backpackPanel
		this.touchChildren = true
		this.initData()

		this._UpdateBtnItem()

        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _UpdateBtnItem() {
		this.m_curItem.visible = false
		this.m_itemTypeBg.visible = false
		for (let i = 0; i < GameConfig.itemUseTable.length; i++) {
			let id = GameConfig.itemUseTable[i]
			this.m_curItem.visible = true
			this.m_itemTypeBg.visible = true
			this.m_curItem.texture = RES.getRes(GameConfig.itemTable[id.toString()].Icon)
			this.m_itemTypeBg.texture = RES.getRes(GameConfig.itemTable[id.toString()].ItemBg)
		}

		this._UpdateAllItemList()
	}

	private _UpdateAllItemList() {
		for (let i = 0; i < this.m_itemIRs.length; i++) {
			let itemId = GameConfig.itemConfig[this.m_itemIDs[i]].ID
			this.m_itemIRs[i].UpdateItem(itemId.toString(), i)
		}
		let currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID.toString()
		let itemData = GameConfig.itemTable[currentId]
		let image:eui.Image = <eui.Image>this.m_btnUse.getChildAt(0)
		image.source = "btnUse_png"
		if (!itemData.Open) image.source = "btnLock_png"
		this._UpdateItemInfo()
	}

	private _UpdateItemInfo() {
		let itemTableData = GameConfig.itemConfig[this.m_itemIDs[1]]
		this.m_curItemName.text = itemTableData.Name
		this.m_curItemDesc.text = itemTableData.Desc
	}

	private _OnBtnReturn() {
		Common.dispatchEvent(MainNotify.closeBackpackPanel)
		Common.dispatchEvent(MainNotify.openGameStartPanel)
	}

	private _OnBtnUse() {
		let currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID
		let strId = currentId.toString()
		if (GameConfig.itemTable[strId].Open) {
			this.selectItem.play(0)
			if (GameConfig.itemTable[strId].IsUse == 1) {
				// TipsManager.Show(GameConfig.itemTable[strId].Name + "装备中！", Common.TextColors.red, ETipsType.DownToUp, 40, "", Config.stageHalfWidth, Config.stageHalfHeight - 190)
			}else{
				GameConfig.itemTable[strId].IsUse = 1
				if (GameConfig.itemUseTable.length >= 1) {
					let id = GameConfig.itemUseTable[0]
					GameConfig.itemTable[id.toString()].IsUse = 0
					GameConfig.itemUseTable.splice(0, 1)
				}
				GameConfig.itemUseTable.push(currentId)
				Common.UpdateUseItem()
				this._UpdateBtnItem()
				// this.selectItem.play(0)
			}
		}else{
			// TipsManager.Show(GameConfig.itemTable[strId].Name + "功能未开放！", Common.TextColors.red, ETipsType.DownToUp, 40, "", Config.stageHalfWidth, Config.stageHalfHeight - 175)
		}
	}

	private _OnBtnLeft() {
		if (this.swapIndex == 0) {
			this.m_groupItemIR.swapChildren(this.m_itemIRLeft1, this.m_itemIRRight1)
			this.swapIndex = 1
		}
		this.leftAnimation.play(0)
		
	}

	private _OnBtnRight() {
		if (this.swapIndex == 1) {
			this.m_groupItemIR.swapChildren(this.m_itemIRLeft1, this.m_itemIRRight1)
			this.swapIndex = 0
		}
		this.rightAnimation.play(0)
		
	}

	private _OnLeftComplete() {
		for (let i = 0; i < this.m_itemIDs.length; i++) {
			this.m_itemIDs[i] += 1
			if (this.m_itemIDs[i] >= GameConfig.itemConfig.length) {
				this.m_itemIDs[i] = 0
			}
		}
		this._UpdateAllItemList()
		
	}

	private _OnRightComplete() {
		for (let i = 0; i < this.m_itemIDs.length; i++) {
			this.m_itemIDs[i] -= 1
			if (this.m_itemIDs[i] < 0) {
				this.m_itemIDs[i] = GameConfig.itemConfig.length - 1
			}
		}
		this._UpdateAllItemList()
	}

	private onComplete() {

		this.m_itemIRs.push(this.m_itemIRLeft1)
		this.m_itemIRs.push(this.m_itemIRCenter)
		this.m_itemIRs.push(this.m_itemIRRight1)
		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this)
		this.m_btnUse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnUse, this)
		this.m_btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLeft, this)
		this.m_btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRight, this)
		this.leftAnimation.addEventListener("complete", this._OnLeftComplete, this)
		this.rightAnimation.addEventListener("complete", this._OnRightComplete, this)

		Common.addTouchBegin(this.m_btnReturn)
		Common.addTouchBegin(this.m_btnUse)
		Common.addTouchBegin(this.m_btnLeft)
		Common.addTouchBegin(this.m_btnRight)

		this._OnResize()
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_itemIDs:Array<number>
	private m_curItemId:number

	private m_itemTypeBg:eui.Image
	private m_curItem:eui.Image


	private m_btnReturn:eui.Button
	private m_btnRight:eui.Button
	private m_btnLeft:eui.Button
	private m_btnUse:eui.Button

	private m_itemIRCenter:NewItemIR
	private m_itemIRLeft1:NewItemIR
	private m_itemIRRight1:NewItemIR

	private m_itemIRs:Array<NewItemIR>

	private leftAnimation:egret.tween.TweenGroup
	private rightAnimation:egret.tween.TweenGroup
	private m_groupItemIR:eui.Group

	private swapIndex:number = 0

	private m_curItemName:eui.Label
	private m_curItemDesc:eui.Label
	private selectItem:egret.tween.TweenGroup
}

class NewItemIR extends eui.Component {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/newItemIR.exml"
	}


	public UpdateItem(strId:string, index:number) {
		let itemData = GameConfig.itemTable[strId]

		// if (GameConfig.itemTable[strId].IsUse == 0) this.m_labstatus.text = "Idle"
		// else this.m_labstatus.text = "Equipped"

		// if (!itemData.Open) this.m_labstatus.text = "Unlock"

		if (index == 1) this.m_imgMask.visible = false
		else this.m_imgMask.visible = true

		// this.m_labName.text = itemData.Name
		// this.m_labDesc.text = itemData.Desc
		this.m_imgItem.texture = RES.getRes(itemData.Icon)
		this.m_itemBg.texture = RES.getRes(itemData.Bg)
	}

	private onComplete() {
		
	}

	private m_itemBg:eui.Image
	private m_imgItem:eui.Image
	private m_imgMask:eui.Image
}

class ItemIR extends eui.Component {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/itemIR.exml"
	}


	public UpdateItem(strId:string, index:number) {
		let itemData = GameConfig.itemTable[strId]

		if (GameConfig.itemTable[strId].IsUse == 0) this.m_labstatus.text = "Idle"
		else this.m_labstatus.text = "Equipped"

		if (!itemData.Open) this.m_labstatus.text = "Unlock"

		if (index == 1) this.m_groupMask.visible = false
		else this.m_groupMask.visible = true

		this.m_labName.text = itemData.Name
		this.m_labDesc.text = itemData.Desc
		this.m_imgItem.texture = RES.getRes(itemData.Icon)
		this.m_itemBg.texture = RES.getRes(itemData.Bg)
	}

	private onComplete() {
		let mask = Common.createBitmap("")
	}

	private m_itemBg:eui.Image
	private m_labstatus:eui.Label
	private m_labgrade:eui.Label
	private m_labName:eui.Label
	private m_labDesc:eui.Label
	private m_imgItem:eui.Image
	private m_groupMask:eui.Group
}