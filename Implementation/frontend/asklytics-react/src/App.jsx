import React from 'react';
import { ProChat } from '@ant-design/pro-chat';

const App = () => (
  <ProChat
    style={{
      height: '100vh',
      width: '100vw',
    }}
    helloMessage={
      'Hello from Asklytics - COMP-4495 - Applied Research Project'
    }
    placeholder={'Ask me anything about your website analytics'}
    request={async (messages) => {
      const mockedData = `This is a dummy response ${messages.length}`;
      return new Response(mockedData);
    }}
  />
);

export default App;