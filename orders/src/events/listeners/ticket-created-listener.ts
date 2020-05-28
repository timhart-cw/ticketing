import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@cwticketing/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  //we created an interface TicketCreatedEvent to describe format of events
  //belwe we reference just the 'data' part of that interface as the data argument in the onMessage call

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
