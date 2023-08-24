# commonstorage.js

**对本地storage的通用处理。支持 命名空间、过期时间、监听当前页面localStorage发生变化**.

## Installation

```bash
$ npm install commonstorage --save
```

## 命名空间

可通过传入命名空间，来防止localStorage被污染

```js
import commonStorage from 'commonstorage';
const namespace = 'my'; // 可传入命名空间
const storage = new commonStorage(namespace);
storage.setItem('name', '张三'); // 此时存储的key为 my-name
storage.clear(); // 此时仅会清空 my- 开头的所有localStorage, 无命名空间则清空所有
```

## 过期时间

支持传入过期时间, 来保证localStorage的有效性。time 支持 m分钟 h小时 d天的时间格式, 如果直接传入数字格式 默认为 h, 不传或者格式不对默认永久。

```js
import commonStorage from 'commonstorage';
const namespace = 'my'; // 可传入命名空间
const storage = new commonStorage(namespace);
storage.setItem('name', '张三'); // 过期时间永久
storage.setItem('name', '李四', 6); // 过期时间 6h
storage.setItem('name', '王五', '3d'); // 过期时间3天
storage.setItem('name', '老六', '3t'); // 格式错误过期时间永久
```

## 监听当前页面Storage变化
```js
import commonStorage from 'commonstorage';
const namespace = 'my'; // 可传入命名空间
const storage = new commonStorage(namespace);
// 监听变化, 可通过e.detail获取 key val time
document.addEventListener('changeStorage', (e)=> {
    console.log("发生变化", e.detail);
})
```

## Quick Start

```js
import commonStorage from 'commonstorage';
const namespace = 'my'; // 可传入命名空间
const storage = new commonStorage(namespace);
storage.setItem('name', '张三', '6d')
storage.setItem('user', JSON.stringify({age: 18}))
storage.setItem('path', {path: 'xxxxx'}, '3m')
storage.getItem('name'); // '张三'
storage.getItem('user'); // '{"age":18}'
storage.getItem('path'); // {path: 'xxxxx'}
// storage.clear(); // 清空 有命名空间时清空指定的缓存 没有的时候清空所有
// storage.removeItem('user')
```