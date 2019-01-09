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
/**
 * Armature封装类
 */
var DragonBonesArmature = (function (_super) {
    __extends(DragonBonesArmature, _super);
    function DragonBonesArmature(armatureDisplay) {
        var _this = _super.call(this) || this;
        _this._armature = armatureDisplay.armature;
        // this._clock = clock;
        _this._armatureDisplay = armatureDisplay;
        _this.addChild(_this._armatureDisplay);
        _this._frameCalls = [];
        _this._completeCalls = [];
        _this._tagetBones = [];
        return _this;
    }
    /**
     * 增加动画监听
     */
    DragonBonesArmature.prototype.addListeners = function () {
        this._armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
        this._armatureDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
    };
    /**
     * 移除动画监听
     */
    DragonBonesArmature.prototype.removeLiteners = function () {
        this._armatureDisplay.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
        this._armatureDisplay.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
    };
    /**
     * 增加动画完成函数
     */
    DragonBonesArmature.prototype.addCompleteCallFunc = function (func, target) {
        for (var i = 0; i < this._completeCalls.length; i++) {
            //判断某一动画是否已经执行过complete方法
            if ((this._completeCalls[i][0] == func) && (this._completeCalls[i][1] == target)) {
                return;
            }
        }
        this._completeCalls.push([func, target]);
    };
    /**
     * 移除一个动画完成函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    DragonBonesArmature.prototype.removeCompleteCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr = this._completeCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                this._completeCalls.splice(i, 1);
            }
        }
    };
    /**
     * 增加帧事件处理函数
     */
    DragonBonesArmature.prototype.addFrameCallFunc = function (func, target) {
        for (var i = 0; i < this._frameCalls.length; i++) {
            //判断某一动画是否已经执行过complete方法
            if ((this._frameCalls[i][0] == func) && (this._frameCalls[i][1] == target)) {
                return;
            }
        }
        this._frameCalls.push([func, target]);
    };
    /**
     * 移除帧事件处理函数
     */
    DragonBonesArmature.prototype.removeFrameCallFunc = function (func, target) {
        for (var i = 0; i < this._frameCalls.length; i++) {
            //判断某一动画是否已经执行过complete方法
            if ((this._frameCalls[i][0] == func) && (this._frameCalls[i][1] == target)) {
                this._frameCalls.splice(i, 1);
            }
        }
    };
    /**
     * 获取bone
     */
    DragonBonesArmature.prototype.getBone = function (boneName, target) {
        for (var i = 0; i < this._tagetBones.length; i++) {
            if ((this._tagetBones[i][0] == boneName) && (this._tagetBones[i][1] == target)) {
                return null;
            }
        }
        this._tagetBones.push([boneName, target]);
        return this._armature.getBone(boneName);
    };
    /**
     * 事件完成执行函数
     */
    DragonBonesArmature.prototype.onComplete = function (event) {
        // let animationName:string = event.animationName;
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr = this._completeCalls[i];
            arr[0].call(arr[1]);
        }
    };
    /**
     * 帧事件处理函数
     */
    DragonBonesArmature.prototype.onFrame = function (event) {
        // let animationName:string = event.frameLabel;
        for (var i = 0; i < this._frameCalls.length; i++) {
            var arr = this._frameCalls[i];
            arr[0].call(arr[1], event);
        }
    };
    DragonBonesArmature.prototype.getSlots = function () {
        return this._armature.getSlots();
    };
    DragonBonesArmature.prototype.getSlot = function (name) {
        return this._armature.getSlot(name);
    };
    /**
     * 播放动画
     */
    DragonBonesArmature.prototype.play = function (action, playTimes, timeScale) {
        if (playTimes === void 0) { playTimes = undefined; }
        if (timeScale === void 0) { timeScale = 1; }
        this.start();
        if (playTimes == undefined) {
            this._armatureDisplay.animation.play(action).timeScale = timeScale;
        }
        else {
            this._armatureDisplay.animation.play(action, playTimes).timeScale = timeScale;
        }
    };
    /**
     * 从指定帧开始播放动画
     */
    DragonBonesArmature.prototype.playByFrame = function (action, frame, playTimes, timeScale) {
        if (timeScale === void 0) { timeScale = 1; }
        this.start();
        if (playTimes == undefined) {
            this._armatureDisplay.animation.gotoAndPlayByFrame(action, frame).timeScale = timeScale;
        }
        else {
            this._armatureDisplay.animation.gotoAndPlayByFrame(action, frame, playTimes).timeScale = timeScale;
        }
    };
    /**
     * 淡入播放动画
     */
    DragonBonesArmature.prototype.fadeIn = function (animationName, fadeInTime, playTimes, layer, group) {
        this._armatureDisplay.animation.fadeIn(animationName, fadeInTime, playTimes, layer, group, 2 /* SameGroup */);
    };
    /**
     * 暂停播放动画
     */
    DragonBonesArmature.prototype.pause = function (action) {
        this._armatureDisplay.animation.stop(action);
    };
    /**
     * 设置动画的播放速度
     */
    DragonBonesArmature.prototype.setTimeScale = function (action, value) {
        this._armatureDisplay.animation.play(action).timeScale = value;
    };
    /**
     * 设置骨骼的播放速度
     */
    DragonBonesArmature.prototype.setDBTimeScale = function (value) {
        this._armatureDisplay.animation.timeScale = value;
    };
    /**
     * 播放到指定帧结束
     */
    DragonBonesArmature.prototype.stopByFrame = function (action, frame) {
        this.start();
        this._armature.animation.gotoAndStopByProgress(action, frame);
    };
    /**
     * 混合动画
     */
    DragonBonesArmature.prototype.playMuti = function (actions, id, playTimes) {
        if (playTimes === void 0) { playTimes = null; }
        this.start();
        for (var i = 0; i < actions.length; i++) {
            // this._armature.animation.fadeIn(actions[i], 0, 0, 0, `Group${id[i]}`, dragonBones.AnimationFadeOutMode.SameLayerAndGroup);
        }
    };
    /**
     * 不淡出动画
     */
    DragonBonesArmature.prototype.fadeOut = function (action) {
        var animationState = this._armatureDisplay.animation.getState(action);
        animationState.fadeOut(0, false);
    };
    /**
     * 获取状态
     */
    DragonBonesArmature.prototype.getState = function (action) {
        return this._armatureDisplay.animation.getState(action);
    };
    /**
     * 开始播放
     */
    DragonBonesArmature.prototype.start = function () {
        // this._clock.add(this._armature);
        this.addListeners();
    };
    /**
     * 停止播放
     */
    DragonBonesArmature.prototype.stop = function () {
        // this._clock.remove(this._armature);
        this.removeLiteners();
    };
    DragonBonesArmature.prototype.removeArmatureDisplay = function () {
        this.removeLiteners();
        if (this._armatureDisplay != null) {
            this.removeChild(this._armatureDisplay);
        }
        this._armatureDisplay = null;
    };
    Object.defineProperty(DragonBonesArmature.prototype, "Armature", {
        get: function () {
            return this._armature;
        },
        set: function (value) {
            this._armature = value;
            // this._armatureDisplay = this._armature.display
            // this.addChild(this._armatureDisplay)
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragonBonesArmature.prototype, "ArmatureDisplay", {
        get: function () {
            return this._armatureDisplay;
        },
        set: function (value) {
            this._armatureDisplay = value;
            this._armature = value.armature;
            this.addChild(this._armatureDisplay);
        },
        enumerable: true,
        configurable: true
    });
    return DragonBonesArmature;
}(egret.DisplayObjectContainer));
__reflect(DragonBonesArmature.prototype, "DragonBonesArmature");
//# sourceMappingURL=DragonBonesArmature.js.map