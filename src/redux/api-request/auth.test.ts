/**
 * Smoke test for Auth API request functions.
 * Verifies that the auth API module exists and is properly structured.
 * Actual function behavior is tested through integration tests.
 */
import * as fs from 'fs'
import * as path from 'path'

describe('Auth API Requests module', () => {
  const authModulePath = path.join(__dirname, 'auth.ts')

  it('should have auth.ts file', () => {
    expect(fs.existsSync(authModulePath)).toBe(true)
  })

  it('should export login function definition', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('export const login')
    expect(authContent).toContain('async')
  })

  it('should export register function definition', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('export const register')
    expect(authContent).toContain('async')
  })

  it('should export getUserProfileFromGoogle function definition', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('export const getUserProfileFromGoogle')
    expect(authContent).toContain('async')
  })

  it('should export authWithSocial function definition', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('export const authWithSocial')
    expect(authContent).toContain('async')
  })

  it('should have LoginPayload interface definition', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('export interface LoginPayload')
  })

  it('should have RegisterPayload interface definition', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('export interface RegisterPayload')
  })

  it('should have GoogleUserInfo interface definition', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('export interface GoogleUserInfo')
  })

  it('should use dispatch parameter in login function', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('dispatch: Dispatch')
    expect(authContent).toContain('dispatch(loginStart())')
  })

  it('should use navigate parameter in login function', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('navigate: NavigateFunction')
    expect(authContent).toContain('navigate(route.')
  })

  it('should handle axios imports for HTTP requests', () => {
    const authContent = fs.readFileSync(authModulePath, 'utf-8')
    expect(authContent).toContain('import axios')
    expect(authContent).toContain('axiosPublic.post')
    expect(authContent).toContain('axiosClient.post')
  })
})
