import { defineParams } from '@sveltejs/kit/params';

const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const matchTradeRealm = (param: string) => Boolean(param) && !uuid.test(param);

const uuid2 = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const matchUuid = (param: string) => uuid2.test(param);

export const params = defineParams({
	tradeRealm: (param) => (matchTradeRealm(param) ? param : undefined),
	uuid: (param) => (matchUuid(param) ? param : undefined)
});
