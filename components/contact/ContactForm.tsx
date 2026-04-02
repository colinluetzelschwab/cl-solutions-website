'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FormData {
  name: string
  email: string
  phone: string
  businessType: string
  message: string
  budgetRange: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    message: '',
    budgetRange: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters'
    }

    if (!formData.budgetRange) {
      newErrors.budgetRange = 'Please select a budget range'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setStatus('loading')
    setStatusMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setStatusMessage("Thank you! We'll get back to you within 24 hours.")
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessType: '',
          message: '',
          budgetRange: '',
        })
      } else {
        setStatus('error')
        setStatusMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('Failed to send message. Please try again.')
    }
  }

  return (
    <section className="w-full bg-background-primary py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
              Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-background-surface border-border-default text-text-primary rounded-none ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full bg-background-surface border-border-default text-text-primary rounded-none ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
              Phone (optional)
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-background-surface border-border-default text-text-primary rounded-none"
            />
          </div>

          {/* Business Type */}
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-text-primary mb-2">
              Business type *
            </label>
            <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value || '' })}>
              <SelectTrigger className={`w-full bg-background-surface border-border-default text-text-primary rounded-none ${errors.businessType ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="bg-background-surface border-border-default">
                <SelectItem value="local-service">Local service business</SelectItem>
                <SelectItem value="restaurant">Restaurant or hospitality</SelectItem>
                <SelectItem value="consultant">Consultant or freelancer</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="real-estate">Real estate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
              Message * (minimum 20 characters)
            </label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full bg-background-surface border-border-default text-text-primary rounded-none ${
                errors.message ? 'border-red-500' : ''
              }`}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* Budget Range */}
          <div>
            <label htmlFor="budgetRange" className="block text-sm font-medium text-text-primary mb-2">
              Budget range *
            </label>
            <Select value={formData.budgetRange} onValueChange={(value) => setFormData({ ...formData, budgetRange: value || '' })}>
              <SelectTrigger className={`w-full bg-background-surface border-border-default text-text-primary rounded-none ${errors.budgetRange ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent className="bg-background-surface border-border-default">
                <SelectItem value="under-1000">Under CHF 1,000</SelectItem>
                <SelectItem value="1000-2500">CHF 1,000–2,500</SelectItem>
                <SelectItem value="2500-5000">CHF 2,500–5,000</SelectItem>
                <SelectItem value="5000-plus">CHF 5,000+</SelectItem>
              </SelectContent>
            </Select>
            {errors.budgetRange && <p className="text-red-500 text-sm mt-1">{errors.budgetRange}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full h-12 md:h-14 bg-accent-blue text-text-primary hover:bg-accent-blue-hover font-medium text-base md:text-lg rounded-none transition-colors duration-200"
          >
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </Button>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {statusMessage}
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {statusMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
