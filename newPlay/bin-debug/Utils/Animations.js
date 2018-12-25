/**
 * 公用动画
 */
var Animations;
(function (Animations) {
    /**
     * 闪烁
     */
    function flash(target, time, unitTime, func) {
        if (time === void 0) { time = 1000; }
        if (unitTime === void 0) { unitTime = 100; }
        if (func === void 0) { func = null; }
        var count = Math.floor(time / (2 * unitTime));
        var num = 0;
        var animate = function () {
            var _this = this;
            egret.Tween.get(target).to({ alpha: 0.3 }, unitTime).call(function () {
                egret.Tween.get(target).to({ alpha: 1 }, unitTime).call(function () {
                    egret.Tween.removeTweens(target);
                    num++;
                    if (num < count) {
                        animate();
                    }
                    else {
                        if (func)
                            func();
                    }
                }, _this);
            }, this);
        }.bind(this);
        animate();
    }
    Animations.flash = flash;
    function floatUpDown(target, time, beginY, endY) {
        if (time === void 0) { time = 1000; }
        if (beginY === void 0) { beginY = 0; }
        if (endY === void 0) { endY = 0; }
        var animate = function () {
            egret.Tween.get(target).to({ y: endY }, time / 2).call(function () {
                egret.Tween.get(target).to({ y: beginY }, time / 2).call(function () {
                    animate();
                });
            });
        };
        animate();
    }
    Animations.floatUpDown = floatUpDown;
    /**弹窗弹出动画 */
    function popupOut(target, time, func) {
        if (time === void 0) { time = 500; }
        if (func === void 0) { func = null; }
        target.scaleX = 0;
        target.scaleY = 0;
        egret.Tween.get(target).to({ scaleX: 1.0, scaleY: 1.0 }, time, egret.Ease.backOut).call(function () {
            if (func)
                func();
        });
        ;
    }
    Animations.popupOut = popupOut;
    /**弹窗回收动画 */
    function popupIn(target, time, func) {
        if (time === void 0) { time = 500; }
        if (func === void 0) { func = null; }
        egret.Tween.get(target).to({ scaleX: 0, scaleY: 0 }, time, egret.Ease.backIn).call(function () {
            if (func)
                func();
        });
    }
    Animations.popupIn = popupIn;
    /**
     * 伤害弹出并消失
     */
    function hurtTips(target, offset) {
        if (offset === void 0) { offset = 50; }
        target.alpha = 0;
        var step1 = function () {
            egret.Tween.get(target).to({ alpha: 0 }, 200);
        };
        egret.Tween.get(target).to({ y: target.y - offset, alpha: 1 }, 400, egret.Ease.backOut).call(step1);
    }
    Animations.hurtTips = hurtTips;
    //淡出
    function fadeOut(target, time, func, completeFunc) {
        if (time === void 0) { time = 500; }
        if (func === void 0) { func = null; }
        if (completeFunc === void 0) { completeFunc = null; }
        target.alpha = 0;
        egret.Tween.get(target).to({ alpha: 1.0 }, time, egret.Ease.circOut).call(function () {
            if (completeFunc) {
                completeFunc();
            }
        });
        if (func) {
            func();
        }
    }
    Animations.fadeOut = fadeOut;
    /**淡入 */
    function fadeIn(target, time, func) {
        if (time === void 0) { time = 500; }
        if (func === void 0) { func = null; }
        target.alpha = 1.0;
        egret.Tween.get(target).to({ alpha: 0 }, time, egret.Ease.circIn).call(function () {
            if (func) {
                func();
            }
        });
    }
    Animations.fadeIn = fadeIn;
    //淡出淡入
    function fadeOutIn(target, outTime, inTime, delay, func, thisobj) {
        if (outTime === void 0) { outTime = 200; }
        if (inTime === void 0) { inTime = 200; }
        if (delay === void 0) { delay = 0; }
        if (func === void 0) { func = null; }
        if (thisobj === void 0) { thisobj = null; }
        egret.Tween.get(target).to({ alpha: 1.0 }, outTime, egret.Ease.quintOut);
        egret.setTimeout(function () {
            egret.Tween.get(target).to({ alpha: 0 }, inTime, egret.Ease.quintIn).call(function () {
                if (func) {
                    func(thisobj);
                }
            });
        }, this, delay);
    }
    Animations.fadeOutIn = fadeOutIn;
})(Animations || (Animations = {}));
//# sourceMappingURL=Animations.js.map