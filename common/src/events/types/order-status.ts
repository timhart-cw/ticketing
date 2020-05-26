export enum OrderStatus {
  //when the order has been created but ticket, it trying to order, has not been reserved
  Created = 'created',
  //when the ticket, the order is trying to reserve, has already been reserved
  // or when the user has cancelled the order
  //or the order expires before payment received
  Cancelled = 'cancelled',
  //when the order has successfully reserved ticket
  AwaitingPayment = 'awaiting:payment',
  //when the order has reserved the ticket and user has successfully provided payment
  Complete = 'complete',
}
