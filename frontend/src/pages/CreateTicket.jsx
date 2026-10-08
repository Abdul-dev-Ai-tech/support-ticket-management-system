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
    formState: { errors, isSubmitting },
  } = useForm({
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
    <div className="page-card form-card">
      <div className="page-header compact">
        <div>
          <p className="eyebrow">New ticket</p>
          <h1>Create Ticket</h1>
        </div>
        <Link to="/tickets" className="secondary-button">
          Back to tickets
        </Link>
      </div>

      <AlertBanner type="error" message={submitError} />

      <form onSubmit={handleSubmit(onSubmit)} className="ticket-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" placeholder="Unable to reset password" {...register('title')} />
          {errors.title && <p className="field-error">{errors.title.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="6"
            placeholder="Tell us what is happening..."
            {...register('description')}
          />
          {errors.description && <p className="field-error">{errors.description.message}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" defaultValue="" {...register('category')}>
              <option value="" disabled>
                Select category
              </option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>
            {errors.category && <p className="field-error">{errors.category.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" defaultValue="" {...register('priority')}>
              <option value="" disabled>
                Select priority
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && <p className="field-error">{errors.priority.message}</p>}
          </div>
        </div>

        <div className="form-actions">
          <Link to="/tickets" className="secondary-button secondary-button-light">
            Cancel
          </Link>
          <button type="submit" className="primary-button submit-button" disabled={isSubmitting || mutation.isPending}>
            {isSubmitting || mutation.isPending ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTicket
