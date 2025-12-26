// Script para copiar y pegar en la consola del navegador
// Elimina las imágenes de screenshots y reinicia el contador de amor SOLO ESTA VEZ

console.log('='.repeat(60));
console.log('SCRIPT DE LIMPIEZA ÚNICA');
console.log('='.repeat(60));
console.log('\nCopia y pega este código en la consola del navegador:\n');
console.log('----------------------------------------\n');

const scriptCode = `
(async function() {
  console.log('🧹 Iniciando limpieza única...');
  
  // 1. Limpiar imágenes de IndexedDB
  try {
    const dbRequest = indexedDB.open('LoveAppDB', 1);
    
    dbRequest.onsuccess = function(event) {
      const db = event.target.result;
      
      if (db.objectStoreNames.contains('screenshots')) {
        const transaction = db.transaction(['screenshots'], 'readwrite');
        const store = transaction.objectStore('screenshots');
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = function() {
          console.log('✅ Todas las imágenes eliminadas de screenshots');
        };
        
        clearRequest.onerror = function() {
          console.error('❌ Error al eliminar imágenes');
        };
      } else {
        console.log('ℹ️ No hay imágenes para eliminar');
      }
    };
    
    dbRequest.onerror = function() {
      console.error('❌ Error al abrir IndexedDB');
    };
  } catch (error) {
    console.error('❌ Error limpiando screenshots:', error);
  }
  
  // 2. Reiniciar contadores de amor
  try {
    localStorage.setItem('loboLove', '0');
    localStorage.setItem('lobaLove', '0');
    console.log('✅ Contador de amor reiniciado a 0');
  } catch (error) {
    console.error('❌ Error reiniciando contador:', error);
  }
  
  console.log('\\n🎉 Limpieza completada. Recarga la página (F5) para ver los cambios.');
})();
`;

console.log(scriptCode);
console.log('\n----------------------------------------');
console.log('\n📋 INSTRUCCIONES:');
console.log('1. Abre tu aplicación en el navegador');
console.log('2. Presiona F12 para abrir DevTools');
console.log('3. Ve a la pestaña "Console"');
console.log('4. Copia el código de arriba (entre las líneas)');
console.log('5. Pégalo en la consola y presiona Enter');
console.log('6. Recarga la página (F5)');
console.log('\n' + '='.repeat(60));
