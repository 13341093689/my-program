<!--  -->
<template>
  <div class="mixin-components-container">
    <div id="waveform" ref="waveform">
      <!-- Here be the waveform -->
    </div>
    <div>
      <button type="primary" @click="plays">播放/暂停</button>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import WaveSurfer from "wavesurfer.js";
// import Timeline from "wavesurfer.js/dist/plugin/wavesurfer.timeline"; //Timeline插件
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions"; //regions插件
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  name: "audioAnnotate",
  data() {
    //这里存放数据
    return {
      noteData: [
        {
          'start': 1.1,
          'end': 4.8,
          'data': { 'note': '' },
          'edit': false
        }
      ],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    plays() {
      this.wavesurfer.playPause();
    },
    getRegionList(listArr) {
      const _this = this;
      _this.tableData = []; // 清除
      if (listArr.length !== 0) {
        for (let i = listArr.length - 1; i >= 0; i--) {
          // 最新的在最前面
          _this.tableData.push({
            id: listArr[i].id,
            startTime: _this.changeTime(listArr[i].start),
            endTime: _this.changeTime(listArr[i].end),
          });
        }
        _this.total = listArr.length;
      }
    },
    changeTime(seconds) {
      seconds = Number(seconds);
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      var secondsStr = Math.round(seconds).toString();
      secondsStr = seconds.toFixed(2);
      if (minutes > 0) {
        return `${minutes < 10 ? "0" + minutes : minutes}:${
          seconds < 10 ? "0" + secondsStr : secondsStr
        }`;
      }
      return `00:${seconds < 10 ? "0" + secondsStr : secondsStr}`;
    },
    randomColor(alpha) {
      return (
        "rgba(" +
        [
          ~~(Math.random() * 255),
          ~~(Math.random() * 255),
          ~~(Math.random() * 255),
          alpha || 1,
        ] +
        ")"
      );
    },
     loadRegions(regions) {
      const _this = this
      regions.forEach(function(region) {
        region.color = _this.randomColor(0.1)
        _this.wavesurfer.addRegion(region)
      })
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$nextTick(() => {
      console.log(WaveSurfer);
      this.wavesurfer = WaveSurfer.create({
        // 应该在其中绘制波形的CSS选择器或HTML元素。这是唯一必需的参数。
        container: this.$refs.waveform,
        waveColor: "violet",
        // 光标后面的波形部分的填充色。当progressColor和waveColor相同时，完全不渲染进度波
        progressColor: "purple",
        backend: "MediaElement",
        // 音频播放时间轴
        mediaControls: false,
        // 播放音频的速度
        audioRate: "1",
        // 插件：此教程配置了光标插件和时间轴插件
        plugins: [
          // Regions
          Regions.create({
            regions: [
              {
                start: 1,
                end: 3,
                color: "hsla(400, 100%, 30%, 0.5)",
              },
              {
                start: 5,
                end: 7,
                color: "hsla(200, 50%, 70%, 0.4)",
              },
            ],
          }),
        ],
      });
      this.wavesurfer.on("error", function (e) {
        console.warn(e);
      });
      this.wavesurfer.load(require("./demo.wav"));

      this.wavesurfer.on("region-update-end", (region) => {
        /** 播放区域的两种方式 */
        console.log(region, "region");
        // this.wavesurfer.play(this.currentRegion.start, this.currentRegion.end)//①
        region.play(); // ②

        /** 新增区域列表 */
        this.regionList = Object.values(this.wavesurfer.regions.list);
        this.getRegionList(this.regionList);
      });
      // this.wavesurfer.on("audioprocess", function (e) {
      //   this.currentTime = this.changeTime(this.wavesurfer.getCurrentTime());
      // });
      this.wavesurfer.on("ready",  () =>{
        // let _this = this;
        this.wavesurfer.enableDragSelection({
          color: this.randomColor(0.1),
        });
        this.loadRegions(this.noteData);
      });
    });
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后s
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  scoped>
/* // @import url(); 引入公共css类 */
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
</style>