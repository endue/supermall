<template>
  <div id="detail">
    <detail-nav-bar/>
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'

  import {getDetail, Goods, Shop} from 'network/detail'

  export default {
    name: "Detail",
    components: {
      DetailSwiper,
      DetailNavBar,
      DetailBaseInfo,
      DetailShopInfo
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

</style>
