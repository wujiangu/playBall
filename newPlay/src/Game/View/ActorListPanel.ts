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
		this._pageReset(3)
    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = true
		this.initData()
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _pageReset(a_pageCount) {
		let distance = 43
		// 1-->86.5 2-->65 3-->43 108 - 21.5*a_pageCount
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

		this.m_srollView.itemNum = a_pageCount
		this.m_srollView.reset(this.m_imgPages)
	}

	private _onBtnReturn() {
		Common.dispatchEvent(MainNotify.closeActorListPanel)
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
				this.m_actors.push(actor)
				this.m_pages[i].addChild(actor)
			}
		}

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
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
}

class ActorIR extends eui.Component {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/actorIR.exml"
	}

	private _onActorClick() {
		
	}

	private _onComplete() {
		this.m_imgActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this)
	}

	private m_imgActor:eui.Image
}