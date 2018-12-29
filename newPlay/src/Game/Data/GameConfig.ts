class GameConfig {
	public static game = "HT"
	public static isWebView = true
	public static monsterConfig:Array<any>
	public static luckyConfig:Array<any>

	public static summonConfig:any
	public static levelConfig:any

	public static gestureConfig:Array<any>
	public static itemConfig:Array<any>

	public static itemTable:any
	public static itemUseTable:Array<number>
	public static effectTable:any
	public static monsterTable:any

	public static gestureType:number
	public static baseFallSpeed:number = 0.1

	public static monsterAddDelay:number = 2000
	public static luckyActorAddDelay:number = 20000
	public static slowDuration:number = 3000

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


	public static InitSound() {
		GameVoice.beginBGMSound = RES.getRes(GameVoice.beginBGM_mp3)
		GameVoice.battleBGMSound = RES.getRes(GameVoice.battleBGM_mp3)
		GameVoice.btnSound = RES.getRes(GameVoice.btn_mp3)
		GameVoice.ballonBoomSound = RES.getRes(GameVoice.ballonBoom_mp3)
		GameVoice.burnSound = RES.getRes(GameVoice.burn_mp3)
		GameVoice.fireBallSound = RES.getRes(GameVoice.fireBall_mp3)
		GameVoice.iceEffectSound = RES.getRes(GameVoice.iceEffect_mp3)
		GameVoice.skillBeginSound = RES.getRes(GameVoice.skillBegin_mp3)
		GameVoice.staffSound = RES.getRes(GameVoice.staff_mp3)
	}

	public static Init() {
		this.summonConfig = RES.getRes("summonConfig_json")
		this.levelConfig = RES.getRes("levelConfig_json")
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
			data["release"] = config.release
			data["bullet"] = config.bullet
			data["step1"] = config.step1
			data["step2"] = config.step2
			data["type"] = config.type
			data["count"] = config.count
			this.effectTable[config.ID.toString()] = data
			this.InitBattleDragonBones(config.name)
		}


		this.monsterConfig = RES.getRes("monsterConfig_json")
        this.gestureConfig = RES.getRes("gesture_json")
        this.luckyConfig = RES.getRes("luckyConfig_json")
		this.monsterTable = {}
        for (let i = 0; i < this.monsterConfig.length; i++) {
            let config = this.monsterConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["Type"] = config.Type
			data["Animation"] = config.Animation
			data["Speed"] = config.Speed
			data["Score"] = config.Score
			data["Power"] = config.Power
			data["Scale"] = config.Scale
			data["Width"] = config.Width
			data["Height"] = config.Height
			this.monsterTable[config.ID.toString()] = data
			this.InitBattleDragonBones(config.Animation)
        }

        for (let i = 0; i < this.luckyConfig.length; i++) {
            let data = this.luckyConfig[i]
            this.InitBattleDragonBones(data.Animation)
        }


		this.InitSound()
		// this.itemUseTable.push(1002)
		// this.itemUseTable.push(1003)
	}
}