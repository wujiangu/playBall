/**面板管理
 * 
 * 
 */
namespace PanelManager {
	export var m_gameStartPanel:GameStartPanel
	export var m_bottomBtnPanel:BottomBtnPanel
	export var m_backpackPanel:BackpackPanel
	export var m_gameScenePanel:GameScenePanel
	export var m_settingPanel:SettingPanel
	export var m_gameOverPanel:GameOverPanel

	function _OpenBottomBtnPanel() {
		if (m_bottomBtnPanel == null) {
			m_bottomBtnPanel = new BottomBtnPanel()
		}
		m_bottomBtnPanel.onEnter()
	}

	function _CloseBottomBtnPanel(){
		if (m_bottomBtnPanel != null){
			m_bottomBtnPanel.onExit()
		}
	}

	function _OpenGameStartPanel(){
		if (m_gameStartPanel == null){
			m_gameStartPanel = new GameStartPanel()
		}
		m_gameStartPanel.onEnter()
	}

	function _CloseGameStartPanel(){
		if (m_gameStartPanel != null){
			m_gameStartPanel.onExit()
		}
	}

	function _OpenBackpackPanel(){
		if (m_backpackPanel == null){
			m_backpackPanel = new BackpackPanel()
		}
		m_backpackPanel.onEnter()
	}

	function _CloseBackpackPanel(){
		if (m_backpackPanel != null){
			m_backpackPanel.onExit()
		}
	}

	function _OpenGameScenePanel() {
		if (m_gameScenePanel == null) {
			m_gameScenePanel = new GameScenePanel()
		}
		m_gameScenePanel.onEnter()
	}

	function _CloseGameScenePanel() {
		if (m_gameScenePanel != null){
			m_gameScenePanel.onExit()
		}
	}

	function _OpenSettingPanel() {
		if (m_settingPanel == null) {
			m_settingPanel = new SettingPanel()
		}
		m_settingPanel.onEnter()
	}

	function _CloseSettingPanel() {
		if (m_settingPanel != null){
			m_settingPanel.onExit()
		}
	}

	function _OpenGameOverPanel() {
		if (m_gameOverPanel == null) {
			m_gameOverPanel = new GameOverPanel()
		}
		m_gameOverPanel.onEnter()
	}

	function _CloseGameOverPanel() {
		if (m_gameOverPanel != null){
			m_gameOverPanel.onExit()
		}
	}

	
	export function initPanel(){
		Common.addEventListener(MainNotify.openGameStartPanel, _OpenGameStartPanel, PanelManager)
		Common.addEventListener(MainNotify.closeGameStartPanel, _CloseGameStartPanel, PanelManager)

		Common.addEventListener(MainNotify.openBottomBtnPanel, _OpenBottomBtnPanel, PanelManager)
		Common.addEventListener(MainNotify.closeBottomBtnPanel, _CloseBottomBtnPanel, PanelManager)

		Common.addEventListener(MainNotify.openBackpackPanel, _OpenBackpackPanel, PanelManager)
		Common.addEventListener(MainNotify.closeBackpackPanel, _CloseBackpackPanel, PanelManager)

		Common.addEventListener(MainNotify.openGamePanel, _OpenGameScenePanel, PanelManager)
		Common.addEventListener(MainNotify.closeGamePanel, _CloseGameScenePanel, PanelManager)

		Common.addEventListener(MainNotify.openSettingPanel, _OpenSettingPanel, PanelManager)
		Common.addEventListener(MainNotify.closeSettingPanel, _CloseSettingPanel, PanelManager)

		Common.addEventListener(MainNotify.openGameOverPanel, _OpenGameOverPanel, PanelManager)
		Common.addEventListener(MainNotify.closeGameOverPanel, _CloseGameOverPanel, PanelManager)
	}
}