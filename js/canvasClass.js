class Point {

  constructor(orx, ory, size, colorNum = 0, canvas, cancelRandPlace = false) {
    // 原始位置
    this.orx = orx;
    this.ory = ory;
    // 圆点大小
    this.size = size;
    // 当前位置
    this.x = cancelRandPlace ? orx : Math.random() * canvas.width;
    this.y = cancelRandPlace ? ory : Math.random() * canvas.height;
    // 下一个移动位置
    this.nx = orx;
    this.ny = ory;
    // 移速
    this.spx = 0;
    this.spy = 0;
    // 透明度
    this.opacity = cancelRandPlace ? 1 : 0;
    this.canvas = canvas;

    // 颜色
    let c = Math.floor(colorNum / 3);

    /** 纯数字rgb值 , 例: `255,255,255` */
    this.color = `${c},${c},${c}`;
  }

  update(ParticlePolymerizeFlag = true, options, mx, my) {
    // 解构变量
    const { Thickness, Drag, Ease, effectParticleMode } = options;

    //移动速度
    this.spx = (this.nx - this.x) / (ParticlePolymerizeFlag ? 30 : 60);
    this.spy = (this.ny - this.y) / (ParticlePolymerizeFlag ? 30 : 60);

    // 粒子原始位置距离判断
    let curDx = (mx - this.x),
      curDy = (my - this.y);

    // 鼠标相对点原始位置的直线距离的平方
    let d1 = curDx * curDx + curDy * curDy;

    // 鼠标相对点原始位置的距离比例, 小于 1 为在边界外, 等于 1 为刚好在边界上, 大于 1 为在边界内
    let f = Thickness / d1;

    f = f < 0.1 ? 0.1 : f;

    let finalT = 0;

    // 吸附模式
    if (effectParticleMode == 'adsorption') {
      // 防止圆点飞太远
      f = f > 12 ? 12 : f;
      if (f > 0.5 && f <= 1.5) f = 0.5;
    }
    // 排斥模式
    else if (effectParticleMode == 'repulsion') {
      // 防止圆点飞太远
      f = f > 7 ? 7 : f;
    }

    finalT = Math.atan2(curDy, curDx);
    let vx = f * Math.cos(finalT),
      vy = f * Math.sin(finalT);

    // 计算出要移动的距离
    if (effectParticleMode) {
      let finalX = ((effectParticleMode === 'adsorption' ? vx : -vx) * Drag) + ((this.orx - this.x) * Ease) / 400,
        finalY = ((effectParticleMode === 'adsorption' ? vy : -vy) * Drag) + ((this.ory - this.y) * Ease) / 400;
      this.spx += finalX;
      this.spy += finalY;
    }

    // 最终计算
    if (!ParticlePolymerizeFlag && this.opacity > 0) {
      this.x -= this.spx;
      this.opacity -= 0.04;

      // 全部隐藏时直接移动到随机位置
      if (this.opacity <= 0) {
        this.x = this.nx;
        this.y = this.ny;
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
    ctx.fillStyle = `rgba(${this.color},${this.opacity > 1 ? 1 : this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}

class DameDaneParticle {
  /**
   * @param {HTMLCanvasElement} canvas 
   * @param {ParticleOptions} options 
   * @param {Function} callback 
   */
  constructor(canvas, options, callback) {
    // 预处理
    const initOptions = {
      renderX: 0,
      renderY: 0,
      spacing: 1,
      size: 1,
      Drag: 0.95,
      Ease: 0.1,
      Thickness: 50,
      validColor: {
        min: 300, max: 765, invert: false
      },
      cancelParticleAnimation: false
    }
    for (const i in initOptions) {
      if (typeof options[i] === 'undefined') options[i] = initOptions[i];
    }
    options.Thickness *= options.Thickness;

    // 解构
    const { src } = options;

    // 元素宽高
    this.w = canvas.width, this.h = canvas.height;

    /** 传入的 canvas 元素 */
    this.canvasEle = canvas;
    /** 传入的 canvas 元素 2D 上下文 */
    this.ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /** 图片对象 */
    this.IMG = new Image();
    this.IMG.src = src;
    // 图片信息
    this.ImgW = 0, this.ImgH = 0;

    /** 粒子位置信息数组 */
    this.PointArr = [];
    /** 粒子散开聚合标记, `true` 为聚合 */
    this.ParticlePolymerizeFlag = true;

    /** 动画 id */
    this.animeId = -1;

    /** 鼠标位置 X */
    this.mx = 0;
    /** 鼠标位置 Y */
    this.my = 0;

    // 初始化标记
    this.hasInit = false;

    // options 备份
    this.options = options;

    // 图片加载完成
    this.IMG.onload = () => {
      // 设置解构
      const { renderX, renderY, w, h } = this.options;

      // 渲染起始位置
      this.renderX = renderX;
      this.renderY = renderY;

      if (typeof w === 'number') this.ImgW = w;
      else this.ImgW = this.IMG.width;
      if (typeof h === 'number') this.ImgH = h;
      else this.ImgH = Math.floor(this.ImgW * (this.IMG.height / this.IMG.width));

      // 获取数据
      const ele = document.createElement('canvas');
      ele.width = this.ImgW;
      ele.height = this.ImgH;

      const eleCtx = ele.getContext('2d');
      eleCtx.drawImage(this.IMG, 0, 0, this.ImgW, this.ImgH);
      this._imgArr = eleCtx.getImageData(0, 0, this.ImgW, this.ImgH).data;
      eleCtx.clearRect(0, 0, canvas.width, canvas.height);
      // 第一次初始化图片
      this._InitParticle(this._imgArr, true);
      this._Draw2Canvas();
      this.hasInit = true;

      callback && callback();
    }

    /** 鼠标移动监听函数 */
    this.$changeMxMy = _.throttle((e) => {
      const cRect = canvas.getBoundingClientRect();
      this.mx = e.clientX - cRect.left + 3;
      this.my = e.clientY - cRect.top + 3;
    }, 20)
    canvas.addEventListener("mousemove", this.$changeMxMy);

    /** 自适应函数 */
    this.$fit = _.throttle(() => {
      canvas = this.canvasEle;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this._InitParticle();
    }, 10)

    // 窗口自适应
    window.addEventListener('resize', this.$fit);
  }

  /**
   * 图片初始化函数，**此项为内置 api， 不建议随便调用**
   * @param {Uint8ClampedArray} ImgData 图片数据数组
   * @param {boolean} rebuildParticle 是否重组图像
   */
  _InitParticle = (ImgData, rebuildParticle = false) => {
    if (!ImgData) ImgData = this._imgArr;

    let imgW = this.ImgW, imgH = this.ImgH, cnt = 0;

    let arr = this.PointArr;

    let { spacing, size, validColor, cancelParticleAnimation } = this.options, proportion = window.innerHeight / window.outerHeight;
    spacing *= proportion > 0.5 ? proportion : 0.5;

    let r, g, b, val, position;
    const gap = 4;
    for (var h = 0; h < imgH; h += gap) {
      for (var w = 0; w < imgW; w += gap) {
        position = (imgW * h + w) * 4;
        r = ImgData[position],
          g = ImgData[position + 1],
          b = ImgData[position + 2];
        val = r + g + b
        // 像素符合条件
        if ((validColor.invert && (val <= validColor.min || val >= validColor.max)) || (!validColor.invert && val >= validColor.min && val <= validColor.max)) {
          // 判断是否有前置像素
          if (arr[cnt] && !cancelParticleAnimation) {
            const point = arr[cnt];
            point.orx = point.nx = w * spacing + this.renderX;
            point.ory = point.ny = h * spacing + this.renderY;
            let c = Math.floor(val / 3);
            point.color = `${c},${c},${c}`;
          }
          else arr[cnt] = new Point(w * spacing + this.renderX, h * spacing + this.renderY, size, val, this.canvasEle, this.hasInit || cancelParticleAnimation);
          cnt++;
        }
      }
    }

    if (cnt < arr.length)
      this.PointArr = arr.splice(0, cnt);

    // 最终位置打乱
    if (rebuildParticle && !cancelParticleAnimation) {
      arr = this.PointArr;
      let len = arr.length, randIndex = 0, tx = 0, ty = 0;
      while (len) {
        randIndex = (Math.floor(Math.random() * len--));
        tx = arr[randIndex].orx, ty = arr[randIndex].ory;

        arr[randIndex].orx = arr[randIndex].nx = arr[len].orx,
          arr[randIndex].ory = arr[randIndex].ny = arr[len].ory;

        arr[len].orx = arr[len].nx = tx,
          arr[len].ory = arr[len].ny = ty;
      }
    }

    // 解决散开后切换图片再聚合时粒子没有从随机位置回到正常位置的问题
    if (!this.ParticlePolymerizeFlag) this.ParticlePolymerize(false);
  }

  /** 绘制到 canvas，**此项为内置 api， 不建议随便调用** */
  _Draw2Canvas = () => {
    cancelAnimationFrame(this.animeId);
    const w = this.canvasEle.width, h = this.canvasEle.height;
    this.ctx.clearRect(0, 0, w, h);
    this.PointArr.forEach(
      /** @param {Point} point */
      (point) => {
        point.update(this.ParticlePolymerizeFlag, this.options, this.mx, this.my);
        point.render();
      })
    this.animeId = requestAnimationFrame(this._Draw2Canvas);
  }

  /**
    * 散开聚合控制
    * @param {boolean | undefined} flag 控制是否聚合，不传入则以当前状态取反
    */
  ParticlePolymerize(flag) {
    if (typeof flag === 'boolean') this.ParticlePolymerizeFlag = flag;
    else this.ParticlePolymerizeFlag = !this.ParticlePolymerizeFlag;
    this.PointArr.forEach(
      /** @param {Point} point */
      (point) => {
        point.nx = this.ParticlePolymerizeFlag ? point.orx : Math.random() * this.canvasEle.width;
        point.ny = this.ParticlePolymerizeFlag ? point.ory : Math.random() * this.canvasEle.height;
      });
  }

  /**
    * 修改展示的图片，未设置的项会继承上一张图片的设置
    * @param {string} src 图片路径
    * @param {ParticleOptions} options 选项设置，不传入则继承上一次的设置
    */
  ChangeImg(src, options) {
    this.IMG.src = src;
    // 替换设置
    if (options) {
      for (const i in options) {
        this.options[i] = options[i];
      }
    }
  }

  /** 预销毁当前实例，销毁对象前请通过此方法解绑监听事件与清除画布 */
  PreDestory(callback) {
    this.canvasEle.removeEventListener('mousemove', this.$changeMxMy);
    window.removeEventListener('resize', this.$fit);
    cancelAnimationFrame(this.animeId);
    this.PointArr = [];
    this.ctx.clearRect(0, 0, this.canvasEle.width, this.canvasEle.height);

    callback && callback();
  }
}
