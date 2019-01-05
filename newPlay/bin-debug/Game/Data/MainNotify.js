/**
  * 游戏配置文件
  * 存放游戏的配置数据
  * 比如：游戏界面尺寸、分享随机百分比、获取系统数据
  */
var MainNotify;
(function (MainNotify) {
    //打开开始游戏面板
    MainNotify.openGameStartPanel = "openGameStartPanel";
    //关闭开始游戏面板
    MainNotify.closeGameStartPanel = "closeGameStartPanel";
    //打开游戏面板
    MainNotify.openGamePanel = "openGamePanel";
    //关闭游戏面板
    MainNotify.closeGamePanel = "closeGamePanel";
    //打开游戏结束面板
    MainNotify.openGameOverPanel = "openGameOverPanel";
    //关闭游戏结束面板
    MainNotify.closeGameOverPanel = "closeGameOverPanel";
    //手势识别
    MainNotify.gestureAction = "gestureAction";
    //开始画曲线轨迹
    MainNotify.beginLocus = "beginLocus";
    //结束画曲线轨迹
    MainNotify.endLocus = "endLocus";
    //打开底部面板
    MainNotify.openBottomBtnPanel = "openBottomBtnPanel";
    MainNotify.closeBottomBtnPanel = "closeBottomBtnPanel";
    //背包面板
    MainNotify.openBackpackPanel = "openBackpackPanel";
    MainNotify.closeBackpackPanel = "closeBackpackPanel";
    //设置面板
    MainNotify.openSettingPanel = "openSettingPanel";
    MainNotify.closeSettingPanel = "closeSettingPanel";
    //暂停
    MainNotify.openGamePausePanel = "openGamePausePanel";
    MainNotify.closeGamePausePanel = "closeGamePausePanel";
})(MainNotify || (MainNotify = {}));
