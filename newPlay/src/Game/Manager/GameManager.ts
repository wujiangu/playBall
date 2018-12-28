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
		// this.Start()
		GameConfig.Init()
		PanelManager.initPanel()
		// this._bgMusic = RES.getRes("bgMusic_mp3")
		this._gameState = EGameState.Ready
		Common.dispatchEvent(MainNotify.openGameStartPanel)
		// Common.dispatchEvent(MainNotify.openBottomBtnPanel)
	}

	public Stop():void
	{
		if (this._gameState == EGameState.Start) {
			this._gameState = EGameState.End
			PanelManager.m_gameScenePanel.Exit()
			ShakeTool.getInstance().shakeObj(PanelManager.m_gameScenePanel, 5, 4, 10, this._Onshake)
		}
		
	}

	public Start():void
	{
		this._time = 0
		this._gameState = EGameState.Start
		this._startTime = egret.getTimer()
		this._lastTime = this._startTime
	}

	public Pause():void
	{
		this._gameState = EGameState.Pause
		Common.dispatchEvent(MainNotify.openGamePausePanel)
	}

	public Continue():void
	{
		this._gameState = EGameState.Start
		this._startTime = egret.getTimer()
		this._lastTime = this._startTime
	}


	public Update():void
	{
		if (this._gameState == EGameState.Ready) {
			if (PanelManager.m_gameStartPanel != null) {
				PanelManager.m_gameStartPanel.Update()
			}
			return
		}
		this._startTime = egret.getTimer()
		let timeElapsed = this._startTime - this._lastTime
		if (PanelManager.m_gameScenePanel != null) {
			PanelManager.m_gameScenePanel.Update(timeElapsed)
		}
		DragonBonesFactory.getInstance().Update(timeElapsed)
		// this._map.Update(this._startTime - this._lastTime)
		this._lastTime = this._startTime
	}

	public get GameState() {
		return this._gameState
	}

	public set GameState(value:EGameState) {
		this._gameState = value
	}

	private _Onshake() {
		Common.dispatchEvent(MainNotify.openGameOverPanel)
	}

	private _startTime:number
	private _lastTime:number
	private _time:number
	private _gameState:EGameState
	private _bgMusic:egret.Sound
	private _bgChannel:egret.SoundChannel

	private static _Instance:GameManager
}