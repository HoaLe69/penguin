import { renderHook } from '@testing-library/react'

// Mock @stomp/stompjs to avoid actual WebSocket connection
jest.mock('@stomp/stompjs')
jest.mock('sockjs-client')

import { useStompClient } from './useWebSocket'
import { Client } from '@stomp/stompjs'

describe('useWebSocket Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Setup the Client mock to have the required methods
    ;(Client as jest.Mock).mockImplementation(() => ({
      activate: jest.fn(),
      deactivate: jest.fn(),
      subscribe: jest.fn(),
      publish: jest.fn(),
      onConnect: null,
      onStompError: null,
      onWebSocketClose: null
    }))
  })

  it('should not initialize client when id is falsy', () => {
    const { result } = renderHook(() => useStompClient('/topic/test', undefined))

    expect(result.current.isConnected).toBe(false)
  })

  it('should not initialize client when id is null', () => {
    const { result } = renderHook(() => useStompClient('/topic/test', null as any))

    expect(result.current.isConnected).toBe(false)
  })

  it('should return sendMessage and isConnected properties', () => {
    const { result } = renderHook(() => useStompClient('/topic/test', undefined))

    expect(result.current).toHaveProperty('sendMessage')
    expect(result.current).toHaveProperty('isConnected')
  })

  it('should return sendMessage as a function', () => {
    const { result } = renderHook(() => useStompClient('/topic/test', undefined))

    expect(typeof result.current.sendMessage).toBe('function')
  })

  it('should not crash when onMessageReceived callback is undefined', () => {
    const { result } = renderHook(() => useStompClient('/topic/test', undefined))

    expect(result.current).toBeDefined()
    expect(result.current.isConnected).toBe(false)
  })

  it('should not crash when onMessageReceived callback is provided', () => {
    const mockCallback = jest.fn()
    const { result } = renderHook(() =>
      useStompClient('/topic/test', undefined, mockCallback)
    )

    expect(result.current).toBeDefined()
    expect(result.current.isConnected).toBe(false)
  })

  it('should cleanup on unmount without errors', () => {
    const { unmount } = renderHook(() => useStompClient('/topic/test', undefined))

    expect(() => {
      unmount()
    }).not.toThrow()
  })
})
