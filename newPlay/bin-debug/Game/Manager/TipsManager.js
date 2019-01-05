var ETipsType;
(function (ETipsType) {
    ETipsType[ETipsType["None"] = 1] = "None";
    ETipsType[ETipsType["DownToUp"] = 2] = "DownToUp";
})(ETipsType || (ETipsType = {}));
var TipsManager;
(function (TipsManager) {
    var _tips = [];
    function Show(a_str, a_color, a_type, a_size, a_bg, a_x, a_y) {
        if (a_color === void 0) { a_color = Common.TextColors.red; }
        if (a_type === void 0) { a_type = ETipsType.DownToUp; }
        if (a_size === void 0) { a_size = 40; }
        if (a_bg === void 0) { a_bg = ""; }
        if (a_x === void 0) { a_x = Config.stageHalfWidth; }
        if (a_y === void 0) { a_y = Config.stageHalfHeight; }
        var tips = GameObjectPool.getInstance().createObject(Tips, "Tips");
        tips.data.desc = a_str;
        tips.data.descColor = a_color;
        tips.data.descSize = a_size;
        tips.data.tipsBg = a_bg;
        tips.Init();
        tips.anchorOffsetX = tips.width / 2;
        tips.anchorOffsetY = tips.height / 2;
        tips.x = a_x;
        tips.y = a_y - 200;
        _tips.push(tips);
        Common.gameScene().tipsLayer.addChild(tips);
        switch (a_type) {
            case ETipsType.None: {
                // TODO: Implement case content
                tips.alpha = 0;
                egret.Tween.get(tips).to({ alpha: 1 }, 300).call(this.removeTips, this);
                break;
            }
            case ETipsType.DownToUp: {
                tips.alpha = 0;
                tips.y += tips.height;
                egret.Tween.get(tips).to({ alpha: 1, y: tips.y - tips.height }, 500, egret.Ease.backOut).call(this.removeTips, this);
                break;
            }
        }
    }
    TipsManager.Show = Show;
    /**
    * 移除tips方法
    */
    function removeTips() {
        if (_tips != null && _tips.length > 0) {
            var onComplete = function () {
                var tip = _tips.pop();
                if (Common.gameScene().tipsLayer.contains(tip)) {
                    Common.gameScene().tipsLayer.removeChild(tip);
                    GameObjectPool.getInstance().destroyObject(tip);
                }
            };
            egret.Tween.get(_tips).to({ alpha: 0 }, 300).call(onComplete, this);
        }
    }
    TipsManager.removeTips = removeTips;
})(TipsManager || (TipsManager = {}));
//# sourceMappingURL=TipsManager.js.map