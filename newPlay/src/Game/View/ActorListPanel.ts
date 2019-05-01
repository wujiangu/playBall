class ActorListPanel extends BasePanel {
	public constructor() {
		super()

		this._imgPages = new Array()
		this._pages = new Array()
		this._actors = new Array()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/listActorPanel.exml"
	}

	// 初始化面板
    public initPanel():void{

    }

    // 初始化面板数据
    public initData():void{
		
		this._BabyISCanBuy = false ;
		this._currentChooseBaby = GameConfig.curBaby;
		let pageCount = Math.ceil(GameConfig.babyOpenList.length / 9)

		this._pageReset(pageCount)	

		this.updateBabyInfo(GameConfig.curBaby)
		this._labCount.text = GameConfig.candy.toString()

		this._labCount.x = 280 - this._labCount.width
		this._imgCandy.x = this._labCount.x - 63
    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = true
		this.initData()
		this.xuanzhuan.play(0)
		this.shangdian.play(0)
		Common.updateBabylistIndex(1)
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.xuanzhuan.stop()
		this.shangdian.stop()
		this.jiany.stop()
		Common.gameScene().uiLayer.removeChild(this)
    }

	public updateBabyInfo(a_id:number) {		
		let data = GameConfig.actorTable[a_id.toString()]		
		this._currentBabyId = a_id;
		this._labActorName.text = data.name
		this._labDesc.text = data.desc
		let index = GameConfig.babyUnlockList.indexOf(a_id)
		this._updateBtnBuyShowState(a_id);
		if (index < 0) {
			this._labDesc.text = data.unlockDesc
			this.m_imgShadow.visible = true
			this.m_imgShadow.source = data.shadow
			this._actorArmatureContainer.visible = false
			this.jiany.play(0)
		}else{
			this.m_imgShadow.visible = false
			this._actorArmatureContainer.visible = true
			this._actorArmatureContainer.clear()
			let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.action, data.action)
			if (this._actorArmature == null) {
				this._actorArmature = new DragonBonesArmature(armatureDisplay)
			}
			this._actorArmature.ArmatureDisplay = armatureDisplay
			this._actorArmatureContainer.register(this._actorArmature,["fangdazhao", "idle", "zoulu"])
			this._actorShadow()
			this._actorArmatureContainer.play("idle", 0)
			this._actorState = EMonsterState.Ready
			this._actorArmatureContainer.scaleX = 0.5
			this._actorArmatureContainer.scaleY = 0.5
			this._actorArmatureContainer.addCompleteCallFunc(this._actorArmatureComplete, this)
		}

		

		for (let i = 0; i < GameConfig.babyOpenList.length; i++) {
			let id = GameConfig.babyOpenList[i]
			let data = GameConfig.actorTable[id]
			let index = GameConfig.babyUnlockList.indexOf(id)
			this._actors[i].visible = true
			if (index < 0) {
				this._actors[i].actorIcon = data.lockIcon
			}else{
				this._actors[i].actorIcon = data.icon
			}
			this._actors[i].id = data.id
			this._actors[i].setLight(false)
			if (id == a_id) this._actors[i].setLight(true)
		}
	}

	private _pageReset(a_pageCount) {
		let distance = 43
		for (let i= 0; i < this._imgPages.length; i++) {
			this._imgPages[i].visible = false
			this._imgPages[i].source = "actorList3_png"
		}
		for (let i= 0; i < a_pageCount; i++) {
			let begin = 108 - 21.5 * a_pageCount
			this._imgPages[i].visible = true
			this._imgPages[i].x = begin + 43 * i
		}
		this._imgPages[0].source = "actorList4_png"

		for (let i= 0; i < this._pages.length; i++) {
			this._pages[i].visible = false
		}
		for (let i= 0; i < a_pageCount; i++) {
			this._pages[i].visible = true
		}

		this._initActorIcon()
		this._srollView.itemNum = a_pageCount
		this._srollView.reset(this._imgPages)
		this._srollView.spacing = 20
		
	}

	private _updateBtnBuyShowState(babyID:number)//更新购买按钮显示状态
	{
		// 判断是否在已解锁列表中
		let index = GameConfig.babyUnlockList.indexOf(babyID)
		let baby = GameConfig.actorTable[babyID.toString()]
		//如果没有该宠物价格为0，那么并且没有该宠物那么购买按钮就显示未解锁状态
		if(baby.petPrice == 0)
		{
			if (index < 0) {//未拥有,切换未解锁按钮资源
				this._BabyISCanBuy = false;
				this._btnBuy.source = "btnCannotBuyImg_png";
				this._btnBuy.visible = true;
				this._lblBabyPrice.visible = false;				
			}
			else//已拥有
			{
				this._btnBuy.visible = false;
				this._lblBabyPrice.visible = false;
			}
		}
		else//如果该宠物的价格不为0，判断自己是否拥有该宠物，如果有不显示购买按钮，否则显示
		{
			if (index < 0) {//未拥有
				this._BabyISCanBuy = true;
				this._btnBuy.source = "btnBuyImg_png";
				this._btnBuy.visible = true;
				this._lblBabyPrice.visible = true;		
				this._lblBabyPrice.text = baby.petPrice;
				this._needBabyPrice = baby.petPrice;
			}
			else//已拥有
			{
				this._btnBuy.visible = false;
				this._lblBabyPrice.visible = false;
			}
		}
	}

	private _initActorIcon() {
		for (let i = 0; i < this._actors.length; i++) {
			this._actors[i].visible = false
		}
	}

	private _onBtnReturn() {
		Common.dispatchEvent(MainNotify.closeActorListPanel)
		Common.dispatchEvent(MainNotify.openGameStartPanel)
	}

	private _onBtnAddCandy() {
		Common.dispatchEvent(MainNotify.openRechargePanel)
	}

	private _onBtnFusion() {
		GameConfig.sceneType = 1
		Common.dispatchEvent(MainNotify.openCapsulePanel)
	}

	private _onBtnBuyClick()//购买
	{
		if(this._BabyISCanBuy)//如果能够购买
		{
			//判断自己的糖果数目是否能够购买
			if(GameConfig.candy >= this._needBabyPrice)
			{
				Common.dispatchEvent(MainNotify.openBuyConfirmPanel)								
			}
			else
			{
				TipsManager.show(`Insufficient candy!`);
			}
		}
		else
		{
			TipsManager.show(`Not yet open!`);
		}	
		
	}

	private _onGroupActor() {
		this._actorArmatureContainer.play("fangdazhao", 1)
		this._actorState = EMonsterState.Attack
	}

	private _actorArmatureComplete() {
		Common.log(this._actorState)
		if (this._actorState == EMonsterState.Attack) {
			this._actorArmatureContainer.play("idle", 0)
			this._actorState = EMonsterState.Ready
		}
	}

	private _actorShadow(){
		// var distance:number = 20;           /// 阴影的偏移距离，以像素为单位
		// var angle:number = 45;              /// 阴影的角度，0 到 360 度
		// var color:number = 0x000000;        /// 阴影的颜色，不包含透明度
		// var alpha:number = 0.7;             /// 光晕的颜色透明度，是对 color 参数的透明度设定
		// var blurX:number = 255;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
		// var blurY:number = 255;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
		// var strength:number = 65;                /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		// var quality:number = egret.BitmapFilterQuality.LOW;              /// 应用滤镜的次数，暂无实现
		// var inner:boolean = false;            /// 指定发光是否为内侧发光
		// var knockout:boolean = false;            /// 指定对象是否具有挖空效果

		// let glowFilter = new egret.DropShadowFilter(distance, angle, color, alpha, blurX, blurY,strength, quality, inner, knockout)
		// this._actorArmatureContainer.filters = [glowFilter]
	}

	private _onLoop() {
		this.xuanzhuan.play(0)
	}

	private _onLoopBabyShadow() {
		this.jiany.play(0)
	}

	private _onShangdian() {
		this.shangdian.play(0)
	}

	private _updateCandy() {
		this._labCount.text = GameConfig.candy.toString()
		this._labCount.x = 280 - this._labCount.width
		this._imgCandy.x = this._labCount.x - 63
	}

	private _onComplete() {
		this._imgPages.push(this._imgPage1)
		this._imgPages.push(this._imgPage2)
		this._imgPages.push(this._imgPage3)
		this._imgPages.push(this._imgPage4)
		this._imgPages.push(this._imgPage5)

		this._pages.push(this._page1)
		this._pages.push(this._page2)
		this._pages.push(this._page3)
		this._pages.push(this._page4)
		this._pages.push(this._page5)

		let distance = 203

		for (let i = 0; i < this._pages.length; i++) {
			for (let j = 0; j < 9; j++) {
				let actor = new ActorIR()
				let col = j % 3
				let row = Math.floor(j/3)
				actor.x = distance * col
				actor.y = distance * row
				actor.scaleX = 0.9
				actor.scaleY = 0.9
				this._actors.push(actor)
				actor.id = this._actors.length
				this._pages[i].addChild(actor)
			}
		}

		this._actorArmatureContainer = new DragonBonesArmatureContainer()
		this._actorArmatureContainer.x = this._groupActor.width / 2
        this._actorArmatureContainer.y = this._groupActor.height
		this._groupActor.addChild(this._actorArmatureContainer)
		

		this._btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
		this._btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAddCandy, this)
		this._btnFusion.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnFusion, this)
		this._groupActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onGroupActor, this)
		this._btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnBuyClick, this);

		this.xuanzhuan.addEventListener('complete', this._onLoop, this)
		this.jiany.addEventListener('complete', this._onLoopBabyShadow, this)
		this.shangdian.addEventListener('complete', this._onShangdian, this)

		Common.addTouchBegin(this._btnReturn)
		Common.addTouchBegin(this._btnAddCandy)

		Common.addEventListener(MainNotify.updateCandy, this._updateCandy, this)
	}

	private m_pageNum = 5
	// 底部标签
	private _imgPage1:eui.Image
	private _imgPage2:eui.Image
	private _imgPage3:eui.Image
	private _imgPage4:eui.Image
	private _imgPage5:eui.Image
	private _imgPages:Array<eui.Image>

	private _srollView:ScrollView
	private _pages:Array<eui.Group>
	private _page1:eui.Group
	private _page2:eui.Group
	private _page3:eui.Group
	private _page4:eui.Group
	private _page5:eui.Group

	private _actors:Array<ActorIR>

	private _btnReturn:eui.Button

	private _labActorName:eui.Label
	private _labDesc:eui.Label
	private _groupActor:eui.Group

	private _labCount:eui.Label
	private _btnAddCandy:eui.Button
	private _btnFusion:eui.Button
	private _imgCandy:eui.Image
	private _btnBuy:eui.Image
	private _lblBabyPrice:eui.Label
	private _needBabyPrice:number
	private _currentBabyId:number
	private _BabyISCanBuy:boolean

	private _actorArmatureContainer:DragonBonesArmatureContainer
    private _actorArmature:DragonBonesArmature
	private _actorState:EMonsterState

	private xuanzhuan:egret.tween.TweenGroup
	private jiany:egret.tween.TweenGroup
	private shangdian:egret.tween.TweenGroup

	private m_imgShadow:eui.Image
	public _currentChooseBaby:number
}

class ActorIR extends eui.Component {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/actorIR.exml"
	}

	public set id(value) {
		this._id = value
	}

	public get id() {
		return this._id
	}

	public set actorIcon(value) {
		this._imgActor.source = value
	}

	public setLight(a_status) {
		this._imgBox.visible = a_status
	}



	public init() {

	}

	private _onActorClick() {
		PanelManager.actorListPanel.updateBabyInfo(this._id)
		PanelManager.actorListPanel._currentChooseBaby = this._id;
		// 判断是否在已解锁列表中
		let index = GameConfig.babyUnlockList.indexOf(this._id)
		if (index >= 0) {
			Common.updateCurBaby(this._id)			
		}
	}

	private _onComplete() {
		this._imgActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this)
	}

	private _imgActor:eui.Image
	private _imgBox:eui.Image
	private _id:number
}