class GameConfig {
	public static game = "HT"
	public static isWebView = true
	public static monsterConfig:Array<any>
	public static luckyConfig:Array<any>
	public static luckyTable:any

	public static summonConfig:any
	public static summonTable:any
	public static levelConfig:Array<any>
	public static levelTable:any
	public static levelRewardConfig:Array<any>
	public static levelRewardTable:any

	public static gestureConfig:Array<any>
	public static gestureTable:any
	public static summonSkillConfig:Array<any>
	public static summonSkillTable:any
	public static actorConfig:Array<any>
	public static actorTable:any
	public static chapterConfig:Array<any>
	public static chapterTable:any
	public static babySkillTable:any
	public static effectTable:any
	public static monsterTable:any
	public static signConfig:Array<any>
	public static signTable:any
	public static capsuleConfig:Array<any>
	public static capsuleTable:any

	public static gestureType:number
	public static baseFallSpeed:number = 0.1

	public static monsterAddDelay:number = 2000
	public static luckyActorAddDelay:number = 23000
	public static slowDuration:number = 3000
	public static comboDelay:number = 1000
	public static spiderDelay:number = 4000
	public static rewardData:any
	public static rewardType:EReward
	public static rewardCandy:number

	public static isOpenNewChapter:boolean
	public static account:string
	public static curScore:number
	public static maxScore:number
	public static curCombo:number
	public static maxCombo:number
	public static bgmValue:number = 100
	public static soundValue:number = 100
	public static isPlaySound:boolean = true
	public static balloonScore:number
	public static monsterPos:number = 1
	public static gameSpeedPercent:number = 0
	public static isGuide:boolean = false

	public static babylistIndex:number
	public static guideIndex:number
	// 当前的宝宝
	public static curBaby:number
	public static curBabyData:any
	// 解锁的宝宝ID
	public static babyUnlockList:Array<number>
	// 开放的宝宝ID
	public static babyOpenList:Array<number> = new Array()
	// 挑战模式
	public static gameMode:EBattleMode = EBattleMode.Level
	// 挑战进度(关卡)
	public static curLevel:number
	// 挑战进度(章节)
	public static curChpter:number
	// 糖果数量
	public static candy:number
	// 上次登录时间
	public static lastLoginTime:string
	// 签到标记(0:未签到 1:已签到)
	public static sign:number = 0
	// 签到次数
	public static signCount:number = 0
	//是否刷新签到数据 (0:不刷新 1 刷新)
	public static isSignData:number = 0;
	// 当前挑战的章节
	public static curBattleChapter = 0
	// 章节最高分数
	public static chapterMaxScore:any
	// 章节最高连击
	public static chapterMaxCombo:any

	// 临时配置，后续修改
	public static sceneType:number = 0

