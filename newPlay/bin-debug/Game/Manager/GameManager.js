var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        // this.Start()
        GameConfig.Init();
        PanelManager.initPanel();
        // this._bgMusic = RES.getRes("bgMusic_mp3")
        this._gameState = EGameState.Ready;
        Common.dispatchEvent(MainNotify.openGameStartPanel);
        // Common.dispatchEvent(MainNotify.openBottomBtnPanel)
    };
    GameManager.prototype.Stop = function () {
    };
    GameManager.prototype.Start = function () {
        this._time = 0;
        this._gameState = EGameState.Start;
        this._startTime = egret.getTimer();
        this._lastTime = this._startTime;
    };
    GameManager.prototype.Continue = function () {
        this._gameState = EGameState.Start;
        this._startTime = egret.getTimer();
        this._lastTime = this._startTime;
    };
    GameManager.prototype.Update = function () {
        if (this._gameState != EGameState.Start) {
            return;
        }
        this._startTime = egret.getTimer();
        var timeElapsed = this._startTime - this._lastTime;
        if (PanelManager.m_gameScenePanel != null) {
            PanelManager.m_gameScenePanel.Update(timeElapsed);
        }
        DragonBonesFactory.getInstance().Update(timeElapsed);
        // this._map.Update(this._startTime - this._lastTime)
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
    return GameManager;
}(egret.Sprite));
__reflect(GameManager.prototype, "GameManager");
