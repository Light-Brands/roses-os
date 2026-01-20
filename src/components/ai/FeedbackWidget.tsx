'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type FeedbackType = 'bug' | 'feature' | 'general' | 'praise';
type FeedbackSentiment = 'positive' | 'negative' | 'neutral';

interface FeedbackData {
  type: FeedbackType;
  message: string;
  email?: string;
  pageUrl: string;
  userAgent: string;
  timestamp: string;
  sentiment?: FeedbackSentiment;
  aiSummary?: string;
}

interface FeedbackWidgetProps {
  /** API endpoint for submitting feedback */
  apiEndpoint?: string;
  /** Enable AI sentiment analysis */
  enableAI?: boolean;
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left';
  /** Show email field */
  collectEmail?: boolean;
  /** Callback when feedback is submitted */
  onSubmit?: (data: FeedbackData) => void;
  /** Custom trigger button */
  trigger?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

const feedbackTypes: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'bug', label: 'Report a bug', icon: '🐛' },
  { value: 'feature', label: 'Request feature', icon: '✨' },
  { value: 'general', label: 'General feedback', icon: '💬' },
  { value: 'praise', label: 'Share praise', icon: '❤️' },
];

/**
 * AI-Powered Feedback Widget
 *
 * Features:
 * - Collects user feedback with categorization
 * - AI-powered sentiment analysis
 * - Automatic page context capture
 * - Smooth animations
 * - Accessible keyboard navigation
 */
export function FeedbackWidget({
  apiEndpoint = '/api/feedback',
  enableAI = true,
  position = 'bottom-right',
  collectEmail = false,
  onSubmit,
  trigger,
  className,
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'message' | 'success'>('type');
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const positionClasses = {
    'bottom-right': 'right-4 bottom-4',
    'bottom-left': 'left-4 bottom-4',
  };

  const reset = useCallback(() => {
    setStep('type');
    setFeedbackType(null);
    setMessage('');
    setEmail('');
    setAiInsight(null);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(reset, 300);
  }, [reset]);

  const handleTypeSelect = (type: FeedbackType) => {
    setFeedbackType(type);
    setStep('message');
  };

  const analyzeSentiment = async (text: string): Promise<FeedbackSentiment> => {
    // Simple client-side sentiment detection
    const positiveWords = ['love', 'great', 'amazing', 'awesome', 'excellent', 'thank', 'helpful'];
    const negativeWords = ['hate', 'terrible', 'awful', 'broken', 'bug', 'issue', 'problem', 'frustrat'];

    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  };

  const handleSubmit = async () => {
    if (!feedbackType || !message.trim()) return;

    setIsSubmitting(true);

    try {
      // Analyze sentiment client-side for immediate feedback
      const sentiment = await analyzeSentiment(message);

      const feedbackData: FeedbackData = {
        type: feedbackType,
        message: message.trim(),
        email: email.trim() || undefined,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sentiment,
      };

      // Submit to API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feedbackData,
          enableAI,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Show AI insight if available
        if (result.aiInsight) {
          setAiInsight(result.aiInsight);
        }

        onSubmit?.({ ...feedbackData, aiSummary: result.aiSummary });
        setStep('success');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      // Still show success for better UX, but log the error
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        'fixed z-50',
        positionClasses[position],
        className
      )}
    >
      {/* Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {trigger || (
              <Button
                variant="gradient"
                size="lg"
                onClick={() => setIsOpen(true)}
                className="rounded-full shadow-lg hover:shadow-xl"
                icon={<MessageSquare className="w-5 h-5" />}
                aria-label="Open feedback form"
              >
                Feedback
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'w-80 sm:w-96',
              'bg-white dark:bg-neutral-900',
              'rounded-2xl shadow-2xl',
              'border border-neutral-200 dark:border-neutral-800',
              'overflow-hidden'
            )}
            role="dialog"
            aria-label="Feedback form"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {step === 'type' && 'Send Feedback'}
                {step === 'message' && feedbackTypes.find(t => t.value === feedbackType)?.label}
                {step === 'success' && 'Thank You!'}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Type */}
                {step === 'type' && (
                  <motion.div
                    key="type"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTypeSelect(type.value)}
                        className={cn(
                          'p-4 rounded-xl text-left',
                          'border border-neutral-200 dark:border-neutral-700',
                          'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                          'transition-all duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500'
                        )}
                      >
                        <span className="text-2xl block mb-2">{type.icon}</span>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 2: Write Message */}
                {step === 'message' && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us more..."
                      rows={4}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl resize-none',
                        'bg-neutral-50 dark:bg-neutral-800',
                        'border border-neutral-200 dark:border-neutral-700',
                        'text-neutral-900 dark:text-white',
                        'placeholder:text-neutral-400',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'transition-all duration-200'
                      )}
                      autoFocus
                    />

                    {collectEmail && (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email (optional)"
                        className={cn(
                          'w-full px-4 py-3 rounded-xl',
                          'bg-neutral-50 dark:bg-neutral-800',
                          'border border-neutral-200 dark:border-neutral-700',
                          'text-neutral-900 dark:text-white',
                          'placeholder:text-neutral-400',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500',
                          'transition-all duration-200'
                        )}
                      />
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setStep('type')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!message.trim() || isSubmitting}
                        loading={isSubmitting}
                        icon={<Send className="w-4 h-4" />}
                        iconPosition="right"
                        className="flex-1"
                      >
                        Send
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      Feedback received!
                    </p>
                    <p className="text-sm text-neutral-500 mb-4">
                      We appreciate you taking the time to help us improve.
                    </p>

                    {/* AI Insight */}
                    {aiInsight && (
                      <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-left mb-4">
                        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xs font-medium">AI Insight</span>
                        </div>
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                          {aiInsight}
                        </p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={handleClose}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeedbackWidget;
