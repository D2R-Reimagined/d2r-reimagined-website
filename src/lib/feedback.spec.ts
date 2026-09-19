import { beforeEach, describe, expect, it, vi } from 'vitest';
import { canAccessAdminPage, canReviewFeedback } from './admin-access';
vi.mock('$lib/auth', () => ({ apiRequest: vi.fn() }));
import { apiRequest } from '$lib/auth';
import { feedbackTypeLabel, searchFeedback, updateFeedbackStatus } from './feedback';

beforeEach(() => vi.clearAllMocks());

describe('feedback staff access', () => {
  it('allows moderators into feedback without opening other admin pages', () => {
    expect(canReviewFeedback(['Moderator'])).toBe(true);
    expect(canAccessAdminPage(['Moderator'], '/admin/feedback')).toBe(true);
    expect(canAccessAdminPage(['Moderator'], '/admin/feedback/')).toBe(true);
    for (const path of ['/admin/users', '/admin/ladders', '/admin/portals', '/admin/announcements', '/admin/feedback-other']) {
      expect(canAccessAdminPage(['Moderator'], path)).toBe(false);
      expect(canAccessAdminPage(['Admin'], path)).toBe(true);
    }
  });
  it('denies ordinary players and testers', () => {
    for (const roles of [[], ['Tester']]) {
      expect(canReviewFeedback(roles)).toBe(false);
      expect(canAccessAdminPage(roles, '/admin/feedback')).toBe(false);
    }
    expect(canReviewFeedback()).toBe(false);
  });
});

describe('feedback API client', () => {
  it('sends bounded filtered pages as authenticated uncached requests', async () => {
    await searchFeedback({ status: 'archived', type: 'bug', search: ' portal & map ', skip: 25, count: 25 });
    expect(apiRequest).toHaveBeenCalledWith('/admin/feedback?type=bug&status=archived&search=portal+%26+map&skip=25&count=25', { cache: 'no-store' }, true);
  });
  it('omits blank filters when requesting all feedback', async () => {
    await searchFeedback({ status: '', type: '', search: ' ' });
    expect(apiRequest).toHaveBeenCalledWith('/admin/feedback?skip=0&count=25', { cache: 'no-store' }, true);
  });
  it('sends the viewed revision so stale updates cannot overwrite another reviewer', async () => {
    await updateFeedbackStatus({ id: 'report-id', revision: 3 }, 'closed');
    expect(apiRequest).toHaveBeenCalledWith('/admin/feedback/report-id/status', {
      method: 'PUT', body: JSON.stringify({ status: 'closed', revision: 3 })
    }, true);
  });
  it('renders future feedback type names without losing the identifier', () => {
    expect(feedbackTypeLabel('bug')).toBe('Bug report');
    expect(feedbackTypeLabel('suggestion')).toBe('Suggestion');
    expect(feedbackTypeLabel('balance-request')).toBe('Balance request');
  });
});
