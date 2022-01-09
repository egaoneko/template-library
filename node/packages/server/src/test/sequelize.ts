import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { format } from 'sql-formatter';

import { ModelOptions, Op } from 'sequelize';

export function createSequelize(partialOptions: Partial<SequelizeOptions>): Sequelize;
export function createSequelize(useModelsInPath?: boolean, define?: ModelOptions): Sequelize;
export function createSequelize(
  useModelsInPathOrPartialOptions?: boolean | Partial<SequelizeOptions>,
  define: ModelOptions = {},
): Sequelize {
  let useModelsInPath = true;
  let partialOptions = {};
  if (typeof useModelsInPathOrPartialOptions === 'object') {
    partialOptions = useModelsInPathOrPartialOptions;
  } else if (typeof useModelsInPathOrPartialOptions === 'boolean') {
    useModelsInPath = useModelsInPathOrPartialOptions;
  }

  return new Sequelize({
    operatorsAliases: Op,
    database: '__',
    dialect: 'sqlite' as const,
    username: 'root',
    password: '',
    define,
    storage: ':memory:',
    logging: log => {
      format(log);
    },
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : [],
    ...partialOptions,
  });
}
