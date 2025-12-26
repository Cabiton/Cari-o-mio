const fs = require('fs');
const path = 'app/dibujo/page.tsx';
const s = fs.readFileSync(path, 'utf8');
const lines = s.split(/\r?\n/);
const start = 1406-1; const end = 1424-1;
for (let i = start; i <= end; i++){
  const l = lines[i] || '';
  const codes = Array.from(l).map(c => c.charCodeAt(0));
  console.log((i+1)+": "+JSON.stringify(l));
  console.log('codes:', codes.join(','));
}
