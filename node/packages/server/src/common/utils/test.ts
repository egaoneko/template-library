import { ModelOptions, Op } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

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
    logging: false,
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : [],
    ...partialOptions,
  });
}
