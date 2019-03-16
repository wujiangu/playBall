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
        Common.gameScene().uiLayer.addChild(this)
		this.m_sliderSound.maximum = 100
		this.m_sliderBGM.maximum = 100
		this.m_sliderSound.value = GameConfig.bgmValue
		this.m_sliderBGM.value = GameConfig.soundValue
		this.m_imgMask.touchEnabled = false
		this.show.play(0)
    }

    // 退出面板
    public onExit():void{
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _onSoundSlider(e:egret.Event) {
		let slider = <eui.HSlider>e.target
		GameConfig.soundValue = slider.pendingValue
	}

	private _onBGMSlider(e:egret.Event) {
		let slider = <eui.HSlider>e.target
		GameConfig.bgmValue = slider.pendingValue
		if (GameVoice.beginBGMChannel != null) GameVoice.beginBGMChannel.volume = GameConfig.bgmValue / 100
	}

	private _onClose() {
		this.hide.play(0)
	}

	private _onShow() {
		this.m_imgMask.touchEnabled = true
	}

	private _onHide() {
		Common.dispatchEvent(MainNotify.closeSettingPanel)
	}

	private onComplete() {
		this._onResize()
		this.m_sliderSound.addEventListener(egret.Event.CHANGE, this._onSoundSlider, this)
		this.m_sliderBGM.addEventListener(egret.Event.CHANGE, this._onBGMSlider, this)
		this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this)
		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._onHide, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }

	private m_sliderSound:eui.HSlider
	private m_sliderBGM:eui.HSlider
	private m_groupSetting:eui.Group
	private m_imgMask:eui.Image

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
}