// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameConfig = require('GameConfig');
cc.Class({
    extends: cc.Component,

    properties: {

        lable: cc.Label,
    },

   

    // LIFE-CYCLE CALLBACKS:

    showGold(a) {
        this.node.runAction(cc.bezierBy)
        if (typeof (a) == 'number') {
            a = this.format(a);
        }
        let keys = Object.keys(a);
        keys.sort((a, b) => {
            return parseInt(b) - parseInt(a);
        });
        var zimu = GameConfig.ZiMu[keys[0]];
        if (a[keys[0]] >= 100) {
            return a[keys[0]] + zimu;
        } else {
            var price = ((a[keys[0]] * 1000 + a[keys[1]]) / 1000) + '';
            return price.slice(0, 4) + zimu;
        }
    },

    getGold(a) {
        var keys = Object.keys(a);
        var result = ''
        for (let i = 1; i <= keys.length; i++) {
            var key = keys[keys.length - i];
            var b = a[key];
            if (i > 1) {
                if (b < 10) {
                    b = '00' + b;
                } else if (b < 100 && b >= 10) {
                    b = '0' + b;
                }
            }
            result += b;
        }
        return result;
    },

    start() {
        this.num = 0;
        this.a = { '0': 0 };
        this.b = { '0': 100, '1': 5 };
    },

    onBtnClicked() {
        // this.add(1000, 2000);
        // this.multiply(this.b, 1000);
        // this.format(12345678.1);
        // console.log(this.minus(3001, 2002));
        // console.log(this.pow(2, 10));

        console.log(Math.pow(11, 7));
        console.log(this.getGold(this.pow(11, 7)));
        console.log(this.pow(11, 7));
        console.log(this.getGold(this.multiply(this.pow(11, 7), 0.1)));
    },

    format(a) {
        a = a.toLocaleString();
        let arr = a.split(',');
        arr.reverse();
        var result = {};
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            result[i] = parseInt(element);
        }
        return result;
    },

    /**
     * 加法
     * @param {*} a 
     * @param {*} b 
     */
    add(a, b) {
        if (typeof (b) == 'number') {
            b = this.format(b);
        }
        if (typeof (a) == 'number') {
            a = this.format(a);
        }
        var keys = Object.keys(b);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (a[key]) {
                a[key] += b[key];
            } else {
                a[key] = b[key];
            }
        }
        a = this.formatNum(a);
        console.log('add-------->' + JSON.stringify(a));
        return a;
    },

    /**
     * 乘法
     * @param {*} a 
     * @param {*} b 
     */
    multiply(a, b) {
        if (typeof (a) == 'number') {
            a = this.format(a);
        }
        if (typeof (b) != 'number') {
            console.log('multiply--error--->第2个参数必须是number');
            return;
        }
        var keys = Object.keys(a);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            a[key] = this.accMul(a[key], b);
        }
        a = this.formatNum(a);
        console.log('multiply-------->' + JSON.stringify(a));
        return a;
    },

    accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) { }
        try {
            m += s2.split(".")[1].length
        } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m
        )
    },


    /**
     * 减法
     * @param {*} a 
     * @param {*} b 
     */
    minus(a, b) {
        if (typeof (b) == 'number') {
            b = this.format(b);
        }
        if (typeof (a) == 'number') {
            a = this.format(a);
        }
        if (this.compare(a, b) < 0) {
            console.log('minus--error--->第1个参数小于了第2个参数');
            return;
        }
        let keysA = Object.keys(a);
        keysA.sort((a, b) => {
            return parseInt(a) - parseInt(b);
        });
        let index = 0;
        var fn = () => {
            if (!keysA[index]) {
                return;
            }
            let key = keysA[index];
            if (b[key]) {
                if (a[key] < b[key]) {
                    a[key] = (a[key] + 1000) - b[key];
                    a[(parseInt(key) + 1) + '']--;
                } else {
                    a[key] -= b[key];
                }
            }
            index++;
            fn();
        }
        fn();
        return this.getResult(a);
    },

    /**
     * 比较大小
     * @param {*} a 
     * @param {*} b 
     */
    compare(a, b) {
        if (typeof (b) == 'number') {
            b = this.format(b);
        }
        if (typeof (a) == 'number') {
            a = this.format(a);
        }
        let keysA = Object.keys(a);
        let keysB = Object.keys(b);
        if (keysA.length > keysB.length) {
            return 1;
        } else if (keysA.length < keysB.length) {
            return -1;
        } else {
            keysA.sort((a, b) => {
                return parseInt(b) - parseInt(a)
            });
            keysB.sort((a, b) => {
                return parseInt(b) - parseInt(a)
            });
            let len = keysA.length;
            let result = 0;
            for (let i = 0; i < len; i++) {
                const key = keysA[i];
                if (a[key] > b[key]) {
                    result = 1;
                    break;
                }
                if (a[key] < b[key]) {
                    result = -1;
                    break;
                }
            }
            return result;
        }
    },

    isInt(a) {
        if (typeof (a) != 'number') {
            return false;
        }
        var y = String(a).indexOf(".") + 1;//获取小数点的位置
        if (y > 0) {
            return false;
        } else {
            return true;
        }
    },
    formatNum(a) {
        console.log('a---------------->');
        console.log(a);
        var keys = Object.keys(a);
        keys.sort((a, b) => {
            return parseInt(a) - parseInt(b)
        });
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            var value = a[key];
            if (value >= 1000) {
                let z = parseInt(value / 1000);
                let y = value - z * 1000;
                a[key] = y;
                if (keys[i + 1]) {
                    a[keys[i + 1]] += z;
                } else {
                    let key1 = (parseInt(key) + 1) + '';
                    a[key1] = z;
                    this.formatNum(a);
                    break;
                }
            } else {
                if (!this.isInt(value)) {
                    if (i == 0) {
                        // a[key] = parseInt(a[key]);
                        a[key] = a[key];
                    } else {
                        var x = value + '';
                        var b = x.split(".");
                        var y = parseInt(b[1]);
                        a[key] = parseInt(b[0]);
                        a[key - 1] += y * 100;
                        console.log('b----->' + i + '------>' + b);
                        console.log('a[key]----->' + i + '------>' + a[key]);
                        console.log('a[key-1]----->' + i + '------>' + a[key - 1]);
                        this.formatNum(a);
                        break;
                    }


                }
            }
        }
        return this.getResult(a);
    },

    getResult(a) {
        var keys = Object.keys(a);
        keys.sort((a, b) => {
            return parseInt(b) - parseInt(a)
        });
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (a[key] == 0) {
                delete a[key];
            } else {
                break;
            }
        }
        return a;
    },

    /**
     * a的b次方
     * @param {*} a 
     * @param {*} b 
     */
    pow(a, b) {
        var num = a;
        if (typeof (num) == 'number') {
            num = this.format(num);
        }
        for (let i = 0; i < b - 1; i++) {
            num = this.multiply(num, a);
        }
        return num;
    },
    // update (dt) {},
});
