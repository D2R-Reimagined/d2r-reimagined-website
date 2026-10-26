import { describe, expect, it } from 'vitest';
import { monsterDrops, treasureClassSource, type MonsterDropReport, type MonsterDropRow } from './monster-drop-calculator';
import { coverage, dropDistribution, formatPercent, rowShares, share } from './monster-drop-stats';
import { monsterDropTsv } from './monster-drop-export';
import type { DropClass, DropData } from './drop-calculator';
import exported from '../../static/data/keyed/drop-calculator.json';

const settings = {players:1,party:1,magicFind:0,difficulty:2,kind:'all'};
const tc = (Code:string,Picks:number,Entries:DropClass['Entries'],NoDrop=0):DropClass => ({Code,Picks,Entries,NoDrop,Group:'',Level:0,Unique:0,Set:0,Condition:'',QuestFlag:'',QuestFlagEx:''});
function fixture(classes:DropClass[]):DropData {
  return {Items:[],Bases:['a','b'].map(Code=>({Code,NameKey:Code,Level:1,Uber:false,ClassSpecific:false,Quest:false})),Ratios:[],TreasureClasses:classes,
    Sources:[{Id:'mob',NameKey:'Monster',AreaKey:'',Difficulty:2,Kind:'boss',Level:80,TreasureClass:classes[0].Code}]};
}
const row = (id:string,quality:string,expected:number,count:number,chance:number):MonsterDropRow => ({id,nameKey:id==='nodrop'?'NoDrop':id==='void'?'Void':id,code:'',quality,chance,expected,count});
// The reported 10,000-kill run: 70,000 rolls split 38,901 / 15,810 / 15,289.
const example = ():MonsterDropReport => ({kills:10000,seed:1,simulated:true,totalDrops:70000,itemDrops:15289,treasureClass:'root',rows:[
  row('nodrop','no drop',38500,38901,1),row('void','no drop',16000,15810,0.9014),
  row('gld','misc',9000,9100,0.6),row('tc:Jewelry A','treasure class',6499.999,6189,0.45),row('unique:rare','unique',0.001,0,1e-7)]});
const cells = (text:string) => text.trimEnd().split('\n').map(l=>l.split('\t'));

