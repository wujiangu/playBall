var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    GameManager.prototype.init = function () {
        // egret.localStorage.clear();
        // RES.loadGroup("back")
        // RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
        // GameConfig.beforeInit()
        GameConfig.init(); //初始化
        PanelManager.initPanel();
        this._permanentUI = new PermanentUI();
        Common.gameScene().uiLayer.addChild(this._permanentUI); //创建场景
        this._gameState = EGameState.Ready; //设置游戏初始状态
        Common.dispatchEvent(MainNotify.openGameStartPanel); //初始化开始界面？
        // Common.dispatchEvent(MainNotify.openBottomBtnPanel)
    };
    // private onResourceLoadComplete(event: RES.ResourceEvent): void {
    //     if (event.groupName == "back") {
    // 		GameConfig.init()
    //         RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
    //     }
    // }
    GameManager.prototype.stop = function () {
        if (this._gameState == EGameState.Start) {
            this._gameState = EGameState.End;
            PanelManager.gameScenePanel.exit();
            ShakeTool.getInstance().shakeObj(GameManager.Instance.imageScene, 5, 4, 10, this._onshake, this);
        }
    };
    // 关卡模式打完一关
    GameManager.prototype.endLevel = function () {
        Common.log("关卡结束", this._gameState);
        if (this._gameState == EGameState.Start) {
            this._gameState = EGameState.EndLevel;
            PanelManager.gameScenePanel.exit();
            Common.dispatchEvent(MainNotify.openGameOverPanel);
        }
    };
    GameManager.prototype.start = function () {
        this._time = 0;
        this._gameState = EGameState.Start;
        this._startTime = egret.getTimer();
        this._lastTime = this._startTime;
        this._gameSlowDelay = -1;
    };
    GameManager.prototype.pause = function (isRelease) {
        if (isRelease === void 0) { isRelease = false; }
        this._gameState = EGameState.Pause;
        if (!isRelease)
            Common.dispatchEvent(MainNotify.openGamePausePanel);
    };
    GameManager.prototype.stageToBack = function () {
        // this._lastStage = this._gameState
        // this._gameState = EGameState.StageBack
        if (this._gameState == EGameState.Start)
            GameManager.Instance.pause();
    };
    GameManager.prototype.stageToFront = function () {
        // this._gameState = this._lastStage
    };
    GameManager.prototype.continue = function () {
        this._gameState = EGameState.Start;
        this._startTime = egret.getTimer();
        this._lastTime = this._startTime;
    };
    GameManager.prototype.gameSlow = function () {
        this._gameSlowDelay = 0;
    };
    Object.defineProperty(GameManager.prototype, "imageScene", {
        get: function () {
            return this._permanentUI.sceneBg;
        },
        enumerable: true,
        configurable: true
    });
    GameManager.prototype.updateSceneBg = function (path, water) {
        this._permanentUI.updateScene(path, water);
    };
    GameManager.prototype.updateSceneSun = function (path) {
        this._permanentUI.updateSun(path);
    };
    GameManager.prototype.updateSceneCloud = function (a_bottom, a_top) {
        this._permanentUI.updateCloud(a_bottom, a_top);
    };
    GameManager.prototype.update = function () {
        if (this._gameState == EGameState.StageBack)
            return;
        if (this._permanentUI != null)
            this._permanentUI.update();
        this._startTime = egret.getTimer();
        var timeElapsed = this._startTime - this._lastTime;
        if (PanelManager.capsulePanel != null) {
            PanelManager.capsulePanel.update(timeElapsed);
        }
        if (this._gameState == EGameState.Ready) {
            this._lastTime = this._startTime;
            return;
        }
        if (this._gameSlowDelay >= 0) {
            this._gameSlowDelay += timeElapsed;
            timeElapsed *= 0.4;
            if (this._gameSlowDelay >= 1000) {
                this._gameSlowDelay = -1;
            }
        }
        if (PanelManager.gameScenePanel != null) {
            PanelManager.gameScenePanel.update(timeElapsed);
        }
        DragonBonesFactory.getInstance().update(timeElapsed);
        if (PanelManager.gameLosePanel != null) {
            PanelManager.gameLosePanel.update(timeElapsed);
        }
        this._lastTime = this._startTime;
    };
    Object.defineProperty(GameManager.prototype, "gameState", {
        get: function () {
            return this._gameState;
        },
        set: function (value) {
            this._gameState = value;
        },
        enumerable: true,
        configurable: true
    });
    GameManager.prototype._onshake = function () {
        if (this._gameState == EGameState.End) {
            switch (GameConfig.gameMode) {
                case EBattleMode.Level:
                    Common.dispatchEvent(MainNotify.openGameLosePanel);
                    break;
                case EBattleMode.Endless:
                    Common.dispatchEvent(MainNotify.openGameOverPanel);
                    break;
                case EBattleMode.Timelimite:
                    break;
                default:
                    break;
            }
        }
    };
    return GameManager;
}(egret.Sprite));
__reflect(GameManager.prototype, "GameManager");
//# sourceMappingURL=GameManager.js.map