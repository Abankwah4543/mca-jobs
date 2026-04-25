import Layout from '../components/Layout';

const Messages = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            <p className="text-gray-600">No messages yet.</p>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 card">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <p className="text-gray-600">Select a conversation to start chatting.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
