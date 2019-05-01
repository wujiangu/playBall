/**面板管理
 *
 *
 */
var PanelManager;
(function (PanelManager) {
    function _openGameStartPanel() {
        if (PanelManager.gameStartPanel == null) {
            PanelManager.gameStartPanel = new GameStartPanel();
        }
        PanelManager.gameStartPanel.onEnter();
    }
    function _closeGameStartPanel() {
        if (PanelManager.gameStartPanel != null) {
            PanelManager.gameStartPanel.onExit();
        }
    }
    function _openGameScenePanel() {
        if (PanelManager.gameScenePanel == null) {
            PanelManager.gameScenePanel = new GameScenePanel();
        }
        PanelManager.gameScenePanel.onEnter();
    }
    function _closeGameScenePanel() {
        if (PanelManager.gameScenePanel != null) {
            PanelManager.gameScenePanel.onExit();
        }
    }
    function _openSettingPanel() {
        if (PanelManager.settingPanel == null) {
            PanelManager.settingPanel = new SettingPanel();
        }
        PanelManager.settingPanel.onEnter();
    }
    function _closeSettingPanel() {
        if (PanelManager.settingPanel != null) {
            PanelManager.settingPanel.onExit();
        }
    }
    function _openGameOverPanel() {
        if (PanelManager.gameOverPanel == null) {
            PanelManager.gameOverPanel = new GameOverPanel();
        }
        PanelManager.gameOverPanel.onEnter();
    }
    function _closeGameOverPanel() {
        if (PanelManager.gameOverPanel != null) {
            PanelManager.gameOverPanel.onExit();
        }
    }
    function _openGameLosePanel() {
        if (PanelManager.gameLosePanel == null) {
            PanelManager.gameLosePanel = new GameLosePanel();
        }
        PanelManager.gameLosePanel.onEnter();
    }
    function _closeGameLosePanel() {
        if (PanelManager.gameLosePanel != null) {
            PanelManager.gameLosePanel.onExit();
        }
    }
    function _openChooseOperationPanel() {
        if (PanelManager.chooseOperationPanel == null) {
            PanelManager.chooseOperationPanel = new ChooseOperationPanel();
        }
        PanelManager.chooseOperationPanel.onEnter();
    }
    function _closeChooseOperationPanel() {
        if (PanelManager.chooseOperationPanel != null) {
            PanelManager.chooseOperationPanel.onExit();
        }
    }
    function _openBuyConfirmPanel() {
        if (PanelManager.closeBuyConfirmPanel == null) {
            PanelManager.closeBuyConfirmPanel = new BuyConfirmPanel();
        }
        PanelManager.closeBuyConfirmPanel.onEnter();
    }
    function _closeBuyConfirmPanel() {
        if (PanelManager.closeBuyConfirmPanel != null) {
            PanelManager.closeBuyConfirmPanel.onExit();
        }
    }
    function _openGamePausePanel() {
        if (PanelManager.gamePausetPanel == null) {
            PanelManager.gamePausetPanel = new GamePausePanel();
        }
        PanelManager.gamePausetPanel.onEnter();
    }
    function _closeGamePausePanel() {
        if (PanelManager.gamePausetPanel != null) {
            PanelManager.gamePausetPanel.onExit();
        }
    }
    function _openActorListPanel() {
        if (PanelManager.actorListPanel == null) {
            PanelManager.actorListPanel = new ActorListPanel();
        }
        PanelManager.actorListPanel.onEnter();
    }
    function _closeActorListPanel() {
        if (PanelManager.actorListPanel != null) {
            PanelManager.actorListPanel.onExit();
        }
    }
    function _openGameSelectLevelPanel() {
        if (PanelManager.gameSelectLevel == null) {
            PanelManager.gameSelectLevel = new GameSelectLevel();
        }
        PanelManager.gameSelectLevel.onEnter();
    }
    function _closeGameSelectLevelPanel() {
        if (PanelManager.gameSelectLevel != null) {
            PanelManager.gameSelectLevel.onExit();
        }
    }
    function _openRechargePanel() {
        if (PanelManager.rechargePanel == null) {
            PanelManager.rechargePanel = new RechargeUI();
        }
        PanelManager.rechargePanel.onEnter();
    }
    function _closeRechargePanel() {
        if (PanelManager.rechargePanel != null) {
            PanelManager.rechargePanel.onExit();
        }
    }
    function _openSignPanel() {
        if (PanelManager.signPanel == null) {
            PanelManager.signPanel = new SignPanel();
        }
        PanelManager.signPanel.onEnter();
    }
    function _closeSignPanel() {
        if (PanelManager.signPanel != null) {
            PanelManager.signPanel.onExit();
        }
    }
    function _openCapsulePanel() {
        if (PanelManager.capsulePanel == null) {
            PanelManager.capsulePanel = new CapsulePanel();
        }
        PanelManager.capsulePanel.onEnter();
    }
    function _closeCapsulePanel() {
        if (PanelManager.capsulePanel != null) {
            PanelManager.capsulePanel.onExit();
        }
    }
    function _onGetRewardPanel() {
        if (PanelManager.getRewardPanel == null) {
            PanelManager.getRewardPanel = new GetRewardUI();
        }
        PanelManager.getRewardPanel.onEnter();
    }
    function _onCloseRewardPanel() {
        if (PanelManager.getRewardPanel != null) {
            PanelManager.getRewardPanel.onExit();
        }
    }
    function initPanel() {
        Common.addEventListener(MainNotify.openGameStartPanel, _openGameStartPanel, PanelManager);
        Common.addEventListener(MainNotify.closeGameStartPanel, _closeGameStartPanel, PanelManager);
        Common.addEventListener(MainNotify.openGamePanel, _openGameScenePanel, PanelManager);
        Common.addEventListener(MainNotify.closeGamePanel, _closeGameScenePanel, PanelManager);
        Common.addEventListener(MainNotify.openSettingPanel, _openSettingPanel, PanelManager);
        Common.addEventListener(MainNotify.closeSettingPanel, _closeSettingPanel, PanelManager);
        Common.addEventListener(MainNotify.openGameOverPanel, _openGameOverPanel, PanelManager);
        Common.addEventListener(MainNotify.closeGameOverPanel, _closeGameOverPanel, PanelManager);
        Common.addEventListener(MainNotify.openGameLosePanel, _openGameLosePanel, PanelManager);
        Common.addEventListener(MainNotify.closeGameLosePanel, _closeGameLosePanel, PanelManager);
        Common.addEventListener(MainNotify.openChooseOperationPanel, _openChooseOperationPanel, PanelManager);
        Common.addEventListener(MainNotify.closeChooseOperationPanel, _closeChooseOperationPanel, PanelManager);
        Common.addEventListener(MainNotify.openBuyConfirmPanel, _openBuyConfirmPanel, this);
        Common.addEventListener(MainNotify.closeBuyConfirmPanel, _closeBuyConfirmPanel, this);
        Common.addEventListener(MainNotify.openGamePausePanel, _openGamePausePanel, PanelManager);
        Common.addEventListener(MainNotify.closeGamePausePanel, _closeGamePausePanel, PanelManager);
        Common.addEventListener(MainNotify.openActorListPanel, _openActorListPanel, PanelManager);
        Common.addEventListener(MainNotify.closeActorListPanel, _closeActorListPanel, PanelManager);
        Common.addEventListener(MainNotify.openGameSelectLevel, _openGameSelectLevelPanel, PanelManager);
        Common.addEventListener(MainNotify.closeGameSelectLevel, _closeGameSelectLevelPanel, PanelManager);
        Common.addEventListener(MainNotify.openRechargePanel, _openRechargePanel, PanelManager);
        Common.addEventListener(MainNotify.closeRechargePanel, _closeRechargePanel, PanelManager);
        Common.addEventListener(MainNotify.openSignPanel, _openSignPanel, PanelManager);
        Common.addEventListener(MainNotify.closeSignPanel, _closeSignPanel, PanelManager);
        Common.addEventListener(MainNotify.openCapsulePanel, _openCapsulePanel, PanelManager);
        Common.addEventListener(MainNotify.closeCapsulePanel, _closeCapsulePanel, PanelManager);
        Common.addEventListener(MainNotify.openGetRewardPanel, _onGetRewardPanel, PanelManager);
        Common.addEventListener(MainNotify.closeGetRewardPanel, _onCloseRewardPanel, PanelManager);
    }
    PanelManager.initPanel = initPanel;
})(PanelManager || (PanelManager = {}));
//# sourceMappingURL=PanelManager.js.map