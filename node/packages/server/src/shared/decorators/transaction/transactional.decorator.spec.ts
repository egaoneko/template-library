import { Sequelize } from 'sequelize-typescript';
import { createMock } from '@golevelup/ts-jest';
import { SequelizeOptionDto, Transactional } from './transactional.decorator';
import { Transaction } from 'sequelize';
import { InternalServerErrorException } from '@nestjs/common';

describe('Transactional Decorator', () => {
  it('should be set transactional', async () => {
    const expected = {};
    let transaction!: Transaction;
    class TestClass extends TestBaseClass {
      @Transactional()
      async testTransaction(options?: SequelizeOptionDto): Promise<Record<string, unknown>> {
        expect(options).toBeDefined();
        expect(options).toBeInstanceOf(SequelizeOptionDto);
        transaction = options?.transaction as Transaction;
        expect(transaction).toBeDefined();
        return expected;
      }
    }
    const instance = new TestClass();
    const actual = await instance.testTransaction();

    expect(actual).toBe(expected);
    expect(instance.sequelize.transaction).toBeCalledTimes(1);
    expect(instance.sequelize.transaction).toBeCalledTimes(1);
    expect(transaction.commit).toBeCalledTimes(1);
  });

  it('should be set transactional with transaction option', async () => {
    const option = {};
    const expected = {};
    let transaction!: Transaction;
    class TestClass extends TestBaseClass {
      @Transactional(option)
      async testTransaction(options?: SequelizeOptionDto): Promise<Record<string, unknown>> {
        expect(options).toBeDefined();
        expect(options).toBeInstanceOf(SequelizeOptionDto);
        transaction = options?.transaction as Transaction;
        expect(transaction).toBeDefined();
        return expected;
      }
    }
    const instance = new TestClass();
    const actual = await instance.testTransaction();

    expect(actual).toBe(expected);
    expect(instance.sequelize.transaction).toBeCalledTimes(1);
    expect(instance.sequelize.transaction).toBeCalledWith(option);
    expect(transaction.commit).toBeCalledTimes(1);
  });

  it('should be set transactional with sequence', async () => {
    const expected = {};
    let transaction!: Transaction;
    class TestClass extends TestBaseClass {
      @Transactional(undefined, 1)
      async testTransaction(other?: unknown, options?: SequelizeOptionDto): Promise<Record<string, unknown>> {
        expect(options).toBeDefined();
        expect(options).toBeInstanceOf(SequelizeOptionDto);
        transaction = options?.transaction as Transaction;
        expect(transaction).toBeDefined();
        return expected;
      }
    }
    const instance = new TestClass();
    const actual = await instance.testTransaction();

    expect(actual).toBe(expected);
    expect(instance.sequelize.transaction).toBeCalledTimes(1);
    expect(transaction.commit).toBeCalledTimes(1);
  });

  it('should be set transactional with parent transaction', async () => {
    const expected = {};
    let parentTransaction!: Transaction;
    let childTransaction!: Transaction;
    class TestClass extends TestBaseClass {
      @Transactional()
      async testParentTransaction(options?: SequelizeOptionDto): Promise<Record<string, unknown>> {
        await this.testChildTransaction(options);
        expect(options).toBeDefined();
        parentTransaction = options?.transaction as Transaction;
        expect(parentTransaction).toBeDefined();
        return expected;
      }

      @Transactional()
      async testChildTransaction(options?: SequelizeOptionDto): Promise<Record<string, unknown>> {
        expect(options).toBeDefined();
        expect(options).toBeInstanceOf(SequelizeOptionDto);
        childTransaction = options?.transaction as Transaction;
        expect(childTransaction).toBeDefined();
        return expected;
      }
    }
    const instance = new TestClass();
    const actual = await instance.testParentTransaction();
    expect(actual).toBe(expected);
    expect(instance.sequelize.transaction).toBeCalledTimes(1);
    expect(parentTransaction).toBe(childTransaction);
    expect(parentTransaction.commit).toBeCalledTimes(1);
  });

  it('should be set transactional with rollback', async () => {
    let transaction!: Transaction;
    class TestClass extends TestBaseClass {
      @Transactional()
      async testTransaction(options?: SequelizeOptionDto): Promise<Record<string, unknown>> {
        expect(options).toBeDefined();
        expect(options).toBeInstanceOf(SequelizeOptionDto);
        transaction = options?.transaction as Transaction;
        expect(transaction).toBeDefined();
        throw new InternalServerErrorException('Throw error to rollback');
      }
    }
    const instance = new TestClass();
    await expect(instance.testTransaction()).rejects.toThrowError('Throw error to rollback');
    expect(instance.sequelize.transaction).toBeCalledTimes(1);
    expect(transaction.rollback).toBeCalledTimes(1);
  });
});

class TestBaseClass {
  readonly sequelize: Sequelize = createMock<Sequelize>();
}
