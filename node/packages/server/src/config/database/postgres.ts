import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { SQLITE_STORAGE_PATH } from '@common/constants/database';
import { format } from 'sql-formatter';

const postgresOptions: SequelizeModuleOptions = {
  name: 'common',
  dialect: 'sqlite',
  storage: SQLITE_STORAGE_PATH,
  // dialect: 'postgres',
  // host: '0.0.0.0',
  // database: 'postgres',
  // username: 'root',
  // password: 'root',
  // port: 3306,
  autoLoadModels: true,
  synchronize: true,
  define: {
    underscored: true,
    timestamps: true,
    version: false,
    freezeTableName: true,
  },
  // timezone: 'UTC',
  logging: log => {
    format(log);
  },
};
export default postgresOptions;
