class GameExSkillEffect extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/dazhaotexiao.exml"
	}

	public playEffect(a_id:number) {
		switch (a_id) {
			case 1:
				this.leidian.play(0)
			break
			case 2:
				this.jiansu.play(0)
			break
			case 3:
				this.shuizhu.play(0)
			break
			default:
			break
		}
	}

	public hide() {
		this.groupIce.alpha = 0
		this.groupWater.alpha = 0
		this.groupSunder.alpha = 0
	}

	public show() {
		this.groupIce.alpha = 1
		this.groupWater.alpha = 1
		this.groupSunder.alpha = 1
	}

	private _onComboBeginComplete() {
		this.leidian.stop()
		Common.log("ddsfdsfdsfdsf")
	}

	private onComplete() {
		this.hide()
		this.leidian.addEventListener('complete', this._onComboBeginComplete, this)
	}

	private groupWater:eui.Group
	private groupIce:eui.Group
	private groupSunder:eui.Group

	private leidian:egret.tween.TweenGroup
	private jiansu:egret.tween.TweenGroup
	private shuizhu:egret.tween.TweenGroup
}