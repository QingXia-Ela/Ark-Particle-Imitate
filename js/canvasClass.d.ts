
/**
 * 每张图片的粒子设置声明
 */
interface ParticleOptions {
  /** 图片路径 */
  src: string
  /** 渲染起点 X, 默认 0 */
  renderX?: number
  /** 渲染起点 Y, 默认 0 */
  renderY?: number
  /** 粒子横竖间距 */
  spacing?: number
  /** 粒子大小, 默认 1 */
  size?: number
  /** 渲染宽度，可省略，**但建议设置为350左右，并在此基础上进行调整**，如果只设置该项则图片高度会根据宽度进行缩放 */
  w?: number
  /** 渲染高度，可省略，**设置该项时图片不会进行缩放** */
  h?: number
  /** 有效颜色区间，默认 `300 ~ 765` 为有效区间，颜色计算方式为 `R G B` 三通道值的总和 */
  validColor?: {
    /** 最小值，默认 300 */
    min?: number
    /** 最大值，默认 765 */
    max?: number
    /** 
     * 范围反向覆盖
     * 
     * 当设置范围为 `50 ~ 300` 之间时，启用此项后范围会转变成 `0 ~ 50 && 300 ~ 765` 
     */
    invert?: boolean
  }
  /** 鼠标影响的粒子半径，**设置 `effectParticleMode` 后生效**, 默认 50 */
  Thickness?: number
  /** 拖拽力度，**设置 `effectParticleMode` 后生效**, 默认 0.95 */
  Drag?: number
  /** 曲线柔和，**设置 `effectParticleMode` 后生效**, 默认 0.1 */
  Ease?: number
  /** 鼠标影响粒子行为模式，不传入则关闭影响 */
  effectParticleMode?: 'adsorption' | 'repulsion',
  /** 取消粒子动画，如果此项为 `true` 则粒子直接出现在目标位置而不是从随机位置飞来 */
  cancelParticleAnimation?: boolean
}

declare class Point {
  public orx: number
  /**
   * 点示例，**该类为内部类，不建议调用**
   * @param {number} orx 目标位置 x
   * @param {number} ory 目标位置 y 
   * @param {number} size 圆点大小
   * @param {number} colorNum rgb 加起来的总和
   * @param {HTMLCanvasElement} canvas canvas 元素
   * @param {boolean} cancelRandPlace 取消点初始化的随机点位
   */
  constructor(
    orx: number,
    ory: number,
    size: number,
    colorNum: number,
    canvas: HTMLCanvasElement,
    cancelRandPlace?: boolean
  ): void

  /**
   * 更新粒子位置信息
   * @param {boolean} ParticlePolymerizeFlag 聚合设置，默认聚合展示图片
   * @param {ParticleOptions} options 粒子设置
   * @param {number} mx 鼠标 X
   * @param {number} my 鼠标 Y
   */
  update(ParticlePolymerizeFlag?: boolean, options: ParticleOptions, mx: number, my: number): void

  /** 渲染粒子 */
  render(): void

  /**
   * 改变粒子位置
   * @param newX 粒子新的 X 位置
   * @param newY 粒子新的 Y 位置
   * @param colorVal RGB 总和
   */
  changePos(newX: number, newY: number, colorVal: number): void
}

declare class DameDaneParticle {
  /** 传入的 canvas 元素 */
  canvasEle: HTMLCanvasElement
  /** 最终图像宽度 */
  ImgW: number
  /** 最终图像高度 */
  ImgH: number
  /** 当前图像设置 */
  options: ParticleOptions

  constructor(canvas: HTMLCanvasElement,
    options: ParticleOptions,
    /** 图片加载完并开始渲染时的回调 */
    callback?: Function): void

  /**
 * 修改展示的图片，未设置的项会继承上一张图片的设置
 * @param {string} src 图片路径
 * @param {object} options 图片选项设置，不传入则继承上一张图片的设置
 */
  ChangeImg(src: string, options?: ParticleOptions): void

  /**
  * 散开聚合控制
  * @param {boolean} flag 控制是否聚合，不传入则以当前状态取反
  */
  ParticlePolymerize(flag?: boolean): void

  /** 
   * 预销毁当前实例，销毁对象前请通过此方法解绑监听事件与清除画布
   * @param {Function} callback 销毁完后的回调
   */
  PreDestory(callback: Function): void
}
