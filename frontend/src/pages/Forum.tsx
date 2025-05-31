import React, { useState } from 'react';
import '../styles/login.css';

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: string[];
}

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>([{
    id: 1,
    author: 'Jane Doe',
    content: 'Just launched my MVP! How do I calculate burn rate effectively?',
    timestamp: '2025-05-31T10:00:00Z',
    likes: 0,
    dislikes: 0,
    replies: [],
  }]);

  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    const newEntry: Post = {
      id: posts.length + 1,
      author: 'Current User',
      content: newPost.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    setPosts([newEntry, ...posts]);
    setNewPost('');
    const editor = document.getElementById('new-post-editor');
    if (editor) editor.innerText = '';
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleDislike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, dislikes: p.dislikes + 1 } : p));
  };

  const handleReply = (id: number) => {
    const text = replyText[id];
    if (!text?.trim()) return;
    setPosts(posts.map(p =>
      p.id === id ? { ...p, replies: [...p.replies, text.trim()] } : p
    ));
    setReplyText(prev => ({ ...prev, [id]: '' }));
    const editor = document.getElementById(`reply-editor-${id}`);
    if (editor) editor.innerText = '';
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '720px', width: '100%' }}>
        <h2 className="login-heading">Founder Forum</h2>
        <p className="login-subtext">Post insights, questions, or lessons from your startup journey.</p>

        <div className="login-form">
          <div
            id="new-post-editor"
            contentEditable
            className="post-editor"
            data-placeholder="What's on your mind?"
            onInput={e => setNewPost((e.target as HTMLElement).innerText)}
            suppressContentEditableWarning={true}
          />
          <button type="submit" onClick={handlePost}>Post</button>
        </div>

        <div className="login-divider"><span>Recent Posts</span></div>

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="forum-post">
              <div className="meta">
                <span className="author">{post.author}</span>
                <span>{new Date(post.timestamp).toLocaleString()}</span>
              </div>

              <div className="content">{post.content}</div>

              <div className="actions">
                <button onClick={() => handleLike(post.id)} className="bg-blue-100 text-blue-700 hover:bg-blue-200">👍 {post.likes}</button>
                <button onClick={() => handleDislike(post.id)} className="bg-red-100 text-red-700 hover:bg-red-200">👎 {post.dislikes}</button>
              </div>

              {post.replies.length > 0 && (
                <div className="replies">
                  {post.replies.map((reply, i) => (
                    <div key={i}>
                      <strong>Reply:</strong> {reply}
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div style={{ marginTop: '1rem' }}>
                <div
                  id={`reply-editor-${post.id}`}
                  contentEditable
                  className="post-editor"
                  data-placeholder="Write a reply..."
                  onInput={e =>
                    setReplyText(prev => ({
                      ...prev,
                      [post.id]: (e.target as HTMLElement).innerText,
                    }))
                  }
                  suppressContentEditableWarning={true}
                />
                <button onClick={() => handleReply(post.id)}>Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
