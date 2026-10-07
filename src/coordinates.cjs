// All rendered positions use WGS84, matching the OpenStreetMap basemap.
// Source coordinates are retained in location-audit.json. Never convert an unknown datum.
const pi=Math.PI;
function wgsToGcj(lat,lon){const x=lon-105,y=lat-35;let a=-100+2*x+3*y+.2*y*y+.1*x*y+.2*Math.sqrt(Math.abs(x));a+=(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3;a+=(20*Math.sin(y*pi)+40*Math.sin(y*pi/3))*2/3;a+=(160*Math.sin(y*pi/12)+320*Math.sin(y*pi/30))*2/3;let b=300+x+2*y+.1*x*x+.1*x*y+.1*Math.sqrt(Math.abs(x));b+=(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3;b+=(20*Math.sin(x*pi)+40*Math.sin(x*pi/3))*2/3;b+=(150*Math.sin(x*pi/12)+300*Math.sin(x*pi/30))*2/3;const rad=lat*pi/180,m=1-.00669342162296594323*Math.sin(rad)**2;return {lat:lat+a*180/((6378245*(1-.00669342162296594323))/(m*Math.sqrt(m))*pi),lon:lon+b*180/(6378245/Math.sqrt(m)*Math.cos(rad)*pi)}}
function gcjToWgs(lat,lon){let p={lat,lon};for(let i=0;i<5;i++){const q=wgsToGcj(p.lat,p.lon);p.lat-=q.lat-lat;p.lon-=q.lon-lon;}return p;}
function bdToGcj(lat,lon){const x=lon-.0065,y=lat-.006,ang=pi*3000/180,z=Math.sqrt(x*x+y*y)-.00002*Math.sin(y*ang),theta=Math.atan2(y,x)-.000003*Math.cos(x*ang);return {lat:z*Math.sin(theta),lon:z*Math.cos(theta)}}
function bdMcToLl(x,y){
 // Baidu's polynomial coefficients for the 30–45° latitude band. Audit sources are all Shanghai.
 // Reference: https://github.com/46319943/BD09Convertor (MIT).
 if(y<3481989.83||y>=5591021)throw Error('Baidu Mercator point outside supported Shanghai latitude band');
 const c=[-1.981981304930552e-8,.000008983055099779535,.03278182852591,40.31678527705744,.65659298677277,-4.44255534477492,.85341911805263,.12923347998204,-.04625736007561,4482777.06],t=y/c[9];
 return {lon:c[0]+c[1]*x,lat:c.slice(2,9).reduce((sum,n,i)=>sum+n*t**i,0)};
}
function toWgs(p){if(p.datum==='unresolved')return {lat:null,lon:null};if(p.datum==='WGS84')return {lat:p.lat,lon:p.lon};if(p.datum==='GCJ02')return gcjToWgs(p.lat,p.lon);if(p.datum==='BD09'||p.datum==='BD09MC'){const q=p.datum==='BD09MC'?bdMcToLl(p.x,p.y):p;const g=bdToGcj(q.lat,q.lon);return gcjToWgs(g.lat,g.lon);}throw Error('Unknown source datum '+p.datum)}
module.exports={toWgs,gcjToWgs,wgsToGcj,bdToGcj,bdMcToLl};
