import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  create(createAnnouncementDto: CreateAnnouncementDto) {
    return 'This action adds a new announcement';
  }

  findAll() {
    return `This action returns all announcements`;
  }

  findOne(id: string) {
    return `This action returns a #${id} announcement`;
  }

  update(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
    return `This action updates a #${id} announcement`;
  }

  remove(id: string) {
    return `This action removes a #${id} announcement`;
  }
}
