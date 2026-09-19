export function canReviewFeedback(roles: readonly string[] = []): boolean {
  return roles.includes('Admin') || roles.includes('Moderator');
}

export function canAccessAdminPage(roles: readonly string[] = [], pathname: string): boolean {
  return roles.includes('Admin') || (roles.includes('Moderator') &&
    (pathname === '/admin/feedback' || pathname.startsWith('/admin/feedback/')));
}
