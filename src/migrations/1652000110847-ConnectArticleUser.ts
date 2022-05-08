import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConnectArticleUser1652000110847 implements MigrationInterface {
  name = 'ConnectArticleUser1652000110847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "article"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "article"."updatedAt" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "article"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "article"."createdAt" IS NULL`);
  }
}
