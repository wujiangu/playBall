var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 震动工具
 * Example:
 * 震动目标obj，1秒内震动10次，震动最大距离10
 * ShakeTool.getInstance().shakeObj(obj, 1, 10, 10);
 */
var ShakeTool = (function () {
    function ShakeTool() {
        this.count = 0; //计时器次数
        this.timer = new egret.Timer(100);
    }
    ShakeTool.getInstance = function () {
        if (this.instance == null) {
            this.instance = new ShakeTool();
        }
        return this.instance;
    };
    /**
     * 震动显示对象
     * @param        target    震动目标对象
     * @param        time      震动持续时长（秒）
     * @param        rate      震动频率(一秒震动多少次)
     * @param        maxDis    震动最大距离
     */
    ShakeTool.prototype.shakeObj = function (target, time, rate, maxDis, func, thisobj) {
        if (func === void 0) { func = null; }
        if (thisobj === void 0) { thisobj = null; }
        this.target = target;
        // this.initX = target.x;
        // this.initY = target.y;
        this.maxDis = maxDis;
        this.count = time * rate;
        this.rate = rate;
        this.timer.delay = 100 / rate;
        this.timer.repeatCount = this.count;
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.shaking, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.shakeComplete, this);
        this.timer.reset();
        this.timer.start();
        if (func != null && thisobj != null) {
            this.completeFunc = func;
            this.thisobj = thisobj;
        }
    };
    ShakeTool.prototype.setInitPos = function (x, y) {
        this.initX = x;
        this.initY = y;
    };
    ShakeTool.prototype.shaking = function () {
        egret.Tween.removeTweens(this.target);
        this.target.x = this.initX - this.maxDis + Math.random() * this.maxDis * 2;
        this.target.y = this.initY - this.maxDis + Math.random() * this.maxDis * 2;
        egret.Tween.get(this.target).to({ x: this.initX, y: this.initY }, 100 / this.rate);
    };
    ShakeTool.prototype.shakeComplete = function () {
        if (this.target) {
            egret.Tween.removeTweens(this.target);
            this.target.x = this.initX;
            this.target.y = this.initY;
        }
        if (this.completeFunc && this.thisobj) {
            this.completeFunc.call(this.thisobj);
        }
        this.timer.removeEventListener(egret.TimerEvent.TIMER, this.shaking, this);
        this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.shakeComplete, this);
    };
    /**停止震动 */
    ShakeTool.prototype.stop = function () {
        this.shakeComplete();
    };
    return ShakeTool;
}());
__reflect(ShakeTool.prototype, "ShakeTool");
//# sourceMappingURL=ShakeTools.js.map