/**面板管理
 *
 *
 */
var PanelManager;
(function (PanelManager) {
    function _OpenBottomBtnPanel() {
        if (PanelManager.m_bottomBtnPanel == null) {
            PanelManager.m_bottomBtnPanel = new BottomBtnPanel();
        }
        PanelManager.m_bottomBtnPanel.onEnter();
    }
    function _CloseBottomBtnPanel() {
        if (PanelManager.m_bottomBtnPanel != null) {
            PanelManager.m_bottomBtnPanel.onExit();
        }
    }
    function _OpenGameStartPanel() {
        if (PanelManager.m_gameStartPanel == null) {
            PanelManager.m_gameStartPanel = new GameStartPanel();
        }
        PanelManager.m_gameStartPanel.onEnter();
    }
    function _CloseGameStartPanel() {
        if (PanelManager.m_gameStartPanel != null) {
            PanelManager.m_gameStartPanel.onExit();
        }
    }
    function _OpenBackpackPanel() {
        if (PanelManager.m_backpackPanel == null) {
            PanelManager.m_backpackPanel = new BackpackPanel();
        }
        PanelManager.m_backpackPanel.onEnter();
    }
    function _CloseBackpackPanel() {
        if (PanelManager.m_backpackPanel != null) {
            PanelManager.m_backpackPanel.onExit();
        }
    }
    function _OpenGameScenePanel() {
        if (PanelManager.m_gameScenePanel == null) {
            PanelManager.m_gameScenePanel = new GameScenePanel();
        }
        PanelManager.m_gameScenePanel.onEnter();
    }
    function _CloseGameScenePanel() {
        if (PanelManager.m_gameScenePanel != null) {
            PanelManager.m_gameScenePanel.onExit();
        }
    }
    function _OpenSettingPanel() {
        if (PanelManager.m_settingPanel == null) {
            PanelManager.m_settingPanel = new SettingPanel();
        }
        PanelManager.m_settingPanel.onEnter();
    }
    function _CloseSettingPanel() {
        if (PanelManager.m_settingPanel != null) {
            PanelManager.m_settingPanel.onExit();
        }
    }
    function _OpenGameOverPanel() {
        if (PanelManager.m_gameOverPanel == null) {
            PanelManager.m_gameOverPanel = new GameOverPanel();
        }
        PanelManager.m_gameOverPanel.onEnter();
    }
    function _CloseGameOverPanel() {
        if (PanelManager.m_gameOverPanel != null) {
            PanelManager.m_gameOverPanel.onExit();
        }
    }
    function initPanel() {
        Common.addEventListener(MainNotify.openGameStartPanel, _OpenGameStartPanel, PanelManager);
        Common.addEventListener(MainNotify.closeGameStartPanel, _CloseGameStartPanel, PanelManager);
        Common.addEventListener(MainNotify.openBottomBtnPanel, _OpenBottomBtnPanel, PanelManager);
        Common.addEventListener(MainNotify.closeBottomBtnPanel, _CloseBottomBtnPanel, PanelManager);
        Common.addEventListener(MainNotify.openBackpackPanel, _OpenBackpackPanel, PanelManager);
        Common.addEventListener(MainNotify.closeBackpackPanel, _CloseBackpackPanel, PanelManager);
        Common.addEventListener(MainNotify.openGamePanel, _OpenGameScenePanel, PanelManager);
        Common.addEventListener(MainNotify.closeGamePanel, _CloseGameScenePanel, PanelManager);
        Common.addEventListener(MainNotify.openSettingPanel, _OpenSettingPanel, PanelManager);
        Common.addEventListener(MainNotify.closeSettingPanel, _CloseSettingPanel, PanelManager);
        Common.addEventListener(MainNotify.openGameOverPanel, _OpenGameOverPanel, PanelManager);
        Common.addEventListener(MainNotify.closeGameOverPanel, _CloseGameOverPanel, PanelManager);
    }
    PanelManager.initPanel = initPanel;
})(PanelManager || (PanelManager = {}));
