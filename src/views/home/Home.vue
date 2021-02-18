<template>
    <div id="home">
      <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <!--由于传递过去的是非字符串，这里需要绑定-->
      <tab-control class="tab-control" :titles="['流行','新款','精选']"/>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
      <h2>1</h2>
    </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata} from 'network/home'

  export default {
    name: "Home",
    components: {
      FeatureView,
      RecommendView,
      NavBar,
      HomeSwiper,
      TabControl
    },
    data(){
      return {
        banners: [],
        recommends: []
      }
    },
    created() {
      // 请求数据
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #F0F0F0;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
  }
</style>
