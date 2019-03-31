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
        _this._imgPages = new Array();
        _this._pages = new Array();
        _this._actors = new Array();
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
        this._labCount.text = GameConfig.candy.toString();
        this._labCount.x = 280 - this._labCount.width;
        this._imgCandy.x = this._labCount.x - 63;
    };
    // 进入面板
    ActorListPanel.prototype.onEnter = function () {
        this.touchChildren = true;
        this.initData();
        this.xuanzhuan.play(0);
        Common.updateBabylistIndex(1);
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
        this._labActorName.text = data.name;
        this._labDesc.text = data.desc;
        var index = GameConfig.babyUnlockList.indexOf(a_id);
        if (index < 0) {
            this._labDesc.text = data.unlockDesc;
        }
        this._actorArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.action, data.action);
        if (this._actorArmature == null) {
            this._actorArmature = new DragonBonesArmature(armatureDisplay);
        }
        this._actorArmature.ArmatureDisplay = armatureDisplay;
        this._actorArmatureContainer.register(this._actorArmature, ["fangdazhao", "idle", "zoulu"]);
        this._actorShadow();
        this._actorArmatureContainer.play("idle", 0);
        this._actorState = EMonsterState.Ready;
        this._actorArmatureContainer.scaleX = 0.5;
        this._actorArmatureContainer.scaleY = 0.5;
        this._actorArmatureContainer.addCompleteCallFunc(this._actorArmatureComplete, this);
        for (var i = 0; i < GameConfig.babyOpenList.length; i++) {
            var id = GameConfig.babyOpenList[i];
            var data_1 = GameConfig.actorTable[id];
            var index_1 = GameConfig.babyUnlockList.indexOf(id);
            this._actors[i].visible = true;
            if (index_1 < 0) {
                this._actors[i].actorIcon = data_1.lockIcon;
            }
            else {
                this._actors[i].actorIcon = data_1.icon;
            }
            this._actors[i].id = data_1.id;
            this._actors[i].setLight(false);
            if (id == a_id)
                this._actors[i].setLight(true);
        }
    };
    ActorListPanel.prototype._pageReset = function (a_pageCount) {
        var distance = 43;
        for (var i = 0; i < this._imgPages.length; i++) {
            this._imgPages[i].visible = false;
            this._imgPages[i].source = "actorList3_png";
        }
        for (var i = 0; i < a_pageCount; i++) {
            var begin = 108 - 21.5 * a_pageCount;
            this._imgPages[i].visible = true;
            this._imgPages[i].x = begin + 43 * i;
        }
        this._imgPages[0].source = "actorList4_png";
        for (var i = 0; i < this._pages.length; i++) {
            this._pages[i].visible = false;
        }
        for (var i = 0; i < a_pageCount; i++) {
            this._pages[i].visible = true;
        }
        this._initActorIcon();
        this._srollView.itemNum = a_pageCount;
        this._srollView.reset(this._imgPages);
        this._srollView.spacing = 20;
    };
    ActorListPanel.prototype._initActorIcon = function () {
        for (var i = 0; i < this._actors.length; i++) {
            this._actors[i].visible = false;
        }
    };
    ActorListPanel.prototype._onBtnReturn = function () {
        Common.dispatchEvent(MainNotify.closeActorListPanel);
        Common.dispatchEvent(MainNotify.openGameStartPanel);
    };
    ActorListPanel.prototype._onBtnAddCandy = function () {
        Common.dispatchEvent(MainNotify.openRechargePanel);
    };
    ActorListPanel.prototype._onBtnFusion = function () {
        GameConfig.sceneType = 1;
        Common.dispatchEvent(MainNotify.openCapsulePanel);
    };
    ActorListPanel.prototype._onGroupActor = function () {
        this._actorArmatureContainer.play("fangdazhao", 1);
        this._actorState = EMonsterState.Attack;
    };
    ActorListPanel.prototype._actorArmatureComplete = function () {
        Common.log(this._actorState);
        if (this._actorState == EMonsterState.Attack) {
            this._actorArmatureContainer.play("idle", 0);
            this._actorState = EMonsterState.Ready;
        }
    };
    ActorListPanel.prototype._actorShadow = function () {
        // var distance:number = 20;           /// 阴影的偏移距离，以像素为单位
        // var angle:number = 45;              /// 阴影的角度，0 到 360 度
        // var color:number = 0x000000;        /// 阴影的颜色，不包含透明度
        // var alpha:number = 0.7;             /// 光晕的颜色透明度，是对 color 参数的透明度设定
        // var blurX:number = 255;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        // var blurY:number = 255;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        // var strength:number = 65;                /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        // var quality:number = egret.BitmapFilterQuality.LOW;              /// 应用滤镜的次数，暂无实现
        // var inner:boolean = false;            /// 指定发光是否为内侧发光
        // var knockout:boolean = false;            /// 指定对象是否具有挖空效果
        // let glowFilter = new egret.DropShadowFilter(distance, angle, color, alpha, blurX, blurY,strength, quality, inner, knockout)
        // this._actorArmatureContainer.filters = [glowFilter]
    };
    ActorListPanel.prototype._onLoop = function () {
        this.xuanzhuan.play(0);
    };
    ActorListPanel.prototype._updateCandy = function () {
        this._labCount.text = GameConfig.candy.toString();
        this._labCount.x = 280 - this._labCount.width;
        this._imgCandy.x = this._labCount.x - 63;
    };
    ActorListPanel.prototype._onComplete = function () {
        this._imgPages.push(this._imgPage1);
        this._imgPages.push(this._imgPage2);
        this._imgPages.push(this._imgPage3);
        this._imgPages.push(this._imgPage4);
        this._imgPages.push(this._imgPage5);
        this._pages.push(this._page1);
        this._pages.push(this._page2);
        this._pages.push(this._page3);
        this._pages.push(this._page4);
        this._pages.push(this._page5);
        var distance = 203;
        for (var i = 0; i < this._pages.length; i++) {
            for (var j = 0; j < 9; j++) {
                var actor = new ActorIR();
                var col = j % 3;
                var row = Math.floor(j / 3);
                actor.x = distance * col;
                actor.y = distance * row;
                actor.scaleX = 0.9;
                actor.scaleY = 0.9;
                this._actors.push(actor);
                actor.id = this._actors.length;
                this._pages[i].addChild(actor);
            }
        }
        this._actorArmatureContainer = new DragonBonesArmatureContainer();
        this._actorArmatureContainer.x = this._groupActor.width / 2;
        this._actorArmatureContainer.y = this._groupActor.height;
        this._groupActor.addChild(this._actorArmatureContainer);
        this._btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this);
        this._btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAddCandy, this);
        this._btnFusion.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnFusion, this);
        this._groupActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onGroupActor, this);
        this.xuanzhuan.addEventListener('complete', this._onLoop, this);
        Common.addTouchBegin(this._btnReturn);
        Common.addTouchBegin(this._btnAddCandy);
        Common.addEventListener(MainNotify.updateCandy, this._updateCandy, this);
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
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorIR.prototype, "actorIcon", {
        set: function (value) {
            this._imgActor.source = value;
        },
        enumerable: true,
        configurable: true
    });
    ActorIR.prototype.setLight = function (a_status) {
        this._imgBox.visible = a_status;
    };
    ActorIR.prototype.init = function () {
    };
    ActorIR.prototype._onActorClick = function () {
        PanelManager.actorListPanel.updateBabyInfo(this._id);
        // 判断是否在已解锁列表中
        var index = GameConfig.babyUnlockList.indexOf(this._id);
        if (index >= 0) {
            Common.updateCurBaby(this._id);
        }
    };
    ActorIR.prototype._onComplete = function () {
        this._imgActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this);
    };
    return ActorIR;
}(eui.Component));
__reflect(ActorIR.prototype, "ActorIR");
//# sourceMappingURL=ActorListPanel.js.map