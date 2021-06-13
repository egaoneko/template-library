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
    const dirPath = path.dirname(filePath);
    const dirsName = dirPath.replace(schemaPath, '').split(path.sep);
    const dirName = dirsName[dirsName.length - 1];
    const fileName = path.basename(filePath).split('.').shift();
    const dereferenced = await refParser.dereference(filePath, {
      resolve: {},
    });

    const schema = {
      dereferenced,
      filePath,
      dirPath,
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
        imports = imports.concat(
          getImports(schema.dereferenced.extends, schema, schemaMap)
        );
      }

      if (schema.dereferenced.properties) {
        imports = imports.concat(
          getImports(
            Object.values(schema.dereferenced.properties),
            schema,
            schemaMap
          )
        );
      }

      imports = imports.filter(
        (v, i, a) => a.findIndex((v2) => v.title === v2.title) === i
      );

      for (const item of imports) {
        ts = `import { ${item.title} } from '${item.path}';\n` + ts;
      }

      await fs.copy(
        schema.filePath,
        `${targetPath}/json/${schema.dirName || ''}/${schema.fileName}.json`
      );
      await fs.outputFile(
        `${targetPath}/types/${schema.dirName || ''}/${schema.fileName}.ts`,
        ts
      );
    } catch (e) {
      console.log(e);
    }
  }
}

function getImports(dereferenced, schema, schemaMap) {
  const imports = [];

  if (Array.isArray(dereferenced)) {
    dereferenced.forEach((item) => {
      if (!item.title) {
        return;
      }
      imports.push({
        title: item.title,
        path: getRelative(
          schema.dirPath,
          schemaMap.get(item.title).dirPath,
          item.title
        ),
      });
    });
  } else if (typeof dereferenced === 'object') {
    if (dereferenced.title) {
      imports.push({
        title: dereferenced.title,
        path: getRelative(
          schema.dirPath,
          schemaMap.get(dereferenced.title).dirPath,
          dereferenced.title
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
