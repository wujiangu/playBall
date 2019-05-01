/**面板管理
 * 
 * 
 */
namespace PanelManager {
	export var gameStartPanel:GameStartPanel
	export var gameScenePanel:GameScenePanel
	export var settingPanel:SettingPanel
	export var gameOverPanel:GameOverPanel
	export var gameLosePanel:GameLosePanel
	export var chooseOperationPanel:ChooseOperationPanel
	export var closeBuyConfirmPanel:BuyConfirmPanel
	export var gamePausetPanel:GamePausePanel
	export var actorListPanel:ActorListPanel
	export var gameSelectLevel:GameSelectLevel
	export var rechargePanel:RechargeUI
	export var signPanel:SignPanel
	export var capsulePanel:CapsulePanel
	export var getRewardPanel:GetRewardUI 

	function _openGameStartPanel(){
		if (gameStartPanel == null){
			gameStartPanel = new GameStartPanel()
		}
		gameStartPanel.onEnter()
	}

	function _closeGameStartPanel(){
		if (gameStartPanel != null){
			gameStartPanel.onExit()
		}
	}

	function _openGameScenePanel() {
		if (gameScenePanel == null) {
			gameScenePanel = new GameScenePanel()
		}
		gameScenePanel.onEnter()
	}

	function _closeGameScenePanel() {
		if (gameScenePanel != null){
			gameScenePanel.onExit()
		}
	}

	function _openSettingPanel() {
		if (settingPanel == null) {
			settingPanel = new SettingPanel()
		}
		settingPanel.onEnter()
	}

	function _closeSettingPanel() {
		if (settingPanel != null){
			settingPanel.onExit()
		}
	}

	function _openGameOverPanel() {
		if (gameOverPanel == null) {
			gameOverPanel = new GameOverPanel()
		}
		gameOverPanel.onEnter()
	}

	function _closeGameOverPanel() {
		if (gameOverPanel != null){
			gameOverPanel.onExit()
		}
	}

	function _openGameLosePanel() {
		if (gameLosePanel == null) {
			gameLosePanel = new GameLosePanel()
		}
		gameLosePanel.onEnter()
	}

	function _closeGameLosePanel() {
		if (gameLosePanel != null){
			gameLosePanel.onExit()
		}
	}
	
	function _openChooseOperationPanel() {
		if (chooseOperationPanel == null) {
			chooseOperationPanel = new ChooseOperationPanel()
		}
		chooseOperationPanel.onEnter()
	}

	function _closeChooseOperationPanel() {
		if (chooseOperationPanel != null){
			chooseOperationPanel.onExit()
		}
	}

	function _openBuyConfirmPanel()
	{
		if (closeBuyConfirmPanel == null) {
			closeBuyConfirmPanel = new BuyConfirmPanel()
		}
		closeBuyConfirmPanel.onEnter()
	}

	function _closeBuyConfirmPanel()
	{
		if (closeBuyConfirmPanel != null){
			closeBuyConfirmPanel.onExit()
		}
	}

	function _openGamePausePanel() {
		if (gamePausetPanel == null) {
			gamePausetPanel = new GamePausePanel()
		}
		gamePausetPanel.onEnter()
	}

	function _closeGamePausePanel() {
		if (gamePausetPanel != null){
			gamePausetPanel.onExit()
		}
	}

	function _openActorListPanel() {
		if (actorListPanel == null) {
			actorListPanel = new ActorListPanel()
		}
		actorListPanel.onEnter()
	}

	function _closeActorListPanel() {
		if (actorListPanel != null) {
			actorListPanel.onExit()
		}
	}

	function _openGameSelectLevelPanel() {
		if (gameSelectLevel == null) {
			gameSelectLevel = new GameSelectLevel()
		}
		gameSelectLevel.onEnter()
	}

	function _closeGameSelectLevelPanel() {
		if (gameSelectLevel != null) {
			gameSelectLevel.onExit()
		}
	}

	function _openRechargePanel() {
		if (rechargePanel == null) {
			rechargePanel = new RechargeUI()
		}
		rechargePanel.onEnter()
	}

