/**
 * 支持-命名空间 字符串
 * 支持-过期时间 支持 m分钟 h小时 d天的时间格式, 如果直接传入数字格式 默认为 h, 不传或者格式不对默认永久
 * 支持-监听当前页面 localStorage 发生变化时的回调
 */
 class commonStorage {
    constructor(namespace) {
        this.namespace = namespace || '';
    }
    // 规范化数据
    normalize(val, time) {
        return JSON.stringify({
            val,
            time: this.getTime(time)
        })
    }
    // 检查时间格式是否正确
    getTime(time) {
        const reg = /^\d+[mhd]*$/;
        if (!reg.test(time)) {
            return 0;
        } else {
            const currentTime = new Date().getTime()
            const timeout = `${time}`.replace(/^(\d+)(m|h|d)*$/,()=> {
                const unit = RegExp.$2 || 'h'; // 时间单位
                const duration = Number(RegExp.$1) || 0; // 时长
                let val = 0;
                switch(unit) {
                    case 'm':
                        val = currentTime + duration * 60 * 1000
                        break;
                    case 'h':
                        val = currentTime + duration * 60 * 60 * 1000
                        break;
                    case 'd':
                        val = currentTime + duration * 24 * 60 * 60 * 1000
                        break;        
                }
                return val;
            })
            return Number(timeout);
        }
    }
    // 获取返回的数据
    getReturnVal(key, val) {
        let data = this.getStorageVal(val); // 获取缓存的值
        if (data && data.time && data.time < new Date().getTime()) { // 存在过期时间,且已经过期返回null,并删除
            data = null;
            this.removeItem(key)
        }
        return data
    }
    // 获取正确的缓存数据
    getStorageVal(val) {
        try {
            let data = JSON.parse(val);
            if (typeof data === 'object') {
                return data.val;
            } else {
                return val;
            }
        } catch(e) {
            return val;
        }
    }
    // 设置值
    setItem (key, val, time) {
        const namespace = this.namespace;
        key = `${namespace ? `${namespace}-${key}` : key}`;
        // 触发自定义事件
        const myEvent = new CustomEvent("changeStorage", { detail: { key, val, time} })
        document.dispatchEvent(myEvent)
        return localStorage.setItem(key, this.normalize(val, time));
    }
    // 获取值
    getItem (key) {
        const namespace = this.namespace;
        key = `${namespace ? `${namespace}-${key}` : key}`;
        return this.getReturnVal(key, localStorage.getItem(key));
    }

    // 清空 存在命名空间时, 仅清除命名空间的缓存
    clear () {
        const namespace = this.namespace;
        if (namespace) {
            const len = localStorage.length;
            const reg = new RegExp(`^${namespace}-`)
            for (let i = 0; i < len; i++) {
                const key = localStorage.key(i);
                if (reg.test(key)) { // 匹配到命名空间开头则清空
                    localStorage.removeItem(key)
                    i--;
                }
            }
        } else {
            localStorage.clear();
        }
    }

    // 移除
    removeItem (key) {
        const namespace = this.namespace;
        key = `${namespace ? `${namespace}-${key}` : key}`;
        return localStorage.removeItem(key);
    }
}

export default commonStorage;
