class BuyConfirmPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/buyConfirmPanel.exml"
	}

	// 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = false
		this.Show.play(0)	
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.Hide.play(0)
    }

	private _onBtnNotBuy() {
		this.touchChildren = false
		Common.dispatchEvent(MainNotify.closeBuyConfirmPanel)		
	}

	private _onbtnSureBuy() {        
		this.touchChildren = false
        Common.log("this.babyData.id : "+ this.babyData.id + ",this.babyData.petPrice:" + this.babyData.petPrice + ",GameConfig.candy:"+GameConfig.candy);
        //更新自己的糖果数目
        Common.updateAfterBuyCurCandy(GameConfig.candy - this.babyData.petPrice);
        //刷新宠物面板 获得改宠物
        PanelManager.actorListPanel.updateBabyInfo(this.babyData.id);
        if (this.babyIndex < 0) {
            Common.updateCurBaby(this.babyData.id)
        }
        GameConfig.babyUnlockList.push(this.babyData.id)
        Common.updateUnlockBaby()
		this.Hide.play(0)
        Common.dispatchEvent(MainNotify.openActorListPanel);
	}

	private _onShow() {
		this.touchChildren = true
        this.babyIndex = GameConfig.babyUnlockList.indexOf(PanelManager.actorListPanel._currentChooseBaby)
		this.babyData = GameConfig.actorTable[PanelManager.actorListPanel._currentChooseBaby.toString()]
        this._lblPrice.text = "-"+this.babyData.petPrice;
	}

	private _onHide() {
		Common.gameScene().uiLayer.removeChild(this)

	}

	private onComplete() {
		this._onResize()
		this.m_btnNotBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnNotBuy, this)
		this.m_btnSureBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onbtnSureBuy, this)
		
		
		this.Show.addEventListener('complete', this._onShow, this)
		this.Hide.addEventListener('complete', this._onHide, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }

    private _lblPrice:eui.Label
	private m_btnNotBuy:eui.Image
	private m_btnSureBuy:eui.Image

    private babyIndex;
    private babyData;

	/**本次得分 */

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup

	private channel:egret.SoundChannel
}