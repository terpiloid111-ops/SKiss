import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../auth/entities/user.entity';
import { UserSettings } from './entities/user-settings.entity';
import { ActivityLog } from './entities/activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSettings, ActivityLog]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
