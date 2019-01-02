class Bullet extends egret.DisplayObjectContainer {
	public constructor() {
		super()
		this.m_armatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this.m_armatureContainer)
	}

	public Init(target:BaseActor, name:string, type:EEffectType) {
		this.m_target = target
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
		if (this.m_armature == null) {
			this.m_armature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_armature.ArmatureDisplay = armatureDisplay
		this.m_armatureContainer.register(this.m_armature,[name])
		this.m_armatureContainer.play(name, 0)

		this.m_isDead = false

		this.m_type = type
	}

	public Destroy() {
		this.m_isDead = true
		this.m_armatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}
	
	public Update(timeElapsed:number) {
		if (this.m_isDead) return
		let endY = this.m_target.y - this.m_target.h / 2
		this.m_radian = MathUtils.getRadian2(this.x, this.y, this.m_target.x, endY)
		this.rotation = MathUtils.getAngle(this.m_radian) + 90
		let distance:number = MathUtils.getDistance(this.m_target.x, endY, this.x, this.y)
		// Common.log(this.m_radian, this.rotation, distance)
		if (distance <= 140) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveBullet(this)
			if (this.m_type == EEffectType.Fire) {
				this.m_target.PlayEffect()
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
	private m_armatureContainer:DragonBonesArmatureContainer
	private m_armature:DragonBonesArmature

	private m_radian:number

	private m_isDead:boolean

	private m_type:EEffectType
}