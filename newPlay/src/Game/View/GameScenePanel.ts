class GameScenePanel extends BasePanel {
	public constructor() {
		super()
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameScenePanel.exml"
        GameConfig.monsterConfig = RES.getRes("monsterConfig_json")
        GameConfig.gestureConfig = RES.getRes("gesture_json")
        for (let i = 0; i < GameConfig.monsterConfig.length; i++) {
            let data = GameConfig.monsterConfig[i]
            GameConfig.InitBattleDragonBones(data.Animation)
        }

        this.m_monsters = new Array()
	}

	// 初始化面板
    public initPanel():void{
        this.m_gestureShape = new egret.Shape()
        this.m_gesture = new Gesture()
		this.m_gesture.Init()

        this.m_cloud1Speed = 1
		this.m_cloud2Speed = 0.6
		this.m_cloud3Speed = 0.3
		this.m_imgWaters = new Array()

        this.m_progress = new egret.Shape()
    }

    public Init() {
        this.ClearAllActor()
        this.touchChildren = false
        this.readyAnimate.play(0)
        this.initData()
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this)
    }

    public Exit() {
        this.touchChildren = false
        this.m_gesture.removeEvent()
        Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this)
    }

    // 初始化面板数据
    public initData():void{
        GameConfig.gestureType = 0
        this.m_monsterAddDelay = 0
        this.m_angle = 180
        this.Power = 0
        this.m_score = 0
        this.m_labScore.text = this.m_score.toString()
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
            if (this.m_curItemData == null) {
                let id = GameConfig.itemUseTable[0].toString()
                this.m_curItemData = GameConfig.itemTable[id]
            }
            let effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()]
            let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(effectData.name, effectData.name)
            if (this.m_itemArmature == null) {
			    this.m_itemArmature = new DragonBonesArmature(armatureDisplay)
		    }
            this.m_itemArmature.ArmatureDisplay = armatureDisplay
            this.m_itemArmatureContainer.register(this.m_itemArmature,[
                effectData.name
		    ])
            this.m_itemArmatureContainer.play(effectData.name, 0)
        }

        this.Init()

        // this._CreateMonster()
    }

    // 退出面板
    public onExit():void{
        this.ClearAllActor()
        this.m_itemArmatureContainer.clear()
		Common.gameScene().uiLayer.removeChild(this)
        this.Exit()
    }

    public Update(timeElapsed:number) {
        if (GameManager.Instance.GameState != EGameState.Pause) {
            this.m_monsterAddDelay += timeElapsed
        }

        if (GameManager.Instance.GameState == EGameState.Start && this.m_monsterAddDelay >= GameConfig.monsterAddDelay) {
            this.m_monsterAddDelay = 0
            this._CreateMonster()
        }

        if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.End) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].Update(timeElapsed)
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
    }

    public ClearAllActor() {
        while(this.m_monsters.length > 0) {
			let monster:Monster = this.m_monsters.pop()
			monster.Destroy()
			this.m_groupGame.removeChild(monster)
		}
    }

    public get Score() {
        return this.m_score
    }

    public set Score(value:number) {
        this.m_score = value
        this.m_labScore.text = this.m_score.toString()
        this.m_labScore.anchorOffsetX = this.m_labScore.width / 2
        this.m_labScore.anchorOffsetY = this.m_labScore.height / 2
        this.m_labScore.x = 81 + this.m_labScore.anchorOffsetX
        this.m_labScore.y = this.m_groupScore.height / 2
        egret.Tween.get(this.m_labScore).to({scaleX:2.0, scaleY:2.0}, 100, egret.Ease.backIn).call(this._OnScoreBigger, this)
    }

    public get Power() {
        return this.m_power
    }

    public set Power(value:number) {
        this.m_power = value
        this.m_angle = 180 + value * 2
        this.m_angle = Math.min(this.m_angle, 360)
        this._UpdateProgress(this.m_angle)
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

    private _OnScoreBigger() {
        egret.Tween.get(this.m_labScore).to({scaleX:1.0, scaleY:1.0}, 100, egret.Ease.backOut)
    }

    private _OnGesture() {
        if (GameConfig.gestureType > 0 && (this.m_monsters.length > 0)) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                for (let j = 0; j < monster.Balloons.length; j++) {
                    let balloon:Balloon = monster.Balloons[j]
                    if (balloon.type == GameConfig.gestureType) {
                        monster.BallExplosion(balloon)
                    }
				}
            }
        }
    }

    private _OnBtnPause() {

    }

    private _WaterAnimate(target:eui.Image) {
		Animations.floatUpDown(target, 2000, 10, 0)
	}

    private _OnReadyComplete() {
        this.touchChildren = true
        GameManager.Instance.Start()
    }

    private _OnChangeItem() {
        Common.log("切换道具")
        // for (let i = 0; i < this.m_monsters.length; i++) {
        //     let monster:Monster = this.m_monsters[i]
        //     if (monster.State == EMonsterState.Ready && monster.y >= 100) {
        //         this._CreateBullete(monster)
        //     }
        // }
    }

	private onComplete() {
        this.m_imgWaters.push(this.m_imgWater0)
		this.m_imgWaters.push(this.m_imgWater1)
		this.m_imgWaters.push(this.m_imgWater2)
		this.m_imgWaters.push(this.m_imgWater3)
		this.m_imgWaters.push(this.m_imgWater4)
		this.m_imgWaters.push(this.m_imgWater5)
		this.m_imgWaters.push(this.m_imgWater6)

		for (let i = 0; i < this.m_imgWaters.length; i++) {
			this.m_imgWaters[i].y = 10
			egret.setTimeout(this._WaterAnimate, this, i*200, this.m_imgWaters[i])
		}


        this.m_itemArmatureContainer = new DragonBonesArmatureContainer()
        this.m_itemArmatureContainer.x = this.m_groupIcon.width / 2
        this.m_itemArmatureContainer.y = this.m_groupIcon.height
		this.m_groupIcon.addChild(this.m_itemArmatureContainer)

        this.addChild( this.m_gestureShape )
        this.m_imgPower.mask = this.m_progress
        this.m_groupPower.addChild(this.m_progress)

		this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnPause, this)
        this.readyAnimate.addEventListener('complete', this._OnReadyComplete, this)
        this.m_groupIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChangeItem, this)
		this._OnResize()
	}

    private _CreateBullete(target:BaseActor) {
        let bullet:Bullet = GameObjectPool.getInstance().createObject(Bullet, "Bullet")
        let effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()]
        if (effectData.bullet.length != "") {
            bullet.Init(target, effectData.bullet)
        }
    }

    private _CreateMonster() {
        let monster:Monster = GameObjectPool.getInstance().createObject(Monster, "Monster")
        monster.Init()
        this.m_monsters.push(monster)
        for (let i = this.m_monsters.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_monsters[i])
		}
    }

    protected _OnResize(event:egret.Event = null)
    {
		
    }


    // 生成怪物时间
    private m_monsterAddDelay:number
    private m_monsters:Array<Monster>
    private m_bullets:Array<Bullet>
    private m_score:number
    private m_power:number

    ///////////////////////////////////////////////////////////////////////////
	private m_btnPause:eui.Button
	private m_imgScene:eui.Image
	private m_labScore:eui.Label

	private m_groupScore:eui.Group
	private m_groupBottom:eui.Group
    private m_groupGame:eui.Group
    private m_groupGesture:eui.Group
    private m_gestureShape:egret.Shape
	private m_gesture:Gesture

    /**云朵 */
	private m_cloud1:eui.Image
	private m_cloud2:eui.Image
	private m_cloud3:eui.Image
	private m_cloud1Speed:number
	private m_cloud2Speed:number
	private m_cloud3Speed:number

	/**水面 */
	private m_imgWater0:eui.Image
	private m_imgWater1:eui.Image
	private m_imgWater2:eui.Image
	private m_imgWater3:eui.Image
	private m_imgWater4:eui.Image
	private m_imgWater5:eui.Image
	private m_imgWater6:eui.Image
	private m_imgWaters:Array<eui.Image>

    /**能量释放组 */
    private m_groupPower:eui.Group
    private m_groupIcon:eui.Group
    private readyAnimate:egret.tween.TweenGroup

    private m_progress:egret.Shape
	private m_angle:number
    private m_imgPower:eui.Image

    /**道具图标动画 */
    private m_itemArmatureContainer:DragonBonesArmatureContainer
    private m_itemArmature:DragonBonesArmature
    private m_curItemData:any
}