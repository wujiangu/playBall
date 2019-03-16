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
var Tips = (function (_super) {
    __extends(Tips, _super);
    function Tips() {
        var _this = _super.call(this) || this;
        _this._imgBg = new egret.Bitmap();
        _this.addChild(_this._imgBg);
        _this._labDesc = new egret.TextField();
        _this.addChild(_this._labDesc);
        _this._data = new TipsData();
        return _this;
    }
    Tips.prototype.init = function () {
        this._imgBg.visible = false;
        if (this._data.tipsBg.length > 0) {
            this._imgBg.texture = RES.getRes(this._data.tipsBg);
            this._imgBg.visible = true;
        }
        this._labDesc.textColor = this._data.descColor;
        this._labDesc.size = this._data.descSize;
        this._labDesc.textAlign = "center";
        this._labDesc.text = this._data.desc;
        this._labDesc.bold = true;
    };
    Object.defineProperty(Tips.prototype, "data", {
        get: function () {
            return this._data;
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
//# sourceMappingURL=Tips.js.map