import { Module } from '@nestjs/common';
import { CampaignInfluencerController } from './campaign-influencer.controller';
import { CampaignInfluencerService } from './campaign-influencer.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CampaignInfluencerController],
  providers: [CampaignInfluencerService],
  exports: [CampaignInfluencerService],
})
export class CampaignInfluencerModule {}

