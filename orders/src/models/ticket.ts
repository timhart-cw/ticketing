import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

//making sure we export this so that it's available as reference in Order.ts
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  //put method signature in here
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, //we had to rename this so that mongo didn't automatically asign a new _id when only provided with attrs.id
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
//this is how we actually add the method
ticketSchema.methods.isReserved = async function () {
  //this === the ticket document implementation
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  //this means it will return true or false - even if it's null
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export { Ticket };
