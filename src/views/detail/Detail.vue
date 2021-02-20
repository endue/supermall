<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
   <scroll class="content">
     <detail-swiper :top-images="topImages"/>
     <detail-base-info :goods="goods"/>
     <detail-shop-info :shop="shop"/>
   </scroll>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import Scroll from 'components/common/scroll/Scroll'
  import {getDetail, Goods, Shop} from 'network/detail'

  export default {
    name: "Detail",
    components: {
      DetailSwiper,
      DetailNavBar,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: null,
        shop: null
      }
    },
    created() {
      this.iid = this.$route.params.iid
      // 请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result
        // 获取顶部轮播图
        this.topImages = data.itemInfo.topImages
        // 获取商品信息,这里初始化一个Goods对象，将数据整合同步给子组件
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        // 获取店铺信息
        this.shop = new Shop(data.shopInfo)
      })

    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #F0F0F0;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #F0F0F0;
  }
  /* 实现scroll滚动区域计算 */
  .content {
    height: calc(100% - 44px);
  }
</style>
