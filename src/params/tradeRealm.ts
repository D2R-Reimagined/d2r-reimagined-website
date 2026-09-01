import type { ParamMatcher } from '@sveltejs/kit';

const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export const match: ParamMatcher = (param) => Boolean(param) && !uuid.test(param);
