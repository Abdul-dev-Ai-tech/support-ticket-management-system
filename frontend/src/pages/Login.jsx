import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { getMe, login } from '../api/authApi'
import { setAuthToken } from '../api/axiosInstance'
import AlertBanner from '../components/AlertBanner'
import AuthLayout from '../components/auth/AuthLayout'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Login = ({ setUser, showToast }) => {
  const navigate = useNavigate()
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
    onSuccess: async (data) => {
      setAuthToken(data.access_token)

      try {
        const currentUser = await getMe()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      }

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
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Manage your support queue with clarity and speed."
      footer={
        <>
          Need an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <AlertBanner type="error" message={submitError} />

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
            />
            <button type="button" className="inline-toggle" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <button type="submit" className="auth-submit" disabled={isSubmitting || mutation.isPending}>
          {isSubmitting || mutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