	function _closeRechargePanel() {
		if (rechargePanel != null) {
			rechargePanel.onExit()
		}
	}

	function _openSignPanel() {
		if (signPanel == null) {
			signPanel = new SignPanel()
		}
		signPanel.onEnter()
	}

	function _closeSignPanel() {
		if (signPanel != null) {
			signPanel.onExit()
		}
	}

	function _openCapsulePanel() {
		if (capsulePanel == null) {
			capsulePanel = new CapsulePanel()
		}
		capsulePanel.onEnter()
	}

	function _closeCapsulePanel() {
		if (capsulePanel != null) {
			capsulePanel.onExit()
		}
	}

	function _onGetRewardPanel() {
		if (getRewardPanel == null) {
			getRewardPanel = new GetRewardUI()
		}
		getRewardPanel.onEnter()
	}

	function _onCloseRewardPanel() {
		if (getRewardPanel != null) {
			getRewardPanel.onExit()
		}
	}

	
	export function initPanel(){
		Common.addEventListener(MainNotify.openGameStartPanel, _openGameStartPanel, PanelManager)
		Common.addEventListener(MainNotify.closeGameStartPanel, _closeGameStartPanel, PanelManager)

		Common.addEventListener(MainNotify.openGamePanel, _openGameScenePanel, PanelManager)
		Common.addEventListener(MainNotify.closeGamePanel, _closeGameScenePanel, PanelManager)

		Common.addEventListener(MainNotify.openSettingPanel, _openSettingPanel, PanelManager)
		Common.addEventListener(MainNotify.closeSettingPanel, _closeSettingPanel, PanelManager)

		Common.addEventListener(MainNotify.openGameOverPanel, _openGameOverPanel, PanelManager)
		Common.addEventListener(MainNotify.closeGameOverPanel, _closeGameOverPanel, PanelManager)

		Common.addEventListener(MainNotify.openGameLosePanel, _openGameLosePanel, PanelManager)
		Common.addEventListener(MainNotify.closeGameLosePanel, _closeGameLosePanel, PanelManager)

		Common.addEventListener(MainNotify.openChooseOperationPanel, _openChooseOperationPanel, PanelManager)
		Common.addEventListener(MainNotify.closeChooseOperationPanel, _closeChooseOperationPanel, PanelManager)	

		Common.addEventListener(MainNotify.openBuyConfirmPanel,_openBuyConfirmPanel,this)
		Common.addEventListener(MainNotify.closeBuyConfirmPanel,_closeBuyConfirmPanel,this)	

		Common.addEventListener(MainNotify.openGamePausePanel, _openGamePausePanel, PanelManager)
		Common.addEventListener(MainNotify.closeGamePausePanel, _closeGamePausePanel, PanelManager)

		Common.addEventListener(MainNotify.openActorListPanel, _openActorListPanel, PanelManager)
		Common.addEventListener(MainNotify.closeActorListPanel, _closeActorListPanel, PanelManager)

		Common.addEventListener(MainNotify.openGameSelectLevel, _openGameSelectLevelPanel, PanelManager)
		Common.addEventListener(MainNotify.closeGameSelectLevel, _closeGameSelectLevelPanel, PanelManager)

		Common.addEventListener(MainNotify.openRechargePanel, _openRechargePanel, PanelManager)
		Common.addEventListener(MainNotify.closeRechargePanel, _closeRechargePanel, PanelManager)

		Common.addEventListener(MainNotify.openSignPanel, _openSignPanel, PanelManager)
		Common.addEventListener(MainNotify.closeSignPanel, _closeSignPanel, PanelManager)

		Common.addEventListener(MainNotify.openCapsulePanel, _openCapsulePanel, PanelManager)
		Common.addEventListener(MainNotify.closeCapsulePanel, _closeCapsulePanel, PanelManager)

		Common.addEventListener(MainNotify.openGetRewardPanel, _onGetRewardPanel, PanelManager)
		Common.addEventListener(MainNotify.closeGetRewardPanel, _onCloseRewardPanel, PanelManager)
	}
}