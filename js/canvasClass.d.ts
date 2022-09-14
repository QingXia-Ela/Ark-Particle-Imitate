
/**
 * 每张图片的粒子设置声明
 */
interface ParticleOptions {
  /** 图片路径 */
  src: string
  /** 渲染起点 X */
  renderX: number
  /** 渲染起点 Y */
  renderY: number
  /** 粒子大小, 默认 1 */
  size?: number
  /** 渲染宽度，可省略，**但建议设置为350左右，并在此基础上进行调整**，如果只设置该项则图片会按照原图的比例进行宽高缩放 */
  w?: number
  /** 渲染高度，可省略 */
  h?: number
  /** 粒子横竖间距 */
  spacing?: number
  /** 鼠标影响的粒子半径，**设置 `effectParticleMode` 生效** */
  Thickness?: number
  /** 拖拽力度，**设置 `effectParticleMode` 生效** */
  Drag?: number
  /** 曲线柔和，**设置 `effectParticleMode` 生效** */
  Ease?: number
  /** 鼠标影响粒子行为模式，不传入则不影响 */
  effectParticleMode?: 'adsorption' | 'repulsion'
}

declare class DameDaneParticle {
  constructor(canvas: HTMLCanvasElement,
    options: {
      /** 图片路径 */
      src: string
      /** 渲染起点 X */
      renderX: number
      /** 渲染起点 Y */
      renderY: number
      /** 渲染宽度，可省略，**但建议设置为350左右，并在此基础上进行调整**，如果只设置该项则图片会按照原图的比例进行宽高缩放 */
      w?: number
      /** 渲染高度，可省略 */
      h?: number
      /** 粒子横竖间距 */
      spacing?: number
      /** 鼠标影响的粒子半径，**设置 `effectParticleMode` 生效** */
      Thickness?: number
      /** 拖拽力度，**设置 `effectParticleMode` 生效** */
      Drag?: number
      /** 曲线柔和，**设置 `effectParticleMode` 生效** */
      Ease?: number
      /** 鼠标影响粒子行为模式，不传入则不影响 */
      effectParticleMode?: 'adsorption' | 'repulsion'
    },
    /** 图片加载完并开始渲染时的回调 */
    callback?: Function): void

  /**
 * 修改展示的图片
 * @param {string} src 图片路径
 * @param {object} options 图片选项设置，不传入则继承初始设置
 */
  ChangeImg(src: string, options?: ParticleOptions): void
}

