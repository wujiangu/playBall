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
		this.m_curChapterIndex = GameConfig.curChpter % 1000
		this.m_curSelectChapter = GameConfig.curChpter
		this._updateChapterInfo()
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
		return this.m_curSelectChapter
	}

	private _onShow() {
		this.touchChildren = true
	}

	private _OnHide() {
		Common.dispatchEvent(MainNotify.closeGameSelectLevel)
		if (this.m_status == 1) {
			// Common.dispatchEvent(MainNotify.closeGameStartPanel)
			Common.dispatchEvent(MainNotify.openGamePanel)
		}else{
			Common.dispatchEvent(MainNotify.openGameStartPanel)
		}
	}

	private _onMaskClick() {
		this.touchEnabled = false
		this.hide.play(0)
		this.m_status = 0
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
		if (GameConfig.guideIndex >= 1) {
			this._beforeEnterBattle()
			GameConfig.gameMode = EBattleMode.Endless
		}
	}

	private _beforeEnterBattle() {
		this.touchEnabled = false
		this.hide.play(0)
		this.m_status = 1
	}

	private _isLock() {
		if (this.m_curSelectChapter > GameConfig.curChpter) {
			return true
		}
		return false
	}

	private _updateChapterInfo() {
		let chapterData = GameConfig.chapterTable[this.m_curSelectChapter.toString()]
		Common.log(this.m_curSelectChapter, this.m_curChapterIndex)
		this.m_imgChapter.source = chapterData.icon
		this.m_labChapter.text = this.m_curChapterIndex.toString()
		this.m_imgIcon.source = "guankajiemian13_png"
		if (this._isLock()) {
			this.m_imgChapter.source = chapterData.unlockIcon
			this.m_imgIcon.source = "guankajiemian14_png"
		}
	}

	private _onNextClick() {
		if (this.m_curChapterIndex < 5) {
			this.m_curSelectChapter++
			this.m_curChapterIndex++
			this._updateChapterInfo()
		} 
	}

	private _onLastClick() {
		if (this.m_curChapterIndex > 1) {
			this.m_curChapterIndex--
			this.m_curSelectChapter--
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

		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._OnHide, this)
	}

	private m_imgMask:eui.Image
	private m_imgChapter:eui.Image
	private m_imgIcon:eui.Image
	private m_imgEndlessBg:eui.Image
	private m_imgEdlessIcon:eui.Image

	private m_labChapter:eui.Label

	private m_btnNext:eui.Button
	private m_btnLast:eui.Button

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup

	private m_status:number
	private m_curChapterIndex:number
	private m_curSelectChapter:number
}