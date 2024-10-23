import { Module } from '@nestjs/common';
import { MapperService } from './application/mapper/mapper.service';

@Module({
  imports: [],
  providers: [MapperService],
  exports: [MapperService],
})
export class CommonModule {}
