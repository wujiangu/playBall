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
var RingScrollView = (function (_super) {
    __extends(RingScrollView, _super);
    function RingScrollView() {
        return _super.call(this) || this;
    }
    /**
     * 创建环形滚动
     * @param content {RingContent} 单个滚动对象
     * @param count {number} 滚动数量(最小3个)
     */
    RingScrollView.prototype.Init = function (content, count) {
        if (count < 3) {
            console.error("the content at least 3 count");
            return;
        }
        var scrollView = new egret.ScrollView();
        this.addChild(scrollView);
        scrollView.height = content.height;
        for (var i = 0; i < count; i++) {
        }
    };
    return RingScrollView;
}(egret.DisplayObjectContainer));
__reflect(RingScrollView.prototype, "RingScrollView");
var RingContent = (function (_super) {
    __extends(RingContent, _super);
    function RingContent() {
        return _super.call(this) || this;
    }
    RingContent.prototype.Init = function () {
        // this.m_imgBase = new egret.Bitmap()
        // let texture:egret.Texture = RES.getRes(name)
        // this.m_imgBase.texture = texture
    };
    RingContent.prototype.Update = function () {
    };
    return RingContent;
}(egret.DisplayObjectContainer));
__reflect(RingContent.prototype, "RingContent");
