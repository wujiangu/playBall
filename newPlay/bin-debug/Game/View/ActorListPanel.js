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
        var pageCount = Math.ceil(GameConfig.babyOpenList.length / 9);
        this._pageReset(pageCount);
        this.updateBabyInfo(GameConfig.curBaby);
    };
    // 进入面板
    ActorListPanel.prototype.onEnter = function () {
        this.touchChildren = true;
        this.initData();
        this.xuanzhuan.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    ActorListPanel.prototype.onExit = function () {
        this.touchChildren = false;
        this.xuanzhuan.stop();
        Common.gameScene().uiLayer.removeChild(this);
    };
    ActorListPanel.prototype.updateBabyInfo = function (a_id) {
        var data = GameConfig.actorTable[a_id.toString()];
        this.m_labActorName.text = data.name;
        this.m_labDesc.text = data.desc;
        this.m_actorArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.action, data.action);
        if (this.m_actorArmature == null) {
            this.m_actorArmature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_actorArmature.ArmatureDisplay = armatureDisplay;
        this.m_actorArmatureContainer.register(this.m_actorArmature, ["fangdazhao", "idle", "zoulu"]);
        this.m_actorArmatureContainer.play("idle");
        this.m_actorArmatureContainer.scaleX = 0.5;
        this.m_actorArmatureContainer.scaleY = 0.5;
        for (var i = 0; i < GameConfig.babyOpenList.length; i++) {
            var id = GameConfig.babyOpenList[i];
            var data_1 = GameConfig.actorTable[id];
            this.m_actors[i].visible = true;
            this.m_actors[i].actorIcon = data_1.icon;
            this.m_actors[i].id = data_1.id;
            this.m_actors[i].SetLight(false);
            if (id == a_id)
                this.m_actors[i].SetLight(true);
        }
    };
    ActorListPanel.prototype._pageReset = function (a_pageCount) {
        var distance = 43;
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
        this._initActorIcon();
        this.m_srollView.itemNum = a_pageCount;
        this.m_srollView.reset(this.m_imgPages);
        this.m_srollView.spacing = 20;
    };
    ActorListPanel.prototype._initActorIcon = function () {
        for (var i = 0; i < this.m_actors.length; i++) {
            this.m_actors[i].visible = false;
        }
    };
    ActorListPanel.prototype._onBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeActorListPanel);
        Common.dispatchEvent(MainNotify.openGameStartPanel);
    };
    ActorListPanel.prototype._onBtnAddCandy = function () {
        Common.dispatchEvent(MainNotify.openRechargePanel);
    };
    ActorListPanel.prototype._onLoop = function () {
        this.xuanzhuan.play(0);
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
                actor.scaleX = 0.8;
                actor.scaleY = 0.8;
                this.m_actors.push(actor);
                actor.id = this.m_actors.length;
                this.m_pages[i].addChild(actor);
            }
        }
        this.m_actorArmatureContainer = new DragonBonesArmatureContainer();
        this.m_actorArmatureContainer.x = this.m_groupActor.width / 2;
        this.m_actorArmatureContainer.y = this.m_groupActor.height;
        this.m_groupActor.addChild(this.m_actorArmatureContainer);
        this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
        this.m_btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAddCandy, this);
        this.xuanzhuan.addEventListener('complete', this._onLoop, this);
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
    Object.defineProperty(ActorIR.prototype, "id", {
        get: function () {
            return this.m_id;
        },
        set: function (value) {
            this.m_id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorIR.prototype, "actorIcon", {
        set: function (value) {
            this.m_imgActor.source = value;
        },
        enumerable: true,
        configurable: true
    });
    ActorIR.prototype.SetLight = function (a_status) {
        this.m_imgBox.visible = a_status;
    };
    ActorIR.prototype.init = function () {
    };
    ActorIR.prototype._onActorClick = function () {
        Common.log("选择了 " + this.m_id);
        PanelManager.m_actorListPanel.updateBabyInfo(this.m_id);
        Common.UpdateCurBaby(this.m_id);
    };
    ActorIR.prototype._onComplete = function () {
        this.m_imgActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this);
    };
    return ActorIR;
}(eui.Component));
__reflect(ActorIR.prototype, "ActorIR");
//# sourceMappingURL=ActorListPanel.js.map