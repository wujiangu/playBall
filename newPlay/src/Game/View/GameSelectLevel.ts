class GameSelectLevel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/guankajiemian.exml"
	}

	// 初始化面板
    public initPanel():void{

    }

    // 初始化面板数据
    public initData():void{
		this.groupTip.visible = false
		// this._srollView.itemNum = a_pageCount
		// this._srollView.reset(this._imgPages)
		// this._srollView.spacing = 20
		this._curChapterIndex = GameConfig.curChpter % 1000
		this._curSelectChapter = GameConfig.curChpter
		this._updateChapterInfo()
		if (this._curSelectChapter == GameConfig.curChpter && GameConfig.isOpenNewChapter == true) {
			this.m_imgIcon.visible = false
			let chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()]
			this.m_imgChapter.source = chapterData.unlockIcon
			this.m_imgIcon.source = "guankajiemian13_png"
		}

		this.m_imgEndlessBg.source = "guankajiemian12_png"
		this.m_imgEndlessIcon.source = "guankajiemian15_png"
		if (GameConfig.curChpter <= 1001) {
			this.m_imgEndlessBg.source = "guankajiemian16_png"
			this.m_imgEndlessIcon.source = "guankajiemian14_png"
		}
    }

    // 进入面板
    public onEnter():void{

		this.touchChildren = false
		this.initData()
		this.show.play(0)
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	public get selectChater() {
		return this._curSelectChapter
	}

	private _onShow() {
		if (GameConfig.isOpenNewChapter) {
			this.m_groupLock.visible = true
			this.suo.play(0)
		}else{
			this.touchChildren = true
		}
	}

	private _OnHide() {
		Common.dispatchEvent(MainNotify.closeGameSelectLevel)
		if (this._status == 1) {
			// Common.dispatchEvent(MainNotify.closeGameStartPanel)
			Common.dispatchEvent(MainNotify.openGamePanel)
		}else{
			Common.dispatchEvent(MainNotify.openGameStartPanel)
		}
	}

	private _OnLock() {
		this.touchChildren = true
		this.m_imgIcon.visible = true
		let chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()]
		this.m_imgChapter.source = chapterData.icon
	}

	private _onMaskClick() {
		this.touchChildren = false
		this.hide.play(0)
		this._status = 0
	}

	private _onChapterBegin() {
		this.m_imgChapter.alpha = 0.8
	}

	private _onChapterEnd() {
		this.m_imgChapter.alpha = 1
	}

	private _onChapterClick() {
		if (!this._isLock()) {
			this._beforeEnterBattle()
			GameConfig.gameMode = EBattleMode.Level
		}
	}

	private _onEndlessBegin() {
		this.m_imgEndlessBg.alpha = 0.8
	}

	private _onEndlessEnd() {
		this.m_imgEndlessBg.alpha = 1
	}

	private _onEndlessClick() {
		if (GameConfig.curChpter > 1001) {
			this._beforeEnterBattle()
			GameConfig.gameMode = EBattleMode.Endless
		}
		else{//未解锁提示
			TipsManager.show(`Chapter 1 Unlocking Endless Mode of 
			Customs Clearance!`)
		}
	}

	//进入之前的准备
	private _beforeEnterBattle() {
		this.touchChildren = false
		this.hide.play(0)
		this._status = 1
		if(GameConfig.isPlaySound)
		{
			GameVoice.beginBGMChannel.stop()
			let voice = GameVoice.vectory.play(0,1)
			voice.volume = GameConfig.soundValue / 100
		}		
	}

	private _isLock() {
		if (this._curSelectChapter > GameConfig.curChpter) {
			return true
		}
		return false
	}

	private _updateChapterInfo() {
		let chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()]
		this.m_imgIcon.visible = true
		this.m_groupLock.visible = false
		this.m_imgChapter.source = chapterData.icon
		this.m_labChapter.text = this._curChapterIndex.toString()
		if (this._curSelectChapter == GameConfig.curChpter && GameConfig.curLevel > 0) {
			let levelData = GameConfig.levelTable[GameConfig.curLevel.toString()]
			this.m_labChapter.text = this._curChapterIndex.toString() + "-" + levelData.level.toString()
		}
		this.m_imgIcon.source = "guankajiemian13_png"
		if (this._isLock()) {
			this.m_imgChapter.source = chapterData.unlockIcon
			this.m_imgIcon.source = "guankajiemian14_png"
		}
		
	}

	private _onNextClick() {
		if (this._curChapterIndex < 18) {
			this._curSelectChapter++
			this._curChapterIndex++
			this._updateChapterInfo()
		} 
	}

	private _onLastClick() {
		if (this._curChapterIndex > 1) {
			this._curChapterIndex--
			this._curSelectChapter--
			this._updateChapterInfo()
		}
	}

	private _onRecordIconBg0Begin()
	{
		this._showTip(`Get 100 combos in this chapter 
		to get this pet`);
	}
	private _onRecordIconBg0End()
	{
		this.groupTip.visible = false
	}
	private _onRecordIconBg0Click()
	{
		//显示对应提示
		this._showTip(`Get 100 combos in this chapter 
		to get this pet`);
		this.timeNum.start();
	}

	private _onRecordIconBg1Begin()
	{
		this._showTip(`Get 100 combos in this chapter 
		to get this pet`);
	}

	private _onRecordIconBg1End()
	{
		this.groupTip.visible = false
	}

	private _onRecordIconBg1Click()
	{
		//显示对应提示
		this._showTip(`Get 100 combos in this chapter 
		to get this pet`);
		this.timeNum.start();
	}

	private _showTip(message:string)
	{
		this._lblBabyDescribe.text = message;
		this.groupTip.visible = true
	}
	private _hideTip()
	{
		if(this.groupTip.visible)
		{
			this.groupTip.visible = false
			this.timeNum.stop();
		}		
	}

	private _onComplete() {
		this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onMaskClick, this)
		/*
			egret.TouchEvent.TOUCH_BEGIN 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度；
			egret.TouchEvent.TOUCH_END  当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度；
			egret.TouchEvent.TOUCH_RELEASE_OUTSIDE  当用户在启用触摸设备上的已启动接触的不同 DisplayObject 实例上抬起接触点时
			（例如，在配有触摸屏的移动电话或平板电脑的显示对象上的某一点处按下并释放手指）调度；
			egret.TouchEvent.TOUCH_TAP 当用户在启用触摸设备上的已启动接触的同一 DisplayObject 实例上抬起接触点时
			（例如，在配有触摸屏的移动电话或平板电脑的显示对象上的某一点处按下并释放手指）调度 ；
		 */
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onChapterBegin, this)
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_END, this._onChapterEnd, this)
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onChapterEnd, this)
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onChapterClick, this)

		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onEndlessBegin, this)
		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_END, this._onEndlessEnd, this)
		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onEndlessEnd, this)
		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onEndlessClick, this)

		this.m_btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onNextClick, this)
		this.m_btnLast.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onLastClick, this)

		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onRecordIconBg0Begin, this)
		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_END, this._onRecordIconBg0End, this)
		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onRecordIconBg0End, this)
		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onRecordIconBg0Click, this)
		this.timeNum = new egret.Timer(100,1);
		this.timeNum.addEventListener(egret.TimerEvent.TIMER, this._hideTip, this);

		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onRecordIconBg1Begin, this)
		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_END, this._onRecordIconBg1End, this)
		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onRecordIconBg1End, this)
		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onRecordIconBg1Click, this)

		Common.addTouchBegin(this.m_btnNext)
		Common.addTouchBegin(this.m_btnLast)

		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._OnHide, this)
		this.suo.addEventListener('complete', this._OnLock, this)
	}

	private m_imgMask:eui.Image
	private m_imgChapter:eui.Image
	private m_imgIcon:eui.Image
	private m_imgEndlessBg:eui.Image
	private m_imgEndlessIcon:eui.Image

	private m_labChapter:eui.Label

	private m_btnNext:eui.Button
	private m_btnLast:eui.Button
	private m_btnRecordIconBg0:eui.Image
	private m_btnRecordIconBg1:eui.Image
	private _lblBabyDescribe:eui.Label

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
	private suo:egret.tween.TweenGroup
	private m_groupLock:eui.Group
	private groupTip:eui.Group

	private _status:number
	private _curChapterIndex:number
	private _curSelectChapter:number
	private timeNum:egret.Timer

	private _srollView:ScrollView
}