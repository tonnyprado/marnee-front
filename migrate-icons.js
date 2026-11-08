#!/usr/bin/env node

/**
 * Script de migración automática de iconos
 * Reemplaza lucide-react por @animateicons/react/lucide
 */

const fs = require('fs');
const path = require('path');

// Configuración
const SRC_DIR = './src';
const FILE_EXTENSIONS = ['.jsx', '.tsx', '.js', '.ts'];

// Estadísticas
let filesProcessed = 0;
let filesModified = 0;
let importsReplaced = 0;

/**
 * Procesa un archivo
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Verificar si el archivo usa lucide-react
  if (!content.includes('from \'lucide-react\'') && !content.includes('from "lucide-react"')) {
    return;
  }

  filesProcessed++;

  // Reemplazar imports de lucide-react por @animateicons/react/lucide
  let newContent = content;

  // Patrón 1: import { ... } from 'lucide-react'
  newContent = newContent.replace(
    /from\s+['"]lucide-react['"]/g,
    'from \'@animateicons/react/lucide\''
  );

  // Solo escribir si hubo cambios
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    filesModified++;
    importsReplaced++;
    console.log(`✅ Migrado: ${filePath}`);
  }
}

/**
 * Recorre directorio recursivamente
 */
function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignorar node_modules, build, etc.
      if (!['node_modules', 'build', 'dist', '.git'].includes(file)) {
        walkDirectory(filePath);
      }
    } else if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
      processFile(filePath);
    }
  });
}

// Ejecutar migración
console.log('🚀 Iniciando migración de iconos...\n');
console.log('📂 Directorio:', SRC_DIR);
console.log('🔍 Buscando archivos con lucide-react...\n');

try {
  walkDirectory(SRC_DIR);

  console.log('\n📊 Resumen de migración:');
  console.log(`   Archivos procesados: ${filesProcessed}`);
  console.log(`   Archivos modificados: ${filesModified}`);
  console.log(`   Imports reemplazados: ${importsReplaced}`);
  console.log('\n✨ ¡Migración completada!');
  console.log('\n📝 Próximos pasos:');
  console.log('   1. Revisar los cambios con git diff');
  console.log('   2. Probar la aplicación: npm start');
  console.log('   3. Ajustar estilos si es necesario (size, color, duration)');

} catch (error) {
  console.error('❌ Error durante la migración:', error);
  process.exit(1);
}
