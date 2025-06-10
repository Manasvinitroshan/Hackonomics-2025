// frontend/src/pages/Forum.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/login.css';
import { getCurrentUsername } from '../utils/cognito';

interface Post {
  postId: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: string[];
}

type Vote = 'like' | 'dislike';

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [voteStatus, setVoteStatus] = useState<Record<string, Vote>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const currentUsername = getCurrentUsername() || 'Anonymous';

  // 1) Fetch posts on mount
  useEffect(() => {
    axios
      .get<Post[]>('http://localhost:3001/api/posts')
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  // 2) Create new post
  const handlePost = () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);

    axios
      .post<Post>('http://localhost:3001/api/posts', {
        author: currentUsername,
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

  // 3) Unified vote handler (calls backend with user + timestamp)
  const handleVote = async (
    postId: string,
    timestamp: string,
    vote: Vote
  ) => {
    // prevent double‐voting
    if (voteStatus[postId] === vote) return;

    try {
      const res = await axios.patch<Post>(
        `http://localhost:3001/api/posts/${postId}/${vote}`,
        { timestamp, user: currentUsername }
      );
      // update post with backend’s counts
      setPosts(prev =>
        prev.map(p => (p.postId === postId ? res.data! : p))
      );
      // record that we’ve now voted
      setVoteStatus(vs => ({ ...vs, [postId]: vote }));
    } catch (err) {
      console.error(`Failed to ${vote}`, err);
    }
  };

  // 4) Reply handler (unchanged)
  const handleReply = async (postId: string, timestamp: string) => {
    const text = replyText[postId]?.trim();
    if (!text) return;

    try {
      const res = await axios.patch<Post>(
        `http://localhost:3001/api/posts/${postId}/reply`,
        { timestamp, reply: text }
      );
      setPosts(prev =>
        prev.map(p => (p.postId === postId ? res.data! : p))
      );
      setReplyText(r => ({ ...r, [postId]: '' }));
      const editor = document.getElementById(`reply-editor-${postId}`);
      if (editor) (editor as HTMLElement).innerText = '';
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

              <div className="actions">
                <button
                  disabled={voteStatus[post.postId] === 'like'}
                  onClick={() =>
                    handleVote(post.postId, post.timestamp, 'like')
                  }
                  style={{ color: '#ffffff' }}
                >
                  👍 {post.likes}
                </button>
                <button
                  disabled={voteStatus[post.postId] === 'dislike'}
                  onClick={() =>
                    handleVote(post.postId, post.timestamp, 'dislike')
                  }
                  style={{ color: '#ffffff' }}
                >
                  👎 {post.dislikes}
                </button>
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

              <div style={{ marginTop: '1rem' }}>
                <div
                  id={`reply-editor-${post.postId}`}
                  contentEditable
                  className="post-editor"
                  data-placeholder="Write a reply..."
                  suppressContentEditableWarning
                  onInput={e =>
                    setReplyText(r => ({
                      ...r,
                      [post.postId]: (e.currentTarget as HTMLElement).innerText,
                    }))
                  }
                />
                <button
                  onClick={() => handleReply(post.postId, post.timestamp)}
                  style={{ color: '#ffffff' }}
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
