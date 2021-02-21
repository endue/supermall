<template>
    <div class="cart">
      <!--导航-->
      <nav-bar class="nav-bar">
        <div slot="center">购物车({{cartLength}})</div>
      </nav-bar>
      <!--列表-->
      <cart-list/>
      <!--底部汇总工具栏-->
      <cart-bottom-bar/>
    </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from "./childComps/CartList";
  import CartBottomBar from './childComps/CartBottomBar'
  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components: {
      CartList,
      CartBottomBar,
      NavBar
    },
    computed: {
      ...mapGetters([
        'cartLength'
      ])
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #F0F0F0;
    font-weight: 700;
  }
</style>
