import { ListDto } from 'src/shared/dto/request/list.dto';
import { Op } from 'sequelize';
import { WhereOptions } from 'sequelize/dist/lib/model';
import { ListType } from 'src/shared/enums/list.enum';

export function getListOptionOfListDto(dto: ListDto): { limit: number; offset?: number; where?: WhereOptions } {
  if (dto.type === ListType.CURSOR) {
    return {
      limit: dto.limit,
      ...(dto.cursor && {
        where: {
          id: {
            [Op.lt]: dto.cursor,
          },
        },
      }),
    };
  }

  return {
    offset: (dto.page - 1) * dto.limit,
    limit: dto.limit,
  };
}
