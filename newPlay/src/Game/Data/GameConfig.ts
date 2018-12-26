class GameConfig {
	public static game = "HT"
	public static isWebView = true
	public static monsterConfig:Array<any>
	public static gestureConfig:Array<any>
	public static itemConfig:Array<any>

	public static itemTable:any
	public static itemUseTable:Array<number>
	public static effectTable:any

	public static gestureType:number
	public static baseFallSpeed:number = 0.1

	public static monsterAddDelay:number = 1500

	public static account:string
	public static curScore:number
	public static maxScore:number

	/**
     * 初始化骨骼的动画数据
     */
    public static InitBattleDragonBones(name:string):void {
		let skeletonData = RES.getRes(name+"_ske_json")
        let textureData = RES.getRes(name+"_tex_json")
        let texture = RES.getRes(name+"_tex_png")
        DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture)
    }

	public static Init() {
		this.itemConfig = RES.getRes("itemConfig_json")
		this.itemTable = {}
		this.itemUseTable = new Array()

		for (let i = 0; i < this.itemConfig.length; i++) {
			let config = this.itemConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["Name"] = config.Name
			data["Desc"] = config.Desc
			data["GrayIcon"] = config.GrayIcon
			data["Icon"] = config.Icon
			data["Open"] = config.Open
			data["Effect"] = config.Effect
			data["IsUse"] = 0
			this.itemTable[config.ID.toString()] = data
		}

		let effectConfig:Array<any> = RES.getRes("effectConfig_json")
		this.effectTable = {}
		for (let i = 0; i < effectConfig.length; i++) {
			let config = effectConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["name"] = config.name
			data["bullet"] = config.bullet
			data["step1"] = config.step1
			data["step2"] = config.step2
			this.effectTable[config.ID.toString()] = data
			this.InitBattleDragonBones(config.name)
		}

		this.itemUseTable.push(1003)
	}
}