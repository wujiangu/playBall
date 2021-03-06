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
    //打开游戏失败面板
    MainNotify.openGameLosePanel = "openGameLosePanel";
    //关闭游戏失败面板
    MainNotify.closeGameLosePanel = "closeGameLosePanel";
    //打开选择重新开始或返回主界面面板
    MainNotify.openChooseOperationPanel = "openChooseOperationPanel";
    //关闭选择重新开始或返回主界面面板
    MainNotify.closeChooseOperationPanel = "closeChooseOperationPanel";
    //打开购买确认界面
    MainNotify.openBuyConfirmPanel = "openBuyConfirmPanel";
    //关闭购买确认界面
    MainNotify.closeBuyConfirmPanel = "closeBuyConfirmPanel";
    //手势识别
    MainNotify.gestureAction = "gestureAction";
    //开始画曲线轨迹
    MainNotify.beginLocus = "beginLocus";
    //结束画曲线轨迹
    MainNotify.endLocus = "endLocus";
    //更新界面糖果数量
    MainNotify.updateCandy = "updateCandy";
    //设置面板
    MainNotify.openSettingPanel = "openSettingPanel";
    MainNotify.closeSettingPanel = "closeSettingPanel";
    //暂停
    MainNotify.openGamePausePanel = "openGamePausePanel";
    MainNotify.closeGamePausePanel = "closeGamePausePanel";
    MainNotify.openActorListPanel = "openActorListPanel";
    MainNotify.closeActorListPanel = "closeActorListPanel";
    MainNotify.openGameSelectLevel = "openGameSelectLevel";
    MainNotify.closeGameSelectLevel = "closeGameSelectLevel";
    MainNotify.openRechargePanel = "openRechargePanel";
    MainNotify.closeRechargePanel = "closeRechargePanel";
    MainNotify.openSignPanel = "openSignPanel";
    MainNotify.closeSignPanel = "closeSignPanel";
    // 扭蛋界面
    MainNotify.openCapsulePanel = "openCapsulePanel";
    MainNotify.closeCapsulePanel = "closeCapsulePanel";
    MainNotify.openGetRewardPanel = "openGetRewardPanel";
    MainNotify.closeGetRewardPanel = "closeGetRewardPanel";
})(MainNotify || (MainNotify = {}));
//# sourceMappingURL=MainNotify.js.map