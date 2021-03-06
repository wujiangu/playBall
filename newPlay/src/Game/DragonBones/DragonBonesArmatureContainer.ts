/**
 * DragonBonesArmature容器类，用于一个动画需要多个DragonBonesArmature的情况
 */
class DragonBonesArmatureContainer extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this._armatures = new Array<DragonBonesArmature>();
        this._actions = {};
        this._bones = {};
    }

    public get_armatures() {
        return this._armatures;
    }

    /**
     * 注册需要的DragonBonesArmature
     */
    public register(dragonBonesArmature:DragonBonesArmature, _actions:Array<string>):void {
        this._armatures.push(dragonBonesArmature);
        for (let i = 0; i < _actions.length; i++) {
            this._actions[_actions[i]] = this._armatures.length - 1;
        }
    }

    /**
     * 清除DragonBonesArmature
     */
    public clear() {
        while(this._armatures.length > 0) {
            let armature = this._armatures.pop()
            armature.removeArmatureDisplay()
        }
        this._actions = {}
        this._bones = {}
    }

    /**
     * 增加动画完成的监听函数
     */
    public addCompleteCallFunc(func:Function, target:any) {
        for (let i = 0; i < this._armatures.length; i++) {
            let armature:DragonBonesArmature = this._armatures[i];
            armature.addCompleteCallFunc(func, target);
        }
    }

    /**
     * 移除播放完成处理函数
     * @param callFunc
     * @param target
     */
    public removeCompleteCallFunc(func:Function, target:any):void {
        for (var i = 0; i < this._armatures.length; i++) {
            var arm:DragonBonesArmature = this._armatures[i];
            arm.removeCompleteCallFunc(func, target);
        }
    }

    /**
     * 增加帧事件处理函数
     */
    public addFrameCallFunc(func:Function, target:any) {
        for (let i = 0; i < this._armatures.length; i++) {
            let armature:DragonBonesArmature = this._armatures[i];
            armature.addFrameCallFunc(func, target);
        }
    }

    /**
     * 移除帧事件处理函数
     */
    public removeFrameCallFunc(func:Function, target:any) {
        for (let i = 0; i < this._armatures.length; i++) {
            let armature:DragonBonesArmature = this._armatures[i];
            armature.removeFrameCallFunc(func, target);
        }
    }

    /**
     * 获取Bone
     */
    public getBone(skeletonName:string, boneName:string, target:any):dragonBones.Bone {
        let name:string = skeletonName + boneName;
        if (!this._bones[name]) {
            for (let i = 0; i < this._armatures.length; i++) {
                let armature:DragonBonesArmature = this._armatures[i];
                let bone:dragonBones.Bone = armature.getBone(boneName, target);
                if (bone != null) {
                    this._bones[name] = bone;
                    break;
                }
            }
        }
        return this._bones[name];
    }

    public getSlots() {
        this._armatures[0].getSlots()
    }

    public getState(action:string):dragonBones.AnimationState {
       if (this._actions[action] == null) {
            Common.log("不存在动作---->"+action+typeof(action));
            return;
        }
        let newArmatureIndex:number = this._actions[action];
        let newArmature:DragonBonesArmature = this._armatures[newArmatureIndex];
        if (newArmature) {
            this._curArmatureIndex = newArmatureIndex;
            return newArmature.getState(action);
        }
        return null;
    }

    /**
     * 播放动作
     */
    public play(action:string, playTimes:number = undefined, type:number = 1, frame:number = null, timeScale:number = 1):void {
        if (this._actions[action] == null) {
            Common.log("play不存在动作---->"+action);
            return;
        }
        let newArmatureIndex:number = this._actions[action];
        if (newArmatureIndex != this._curArmatureIndex) {
            this.remove()
        }

        let newArmature:DragonBonesArmature = this._armatures[newArmatureIndex];
        if (newArmature) {
            this.addChild(newArmature);
            this._curArmatureIndex = newArmatureIndex;
            if (type == 1) {
                newArmature.play(action, playTimes, timeScale);
            }else{
                newArmature.playByFrame(action, frame, playTimes, timeScale);
            }
        }
    }

    /**
     * 设置动画的播放速度
     */
    public setTimeScale(action:string, value:number) {
        if (this._actions[action] == null) {
            Common.log("不存在动作---->"+action+typeof(action));
            return;
        }
        let newArmatureIndex:number = this._actions[action];
        if (newArmatureIndex != this._curArmatureIndex) {
            this.remove()
        }

        let newArmature:DragonBonesArmature = this._armatures[newArmatureIndex];
        if (newArmature) {
            this.addChild(newArmature);
            this._curArmatureIndex = newArmatureIndex;
            newArmature.setTimeScale(action, value);
        }
    }

    public setDBTimeScale(value:number) {

    }

    public fadeIn(action:string, fadeInTime:number, playTimes:number, layer:number, group:string) {
         if (this._actions[action] == null) {
            return;
        }
        let newArmatureIndex:number = this._actions[action];
        if (newArmatureIndex != this._curArmatureIndex) {
            this.remove()
        }

        let newArmature:DragonBonesArmature = this._armatures[newArmatureIndex];
        if (newArmature) {
            this.addChild(newArmature);
            this._curArmatureIndex = newArmatureIndex;
            newArmature.fadeIn(action, fadeInTime, playTimes, layer, group);
        }
    }


    /**
     * 暂停
     */
    public pause(action:string):void {
        var currArm:DragonBonesArmature = this._armatures[this._curArmatureIndex];
        if (currArm) {
            currArm.pause(action);
        }
    }

    /**
     * 停止当前DragonBonesArmature
     */
    public stop():void {
        var currArm:DragonBonesArmature = this._armatures[this._curArmatureIndex];
        if (currArm) {
            currArm.stop();
        }
    }

    /**
     * 停止当前动画到指定帧
     */
    public stopByFrame(action:string, frame:number):void {
        var currArm:DragonBonesArmature = this._armatures[this._curArmatureIndex];
        if (currArm) {
            currArm.stopByFrame(action, frame);
        }else{
            let newArmatureIndex:number = this._actions[action]
            currArm = this._armatures[newArmatureIndex]
            currArm.stopByFrame(action, frame)
        }
    }

    /**
     * 移除上一个DragonArmature
     */
    public remove():void {
        let oldArmature:DragonBonesArmature = this._armatures[this._curArmatureIndex];
        if (oldArmature) {
            oldArmature.stop();
            oldArmature.parent.removeChild(oldArmature);
            this._curArmatureIndex = null;
        }
    }

    public set curArmatureIndex(value:number) {
        this._curArmatureIndex = value
    }

    private _armatures:Array<DragonBonesArmature>;
    private _actions:any;
    private _curArmatureIndex:number;
    private _bones:any;
}