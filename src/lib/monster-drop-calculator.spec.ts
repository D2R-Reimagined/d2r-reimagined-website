import { describe, expect, it } from 'vitest';
import { monsterDrops } from './monster-drop-calculator';
import { calculateDrops, type DropClass, type DropData } from './drop-calculator';
import { readMonsterDropUrl, writeMonsterDropUrl } from './monster-drop-url';
import exported from '../../static/data/keyed/drop-calculator.json';
const settings = {players:1,party:1,magicFind:0,difficulty:2,kind:'all'};
const tc = (Code:string,Picks:number,Entries:DropClass['Entries'],NoDrop=0):DropClass => ({Code,Picks,Entries,NoDrop,Group:'',Level:0,Unique:0,Set:0,Condition:'',QuestFlag:'',QuestFlagEx:''});
function fixture(classes:DropClass[]):DropData {
 return {Items:[],Bases:['a','b'].map(Code=>({Code,NameKey:Code,Level:1,Uber:false,ClassSpecific:false,Quest:false})),Ratios:[],TreasureClasses:classes,
 Sources:[{Id:'mob',NameKey:'Monster',AreaKey:'',Difficulty:2,Kind:'boss',Level:80,TreasureClass:classes[0].Code}]};
}
const run = (data:DropData,kills=100,seed=1) => monsterDrops(data,data.Sources[0],settings,kills,seed,true);
describe('complete monster loot runs',()=>{
 it('keeps mutually exclusive results in one shared run and is seed reproducible',()=>{
  const data=fixture([tc('root',1,[{Code:'a',Weight:1},{Code:'b',Weight:3}])]);
  const report=run(data);
  expect(report.totalDrops).toBe(100);expect(report.emptyKills).toBe(0);
  expect(report.rows.find(r=>r.code==='a')).toMatchObject({chance:0.25,expected:25});
  expect(report.rows.reduce((n,r)=>n+r.count,0)).toBe(100);
  expect(report).toEqual(run(data));
  expect(report.rows.map(r=>r.count)).not.toEqual(run(data,100,2).rows.map(r=>r.count));
 });
 it('counts copies separately from successful kills and enforces the six-item cap',()=>{
  const report=run(fixture([tc('root',9,[{Code:'a',Weight:1}])]));
  expect(report.totalDrops).toBe(600);
  expect(report.rows[0]).toMatchObject({chance:1,expected:600,count:600,successfulKills:100});
 });
 it('preserves ordered picks and unused capacity after no-drop',()=>{
  const data=fixture([tc('root',-7,[{Code:'a',Weight:6},{Code:'b',Weight:1}])]);
  expect(run(data).rows.map(r=>r.code)).toEqual(['a']);
  data.TreasureClasses=[tc('root',-2,[{Code:'empty',Weight:1},{Code:'a',Weight:1}]),tc('empty',1,[],1)];
  expect(run(data).rows[0]).toMatchObject({count:100,expected:100});
 });
 it('applies player no-drop scaling and can show rates without generating loot',()=>{
  const data=fixture([tc('root',1,[{Code:'a',Weight:1}],3)]);
  const report=monsterDrops(data,data.Sources[0],{...settings,players:3},100,1,false);
  expect(report.rows[0]).toMatchObject({chance:0.5,expected:50,count:0});expect(report.simulated).toBe(false);
 });
 it('rejects unsupported conditions and cycles rather than producing partial loot',()=>{
  expect(()=>run(fixture([{...tc('root',1,[{Code:'a',Weight:1}]),QuestFlag:'1'}]))).toThrow('Conditional');
  expect(()=>run(fixture([tc('root',1,[{Code:'root',Weight:1}])]))).toThrow('Cyclic');
 });
 it('matches the item calculator for named quality rolls and keeps the remaining base drops',()=>{
  const data=fixture([tc('root',2,[{Code:'a',Weight:1}])]);
  data.Items=[{Id:'unique:a',NameKey:'Unique A',Code:'a',Quality:'unique',Level:1,Rarity:1,Random:true,Condition:''},
   {Id:'set:a',NameKey:'Set A',Code:'a',Quality:'set',Level:1,Rarity:1,Random:true,Condition:''}];
  data.Ratios=[{Version:1,Uber:0,ClassSpecific:0,Unique:400,UniqueDivisor:1,UniqueMin:6400,Set:160,SetDivisor:2,SetMin:5600}];
  const report=run(data,10000);
  for(const item of data.Items) expect(report.rows.find(r=>r.id===item.Id)!.chance).toBeCloseTo(calculateDrops(data,item,settings)[0].chance!,12);
  expect(report.rows.reduce((n,r)=>n+r.expected,0)).toBeCloseTo(20000,8);
  expect(report.totalDrops).toBe(20000);
 });
 it('calculates and simulates exported Hell Baal with consistent total loot',()=>{
  const data=exported as DropData, source=data.Sources.find(s=>s.NameKey==='Baal Crab'&&s.Difficulty===2&&s.Kind==='boss')!;
  const report=monsterDrops(data,source,settings,100,7,true);
  expect(report.rows.length).toBeGreaterThan(100);
  expect(report.totalDrops).toBeLessThanOrEqual(600);
  expect(report.rows.reduce((n,r)=>n+r.count,0)).toBe(report.totalDrops);
  expect(report.rows.every(r=>r.chance>=0&&r.chance<=1&&r.successfulKills<=100&&r.count>=r.successfulKills)).toBe(true);
  const sample=data.Items.find(i=>i.Id==='unique:Magefist')!;
  expect(report.rows.find(r=>r.id===sample.Id)!.chance).toBeCloseTo(calculateDrops({...data,Sources:[source]},sample,settings)[0].chance!,10);
 },30000);
});
it('round trips simulator settings without changing the item tab or unrelated query state',()=>{
 const url=new URL('https://example.test/data/drop-calculator?item=misc%3Apk1&mode=simulate#loot');
 const state={sourceId:'baal:hell',difficulty:2,kills:100,players:8,party:4,magicFind:350,seed:42};
 const shared=writeMonsterDropUrl(url,state);expect(readMonsterDropUrl(shared)).toEqual(state);expect(shared.searchParams.get('item')).toBe('misc:pk1');expect(shared.hash).toBe('#loot');
 expect(readMonsterDropUrl(new URL('https://example.test/?sim_kills=oops&sim_players=99&sim_party=99&sim_seed=-1'))).toMatchObject({kills:100,players:8,party:8,seed:1});
});
