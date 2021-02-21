import {
  ADD_COUNTER,ADD_TO_CART
} from 'mutation-types'

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid = payload.iid)
      if(oldProduct){
        context.commit(ADD_COUNTER,oldProduct)
        return resole("商品数量+1")
      }else {
        context.commit(ADD_TO_CART,payload)
        return resole("添加商品成功")
      }
    })
  }
}
