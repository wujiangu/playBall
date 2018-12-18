// 游戏状态
enum EGameState
{
    Ready = 0,
    Start = 1,
    End = 2,
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

// 狼的状态
enum EWolfState
{
    Ready = 0,
    Run = 1,
    FallDown = 2,
    Dead = 3,
    Stop = 4,
}

// 狼的类型
enum EWolfType
{
    Gray = 1,
    White = 2,
    Red = 3,
}

// 魔法瓶的类型
enum EBottleType
{
    Ice = 201,
    Thunder = 202,
}

// 手势难度
enum EGestureDifficult
{
    Normal = 1,
    Hard = 2,
    Magic = 0,
}

// 蝙蝠的状态
enum EBatState
{
    Revival = 1,
    Dead = 2,
}

// 盗贼的状态
enum EThiefState
{
    Revival = 1,
    Dead = 2,
}