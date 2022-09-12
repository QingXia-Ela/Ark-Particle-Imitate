const options = {
  THICKNESS: Math.pow(50, 2),
  DRAG: 0.9,
  EASE: 0.2,
  adsorbentMode: false,
  ParticlePolymerizeFlag: true
}

let mx = 0, my = 0

class Point {
  /**
   * 点示例，**该类为内部类，不建议调用**
   * @param {number} orx 目标位置 x
   * @param {number} ory 目标位置 y 
   * @param {number} size 圆点大小
   * @param {number} colorNum rgb 加起来的总和
   * @param {HTMLCanvasElement} canvas canvas 元素
   * @param {boolean} cancelRandPlace 取消点初始化的随机点位
   */
  constructor(orx, ory, size, colorNum = 0, canvas, cancelRandPlace = false) {
    // 原始位置
    this.orx = orx
    this.ory = ory
    // 圆点大小
    this.size = size
    // 当前位置
    this.x = cancelRandPlace ? orx + 50 * Math.random() : Math.random() * canvas.width
    this.y = cancelRandPlace ? ory + 50 * Math.random() : Math.random() * canvas.height
    // 下一个移动位置
    this.nx = orx
    this.ny = ory
    // 移速
    this.spx = 0
    this.spy = 0
    // 透明度
    this.opacity = 0;
    this.canvas = canvas

    // 颜色
    const c = Math.floor(colorNum / 3)
    /** 纯数字rgb值 , 例: `255,255,255` */
    this.color = `${255 - c},${255 - c},${255 - c}`
  }

  update() {
    // 解构变量
    const { adsorbentMode, THICKNESS, DRAG, EASE, ParticlePolymerizeFlag } = options

    //移动速度
    this.spx = (this.nx - this.x) / (ParticlePolymerizeFlag ? 30 : 60)
    this.spy = (this.ny - this.y) / (ParticlePolymerizeFlag ? 30 : 60)

    // 粒子原始位置距离判断
    let dx = mx - this.orx,
      dy = my - this.ory,
      curDx = mx - this.x,
      curDy = my - this.y;

    // 鼠标相对点原始位置的直线距离的平方
    let d = dx * dx + dy * dy;

    // 鼠标相对点原始位置的距离比例, 小于 1 为在边界外, 等于 1 为刚好在边界上, 大于 1 为在边界内
    let f = THICKNESS / d;

    // 吸附模式
    if (adsorbentMode) {
      // 防止圆点飞太远
      if (d < THICKNESS) {
        if (f > 2.5) f = 2.5;
      }
    }
    // 排斥模式
    else {
      // 防止圆点飞太远
      f = f > 7 ? 7 : f;
    }

    let t = Math.atan2(curDy, curDx);
    let vx = f * Math.cos(t),
      vy = f * Math.sin(t);

    // 计算出要移动的距离
    // this.spx += (adsorbentMode ? vx : -vx) * DRAG + (this.orx - this.x) * EASE
    // this.spy += (adsorbentMode ? vy : -vy) * DRAG + (this.ory - this.y) * EASE

    // 最终计算
    if (!ParticlePolymerizeFlag && this.opacity > 0) {
      this.x -= this.spx;
      this.opacity -= 0.04;

      // 全部隐藏时直接移动到随机位置
      if (this.opacity <= 0) {
        this.x = this.nx
        this.y = this.ny
      }
    } else {
      this.x += this.spx;
      if (this.opacity < 1)
        this.opacity += 0.012;
    }
    if (!ParticlePolymerizeFlag && this.opacity > 0) {
      this.y -= this.spy;
    } else {
      this.y += this.spy;
    }
  }

  render() {
    const ctx = this.canvas.getContext('2d')
    ctx.beginPath();
    // 改变初始位置
    ctx.arc(this.x, this.y, this.size, 0, 360);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}

/**
 * 
 * @param {HTMLCanvasElement} canvas canvas元素
 * @param {string} imgSrc 图片路径
 * @param {number} x 渲染起点 X
 * @param {number} y 渲染起点 Y
 * @param {number | undefined} w 渲染宽度，可省略，如果只设置该项则图片会按照原图的比例进行宽高缩放
 * @param {number | undefined} h 渲染高度，可省略
 * @param {object} options 高级设置
 * @param {Function} callback 图片加载完并开始渲染时的回调
 */
class DameDaneParticle {

