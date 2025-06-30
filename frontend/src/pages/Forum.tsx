// frontend/src/pages/Forum.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/forum.css';
import { getCurrentUsername } from '../utils/cognito';
import { AiOutlineLike } from 'react-icons/ai';

interface Post {
  postId:    string;
  author:    string;
  content:   string;
  timestamp: string;
  likes:     number;
  dislikes:  number;
  replies:   string[];  // each entry is now "Alice: This is my reply"
}

type Vote = 'like' | 'dislike';

export default function Forum() {
  const rawUsername = getCurrentUsername() || 'Anonymous';

  // pull firstName from Cognito idToken
  const [firstName, setFirstName] = useState<string>('');
  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setFirstName(payload.given_name || payload.name || '');
      } catch {
        console.error('Failed to decode idToken');
      }
    }
  }, []);
  const currentUser = firstName || rawUsername;

  // forum state
  const [posts, setPosts]             = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting]     = useState(false);
  const [voteStatus, setVoteStatus]   = useState<Record<string, Vote>>({});
  const [replyText, setReplyText]     = useState<Record<string, string>>({});

  // fetch posts
  useEffect(() => {
    axios.get<Post[]>('http://localhost:3001/api/posts')
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  // new post
  const handlePost = () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);

    axios.post<Post>('http://localhost:3001/api/posts', {
      author:  currentUser,
      content: newPostText.trim(),
    })
      .then(res => {
        setPosts(prev => [res.data, ...prev]);
        setNewPostText('');
        const editor = document.getElementById('new-post-editor');
        if (editor) (editor as HTMLElement).innerText = '';
      })
      .catch(console.error)
      .finally(() => setIsPosting(false));
  };

  // like handler
  const handleVote = async (
    postId:    string,
    timestamp: string,
    vote:      Vote
  ) => {
    if (voteStatus[postId] === vote) return;
    try {
      const res = await axios.patch<Post>(
        `http://localhost:3001/api/posts/${postId}/${vote}`,
        { timestamp, user: currentUser }
      );
      setPosts(prev =>
        prev.map(p => (p.postId === postId ? res.data! : p))
      );
      setVoteStatus(vs => ({ ...vs, [postId]: vote }));
    } catch (err) {
      console.error(`Failed to ${vote}`, err);
    }
  };

  // reply submit
  const handleReply = async (postId: string, timestamp: string) => {
    const text = (replyText[postId] || '').trim();
    if (!text) return;

    // prefix with the replier’s name
    const fullReply = `${currentUser}: ${text}`;

    try {
      const res = await axios.patch<Post>(
        `http://localhost:3001/api/posts/${postId}/reply`,
        { timestamp, reply: fullReply }
      );
      setPosts(prev =>
        prev.map(p => (p.postId === postId ? res.data! : p))
      );
      // clear textarea
      setReplyText(r => ({ ...r, [postId]: '' }));
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 720, width: '100%' }}>
        <h2 className="login-heading">Founder Forum</h2>
        <p className="login-subtext">
          Post insights, questions, or lessons from your startup journey.
        </p>

        {/* New Post */}
        <div className="login-form">
          <div
            id="new-post-editor"
            contentEditable
            className="post-editor"
            data-placeholder="What's on your mind?"
            suppressContentEditableWarning
            onInput={e =>
              setNewPostText((e.currentTarget as HTMLElement).innerText)
            }
          />
          <button
            onClick={handlePost}
            disabled={isPosting}
            style={{
              opacity: isPosting ? 0.6 : 1,
              cursor: isPosting ? 'not-allowed' : 'pointer',
              color: '#ffffff',
            }}
          >
            {isPosting ? 'Posting…' : 'Post'}
          </button>
        </div>

        <div className="login-divider">
          <span>Recent Posts</span>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.postId} className="forum-post">
              <div className="meta">
                <span className="author">{post.author}</span>
                <span>{new Date(post.timestamp).toLocaleString()}</span>
              </div>

              <div className="content">{post.content}</div>

              {/* Centered Indigo Like Button */}
              <div
                className="actions"
                style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
              >
                <button
                  onClick={() =>
                    handleVote(post.postId, post.timestamp, 'like')
                  }
                  disabled={voteStatus[post.postId] === 'like'}
                  style={{
                    backgroundColor: '#4F46E5',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#ffffff',
                    cursor: voteStatus[post.postId] === 'like'
                      ? 'not-allowed'
                      : 'pointer',
                    opacity: voteStatus[post.postId] === 'like' ? 0.6 : 1,
                  }}
                >
                  <AiOutlineLike size={18} style={{ marginRight: 6 }} />
                  {post.likes}
                </button>
              </div>

              {/* existing replies, showing author and text */}
              {post.replies.length > 0 && (
                <div className="replies">
                  {post.replies.map((reply, i) => {
                    const [author, ...rest] = reply.split(': ');
                    const replyBody = rest.join(': ');
                    return (
                      <div key={i}>
                        <strong>{author}:</strong> {replyBody}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* reply textarea always visible */}
              <div style={{ marginTop: '1rem' }}>
                <textarea
                  className="post-editor"
                  placeholder="Write a reply..."
                  value={replyText[post.postId] || ''}
                  onChange={e =>
                    setReplyText(r => ({
                      ...r,
                      [post.postId]: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={() => handleReply(post.postId, post.timestamp)}
                  style={{
                    marginTop: '0.5rem',
                    backgroundColor: '#4F46E5',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  Send Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
