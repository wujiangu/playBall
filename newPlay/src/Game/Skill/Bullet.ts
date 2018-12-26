class Bullet extends egret.DisplayObjectContainer {
	public constructor() {
		super()
		this.m_armatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this.m_armatureContainer)
	}

	public Init(target:BaseActor, name:string) {
		this.m_target = target
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
		if (this.m_armature == null) {
			this.m_armature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_armature.ArmatureDisplay = armatureDisplay
		this.m_armatureContainer.register(this.m_armature,[name])
		this.m_armatureContainer.play(name, 0)
	}

	public Destroy() {

	}
	
	public Update(timeElapsed:number) {

	}


	private m_target:BaseActor
	private m_armatureContainer:DragonBonesArmatureContainer
	private m_armature:DragonBonesArmature
}