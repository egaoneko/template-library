import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { format } from 'sql-formatter';

const defaultOptions: SequelizeModuleOptions = {
  name: DEFAULT_DATABASE_NAME,
  dialect: 'postgres',
  host: '0.0.0.0',
  database: 'postgres',
  username: 'root',
  password: 'root',
  port: 5432,
  autoLoadModels: true,
  synchronize: true,
  sync: {
    // force: true,
  },
  define: {
    underscored: true,
    timestamps: true,
    version: false,
    freezeTableName: true,
  },
  // timezone: 'UTC',
  logging: log => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    console.log(format(log));
  },
};

if (process.env.NODE_ENV === 'test') {
  if (defaultOptions.dialect !== 'sqlite') {
    defaultOptions.dialect = 'sqlite';
    delete defaultOptions.timezone;
  }
  defaultOptions.storage = ':memory:';
}

export default defaultOptions;
