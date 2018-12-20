// 游戏状态
var EGameState;
(function (EGameState) {
    EGameState[EGameState["Ready"] = 0] = "Ready";
    EGameState[EGameState["Start"] = 1] = "Start";
    EGameState[EGameState["Pause"] = 2] = "Pause";
    EGameState[EGameState["End"] = 3] = "End";
})(EGameState || (EGameState = {}));
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
// 怪物的状态
var EMonsterState;
(function (EMonsterState) {
    EMonsterState[EMonsterState["Ready"] = 0] = "Ready";
    EMonsterState[EMonsterState["Run"] = 1] = "Run";
    EMonsterState[EMonsterState["FallDown"] = 2] = "FallDown";
    EMonsterState[EMonsterState["Dead"] = 3] = "Dead";
    EMonsterState[EMonsterState["Stop"] = 4] = "Stop";
})(EMonsterState || (EMonsterState = {}));
// 狼的类型
var EWolfType;
(function (EWolfType) {
    EWolfType[EWolfType["Gray"] = 1] = "Gray";
    EWolfType[EWolfType["White"] = 2] = "White";
    EWolfType[EWolfType["Red"] = 3] = "Red";
})(EWolfType || (EWolfType = {}));
// 魔法瓶的类型
var EBottleType;
(function (EBottleType) {
    EBottleType[EBottleType["Ice"] = 201] = "Ice";
    EBottleType[EBottleType["Thunder"] = 202] = "Thunder";
})(EBottleType || (EBottleType = {}));
// 手势难度
var EGestureDifficult;
(function (EGestureDifficult) {
    EGestureDifficult[EGestureDifficult["Normal"] = 1] = "Normal";
    EGestureDifficult[EGestureDifficult["Hard"] = 2] = "Hard";
    EGestureDifficult[EGestureDifficult["Magic"] = 0] = "Magic";
})(EGestureDifficult || (EGestureDifficult = {}));
// 蝙蝠的状态
var EBatState;
(function (EBatState) {
    EBatState[EBatState["Revival"] = 1] = "Revival";
    EBatState[EBatState["Dead"] = 2] = "Dead";
})(EBatState || (EBatState = {}));
// 盗贼的状态
var EThiefState;
(function (EThiefState) {
    EThiefState[EThiefState["Revival"] = 1] = "Revival";
    EThiefState[EThiefState["Dead"] = 2] = "Dead";
})(EThiefState || (EThiefState = {}));
// 怪物的类型
var EMonsterType;
(function (EMonsterType) {
    EMonsterType[EMonsterType["Normal"] = 1] = "Normal";
    EMonsterType[EMonsterType["Elite"] = 2] = "Elite";
    EMonsterType[EMonsterType["Boss"] = 3] = "Boss";
})(EMonsterType || (EMonsterType = {}));
