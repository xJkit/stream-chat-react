import React, { Suspense } from 'react';

const DefaultEmojiPicker = (props) => {
  const EmojiPicker = React.lazy(() => import('./EmojiMartPicker'));
  return (
    <Suspense fallback={<div />}>
      <EmojiPicker {...props} />
    </Suspense>
  );
};

export default DefaultEmojiPicker;
