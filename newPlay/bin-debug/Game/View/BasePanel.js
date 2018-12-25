var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
  * 面板基类
  * 面板的基本属性和方法
  */
var BasePanel = (function (_super) {
    __extends(BasePanel, _super);
    // 构造函数
    function BasePanel() {
        var _this = _super.call(this) || this;
        _this.w = 0;
        _this.h = 0;
        _this.w = Config.stageWidth;
        _this.h = Config.stageHeight;
        _this.initPanel();
        // 当舞台尺寸发送变化
        _this.addEventListener(egret.Event.RESIZE, _this._OnResize, _this);
        return _this;
    }
    // 初始化面板
    BasePanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    BasePanel.prototype.initData = function () {
    };
    // 进入面板
    BasePanel.prototype.onEnter = function () {
    };
    // 退出面板
    BasePanel.prototype.onExit = function () {
    };
    BasePanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return BasePanel;
}(eui.Component));
__reflect(BasePanel.prototype, "BasePanel");
//# sourceMappingURL=BasePanel.js.map