  constructor(canvas, imgSrc, x, y, w, h, options = {}, callback) {
    // 元素宽高
    this.w = canvas.width, this.h = canvas.height

    /** 传入的 canvas 元素 */
    this.canvasEle = canvas
    /** 传入的 canvas 元素 2D 上下文 */
    this.ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    /** 图片对象 */
    this.IMG = new Image()
    this.IMG.src = imgSrc
    // 图片信息
    this.ImgW = 0, this.ImgH = 0

    /** 粒子数组 */
    this.PointArr = []
    /** 粒子散开聚合标记, `true` 为聚合 */
    this.ParticlePolymerizeFlag = true

    // 渲染起始位置
    this.renderX = x
    this.renderY = y

    // 动画 id
    this.animeId = -1

    // 初始化标记
    this.hasInit = false

    // 解构 options
    const { spacing } = options

    // 图片加载完成
    this.IMG.onload = () => {
      if (typeof w === 'number') this.ImgW = w
      else this.ImgW = this.IMG.width
      if (typeof h === 'number') this.ImgH = h
      else this.ImgH = Math.floor(this.ImgW * (this.IMG.height / this.IMG.width))

      // 获取数据
      const ele = document.createElement('canvas')
      ele.width = this.ImgW
      ele.height = this.ImgH

      const eleCtx = ele.getContext('2d')
      eleCtx.drawImage(this.IMG, 0, 0, this.ImgW, this.ImgH);
      const imgArr = eleCtx.getImageData(0, 0, this.ImgW, this.ImgH).data;
      eleCtx.clearRect(0, 0, canvas.width, canvas.height);
      this._InitParticle(imgArr, spacing)
      this._Draw2Canvas()

      // 鼠标事件
      // this.canvasEle.addEventListener("mousemove", (e) => {
      //   const cRect = canvas.getBoundingClientRect();
      //   mx = e.clientX - cRect.left;
      //   my = e.clientY - cRect.top;
      // })
      this.hasInit = true
      callback && callback()
    }
  }

  /**
   * 图片初始化函数，**此项为内置 api， 不建议随便调用**
   * @param {Uint8ClampedArray} ImgData 图片数据数组
   * @param {number} Spacing 每个点的间距
   */
  _InitParticle = (ImgData, Spacing = 1) => {
    // 清空原数组？
    // this.PointArr = []
    let imgW = this.ImgW, imgH = this.ImgH, cnt = 0

    let arr = this.PointArr, len = arr.length, randIndex, temp
    while (len) {
      randIndex = (Math.floor(Math.random() * len--))
      temp = arr[randIndex]
      arr[randIndex] = arr[len]
      arr[len] = temp
    }

    const gap = 4;
    for (var h = 0; h < imgH; h += gap) {
      for (var w = 0; w < imgW; w += gap) {
        var position = (imgW * h + w) * 4;
        var r = ImgData[position],
          g = ImgData[position + 1],
          b = ImgData[position + 2];
        var val = r + g + b
        // 判断是否有前置像素
        if (val < 50) {
          if (arr[cnt]) {
            const point = arr[cnt]
            point.orx = point.nx = w * Spacing + this.renderX
            point.ory = point.ny = h * Spacing + this.renderY
            const c = Math.floor(val / 3)
            point.color = `${255 - c},${255 - c},${255 - c}`
          }
          else arr[cnt] = new Point(w * Spacing + this.renderX, h * Spacing + this.renderY, 1, val, this.canvasEle, this.hasInit)
          cnt++
        }
      }
    }
    if (cnt < arr.length)
      this.PointArr = arr.splice(0, cnt)

    if (!options.ParticlePolymerizeFlag) this.ParticlePolymerize(false)

    console.log(this.PointArr);
  }

  /** 绘制到 canvas，**此项为内置 api， 不建议随便调用** */
  _Draw2Canvas = () => {
    cancelAnimationFrame(this.animeId)
    const w = this.canvasEle.width, h = this.canvasEle.height
    this.ctx.clearRect(0, 0, w, h)
    this.PointArr.forEach((point) => {
      point.update();
      point.render();
    });
    this.animeId = requestAnimationFrame(this._Draw2Canvas)
  }

  /**
  * 散开聚合控制
  * @param {boolean | undefined} flag 控制是否聚合，不传入则以当前状态取反
  */
  ParticlePolymerize(flag) {
    if (typeof flag === 'boolean') options.ParticlePolymerizeFlag = flag
    else options.ParticlePolymerizeFlag = !options.ParticlePolymerizeFlag
    // 控制圆点位置
    this.PointArr.forEach((point) => {
      point.nx = options.ParticlePolymerizeFlag ? point.orx : Math.random() * this.canvasEle.width;
      point.ny = options.ParticlePolymerizeFlag ? point.ory : Math.random() * this.canvasEle.height;
    });
  }

  /**
   * 修改展示的图片
   * @param {string} src 图片路径
   * @param {object} options 图片选项设置
   */
  ChangeImg(src, options) {
    this.IMG.src = src
    this.options = options
  }
}

const DameDaneParticleDemo = new DameDaneParticle(document.getElementById('akCanvas'), './image/island.png', 50, 50, 360, undefined, {
  spacing: 1.8
})
