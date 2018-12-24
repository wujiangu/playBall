class GameOverPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameOverPanel.exml"
	}

	// 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		// Common.curPanel = PanelManager.m_backpackPanel
		
        Common.gameScene().uiLayer.addChild(this)

		this.m_btnReturn.enabled = false
		Animations.popupOut(this.m_groupGameOver, 300, function(){
			this.m_btnReturn.enabled = true
		}.bind(this))
    }

    // 退出面板
    public onExit():void{
		Animations.popupIn(this.m_groupGameOver, 300, function(){
			Common.gameScene().uiLayer.removeChild(this)
		}.bind(this))
    }

	private _OnBtnReturn() {
		Common.dispatchEvent(MainNotify.closeGameOverPanel)
	}

	private _OnBtnAgain() {

	}

	private onComplete() {
		
		this._OnResize()

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this)
		this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAgain, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_btnReturn:eui.Button
	private m_btnAgain:eui.Button
	private m_groupGameOver:eui.Group

	/**本次得分 */
	private m_labScore:eui.Label
	/**历史最高分 */
	private m_labHistoryScore:eui.Label
}