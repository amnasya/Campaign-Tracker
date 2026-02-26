import { CampaignInfluencerStatus } from '@prisma/client';

import { BadRequestException } from '@nestjs/common';

// Define allowed workflow transitions
const ALLOWED_TRANSITIONS: Record<CampaignInfluencerStatus, CampaignInfluencerStatus[]> = {
  [CampaignInfluencerStatus.invited]: [CampaignInfluencerStatus.accepted],
  [CampaignInfluencerStatus.accepted]: [CampaignInfluencerStatus.submitted],
  [CampaignInfluencerStatus.submitted]: [CampaignInfluencerStatus.verified],
  [CampaignInfluencerStatus.verified]: [], // Final status
};

/**
 * Validates if a workflow status transition is allowed
 * @param currentStatus - The current workflow status
 * @param newStatus - The desired new workflow status
 * @throws BadRequestException if the transition is not allowed
 */
export function validateWorkflowTransition(
  currentStatus: CampaignInfluencerStatus,
  newStatus: CampaignInfluencerStatus,
): void {
  const allowedStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];

  if (!allowedStatuses.includes(newStatus)) {
    throw new BadRequestException(
      `Cannot transition from ${currentStatus} to ${newStatus}`,
    );
  }
}

