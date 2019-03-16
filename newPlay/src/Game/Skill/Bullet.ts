class Bullet extends egret.DisplayObjectContainer {
	public constructor() {
		super()
		this._armatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this._armatureContainer)
	}

	public Init(target:BaseActor, name:string, type:EEffectType) {
		this.m_target = target
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
		if (this._armature == null) {
			this._armature = new DragonBonesArmature(armatureDisplay)
		}
		this._armature.ArmatureDisplay = armatureDisplay
		this._armatureContainer.register(this._armature,[name])
		this._armatureContainer.play(name, 0)

		this.m_isDead = false

		this._type = type
	}

	public destroy() {
		this.m_isDead = true
		this._armatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}
	
	public update(timeElapsed:number) {
		if (this.m_isDead) return
		let endY = this.m_target.y - this.m_target.h / 2
		this.m_radian = MathUtils.getRadian2(this.x, this.y, this.m_target.x, endY)
		this.rotation = MathUtils.getAngle(this.m_radian) + 90
		let distance:number = MathUtils.getDistance(this.m_target.x, endY, this.x, this.y)
		// Common.log(this.m_radian, this.rotation, distance)
		if (distance <= 140) {
			this.destroy()
			PanelManager.gameScenePanel.removeBullet(this)
			if (this._type == EEffectType.Fire) {
				// this.m_target.playEffect()
				let channel = GameVoice.burnSound.play(0, 1)
				channel.volume = GameConfig.soundValue / 100
			}
			return
		}
		let speed = timeElapsed * 2
		let tempX:number = Math.cos(this.m_radian) * speed
		let tempY:number = Math.sin(this.m_radian) * speed
		let deltaX = parseFloat(tempX.toFixed(2))
		let deltaY = parseFloat(tempY.toFixed(2))
		this.x += deltaX
		this.y += deltaY
	}


	private m_target:BaseActor
	private _armatureContainer:DragonBonesArmatureContainer
	private _armature:DragonBonesArmature

	private m_radian:number

	private m_isDead:boolean

	private _type:EEffectType
}