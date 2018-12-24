class SettingPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/settingPanel.exml"
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

		this.m_sliderSound.maximum = 100
		this.m_sliderBGM.maximum = 100
		this.m_sliderSound.value = 50
		this.m_sliderBGM.value = 30
		this.m_btnReturn.enabled = false
		Animations.popupOut(this.m_groupSetting, 300, function(){
			this.m_btnReturn.enabled = true
		}.bind(this))
    }

    // 退出面板
    public onExit():void{
		Animations.popupIn(this.m_groupSetting, 300, function(){
			Common.gameScene().uiLayer.removeChild(this)
		}.bind(this))
    }

	private _OnSoundSlider() {
		
	}

	private _OnBGMSlider() {

	}

	private _OnClose() {
		Common.dispatchEvent(MainNotify.closeSettingPanel)
	}

	private onComplete() {
		
		this._OnResize()

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this)
		this.m_sliderSound.addEventListener(egret.Event.CHANGE, this._OnSoundSlider, this)
		this.m_sliderBGM.addEventListener(egret.Event.CHANGE, this._OnBGMSlider, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_btnReturn:eui.Button
	private m_sliderSound:eui.HSlider
	private m_sliderBGM:eui.HSlider
	private m_groupSetting:eui.Group
}