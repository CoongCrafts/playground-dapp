import { MemberStatus } from '@/types';
import { timestampToDate } from '@/utils/date';

export const toMemberStatus = (nextRenewalAt: string | null): MemberStatus => {
  if (nextRenewalAt === null) {
    return MemberStatus.Active;
  } else if (nextRenewalAt == '0') {
    return MemberStatus.Left;
  } else {
    return timestampToDate(nextRenewalAt).getTime() > Date.now() ? MemberStatus.Active : MemberStatus.Inactive;
  }
};
