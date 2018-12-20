var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * DragonBonesArmature容器类，用于一个动画需要多个DragonBonesArmature的情况
 */
var DragonBonesArmatureContainer = (function (_super) {
    __extends(DragonBonesArmatureContainer, _super);
    function DragonBonesArmatureContainer() {
        var _this = _super.call(this) || this;
        _this.armatures = new Array();
        _this.actions = {};
        _this.bones = {};
        return _this;
    }
    DragonBonesArmatureContainer.prototype.getArmatures = function () {
        return this.armatures;
    };
    /**
     * 注册需要的DragonBonesArmature
     */
    DragonBonesArmatureContainer.prototype.register = function (dragonBonesArmature, actions) {
        this.armatures.push(dragonBonesArmature);
        for (var i = 0; i < actions.length; i++) {
            this.actions[actions[i]] = this.armatures.length - 1;
        }
    };
    /**
     * 清除DragonBonesArmature
     */
    DragonBonesArmatureContainer.prototype.clear = function () {
        while (this.armatures.length > 0) {
            var armature = this.armatures.pop();
            armature.removeArmatureDisplay();
        }
        this.actions = {};
        this.bones = {};
    };
    /**
     * 增加动画完成的监听函数
     */
    DragonBonesArmatureContainer.prototype.addCompleteCallFunc = function (func, target) {
        for (var i = 0; i < this.armatures.length; i++) {
            var armature = this.armatures[i];
            armature.addCompleteCallFunc(func, target);
        }
    };
    /**
     * 移除播放完成处理函数
     * @param callFunc
     * @param target
     */
    DragonBonesArmatureContainer.prototype.removeCompleteCallFunc = function (func, target) {
        for (var i = 0; i < this.armatures.length; i++) {
            var arm = this.armatures[i];
            arm.removeCompleteCallFunc(func, target);
        }
    };
    /**
     * 增加帧事件处理函数
     */
    DragonBonesArmatureContainer.prototype.addFrameCallFunc = function (func, target) {
        for (var i = 0; i < this.armatures.length; i++) {
            var armature = this.armatures[i];
            armature.addFrameCallFunc(func, target);
        }
    };
    /**
     * 获取Bone
     */
    DragonBonesArmatureContainer.prototype.getBone = function (skeletonName, boneName, target) {
        var name = skeletonName + boneName;
        if (!this.bones[name]) {
            for (var i = 0; i < this.armatures.length; i++) {
                var armature = this.armatures[i];
                var bone = armature.getBone(boneName, target);
                if (bone != null) {
                    this.bones[name] = bone;
                    break;
                }
            }
        }
        return this.bones[name];
    };
    DragonBonesArmatureContainer.prototype.getState = function (action) {
        if (this.actions[action] == null) {
            Common.log("不存在动作---->" + action + typeof (action));
            return;
        }
        var newArmatureIndex = this.actions[action];
        var newArmature = this.armatures[newArmatureIndex];
        if (newArmature) {
            this.curArmatureIndex = newArmatureIndex;
            return newArmature.getState(action);
        }
        return null;
    };
    /**
     * 播放动作
     */
    DragonBonesArmatureContainer.prototype.play = function (action, playTimes, type, frame, timeScale) {
        if (playTimes === void 0) { playTimes = undefined; }
        if (type === void 0) { type = 1; }
        if (frame === void 0) { frame = null; }
        if (timeScale === void 0) { timeScale = 1; }
        if (this.actions[action] == null) {
            Common.log("不存在动作---->" + action + typeof (action));
            return;
        }
        var newArmatureIndex = this.actions[action];
        if (newArmatureIndex != this.curArmatureIndex) {
            this.remove();
        }
        var newArmature = this.armatures[newArmatureIndex];
        if (newArmature) {
            this.addChild(newArmature);
            this.curArmatureIndex = newArmatureIndex;
            if (type == 1) {
                Common.log("播放动作---->" + action);
                newArmature.play(action, playTimes, timeScale);
            }
            else {
                newArmature.playByFrame(action, frame, playTimes, timeScale);
            }
        }
    };
    /**
     * 设置动画的播放速度
     */
    DragonBonesArmatureContainer.prototype.setTimeScale = function (action, value) {
        if (this.actions[action] == null) {
            Common.log("不存在动作---->" + action + typeof (action));
            return;
        }
        var newArmatureIndex = this.actions[action];
        if (newArmatureIndex != this.curArmatureIndex) {
            this.remove();
        }
        var newArmature = this.armatures[newArmatureIndex];
        if (newArmature) {
            this.addChild(newArmature);
            this.curArmatureIndex = newArmatureIndex;
            newArmature.setTimeScale(action, value);
        }
    };
    DragonBonesArmatureContainer.prototype.fadeIn = function (action, fadeInTime, playTimes, layer, group) {
        if (this.actions[action] == null) {
            return;
        }
        var newArmatureIndex = this.actions[action];
        if (newArmatureIndex != this.curArmatureIndex) {
            this.remove();
        }
        var newArmature = this.armatures[newArmatureIndex];
        if (newArmature) {
            this.addChild(newArmature);
            this.curArmatureIndex = newArmatureIndex;
            newArmature.fadeIn(action, fadeInTime, playTimes, layer, group);
        }
    };
    /**
     * 暂停
     */
    DragonBonesArmatureContainer.prototype.pause = function (action) {
        var currArm = this.armatures[this.curArmatureIndex];
        if (currArm) {
            currArm.pause(action);
        }
    };
    /**
     * 停止当前DragonBonesArmature
     */
    DragonBonesArmatureContainer.prototype.stop = function () {
        var currArm = this.armatures[this.curArmatureIndex];
        if (currArm) {
            currArm.stop();
        }
    };
    /**
     * 停止当前动画到指定帧
     */
    DragonBonesArmatureContainer.prototype.stopByFrame = function (action, frame) {
        var currArm = this.armatures[this.curArmatureIndex];
        if (currArm) {
            currArm.stopByFrame(action, frame);
        }
    };
    /**
     * 移除上一个DragonArmature
     */
    DragonBonesArmatureContainer.prototype.remove = function () {
        var oldArmature = this.armatures[this.curArmatureIndex];
        if (oldArmature) {
            oldArmature.stop();
            oldArmature.parent.removeChild(oldArmature);
            this.curArmatureIndex = null;
        }
    };
    Object.defineProperty(DragonBonesArmatureContainer.prototype, "CurArmatureIndex", {
        set: function (value) {
            this.curArmatureIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    return DragonBonesArmatureContainer;
}(egret.DisplayObjectContainer));
__reflect(DragonBonesArmatureContainer.prototype, "DragonBonesArmatureContainer");
