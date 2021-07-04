import { BadRequestException, Injectable } from '@nestjs/common';
import { GetArticlesDto } from '@root/article/dto/get-articles.input';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Sequelize } from 'sequelize';
import { Article } from '@root/article/entities/article.entity';
import { ArticleFavorite } from '@root/article/entities/article-favorite.entity';
import { ArticlesDto } from '@root/article/dto/articles.response';
import { validate } from 'class-validator';
import { ArticleDto } from '@root/article/dto/article.response';
import { ProfileService } from '@root/profile/profile.service';
import { Tag } from '@root/article/entities/tag.entity';
import { SequelizeOptionDto, Transactional } from '@shared/decorators/transaction/transactional.decorator';

@Injectable()
export class ArticleService {
  constructor(
    private readonly profileService: ProfileService,
    @InjectModel(Article, DEFAULT_DATABASE_NAME)
    private readonly articleModel: typeof Article,
    @InjectModel(ArticleFavorite, DEFAULT_DATABASE_NAME)
    private readonly articleFavoriteModel: typeof ArticleFavorite,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  @Transactional()
  async findAll(
    getArticlesDto: GetArticlesDto,
    currentUserId: number,
    options?: SequelizeOptionDto,
  ): Promise<ArticlesDto> {
    const errors = await validate(getArticlesDto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid article list params');
    }

    const { count, rows } = await this.articleModel.findAndCountAll({
      where: {
        ...(getArticlesDto.author && {
          authorId: getArticlesDto.author,
        }),
      },
      order: [['updatedAt', 'DESC']],
      offset: (getArticlesDto.page - 1) * getArticlesDto.limit,
      limit: getArticlesDto.limit,
      include: [
        {
          model: ArticleFavorite,
          where: {
            ...(getArticlesDto.favorited && {
              userId: getArticlesDto.favorited,
            }),
          },
          required: !!getArticlesDto.favorited,
        },
        {
          model: Tag,
          where: {
            ...(getArticlesDto.tag && {
              title: getArticlesDto.tag,
            }),
          },
          required: !!getArticlesDto.tag,
        },
      ],
      distinct: true,
      transaction: options?.transaction,
    });

    const listDto = new ArticlesDto();
    listDto.count = count;
    listDto.list = [];

    for (const row of rows) {
      const dto = await this.ofArticleDto(row, currentUserId, options);
      listDto.list.push(dto);
    }

    return listDto;
  }

  async ofArticleDto(articleEntity: Article, currentUserId: number, options?: SequelizeOptionDto): Promise<ArticleDto> {
    const dto = new ArticleDto();
    dto.id = articleEntity.id;
    dto.slug = articleEntity.slug;
    dto.title = articleEntity.title;
    dto.description = articleEntity.description;
    dto.body = articleEntity.body;
    dto.tagList = articleEntity.tags.map(tag => tag.title);
    dto.createdAt = articleEntity.createdAt;
    dto.updatedAt = articleEntity.updatedAt;

    dto.favorited = articleEntity.articleFavorites.some(favorite => favorite.userId === currentUserId);
    dto.favoritesCount = articleEntity.articleFavorites.length;
    dto.author = await this.profileService.get(currentUserId, articleEntity.authorId, options);
    return dto;
  }
}
