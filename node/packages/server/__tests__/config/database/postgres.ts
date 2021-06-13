import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';

const testPostgresOptions: SequelizeModuleOptions = {
  name: 'common',
  dialect: 'sqlite',
  storage: ':memory:',
  autoLoadModels: true,
  synchronize: true,
  define: {
    underscored: true,
    timestamps: true,
    version: false,
    freezeTableName: true,
  },
};
export default testPostgresOptions;
