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
		Animations.popupIn(this.m_groupSetting, 300, function(){
			Common.gameScene().uiLayer.removeChild(this)
		}.bind(this))
    }

	private _OnSoundSlider(e:egret.Event) {
		let slider = <eui.HSlider>e.target
		GameConfig.soundValue = slider.pendingValue
	}

	private _OnBGMSlider(e:egret.Event) {
		let slider = <eui.HSlider>e.target
		GameConfig.bgmValue = slider.pendingValue
		if (GameVoice.beginBGMChannel != null) GameVoice.beginBGMChannel.volume = GameConfig.bgmValue / 100
	}

	private _OnClose() {
		this.hide.play(0)
		
	}

	private _OnShow() {
		this.m_imgMask.touchEnabled = true
	}

	private _OnHide() {
		Common.dispatchEvent(MainNotify.closeSettingPanel)
	}

	private onComplete() {
		
		this._OnResize()
		this.m_sliderSound.addEventListener(egret.Event.CHANGE, this._OnSoundSlider, this)
		this.m_sliderBGM.addEventListener(egret.Event.CHANGE, this._OnBGMSlider, this)
		this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this)

		this.show.addEventListener('complete', this._OnShow, this)
		this.hide.addEventListener('complete', this._OnHide, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_sliderSound:eui.HSlider
	private m_sliderBGM:eui.HSlider
	private m_groupSetting:eui.Group
	private m_imgMask:eui.Image

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
}