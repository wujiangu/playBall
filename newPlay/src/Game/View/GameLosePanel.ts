class GameLosePanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameLosePanel.exml"
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
		this.countDown = 5;
		this.Show.play(0)		
		PanelManager.gameScenePanel.sceneData.addCandy = 0
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.Hide.play(0)
    }

	
	public update(time:number)//每帧执行
	{
		this.sumNum += time;
		if(this.sumNum >= 1000)
		{
			if(this.isStartCountDown)
			{
				if(this.countDown > 0)
				{					
					this._lblCountDown.text = this.countDown.toString();	
					this.countDown --;											
				}
				else
				{
					this.isStartCountDown = false;
					//倒计时结束，跳转到选择界面
					if(!this.isShowConflict)
					{
						Common.dispatchEvent(MainNotify.closeGameLosePanel);
						Common.dispatchEvent(MainNotify.openGameOverPanel);
					}
				}
			}
			this.sumNum = 0;
		}		
	}

	private _onBtnReturn() {
		this.touchChildren = false
		Common.dispatchEvent(MainNotify.closeGameLosePanel)
		
	}

	private _onBtnAgain() {
		this.touchChildren = false
		this.Hide.play(0)
	}

	private _onBtnClose(){
		//关闭当前界面
		this.touchChildren = false
		this.isShowConflict = true;
		this.Hide.play(0)
		//跳转到重新开始返回主界面
		Common.dispatchEvent(MainNotify.openGameOverPanel)
	}

	private _onBtnResurgence(){
		// this.touchChildren = false
		// Common.dispatchEvent(MainNotify.closeGameLosePanel)
		// //跳转广告界面

	}

	private _onShow() {
		this.touchChildren = true	
		this.isStartCountDown = true;	
		this.isShowConflict = false;
		this._lblCountDown.visible = true;
		this._lblCountDown.text = "5";			
	}

	private _onHide() {
		this._lblCountDown.visible = false;	
		this._lblCountDown.text = "5";
		Common.gameScene().uiLayer.removeChild(this)
	}

	private onComplete() {
		this._onResize()
		this.m_btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnClose, this)
		this.m_btnResurgence.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnResurgence, this)

		Common.addTouchBegin(this.m_btnClose)
		Common.addTouchBegin(this.m_btnResurgence)
		
		this.Show.addEventListener('complete', this._onShow, this)
		this.Hide.addEventListener('complete', this._onHide, this)		
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }

	private m_btnClose:eui.Button
	private m_btnResurgence:eui.Button
	private _lblCountDown:eui.Label
	private countDown:number
	private sumNum:number = 0
	private isStartCountDown:boolean = false;
	private isShowConflict:boolean = false;

	/**本次得分 */

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup

	private channel:egret.SoundChannel
}