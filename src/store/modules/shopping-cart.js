
const m6cart = 'm6cart'

const stringify = obj => JSON.stringify(obj)
const jsonParse = obj => JSON.parse(obj)

const setToLocalStorage = obj => window.localStorage.setItem(m6cart, stringify(obj))

const createCartItem = payload => {
  const { priceColumn, product } = payload
  return {
    price: {
      id: priceColumn.id,
      name: priceColumn.name,
      cost: priceColumn.cost,
      timeUnit: priceColumn.timeUnit
    },
    product: {
      id: product.id,
      name: product.name,
      desc: product.desc || ''
    }
  }
}

const state = {
  cart: []
}

const getters = {
  getCart: state => state.cart
}

const mutations = {
  setCart(state, payload) {
    state.cart = payload
    setToLocalStorage(state.cart)
  },
  addNewProductToCart(state, payload) {
    state.cart = [...state.cart, payload]
    setToLocalStorage(state.cart)
  },
  replaceProductInCart(state, payload) {
    state.cart = state.cart.map(c => c.product.id !== payload.product.id ? c : payload)
  }
}

const actions = {
  removeFromCart({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const newCart = state.cart.filter(c => c.product.id === payload.product.id)
      commit('setCart', newCart)
      resolve('Removed From Cart')
    })
  },
  isProductAndPricingInCart({ state }, payload) {
    return new Promise((resolve, reject) => {
      const tempCartItem = createCartItem(payload)

      const isProdInArray = state.cart.find(c => c.product.id === tempCartItem.product.id)

      if (isProdInArray) {
        const samePricingPlan = isProdInArray.price.id === tempCartItem.price.id

        if (samePricingPlan) {
          resolve(true)
        } else {
          resolve(false)
        }
      } else {
        resolve(false)
      }
    })
  },
  recreatingCart({ commit, state }) {
    return new Promise((resolve, reject) => {
      const exists = window.localStorage.hasOwnProperty(m6cart)

      if (exists && !state.cart.length) {
        const str_cart = window.localStorage.getItem(m6cart)
        const cart = jsonParse(str_cart)

        commit('setCart', cart)
      } else if (!exists) {
        window.localStorage.setItem(m6cart, stringify([]))
      }

      resolve(true)
    })
  },
  addingToCart({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const tempCartItem = createCartItem(payload)

      // gotta makesure no duplicates of products. though pricing plans can change
      const isProdInArray = state.cart.find(c => c.product.id === tempCartItem.product.id)

      if (isProdInArray) {
        // check if same pricing plan
        const samePricingPlan = isProdInArray.price.id === tempCartItem.price.id
        if (samePricingPlan) {
          resolve('Already In Cart')
        } else {
          commit('replaceProductInCart', tempCartItem)
          resolve('Changed Product Plan')
        }
      } else {
        commit('addNewProductToCart', tempCartItem)
        resolve('Added To Cart')
      }
    })
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
