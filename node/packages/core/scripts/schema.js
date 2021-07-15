const refParser = require('@apidevtools/json-schema-ref-parser');
const recursive = require('recursive-readdir');
const json2ts = require('json-schema-to-typescript');
const fs = require('fs-extra');
const path = require('path');

async function generate(targetPath) {
  const schemaPath = path.join(__dirname, '../../../../schema');
  const filePaths = await recursive(schemaPath);
  const schemas = [];
  const schemaMap = new Map();

  for (const filePath of filePaths) {
    const absoluteDirPath = path.dirname(filePath);
    const relativeDirPath = absoluteDirPath.replace(schemaPath, '');
    const dirsName = relativeDirPath.replace(schemaPath, '').split(path.sep);
    const dirName = dirsName[dirsName.length - 1];
    const fileName = path.basename(filePath).split('.').shift();
    const dereferenced = await refParser.dereference(filePath, {
      resolve: {},
    });

    const schema = {
      dereferenced,
      filePath,
      absoluteDirPath,
      relativeDirPath,
      dirsName,
      dirName,
      fileName,
    };
    schemas.push(schema);
    schemaMap.set(dereferenced.title, schema);
  }

  for (const schema of schemas) {
    try {
      let ts = await json2ts.compile(schema.dereferenced, schema.fileName, {
        cwd: schemaPath,
        declareExternallyReferenced: false,
        style: {
          singleQuote: true,
        },
      });

      let imports = [];

      if (schema.dereferenced.extends) {
        imports = imports.concat(getImports(schema.dereferenced.extends, schema, schemaMap));
      }

      if (schema.dereferenced.properties) {
        imports = imports.concat(getImports(Object.values(schema.dereferenced.properties), schema, schemaMap));
      }

      imports = imports.filter((v, i, a) => a.findIndex(v2 => v.title === v2.title) === i);

      for (const item of imports) {
        ts = `import { ${item.title} } from '${item.path}';\n` + ts;
      }

      await fs.copy(schema.filePath, `${targetPath}/json/${schema.relativeDirPath || ''}/${schema.fileName}.json`);
      await fs.outputFile(`${targetPath}/types/${schema.relativeDirPath || ''}/${schema.fileName}.ts`, ts);
    } catch (e) {
      console.log(e);
    }
  }
}

function getImports(dereferenced, schema, schemaMap) {
  const imports = [];

  if (Array.isArray(dereferenced)) {
    dereferenced.forEach(item => {
      if (item.type === 'object' && typeof item.title !== 'undefined') {
        imports.push({
          title: item.title,
          path: getRelative(schema.absoluteDirPath, schemaMap.get(item.title).absoluteDirPath, item.title),
        });
      } else if (item.type === 'array' && typeof item.items.title !== 'undefined') {
        imports.push({
          title: item.items.title,
          path: getRelative(schema.absoluteDirPath, schemaMap.get(item.items.title).absoluteDirPath, item.items.title),
        });
      }
    });
  } else if (typeof dereferenced === 'object') {
    if (dereferenced.title) {
      imports.push({
        title: dereferenced.title,
        path: getRelative(
          schema.absoluteDirPath,
          schemaMap.get(dereferenced.title).absoluteDirPath,
          dereferenced.title,
        ),
      });
    }
  }
  return imports;
}

function getRelative(origin, target, title) {
  return (path.relative(origin, target) || '.') + '/' + title;
}

generate(path.join(__dirname, '../lib/schema'));
