import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommunitiesModule } from './communities/communities.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [UsersModule, CommunitiesModule, AnnouncementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
