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
	}

	private _beforeEnterBattle() {
		this.touchChildren = false
		this.hide.play(0)
		this._status = 1
		GameVoice.beginBGMChannel.stop()
		let voice = GameVoice.vectory.play(0,1)
		voice.volume = GameConfig.soundValue / 100
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

	private _onComplete() {
		this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onMaskClick, this)
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

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
	private suo:egret.tween.TweenGroup
	private m_groupLock:eui.Group

	private _status:number
	private _curChapterIndex:number
	private _curSelectChapter:number
}