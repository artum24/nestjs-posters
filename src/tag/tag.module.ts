import { Module } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { TagController } from '@app/tag/tag.controller';
import { TagEntity } from '@app/tag/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TagService],
  controllers: [TagController],
  imports: [TypeOrmModule.forFeature([TagEntity])],
})
export class TagModule {}
