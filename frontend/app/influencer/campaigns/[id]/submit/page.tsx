'use client';

/**
 * Deliverable Submission Form Page
 * Allows influencers to submit their campaign deliverables
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InfluencerLayout } from '@/components/influencer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMyCampaigns, submitDeliverable } from '@/lib/api/campaign-influencers';
import { uploadFile } from '@/lib/api/upload';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import type { CampaignInfluencer } from '@/types';

export default function SubmitDeliverablePage() {
  const params = useParams();
  const router = useRouter();
  const campaignInfluencerId = params.id as string;

  const [campaignInfluencer, setCampaignInfluencer] = useState<CampaignInfluencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // Form state
  const [postUrl, setPostUrl] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaignDetails();
  }, [campaignInfluencerId]);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      const campaigns = await getMyCampaigns();
      const campaign = campaigns.find((c) => c.id === campaignInfluencerId);

      if (!campaign) {
        router.push('/influencer/campaigns');
        return;
      }

      if (campaign.status !== 'accepted') {
        router.push(`/influencer/campaigns/${campaignInfluencerId}`);
        return;
      }

      setCampaignInfluencer(campaign);
    } catch (error) {
      console.error('Failed to load campaign details:', error);
      router.push('/influencer/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, screenshot: 'Please select an image file' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, screenshot: 'File size must be less than 5MB' });
      return;
    }

    setScreenshotFile(file);
    setErrors({ ...errors, screenshot: '' });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setScreenshotUrl('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!postUrl.trim()) {
      newErrors.postUrl = 'Post URL is required';
    } else if (!isValidUrl(postUrl)) {
      newErrors.postUrl = 'Please enter a valid URL';
    }

    if (!screenshotFile && !screenshotUrl) {
      newErrors.screenshot = 'Screenshot is required';
    }

    if (!likes.trim()) {
      newErrors.likes = 'Likes count is required';
    } else if (parseInt(likes) < 0) {
      newErrors.likes = 'Likes must be a non-negative number';
    }

    if (!comments.trim()) {
      newErrors.comments = 'Comments count is required';
    } else if (parseInt(comments) < 0) {
      newErrors.comments = 'Comments must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      // Upload screenshot if not already uploaded
      let finalScreenshotUrl = screenshotUrl;
      if (screenshotFile && !screenshotUrl) {
        setUploadingScreenshot(true);
        const uploadResponse = await uploadFile(screenshotFile);
        finalScreenshotUrl = uploadResponse.url;
        setScreenshotUrl(uploadResponse.url);
        setUploadingScreenshot(false);
      }

      // Submit deliverable
      await submitDeliverable(campaignInfluencerId, {
        postUrl: postUrl.trim(),
        screenshotUrl: finalScreenshotUrl,
        likes: parseInt(likes),
        comments: parseInt(comments),
      });

      // Redirect to campaign detail page
      router.push(`/influencer/campaigns/${campaignInfluencerId}`);
    } catch (error: any) {
      console.error('Failed to submit deliverable:', error);
      console.error('Error details:', {
        statusCode: error.statusCode,
        message: error.message,
        error: error.error,
      });
      
      // Handle validation errors from backend
      if (error.statusCode === 400) {
        // NestJS ValidationPipe returns message as array of strings
        if (Array.isArray(error.message)) {
          const newErrors: Record<string, string> = {};
          error.message.forEach((msg: string) => {
            // Parse validation messages like "postUrl must be a URL"
            const lowerMsg = msg.toLowerCase();
            if (lowerMsg.includes('posturl')) {
              newErrors.postUrl = msg;
            } else if (lowerMsg.includes('screenshoturl')) {
              newErrors.screenshot = msg;
            } else if (lowerMsg.includes('likes')) {
              newErrors.likes = msg;
            } else if (lowerMsg.includes('comments')) {
              newErrors.comments = msg;
            }
          });
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
          }
        }
        
        // Show the error message from backend (e.g., workflow transition error)
        setSubmitError(typeof error.message === 'string' ? error.message : 'Validation failed. Please check your inputs.');
        return;
      }
      
      // Show generic error message
      setSubmitError(error.message || 'Failed to submit deliverable. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadingScreenshot(false);
    }
  };

  if (loading) {
    return (
      <InfluencerLayout title="Submit Deliverable" description="Loading...">
        <Card className="p-6">
          <div className="h-96 animate-pulse rounded bg-gray-200" />
        </Card>
      </InfluencerLayout>
    );
  }

  if (!campaignInfluencer) {
    return (
      <InfluencerLayout title="Campaign Not Found">
        <Card className="p-6">
          <p className="text-gray-500">Campaign not found or not available for submission.</p>
        </Card>
      </InfluencerLayout>
    );
  }

  return (
    <InfluencerLayout
      title="Submit Deliverable"
      description={campaignInfluencer.campaign?.title}
    >
      <div className="mx-auto max-w-2xl">
        <Card className="p-6">
          {submitError && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">Failed to submit deliverable</p>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post URL */}
            <div>
              <Label htmlFor="postUrl">
                Post URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postUrl"
                type="url"
                placeholder="https://instagram.com/p/..."
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                className={errors.postUrl ? 'border-red-500' : ''}
              />
              {errors.postUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.postUrl}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter the URL of your published post
              </p>
            </div>

            {/* Screenshot Upload */}
            <div>
              <Label htmlFor="screenshot">
                Screenshot <span className="text-red-500">*</span>
              </Label>
              
              {!screenshotPreview ? (
                <div className="mt-2">
                  <label
                    htmlFor="screenshot"
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      errors.screenshot
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      Click to upload screenshot
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative mt-2">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="max-h-96 w-full rounded-lg border border-gray-200 object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {errors.screenshot && (
                <p className="mt-1 text-sm text-red-500">{errors.screenshot}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Upload a screenshot of your published post
              </p>
            </div>

            {/* Engagement Metrics */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="likes">
                  Likes <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="likes"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  className={errors.likes ? 'border-red-500' : ''}
                />
                {errors.likes && (
                  <p className="mt-1 text-sm text-red-500">{errors.likes}</p>
                )}
              </div>

              <div>
                <Label htmlFor="comments">
                  Comments <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="comments"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className={errors.comments ? 'border-red-500' : ''}
                />
                {errors.comments && (
                  <p className="mt-1 text-sm text-red-500">{errors.comments}</p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Before submitting:</p>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    <li>Ensure your post is published and publicly accessible</li>
                    <li>Double-check the engagement metrics are accurate</li>
                    <li>Make sure the screenshot clearly shows your post</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting || uploadingScreenshot}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || uploadingScreenshot}
                className="flex-1"
              >
                {uploadingScreenshot ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Deliverable'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </InfluencerLayout>
  );
}
