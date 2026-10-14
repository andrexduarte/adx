import '@angular/compiler';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createEnvironmentInjector,
  PLATFORM_ID,
  RESPONSE_INIT,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { ContentStore } from '../.test-output/app/core/content/content-store.mjs';
import { Gateway } from '../.test-output/app/core/content/gateway.mjs';
const key = makeStateKey('public-content-v1');
const setup = (gateway, transfer = new TransferState(), response = {}) => {
  const injector = createEnvironmentInjector([
    { provide: Gateway, useValue: gateway },
    { provide: PLATFORM_ID, useValue: gateway.browser ? 'browser' : 'server' },
    { provide: TransferState, useValue: transfer },
    { provide: RESPONSE_INIT, useValue: response },
    ContentStore,
  ]);
  return { store: injector.get(ContentStore), transfer, response, injector };
};
test('hydration reuses the public server snapshot without issuing a second request', async () => {
  let calls = 0;
  const server = setup({
    configured: true,
    browser: false,
    published: async () => {
      calls++;
      return [];
    },
  });
  await server.store.load();
  assert.equal(server.store.entries().length, 0);
  assert.equal(calls, 1);
  const client = setup(
    {
      configured: true,
      browser: true,
      published: async () => {
        calls++;
        throw new Error('Should not fetch');
      },
    },
    server.transfer,
  );
  await client.store.load();
  assert.equal(calls, 1);
  assert.equal(client.store.entries().length, 0);
  assert.equal(client.transfer.hasKey(key), false);
  server.injector.destroy();
  client.injector.destroy();
});
test('server failures are transferred consistently and return a temporary HTTP error', async () => {
  const server = setup({
    configured: true,
    browser: false,
    published: async () => {
      throw new Error('Offline');
    },
  });
  await server.store.load();
  assert.equal(server.response.status, 503);
  assert.equal(server.store.entries().length, 0);
  assert.equal(server.store.connectionError(), true);
  const client = setup(
    {
      configured: true,
      browser: true,
      published: async () => {
        throw new Error('Should not fetch');
      },
    },
    server.transfer,
  );
  await client.store.load();
  assert.equal(client.store.connectionError(), true);
  assert.equal(client.store.entries().length, server.store.entries().length);
  server.injector.destroy();
  client.injector.destroy();
});
