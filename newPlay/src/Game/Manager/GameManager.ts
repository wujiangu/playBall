/**
 * 游戏管理
 */
class GameManager extends egret.Sprite{
	public constructor() {
		super()
	}

	public static get Instance():GameManager
	{
		if (this._Instance == null){
			this._Instance = new GameManager()
		}
		return this._Instance
	}

	public init()
	{
		// egret.localStorage.clear();
		// RES.loadGroup("back")
		// RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
		// GameConfig.beforeInit()
		GameConfig.init() //初始化
		PanelManager.initPanel()
		this._permanentUI = new PermanentUI()
		Common.gameScene().uiLayer.addChild(this._permanentUI) //创建场景

		this._gameState = EGameState.Ready //设置游戏初始状态
		Common.dispatchEvent(MainNotify.openGameStartPanel) //初始化开始界面？
		// Common.dispatchEvent(MainNotify.openBottomBtnPanel)
	}

	// private onResourceLoadComplete(event: RES.ResourceEvent): void {
    //     if (event.groupName == "back") {
	// 		GameConfig.init()
			
    //         RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
    //     }
    // }

	public stop():void
	{
		if (this._gameState == EGameState.Start) {
			this._gameState = EGameState.End
			PanelManager.gameScenePanel.exit()
			ShakeTool.getInstance().shakeObj(GameManager.Instance.imageScene, 5, 4, 10, this._onshake, this)
		}
	}

	// 关卡模式打完一关
	public endLevel():void
	{
		if (this._gameState == EGameState.Start) {
			this._gameState = EGameState.EndLevel
			PanelManager.gameScenePanel.exit()
			GameConfig.isChapterPassShow = true
			Common.dispatchEvent(MainNotify.openGameOverPanel)			
		}
	}

	public start():void
	{
		this._time = 0
		this._gameState = EGameState.Start
		this._startTime = egret.getTimer()
		this._lastTime = this._startTime
		this._gameSlowDelay = -1
	}

	public pause(isRelease:boolean = false):void
	{
		this._gameState = EGameState.Pause
		if (!isRelease) Common.dispatchEvent(MainNotify.openGamePausePanel)
	}

	public stageToBack() {
		// this._lastStage = this._gameState
		// this._gameState = EGameState.StageBack
		if (this._gameState == EGameState.Start) GameManager.Instance.pause()
	}

	public stageToFront() {
		// this._gameState = this._lastStage
	}

	public continue():void
	{
		this._gameState = EGameState.Start
		this._startTime = egret.getTimer()
		this._lastTime = this._startTime
	}

	public gameSlow() {
		this._gameSlowDelay = 0
	}

	public get imageScene() {
		return this._permanentUI.sceneBg
	}

	public updateSceneBg(path:string, water:number) {
		this._permanentUI.updateScene(path, water)
	}

	public updateSceneSun(path:string) {
		this._permanentUI.updateSun(path)
	}

	public updateSceneCloud(a_bottom:string, a_top:string) {
		this._permanentUI.updateCloud(a_bottom, a_top)
	}

	public update():void
	{
		if (this._gameState == EGameState.StageBack) return

		if (this._permanentUI != null) this._permanentUI.update()

		this._startTime = egret.getTimer()
		let timeElapsed = this._startTime - this._lastTime
		if (PanelManager.capsulePanel != null) {
			PanelManager.capsulePanel.update(timeElapsed)
		}
		if (this._gameState == EGameState.Ready) {
			this._lastTime = this._startTime
			return
		}
		
		if (this._gameSlowDelay >= 0) {
			this._gameSlowDelay += timeElapsed
			timeElapsed *= 0.4
			if (this._gameSlowDelay >= 1000) {
				this._gameSlowDelay = -1
			}
		}
		if (PanelManager.gameScenePanel != null) {
			PanelManager.gameScenePanel.update(timeElapsed)
		}
		DragonBonesFactory.getInstance().update(timeElapsed)
		if(PanelManager.gameLosePanel != null)
		{
			PanelManager.gameLosePanel.update(timeElapsed)
		}		

		this._lastTime = this._startTime
	}

	public get gameState() {
		return this._gameState
	}

	public set gameState(value:EGameState) {
		this._gameState = value
	}

	private _onshake() {
		if (this._gameState == EGameState.End) {
				switch (GameConfig.gameMode) {
					case EBattleMode.Level:	
						if(!GameConfig.isShowGameLosePanelNow){
							Common.dispatchEvent(MainNotify.openGameLosePanel)	
							GameConfig.isShowGameLosePanelNow = true;
						}												
					break
					case EBattleMode.Endless:
						if(!GameConfig.isShowEndlessModePanelNow){
							Common.dispatchEvent(MainNotify.openGameOverPanel)
							GameConfig.isShowEndlessModePanelNow = true;
						}
					break
					case EBattleMode.Timelimite:
					break
					default:
					break
			} 
		}
	}

	private _startTime:number
	private _lastTime:number
	private _time:number
	public _gameState:EGameState
	private _lastStage:EGameState
	private _gameSpeed:number
	private _gameSlowDelay:number

	private _permanentUI:PermanentUI

	private static _Instance:GameManager
}