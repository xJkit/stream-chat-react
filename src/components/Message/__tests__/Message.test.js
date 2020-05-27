import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  generateChannel,
  getTestClientWithUser,
  generateUser,
  generateMessage,
} from 'mock-builders';
import Message from '../Message';

const alice = generateUser({ name: 'alice', image: 'alice-avatar.jpg' });

const CustomMessageUIComponent = jest.fn(() => <div>Message</div>);

async function renderComponent(
  message,
  props = {},
  channelConfig = { replies: true },
) {
  const channel = generateChannel({ getConfig: () => channelConfig });
  const client = await getTestClientWithUser(alice);
  return render(
    <Message
      t={(key) => key}
      channel={channel}
      client={client}
      message={message}
      typing={false}
      Message={CustomMessageUIComponent}
      {...props}
    />,
  );
}

function renderComponentWithMessage(
  props = {},
  channelConfig = { replies: true },
) {
  const message = generateMessage();
  return renderComponent(message, props, channelConfig);
}

describe('<Message /> component', () => {
  afterEach(cleanup);
  beforeEach(jest.clearAllMocks);

  it('should pass custom props to its Message child component', async () => {
    await renderComponentWithMessage({
      customProp: 'some custom prop',
    });
    expect(CustomMessageUIComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        customProp: 'some custom prop',
      }),
      {},
    );
  });

  it('should set actions if message is of %s %s', async () => {
    const message = generateMessage({ type: 'regular', status: 'received' });
    await renderComponent(message);
    expect(CustomMessageUIComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        actionsEnabled: true,
      }),
      {},
    );
  });

  it("should warn if message's own reactions contain a reaction from a different user then the currently active one", async () => {
    jest.spyOn(console, 'warn');
    const message = generateMessage({});
  });
});
