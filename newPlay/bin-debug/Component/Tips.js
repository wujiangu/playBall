var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tips = (function (_super) {
    __extends(Tips, _super);
    function Tips() {
        var _this = _super.call(this) || this;
        _this.m_imgBg = new egret.Bitmap();
        _this.addChild(_this.m_imgBg);
        _this.m_labDesc = new egret.TextField();
        _this.addChild(_this.m_labDesc);
        _this.m_data = new TipsData();
        return _this;
    }
    Tips.prototype.Init = function () {
        this.m_imgBg.visible = false;
        if (this.m_data.tipsBg.length > 0) {
            this.m_imgBg.texture = RES.getRes(this.m_data.tipsBg);
            this.m_imgBg.visible = true;
        }
        this.m_labDesc.textColor = this.m_data.descColor;
        this.m_labDesc.size = this.m_data.descSize;
        this.m_labDesc.textAlign = "center";
        this.m_labDesc.text = this.m_data.desc;
        this.m_labDesc.bold = true;
    };
    Object.defineProperty(Tips.prototype, "data", {
        get: function () {
            return this.m_data;
        },
        enumerable: true,
        configurable: true
    });
    return Tips;
}(egret.DisplayObjectContainer));
__reflect(Tips.prototype, "Tips");
var TipsData = (function () {
    function TipsData() {
        this.tipsBg = "";
        this.desc = "";
        this.descSize = 40;
        this.descColor = Common.TextColors.red;
    }
    return TipsData;
}());
__reflect(TipsData.prototype, "TipsData");