	/**
     * 初始化骨骼的动画数据
     */
    public static initBattleDragonBones(name:string):void {
		let skeletonData = RES.getRes(name+"_ske_json")
        let textureData = RES.getRes(name+"_tex_json")
        let texture = RES.getRes(name+"_tex_png")
        DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture)
    }


	public static initSound() {
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
		GameVoice.battleBefore = RES.getRes(GameVoice.battleBefore_mp3)
		GameVoice.vectory = RES.getRes(GameVoice.vectory_mp3)
		GameVoice.rewardBGM = RES.getRes(GameVoice.rewardBGM_mp3)
		GameVoice.rewardVoice = RES.getRes(GameVoice.rewardVoice_mp3)
		GameVoice.gestureVoice = RES.getRes(GameVoice.gesture_mp3)
	}

	public static beforInitSound() {
		GameVoice.beginBGMSound = RES.getRes(GameVoice.beginBGM_mp3)
		GameVoice.btnSound = RES.getRes(GameVoice.btn_mp3)
	}

	public static beforeInit() {
		let effectConfig:Array<any> = RES.getRes("effectConfig_json")
		this.effectTable = {}
		for (let i = 0; i < effectConfig.length; i++) {
			let config = effectConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["name"] = config.name
			this.effectTable[config.ID.toString()] = data
			this.initBattleDragonBones(config.name)
		}
		this.initConfig()
		this.beforInitSound()
	}

	public static init() {
		this.summonConfig = RES.getRes("summonConfig_json")
		this.levelConfig = RES.getRes("levelConfig_json")
		this.summonSkillConfig = RES.getRes("summonSkillConfig_json")
		

		this.monsterConfig = RES.getRes("monsterConfig_json")
        this.gestureConfig = RES.getRes("gesture_json")
        this.luckyConfig = RES.getRes("luckyConfig_json")

		let effectConfig:Array<any> = RES.getRes("effectConfig_json")
		this.effectTable = {}
		for (let i = 0; i < effectConfig.length; i++) {
			let config = effectConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["name"] = config.name
			this.effectTable[config.ID.toString()] = data
			this.initBattleDragonBones(config.name)
		}

		this.luckyTable = {}
		for (let i = 0; i < this.luckyConfig.length; i++) {
            let config = this.luckyConfig[i]
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
			data["Prob"] = config.Prob
			data["balloon"] = config.balloon
			this.luckyTable[config.ID.toString()] = data
			if (config.Animation != null && config.Animation != "") {
				this.initBattleDragonBones(config.Animation)
			}
        }


		this.gestureTable = {}
		for (let i = 0; i < this.gestureConfig.length; i++) {
			let config = this.gestureConfig[i]
			let data = {}
			data["difficult"] = config.difficult
			data["type"] = config.type
			data["data"] = config.data
			data["count"] = config.count
			data["path"] = config.path
			data["balloon"] = config.balloon
			data["color"] = config.color
			this.gestureTable[config.type.toString()] = data
		}


		this.monsterTable = {}
        for (let i = 0; i < this.monsterConfig.length; i++) {
            let config = this.monsterConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["Type"] = config.Type
			data["Difficult"] = config.Difficult
			data["Animation"] = config.Animation
			data["Actions"] = config.Actions
			data["Speed"] = config.Speed
			data["Score"] = config.Score
			data["Power"] = config.Power
			data["Scale"] = config.Scale
			data["Width"] = config.Width
			data["Height"] = config.Height
			data["BalloonScale"] = config.BalloonScale
			data["BalloonX"] = config.BalloonX
			data["BalloonY"] = config.BalloonY
			this.monsterTable[config.ID.toString()] = data
			if (config.Animation != null && config.Animation != "") {
				this.initBattleDragonBones(config.Animation)
			}
        }

		this.initConfig()


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
			if (config.Animation != null && config.Animation != "") {
				this.initBattleDragonBones(config.Animation)
			}
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
			data["candy"] = config.candy
			data["unlockItem"] = config.unlockItem
			data["normal"] = config.normal
			data["elite"] = config.elite
			data["section"] = config.section
			data["level"] = config.level
			if (config.key != null && config.key > 0) {
				this.levelTable[config.key.toString()] = data
			}
        }

		this.levelRewardConfig = RES.getRes("levelRewardConfig_json")
		this.levelRewardTable = {}
		for (let i = 0; i < this.levelRewardConfig.length; i++) {
            let config = this.levelRewardConfig[i]
			let data = {}
			data["key"] = config.key
			data["condition"] = config.condition
			data["count"] = config.count
			data["reward"] = config.reward
			data["value"] = config.value
			this.levelRewardTable[config.key.toString()] = data
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


		this.initSound()
		Common.getGuide()
	}

	public static initConfig() {
		// this.summonTable = {}
        // for (let i = 0; i < this.summonConfig.length; i++) {
        //     let config = this.summonConfig[i]
		// 	let data = {}
		// 	data["ID"] = config.ID
		// 	data["Type"] = config.Type
		// 	data["Actions"] = config.Actions
		// 	data["Animation"] = config.Animation
		// 	data["Speed"] = config.Speed
		// 	data["Score"] = config.Score
		// 	data["Power"] = config.Power
		// 	data["Scale"] = config.Scale
		// 	data["Width"] = config.Width
		// 	data["Height"] = config.Height
		// 	this.summonTable[config.ID.toString()] = data
        // }


		// this.levelTable = {}
        // for (let i = 0; i < this.levelConfig.length; i++) {
        //     let config = this.levelConfig[i]
		// 	let data = {}
		// 	data["key"] = config.key
		// 	data["next"] = config.next
		// 	data["addTime"] = config.addTime
		// 	data["speed"] = config.speed
		// 	data["normalCount"] = config.normalCount
		// 	data["candy"] = config.candy
		// 	data["unlockItem"] = config.unlockItem
		// 	data["normal"] = config.normal
		// 	data["elite"] = config.elite
		// 	data["section"] = config.section
		// 	data["level"] = config.level
		// 	if (config.key != null && config.key > 0) {
		// 		this.levelTable[config.key.toString()] = data
		// 	}
        // }

		// this.summonSkillTable = {}
        // for (let i = 0; i < this.summonSkillConfig.length; i++) {
        //     let config = this.summonSkillConfig[i]
		// 	let data = {}
		// 	data["id"] = config.id
		// 	data["type"] = config.type
		// 	data["diff"] = config.diff
		// 	data["key"] = config.key
		// 	data["max"] = config.max
		// 	data["min"] = config.min
		// 	data["count"] = config.count
		// 	data["ids"] = config.ids
		// 	this.summonSkillTable[config.key.toString()] = data
        // }

		this.actorConfig = RES.getRes("actorConfig_json")
		this.actorTable = {}
		this.babyOpenList.length = 0
		for (let i = 0; i < this.actorConfig.length; i++) {
			let config = this.actorConfig[i]
			let data = {}
			data["id"] = config.id
			data["level"] = config.level
			data["nextId"] = config.nextId
			data["quality"] = config.quality
			data["weight"] = config.weight
			data["candy"] = config.candy
			data["petPrice"] = config.petPrice
			data["name"] = config.name
			data["unlockDesc"] = config.unlockDesc
			data["desc"] = config.desc
			data["action"] = config.action
			data["icon"] = config.icon
			data["lockIcon"] = config.lockIcon
			data["direction"] = config.direction
			data["skillId"] = config.skillId
			data["fusion"] = config.fusion
			data["shadow"] = config.shadow
			data["range"] = 0
			if (config.level <= 1) this.babyOpenList.push(config.id)
			this.actorTable[config.id.toString()] = data
			if (config.action != null && config.action != "") {
				this.initBattleDragonBones(config.action)
			}
		}
		// 修改开放宝宝表数据
		for (let i = 0; i < this.babyOpenList.length; i++) {
			let openId = this.babyOpenList[i]
			for (let j = 0; j < this.babyUnlockList.length; j++) {
				let unlockId = this.babyUnlockList[j]
				let level = this.actorTable[unlockId.toString()].level
				if (level >= 2 && unlockId-level-1 == openId) {
					this.babyOpenList[i] = unlockId
					break
				}
			}
		}
		this.curBabyData = this.actorTable[this.curBaby.toString()]

		// 章节配置
		this.chapterConfig = RES.getRes("chapterConfig_json")
		this.chapterTable = {}
		for (let i = 0; i < this.chapterConfig.length; i++) {
			let config = this.chapterConfig[i]
			let data = {}
			data["id"] = config.id
			data["name"] = config.name
			data["icon"] = config.icon
			data["unlockIcon"] = config.unlockIcon
			data["bg"] = config.bg
			data["bgm"] = config.bgm
			data["begin"] = config.begin
			data["sun"] = config.sun
			data["cloud1"] = config.cloud1
			data["cloud2"] = config.cloud2
			data["water"] = config.water
			this.chapterTable[config.id.toString()] = data
			let score = this.chapterMaxScore[config.id.toString()]
			let combo = this.chapterMaxCombo[config.id.toString()]
			if (score == null) {
				this.chapterMaxScore[config.id.toString()] = 0
			}
			if (combo == null) {
				this.chapterMaxCombo[config.id.toString()] = 0
			}
		}

		let babySkillConfig:Array<any> = RES.getRes("babySkillConfig_json")
		this.babySkillTable = {}
		for (let i = 0; i < babySkillConfig.length; i++) {
			let config = babySkillConfig[i]
			let data = {}
			data["id"] = config.id
			data["skillFile"] = config.skillFile
			data["skillHang"] = config.skillHang
			data["boss"] = config.boss
			data["auto"] = config.auto
			data["param"] = config.param
			data["skillPosX"] = config.skillPosX
			data["range"] = config.range
			data["result"] = config.result
			data["time"] = config.time
			data["skill"] = config.skill
			data["method"] = config.method
			data["sceneEffect"] = config.sceneEffect
			data["skillPosY"] = config.skillPosY
			data["rangeType"] = config.rangeType
			data["music"] = config.music
			data["scale"] = config.scale
			this.babySkillTable[config.id.toString()] = data
		}

		this.signConfig = RES.getRes("signConfig_json")
		this.signTable = {}
		for (let i = 0; i < this.signConfig.length; i++) {
			let config = this.signConfig[i]
			let data = {}
			data["id"] = config.id
			data["name"] = config.name
			data["desc"] = config.desc
			data["boss"] = config.boss
			data["rewardType"] = config.rewardType
			data["reward"] = config.reward
			data["icon"] = config.icon
			data["isGet"] = false
			if (i < this.signCount ||(i >= 7 && ((i-7) < this.signCount))) data["isGet"] = true
			// if (i == this.signCount && this.sign == 1) data["isGet"] = true
			Common.log("sign", i, this.signCount, this.sign, config.rewardType)
			this.signTable[config.id.toString()] = data
		}

		this.capsuleConfig = RES.getRes("capsuleConfig_json")
		this.capsuleTable = {}
		for (let i = 0; i < this.capsuleConfig.length; i++) {
			let config = this.capsuleConfig[i]
			let data = {}
			data["id"] = config.id
			data["type"] = config.type
			data["value"] = config.value
			data["weight"] = config.weight
			data["range"] = 0
			this.capsuleTable[config.id.toString()] = data
		}
	}
}