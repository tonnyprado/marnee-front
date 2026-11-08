#!/usr/bin/env node

/**
 * Script de migración de emojis a iconos animados
 * Reemplaza emojis por componentes de @animateicons/react/lucide
 */

const fs = require('fs');
const path = require('path');

// Cargar mapeo de emojis
const mapping = require('./emoji-to-icon-mapping.json').mappings;

// Configuración
const SRC_DIR = './src';
const FILE_EXTENSIONS = ['.jsx', '.tsx', '.js', '.ts'];

// Estadísticas
let filesProcessed = 0;
let filesModified = 0;
let emojisReplaced = 0;

/**
 * Extrae imports existentes de un archivo
 */
function extractExistingImports(content) {
  const animateIconsImportMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]@animateicons\/react\/lucide['"]/);
  if (animateIconsImportMatch) {
    return animateIconsImportMatch[1]
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon.length > 0);
  }
  return [];
}

/**
 * Procesa un archivo
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Buscar emojis
  const emojisFound = new Set();
  const iconsNeeded = new Set();

  // Revisar cada emoji en el mapeo
  for (const [emoji, data] of Object.entries(mapping)) {
    if (content.includes(emoji)) {
      emojisFound.add(emoji);
      iconsNeeded.add(data.icon);
    }
  }

  if (emojisFound.size === 0) {
    return;
  }

  filesProcessed++;

  // Obtener imports existentes
  const existingImports = extractExistingImports(content);
  const newImports = [...new Set([...existingImports, ...iconsNeeded])];

  // Reemplazar emojis con componentes
  let newContent = content;
  for (const emoji of emojisFound) {
    const icon = mapping[emoji].icon;

    // Reemplazar emoji con componente
    // Intentar diferentes patrones

    // Patrón 1: emoji solo en JSX {emoji}
    const jsxPattern = new RegExp(`{['"]*${escapeRegExp(emoji)}['"]*}`, 'g');
    newContent = newContent.replace(jsxPattern, `<${icon} className="inline-block w-4 h-4" />`);

    // Patrón 2: emoji en string JSX
    const stringPattern = new RegExp(`(['"\`])([^'"\`]*?)${escapeRegExp(emoji)}([^'"\`]*?)\\1`, 'g');
    newContent = newContent.replace(stringPattern, (match, quote, before, after) => {
      // Solo reemplazar si no es parte de un comentario o import
      if (match.includes('//') || match.includes('import')) {
        return match;
      }
      return `${quote}${before}{' '}<${icon} className="inline-block w-4 h-4" />{' '}${after}${quote}`;
    });

    emojisReplaced++;
    modified = true;
  }

  // Actualizar imports
  if (newImports.length > 0) {
    const importStatement = `import { ${newImports.sort().join(', ')} } from '@animateicons/react/lucide';`;

    // Buscar si ya existe un import de @animateicons/react/lucide
    if (content.includes('@animateicons/react/lucide')) {
      // Reemplazar import existente
      newContent = newContent.replace(
        /import\s*{[^}]+}\s*from\s*['"]@animateicons\/react\/lucide['"]\s*;?/,
        importStatement
      );
    } else {
      // Agregar nuevo import después del último import o al inicio
      const lastImportMatch = newContent.match(/^import\s+.*?;?\s*$/gm);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        newContent = newContent.replace(lastImport, `${lastImport}\n${importStatement}`);
      } else {
        newContent = `${importStatement}\n\n${newContent}`;
      }
    }
  }

  if (modified) {
    // Nota: Este script muestra lo que haría, pero no modifica los archivos
    // Se recomienda revisión manual debido a la complejidad de los reemplazos
    console.log(`⚠️  Emojis encontrados en: ${filePath}`);
    console.log(`   Emojis: ${[...emojisFound].join(', ')}`);
    console.log(`   Iconos sugeridos: ${[...iconsNeeded].join(', ')}`);
    filesModified++;
  }
}

/**
 * Escapa caracteres especiales para RegExp
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
      if (!['node_modules', 'build', 'dist', '.git'].includes(file)) {
        walkDirectory(filePath);
      }
    } else if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
      processFile(filePath);
    }
  });
}

// Ejecutar análisis
console.log('🔍 Analizando emojis en el código...\n');
console.log('📂 Directorio:', SRC_DIR);
console.log('📝 Este script solo muestra lo que necesita ser cambiado.\n');
console.log('⚠️  Se recomienda migración manual de emojis debido a contextos variados.\n');

try {
  walkDirectory(SRC_DIR);

  console.log('\n📊 Resumen del análisis:');
  console.log(`   Archivos con emojis: ${filesModified}`);
  console.log(`   Total de emojis únicos encontrados: ${emojisReplaced}`);

  console.log('\n📝 Recomendación:');
  console.log('   1. Revisar cada archivo mencionado arriba');
  console.log('   2. Reemplazar manualmente los emojis con los iconos sugeridos');
  console.log('   3. Consultar emoji-to-icon-mapping.json para ver el mapeo completo');
  console.log('\n💡 Ejemplo de reemplazo:');
  console.log('   Antes: "🎯 Objetivo"');
  console.log('   Después: <Target className="inline-block w-4 h-4" /> Objetivo');

} catch (error) {
  console.error('❌ Error durante el análisis:', error);
  process.exit(1);
}
