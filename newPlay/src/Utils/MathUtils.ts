/**
 * 数学计算相关
 */
namespace MathUtils {
    /**获取从n~m之间的随机数 */
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
        return Math.floor(disQ);
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
}