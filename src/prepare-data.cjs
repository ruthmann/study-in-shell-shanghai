const fs=require('fs');
const shops=JSON.parse(fs.readFileSync('src/shops-original.json','utf8')).filter(s=>s.id!=='tk');
const meta={
cw:['Classic Works','Jing’an','Welted boots & independent makers','Heavyweight boots, Japanese craft and independent shoemakers. A strong first stop for collectors who want to handle the leather and compare construction.','Confirm hours before visiting'],
rb:['Radiance Blue','Jing’an','Alden, loafers & contemporary labels','A select-shop stop inside Taikoo Hui, mixing American classics with contemporary and outdoor footwear. Confirm the current unit with the mall directory.','Mall listed 10:00–22:00; shop hours unconfirmed'],
jl:['John Lobb','Jing’an · Plaza 66','English shoemaking','A focused stop for John Lobb ready-to-wear and enquiries about recrafting. Useful for comparing lasts, leather and fit in person.','Mall listed 10:00–22:00; shop hours unconfirmed'],
rl:['Ralph Lauren','Jing’an · Kerry Centre','Purple Label & Double RL','The Kerry Centre flagship is an easy companion to NOOS in the same complex. Ask which footwear collections and sizes are currently on the floor.','Mall listed 10:00–22:00; shop hours unconfirmed'],
rl2:['Ralph Lauren','The Bund · Peninsula','Purple Label on the Bund','A smaller stop in the Peninsula Arcade. Pair it with a Bund walk and ask ahead about the footwear selection.','Confirm hours before visiting'],
rr:['The Real Real Co.','Jing’an','Heritage clothing & specialist boots','A useful address for American heritage, Japanese boots and made-to-order enquiries. Allow time to discuss what can be tried on and what must be ordered.','Confirm hours before visiting'],
bj:['BaronJ','Changle Road','British & European shoemaking','A lane-house shoe shop worth planning around. Arrange your visit before setting out; the address takes you into a lane, not a conventional street-facing mall.','Weekends · by appointment; exact hours unconfirmed'],
fy:['Culture Matters','Fumin Road','Feiyue & Shanghai canvas shoes','A Feiyue stop for the local canvas-shoe side of the city. The recorded Fumin Road branch needs confirmation before a special trip.','Confirm branch and hours'],
ic:['Industrial Co.','Julu Road','French classics & Japanese craft','A menswear select shop with an unusually broad footwear register: French classics, American staples and Japanese craft. A useful starting point for the lane-street circuit.','July listing: daily 12:00–21:00; reconfirm'],
pn:['PANE','Jing’an · Yongyuan Road','Shanghai sneaker design','The Shanghai label’s flagship is the place to compare silhouettes, material combinations and fit in person.','Listed daily 10:00–22:00'],
ro:['Roiluxe','Huaihai Middle Road','A collector’s appointment','Head upstairs to Room 520 for English, Italian and Chinese shoemaking. A concentrated stop for comparing makers, discussing special orders and seeing Chinese hand-welted work.','Confirm hours and access ahead'],
lm:['The Anthology / Tassels','Xuhui · La Maison','A shoe salon in a Shanghai house','Tailoring and shoes share La Maison. The second-floor salon combines The Anthology’s collaborations with a selection curated with Tassels Hong Kong.','Listed Tue–Sun 12:30–20:30'],
rv:['Rivets','Location to confirm','Artisanal footwear & heritage','A footwear and heritage-clothing destination with conflicting branch records. Dongtai Li is the older listing; a published Shipyard 1862 address needs checking before you travel.','Confirm operating branch and hours'],
md:['MEDALLION','Pudong · Shipyard 1862','A reason to cross the river','Ready-to-wear, made-to-order and bespoke footwear on the Pudong riverfront. Leave time for a Binjiang walk, and ask ahead about visiting-maker events.','Shop hours unconfirmed'],
gm:['GentleMaker Shoecare','Putuo · Changfeng listing','Care, repair & restoration','A dedicated shoe-care stop, with a recorded connection to Songs of Love and Hate bespoke shoemaking. Confirm the branch first: the guide’s Changfeng address has not been reconciled with a reported Changning location.','July listing: Tue–Sun 11:00–19:00; reconfirm'],
tk:['Tricker’s Shanghai','Changning · Dingxi Road','Shoes & authorised service','The maker’s Shanghai address combines footwear with authorised repair and restoration. Check the schedule before planning a weekend visit.','July listing: Mon–Fri 10:00–20:00; reconfirm'],
no:['NOOS','Jing’an · Kerry Centre','Edward Green & Crockett & Jones','A compact English-shoemaking stop inside Kerry Centre. Ask about ready-to-wear sizes and made-to-order options. Pair it with Ralph Lauren in the same complex.','Shop hours unconfirmed'],
no2:['NOOS','Xujiahui · One ITC','English shoemaking, south of the centre','The second NOOS location extends the circuit into Xujiahui. Find it at L235-2 in One ITC; confirm stock at this branch before travelling for a specific pair.','Shop hours unconfirmed'],
fs:['Frank’s Store','Hongkou · Music Valley','Heritage clothing, vintage & coffee','A separate northern detour for the heritage side of the circuit. Pair the visit with a wander through the Music Valley neighbourhood.','July listing: 12:00–20:00; reconfirm'],
eth:['eth0s','Xuhui · Jiashan Road','Italian avant-garde, in person','A key destination for high-quality avant-garde footwear, particularly Italian makers. A rare chance to compare their fit in person: allow time for different lasts, proportions and constructions.','Listed daily 11:00–22:00'],
doet:['DOE','Jing’an · Tongren Road','Special runs & sports shoes','Shanghai streetwear with special runs and collaborations, most often sports shoes. Ask which releases and sizes are allocated to the Tongren Road branch.','Hours unconfirmed'],
doeh:['DOE','Huangpu · Hubin Road','Special runs & sports shoes','The Hubin Road location adds a sneaker stop near Xintiandi. Check the current release and branch allocation before making a special trip.','Hours unconfirmed']};
for(const s of shops){const m=meta[s.id];Object.assign(s,{short:m[0],area:m[1],strap:m[2],description:m[3],hours:m[4],type:'shop',number:shops.indexOf(s)+1});s.street=s.addr.split(' · ')[0];s.phone={lm:'+86 133 4193 1407',eth:'+86 21 5466 5063',doet:'+86 21 6180 8378',doeh:'+86 21 5382 1689',tk:'400 0067 082'}[s.id]||null;s.warning={rv:'Confirm the branch: the map retains the older Dongtai Li listing. A published alternative is Shipyard 1862, L108C, Pudong.',gm:'Branch unresolved: the recorded Changfeng address is in Putuo; a Changning location has also been reported.',fy:'The Fumin Road branch is an older listing and needs confirmation.',rb:'Published stockist directories disagree on the mall unit. Ask the mall before visiting.',bj:'Weekend / appointment visits. Arrange access first.'}[s.id]||null;}
// Apply the dated address audit to every consumer of the shared data model.
const {toWgs,gcjToWgs}=require('./coordinates.cjs');
const locationAudit=JSON.parse(fs.readFileSync('src/location-audit.json','utf8'));
for(const s of shops){
 const a=locationAudit.locations.find(a=>a.id===s.id);if(!a)throw Error('Missing audit: '+s.id);
 Object.assign(s,a.overrides,toWgs(a.position),{pinPrecision:a.precision,pinLabel:a.pinLabel,locationChecked:a.checked,coordNote:a.notes,coordinateSource:a.position});
 s.addr=s.street;s.note=s.description;
 s.sources=[...new Map([...(s.sources||[]),...a.sources].map(x=>[x.url,x])).values()];
 if(s.id==='fy')s.sources=s.sources.filter(x=>!x.url.includes('smartshanghai'));
}
// Footwear editorial review, 9 October 2026. Brand history is not branch inventory.
const rlFootwearSources=[
 {label:'Ralph Lauren · RRL English-made leather boot',url:'https://www.ralphlauren.com/men-footwear-shoes/leather-boot/538841.html'},
 {label:'Ralph Lauren · Winter 2020 RRL catalogue, English- and US-made boots',url:'https://www.ralphlauren.com/on/demandware.static/-/Sites-RalphLauren_US-Library/default/dwbbc72026/img/202012/20201208-m-double-rl-lp/double-rl-catalog-2.pdf'},
 {label:'Ralph Lauren · Purple Label Luther loafer, made in Italy',url:'https://www.ralphlauren.co.uk/en/luther-tassel-suede-loafer-612795.html'}
];
for(const s of shops.filter(s=>['rl','rl2'].includes(s.id))){
 const kerry=s.id==='rl';
 s.strap=kerry?'RRL boots & Italian-made Purple Label shoes':'Italian-made Purple Label footwear';
 s.description=kerry
  ?'Ralph Lauren deserves a place on a footwear circuit for its relationships with specialist international shoemakers. RRL brings the workwear and boot side, including English- and American-made examples; Purple Label offers Italian-made footwear. At Kerry Centre, ask to see the available boots and dress shoes, compare their construction and fit, then continue to NOOS in the South Building.'
  :'A Bund-side stop to enquire about Purple Label’s Italian-made footwear. The interest is in the shoes themselves: leather, finishing, shape and fit within Ralph Lauren’s tailored wardrobe. Ask which models and sizes this boutique carries before making a dedicated trip; its selection should not be assumed to match Kerry Centre.';
 s.note=s.description;
 s.selection=kerry?[
  ['RRL / Double RL boots','The line has offered boots from specialist international makers, including production in England and the United States. Livingstone boots attributed to Crockett & Jones are an editorial example; that model-to-maker attribution has not been independently verified. Makers can vary by model and period.'],
  ['Purple Label','Look for Italian-made shoes, including loafers and dress styles. The Luther tassel loafer is a documented example. Country of manufacture does not by itself identify the workshop.'],
  ['Ask in store','Which RRL and Purple Label footwear is available at this branch? Ask about the maker where disclosed, country of manufacture, construction, sizing and repair options for the specific pair. These historical examples are not a current-stock list.']
 ]:[
  ['Purple Label','Italian-made footwear is the reason to investigate this stop. The Luther tassel loafer is a documented collection example, not confirmed Peninsula inventory.'],
  ['Branch selection','Confirm the footwear range and sizes directly. RRL’s English- and American-made boot history is covered at the Kerry Centre stop; RRL availability at Peninsula is not established.']
 ];
 s.evidence+=' Footwear context reviewed 9 October 2026. Official product pages and the Winter 2020 catalogue establish examples of manufacturing origins, not Shanghai stock. The Livingstone / Crockett & Jones attribution was supplied in editorial notes and remains independently unverified; no specific American factory is asserted.';
 s.sources.push(...(kerry?rlFootwearSources:[rlFootwearSources[2]]));
}
// Editor-supplied corrections and replacement copy, 9 October 2026.
const editorialDescriptions=JSON.parse(fs.readFileSync('src/editorial-descriptions.json','utf8'));
for(const s of shops){s.description=editorialDescriptions[s.id];s.note=s.description;}
for(const id of ['rb','jl','rr','bj','fy','ro','gm']){
 const s=shops.find(s=>s.id===id);
 s.evidence+=' Editorial corrections supplied 9 October 2026.';
}
shops.find(s=>s.id==='cw').sources.push({label:'Classic Works · Taiwan operation and Shanghai inventory',url:'https://www.classicworks.cc/en/categories/shanghai-inventory'});
shops.find(s=>s.id==='rb').strap='Special collaborations & contemporary footwear';
shops.find(s=>s.id==='jl').tags=['John Lobb','Shoe care','Recrafting'];
shops.find(s=>s.id==='bj').tags.push('Gaziano & Girling MTO');
shops.find(s=>s.id==='fy').tags.push('Custom painting','In-house artists');
shops.find(s=>s.id==='gm').tags=['Zhou Ruoda','San Pomodoro','Women’s custom Goodyear-welted shoes','Songs of Love and Hate','Bespoke'];
const rl=shops.find(s=>s.id==='rl');
rl.selection=rl.selection.slice(0,2);
shops.find(s=>s.id==='rl2').selection=shops.find(s=>s.id==='rl2').selection.slice(0,1);
const factories=[
{id:'h-dafu',type:'factory',number:'H1',short:'Dafu Rubber Factory',name:'Dafu Rubber Factory / Feiyue origins',area:'Changning · Zhongshan West Road',strap:'A factory erased; a name that endured',status:'Redeveloped',period:'1931 · establishment recorded',era:'origins',...gcjToWgs(31.218170,121.411362),street:'Former address: 207 Zhongshan West Road',zh:'原大孚橡胶厂：中山西路207号（旧址一带）',description:'Changning’s official chronology records the Dafu rubber factory at today’s 207 Zhongshan West Road in July 1931. Later reporting identifies the Shanghai Fire Museum site with the former factory. This is the geography behind the Feiyue story, rather than a surviving production floor.',now:'The old industrial site has been redeveloped. The nearby Fire Museum at No. 229 is an orientation landmark, not a footwear museum or factory tour.',visit:'Historic-site context only. Confirm museum access separately; no factory access is offered here.',coordNote:'The pin marks the approximate former factory area beside the Shanghai Fire Museum.',sources:[{label:'Changning government · 1931 chronology',url:'https://www.shcn.gov.cn/col7000/20110817/720748.html'},{label:'Jiefang Daily / China Writers · site afterlife, 2024',url:'https://www.chinawriter.com.cn/n1/2024/0920/c404019-40324048.html'},{label:'Shanghai Culture & Tourism · Fire Museum address, 2025 list',url:'https://whlyj.sh.gov.cn/bwg/20260106/265b828de4394054bdc2e61e1599ed4c.html'},{label:'Amap · museum location anchor',url:'https://www.amap.com/place/B00156EJCZ'}],timeline:[['1931','Dafu factory recorded at today’s No. 207.'],['2024','Reporting identifies the Fire Museum site with the former factory.']]},
{id:'h-warrior',type:'factory',number:'H2',short:'Warrior’s Pingliang factory',name:'Warrior / former Pingliang Road factory',area:'Yangpu · Pingliang Road',strap:'From production floor to flagship',status:'Retail reuse documented',period:'2010 · flagship opened',era:'afterlives',lat:null,lon:null,street:'1150 Pingliang Road · historical address',zh:'杨浦区平凉路1150号（原回力工厂旧址）',description:'Warrior’s official history records a flagship opening at its former Pingliang Road factory in September 2010. Contemporary coverage gives the address as No. 1150: a case of a shoe brand returning to its industrial home through retail.',now:'Warrior opened a flagship at the former factory in 2010. The historical address does not establish what occupies the site today.',visit:'Not a confirmed factory visit. Check the present address and access before making the journey.',coordNote:'Historical address only; no map pin is shown.',sources:[{label:'Warrior · official brand history',url:'https://www.warriorshoes.com/huili/history.aspx'},{label:'Ministry of Commerce · Warrior history',url:'https://lzhbwg.mofcom.gov.cn/edi_ecms_web_front/thb/detail/3f579a7d54a34677b1a1033cc068c5a3'},{label:'CCTV · historical street address, 2012',url:'https://kejiao.cntv.cn/20120706/100208_1.shtml'}],timeline:[['2010','Flagship opens at the former factory site.'],['2014','Warrior reports a commemorative sculpture at the site.']],extraSource:{label:'Warrior · former-site sculpture, 2014',url:'https://www.warriorshoes.com/huili/detail.aspx?id=3839'}},
{id:'h-jinbei',type:'factory',number:'H3',short:'Jinbei Shoe Factory',name:'Jinbei Shoe Factory → 728 SPACE',area:'Minhang · Zhuanqiao',strap:'The factory as a cultural address',status:'Adaptively reused',period:'1960s buildings → 2022 reopening',era:'afterlives',...gcjToWgs(31.068280,121.384836),street:'728 Guanghua Road, Zhuanqiao, Minhang',zh:'闵行区颛桥镇光华路728号 忆空间（728 SPACE）',description:'Seven 1960s buildings of the former Jinbei shoe factory were retained and strengthened for 728 SPACE. Reporting from its December 2022 opening describes a cultural campus with a public reading room and the Wu Yiren Art Museum.',now:'A documented example of factory reuse, well outside the central shopping circuit. Confirm today’s venue programme and access before travelling.',visit:'A cultural-site visit, not an operating shoe-factory tour. Allow for a separate trip to Minhang.',coordNote:'The pin marks 728 SPACE, not the full boundary of the former factory.',sources:[{label:'The Paper · on-site opening report, 2 December 2022',url:'https://www.thepaper.cn/newsDetail_forward_20993469'},{label:'Amap · 728 SPACE address and location',url:'https://www.amap.com/place/B0I0S7HFRY'}],timeline:[['1960s','Factory buildings date from this period.'],['2022','Seven retained buildings reopen as 728 SPACE.']]},
{id:'h-oct',type:'factory',number:'M1',short:'Oct Tenth / Axen',name:'Oct Tenth / Axen factory',area:'Shanghai · location to confirm',strap:'The city is still making shoes',status:'Production reported · 2026',period:'2020 workshop visit · 2026 interview',era:'active',lat:null,lon:null,street:'Current workshop address not verified',zh:'Oct Tenth 制鞋工坊（现址待确认）',description:'Oct Tenth and Axen share a factory in Shanghai, connecting two names in contemporary Chinese shoemaking. A 2020 workshop visit offers a look inside Oct Tenth’s production, while a January 2026 interview with shoemaker Wen Tao discusses the team and a new factory.',now:'A shared production workshop for Oct Tenth and Axen. Explore Oct Tenth footwear at Roiluxe on the shopping circuit.',visit:'The factory is not listed as a public visitor destination.',coordNote:'No visitor address is listed for this workshop.',sources:[{label:'Fu Pei · first-person factory visit, 20 July 2020',url:'https://fupei.net/en/oct-tenth-factory-visit/'},{label:'Fu Pei · Wen Tao interview, 2 January 2026',url:'https://fupei.net/en/an-interview-with-cobbler-wen-tao/'}],timeline:[['2020','First-person visit documents a Shanghai workshop.'],['2026','Interview discusses the team and new factory.']]}
];
factories[1].sources.push(factories[1].extraSource);
const routes=[{id:'puxi',n:'01',name:'The Puxi discoveries',area:'Julu → Huaihai → Xuhui',time:'Allow an afternoon',description:'Four different perspectives on well-made shoes, from a select shop to a collector’s salon and Italian avant-garde. Leave time for fitting rather than trying to see everything.',ids:['ic','ro','eth','lm'],optional:['cw','rb','jl','no','rl','doet','rr','bj','fy','pn','no2','doeh'],note:'Walk the close sections; use a taxi or metro for longer links. The Anthology lists Tuesday–Sunday hours. Extend north into Jing’an or south to NOOS One ITC if time allows.'},{id:'pudong',n:'02',name:'The Pudong crossing',area:'The Bund → Shipyard 1862',time:'Make space for the river',description:'A Bund-side browse followed by MEDALLION across the Huangpu. Make the riverfront part of the day, with one focused footwear appointment as the anchor.',ids:['rl2','md'],optional:['rv','fs'],note:'Use a taxi or metro to cross the river; the line on this map is only a visit sequence. Rivets is mapped separately at Xintiandi Dongtai Li in Huangpu.'},{id:'west',n:'03',name:'The western repair run',area:'Changfeng · Putuo',time:'Arrange visits first',description:'A focused trip for specialist shoe care and an introduction to Zhou Ruoda’s shoemaking. Discuss repair work or a personal commission at GentleMaker.',ids:['gm'],optional:['pn'],note:'GentleMaker anchors this visit in Changfeng, Putuo. Extend the afternoon to PANE on Yongyuan Road for a contrasting look at contemporary Shanghai footwear.'}];
// Only visitor-facing notes are included in the published data.
const visitorNotes=JSON.parse(fs.readFileSync('src/visitor-notes.json','utf8'));
for(const s of shops){
 s.coordNote=visitorNotes[s.id];
 delete s.evidence;
 delete s.coordinateSource;
}
shops.find(s=>s.id==='gm').warning=null;
shops.find(s=>s.id==='gm').area='Putuo · Changfeng';
shops.find(s=>s.id==='rl').selection=[
 ['RRL / Double RL boots','RRL has offered boots from specialist international makers, with production in England and the United States. Livingstone boots are attributed to Crockett & Jones; the maker attribution remains unverified. Makers can vary by model and period.'],
 ['Purple Label','Italian-made footwear includes loafers and dress styles, with the Luther tassel loafer one example. Explore the leather, shape and finishing alongside Ralph Lauren’s tailored clothing.']
];
shops.find(s=>s.id==='rl2').selection=[['Purple Label','Italian-made loafers and dress shoes connect the footwear collection with Ralph Lauren’s tailored wardrobe. The Luther tassel loafer is one example from the collection.']];
shops.find(s=>s.id==='eth').selection=[
 ['Core makers','GUIDI; m.a+ / Maurizio Amadei; A1923.'],
 ['Limited editions','Geoffrey B. Small shoes.'],
 ['Further footwear','visvim; DEVOA; PHILEO; Thom Browne.'],
 ['Collaborations','GUIDI × MASTERMIND WORLD GR20V_SK; New Balance 2010 by LM.RT for eth0s, U20102Z1. The latter debuted in mainland China through eth0s on 26 September 2026.']
];
fs.writeFileSync('src/data.json',JSON.stringify({shops,factories,routes}));
console.log('Prepared',shops.length,'shops,',factories.length,'factory records;',factories.filter(f=>f.lat).length,'factory anchors');
