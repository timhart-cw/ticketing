import { Publisher, OrderCancelledEvent, Subjects } from '@cwticketing/common';
//because this is a generic class we have to specify in <> what object type will actually be emitting
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
