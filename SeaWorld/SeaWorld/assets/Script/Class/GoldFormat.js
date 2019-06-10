
var GoldFormat = {

    showGold(a) {
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

    show(a) {
        if (!a) {
            return '';
        }
        if (typeof (a) == 'number') {
            if (a < 1000) {
                return a;
            }
            a = this.format(a);
        }
        let keys = Object.keys(a);
        keys.sort((a, b) => {
            return parseInt(b) - parseInt(a);
        });
        var zimu = GameConfig.ZiMu[keys[0] - 1];
        zimu = zimu ? zimu : '';
        if (keys.length <= 1) {
            return a[0];
        }
        if (a[keys[0]] >= 100) {
            return a[keys[0]] + zimu;
        } else {
            var price = ((a[keys[0]] * 1000 + a[keys[1]]) / 1000).toString();
            return price.slice(0, 4) + zimu;
        }
    },

    format(a) {
        if (typeof (a) == 'object') {
            return a;
        }
        a = parseInt(a);
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
        a = GameTools.copyOb(a);
        b = GameTools.copyOb(b);
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
        // console.log('add-------->' + JSON.stringify(a));
        return a;
    },

    /**
     * 乘法
     * @param {*} a 
     * @param {*} b 
     */
    multiply(a, b) {
        a = GameTools.copyOb(a);
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
        // console.log('GoldFormat------multiply-------->' + JSON.stringify(a));
        return a;
    },

    /**
     * 减法
     * @param {*} a 
     * @param {*} b 
     */
    minus(a, b) {
        a = GameTools.copyOb(a);
        b = GameTools.copyOb(b);
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
            } else {
                if (a[key] < 0) {
                    a[key] = a[key] + 1000;
                    a[(parseInt(key) + 1) + '']--;
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
                        a[key] = parseInt(a[key]);
                    } else {
                        var x = value + '';
                        var b = x.split(".");
                        var y = parseInt(b[1]);
                        a[key] = parseInt(b[0]);
                        a[key - 1] += y * 100;
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
        cc.log('GoldFormat:pow=>parmas=>a:' + a + ' b:' + b);
        var num = a;
        if (typeof (num) == 'number') {
            num = this.format(num);
        }
        for (let i = 0; i < b - 1; i++) {
            num = this.multiply(num, a);
        }
        cc.log('GoldFormat:pow=>result=>' + JSON.stringify(num));
        return num;
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
}

module.exports = GoldFormat;