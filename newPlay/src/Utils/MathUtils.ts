/**
 * 数学计算相关
 */
namespace MathUtils {
    /**获取从n~m之间的随机数
     * 没有参数(0~1) 一个参数n(0~n的整数) 两个参数m,n(m~n的整数)
     */
    export function getRandom(...args:any[]) {
        let argsLen:number = args.length;
        let random:number;
        switch (argsLen) {
            case 0:
                random = Math.random();
            break;
            case 1:
                random = Math.floor((args[0] + 1)*Math.random());
            break;
            default:
                random = Math.floor(Math.random()*(args[1]-args[0]+1) + args[0]);
            break;
        }
        return random;
    }

    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    export function getAngle(radian:number):number {
        return 180 * radian / Math.PI;
    }

    /**
     * 角度值转换为弧度制
     * @param angle
     */
    export function getRadian(angle:number):number {
        return angle / 180 * Math.PI;
    }

    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    export function getDistance(p1X:number, p1Y:number, p2X:number, p2Y:number):number {
        var disX:number = Math.round(p2X - p1X);
        var disY:number = Math.round(p2Y - p1Y);
        var disQ:number = disX * disX + disY * disY;
        var temp:number = InvSqrt(disQ);
        var dis:number = 1/temp;
        return Math.floor(dis);
    }

    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    export function getRadian2(p1X:number, p1Y:number, p2X:number, p2Y:number):number {
        var xdis:number = Math.round(p2X - p1X);
        var ydis:number = Math.round(p2Y - p1Y);
        var tmp_angle:number = Math.atan2(ydis, xdis);
        var angle = parseFloat(tmp_angle.toFixed(2));
        return angle;
    }

    /**
     * 平方根倒数
     */
    export function InvSqrt(n:number, precision:number = 1) {
        let y = new Float32Array(1);
        let i = new Int32Array(y.buffer);
        y[0] = n;
        i[0] = 0x5f375a86 - (i[0] >> 1);
        for (let iter = 0; iter < precision; iter ++) {
            y[0] = y[0] * (1.5 - ((n * 0.5) * y[0] * y[0]));
        }
        return y[0];
    }
}