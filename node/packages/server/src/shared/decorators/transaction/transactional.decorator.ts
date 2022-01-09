import { Sequelize, TransactionOptions, Transaction, WhereOptions } from 'sequelize';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function Transactional(options?: TransactionOptions, sequence?: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const original: (...args: any[]) => any = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = async function (...args: any[]): Promise<any> {
        let transaction: Transaction | null = null;

        try {
          let optionDto: SequelizeOptionDto | null = args.find(arg => arg instanceof SequelizeOptionDto) ?? null;

          if (!optionDto) {
            optionDto = new SequelizeOptionDto();

            if (sequence) {
              args[sequence] = optionDto;
            } else {
              args.push(optionDto);
            }
          }

          if (!optionDto.transaction) {
            transaction = await (this as { sequelize: Sequelize }).sequelize.transaction(options);
            optionDto.transaction = transaction;
          }

          const result = await original.apply(this, args);

          await transaction?.commit();
          return result;
        } catch (e) {
          await transaction?.rollback();
          throw e;
        }
      };
    }
    return descriptor;
  };
}

export class SequelizeOptionDto<T = any> {
  transaction?: Transaction;
  where?: WhereOptions<T>;
}
