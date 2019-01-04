var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameStartPanel = (function (_super) {
    __extends(GameStartPanel, _super);
    function GameStartPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameStart.exml";
        return _this;
    }
    // 初始化面板
    GameStartPanel.prototype.initPanel = function () {
        this.m_cloud1Speed = 0.6;
        this.m_cloud2Speed = 0.3;
        this.m_cloud3Speed = 0.1;
        this.m_isInit = false;
    };
    // 初始化面板数据
    GameStartPanel.prototype.initData = function () {
    };
    // 进入面板
    GameStartPanel.prototype.onEnter = function () {
        Common.curPanel = PanelManager.m_gameStartPanel;
        this.touchChildren = true;
        this.m_maskRect.visible = false;
        if (!this.m_isInit) {
            this.touchChildren = false;
            this.InitGroup.play(0);
            this.m_isInit = true;
        }
        else {
            this.m_groupStart.alpha = 1;
            this.m_maskRect.visible = true;
            this.initGame.play(0);
        }
        // this.m_imgCloth.y = Config.stageHeight - 1375
        if (GameVoice.beginBGMChannel != null)
            GameVoice.beginBGMChannel.stop();
        GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameStartPanel.prototype.onExit = function () {
        this.touchChildren = false;
        GameVoice.beginBGMChannel.stop();
        Common.gameScene().uiLayer.removeChild(this);
    };
    GameStartPanel.prototype.Update = function () {
        if (this.m_cloud1.x >= -this.m_cloud1.width) {
            this.m_cloud1.x -= this.m_cloud1Speed;
        }
        else {
            this.m_cloud1.x = Config.stageWidth;
        }
        if (this.m_cloud2.x >= -this.m_cloud2.width) {
            this.m_cloud2.x -= this.m_cloud2Speed;
        }
        else {
            this.m_cloud2.x = Config.stageWidth;
        }
        if (this.m_cloud3.x <= Config.stageWidth + this.m_cloud3.width) {
            this.m_cloud3.x += this.m_cloud1Speed;
        }
        else {
            this.m_cloud3.x = -this.m_cloud3.width;
        }
    };
    GameStartPanel.prototype._OnHideCloth = function () {
        // GameManager.Instance.Start()
        Common.dispatchEvent(MainNotify.closeGameStartPanel);
        Common.dispatchEvent(MainNotify.openGamePanel);
    };
    GameStartPanel.prototype._OnStartGame = function () {
        this.touchChildren = false;
        this.m_sceneType = 1;
        this.m_maskRect.visible = true;
        this.startGame.play(0);
        // this.CloseGroup.play(0)
    };
    GameStartPanel.prototype._OnBtnSetting = function () {
        Common.dispatchEvent(MainNotify.openSettingPanel);
    };
    GameStartPanel.prototype._OnBtnRank = function () {
    };
    GameStartPanel.prototype._OnBtnProc = function () {
        this.m_sceneType = 2;
        this.m_maskRect.visible = true;
        this.startGame.play(0);
    };
    GameStartPanel.prototype._OnInitComplete = function () {
        this.touchChildren = true;
    };
    GameStartPanel.prototype._OnCloseComplete = function () {
        this._OnHideCloth();
    };
    GameStartPanel.prototype._OnWaterComplete = function () {
        this.water.play(0);
    };
    GameStartPanel.prototype._OnBtn1 = function () {
        GameConfig.testSelectLevel = 1001;
    };
    GameStartPanel.prototype._OnBtn2 = function () {
        GameConfig.testSelectLevel = 1002;
    };
    GameStartPanel.prototype._OnBtn3 = function () {
        GameConfig.testSelectLevel = 1003;
    };
    GameStartPanel.prototype._OnBtnLoop = function () {
        GameConfig.testSelectLevel = 1004;
    };
    GameStartPanel.prototype._OnGameStartComplete = function () {
        if (this.m_sceneType == 1) {
            this._OnHideCloth();
        }
        else if (this.m_sceneType == 2) {
            Common.dispatchEvent(MainNotify.closeGameStartPanel);
            Common.dispatchEvent(MainNotify.openBackpackPanel);
        }
    };
    GameStartPanel.prototype._OnInitGameComplete = function () {
        Common.log("进来动画完成");
        this.touchChildren = true;
    };
    GameStartPanel.prototype.onComplete = function () {
        // this.m_imgCloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
        this._OnResize();
        this.water.play(0);
        this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this);
        this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnSetting, this);
        this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this);
        this.m_btnProc.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnProc, this);
        Common.addTouchBegin(this.m_btnGameStart);
        Common.addTouchBegin(this.m_btnSetting);
        Common.addTouchBegin(this.m_btnRank);
        Common.addTouchBegin(this.m_btnProc);
        this.InitGroup.addEventListener('complete', this._OnInitComplete, this);
        this.CloseGroup.addEventListener('complete', this._OnCloseComplete, this);
        this.water.addEventListener('complete', this._OnWaterComplete, this);
        this.startGame.addEventListener('complete', this._OnGameStartComplete, this);
        this.initGame.addEventListener('complete', this._OnInitGameComplete, this);
        this.m_groupLevel.visible = true;
        this.m_btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtn1, this);
        this.m_btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtn2, this);
        this.m_btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtn3, this);
        this.m_btnLoop.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLoop, this);
    };
    GameStartPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
        _super.prototype._OnResize.call(this, event);
    };
    return GameStartPanel;
}(BasePanel));
__reflect(GameStartPanel.prototype, "GameStartPanel");
//# sourceMappingURL=GameStartPanel.js.map