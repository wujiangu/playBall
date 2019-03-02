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

	public Init()
	{
		GameConfig.Init()
		PanelManager.initPanel()

		this.m_permanentUI = new PermanentUI()
		Common.gameScene().uiLayer.addChild(this.m_permanentUI)

		this._gameState = EGameState.Ready
		Common.dispatchEvent(MainNotify.openGameStartPanel)
		// Common.dispatchEvent(MainNotify.openBottomBtnPanel)
	}

	public Stop():void
	{
		if (this._gameState == EGameState.Start) {
			this._gameState = EGameState.End
			PanelManager.m_gameScenePanel.Exit()
			ShakeTool.getInstance().shakeObj(GameManager.Instance.imageScene, 5, 4, 10, this._Onshake, this)
		}
	}

	// 关卡模式打完一关
	public EndLevel():void
	{
		if (this._gameState == EGameState.Start) {
			this._gameState = EGameState.EndLevel
			PanelManager.m_gameScenePanel.Exit()
			Common.dispatchEvent(MainNotify.openGameOverPanel)
		}
	}

	public Start():void
	{
		this._time = 0
		this._gameState = EGameState.Start
		this._startTime = egret.getTimer()
		this._lastTime = this._startTime
		this._gameSlowDelay = -1
	}

	public Pause(isRelease:boolean = false):void
	{
		this._gameState = EGameState.Pause
		if (!isRelease) Common.dispatchEvent(MainNotify.openGamePausePanel)
	}

	public StageToBack() {
		// this._lastStage = this._gameState
		// this._gameState = EGameState.StageBack
		if (this._gameState == EGameState.Start) GameManager.Instance.Pause()
	}

	public StageToFront() {
		// this._gameState = this._lastStage
	}

	public Continue():void
	{
		this._gameState = EGameState.Start
		this._startTime = egret.getTimer()
		this._lastTime = this._startTime
	}

	public GameSlow() {
		this._gameSlowDelay = 0
	}

	public get imageScene() {
		return this.m_permanentUI.sceneBg
	}

	public updateSceneBg(path:string) {
		this.m_permanentUI.updateScene(path)
	}

	public Update():void
	{
		if (this._gameState == EGameState.StageBack) return

		if (this.m_permanentUI != null) this.m_permanentUI.update()

		this._startTime = egret.getTimer()
		let timeElapsed = this._startTime - this._lastTime
		if (this._gameState == EGameState.Ready) {
			return
		}
		
		if (this._gameSlowDelay >= 0) {
			this._gameSlowDelay += timeElapsed
			timeElapsed *= 0.4
			if (this._gameSlowDelay >= 1000) {
				this._gameSlowDelay = -1
			}
		}
		if (PanelManager.m_gameScenePanel != null) {
			PanelManager.m_gameScenePanel.Update(timeElapsed)
		}
		DragonBonesFactory.getInstance().Update(timeElapsed)

		this._lastTime = this._startTime
	}

	public get GameState() {
		return this._gameState
	}

	public set GameState(value:EGameState) {
		this._gameState = value
	}

	private _Onshake() {
		if (this._gameState == EGameState.End) {
			Common.dispatchEvent(MainNotify.openGameOverPanel)
		}
	}

	private _startTime:number
	private _lastTime:number
	private _time:number
	private _gameState:EGameState
	private _lastStage:EGameState
	private _gameSpeed:number
	private _gameSlowDelay:number

	private m_permanentUI:PermanentUI

	private static _Instance:GameManager
}