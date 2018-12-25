/**
 * 数学计算相关
 */
var MathUtils;
(function (MathUtils) {
    /**获取从n~m之间的随机数
     * 没有参数(0~1) 一个参数n(0~n的整数) 两个参数m,n(m~n的整数)
     */
    function getRandom() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var argsLen = args.length;
        var random;
        switch (argsLen) {
            case 0:
                random = Math.random();
                break;
            case 1:
                random = Math.floor((args[0] + 1) * Math.random());
                break;
            default:
                random = Math.floor(Math.random() * (args[1] - args[0] + 1) + args[0]);
                break;
        }
        return random;
    }
    MathUtils.getRandom = getRandom;
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    function getDistance(p1X, p1Y, p2X, p2Y) {
        var disX = Math.round(p2X - p1X);
        var disY = Math.round(p2Y - p1Y);
        var disQ = disX * disX + disY * disY;
        return Math.floor(disQ);
    }
    MathUtils.getDistance = getDistance;
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    function getRadian2(p1X, p1Y, p2X, p2Y) {
        var xdis = Math.round(p2X - p1X);
        var ydis = Math.round(p2Y - p1Y);
        var tmp_angle = Math.atan2(ydis, xdis);
        var angle = parseFloat(tmp_angle.toFixed(2));
        return angle;
    }
    MathUtils.getRadian2 = getRadian2;
})(MathUtils || (MathUtils = {}));
//# sourceMappingURL=MathUtils.js.map