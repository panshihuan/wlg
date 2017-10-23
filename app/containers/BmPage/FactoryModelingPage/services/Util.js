import Constant from './Constant';

// 工具类
export default class Util extends Constant{
    // 系统信息
    constructor () {
        super();
    }
    // uuid生成算法
    getUuid () {
        var uuid = "";
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[ i ] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[ 14 ] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[ 19 ] = hexDigits.substr((s[ 19 ] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[ 8 ] = s[ 13 ] = s[ 18 ] = s[ 23 ] = "";

        uuid = s.join("");
        return uuid;
    }


    // konva中检验两个元素是否是包含关系  源dom是否包含在target文件内
    konvaCheckContain(origin, target){
        let originRect = origin.getClientRect();
        let targetRect = target.getClientRect();
        let xPointDistant = Math.abs(originRect.x - targetRect.x);
        let yPointDistant = Math.abs(originRect.y - targetRect.y);
        let checkContain = false;

        // 判断包含 originRect的x,y等于大于targetRect的x,y 。  并且originRect的width和height要小于等于 targetRect与其中坐标的差值
        if(
            originRect.x >= targetRect.x &&
            originRect.y >= targetRect.y &&
            originRect.width <= targetRect.width - xPointDistant &&
            originRect.height <= targetRect.height - yPointDistant
        ){
            checkContain = true;
        }

        return checkContain;
    }

    // 碰撞检验  http://blog.csdn.net/u014205965/article/details/45971711
    konvaCheckCollide(origin, target){
        let originRect = origin.getClientRect();
        let targetRect = target.getClientRect();
        let collide = false;

        var t1 = originRect.y;
        var l1 = originRect.x;
        var r1 = originRect.x + originRect.width;
        var b1 = originRect.y + originRect.height;

        var t2 = targetRect.y;
        var l2 = targetRect.x;
        var r2 = targetRect.x + targetRect.width;
        var b2 = targetRect.y + targetRect.height;

        if(b1<t2 || l1>r2 || t1>b2 || r1<l2) {// 表示没碰上

        } else {
            collide = true;
        }

        return collide;
    }




}
