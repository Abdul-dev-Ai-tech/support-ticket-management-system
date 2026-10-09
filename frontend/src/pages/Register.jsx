import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { register as registerUser } from '../api/authApi'
import AlertBanner from '../components/AlertBanner'
import AuthLayout from '../components/auth/AuthLayout'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Register = ({ showToast }) => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      showToast?.('Account created successfully. Please sign in.', 'success')
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      setSubmitError(error?.response?.data?.detail || error?.message || 'Registration failed. Please try again.')
    },
  })

  const onSubmit = (data) => {
    setSubmitError('')
    mutation.mutate(data)
  }

  return (
    <AuthLayout type="register">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <span className="auth-eyebrow">GET STARTED</span>
        <h1>Create account</h1>
        <p className="auth-description">Start managing your support tickets today.</p>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input className="form-input" id="name" type="text" placeholder="John Smith" {...register('name')} />
          {errors.name && <span className="auth-error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input className="form-input" id="register-email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <span className="auth-error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <div className="password-wrap">
            <input
              className="form-input"
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
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
          {mutation.isPending ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default Register
