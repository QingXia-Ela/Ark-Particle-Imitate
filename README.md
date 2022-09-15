# Ark-Particle-Imitate

## 前言

原生 js 模仿明日方舟官网粒子效果

**但是性能很差，我也不太会优化，个人更推荐使用 WEBGL 进行这种效果制作**

如果没人做的话我以后可能会抽时间出来做（先画饼吧）

本项目仅供学习和娱乐，未来可能不怎么更新，大家当乐子看就好

项目有 ts 声明文件和中文注释，可以配合 vscode 智能提示进行使用

## 使用方法

参考 `js/index.js` 下的文件

实例创建后的可调用方法：
```js
const canvas = document.getElementById('akCanvas')
/** 初始化实例 */
let demo = new DameDaneParticle(canvas,{
  src: './image/test.png',
  w: 360
})

/** 修改图片 */
demo.ChangeImg('./image/island.png',{
  renderX: 300,
  w: 200,
  effectParticleMode: 'adsorption',
  Drag: 0.95
})

/** 粒子散开 / 聚合状态切换 */
demo.ParticlePolymerize()

const tip = () => { console.log('destory') }

/** 预销毁实例 */
demo.PreDestory(tip)
/** 销毁 */
demo = null
```