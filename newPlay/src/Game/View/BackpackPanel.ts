class BackpackPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/backpackPanel.exml"

		this.m_itemIDs = new Array()
		this.m_btnItems = new Array()
	}

	// 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData():void{
		this.m_itemIDs = [0, 1, 2]
		// this._UpdateAllItemList()
    }

    // 进入面板
    public onEnter():void{
		Common.curPanel = PanelManager.m_backpackPanel
		this.touchChildren = true
		this.itemGroup.play(0)

		this.initData()

		this._UpdateBtnItem()

        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _UpdateBtnItem(a_id?:string, a_isRemove:boolean = false, a_target:eui.Button = null) {
		if (a_id != null) {
			if (!a_isRemove) {
				if (this.m_btnItem1.name.length <= 0) this.m_btnItem1.name = a_id
				else if (this.m_btnItem2.name.length <= 0) this.m_btnItem2.name = a_id
				else{}
			}else{
				a_target.name = ""
				GameConfig.itemTable[a_id].IsUse = 0
				let id = parseInt(a_id)
				let index = GameConfig.itemUseTable.indexOf(id)
				GameConfig.itemUseTable.splice(index)
			}
		}

		if (this.m_btnItem1.name.length > 0) {
			this.m_btnItem1.visible = true
			let image:eui.Image = <eui.Image>this.m_btnItem1.getChildAt(0)
			image.source = GameConfig.itemTable[this.m_btnItem1.name].Icon
		}else{
			this.m_btnItem1.visible = false
		}
		
		if (this.m_btnItem2.name.length > 0) {
			this.m_btnItem2.visible = true
			let image:eui.Image = <eui.Image>this.m_btnItem2.getChildAt(0)
			image.source = GameConfig.itemTable[this.m_btnItem2.name].Icon
		}else{
			this.m_btnItem2.visible = false
		}

		this._UpdateAllItemList()
	}

	private _UpdateAllItemList() {
		this.m_itemLeft.texture = RES.getRes(GameConfig.itemConfig[this.m_itemIDs[0]].GrayIcon)
		this.m_itemCenter.texture = RES.getRes(GameConfig.itemConfig[this.m_itemIDs[1]].Icon)
		this.m_itemRight.texture = RES.getRes(GameConfig.itemConfig[this.m_itemIDs[2]].GrayIcon)

		let currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID.toString()
		if (GameConfig.itemTable[currentId].IsUse == 1) {
			this.m_labUse.visible = true
		}else{
			this.m_labUse.visible = false
		}
		this._UpdateItemInfo()
	}

	private _UpdateItemInfo() {
		let itemTableData = GameConfig.itemConfig[this.m_itemIDs[1]]
		this.m_labItemName.text = itemTableData.Name
		this.m_labItemDesc.text = itemTableData.Desc
	}

	private _OnBtnReturn() {
		Common.dispatchEvent(MainNotify.closeBackpackPanel)
		Common.dispatchEvent(MainNotify.openGameStartPanel)
	}

	private _OnBtnUse() {
		if (GameConfig.itemUseTable.length < 2) {
			let currentId = GameConfig.itemConfig[this.m_itemIDs[1]].ID
			let strId = currentId.toString()
			if (GameConfig.itemTable[strId].IsUse == 1) {
				TipsManager.Show(GameConfig.itemTable[strId].Name + "装备中！")
			}else{
				GameConfig.itemTable[strId].IsUse = 1
				GameConfig.itemUseTable.push(currentId)
				this.m_labUse.visible = true
				this._UpdateBtnItem(strId)
			}
		}else{
			TipsManager.Show("装备数量已达到上限！")
		}
	}

	private _OnBtnLeft() {
		for (let i = 0; i < this.m_itemIDs.length; i++) {
			this.m_itemIDs[i] -= 1
			if (this.m_itemIDs[i] < 0) {
				this.m_itemIDs[i] = GameConfig.itemConfig.length - 1
			}
		}
		this._UpdateAllItemList()
	}

	private _OnBtnRight() {
		for (let i = 0; i < this.m_itemIDs.length; i++) {
			this.m_itemIDs[i] += 1
			if (this.m_itemIDs[i] >= GameConfig.itemConfig.length) {
				this.m_itemIDs[i] = 0
			}
		}
		this._UpdateAllItemList()
	}

	private _OnTweenGroupComplete() {
		this.itemGroup.play(0)
	}

	private _OnBtnItem1() {
		this._UpdateBtnItem(this.m_btnItem1.name, true, this.m_btnItem1)
	}

	private _OnBtnItem2() {
		this._UpdateBtnItem(this.m_btnItem2.name, true, this.m_btnItem2)
	}

	private onComplete() {
		
		this.m_btnItem1.name = ""
		this.m_btnItem2.name = ""

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this)
		this.m_btnUse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnUse, this)
		this.m_btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLeft, this)
		this.m_btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRight, this)
		this.itemGroup.addEventListener('complete', this._OnTweenGroupComplete, this);

		this.m_btnItem1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnItem1, this)
		this.m_btnItem2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnItem2, this)

		this._OnResize()
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_itemIDs:Array<number>
	private m_curItemId:number


	private m_btnReturn:eui.Button
	private m_btnRight:eui.Button
	private m_btnLeft:eui.Button
	private m_btnUse:eui.Button

	private m_labItemName:eui.Label
	private m_labItemDesc:eui.Label

	private m_itemCenter:eui.Image
	private m_itemLeft:eui.Image
	private m_itemRight:eui.Image

	private itemGroup:egret.tween.TweenGroup

	private m_labUse:eui.Label

	private m_btnItem1:eui.Button
	private m_btnItem2:eui.Button
	private m_btnItems:Array<any>
}