class GameScenePanel extends BasePanel {
	public constructor() {
		super()
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameScenePanel.exml"
        GameConfig.monsterConfig = RES.getRes("monsterConfig_json")
        GameConfig.gestureConfig = RES.getRes("gesture_json")
        for (let i = 0; i < GameConfig.monsterConfig.length; i++) {
            let data = GameConfig.monsterConfig[i]
            this._InitBattleDragonBones(data.Animation)
        }

        this.m_monsters = new Array()
	}

	// 初始化面板
    public initPanel():void{
        this.m_gestureShape = new egret.Shape()
        this.m_gesture = new Gesture()
		this.m_gesture.Init()
    }

    // 初始化面板数据
    public initData():void{
        GameConfig.gestureType = 0
        this.m_monsterAddDelay = 0

        this.Score = 0

        this.m_proPower.value = 0
    }

    // 进入面板
    public onEnter():void{
        Common.curPanel = PanelManager.m_gameScenePanel
		this.touchChildren = true
        Common.gameScene().uiLayer.addChild(this)
        this.initData()
        // this._CreateMonster()
        
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
        this.m_gesture.removeEvent()
        Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this)
    }

    public Update(timeElapsed:number) {
        if (GameManager.Instance.GameState != EGameState.Pause) {
            this.m_monsterAddDelay += timeElapsed
        }

        if (this.m_monsterAddDelay >= GameConfig.monsterAddDelay) {
            this.m_monsterAddDelay = 0
            this._CreateMonster()
        }

        for (let i = 0; i < this.m_monsters.length; i++) {
            this.m_monsters[i].Update(timeElapsed)
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

    public get Score() {
        return this.m_score
    }

    public set Score(value:number) {
        this.m_score = value
        this.m_labScore.text = this.m_score.toString()
    }

    public get Power() {
        return this.m_proPower.value
    }

    public set Power(value:number) {
        this.m_proPower.value = value
    }

    private _OnGesture() {
        if (GameConfig.gestureType > 0 && (this.m_monsters.length > 0)) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                // if (monster.GestureType == GameConfig.gestureType) {
                //     monster.GotoDead()
                // }
            }
        }
    }

    private _OnBtnPause() {

    }

	private onComplete() {
        this.addChild( this.m_gestureShape )
		this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnPause, this)
		this._OnResize()
	}

    private _CreateMonster() {
        let monster:Monster = GameObjectPool.getInstance().createObject(Monster, "Monster")
        monster.Init()
        this.m_monsters.push(monster)
        for (let i = this.m_monsters.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_monsters[i])
		}
    }

    /**
     * 初始化骨骼的动画数据
     */
    private _InitBattleDragonBones(name:string):void {
		let skeletonData = RES.getRes(name+"_ske_json")
        let textureData = RES.getRes(name+"_tex_json")
        let texture = RES.getRes(name+"_tex_png")
        DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture)
    }

    protected _OnResize(event:egret.Event = null)
    {
		
    }


    // 生成怪物时间
    private m_monsterAddDelay:number
    private m_monsters:Array<Monster>
    private m_score:number

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
    private m_proPower:eui.ProgressBar
}