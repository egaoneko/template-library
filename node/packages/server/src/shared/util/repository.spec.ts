import { ListDto } from 'src/shared/dto/request/list.dto';
import { getListOptionOfListDto } from 'src/shared/util/repository';
import { Op } from 'sequelize';
import { ListType } from 'src/shared/enums/list.enum';

describe('Repository Util', () => {
  it('get list option by empty', async () => {
    const dto = new ListDto();
    const option = getListOptionOfListDto(dto);
    expect(option).toBeDefined();
    expect(option.limit).toBe(dto.limit);
    expect(option.offset).toBe(0);
    expect(option.where).toBeUndefined();
  });

  it('get list page option by limit and page', async () => {
    const dto = new ListDto();
    dto.limit = 10;
    dto.page = 2;
    const option = getListOptionOfListDto(dto);
    expect(option).toBeDefined();
    expect(option.limit).toBe(dto.limit);
    expect(option.offset).toBe(10);
    expect(option.where).toBeUndefined();
  });

  it('get list cursor option by limit and cursor', async () => {
    const dto = new ListDto();
    dto.type = ListType.CURSOR;
    dto.limit = 10;
    const option = getListOptionOfListDto(dto);
    expect(option).toBeDefined();
    expect(option.limit).toBe(dto.limit);
    expect(option.offset).toBeUndefined();
    expect(option.where).toBeUndefined();
  });

  it('get list cursor option by limit and cursor', async () => {
    const dto = new ListDto();
    dto.type = ListType.CURSOR;
    dto.limit = 10;
    dto.cursor = 2;
    const option = getListOptionOfListDto(dto);
    expect(option).toBeDefined();
    expect(option.limit).toBe(dto.limit);
    expect(option.offset).toBeUndefined();
    expect(option.where).toEqual({
      id: {
        [Op.lt]: 2,
      },
    });
  });
});
