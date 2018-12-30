// 游戏状态
enum EGameState
{
    Ready = 0,
    Start,
    Pause,
    Again,
    End,
}

enum EGamePauseState
{
    Continue = 1,
    Again,
    Return,
}

// 游戏面板动画
enum EPanelAnimation
{
    None = 0,
    CenterSlight = 1,
    CenterViolent = 2,
    LeftToRight = 3,
    RightToLeft = 4,
    UpToDown = 5,
    DownToUp = 6,
    CenterZoomOut = 7,
}

// 怪物的状态
enum EMonsterState
{
    Ready = 0,
    Run = 1,
    FallDown = 2,
    Dead = 3,
    Stop = 4,
    Drown,
}

// 手势难度
enum EGestureDifficult
{
    Mix = 0,
    Normal,
    Hard,
}

// 怪物的类型
enum EMonsterType {
    FallDown = 1,   // 下落
    Float,          // 浮空
}

// 特效的类型
enum EEffectType {
    Fire = 1,
    Ice,
    Thunder,
    ChangeGesture,
}

enum ELevelType
{
    Normal = 1,
    Elite,
    Boss,
    End,
}