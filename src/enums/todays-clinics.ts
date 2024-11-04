export enum FILE_STATUS {
  IN_PROGRESS = 'in_progress',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW_BY_rEADER = 'in_review_by_reader',
  IN_REVIEW_BY_DOCTOR = 'in_review_by_doctor',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED_DUE_T0_SOMETHING_WRONG = 'rejected_due_to_something_wrong_with_file',
  REJECTED_DUE_TO_MEDIA_OPACITY = 'rejected_due_to_media_opacity',
}

export enum ALERT_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}
