class GameScenePanel extends BasePanel {
	public constructor() {
		super()
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameScenePanel.exml"
        this.m_monsters = new Array()
        this.m_bullets = new Array()
        this.m_luckyActors = new Array()
        this.m_summonActors = new Array()
	}

	// 初始化面板
    public initPanel():void{
        this.m_gestureShape = new egret.Shape()
        this.m_gesture = new Gesture()
		this.m_gesture.Init()

        this.m_cloud1Speed = 0.6
		this.m_cloud2Speed = 0.3
		this.m_cloud3Speed = 0.1
        this.m_currentItemId = 0

        this.m_progress = new egret.Shape()
    }

    public Init() {
        this.ClearAllActor()
        this.touchChildren = false
        this.readyAnimate.play(0)
        this.initData()
        this.m_imgEffectMask.visible = false
        this.m_rectWarning.visible = false
        this.m_bitLabScore.visible = false
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this)
    }

    public Exit() {
        this.m_imgEffectMask.visible = false
        this.touchChildren = false
        this.m_gesture.removeEvent()
        Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this)
    }

    // 初始化面板数据
    public initData():void{
        GameConfig.gestureType = 0
        this.m_monsterAddDelay = 0
        this.m_luckyAddDelay = 0
        this.m_angle = 180
        this.Power = 0
        this.m_score = 0
        this.m_slowDelay = -1
        // this.m_labScore.text = this.m_score.toString()
        this.m_bitLabScore.text = this.m_score.toString()
        this.UpdeLevelData(1001)

        ShakeTool.getInstance().setInitPos(this.m_imgScene.x, this.m_imgScene.y)
    }

    public UpdeLevelData(a_levelId:number) {
        this.m_currentLevel = GameConfig.levelConfig[a_levelId.toString()]
        this.m_passTime = 0
        this.m_monsterAddDelay = 0
        this.m_allTime = this.m_currentLevel.normalTime + this.m_currentLevel.eliteTime
        this.m_levelState = ELevelType.Normal
        this.m_eliteCount = 0
    }

    // 进入面板
    public onEnter():void{
        Common.curPanel = PanelManager.m_gameScenePanel
        Common.gameScene().uiLayer.addChild(this)

        this.m_groupPower.visible = true
        if (GameConfig.itemUseTable.length <= 0 ) {
            this.m_groupPower.visible = false
            this.m_curItemData = null
        }else{
            let index = GameConfig.itemUseTable.indexOf(this.m_currentItemId)
            let id = this.m_currentItemId
            if (index < 0) {
                id = GameConfig.itemUseTable[0]
                this.m_currentItemId = id
            }
            this.m_curItemData = GameConfig.itemTable[id.toString()]
            this._UpdateItemArmature()
            this._UpdateFullArmature()
        }

        this.Init()

        if (GameVoice.battleBGMChannel != null) GameVoice.battleBGMChannel.stop()
        GameVoice.battleBGMChannel = GameVoice.battleBGMSound.play(0)
        // this._CreateMonster()
    }

    // 退出面板
    public onExit():void{
        this.ClearAllActor()
        this.m_itemArmatureContainer.clear()
		Common.gameScene().uiLayer.removeChild(this)
        this.Exit()

        GameVoice.battleBGMChannel.stop()
    }

    public Update(timeElapsed:number) {
        let actorElapsed = timeElapsed
        if (this.m_slowDelay >= 0 && GameManager.Instance.GameState == EGameState.Start) {
            this.m_slowDelay += timeElapsed
            if (this.m_slowDelay >= GameConfig.slowDuration) {
                this.m_slowDelay = -1
            }
        }

        if (GameManager.Instance.GameState == EGameState.Start) {
            this.m_monsterAddDelay += timeElapsed
            this.m_luckyAddDelay += timeElapsed
            this.m_passTime += timeElapsed
            
            if (this.m_passTime < this.m_currentLevel.normalTime) {
                this.m_levelState = ELevelType.Normal
            }
            else if (this.m_passTime >= this.m_currentLevel.normalTime && this.m_passTime < this.m_allTime) {
                this.m_levelState = ELevelType.Elite
                if (this.m_eliteCount >= this.m_currentLevel.eliteCount) this.m_levelState = ELevelType.Normal
            }else{
                this.m_levelState = ELevelType.End
            }

            if (this.m_slowDelay >= 0) actorElapsed *= 0.2


            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                if (monster.State == EMonsterState.Ready && monster.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this.m_rectWarning.visible = true
                    this.m_isWarning = true
                    this.warning.play(0)
                }
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                let summon:SummonActor = this.m_summonActors[i]
                if (summon.State == EMonsterState.Ready && summon.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this.m_rectWarning.visible = true
                    this.m_isWarning = true
                    this.warning.play(0)
                }
            }
        }

        if (this.m_levelState != ELevelType.End && GameManager.Instance.GameState == EGameState.Start && this.m_monsterAddDelay >= this.m_currentLevel.addTime) {
            this.m_monsterAddDelay = 0
            this._CreateMonster()
        }

        if (GameManager.Instance.GameState == EGameState.Start && this.m_luckyAddDelay >= GameConfig.luckyActorAddDelay) {
            this.m_luckyAddDelay = 0
            this._CreateLuckyActor()
        }

        if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.End) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].Update(actorElapsed)
            }
        }

        if (GameManager.Instance.GameState == EGameState.Start) {
            for (let i = 0; i < this.m_bullets.length; i++) {
                this.m_bullets[i].Update(timeElapsed)
            }

            for (let i = 0; i < this.m_luckyActors.length; i++) {
                this.m_luckyActors[i].Update(actorElapsed)
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                this.m_summonActors[i].Update(actorElapsed)
            }
        }


        if (this.m_cloud1.x >= -this.m_cloud1.width) {
			this.m_cloud1.x -= this.m_cloud1Speed
		}else{
			this.m_cloud1.x = Config.stageWidth
		}

		if (this.m_cloud2.x >= -this.m_cloud2.width) {
			this.m_cloud2.x -= this.m_cloud2Speed
		}else{
			this.m_cloud2.x = Config.stageWidth
		}

		if (this.m_cloud3.x <= Config.stageWidth + this.m_cloud3.width) {
			this.m_cloud3.x += this.m_cloud1Speed
		}else{
			this.m_cloud3.x = -this.m_cloud3.width
		}
    }

    public RemoveMonster(a_monster:Monster) {
        for (let i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i] == a_monster) {
                this.m_groupGame.removeChild(this.m_monsters[i])
                this.m_monsters.splice(i, 1)
                // this._CreateMonster()
                break
            }
        }
        this._ChangeLevel()
    }

    public RemoveBullet(a_bullet:Bullet) {
        for (let i = 0; i < this.m_bullets.length; i++) {
            if (this.m_bullets[i] == a_bullet) {
                this.m_groupGameEffect.removeChild(this.m_bullets[i])
                this.m_bullets.splice(i, 1)
                break
            }
        }
    }

    public RemoveLuckyActor(a_lucky:LuckyActor) {
        for (let i = 0; i < this.m_luckyActors.length; i++) {
            if (this.m_luckyActors[i] == a_lucky) {
                this.m_groupGame.removeChild(this.m_luckyActors[i])
                this.m_luckyActors.splice(i, 1)
                break
            }
        }
    }

    public RemoveSummonActor(a_summon:SummonActor) {
        for (let i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i] == a_summon) {
                this.m_groupGame.removeChild(this.m_summonActors[i])
                this.m_summonActors.splice(i, 1)
                break
            }
        }
        this._ChangeLevel()
    }

    public ClearAllActor() {
        while(this.m_monsters.length > 0) {
			let monster:Monster = this.m_monsters.pop()
			monster.Destroy()
			this.m_groupGame.removeChild(monster)
		}

        while(this.m_bullets.length > 0) {
            let bullet:Bullet = this.m_bullets.pop()
            bullet.Destroy()
            this.m_groupGameEffect.removeChild(bullet)
        }

        while(this.m_luckyActors.length > 0) {
            let lucky:LuckyActor = this.m_luckyActors.pop()
            lucky.Destroy()
            this.m_groupGame.removeChild(lucky)
        }

        while(this.m_summonActors.length > 0) {
            let summon:SummonActor  = this.m_summonActors.pop()
            summon.Destroy()
            this.m_groupGame.removeChild(summon)
        }
    }

    public get Score() {
        return this.m_score
    }

    public set Score(value:number) {
        this.m_score = value
        // this.m_labScore.text = this.m_score.toString()
        this.m_bitLabScore.text = this.m_score.toString()
        // egret.Tween.get(this.m_labScore).to({scaleX:2.0, scaleY:2.0}, 100, egret.Ease.backIn).call(this._OnScoreBigger, this)
    }

    public get Power() {
        return this.m_power
    }

    public set Power(value:number) {
        if (this.m_curItemData == null) return
        this.m_power = value
        this.m_angle = 180 + value * 2
        this.m_angle = Math.min(this.m_angle, 360)

        if (this.m_angle >= 360) {
            this.m_imgEffectMask.visible = true
            this.effectMask.play(0)
            this._UpdateItemArmature(true)
            this.m_angle = 180
            this.m_power = 0
        }

        this._UpdateProgress(this.m_angle)
    }

    public get GroundPos() {
        return this.m_imgGroundLine.y
    }

    public get WaterPos() {
        return this.m_imgGroundWater.y
    }

    public get WarningPos() {
        return this.m_imgGroundWarning.y
    }

    public get EliteCount() {
        return this.m_eliteCount
    }

    public set EliteCount(value:number) {
        this.m_eliteCount = value
    }

    public get MountBg() {
        return this.m_imgScene
    }

    /**
     * 进入下一关
     */
    private _ChangeLevel() {
        if (this.m_monsters.length <= 0 && this.m_summonActors.length <= 0 && this.m_passTime > this.m_allTime && this.m_levelState == ELevelType.End) {
            this.UpdeLevelData(this.m_currentLevel.next)
        }
    }

    /**
     * 更新道具图标动画
     * 
     */
    private _UpdateItemArmature(isRelease:boolean = false) {
        this.m_itemArmatureContainer.clear()
        let effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()]
        let name = isRelease ? effectData.release:effectData.name
        let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
        if (this.m_itemArmature == null) {
            this.m_itemArmature = new DragonBonesArmature(armatureDisplay)
        }
        this.m_itemArmature.ArmatureDisplay = armatureDisplay
        this.m_itemArmatureContainer.register(this.m_itemArmature,[name])
        if (isRelease) {
            GameVoice.skillBeginSound.play(0, 1)
            this.m_itemArmatureContainer.play(name, 1)
            GameManager.Instance.Pause(true)
            this.m_itemArmatureContainer.addCompleteCallFunc(this._OnItemArmatureComplete, this)
        }else{
            this.m_itemArmatureContainer.play(name, 0)
        }
    }

    /**
     * 更新全屏特效动画
     */
    private _UpdateFullArmature() {
        this.m_fullArmatureContainer.clear()
        let effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()]
        let name = effectData.step1
        if (effectData.bullet == "" && name != "") {
            let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
            if (this.m_fullArmature == null) {
                this.m_fullArmature = new DragonBonesArmature(armatureDisplay)
            }
            this.m_fullArmature.ArmatureDisplay = armatureDisplay
            this.m_fullArmatureContainer.visible = false
            this.m_fullArmatureContainer.register(this.m_fullArmature, [name])
            this.m_fullArmatureContainer.scaleX = 1.2
        }
    }

    private _UpdateProgress(angle:number) {
        let r = this.m_imgPower.height / 2
        this.m_progress.graphics.clear();
        this.m_progress.graphics.beginFill(0x00ffff);
        this.m_progress.graphics.moveTo(r, r)
        this.m_progress.graphics.lineTo(2 * r, r);
        this.m_progress.graphics.drawArc(r, r, r, Math.PI, angle * Math.PI / 180, false);
        this.m_progress.graphics.lineTo(r, r);
        this.m_progress.graphics.endFill();
        this.m_progress.x = 0
        this.m_progress.y = 20
	}

    private _OnGesture() {
        if (GameConfig.gestureType > 0) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                for (let j = 0; j < monster.Balloons.length; j++) {
                    let balloon:Balloon = monster.Balloons[j]
                    if (balloon.type == GameConfig.gestureType) {
                        monster.BallExplosion(balloon)
                    }
				}
            }

            for (let i = 0; i < this.m_luckyActors.length; i++) {
                let lucky:LuckyActor = this.m_luckyActors[i]
                if (lucky.ballon.type == GameConfig.gestureType) {
                    lucky.UpdateGesture()
                }
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                let summon:SummonActor = this.m_summonActors[i]
                if (summon.GestureType == GameConfig.gestureType) {
                    summon.GotoExplore()
                }
            }
        }
    }

    private _OnBtnPause() {
        GameManager.Instance.Pause()
    }

    private _OnItemArmatureComplete() {
        if (this.m_curItemData != null) {
            let effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()]
            let count = Math.min(this.m_monsters.length, effectData.count)
            if (count > 0) {
                GameVoice.fireBallSound.play(0, 1)
                let bulletCount = 0
                for (let index = 0; index < this.m_monsters.length; index++) {
                    if (this.m_monsters[index].State == EMonsterState.Ready) {
                        this._CreateBullete(this.m_monsters[index])
                        bulletCount++
                    }
                    if (bulletCount >= count) break
                }
            }else{
                // 全屏
                let name = effectData.step1
                if (name != "") {
                    this.m_fullArmatureContainer.visible = true
                    this.m_fullArmatureContainer.play(name, 1)
                }

                switch (effectData.type) {
                    case EEffectType.Ice:
                        GameVoice.iceEffectSound.play(0, 1)
                        this.m_slowDelay = 0
                    break
                    case EEffectType.ChangeGesture:
                        GameVoice.staffSound.play(0, 1)
                        for (let i = 0; i < this.m_monsters.length; i++) {
                            this.m_monsters[i].ChangeToEasy()
                        }
                    break
                    default:

                    break
                }
            }
        }
        this.m_itemArmatureContainer.removeCompleteCallFunc(this._OnItemArmatureComplete, this)
        GameManager.Instance.Start()
        this._UpdateItemArmature()
    }

    private _OnReadyComplete() {
        this.touchChildren = true
        // this.m_labScore.visible = true
        this.m_bitLabScore.visible = true
        GameManager.Instance.Start()
    }

    private _OnFullArmatureComplete() {
        
    }

    private _ItemArmatureFadeIn() {
        this._UpdateItemArmature()
        egret.Tween.get(this.m_itemArmatureContainer).to({ alpha: 1 }, 300, egret.Ease.circOut)
    }

    private _OnChangeItem() {
        // this.m_imgEffectMask.visible = true
        // this.effectMask.play(0)
        // this._UpdateItemArmature(true)

        if (GameConfig.itemUseTable.length > 1) {
            let index = GameConfig.itemUseTable.indexOf(this.m_currentItemId)
            if (index >= 0) {
                if (index < GameConfig.itemUseTable.length - 1) {
                    index++
                }else{
                    index = 0
                }
                this.m_currentItemId = GameConfig.itemUseTable[index]
                this.m_curItemData = GameConfig.itemTable[this.m_currentItemId.toString()]
                egret.Tween.get(this.m_itemArmatureContainer).to({ alpha: 0 }, 300, egret.Ease.circIn).call(this._ItemArmatureFadeIn, this)
                this._UpdateFullArmature()
            }
        }
    }

    private _OnWaterComplete() {
		this.water.play(0)
	}

    private _OnWarningComplete() {
        this.m_isWarning = false
        this.m_rectWarning.visible = false
    }

	private onComplete() {
        this.m_itemArmatureContainer = new DragonBonesArmatureContainer()
        this.m_itemArmatureContainer.x = this.m_groupIcon.width / 2
        this.m_itemArmatureContainer.y = this.m_groupIcon.height
		this.m_groupIcon.addChild(this.m_itemArmatureContainer)

        this.m_fullArmatureContainer = new DragonBonesArmatureContainer()
        this.m_groupFull.addChild(this.m_fullArmatureContainer)

        this.addChild( this.m_gestureShape )
        this.m_imgPower.mask = this.m_progress
        this.m_groupPower.addChild(this.m_progress)
        this.water.play(0)
        this.readyAnimate.addEventListener('complete', this._OnReadyComplete, this)
        this.m_groupIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChangeItem, this)
        this.m_fullArmatureContainer.addCompleteCallFunc(this._OnFullArmatureComplete, this)
        this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnPause, this)
        this.water.addEventListener('complete', this._OnWaterComplete, this)
        this.warning.addEventListener('complete', this._OnWarningComplete, this)
		this._OnResize()
	}

    /**
     * 创建子弹
     */
    private _CreateBullete(target:BaseActor) {
        let bullet:Bullet = GameObjectPool.getInstance().createObject(Bullet, "Bullet")
        let effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()]
        if (effectData.bullet != "") {
            bullet.Init(target, effectData.bullet, effectData.type)
            this.m_bullets.push(bullet)
            this.m_groupGameEffect.addChild(bullet)
            bullet.x = this.m_bulletGroup.x + this.m_bulletGroup.width / 2
            bullet.y = this.m_bulletGroup.y
        }
    }

    private _CreateMonster() {
        let monster:Monster = GameObjectPool.getInstance().createObject(Monster, "Monster")
        monster.Init(this.m_currentLevel, this.m_levelState)
        if (this.m_curItemData != null) {
            let effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()]
            monster.UpdateEffectArmature(effectData)
        }
        this.m_monsters.push(monster)
        for (let i = this.m_monsters.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_monsters[i])
		}
    }

    private _CreateLuckyActor() {
        let lucky:LuckyActor = GameObjectPool.getInstance().createObject(LuckyActor, "LuckyActor")
        lucky.Init()
        this.m_luckyActors.push(lucky)
        this.m_groupGame.addChild(lucky)
    }

    public CreateSummonActor(a_data:any, a_x:number, a_y:number) {
        
        let summon:SummonActor = GameObjectPool.getInstance().createObject(SummonActor, "SummonActor")
        let targetX = a_x + MathUtils.getRandom(-150, 150)
        let targetY = a_y + MathUtils.getRandom(-20, 20)
        summon.Init(a_data, targetX, targetY, a_x, a_y)
        this.m_summonActors.push(summon)
        for (let i = this.m_summonActors.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_summonActors[i])
		}
    }

    private test:boolean = false

    protected _OnResize(event:egret.Event = null)
    {
		this.m_fullArmatureContainer.width = Config.stageWidth
        this.m_fullArmatureContainer.height = Config.stageHeight
    }


    /**生成怪物时间 */ 
    private m_monsterAddDelay:number
    /**生成幸运角色时间 */
    private m_luckyAddDelay:number

    private m_monsters:Array<Monster>
    private m_bullets:Array<Bullet>
    private m_luckyActors:Array<LuckyActor>
    private m_summonActors:Array<SummonActor>

    private m_score:number
    private m_power:number
    private m_slowDelay:number
    private m_currentItemId:number

    /**关卡配置数据 */
    private m_currentLevel:any
    /**当前关卡状态 */
    private m_levelState:ELevelType
    /**关卡经过的时间 */
    private m_passTime:number
    /**关卡总时间 */
    private m_allTime:number
    /**精英怪总量 */
    private m_eliteCount:number
    private m_isWarning:boolean

    ///////////////////////////////////////////////////////////////////////////
	private m_imgScene:eui.Image
	private m_bitLabScore:eui.BitmapLabel
    private m_imgEffectMask:eui.Image
    private m_imgGroundLine:eui.Image
    private m_imgGroundWater:eui.Image
    private m_imgGroundWarning:eui.Image
    private m_rectWarning:eui.Rect
    private m_btnPause:eui.Button

	private m_groupScore:eui.Group
	private m_groupBottom:eui.Group
    private m_groupGame:eui.Group
    private m_groupGameEffect:eui.Group
    private m_bulletGroup:eui.Group
    private m_groupGesture:eui.Group
    private m_groupFull:eui.Group
    private m_gestureShape:egret.Shape
	private m_gesture:Gesture

    /**云朵 */
	private m_cloud1:eui.Image
	private m_cloud2:eui.Image
	private m_cloud3:eui.Image
	private m_cloud1Speed:number
	private m_cloud2Speed:number
	private m_cloud3Speed:number

    /**能量释放组 */
    private m_groupPower:eui.Group
    private m_groupIcon:eui.Group
    private readyAnimate:egret.tween.TweenGroup
    private effectMask:egret.tween.TweenGroup
    private warning:egret.tween.TweenGroup
    /**水面 */
	private water:egret.tween.TweenGroup

    private m_progress:egret.Shape
	private m_angle:number
    private m_imgPower:eui.Image

    /**道具图标动画 */
    private m_itemArmatureContainer:DragonBonesArmatureContainer
    private m_itemArmature:DragonBonesArmature
    private m_curItemData:any

    private m_fullArmatureContainer:DragonBonesArmatureContainer
    private m_fullArmature:DragonBonesArmature
}