const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      var dirlist = walkSync(dirFile, filelist);
      filelist = filelist.concat(dirlist);
    } else {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const srcDir = path.join(__dirname, 'src');
const files = walkSync(srcDir);

files.forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.js')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Remove JSX comments: {/* ... */}
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    // 2. Remove block comments: /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // 3. Remove line comments: // ...
    content = content.replace(/\/\/.*$/gm, (match, offset, string) => {
      // Very simple heuristic to avoid stripping http:// and https://
      const lineStart = string.lastIndexOf('\n', offset);
      const lineBefore = string.substring(lineStart, offset);
      if (lineBefore.includes('http:') || lineBefore.includes('https:') || match.includes('http:') || match.includes('https:')) {
        return match;
      }
      return '';
    });

    // 4. Remove empty lines that might have been left over
    content = content.replace(/^[ \t]+$/gm, '');
    content = content.replace(/\n{3,}/g, '\n\n');

    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Comments removed from ' + files.length + ' files.');
