var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SettingPanel = (function (_super) {
    __extends(SettingPanel, _super);
    function SettingPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/settingPanel.exml";
        return _this;
    }
    // 初始化面板
    SettingPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    SettingPanel.prototype.initData = function () {
    };
    // 进入面板
    SettingPanel.prototype.onEnter = function () {
        // Common.curPanel = PanelManager.m_backpackPanel
        Common.gameScene().uiLayer.addChild(this);
        this.m_sliderSound.maximum = 100;
        this.m_sliderBGM.maximum = 100;
        this.m_sliderSound.value = 50;
        this.m_sliderBGM.value = 30;
        this.m_btnReturn.enabled = false;
        Animations.popupOut(this.m_groupSetting, 300, function () {
            this.m_btnReturn.enabled = true;
        }.bind(this));
    };
    // 退出面板
    SettingPanel.prototype.onExit = function () {
        Animations.popupIn(this.m_groupSetting, 300, function () {
            Common.gameScene().uiLayer.removeChild(this);
        }.bind(this));
    };
    SettingPanel.prototype._OnSoundSlider = function () {
    };
    SettingPanel.prototype._OnBGMSlider = function () {
    };
    SettingPanel.prototype._OnClose = function () {
        Common.dispatchEvent(MainNotify.closeSettingPanel);
    };
    SettingPanel.prototype.onComplete = function () {
        this._OnResize();
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this);
        this.m_sliderSound.addEventListener(egret.Event.CHANGE, this._OnSoundSlider, this);
        this.m_sliderBGM.addEventListener(egret.Event.CHANGE, this._OnBGMSlider, this);
    };
    SettingPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return SettingPanel;
}(BasePanel));
__reflect(SettingPanel.prototype, "SettingPanel");
//# sourceMappingURL=SettingPanel.js.map