describe('drop result distribution',()=>{
  it('splits a complete 70,000-roll run into NoDrop, Void and successful outcomes that total 100%',()=>{
    const d=dropDistribution(example());
    expect(d.simulated).toEqual({noDrop:38901,void:15810,successful:15289,total:70000});
    expect(d.reconciled).toBe(true);
    const shares=[d.simulated!.noDrop,d.simulated!.void,d.simulated!.successful].map(n=>share(n,d.simulated!.total)!);
    expect(shares.map(formatPercent)).toEqual(['55.57%','22.59%','21.84%']);
    expect(shares.reduce((a,b)=>a+b,0)).toBeCloseTo(1,12);
    // Not the per-kill chances (100% and 90.14%) and not divided by kills or by item drops.
    expect(shares[0]).not.toBe(1);expect(shares[0]).toBeCloseTo(38901/70000,12);
    expect(shares[2]).not.toBeCloseTo(1,3);
  });
  it('derives expected shares from expected counts and simulated shares from simulated counts',()=>{
    const report=example(), d=dropDistribution(report);
    expect(d.expected.total).toBeCloseTo(70000,6);expect(d.expected.noDrop).toBe(38500);expect(d.expected.void).toBe(16000);
    const gold=rowShares(report.rows[2],d);
    expect(gold.expected).toBeCloseTo(9000/70000,12);expect(gold.simulated).toBeCloseTo(9100/70000,12);
    expect(report.rows.reduce((n,r)=>n+rowShares(r,d).expected!,0)).toBeCloseTo(1,12);
    expect(report.rows.reduce((n,r)=>n+rowShares(r,d).simulated!,0)).toBeCloseTo(1,12);
    expect(dropDistribution({...report,simulated:false})).toMatchObject({simulated:null,reconciled:true});
  });
  it('keeps NoDrop and Void distinct and inside the denominator',()=>{
    const d=dropDistribution(example());
    expect(d.simulated!.noDrop).not.toBe(d.simulated!.void);
    expect(d.simulated!.total).toBe(d.simulated!.noDrop+d.simulated!.void+d.simulated!.successful);
    const text=monsterDropTsv(example(),example().rows,[],k=>k);
    expect(text).toMatch(/^NoDrop\t/m);expect(text).toMatch(/^Void\t/m);
  });
  it('divides by every roll when a kill makes several rolls',()=>{
    const data=fixture([tc('root',3,[{Code:'a',Weight:1},{Code:'Void',Weight:1}],1),tc('Void',0,[])]);
    const report=monsterDrops(data,data.Sources[0],settings,1000,5,true), d=dropDistribution(report);
    expect(report.totalDrops).toBe(3000);expect(d.simulated!.total).toBe(3000);expect(d.expected.total).toBeCloseTo(3000,8);
    for(const r of report.rows){
      expect(rowShares(r,d).expected).toBeCloseTo(1/3,12);
      expect(rowShares(r,d).simulated).toBe(r.count/3000);
    }
    // Per-kill chances overlap (each is 1 - (2/3)^3), so they are not a distribution.
    expect(report.rows.reduce((n,r)=>n+r.chance,0)).toBeGreaterThan(2);
  });
  it('reports filtered rows against the full denominator without renormalizing',()=>{
    const report=example(), d=dropDistribution(report), items=report.rows.filter(r=>r.quality!=='no drop');
    expect(coverage(items,d).simulated).toBeCloseTo(15289/70000,12);
    expect(coverage(items,d).expected).toBeCloseTo((70000-38500-16000)/70000,8);
    expect(coverage(report.rows,d).simulated).toBe(1);
    expect(rowShares(items[0],d).simulated).toBeCloseTo(9100/70000,12);
    const all=cells(monsterDropTsv(report,report.rows,[],k=>k)), some=cells(monsterDropTsv(report,items,[['Filters','type=misc']],k=>k));
    const gold=(rows:string[][])=>rows.find(c=>c[0]==='gld');
    expect(gold(some)).toEqual(gold(all));
    expect(some).toContainEqual(['# Filters','type=misc']);
    expect(some).toContainEqual(['# Rows exported','3 of 5']);
    expect(some).toContainEqual(['# Exported rows cover %',`expected ${(15500.000/70000*100).toPrecision(6).replace(/0+$/,'')}; simulated ${(15289/70000*100).toPrecision(6)}`]);
  });
  it('aggregates collapsed treasure class leaves without double-counting and keeps the seeded run',()=>{
    const hell=exported as DropData, champ=treasureClassSource('Act 5 (H) Champ A',2,85);
    const plain=monsterDrops(hell,champ,settings,2000,11,true), grouped=monsterDrops(hell,champ,settings,2000,11,true,{leaves:true,collapse:true});
    for(const report of [plain,grouped]){
      const d=dropDistribution(report);
      expect(report.rows.reduce((n,r)=>n+r.count,0)).toBe(report.totalDrops);expect(d.reconciled).toBe(true);
      expect(d.simulated!.successful).toBe(report.itemDrops);
      expect(report.rows.reduce((n,r)=>n+rowShares(r,d).simulated!,0)).toBeCloseTo(1,10);
      expect(report.rows.reduce((n,r)=>n+rowShares(r,d).expected!,0)).toBeCloseTo(1,10);
      expect(new Set(report.rows.map(r=>r.id)).size).toBe(report.rows.length);
      // The expected universe matches the simulated one: same mean number of rolls per kill.
      expect(Math.abs(d.simulated!.total/report.kills-d.expected.total/report.kills)/(d.expected.total/report.kills)).toBeLessThan(0.05);
    }
    const a=dropDistribution(plain), b=dropDistribution(grouped);
    expect(b.simulated).toEqual(a.simulated);
    expect(b.expected.total).toBeCloseTo(a.expected.total,6);expect(b.expected.noDrop).toBeCloseTo(a.expected.noDrop,8);expect(b.expected.void).toBeCloseTo(a.expected.void,8);
    expect(grouped.rows.length).toBeLessThan(plain.rows.length);
  },60000);
  it('handles zero-result and zero-kill reports without NaN',()=>{
    const empty:MonsterDropReport={rows:[],kills:0,seed:1,simulated:true,totalDrops:0,itemDrops:0,treasureClass:'root'};
    const d=dropDistribution(empty);
    expect(d.simulated).toEqual({noDrop:0,void:0,successful:0,total:0});
    expect(share(0,0)).toBeNull();expect(formatPercent(share(0,0))).toBe('—');
    expect(coverage([],d)).toEqual({expected:null,simulated:null});
    expect(monsterDropTsv(empty,[],[],k=>k)).not.toMatch(/NaN|Infinity/);
    const unseen={...example().rows[4]};
    expect(rowShares(unseen,dropDistribution(example())).simulated).toBe(0);expect(formatPercent(0)).toBe('0%');
    const data=fixture([tc('root',1,[{Code:'a',Weight:1}])]);
    expect(monsterDrops(data,data.Sources[0],settings,0,1,true)).toMatchObject({kills:1,totalDrops:1});
  });
  it('keeps rare nonzero shares visible',()=>{
    expect(formatPercent(0.555729)).toBe('55.57%');
    expect(formatPercent(0.00123456)).toBe('0.123%');
    expect(formatPercent(3e-6)).toBe('0.0003%');
    expect(formatPercent(1e-7)).toBe('1.00e-5%');
    const rare=rowShares(example().rows[4],dropDistribution(example())).expected!;
    expect(rare).toBeGreaterThan(0);expect(formatPercent(rare)).toBe('1.43e-6%');
    expect(cells(monsterDropTsv(example(),example().rows,[],k=>k)).find(c=>c[0]==='unique:rare')![3]).toBe('0.00000142857');
  });
  it('exports the same shares, counts and summary the page displays',()=>{
    const report=example(), d=dropDistribution(report), lines=cells(monsterDropTsv(report,report.rows,[['Source','Test']],k=>k));
    expect(lines).toContainEqual(['# Total simulated rolls','70000']);expect(lines).toContainEqual(['# Item drops','15289']);
    expect(lines).toContainEqual(['# Distribution','Expected %','Simulated %','Expected count','Simulated count']);
    expect(lines).toContainEqual(['# NoDrop','55','55.5729','38500','38901']);
    expect(lines).toContainEqual(['# Void','22.8571','22.5857','16000','15810']);
    expect(lines).toContainEqual(['# Successful outcomes','22.1429','21.8414','15500','15289']);
    expect(lines).toContainEqual(['# All results','100','100','70000','70000']);
    const header=lines.findIndex(c=>c[0]==='Result');
    expect(lines[header]).toEqual(['Result','Code','Type','Expected %','Simulated %','Expected count','Simulated count','Chance of at least one per kill %']);
    for(const r of report.rows){
      const c=lines.find(l=>l[0]===r.nameKey)!, s=rowShares(r,d);
      expect(Number(c[3])).toBeCloseTo(s.expected!*100,4);expect(Number(c[4])).toBeCloseTo(s.simulated!*100,4);
      expect(Number(c[5])).toBeCloseTo(r.expected,3);expect(Number(c[6])).toBe(r.count);expect(Number(c[7])).toBeCloseTo(r.chance*100,4);
      if(s.simulated!*100>=1) expect(`${Number(c[4]).toFixed(2)}%`).toBe(formatPercent(s.simulated));
    }
    const rates=cells(monsterDropTsv({...report,simulated:false},report.rows,[],k=>k));
    expect(rates.find(c=>c[0]==='Result')).toEqual(['Result','Code','Type','Expected %','Expected count','Chance of at least one per kill %']);
    expect(rates).toContainEqual(['# NoDrop','55','38500']);
  });
  it('leaves deterministic seeded runs unchanged',()=>{
    const data=fixture([tc('root',3,[{Code:'a',Weight:1},{Code:'b',Weight:2},{Code:'Void',Weight:1}],2),tc('Void',0,[])]);
    const run=(seed:number,options={})=>monsterDrops(data,data.Sources[0],settings,500,seed,true,options);
    expect(run(9)).toEqual(run(9));expect(dropDistribution(run(9))).toEqual(dropDistribution(run(9)));
    expect(dropDistribution(run(9,{leaves:true,collapse:true})).simulated).toEqual(dropDistribution(run(9)).simulated);
    expect(run(9).rows.map(r=>r.count)).not.toEqual(run(10).rows.map(r=>r.count));
  });
});
