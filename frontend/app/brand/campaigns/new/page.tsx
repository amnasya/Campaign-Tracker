'use client';

/**
 * Create new campaign page
 * Form for creating a new campaign with validation
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { BrandLayout } from '@/components/brand/BrandLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCampaign } from '@/lib/api/campaigns';
import type { CreateCampaignDto } from '@/lib/api/campaigns';

interface FormErrors {
  title?: string;
  brief?: string;
  budget?: string;
  deadline?: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCampaignDto>({
    title: '',
    brief: '',
    budget: 0,
    deadline: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Brief validation
    if (!formData.brief.trim()) {
      newErrors.brief = 'Brief is required';
    } else if (formData.brief.length < 10) {
      newErrors.brief = 'Brief must be at least 10 characters';
    }

    // Budget validation
    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    // Deadline validation
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createCampaign(formData);
      router.push('/brand/campaigns');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof CreateCampaignDto,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <BrandLayout title="Create Campaign" description="Set up a new influencer campaign">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Campaign Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Summer Product Launch"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  aria-invalid={!!errors.title}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Brief */}
              <div className="space-y-2">
                <Label htmlFor="brief">
                  Campaign Brief <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="brief"
                  placeholder="Describe your campaign goals, target audience, and key messages..."
                  value={formData.brief}
                  onChange={(e) => handleChange('brief', e.target.value)}
                  rows={6}
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={!!errors.brief}
                />
                {errors.brief && (
                  <p className="text-sm text-red-600">{errors.brief}</p>
                )}
              </div>

              {/* Budget and Deadline Row */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget">
                    Budget (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.budget || ''}
                      onChange={(e) =>
                        handleChange('budget', parseFloat(e.target.value) || 0)
                      }
                      className="pl-7"
                      aria-invalid={!!errors.budget}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-sm text-red-600">{errors.budget}</p>
                  )}
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline">
                    Deadline <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    aria-invalid={!!errors.deadline}
                    disabled={isSubmitting}
                  />
                  {errors.deadline && (
                    <p className="text-sm text-red-600">{errors.deadline}</p>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
}
