var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 游戏管理
 */
var GameManager = (function (_super) {
    __extends(GameManager, _super);
    function GameManager() {
        return _super.call(this) || this;
    }
    Object.defineProperty(GameManager, "Instance", {
        get: function () {
            if (this._Instance == null) {
                this._Instance = new GameManager();
            }
            return this._Instance;
        },
        enumerable: true,
        configurable: true
    });
    GameManager.prototype.Init = function () {
        GameConfig.Init();
        PanelManager.initPanel();
        this.m_permanentUI = new PermanentUI();
        Common.gameScene().uiLayer.addChild(this.m_permanentUI);
        this._gameState = EGameState.Ready;
        Common.dispatchEvent(MainNotify.openGameStartPanel);
        // Common.dispatchEvent(MainNotify.openBottomBtnPanel)
    };
    GameManager.prototype.Stop = function () {
        if (this._gameState == EGameState.Start) {
            this._gameState = EGameState.End;
            PanelManager.m_gameScenePanel.Exit();
            ShakeTool.getInstance().shakeObj(GameManager.Instance.imageScene, 5, 4, 10, this._Onshake, this);
        }
    };
    // 关卡模式打完一关
    GameManager.prototype.EndLevel = function () {
        if (this._gameState == EGameState.Start) {
            this._gameState = EGameState.EndLevel;
            PanelManager.m_gameScenePanel.Exit();
            Common.dispatchEvent(MainNotify.openGameOverPanel);
        }
    };
    GameManager.prototype.Start = function () {
        this._time = 0;
        this._gameState = EGameState.Start;
        this._startTime = egret.getTimer();
        this._lastTime = this._startTime;
        this._gameSlowDelay = -1;
    };
    GameManager.prototype.Pause = function (isRelease) {
        if (isRelease === void 0) { isRelease = false; }
        this._gameState = EGameState.Pause;
        if (!isRelease)
            Common.dispatchEvent(MainNotify.openGamePausePanel);
    };
    GameManager.prototype.StageToBack = function () {
        // this._lastStage = this._gameState
        // this._gameState = EGameState.StageBack
        if (this._gameState == EGameState.Start)
            GameManager.Instance.Pause();
    };
    GameManager.prototype.StageToFront = function () {
        // this._gameState = this._lastStage
    };
    GameManager.prototype.Continue = function () {
        this._gameState = EGameState.Start;
        this._startTime = egret.getTimer();
        this._lastTime = this._startTime;
    };
    GameManager.prototype.GameSlow = function () {
        this._gameSlowDelay = 0;
    };
    Object.defineProperty(GameManager.prototype, "imageScene", {
        get: function () {
            return this.m_permanentUI.sceneBg;
        },
        enumerable: true,
        configurable: true
    });
    GameManager.prototype.updateSceneBg = function (path) {
        this.m_permanentUI.updateScene(path);
    };
    GameManager.prototype.Update = function () {
        if (this._gameState == EGameState.StageBack)
            return;
        if (this.m_permanentUI != null)
            this.m_permanentUI.update();
        this._startTime = egret.getTimer();
        var timeElapsed = this._startTime - this._lastTime;
        if (this._gameState == EGameState.Ready) {
            return;
        }
        if (this._gameSlowDelay >= 0) {
            this._gameSlowDelay += timeElapsed;
            timeElapsed *= 0.4;
            if (this._gameSlowDelay >= 1000) {
                this._gameSlowDelay = -1;
            }
        }
        if (PanelManager.m_gameScenePanel != null) {
            PanelManager.m_gameScenePanel.Update(timeElapsed);
        }
        DragonBonesFactory.getInstance().Update(timeElapsed);
        this._lastTime = this._startTime;
    };
    Object.defineProperty(GameManager.prototype, "GameState", {
        get: function () {
            return this._gameState;
        },
        set: function (value) {
            this._gameState = value;
        },
        enumerable: true,
        configurable: true
    });
    GameManager.prototype._Onshake = function () {
        if (this._gameState == EGameState.End) {
            Common.dispatchEvent(MainNotify.openGameOverPanel);
        }
    };
    return GameManager;
}(egret.Sprite));
__reflect(GameManager.prototype, "GameManager");
//# sourceMappingURL=GameManager.js.map