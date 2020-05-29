import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@cwticketing/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
