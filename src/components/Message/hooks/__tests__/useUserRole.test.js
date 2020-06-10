import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import {
  getTestClientWithUser,
  generateChannel,
  generateMessage,
  generateReaction,
  generateUser,
} from 'mock-builders';
import { ChannelContext } from '../../../../context';
import { useUserRole } from '../useUserRole';

const getConfig = jest.fn();
const alice = generateUser({ name: 'alice' });
const bob = generateUser({ name: 'bob' });

async function renderUserRoleHook(
  message = generateMessage(),
  channelProps,
  channelContextValue,
) {
  const client = await getTestClientWithUser(alice);
  const channel = generateChannel({
    getConfig,
    ...channelProps,
  });
  const wrapper = ({ children }) => (
    <ChannelContext.Provider
      value={{
        channel,
        client,
        ...channelContextValue,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
  const { result } = renderHook(() => useUserRole(message), { wrapper });
  return result.current;
}

describe('useReactionHandler custom hook', () => {
  afterEach(jest.clearAllMocks);
  it('should correctly tell if message belongs to user', async () => {
    const message = generateMessage({ user: alice });
    const { isMyMessage } = await renderUserRoleHook(message);
    expect(isMyMessage).toBe(true);
  });

  it('should correctly tell if message does not belongs to user', async () => {
    const message = generateMessage({ user: bob });
    const { isMyMessage } = await renderUserRoleHook(message);
    expect(isMyMessage).toBe(false);
  });

  it('should correctly tell if user is admin when user has admin role', async () => {
    const message = generateMessage();
    const adminUser = generateUser({ role: 'admin' });
    const clientMock = await getTestClientWithUser(adminUser);
    const { isAdmin } = await renderUserRoleHook(
      message,
      {},
      { client: clientMock },
    );
    expect(isAdmin).toBe(true);
  });
});
