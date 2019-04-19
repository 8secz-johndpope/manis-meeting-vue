<template>
  <div class="annotation-container" v-show="showAnnotation">
    <div class="canvas-container">
    </div>
  </div>
</template>
<script>
import Utils from '../../utils/utils'

export default {
  name: 'Annotation',
  props: [],
  data () {
    return {
      showAnnotation: false,
      width: 0,
      height: 0,
      annotationOwner: null,
      proportion: 1,
      drawData: []
    }
  },
  methods: {
    /**
       * 创建画布
       * @param width
       * @param height
       * @param bg
       * @param marginRL
       * @param marginTB
       */
    createCanvas (width, height, bg, marginRL, marginTB) {
      let canvasDom = document.createElement('canvas')
      canvasDom.id = 'myCanvas'
      canvasDom.className = 'canvas'
      canvasDom.width = (width || 100)
      canvasDom.height = (height || 100)
      canvasDom.style.background = bg
      // console.log('AAAAAAAAAAAAAAAAAA', marginTB, marginRL);
      canvasDom.style.margin = marginTB + 'px ' + marginRL + 'px '
      document.querySelector('.canvas-container').appendChild(canvasDom)
    },

    /**
       * 画线
       * @param requirement
       * @param optional
       * @returns {boolean}
       */
    drawLine (requirement, optional) {
      if (!requirement) {
        return false
      }
      let c = document.getElementById('myCanvas')
      let ctx = c.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(requirement.startX, requirement.startY)
      ctx.lineTo(requirement.endX, requirement.endY)
      ctx.closePath()
      if (optional) {
        ctx.strokeStyle = optional.color
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = optional.lineWidth
      }
      ctx.stroke()
      return true
    },

    /**
       * 画圆
       * @param requirement
       * @param optional
       * @returns {boolean}
       */
    drawArc (requirement, optional) {
      if (!requirement) {
        return false
      }
      var c = document.getElementById('myCanvas')
      var ctx = c.getContext('2d')
      ctx.beginPath()
      ctx.arc((requirement.centerX || 50), (requirement.centerY || 50), (requirement.radius || 20), 0, ((requirement.angle / 180) || 2) * Math.PI)
      ctx.closePath()
      if (optional) {
        ctx.strokeStyle = optional.color
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = optional.lineWidth
      }
      ctx.stroke()
      return true
    },

    /**
       * 画矩形
       * @param requirement
       * @param optional
       * @returns {boolean}
       */
    drawRect (requirement, optional) {
      if (!requirement) {
        return false
      }
      var c = document.getElementById('myCanvas')
      var ctx = c.getContext('2d')
      ctx.beginPath()
      ctx.strokeRect((requirement.startX || 20), (requirement.startY || 20), (requirement.width || 150), (requirement.height || 100))
      ctx.closePath()
      if (optional) {
        ctx.strokeStyle = optional.color
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = optional.lineWidth
      }
      ctx.stroke()
    },

    /**
       * 插入文本
       * @param requirement
       * @param optional
       * @returns {boolean}
       */
    drawText (requirement, optional) {
      if (!requirement) {
        return false
      }
      var c = document.getElementById('myCanvas')
      var ctx = c.getContext('2d')
      if (optional) {
        ctx.font = optional.font || '20px Georgia'
        ctx.strokeStyle = optional.color
      }
      let content = requirement.content
      let fontSize = (ctx.font.split('px')[0]) || 20
      let maxWidth = (c.width - requirement.startX) || 100
      let perLineCount = Math.floor(maxWidth / fontSize)
      let contentArr = Utils.strCut2Arr(content, perLineCount)
      let startY = parseInt(requirement.startY || 20)
      for (let i = 0; i < contentArr.length; i++) {
        let content = contentArr[i]
        let x = (requirement.startX || 20)
        let y = (startY += (parseInt(fontSize) + 2))
        ctx.fillText(content, x, y, maxWidth)
      }
    },

    /**
       * 橡皮檫
       * @param requirement
       * @param optional
       * @returns {boolean}
       */
    drawClear (requirement, optional) {
      if (!requirement) {
        return false
      }
      var c = document.getElementById('myCanvas')
      var ctx = c.getContext('2d')
      let startX = requirement.startX || 0
      let startY = requirement.startY || 0
      let width = requirement.width || c.width
      let height = requirement.height || c.height
      // ctx.beginPath();
      ctx.clearRect(startX, startY, width, height)
      // ctx.closePath();
      ctx.stroke()
    },

    /**
       * 监听远端绘图消息
       */
    handleAnnotationCreate () {
      let _this = this
      Utils.onDrawingMsg(function (res) {
        let data = res.response
        let action = data.action
        if (action === 'create') {
          console.log('handle annotation: ', data)
          _this.showAnnotation = true
          _this.annotationOwner = data.from
          let size = data.data.split('x')
          let canvasParams = _this.setCanvasSize(size[0], size[1])
          _this.proportion = canvasParams.rP
          _this.createCanvas(canvasParams.rW, canvasParams.rH, 'rgba(0, 0, 0, 0.2)', canvasParams.mRL, canvasParams.mTB)
          _this.initDrawData()
        } else if (action === 'message') {
          let dataContent = JSON.parse(data.data)
          _this.drawData.push(dataContent)
          _this.doDraw(dataContent)
        } else if (action === 'destroy') {
          // clear canvas and remove
          _this.closeDraw()
        }
      })
      // register window resize event
      window.onresize = function (e) {
        _this.resizeCanvasEvent()
      }
    },

    /**
       * 绘制内容
       * @param dataContent
       */
    doDraw (dataContent) {
      let _this = this
      if (dataContent.type === 'init' || dataContent.type === 'Annotate') {
        let content = dataContent.message
        // draw line
        let color = content.penColor
        if (content.penType === 'source-over') {
          _this.drawLine({
            startX: _this.proportionData2Fixed(content.mouse[0][0]),
            startY: _this.proportionData2Fixed(content.mouse[0][1]),
            endX: _this.proportionData2Fixed(content.mouse[1][0]),
            endY: _this.proportionData2Fixed(content.mouse[1][1])
          }, {
            lineWidth: _this.proportionData2Fixed(content.penSize),
            color: color
          })
        } else if (content.penType === 'destination-over' || content.penType === 'destination-out') {
          // eraser
          _this.drawClear({
            startX: _this.proportionData2Fixed(content.mouse[0][0]),
            startY: _this.proportionData2Fixed(content.mouse[0][1]),
            width: _this.proportionData2Fixed(content.penSize),
            height: _this.proportionData2Fixed(content.penSize)
          })
        }
      } else if (dataContent.type === 'Annotate Text' || dataContent.type === 'init Text') {
        // text
        let textContent = dataContent.message
        _this.drawText({
          content: textContent.text,
          startX: _this.proportionData2Fixed(textContent.mouse[0]),
          startY: _this.proportionData2Fixed(textContent.mouse[1])
        }, {
          font: parseInt(_this.proportionData2Fixed(16)) + 'px Verdana',
          color: '#333333'
        })
      } else if (dataContent.type === 'ClearAnnotate') {
        // clear canvas
        console.log('handle clear canvas')
        _this.drawClear({})
        _this.drawData = []
      }
    },

    /**
       * 请求历史数据
       */
    initDrawData () {
      let _this = this
      Utils.requestDelayDrawing(_this.annotationOwner, function (res) {
        console.log('sent get init annotation data :', res)
      })
    },

    /**
       * 格式化数据
       * @param data
       * @returns {string}
       */
    proportionData2Fixed (data) {
      return (data * this.proportion).toFixed(2)
    },

    /**
       * 计算画板尺寸/位置和缩放比
       * @param canvasWidth
       * @param canvasHeight
       * @returns {{rW: number, rH: number, mTB: number, mRL: number, rP: number}}
       */
    setCanvasSize (canvasWidth, canvasHeight) {
      let _this = this
      _this.width = parseInt(canvasWidth)
      _this.height = parseInt(canvasHeight)
      let windowWidth = document.documentElement.clientWidth
      let windowHeight = document.documentElement.clientHeight
      let widthProportion = (windowWidth / canvasWidth).toFixed(2)
      let heightProportion = (windowHeight / canvasHeight).toFixed(2)
      let rightProportion = (widthProportion * 100 > heightProportion * 100) ? parseFloat(heightProportion) : parseFloat(widthProportion)
      let realCanvasWidth = canvasWidth * rightProportion
      let realCanvasHeight = canvasHeight * rightProportion
      let marginRL = Math.floor((windowWidth - realCanvasWidth) / 2)
      let marginTB = Math.floor((windowHeight - realCanvasHeight) / 2)
      marginTB = (marginTB > 0) ? marginTB : 0
      marginRL = (marginRL > 0) ? marginRL : 0
      return {
        rW: realCanvasWidth,
        rH: realCanvasHeight,
        mTB: marginTB,
        mRL: marginRL,
        rP: rightProportion
      }
    },

    /**
       * 收到窗口尺寸改变事件
       * @returns {boolean}
       */
    resizeCanvasEvent () {
      let _this = this
      if (!_this.width || !_this.height) {
        console.log('not annotation, just return')
        return false
      }
      let sizeObject = this.setCanvasSize(_this.width, _this.height)
      _this.resizeCanvas(sizeObject)
    },

    /**
       * 重置画板尺寸
       * @param sizeObject
       */
    resizeCanvas (sizeObject) {
      let _this = this
      let canvasElement = document.getElementById('myCanvas')
      if (canvasElement && sizeObject) {
        canvasElement.width = sizeObject.rW
        canvasElement.height = sizeObject.rH
        canvasElement.style.margin = sizeObject.mTB + 'px ' + sizeObject.mRL + 'px '
      }
      _this.proportion = sizeObject.rP
      _this.reDraw()
    },

    /**
       * 重绘数据
       */
    reDraw () {
      let _this = this
      if (_this.drawData.length) {
        for (let i = 0; i < _this.drawData.length; i++) {
          let point = _this.drawData[i]
          _this.doDraw(point)
        }
      }
    },

    /**
     * close draw
     */
    closeDraw () {
      let _this = this
      _this.drawClear({})
      _this.drawData = []
      _this.showAnnotation = false
    },

    /**
     * check left is painter
     * @param endpoint
     */
    checkLeftIsPainter (endpoint) {
      let _this = this
      console.log('check left is painter:', endpoint, _this.annotationOwner)
      if (_this.annotationOwner && _this.annotationOwner.indexOf(endpoint) > -1) {
        _this.closeDraw()
      }
    }
  },

  mounted: function () {
    this.handleAnnotationCreate()
  },
  beforeDestroy: function () {
    this.showAnnotation = false
    this.width = 0
    this.height = 0
    this.annotationOwner = null
    this.proportion = 1
    this.drawData = []
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .annotation-container {
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 1;
  }

</style>
