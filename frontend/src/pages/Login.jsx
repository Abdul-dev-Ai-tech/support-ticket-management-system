import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { login } from '../api/authApi'
import { setAuthToken } from '../api/axiosInstance'
import AlertBanner from '../components/AlertBanner'
import AuthLayout from '../components/auth/AuthLayout'

const TOKEN_KEY = 'ticketflow_token'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Login = ({ setUser, showToast }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const token = response?.access_token ?? response?.data?.access_token

      if (!token) {
        throw new Error('Login succeeded but no access token was returned.')
      }

      localStorage.setItem(TOKEN_KEY, token)
      setAuthToken(token)

      queryClient.invalidateQueries({ queryKey: ['current-user'] })

      setUser?.(null)
      showToast?.('Welcome back! You are now signed in.', 'success')
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      setSubmitError(error?.response?.data?.detail || error?.message || 'Login failed. Please try again.')
    },
  })

  const onSubmit = (data) => {
    setSubmitError('')
    mutation.mutate(data)
  }

  return (
    <AuthLayout type="login">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <span className="auth-eyebrow">WELCOME BACK</span>
        <h1>Sign in</h1>
        <p className="auth-description">Enter your account details to continue.</p>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input className="form-input" id="email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <span className="auth-error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              className="form-input"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
            />
            <button
              type="button"
              className="inline-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <span className="auth-error">{errors.password.message}</span>}
        </div>

        {submitError ? <AlertBanner type="error" message={submitError} /> : null}

        <button type="submit" className="auth-submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default Login
