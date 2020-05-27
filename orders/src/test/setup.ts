import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock('../nats-wrapper'); //this is the path to the file we are FAKING

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'dkfjhdfkh';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks(); //to ensure not using existing mocked objects
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a json web token payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  //Create the json web token
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //build session object { jwt: MY_JWT }
  const session = { jwt: token };
  //turn that into JSON
  const sessionJSON = JSON.stringify(session);
  //BASE 64 encode it
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return string with encoded data
  return [`express:sess=${base64}`];
};
