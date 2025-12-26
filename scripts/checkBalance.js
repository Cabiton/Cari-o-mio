const fs = require('fs');
const s = fs.readFileSync('app/dibujo/page.tsx','utf8');
const lines = s.split(/\r?\n/);
let brace=0, paren=0, angle=0;
for(let i=0;i<lines.length;i++){
  const l=lines[i];
  for(const c of l){
    if(c==='{') brace++;
    if(c==='}') brace--;
    if(c==='(') paren++;
    if(c===')') paren--;
  }
  if(i>=1400 && i<1430) console.log((i+1)+": brace="+brace+" paren="+paren+" -> "+lines[i]);
  if(brace<0) { console.log('NEGATIVE brace at line',i+1); break; }
}
console.log('final brace', brace, 'paren', paren);