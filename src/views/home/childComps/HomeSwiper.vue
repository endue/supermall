<template>
    <div>
      <swiper>
        <swiper-item v-for="item in banners" :key="item.link">
          <a :href="item.link">
            <img :src="item.image" :title="item.title" @load="imageLoad">
          </a>
        </swiper-item>
      </swiper>
    </div>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    components: {
      Swiper,
      SwiperItem
    },
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        isLoad: false
      }
    },
    methods: {
      imageLoad() {
        // 确保只发送一次即可
        if(!this.isLoad){
          this.$emit('swiperImageLoad')
          this.isLoad = true
        }
      }
    }
  }
</script>

<style scoped>

</style>
