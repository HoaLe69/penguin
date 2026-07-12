import authReducer, {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerSuccess,
  registerFailed,
  verifyUserSuccess,
  verifyUserFailure,
  updateUserLoginFollowingList,
  AuthState,
  User
} from './authSlice'

describe('authSlice', () => {
  const mockUser: User = {
    id: '1',
    displayName: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    following: ['2', '3']
  }

  it('should return the initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({
      authState: {
        user: null,
        isAuthenticated: null
      },
      loginState: {
        isFetching: false,
        success: false,
        error: false,
        message: null
      },
      register: {
        isFetching: false,
        success: false,
        error: false,
        message: null
      }
    })
  })

  it('should handle loginStart', () => {
    const state = authReducer(undefined, loginStart())
    expect(state.loginState.isFetching).toBe(true)
    expect(state.loginState.message).toBe(null)
  })

  it('should handle loginSuccess', () => {
    const state = authReducer(undefined, loginSuccess())
    expect(state.loginState.isFetching).toBe(false)
    expect(state.loginState.error).toBe(false)
    expect(state.loginState.success).toBe(true)
  })

  it('should handle loginFailed', () => {
    const errorMsg = 'Invalid credentials'
    const state = authReducer(undefined, loginFailed(errorMsg))
    expect(state.loginState.error).toBe(true)
    expect(state.loginState.isFetching).toBe(false)
    expect(state.loginState.message).toBe(errorMsg)
  })

  it('should handle registerStart', () => {
    const state = authReducer(undefined, registerStart())
    expect(state.register.isFetching).toBe(true)
  })

  it('should handle registerSuccess', () => {
    const state = authReducer(undefined, registerSuccess())
    expect(state.register.isFetching).toBe(false)
    expect(state.register.success).toBe(true)
  })

  it('should handle registerFailed', () => {
    const errorMsg = 'Email already exists'
    const state = authReducer(undefined, registerFailed(errorMsg))
    expect(state.register.error).toBe(true)
    expect(state.register.isFetching).toBe(false)
    expect(state.register.message).toBe(errorMsg)
  })

  it('should handle verifyUserSuccess', () => {
    const state = authReducer(undefined, verifyUserSuccess(mockUser))
    expect(state.authState.user).toEqual(mockUser)
    expect(state.authState.isAuthenticated).toBe(true)
  })

  it('should handle verifyUserFailure', () => {
    const state = authReducer(undefined, verifyUserFailure())
    expect(state.authState.user).toBe(null)
    expect(state.authState.isAuthenticated).toBe(false)
  })

  it('should handle updateUserLoginFollowingList - follow action', () => {
    const initialState: AuthState = {
      authState: {
        user: mockUser,
        isAuthenticated: true
      },
      loginState: {
        isFetching: false,
        success: false,
        error: false,
        message: null
      },
      register: {
        isFetching: false,
        success: false,
        error: false,
        message: null
      }
    }
    const state = authReducer(
      initialState,
      updateUserLoginFollowingList({ actions: 'follow', userFollowId: '4' })
    )
    expect(state.authState.user?.following).toContain('4')
  })

  it('should handle updateUserLoginFollowingList - unfollow action', () => {
    const initialState: AuthState = {
      authState: {
        user: mockUser,
        isAuthenticated: true
      },
      loginState: {
        isFetching: false,
        success: false,
        error: false,
        message: null
      },
      register: {
        isFetching: false,
        success: false,
        error: false,
        message: null
      }
    }
    const state = authReducer(
      initialState,
      updateUserLoginFollowingList({ actions: 'unfollow', userFollowId: '2' })
    )
    expect(state.authState.user?.following).not.toContain('2')
  })
})
