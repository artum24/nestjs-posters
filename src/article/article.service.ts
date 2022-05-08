import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleEntity } from '@app/article/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from '@app/article/dto/updateArticle.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = ArticleService.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  async getArticles(): Promise<ArticleEntity[]> {
    return this.articleRepository.find();
  }

  async getArticle(slug: string): Promise<ArticleEntity> {
    return this.articleRepository.findOne({ slug });
  }

  async deleteArticle(slug: string, userId: number): Promise<DeleteResult> {
    const currentArticle = await this.getArticle(slug);
    if (!currentArticle) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentArticle.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    userId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const currentArticle = await this.getArticle(slug);
    if (!currentArticle) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentArticle.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    Object.assign(currentArticle, updateArticleDto);
    return await this.articleRepository.save(currentArticle);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article,
    };
  }

  private static getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
