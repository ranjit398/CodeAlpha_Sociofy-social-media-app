import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../features/post/postSlice';
import { prependPost } from '../../features/feed/feedSlice';
import { upsertPost } from '../../features/post/postSlice';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const CreatePost = ({ onCreated }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef(null);
  const MAX = 1000;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!content.trim() && !image) || isLoading) return;
    setIsLoading(true);

    const fd = new FormData();
    if (content.trim()) fd.append('content', content.trim());
    if (image) fd.append('image', image);

    const result = await dispatch(createPost(fd));
    if (!result.error) {
      const newPost = result.payload;
      dispatch(upsertPost(newPost));
      dispatch(prependPost(newPost.id));
      setContent('');
      removeMedia();
      setExpanded(false);
      onCreated?.();
    }
    setIsLoading(false);
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <Avatar src={user?.avatarUrl} name={user?.displayName} size="md" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="What's on your mind?"
          rows={expanded ? 4 : 1}
          maxLength={MAX}
          className="create-post-input"
        />
      </div>

      {preview && (
        <div className="relative mt-3 rounded-xl overflow-hidden bg-surface-2 inline-block mb-4">
          {image?.type?.startsWith('video/') ? (
            <video src={preview} controls className="max-h-80 w-full object-contain rounded-xl" />
          ) : (
            <img src={preview} alt="preview" className="max-h-80 w-full object-contain rounded-xl" />
          )}
          <button
            onClick={removeMedia}
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="create-post-actions">
        <div className="create-post-icons">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="icon-btn flex items-center gap-2 px-3 w-auto"
            title="Add Image"
          >
            <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="text-xs font-medium">Image</span>
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="icon-btn flex items-center gap-2 px-3 w-auto"
            title="Add Video"
          >
            <svg className="w-5 h-5 text-accent-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span className="text-xs font-medium">Video</span>
          </button>

          <input 
            ref={fileRef} 
            type="file" 
            accept="image/*,video/mp4,video/webm,video/quicktime" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>

        <div className="flex items-center gap-3">
          {expanded && (
            <span className={`text-xs font-mono ${content.length > MAX * 0.9 ? 'text-red-400' : 'text-zinc-500'}`}>
              {content.length}/{MAX}
            </span>
          )}
          {expanded && (
            <Button variant="ghost" size="sm" onClick={() => { setExpanded(false); setContent(''); removeMedia(); }}>
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={!content.trim() && !image}
            className="btn-post"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;