import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { getTicketById, updateTicket } from '../api/ticketApi'
import AlertBanner from '../components/AlertBanner'
import Loading from '../components/Loading'

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

const EditTicket = ({ showToast }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState('')

  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketById(id),
    enabled: Boolean(id),
  })

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

  useEffect(() => {
    if (ticket) {
      reset({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
      })
    }
  }, [ticket, reset])

  const mutation = useMutation({
    mutationFn: (data) => updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      showToast?.('Ticket updated successfully', 'success')
      navigate(`/tickets/${id}`, {
        state: { successMessage: 'Ticket updated successfully' },
      })
    },
    onError: (error) => {
      setSubmitError(
        error?.response?.data?.detail ||
          error?.message ||
          'Unable to update ticket. Please try again.',
      )
    },
  })

  const onSubmit = (data) => {
    setSubmitError('')
    mutation.mutate(data)
  }

  if (isLoading) {
    return <Loading message="Loading ticket..." />
  }

  if (isError) {
    return (
      <div className="message-box error">
        <h2>Unable to edit ticket</h2>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Edit Ticket</span>
          <h1 className="page-title">Update ticket</h1>
          <p className="page-description">Adjust the details for this support request.</p>
        </div>

        <div className="action-row">
          <Link to={`/tickets/${ticket.id}`} className="page-button page-button-secondary">
            Back to ticket
          </Link>
        </div>
      </div>

      <section className="page-panel">
        <AlertBanner type="error" message={submitError} />

        <form className="premium-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="premium-field">
            <label htmlFor="title">Title</label>
            <input id="title" className="premium-input" type="text" {...register('title')} />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </div>

          <div className="premium-field">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="premium-textarea" rows="6" {...register('description')} />
            {errors.description && <span className="field-error">{errors.description.message}</span>}
          </div>

          <div className="form-row">
            <div className="premium-field">
              <label htmlFor="category">Category</label>
              <select id="category" className="premium-select" {...register('category')}>
                <option value="">Select category</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="account">Account</option>
                <option value="general">General</option>
              </select>
              {errors.category && <span className="field-error">{errors.category.message}</span>}
            </div>

            <div className="premium-field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" className="premium-select" {...register('priority')}>
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && <span className="field-error">{errors.priority.message}</span>}
            </div>
          </div>

          <div className="action-row">
            <Link to={`/tickets/${ticket.id}`} className="page-button page-button-secondary">
              Cancel
            </Link>

            <button type="submit" className="page-button page-button-primary" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? 'Updating...' : 'Update Ticket'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default EditTicket
