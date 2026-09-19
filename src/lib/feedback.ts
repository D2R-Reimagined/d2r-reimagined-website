import { apiRequest } from '$lib/auth';

export type FeedbackStatus = 'open' | 'closed' | 'archived';

export interface Feedback {
  id: string;
  type: string;
  message: string;
  userId?: string | null;
  userDisplayName?: string | null;
  source?: string | null;
  plugin?: string | null;
  pluginVersion?: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  status: FeedbackStatus;
  revision: number;
  statusChangedByUserId?: string | null;
}

export interface FeedbackPage {
  items: Feedback[];
  total: number;
  skip: number;
  count: number;
}

export function getFeedbackTypes(): Promise<string[]> {
  return apiRequest<string[]>('/feedback/types');
}

export function searchFeedback(query: { type?: string; status?: FeedbackStatus | ''; search?: string; skip?: number; count?: number } = {}): Promise<FeedbackPage> {
  const params = new URLSearchParams();
  if (query.type) params.set('type', query.type);
  if (query.status) params.set('status', query.status);
  if (query.search?.trim()) params.set('search', query.search.trim());
  params.set('skip', String(query.skip ?? 0));
  params.set('count', String(query.count ?? 25));
  return apiRequest<FeedbackPage>(`/admin/feedback?${params}`, { cache: 'no-store' }, true);
}

export function updateFeedbackStatus(feedback: Pick<Feedback, 'id' | 'revision'>, status: FeedbackStatus): Promise<Feedback> {
  return apiRequest<Feedback>(`/admin/feedback/${encodeURIComponent(feedback.id)}/status`, {
    method: 'PUT', body: JSON.stringify({ status, revision: feedback.revision })
  }, true);
}

export function feedbackTypeLabel(type: string): string {
  if (type === 'bug') return 'Bug report';
  if (type === 'suggestion') return 'Suggestion';
  return type.charAt(0).toUpperCase() + type.slice(1).replaceAll('-', ' ');
}
