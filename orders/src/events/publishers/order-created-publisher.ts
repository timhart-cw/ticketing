import { Publisher, OrderCreatedEvent, Subjects } from '@cwticketing/common';
//because this is a generic class we have to specify in <> what object type will actually be emitting
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
