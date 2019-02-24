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
var ActorListPanel = (function (_super) {
    __extends(ActorListPanel, _super);
    function ActorListPanel() {
        var _this = _super.call(this) || this;
        _this.m_pageNum = 5;
        _this.m_imgPages = new Array();
        _this.m_pages = new Array();
        _this.m_actors = new Array();
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/listActorPanel.exml";
        return _this;
    }
    // 初始化面板
    ActorListPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    ActorListPanel.prototype.initData = function () {
        this._pageReset(3);
    };
    // 进入面板
    ActorListPanel.prototype.onEnter = function () {
        this.touchChildren = true;
        this.initData();
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    ActorListPanel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    ActorListPanel.prototype._pageReset = function (a_pageCount) {
        var distance = 43;
        // 1-->86.5 2-->65 3-->43 108 - 21.5*a_pageCount
        for (var i = 0; i < this.m_imgPages.length; i++) {
            this.m_imgPages[i].visible = false;
            this.m_imgPages[i].source = "actorList3_png";
        }
        for (var i = 0; i < a_pageCount; i++) {
            var begin = 108 - 21.5 * a_pageCount;
            this.m_imgPages[i].visible = true;
            this.m_imgPages[i].x = begin + 43 * i;
        }
        this.m_imgPages[0].source = "actorList4_png";
        for (var i = 0; i < this.m_pages.length; i++) {
            this.m_pages[i].visible = false;
        }
        for (var i = 0; i < a_pageCount; i++) {
            this.m_pages[i].visible = true;
        }
        this.m_srollView.itemNum = a_pageCount;
        this.m_srollView.reset(this.m_imgPages);
    };
    ActorListPanel.prototype._onBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeActorListPanel);
    };
    ActorListPanel.prototype._onComplete = function () {
        this.m_imgPages.push(this.m_imgPage1);
        this.m_imgPages.push(this.m_imgPage2);
        this.m_imgPages.push(this.m_imgPage3);
        this.m_imgPages.push(this.m_imgPage4);
        this.m_imgPages.push(this.m_imgPage5);
        this.m_pages.push(this.m_page1);
        this.m_pages.push(this.m_page2);
        this.m_pages.push(this.m_page3);
        this.m_pages.push(this.m_page4);
        this.m_pages.push(this.m_page5);
        var distance = 216;
        for (var i = 0; i < this.m_pages.length; i++) {
            for (var j = 0; j < 9; j++) {
                var actor = new ActorIR();
                var col = j % 3;
                var row = Math.floor(j / 3);
                actor.x = distance * col;
                actor.y = distance * row;
                this.m_actors.push(actor);
                this.m_pages[i].addChild(actor);
            }
        }
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
    };
    return ActorListPanel;
}(BasePanel));
__reflect(ActorListPanel.prototype, "ActorListPanel");
var ActorIR = (function (_super) {
    __extends(ActorIR, _super);
    function ActorIR() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/actorIR.exml";
        return _this;
    }
    ActorIR.prototype._onActorClick = function () {
    };
    ActorIR.prototype._onComplete = function () {
        this.m_imgActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this);
    };
    return ActorIR;
}(eui.Component));
__reflect(ActorIR.prototype, "ActorIR");
//# sourceMappingURL=ActorListPanel.js.map