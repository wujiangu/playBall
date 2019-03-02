class ActorListPanel extends BasePanel {
	public constructor() {
		super()

		this.m_imgPages = new Array()
		this.m_pages = new Array()
		this.m_actors = new Array()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/listActorPanel.exml"
	}

	// 初始化面板
    public initPanel():void{

    }

    // 初始化面板数据
    public initData():void{

		let pageCount = Math.ceil(GameConfig.babyOpenList.length / 9)

		this._pageReset(pageCount)

		this.updateBabyInfo(GameConfig.curBaby)
    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = true
		this.initData()
		this.xuanzhuan.play(0)
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.xuanzhuan.stop()
		Common.gameScene().uiLayer.removeChild(this)
    }

	public updateBabyInfo(a_id:number) {
		let data = GameConfig.actorTable[a_id.toString()]
		this.m_labActorName.text = data.name
		this.m_labDesc.text = data.desc
		this.m_actorArmatureContainer.clear()
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.action, data.action)
		if (this.m_actorArmature == null) {
			this.m_actorArmature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_actorArmature.ArmatureDisplay = armatureDisplay
		this.m_actorArmatureContainer.register(this.m_actorArmature,["fangdazhao", "idle", "zoulu"])
		this.m_actorArmatureContainer.play("idle")
		this.m_actorArmatureContainer.scaleX = 0.5
		this.m_actorArmatureContainer.scaleY = 0.5

		for (let i = 0; i < GameConfig.babyOpenList.length; i++) {
			let id = GameConfig.babyOpenList[i]
			let data = GameConfig.actorTable[id]
			this.m_actors[i].visible = true
			this.m_actors[i].actorIcon = data.icon
			this.m_actors[i].id = data.id
			this.m_actors[i].SetLight(false)
			if (id == a_id) this.m_actors[i].SetLight(true)
		}
	}



	private _pageReset(a_pageCount) {
		let distance = 43
		for (let i= 0; i < this.m_imgPages.length; i++) {
			this.m_imgPages[i].visible = false
			this.m_imgPages[i].source = "actorList3_png"
		}
		for (let i= 0; i < a_pageCount; i++) {
			let begin = 108 - 21.5 * a_pageCount
			this.m_imgPages[i].visible = true
			this.m_imgPages[i].x = begin + 43 * i
		}
		this.m_imgPages[0].source = "actorList4_png"

		for (let i= 0; i < this.m_pages.length; i++) {
			this.m_pages[i].visible = false
		}
		for (let i= 0; i < a_pageCount; i++) {
			this.m_pages[i].visible = true
		}

		this._initActorIcon()
		this.m_srollView.itemNum = a_pageCount
		this.m_srollView.reset(this.m_imgPages)
		this.m_srollView.spacing = 20
	}

	private _initActorIcon() {
		for (let i = 0; i < this.m_actors.length; i++) {
			this.m_actors[i].visible = false
		}
	}

	private _onBtnReturn() {
		Common.dispatchEvent(MainNotify.closeActorListPanel)
		Common.dispatchEvent(MainNotify.openGameStartPanel)
	}

	private _onBtnAddCandy() {
		Common.dispatchEvent(MainNotify.openRechargePanel)
	}

	private _onLoop() {
		this.xuanzhuan.play(0)
	}

	private _onComplete() {
		this.m_imgPages.push(this.m_imgPage1)
		this.m_imgPages.push(this.m_imgPage2)
		this.m_imgPages.push(this.m_imgPage3)
		this.m_imgPages.push(this.m_imgPage4)
		this.m_imgPages.push(this.m_imgPage5)

		this.m_pages.push(this.m_page1)
		this.m_pages.push(this.m_page2)
		this.m_pages.push(this.m_page3)
		this.m_pages.push(this.m_page4)
		this.m_pages.push(this.m_page5)

		let distance = 216

		for (let i = 0; i < this.m_pages.length; i++) {
			for (let j = 0; j < 9; j++) {
				let actor = new ActorIR()
				let col = j % 3
				let row = Math.floor(j/3)
				actor.x = distance * col
				actor.y = distance * row
				actor.scaleX = 0.8
				actor.scaleY = 0.8
				this.m_actors.push(actor)
				actor.id = this.m_actors.length
				this.m_pages[i].addChild(actor)
			}
		}

		this.m_actorArmatureContainer = new DragonBonesArmatureContainer()
		this.m_actorArmatureContainer.x = this.m_groupActor.width / 2
        this.m_actorArmatureContainer.y = this.m_groupActor.height
		this.m_groupActor.addChild(this.m_actorArmatureContainer)

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
		this.m_btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAddCandy, this)

		this.xuanzhuan.addEventListener('complete', this._onLoop, this)

	}

	private m_pageNum = 5
	// 底部标签
	private m_imgPage1:eui.Image
	private m_imgPage2:eui.Image
	private m_imgPage3:eui.Image
	private m_imgPage4:eui.Image
	private m_imgPage5:eui.Image
	private m_imgPages:Array<eui.Image>

	private m_srollView:ScrollView
	private m_pages:Array<eui.Group>
	private m_page1:eui.Group
	private m_page2:eui.Group
	private m_page3:eui.Group
	private m_page4:eui.Group
	private m_page5:eui.Group

	private m_actors:Array<ActorIR>

	private m_btnReturn:eui.Button

	private m_labActorName:eui.Label
	private m_labDesc:eui.Label
	private m_groupActor:eui.Group

	private m_labCount:eui.Label
	private m_btnAddCandy:eui.Button

	private m_actorArmatureContainer:DragonBonesArmatureContainer
    private m_actorArmature:DragonBonesArmature

	private xuanzhuan:egret.tween.TweenGroup
}

class ActorIR extends eui.Component {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/actorIR.exml"
	}

	public set id(value) {
		this.m_id = value
	}

	public get id() {
		return this.m_id
	}

	public set actorIcon(value) {
		this.m_imgActor.source = value
	}

	public SetLight(a_status) {
		this.m_imgBox.visible = a_status
	}



	public init() {

	}

	private _onActorClick() {
		Common.log("选择了 " + this.m_id)
		PanelManager.m_actorListPanel.updateBabyInfo(this.m_id)
		Common.UpdateCurBaby(this.m_id)
	}

	private _onComplete() {
		this.m_imgActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this)
	}

	private m_imgActor:eui.Image
	private m_imgBox:eui.Image
	private m_id:number
}