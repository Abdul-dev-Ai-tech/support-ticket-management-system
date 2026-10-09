import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { createTicket } from '../api/ticketApi'
import AlertBanner from '../components/AlertBanner'

const ticketSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters'),
  category: z.enum(['technical', 'billing', 'account', 'general'], {
    required_error: 'Please select a category',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority',
  }),
})

const CreateTicket = ({ showToast }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: '',
    },
  })

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      showToast?.('Ticket created successfully', 'success')
      navigate('/tickets', { state: { successMessage: 'Ticket created successfully' } })
    },
    onError: (error) => {
      setSubmitError(
        error?.response?.data?.detail ||
          error?.message ||
          'Unable to create ticket. Please try again.',
      )
    },
  })

  const onSubmit = (data) => {
    setSubmitError('')
    mutation.mutate(data)
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">New Request</span>
          <h1 className="page-title">Create Ticket</h1>
          <p className="page-description">Tell us what you need help with and track its progress.</p>
        </div>
      </div>

      <section className="page-panel">
        <AlertBanner type="error" message={submitError} />

        <form className="premium-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="premium-field">
            <label htmlFor="title">Title</label>
            <input id="title" className="premium-input" type="text" placeholder="Unable to reset password" {...register('title')} />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </div>

          <div className="premium-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="premium-textarea"
              rows="6"
              placeholder="Tell us what is happening..."
              {...register('description')}
            />
            {errors.description && <span className="field-error">{errors.description.message}</span>}
          </div>

          <div className="form-row">
            <div className="premium-field">
              <label htmlFor="category">Category</label>
              <select id="category" className="premium-select" defaultValue="" {...register('category')}>
                <option value="" disabled>
                  Select category
                </option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="account">Account</option>
                <option value="general">General</option>
              </select>
              {errors.category && <span className="field-error">{errors.category.message}</span>}
            </div>

            <div className="premium-field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" className="premium-select" defaultValue="" {...register('priority')}>
                <option value="" disabled>
                  Select priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && <span className="field-error">{errors.priority.message}</span>}
            </div>
          </div>

          <div className="action-row">
            <Link to="/tickets" className="page-button page-button-secondary">
              Cancel
            </Link>

            <button type="submit" className="page-button page-button-primary" disabled={!isValid || isSubmitting || mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default CreateTicket
