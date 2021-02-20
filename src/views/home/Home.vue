<template>
    <div id="home">
      <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
      <tab-control class="tab-control"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl1"
                   v-show="isTopFixed"/>
      <!--
      子组件props中属性名称为驼峰，这里要写蛇形：如：probeType
      同时对于非字符串类型，要使用v-bind
      -->
      <!--scroll高度计算一种是以及calc计算，一种是基于样式来实现定位-->
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
        <recommend-view :recommends="recommends"/>
        <feature-view/>
        <!--由于传递过去的是非字符串，这里需要绑定-->
        <tab-control :titles="['流行','新款','精选']"
                     @tabClick="tabClick"
                     ref="tabControl2"/>

        <goods-list :goods="showGoods"/>

      </scroll>
      <!--监听组件点击必须加上.native-->
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'

  export default {
    name: "Home",
    components: {
      NavBar,
      Scroll,
      BackTop,
      TabControl,
      GoodsList,
      FeatureView,
      RecommendView,
      HomeSwiper
    },
    data(){
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTopFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求轮播图相关数据,这里必须指定this
     this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      // 监听消息总线上的itemImageLoad事件
      // 这里放到mounted中而不是created，防止$refs取不到值
      const refresh = debounce(this.$refs.scroll.refresh(), 50)

      // 自定义全局事件监听，收到事件执行某些操作
      // Detail组件也使用了
      this.itemImgListener = () => {refresh()}
      this.$bus.$on('itemImageLoad', this.itemImgListener)
    },
    // 让home保持原状态，基于keep-alive和activated以及deactivated来保存scroll滑动位置的记录
    // 这样当跳转其他页面回来后依旧显示在之前的位置
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
      // 取消全局事件监听,如果不设置第二个参数，那么取消的是全局的，也就导致Detail组件中的监听也没了
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    methods: {
      /**
       * 网络请求
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page = page
          // 重置上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },
      /**
       * 事件监听
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
                break
          case 1:
            this.currentType = 'new'
                break
          case 2:
            this.currentType = 'sell'
                break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      // 回到顶部
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 300)
      },
      // 滚动监听
      contentScroll(position) {
        // 回到顶部按钮是否显示
        this.isShowBackTop = (-position.y) > 200
        // tabControl是否吸顶
        this.isTopFixed = (-position.y) > this.tabOffsetTop
      },
      // 上拉加载更多
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      // 轮播图加载完图片
      swiperImageLoad() {
        // 获取tab-control组件距离顶部插件
        // 通过$el获取组件中的元素，在获取元素的属性
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #F0F0F0;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
