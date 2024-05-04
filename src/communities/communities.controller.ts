import {
  Controller,
  Get,
  Post,
  // Body,
  // Patch,
  Param,
  UseGuards,
  Request,
  // Delete,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CreateCommunityDto } from './dto/create-community.dto';
// import { UpdateCommunityDto } from './dto/update-community.dto';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  // @Post()
  // create(@Body() createCommunityDto: CreateCommunityDto) {
  //   return this.communitiesService.create(createCommunityDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('join/:community_code')
  join(@Param('community_code') community_code: string, @Request() req: any) {
    return this.communitiesService.join(community_code, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('leave/:community_id')
  leave(@Param('community_id') community_id: string, @Request() req: any) {
    return this.communitiesService.leave(community_id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.communitiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communitiesService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCommunityDto: UpdateCommunityDto,
  // ) {
  //   return this.communitiesService.update(+id, updateCommunityDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.communitiesService.remove(+id);
  // }
}
