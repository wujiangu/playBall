/**
 * 公用动画
 */
namespace Animations {
    /**
     * 闪烁
     */
    export function flash(target:any, time:number = 1000, unitTime:number = 100, func:Function = null) {
        let count:number = Math.floor(time/(2*unitTime));
        let num:number = 0;
        var animate = function() {
            egret.Tween.get(target).to({alpha:0.3},unitTime).call(()=>{
                egret.Tween.get(target).to({alpha:1},unitTime).call(()=>{
                    egret.Tween.removeTweens(target);
                    num ++;
                    if (num < count){
                        animate()
                    }else{
                        if (func) func();
                    }
                },this)
            },this);
        }.bind(this);
        animate();
    }

    /**弹窗弹出动画 */
    export function popupOut(target:any, time:number=500, func:Function=null) {
        target.scaleX = 0;
        target.scaleY = 0;
        egret.Tween.get(target).to({scaleX:1.0, scaleY:1.0}, time, egret.Ease.backOut).call(()=>{
            if (func) func();
        });;
    }

    /**弹窗回收动画 */
    export function popupIn(target:any, time:number=500, func:Function=null) {
        egret.Tween.get(target).to({scaleX:0, scaleY:0}, time, egret.Ease.backIn).call(()=>{
            if (func) func();
        });
    }

    /**
     * 伤害弹出并消失
     */
    export function hurtTips(target:any, offset:number = 50) {
        target.alpha = 0;

        var step1:Function = function() {
            egret.Tween.get(target).to({alpha:0},200);
        }
        egret.Tween.get(target).to({y:target.y - offset,alpha:1},400,egret.Ease.backOut).call(step1);
    }

    //淡出
    export function fadeOut(target:any, time:number = 500, func:Function = null, completeFunc:Function = null):void {
        target.alpha = 0;
        egret.Tween.get(target).to({ alpha: 1.0 }, time, egret.Ease.circOut).call(()=>{
            if (completeFunc) {
                completeFunc();
            }
        });
        if (func) {
            func();
        }
    }
    /**淡入 */
    export function fadeIn(target:any, time:number = 500, func:Function = null):void {
        target.alpha = 1.0;
        egret.Tween.get(target).to({ alpha: 0 }, time, egret.Ease.circIn).call(()=>{
            if (func) {
                func();
            }
        });
    }

    //淡出淡入
    export function fadeOutIn(target:any, outTime:number = 200, inTime:number = 200, delay:number = 0, func:Function = null, thisobj:any = null):void {
        egret.Tween.get(target).to({ alpha: 1.0 }, outTime, egret.Ease.quintOut)
        egret.setTimeout(function () {
            egret.Tween.get(target).to({ alpha: 0 }, inTime, egret.Ease.quintIn).call(()=>{
                if (func) {
                    func(thisobj);
                }
            })
        }, this, delay);
    }
}