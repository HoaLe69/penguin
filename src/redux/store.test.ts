import store from './store'

describe('Redux Store', () => {
  it('should create a store with initial state', () => {
    const state = store.getState()

    expect(state).toBeDefined()
    expect(state.auth).toBeDefined()
    expect(state.post).toBeDefined()
    expect(state.user).toBeDefined()
    expect(state.room).toBeDefined()
    expect(state.comment).toBeDefined()
  })

  it('should have auth slice with correct initial state', () => {
    const state = store.getState()

    expect(state.auth.authState).toBeDefined()
    expect(state.auth.authState.user).toBeNull()
    expect(state.auth.authState.isAuthenticated).toBeNull()
    expect(state.auth.loginState).toBeDefined()
    expect(state.auth.loginState.isFetching).toBe(false)
  })

  it('should allow dispatching actions', () => {
    const { loginStart } = require('./authSlice')
    store.dispatch(loginStart())
    const state = store.getState()

    expect(state.auth.loginState.isFetching).toBe(true)
  })

  it('should be compatible with getState method', () => {
    const state = store.getState()
    expect(typeof state).toBe('object')
    expect(state).not.toBeNull()
  })

  it('should allow subscribing to state changes', () => {
    const listener = jest.fn()
    const unsubscribe = store.subscribe(listener)

    const { loginStart } = require('./authSlice')
    store.dispatch(loginStart())

    expect(listener).toHaveBeenCalled()
    unsubscribe()
  })
})
