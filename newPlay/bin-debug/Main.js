//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isPause = false;
        _this.isThemeLoadEnd = false;
        _this.isResourceLoadEnd = false;
        return _this;
    }
    Main.prototype._onResize = function (event) {
        Config.stageWidth = this.stage.stageWidth;
        Config.stageHeight = this.stage.stageHeight;
        Config.stageHalfWidth = this.stage.stageWidth / 2;
        Config.stageHalfHeight = this.stage.stageHeight / 2;
        Config.stageLeft = Config.stageWidth / 3;
        Config.stageCenter = 2 * Config.stageWidth / 3;
        // Common.log("高度", Config.stageHeight)
        // Common.curScene.y = Config.stageHeight - 1392
        // if (Config.stageHeight < 1392) this.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT
    };
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            context.onUpdate = function () {
                GameManager.Instance.update();
            };
        });
        egret.lifecycle.onPause = function () {
            GameManager.Instance.stageToBack();
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            GameManager.Instance.stageToFront();
            egret.ticker.resume();
        };
        this.stage.scaleMode = egret.StageScaleMode.EXACT_FIT;
        this.stage.setContentSize(730, 1392);
        this.stage.maxTouches = 1;
        this.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        // if (Common.systemType() == "windows" || Common.systemType() == "mac") {
        //    egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.SHOW_ALL
        // }
        this.addChild(Common.gameScene());
        this._onResize(null);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.loadConfig("resource/default.res.json", "resource/");
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        this.addEventListener(egret.Event.RESIZE, this._onResize, this);
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        NativeApi.setLocalData("webView", "1");
        RES.loadGroup("preload", 0);
    };
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    Main.prototype.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        this.createScene();
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        var _this = this;
        if (event.groupName == "preload") {
            //Config loading process interface
            //设置加载进度界面
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
            RES.loadGroup("enter", 1);
            this._rect = Common.createBitmap("black_png");
            this._rect.width = Config.stageWidth;
            this._rect.height = Config.stageHeight;
            this._rect.visible = false;
            this.stage.addChild(this._rect);
        }
        else if (event.groupName == "enter") {
            this._rect.visible = true;
            Animations.fadeOut(this._rect);
            Animations.fadeIn(this.loadingView, 500, function () {
                _this._rect.visible = false;
                _this.stage.removeChild(_this.loadingView);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this.onResourceLoadComplete, _this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, _this.onResourceLoadError, _this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, _this.onResourceProgress, _this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, _this.onItemLoadError, _this);
                _this.isResourceLoadEnd = true;
                _this.createScene();
            });
        }
    };
    Main.prototype.createScene = function () {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            if (NativeApi.getLocalData("webView") == null) {
                GameConfig.isWebView = false;
            }
            Common.getMaxScore();
            Common.getUnlockBaby();
            Common.getCurBaby();
            Common.getCurChpter();
            Common.getCurLevel();
            Common.getCurCandy();
            Common.getlastLoginTime();
            Common.getSign();
            Common.getIsSignData();
            Common.getSignCount();
            Common.getBabylistIndex();
            Common.getChapterScore();
            Common.getChapterCombo();
            Common.getLastScore();
            Common.getIsChapterPass();
            Common.getIsGetChapterRecord();
            if (!Common.isTowDataSame(GameConfig.lastLoginTime) && GameConfig.sign == 1) {
                Common.updateSign(0);
            }
            if (GameConfig.signCount >= 7) {
                Common.updateIsSignData(1);
                Common.updateSignCount(0);
                Common.getIsSignData();
                Common.getSignCount();
            }
            this.startCreateScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "enter") {
            this.loadingView.onProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.startCreateScene = function () {
        GameManager.Instance.init();
        // this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClick, this);
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map