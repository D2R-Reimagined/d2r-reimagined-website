export function canManageServers(roles: readonly string[] = []): boolean {
  return roles.includes('Admin');
}

export function canReviewFeedback(roles: readonly string[] = []): boolean {
  return roles.includes('Admin') || roles.includes('Moderator');
}

// Moderators may ban players from global chat; lobby hosting bans stay with admins.
const moderatorPages = ['/admin/feedback', '/admin/chat-bans'];

export function canAccessAdminPage(roles: readonly string[] = [], pathname: string): boolean {
  return roles.includes('Admin') || (roles.includes('Moderator') &&
    moderatorPages.some((page) => pathname === page || pathname.startsWith(`${page}/`)));
}
