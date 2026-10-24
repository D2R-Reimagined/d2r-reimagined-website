import { describe, expect, it } from 'vitest';
import { monsterDrops, treasureClassSource } from './monster-drop-calculator';
import { calculateDrops, type DropClass, type DropData } from './drop-calculator';
import { readMonsterDropUrl, writeMonsterDropUrl } from './monster-drop-url';
import { monsterDropTsv } from './monster-drop-export';
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
  expect(report.totalDrops).toBe(100);expect(report.itemDrops).toBe(100);
  expect(report.rows.find(r=>r.code==='a')).toMatchObject({chance:0.25,expected:25});
  expect(report.rows.reduce((n,r)=>n+r.count,0)).toBe(100);
  expect(report).toEqual(run(data));
  expect(report.rows.map(r=>r.count)).not.toEqual(run(data,100,2).rows.map(r=>r.count));
 });
 it('counts every copy and enforces the six-item cap',()=>{
  const report=run(fixture([tc('root',9,[{Code:'a',Weight:1}])]));
  expect(report.totalDrops).toBe(600);
  expect(report.rows[0]).toMatchObject({chance:1,expected:600,count:600});
  expect(report.rows[0]).not.toHaveProperty('successfulKills');
 });
 it('preserves ordered picks and unused capacity after no-drop',()=>{
  const data=fixture([tc('root',-7,[{Code:'a',Weight:6},{Code:'b',Weight:1}])]);
  expect(run(data).rows.map(r=>r.code)).toEqual(['a']);
  data.TreasureClasses=[tc('root',-2,[{Code:'empty',Weight:1},{Code:'a',Weight:1}]),tc('empty',1,[],1)];
  const report=run(data);
  expect(report.rows.find(r=>r.code==='a')).toMatchObject({count:100,expected:100});
  expect(report.rows.find(r=>r.id==='nodrop')).toMatchObject({chance:1,count:100,expected:100});
 });
 it('reports NoDrop and Void picks as table results without using item slots',()=>{
  const data=fixture([tc('root',1,[{Code:'a',Weight:1},{Code:'Void',Weight:1}],2),tc('Void',0,[])]);
  const report=run(data,10000);
  expect(report.rows.find(r=>r.id==='nodrop')).toMatchObject({nameKey:'NoDrop',quality:'no drop',chance:0.5,expected:5000});
  expect(report.rows.find(r=>r.id==='void')).toMatchObject({nameKey:'Void',quality:'no drop',chance:0.25,expected:2500});
  expect(report.rows.find(r=>r.code==='a')).toMatchObject({chance:0.25,expected:2500});
  expect(report.totalDrops).toBe(10000);expect(report.rows.reduce((n,r)=>n+r.count,0)).toBe(10000);
  expect(report.itemDrops).toBe(report.rows.find(r=>r.code==='a')!.count);
  for(const row of report.rows) expect(row.count/10000).toBeCloseTo(row.chance,1);
  data.TreasureClasses=[tc('root',-7,[{Code:'Void',Weight:1},{Code:'a',Weight:6}]),tc('Void',0,[])];
  const capped=run(data);
  expect(capped.rows.find(r=>r.code==='a')).toMatchObject({chance:1,expected:600,count:600});
  expect(capped.rows.find(r=>r.id==='void')).toMatchObject({chance:1,expected:100,count:100});
  expect(capped).toMatchObject({itemDrops:600,totalDrops:700});
 });
 it('applies player no-drop scaling and can show rates without generating loot',()=>{
  const data=fixture([tc('root',1,[{Code:'a',Weight:1}],3)]);
  const report=monsterDrops(data,data.Sources[0],{...settings,players:3},100,1,false);
  expect(report.rows.find(r=>r.code==='a')).toMatchObject({chance:0.5,expected:50,count:0});expect(report.simulated).toBe(false);
  expect(report.rows.find(r=>r.id==='nodrop')).toMatchObject({chance:0.5,expected:50,count:0});
 });
 it('treats game-completion quest gates as met',()=>{
  const data=fixture([tc('root',-2,[{Code:'completed',Weight:1},{Code:'b',Weight:1}]),{...tc('completed',1,[{Code:'a',Weight:1}]),QuestFlagEx:'40'}]);
  expect(run(data).rows.map(r=>[r.code,r.chance])).toEqual([['a',1],['b',1]]);
  const hell=exported as DropData, champ=hell.Sources.find(s=>s.Difficulty===2&&s.Kind==='champion'&&s.TreasureClass.includes('Champ'))!;
  expect(monsterDrops(hell,champ,settings,10,1,true).rows.length).toBeGreaterThan(0);
 });
 it('rejects unsupported conditions and cycles rather than producing partial loot',()=>{
  expect(()=>run(fixture([{...tc('root',1,[{Code:'a',Weight:1}]),QuestFlag:'1'}]))).toThrow('Conditional');
  expect(()=>run(fixture([tc('root',1,[{Code:'root',Weight:1}])]))).toThrow('Cyclic');
 });
 it('uses resolved difficulty metadata for nested gates and keeps runtime gates unsupported',()=>{
  const nonliteral="\"cond('Difficulty', nightmare) + cond('Difficulty', hell)\"";
  const gated=(extra:Partial<DropClass>):DropClass=>({...tc('gated',1,[{Code:'a',Weight:1}]),...extra});
  const data=(extra:Partial<DropClass>)=>fixture([tc('root',-2,[{Code:'outer',Weight:1},{Code:'b',Weight:1}]),tc('outer',1,[{Code:'gated',Weight:1}]),gated(extra)]);
  const at=(d:DropData,difficulty:number)=>monsterDrops(d,treasureClassSource('root',difficulty,80),{...settings,difficulty},100,1,true);
  const resolved=data({Condition:nonliteral,ConditionDifficulties:[1,2],ConditionRuntime:false});
  // Off on Normal: the gated class is an empty Void pick, and the b slot is unaffected.
  expect(at(resolved,0).rows.map(r=>[r.id,r.chance])).toEqual([['void',1],['base:b',1]]);
  for(const d of [1,2]) expect(at(resolved,d).rows.map(r=>[r.id,r.chance])).toEqual([['base:a',1],['base:b',1]]);
  // The item calculator agrees with the full-loot graph on every difficulty.
  resolved.Items=[{Id:'misc:a',NameKey:'a',Code:'a',Quality:'misc',Level:1,Rarity:1,Random:true,Condition:''}];
  for(const d of [0,1,2]) expect(calculateDrops({...resolved,Sources:[treasureClassSource('root',d,80)]},resolved.Items[0],{...settings,difficulty:d})[0].chance).toBe(at(resolved,d).rows.find(r=>r.code==='a')?.chance??0);
  for(const d of [0,1,2]) expect(at(data({Condition:nonliteral,ConditionDifficulties:[]}),d).rows.some(r=>r.code==='a')).toBe(false);
  expect(()=>at(data({Condition:nonliteral}),2)).toThrow('Conditional');
  expect(()=>at(data({Condition:"(stat('heraldtier'.accr) >=4) ",ConditionRuntime:true}),2)).toThrow('Conditional');
  expect(at(data({Condition:"\"cond('Difficulty', hell)\""}),1).rows.some(r=>r.code==='a')).toBe(false);
 });
 it('runs exported Desecrated classes only where their resolved difficulties allow and refuses heralds',()=>{
  const hell=exported as DropData;
  const desecrated=hell.TreasureClasses.find(t=>t.ConditionDifficulties?.length&&!t.ConditionRuntime)!;
  expect(desecrated).toBeDefined();
  // Whichever difficulties the export resolved the gate to: on where listed, an empty Void pick elsewhere.
  const on=desecrated.ConditionDifficulties!, off=[0,1,2].filter(d=>!on.includes(d));
  const run=(difficulty:number)=>monsterDrops(hell,treasureClassSource(desecrated.Code,difficulty,85),{...settings,difficulty},10,1,false);
  for(const d of on) expect(run(d).rows.some(r=>r.quality!=='no drop'),`${desecrated.Code} ${d}`).toBe(true);
  for(const d of off) expect(run(d).rows.map(r=>r.id),`${desecrated.Code} ${d}`).toEqual(['void']);
  const parent=hell.TreasureClasses.find(t=>!t.Condition&&t.Entries.some(e=>e.Code===desecrated.Code)&&!t.Code.includes('Herald'));
  if(parent) expect(monsterDrops(hell,treasureClassSource(parent.Code,on[0],85),{...settings,difficulty:on[0]},10,1,false).rows.length).toBeGreaterThan(0);
  const herald=hell.TreasureClasses.find(t=>t.ConditionRuntime)!;
  expect(()=>monsterDrops(hell,treasureClassSource(herald.Code,2,85),settings,10,1,false)).toThrow('Conditional');
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
 it('collapses random armor and weapon bases, uniques and sets into exact at-least-one groups',()=>{
  const data=fixture([tc('root',2,[{Code:'a',Weight:1},{Code:'b',Weight:1}]),tc('armo3',1,[{Code:'a',Weight:1}]),tc('weap3',1,[{Code:'b',Weight:1}])]);
  data.Bases.forEach(b=>b.Equipment=true);
  data.Items=[{Id:'unique:a',NameKey:'Unique A',Code:'a',Quality:'unique',Level:1,Rarity:1,Random:true,Condition:''},
   {Id:'unique:b',NameKey:'Unique B',Code:'b',Quality:'unique',Level:1,Rarity:1,Random:true,Condition:''},
   {Id:'set:a',NameKey:'Set A',Code:'a',Quality:'set',Level:1,Rarity:1,Random:true,Condition:''}];
  data.Ratios=[{Version:1,Uber:0,ClassSpecific:0,Unique:400,UniqueDivisor:1,UniqueMin:6400,Set:160,SetDivisor:2,SetMin:5600}];
  const plain=run(data,1000), collapsed=monsterDrops(data,data.Sources[0],settings,1000,1,true,{collapse:true});
  expect(collapsed.rows.map(r=>r.id).sort()).toEqual(['group:armor','group:set','group:unique','group:weapon']);
  const unique=collapsed.rows.find(r=>r.id==='group:unique')!, uniques=plain.rows.filter(r=>r.quality==='unique');
  expect(unique.expected).toBeCloseTo(uniques.reduce((n,r)=>n+r.expected,0),10);
  expect(unique.count).toBe(uniques.reduce((n,r)=>n+r.count,0));
  // At least one of two independent picks, not the sum of the per-item chances.
  const u=uniques.reduce((n,r)=>n+r.expected,0)/1000/2;
  expect(unique.chance).toBeCloseTo(1-(1-u)**2,12);
  expect(collapsed.totalDrops).toBe(plain.totalDrops);
  expect(collapsed.rows.find(r=>r.id==='group:armor')!.count).toBe(plain.rows.find(r=>r.id==='base:a')!.count);
 });
 it('shows items as their nearest positive-pick treasure class leaf with the same seeded run',()=>{
  const data=fixture([tc('root',-2,[{Code:'Jewelry A',Weight:1},{Code:'b',Weight:1}]),tc('Jewelry A',1,[{Code:'a',Weight:1},{Code:'b',Weight:1}],1)]);
  const plain=run(data,1000), leaves=monsterDrops(data,data.Sources[0],settings,1000,1,true,{leaves:true});
  expect(leaves.rows.map(r=>r.id).sort()).toEqual(['base:b','nodrop','tc:Jewelry A']);
  const leaf=leaves.rows.find(r=>r.id==='tc:Jewelry A')!;
  expect(leaf).toMatchObject({nameKey:'Jewelry A',code:'Jewelry A',quality:'treasure class'});
  expect(leaf.chance).toBeCloseTo(2/3,12);expect(leaf.expected).toBeCloseTo(2000/3,8);
  // The guaranteed pick of b from the negative-pick root stays an item row.
  expect(leaves.rows.find(r=>r.id==='base:b')).toMatchObject({chance:1,expected:1000,count:1000});
  expect(leaf.count+1000).toBe(plain.rows.filter(r=>r.code==='a'||r.code==='b').reduce((n,r)=>n+r.count,0));
  expect(leaves).toMatchObject({totalDrops:plain.totalDrops,itemDrops:plain.itemDrops});
  const hell=exported as DropData, good=treasureClassSource('Act 5 (H) Good',2,85);
  const items=monsterDrops(hell,good,settings,10,1,false), tcs=monsterDrops(hell,good,settings,10,1,false,{leaves:true});
  expect(tcs.rows.some(r=>r.id==='tc:Jewelry C')).toBe(true);
  expect(tcs.rows.every(r=>r.quality==='treasure class'||r.quality==='no drop')).toBe(true);
  const sum=(r:typeof items)=>r.rows.filter(x=>x.quality!=='no drop').reduce((n,x)=>n+x.expected,0);
  expect(sum(tcs)).toBeCloseTo(sum(items),8);
 });
 it('collapses all armo and weap leaves into one row each with the same seeded run',()=>{
  const data=fixture([tc('root',2,[{Code:'armo3',Weight:1},{Code:'armo6',Weight:1},{Code:'weap3',Weight:1},{Code:'Jewelry A',Weight:1}]),
   tc('armo3',1,[{Code:'a',Weight:1}]),tc('armo6',1,[{Code:'a',Weight:1}]),tc('weap3',1,[{Code:'b',Weight:1}]),tc('Jewelry A',1,[{Code:'b',Weight:1}])]);
  data.Bases.forEach(b=>b.Equipment=true);
  const leaves=monsterDrops(data,data.Sources[0],settings,1000,1,true,{leaves:true});
  const collapsed=monsterDrops(data,data.Sources[0],settings,1000,1,true,{leaves:true,collapse:true});
  expect(collapsed.rows.map(r=>r.id).sort()).toEqual(['tc:Jewelry A','tc:group:armo','tc:group:weap']);
  const armor=collapsed.rows.find(r=>r.id==='tc:group:armo')!;
  expect(armor).toMatchObject({nameKey:'Armor (all armo classes)',code:'armo*',quality:'treasure class'});
  // At least one of two picks landing on either armo class, not the summed leaf chances.
  expect(armor.chance).toBeCloseTo(1-(1/2)**2,12);expect(armor.expected).toBeCloseTo(1000,8);
  expect(armor.count).toBe(leaves.rows.filter(r=>/^tc:armo/.test(r.id)).reduce((n,r)=>n+r.count,0));
  expect(collapsed.rows.find(r=>r.id==='tc:group:weap')).toMatchObject({code:'weap*',count:leaves.rows.find(r=>r.id==='tc:weap3')!.count});
  expect(collapsed.rows.find(r=>r.id==='tc:Jewelry A')!.count).toBe(leaves.rows.find(r=>r.id==='tc:Jewelry A')!.count);
  expect(collapsed).toMatchObject({totalDrops:leaves.totalDrops,itemDrops:leaves.itemDrops});
  const hell=exported as DropData, good=treasureClassSource('Act 5 (H) Equip A',2,85);
  const real=monsterDrops(hell,good,settings,10,1,false,{leaves:true,collapse:true});
  expect(real.rows.some(r=>/^tc:(armo|weap)\d+$/i.test(r.id))).toBe(false);
  expect(real.rows.some(r=>r.id==='tc:group:armo')&&real.rows.some(r=>r.id==='tc:group:weap')).toBe(true);
 });
 it('exports the filtered loot table as tab-separated values',()=>{
  const data=fixture([tc('root',1,[{Code:'a',Weight:1}],1)]);
  data.Bases[0].NameKey='Ring\tof\nTabs';
  const report=run(data,10);
  const text=monsterDropTsv(report,report.rows,[['Source','Monster'],['Magic find %',300]],key=>key);
  const lines=text.trimEnd().split('\n');
  expect(lines.slice(0,2)).toEqual(['# Source\tMonster','# Magic find %\t300']);
  const header=lines.findIndex(l=>l.startsWith('Result\t'));
  expect(lines[header]).toBe('Result\tCode\tType\tExpected %\tSimulated %\tExpected count\tSimulated count\tChance of at least one per kill %');
  expect(lines.slice(header+1)).toHaveLength(report.rows.length);
  expect(lines.slice(header+1).every(l=>l.split('\t').length===8)).toBe(true);
  const count=report.rows.find(r=>r.code==='a')!.count;
  expect(lines).toContain(`Ring of Tabs\ta\tmisc\t50\t${count*10}\t5\t${count}\t50`);
  expect(monsterDropTsv({...report,simulated:false},report.rows,[],key=>key)).toContain('Result\tCode\tType\tExpected %\tExpected count\tChance of at least one per kill %\n');
 });
 it('runs a directly chosen treasure class without the monster-level class upgrade',()=>{
  const data=fixture([tc('low',1,[{Code:'a',Weight:1}]),tc('high',1,[{Code:'b',Weight:1}])]);
  data.TreasureClasses.forEach((t,i)=>{t.Group='1';t.Level=10+60*i;});
  expect(monsterDrops(data,data.Sources[0],settings,10,1,false).treasureClass).toBe('high');
  const report=monsterDrops(data,treasureClassSource('low',2,80),settings,10,1,false);
  expect(report.treasureClass).toBe('low');expect(report.rows.map(r=>r.code)).toEqual(['a']);
  expect(()=>monsterDrops(data,treasureClassSource('missing',2,80),settings,10,1,false)).toThrow('Missing treasure class');
  const hell=exported as DropData;
  expect(monsterDrops(hell,treasureClassSource('Act 1 Terrorize Act Consumable Desecrated',2,85),settings,10,1,true).rows.length).toBeGreaterThan(0);
 });
 it('calculates and simulates exported Hell Baal with consistent total loot',()=>{
  const data=exported as DropData, source=data.Sources.find(s=>s.NameKey==='Baal Crab'&&s.Difficulty===2&&s.Kind==='boss')!;
  const report=monsterDrops(data,source,settings,100,7,true);
  expect(report.rows.length).toBeGreaterThan(100);
  expect(report.itemDrops).toBeLessThanOrEqual(600);expect(report.totalDrops).toBeGreaterThanOrEqual(report.itemDrops);
  expect(report.rows.reduce((n,r)=>n+r.count,0)).toBe(report.totalDrops);
  expect(report.rows.every(r=>r.chance>=0&&r.chance<=1&&r.count>=0)).toBe(true);
  const sample=data.Items.find(i=>i.Id==='unique:Magefist')!;
  expect(report.rows.find(r=>r.id===sample.Id)!.chance).toBeCloseTo(calculateDrops({...data,Sources:[source]},sample,settings)[0].chance!,10);
 },30000);
});
it('round trips simulator settings without changing the item tab or unrelated query state',()=>{
 const url=new URL('https://example.test/data/drop-calculator?item=misc%3Apk1&mode=simulate#loot');
 const state={sourceType:'tc' as const,sourceId:'baal:hell',treasureClass:'Act 5 (H) Champ A',level:90,difficulty:2,kills:100,players:8,party:4,magicFind:350,seed:42,collapse:true,leaves:true};
 const shared=writeMonsterDropUrl(url,state);expect(readMonsterDropUrl(shared)).toEqual(state);expect(shared.searchParams.get('item')).toBe('misc:pk1');expect(shared.hash).toBe('#loot');
 expect(readMonsterDropUrl(new URL('https://example.test/?sim_kills=oops&sim_players=99&sim_party=99&sim_seed=-1&sim_sourceType=bad&sim_level=999'))).toMatchObject({kills:100,players:8,party:8,seed:1,sourceType:'monster',level:120,collapse:false,leaves:false});
});
