import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommunitiesModule } from './communities/communities.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, CommunitiesModule, AnnouncementsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
