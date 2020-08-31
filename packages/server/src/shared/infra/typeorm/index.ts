import { createConnections, ConnectionOptions } from 'typeorm';
import path from 'path';

const connection: ConnectionOptions[] = [
  {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    entities: [
      `${path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'modules/**/infra/typeorm/entities/*.ts',
      )}`,
    ],
    migrations: ['./migrations/*.ts'],
    cli: {
      migrationsDir: './migrations',
    },
  },
  {
    name: 'mongo',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'gobarber',
    entities: [
      `${path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'modules/**/infra/typeorm/schemas/*.ts',
      )}`,
    ],
    useUnifiedTopology: true,
  },
];

createConnections(connection);
