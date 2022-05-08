import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticle1651998926612 implements MigrationInterface {
  name = 'CreateArticle1651998926612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "article"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "article"."updatedAt" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "article"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "article"."createdAt" IS NULL`);
  }
}
