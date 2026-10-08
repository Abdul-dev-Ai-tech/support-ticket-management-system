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
    <AuthLayout
      eyebrow="Create account"
      title="Create your account"
      subtitle="Start managing your support tickets in one place."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <AlertBanner type="error" message={submitError} />

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="John Smith" {...register('name')} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <div className="password-wrap">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              {...register('password')}
            />
            <button type="button" className="inline-toggle" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <button type="submit" className="auth-submit" disabled={isSubmitting || mutation.isPending}>
          {isSubmitting || mutation.isPending ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register
