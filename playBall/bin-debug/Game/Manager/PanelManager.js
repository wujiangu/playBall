/**面板管理
 *
 *
 */
var PanelManager;
(function (PanelManager) {
    var m_gameStartPanel;
    var m_bottomBtnPanel;
    var m_backpackPanel;
    function _OpenBottomBtnPanel() {
        if (m_bottomBtnPanel == null) {
            m_bottomBtnPanel = new BottomBtnPanel();
        }
        m_bottomBtnPanel.onEnter();
    }
    function _CloseBottomBtnPanel() {
        if (m_bottomBtnPanel != null) {
            m_bottomBtnPanel.onExit();
        }
    }
    function _OpenGameStartPanel() {
        if (m_gameStartPanel == null) {
            m_gameStartPanel = new GameStartPanel();
        }
        m_gameStartPanel.onEnter();
    }
    function _CloseGameStartPanel() {
        if (m_gameStartPanel != null) {
            m_gameStartPanel.onExit();
        }
    }
    function _OpenBackpackPanel() {
        if (m_backpackPanel == null) {
            m_backpackPanel = new BackpackPanel();
        }
        m_backpackPanel.onEnter();
    }
    function _CloseBackpackPanel() {
        if (m_backpackPanel != null) {
            m_backpackPanel.onExit();
        }
    }
    function initPanel() {
        Common.addEventListener(MainNotify.openGameStartPanel, _OpenGameStartPanel, PanelManager);
        Common.addEventListener(MainNotify.closeGameStartPanel, _CloseGameStartPanel, PanelManager);
        Common.addEventListener(MainNotify.openBottomBtnPanel, _OpenBottomBtnPanel, PanelManager);
        Common.addEventListener(MainNotify.closeBottomBtnPanel, _CloseBottomBtnPanel, PanelManager);
        Common.addEventListener(MainNotify.openBackpackPanel, _OpenBackpackPanel, PanelManager);
        Common.addEventListener(MainNotify.closeBackpackPanel, _CloseBackpackPanel, PanelManager);
    }
    PanelManager.initPanel = initPanel;
})(PanelManager || (PanelManager = {}));
//# sourceMappingURL=PanelManager.js.map