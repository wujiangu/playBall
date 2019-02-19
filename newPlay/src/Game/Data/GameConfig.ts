class GameConfig {
	public static game = "HT"
	public static isWebView = true
	public static monsterConfig:Array<any>
	public static luckyConfig:Array<any>

	public static summonConfig:any
	public static summonTable:any
	public static levelConfig:any
	public static levelTable:any

	public static gestureConfig:Array<any>
	public static itemConfig:Array<any>
	public static summonSkillConfig:Array<any>
	public static summonSkillTable:any

	public static itemTable:any
	public static itemUseTable:Array<number>
	public static itemUse:number
	public static itemUnlockList:Array<number>
	public static effectTable:any
	public static monsterTable:any

	public static gestureType:number
	public static baseFallSpeed:number = 0.1

	public static monsterAddDelay:number = 2000
	public static luckyActorAddDelay:number = 18000
	public static slowDuration:number = 3000
	public static comboDelay:number = 1000
	public static spiderDelay:number = 4000

	public static account:string
	public static curScore:number
	public static maxScore:number
	public static curCombo:number
	public static maxCombo:number
	public static bgmValue:number = 100
	public static soundValue:number = 100
	public static balloonScore:number
	public static monsterPos:number = 1
	public static testSelectLevel:number = 1001
	public static gameSpeedPercent:number = 0
	public static isGuide:boolean = false
	public static guideIndex:number
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
		GameVoice.combo1Sound = RES.getRes(GameVoice.combo1_mp3)
		GameVoice.combo2Sound = RES.getRes(GameVoice.combo2_mp3)
		GameVoice.combo3Sound = RES.getRes(GameVoice.combo3_mp3)
		GameVoice.combo4Sound = RES.getRes(GameVoice.combo4_mp3)
		GameVoice.spiderKingArrive = RES.getRes(GameVoice.spiderKingArrive_mp3)
		GameVoice.spiderKingDrug = RES.getRes(GameVoice.spiderKingDrug_mp3)
		GameVoice.jiesuanSound = RES.getRes(GameVoice.jiesuan_mp3)
		GameVoice.readyGoSound = RES.getRes(GameVoice.readyGo_mp3)
		GameVoice.smallBossSound = RES.getRes(GameVoice.smallBoss_mp3)
		GameVoice.fallDownWaterSound = RES.getRes(GameVoice.fallDownWater_mp3)
		GameVoice.bossWarning = RES.getRes(GameVoice.bossWarning_mp3)
		GameVoice.spideBall = RES.getRes(GameVoice.spideBall_mp3)
		GameVoice.summon = RES.getRes(GameVoice.summon_mp3)
		GameVoice.unlockItem = RES.getRes(GameVoice.unlockItem_mp3)
	}

	public static Init() {
		this.summonConfig = RES.getRes("summonConfig_json")
		this.levelConfig = RES.getRes("levelConfig_json")
		this.itemConfig = RES.getRes("itemConfig_json")
		this.summonSkillConfig = RES.getRes("summonSkillConfig_json")
		this.itemTable = {}
		// this.itemUseTable = new Array()
		// this.itemUseTable.push(1003)
		let itemList = {}
		for (let i = 0; i < this.itemUseTable.length; i++) {
			itemList[this.itemUseTable[i].toString()] = 1
		}

		let unlockList = {}
		for (let i = 0; i < this.itemUnlockList.length; i++) {
			unlockList[this.itemUnlockList[i].toString()] = 1
		}

		for (let i = 0; i < this.itemConfig.length; i++) {
			let config = this.itemConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["Name"] = config.Name
			data["Desc"] = config.Desc
			data["LockDesc"] = config.LockDesc
			data["Bg"] = config.Bg
			data["Icon"] = config.Icon
			data["LockIcon"] = config.LockIcon
			data["ItemBg"] = config.ItemBg
			data["Scene"] = config.Scene
			data["Sun"] = config.Sun
			data["cloud1"] = config.cloud1
			data["cloud2"] = config.cloud2
			data["cloud3"] = config.cloud3
			data["Open"] = config.Open
			data["Effect"] = config.Effect
			data["IsUse"] = 0
			if (itemList[config.ID.toString()] != null && itemList[config.ID.toString()] > 0) data["IsUse"] = 1
			if (unlockList[config.ID.toString()] != null && unlockList[config.ID.toString()] > 0) data["Open"] = true
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
			data["Difficult"] = config.Difficult
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

		this.InitConfig()
		this.InitSound()
		Common.GetGuide()
		// this.itemUseTable.push(1002)
		// this.itemUseTable.push(1003)
	}

	public static InitConfig() {
		this.summonTable = {}
        for (let i = 0; i < this.summonConfig.length; i++) {
            let config = this.summonConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["Type"] = config.Type
			data["Actions"] = config.Actions
			data["Animation"] = config.Animation
			data["Speed"] = config.Speed
			data["Score"] = config.Score
			data["Power"] = config.Power
			data["Scale"] = config.Scale
			data["Width"] = config.Width
			data["Height"] = config.Height
			this.summonTable[config.ID.toString()] = data
        }


		this.levelTable = {}
        for (let i = 0; i < this.levelConfig.length; i++) {
            let config = this.levelConfig[i]
			let data = {}
			data["key"] = config.key
			data["next"] = config.next
			data["addTime"] = config.addTime
			data["speed"] = config.speed
			data["normalCount"] = config.normalCount
			data["eliteCount"] = config.eliteCount
			data["unlockItem"] = config.unlockItem
			data["normal"] = config.normal
			data["elite"] = config.elite
			this.levelTable[config.key.toString()] = data
        }

		this.summonSkillTable = {}
        for (let i = 0; i < this.summonSkillConfig.length; i++) {
            let config = this.summonSkillConfig[i]
			let data = {}
			data["id"] = config.id
			data["type"] = config.type
			data["diff"] = config.diff
			data["key"] = config.key
			data["max"] = config.max
			data["min"] = config.min
			data["count"] = config.count
			data["ids"] = config.ids
			this.summonSkillTable[config.key.toString()] = data
        }
	}
}