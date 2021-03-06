// 游戏状态
enum EGameState
{
    Ready = 0,
    Start,
    Pause,
    Again,
    End,
    StageBack,
    StageFront,
    Warning,
    EndLevel,
}

enum EGamePauseState
{
    Continue = 1,
    Again,
    Return,
}

// 面板切换状态
enum EPanelState
{
    EnterLevelSelect = 1,
    EnterBabyList,
    EnterBattle,
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

// 宝宝状态
enum EBabyState
{
    Idle = 0,
    Run,
    Attack,
    Tired,
}

// 宝宝技能释放方式
enum ESkillReleaseType
{
    Immediately = 1,
    Range,
}

// 技能效果
enum ESkillResult
{
    Invalid = 0,
    Kill,
    ContinuedKill,
    GestureChange,
    SlowSpeed,
    StopSpeed,
    ChangeLucky,
    ExtraCandy,
    ExtraCombo,
    ExtraScore,
}

// 额外加成
enum EExtraType
{
    Plus = 1,
    Mul
}

// 技能挂载
enum ESkillHand
{
    Monster = 1,
    Ballon,
}

// 技能范围类型
enum ESkillRange
{
    Random = 1,
    FrontToBack,
    All,
}

// 游戏模式
enum EBattleMode
{
    Level = 1,
    Endless,
    Timelimite,
}

// 怪物的状态
enum EMonsterState
{
    Ready = 0,
    Run,
    FallDown,
    Dead,
    Stop,
    Drown,
    Summon,
    SummonFinish,
    Attack,
    Arrive,
    Move,
    Hurt,
}

// 手势难度
enum EGestureDifficult
{
    Easy = -1,          // 全部超简单
    Mix = 0,            // 混合随机
    Normal,             // 全部简单
    Center,             // 全部等
    Hard,               // 全部难
    NAndH,              // 一个简单一个复杂
    NAndHH,             // 一个简单两个复杂
    NNAndH,             // 两个简单一个复杂
}

// 怪物的类型
enum EMonsterType {
    FallDown = 1,   // 下落
    Float,          // 浮空
}

enum EMonsterDifficult
{
    Normal = 1,
    Elite,
    SpecialElite1,
    SpecialElite2,
    BOSS,
    Summon,
}

// 召唤物类型
enum ESummonType
{
    Balloon = 1,
    Monster
}

// 怪物的位置
enum EMonsterPos
{
    Left = 1,
    Middle,
    Right,
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
    EliteWarning,
    Elite,
    Boss,
    End,
}

/**签到奖励类型 */
enum EReward
{
    Candy = 1,
    AssignBaby,
    GreenBaby,
    BlueBaby,
    PurpleBaby,
}

/**抽奖奖励类型 */
enum ECapsule
{
    Candy = 1,
    GreenBaby,
    BlueBaby,
    PurpleBaby,
}

/**宝宝品质 */
enum EBabyQuality
{
    Green = 1,
    Blue,
    Purple,
}

/**关卡奖励条件 */
enum ELevelRewardCondition
{
    Finish = 1,
    EnoughScore,
    EnoughCombo,
    OnesFinish,
    RepeatFinish,
}