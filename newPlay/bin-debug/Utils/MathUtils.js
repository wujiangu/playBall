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
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    function getAngle(radian) {
        return 180 * radian / Math.PI;
    }
    MathUtils.getAngle = getAngle;
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    function getRadian(angle) {
        return angle / 180 * Math.PI;
    }
    MathUtils.getRadian = getRadian;
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
        var temp = InvSqrt(disQ);
        var dis = 1 / temp;
        return Math.floor(dis);
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
    /**
     * 平方根倒数
     */
    function InvSqrt(n, precision) {
        if (precision === void 0) { precision = 1; }
        var y = new Float32Array(1);
        var i = new Int32Array(y.buffer);
        y[0] = n;
        i[0] = 0x5f375a86 - (i[0] >> 1);
        for (var iter = 0; iter < precision; iter++) {
            y[0] = y[0] * (1.5 - ((n * 0.5) * y[0] * y[0]));
        }
        return y[0];
    }
    MathUtils.InvSqrt = InvSqrt;
})(MathUtils || (MathUtils = {}));
//# sourceMappingURL=MathUtils.js.map