// 游戏状态
var EGameState;
(function (EGameState) {
    EGameState[EGameState["Ready"] = 0] = "Ready";
    EGameState[EGameState["Start"] = 1] = "Start";
    EGameState[EGameState["Pause"] = 2] = "Pause";
    EGameState[EGameState["Again"] = 3] = "Again";
    EGameState[EGameState["End"] = 4] = "End";
    EGameState[EGameState["StageBack"] = 5] = "StageBack";
    EGameState[EGameState["StageFront"] = 6] = "StageFront";
    EGameState[EGameState["Warning"] = 7] = "Warning";
    EGameState[EGameState["EndLevel"] = 8] = "EndLevel";
})(EGameState || (EGameState = {}));
var EGamePauseState;
(function (EGamePauseState) {
    EGamePauseState[EGamePauseState["Continue"] = 1] = "Continue";
    EGamePauseState[EGamePauseState["Again"] = 2] = "Again";
    EGamePauseState[EGamePauseState["Return"] = 3] = "Return";
})(EGamePauseState || (EGamePauseState = {}));
// 游戏面板动画
var EPanelAnimation;
(function (EPanelAnimation) {
    EPanelAnimation[EPanelAnimation["None"] = 0] = "None";
    EPanelAnimation[EPanelAnimation["CenterSlight"] = 1] = "CenterSlight";
    EPanelAnimation[EPanelAnimation["CenterViolent"] = 2] = "CenterViolent";
    EPanelAnimation[EPanelAnimation["LeftToRight"] = 3] = "LeftToRight";
    EPanelAnimation[EPanelAnimation["RightToLeft"] = 4] = "RightToLeft";
    EPanelAnimation[EPanelAnimation["UpToDown"] = 5] = "UpToDown";
    EPanelAnimation[EPanelAnimation["DownToUp"] = 6] = "DownToUp";
    EPanelAnimation[EPanelAnimation["CenterZoomOut"] = 7] = "CenterZoomOut";
})(EPanelAnimation || (EPanelAnimation = {}));
// 宝宝状态
var EBabyState;
(function (EBabyState) {
    EBabyState[EBabyState["Idle"] = 0] = "Idle";
    EBabyState[EBabyState["Run"] = 1] = "Run";
    EBabyState[EBabyState["Attack"] = 2] = "Attack";
    EBabyState[EBabyState["Tired"] = 3] = "Tired";
})(EBabyState || (EBabyState = {}));
// 宝宝技能释放方式
var ESkillReleaseType;
(function (ESkillReleaseType) {
    ESkillReleaseType[ESkillReleaseType["Immediately"] = 1] = "Immediately";
    ESkillReleaseType[ESkillReleaseType["Range"] = 2] = "Range";
})(ESkillReleaseType || (ESkillReleaseType = {}));
// 技能效果
var ESkillResult;
(function (ESkillResult) {
    ESkillResult[ESkillResult["Invalid"] = 0] = "Invalid";
    ESkillResult[ESkillResult["Kill"] = 1] = "Kill";
    ESkillResult[ESkillResult["ContinuedKill"] = 2] = "ContinuedKill";
    ESkillResult[ESkillResult["GestureChange"] = 3] = "GestureChange";
    ESkillResult[ESkillResult["SlowSpeed"] = 4] = "SlowSpeed";
    ESkillResult[ESkillResult["StopSpeed"] = 5] = "StopSpeed";
    ESkillResult[ESkillResult["ChangeLucky"] = 6] = "ChangeLucky";
})(ESkillResult || (ESkillResult = {}));
// 技能挂载
var ESkillHand;
(function (ESkillHand) {
    ESkillHand[ESkillHand["Monster"] = 1] = "Monster";
    ESkillHand[ESkillHand["Ballon"] = 2] = "Ballon";
})(ESkillHand || (ESkillHand = {}));
// 技能范围类型
var ESkillRange;
(function (ESkillRange) {
    ESkillRange[ESkillRange["Random"] = 1] = "Random";
    ESkillRange[ESkillRange["FrontToBack"] = 2] = "FrontToBack";
    ESkillRange[ESkillRange["All"] = 3] = "All";
})(ESkillRange || (ESkillRange = {}));
// 游戏模式
var EBattleMode;
(function (EBattleMode) {
    EBattleMode[EBattleMode["Level"] = 1] = "Level";
    EBattleMode[EBattleMode["Endless"] = 2] = "Endless";
    EBattleMode[EBattleMode["Timelimite"] = 3] = "Timelimite";
})(EBattleMode || (EBattleMode = {}));
// 怪物的状态
var EMonsterState;
(function (EMonsterState) {
    EMonsterState[EMonsterState["Ready"] = 0] = "Ready";
    EMonsterState[EMonsterState["Run"] = 1] = "Run";
    EMonsterState[EMonsterState["FallDown"] = 2] = "FallDown";
    EMonsterState[EMonsterState["Dead"] = 3] = "Dead";
    EMonsterState[EMonsterState["Stop"] = 4] = "Stop";
    EMonsterState[EMonsterState["Drown"] = 5] = "Drown";
    EMonsterState[EMonsterState["Summon"] = 6] = "Summon";
    EMonsterState[EMonsterState["SummonFinish"] = 7] = "SummonFinish";
    EMonsterState[EMonsterState["Attack"] = 8] = "Attack";
    EMonsterState[EMonsterState["Arrive"] = 9] = "Arrive";
    EMonsterState[EMonsterState["Move"] = 10] = "Move";
    EMonsterState[EMonsterState["Hurt"] = 11] = "Hurt";
})(EMonsterState || (EMonsterState = {}));
// 手势难度
var EGestureDifficult;
(function (EGestureDifficult) {
    EGestureDifficult[EGestureDifficult["Mix"] = 0] = "Mix";
    EGestureDifficult[EGestureDifficult["Normal"] = 1] = "Normal";
    EGestureDifficult[EGestureDifficult["Hard"] = 2] = "Hard";
    EGestureDifficult[EGestureDifficult["NAndH"] = 3] = "NAndH";
    EGestureDifficult[EGestureDifficult["NAndHH"] = 4] = "NAndHH";
    EGestureDifficult[EGestureDifficult["NNAndH"] = 5] = "NNAndH";
})(EGestureDifficult || (EGestureDifficult = {}));
// 怪物的类型
var EMonsterType;
(function (EMonsterType) {
    EMonsterType[EMonsterType["FallDown"] = 1] = "FallDown";
    EMonsterType[EMonsterType["Float"] = 2] = "Float";
})(EMonsterType || (EMonsterType = {}));
var EMonsterDifficult;
(function (EMonsterDifficult) {
    EMonsterDifficult[EMonsterDifficult["Normal"] = 1] = "Normal";
    EMonsterDifficult[EMonsterDifficult["Elite"] = 2] = "Elite";
    EMonsterDifficult[EMonsterDifficult["BOSS"] = 3] = "BOSS";
    EMonsterDifficult[EMonsterDifficult["Summon"] = 4] = "Summon";
})(EMonsterDifficult || (EMonsterDifficult = {}));
// 召唤物类型
var ESummonType;
(function (ESummonType) {
    ESummonType[ESummonType["Balloon"] = 1] = "Balloon";
    ESummonType[ESummonType["Monster"] = 2] = "Monster";
})(ESummonType || (ESummonType = {}));
// 怪物的位置
var EMonsterPos;
(function (EMonsterPos) {
    EMonsterPos[EMonsterPos["Left"] = 1] = "Left";
    EMonsterPos[EMonsterPos["Middle"] = 2] = "Middle";
    EMonsterPos[EMonsterPos["Right"] = 3] = "Right";
})(EMonsterPos || (EMonsterPos = {}));
// 特效的类型
var EEffectType;
(function (EEffectType) {
    EEffectType[EEffectType["Fire"] = 1] = "Fire";
    EEffectType[EEffectType["Ice"] = 2] = "Ice";
    EEffectType[EEffectType["Thunder"] = 3] = "Thunder";
    EEffectType[EEffectType["ChangeGesture"] = 4] = "ChangeGesture";
})(EEffectType || (EEffectType = {}));
var ELevelType;
(function (ELevelType) {
    ELevelType[ELevelType["Normal"] = 1] = "Normal";
    ELevelType[ELevelType["EliteWarning"] = 2] = "EliteWarning";
    ELevelType[ELevelType["Elite"] = 3] = "Elite";
    ELevelType[ELevelType["Boss"] = 4] = "Boss";
    ELevelType[ELevelType["End"] = 5] = "End";
})(ELevelType || (ELevelType = {}));
//# sourceMappingURL=GameEnum.js.map