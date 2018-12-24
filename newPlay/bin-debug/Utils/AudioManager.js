/**
 * 音乐管理类
 * @author hong
 * @date   2017/9/28
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AudioManager = (function () {
    function AudioManager() {
    }
    return AudioManager;
}());
AudioManager.balloonBoom = "resource/assets/voice/balloonBoom.mp3"; // 气球爆炸
AudioManager.begin = "resource/assets/voice/begin.mp3"; // 开始
AudioManager.bgMusic = "resource/assets/voice/bgMusic.mp3"; // 背景
AudioManager.bottleBreak = "resource/assets/voice/bottleBreak.mp3"; // 瓶子爆炸
AudioManager.bottleChange = "resource/assets/voice/bgMusic.mp3"; // 瓶子换图标
AudioManager.fallGround = "resource/assets/voice/fallGround.mp3"; // 掉落地板
AudioManager.gesture = "resource/assets/voice/gesture.mp3"; // 手势滑动
AudioManager.gold = "resource/assets/voice/gold.mp3"; // 金币洒落
AudioManager.ice = "resource/assets/voice/ice.mp3"; // 冰冻
AudioManager.potBoom = "resource/assets/voice/potBoom.mp3"; // 魔法锅爆炸
AudioManager.thief = "resource/assets/voice/thief.mp3"; // 小偷出现
AudioManager.thunder = "resource/assets/voice/thunder.mp3"; // 雷电
AudioManager.wolfFallDown = "resource/assets/voice/wolfFallDown.mp3"; // 狼掉落
__reflect(AudioManager.prototype, "AudioManager");
