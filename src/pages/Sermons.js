import React, { useState, useEffect, useRef } from 'react';
import About from '../components/About';
import API from '../api';
import '../sermons.css';
import Hls from 'hls.js';
import YouTube from 'react-youtube'; // for YouTube player
import { FaHeart, FaShare, FaGift } from 'react-icons/fa';

// ----------------- VideoPlayer Component -----------------
const VideoPlayer = ({ src, hlsUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (hlsUrl && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    }
  }, [hlsUrl]);

  return (
    <video
      ref={videoRef}
      src={hlsUrl ? undefined : src}
      controls
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 8,
        objectFit: 'contain',
        background: 'black',
      }}
    />
  );
};

// ----------------- Sermons Component -----------------
const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef(null);
  const playlistVideoRefs = useRef({});

  // Fetch sermons
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await API.get('/api/sermons');
        setSermons(res.data.sermons || []);
        if (res.data.sermons.length > 0) setSelectedSermon(res.data.sermons[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSermons();
  }, []);

  // Comments WebSocket
  useEffect(() => {
    if (!selectedSermon) return;

    const fetchComments = async () => {
      try {
        const res = await API.get(`/api/sermons/${selectedSermon.id}/comments`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };

    fetchComments();

    const ws = new WebSocket(`ws://localhost:7000/ws/comments?sermonId=${selectedSermon.id}`);
    ws.onopen = () => {
      console.log('Comments WebSocket connected');
      socketRef.current = ws;
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        setComments(prev => [...prev, data.comment || data]);
        const commentBox = document.getElementById('comment-box');
        if (commentBox) commentBox.scrollTop = commentBox.scrollHeight;
      } catch (err) {
        console.error('Failed to parse comment', err);
      }
    };

    ws.onclose = () => {
      console.log('Comments WebSocket closed');
      if (socketRef.current === ws) socketRef.current = null;
    };

    return () => ws.close();
  }, [selectedSermon]);

  // ----------------- sendComment -----------------
  const sendComment = () => {
    if (!newComment.trim()) return;

    const ws = socketRef.current;

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'NEW_COMMENT',
        content: newComment,
        user_name: 'Anonymous'
      }));
      setNewComment('');
    } else {
      const retry = setInterval(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({
            type: 'NEW_COMMENT',
            content: newComment,
            user_name: 'Anonymous'
          }));
          setNewComment('');
          clearInterval(retry);
        }
      }, 200);
    }
  };

  const likeSermon = async () => {
    if (!selectedSermon) return;
    try {
      const res = await API.post(`/api/sermons/${selectedSermon.id}/like`);
      setSelectedSermon({ ...selectedSermon, likes: res.data.likes });
      setSermons(prev =>
        prev.map(s => s.id === selectedSermon.id ? { ...s, likes: res.data.likes } : s)
      );
    } catch {
      alert('Failed to like');
    }
  };

  const donate = async () => {
    if (!selectedSermon) return;
    const amount = prompt('Enter donation amount');
    if (!amount) return;
    try {
      await API.post(`/api/sermons/${selectedSermon.id}/donate`, { amount });
      alert('Thanks!');
    } catch {
      alert('Donation failed');
    }
  };

  const shareSermon = () => {
    if (!selectedSermon) return;
    navigator.clipboard.writeText(
      selectedSermon.media_url || getYouTubeLiveUrl(selectedSermon)
    );
    alert('Link copied!');
  };

  // Helper: Get YouTube Live URL
  const getYouTubeLiveUrl = (sermon) => {
    if (!sermon?.social_streams) return null;
    let streams = [];
    try {
      streams =
        typeof sermon.social_streams === 'string'
          ? JSON.parse(sermon.social_streams)
          : sermon.social_streams;
    } catch (err) {
      console.error('Error parsing social_streams', err);
    }
    return streams.find(url => url.includes('youtube.com') || url.includes('youtu.be')) || null;
  };

  const joinYouTubeLive = () => {
    const liveUrl = getYouTubeLiveUrl(selectedSermon);
    if (!liveUrl) {
      alert('Live stream is not available now');
      return;
    }
    window.open(liveUrl, '_blank');
  };

  // ----------------- renderVideo -----------------
  const renderVideo = (sermon) => {
    const { media_url, cameras, tiktokUsername, social_streams } = sermon;

    // --- TikTok Live ---
    if (tiktokUsername) {
      const embedUrl = `https://www.tiktok.com/embed/live/@${tiktokUsername}`;
      return (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 'none', borderRadius: 8 }}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }

    // --- YouTube ---
    let streams = [];
    try {
      streams =
        typeof social_streams === 'string' ? JSON.parse(social_streams) : social_streams || [];
    } catch (err) {
      console.error('Error parsing social_streams', err);
    }
    const youtubeUrl = streams.find(url => url.includes('youtube.com') || url.includes('youtu.be'));
    if (youtubeUrl) {
      const match = youtubeUrl.match(/(?:v=|be\/|live\/)([\w-]+)/);
      if (match) {
        const videoId = match[1];
        return (
          <YouTube
            videoId={videoId}
            opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0 } }}
          />
        );
      }
    }

    // --- HLS or local ---
    const hlsUrl = cameras?.[0]?.hlsUrl || null;
    if (media_url || hlsUrl) return <VideoPlayer src={media_url} hlsUrl={hlsUrl} />;

    return <div style={{ color: '#fff', textAlign: 'center', padding: 20 }}>Video not available</div>;
  };

  // ----------------- getVideoThumbnail -----------------
  const getVideoThumbnail = (s) => {
    if (s.tiktokUsername) return '/images/tiktok-live-placeholder.jpg'; // add placeholder image in public folder
    const liveUrl = getYouTubeLiveUrl(s);
    const videoUrl = s.media_url || liveUrl;
    const match = videoUrl?.match(/(?:v=|be\/|live\/)([\w-]+)/);
    if (!match) return '';
    const videoId = match[1];
    return liveUrl
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault_live.jpg`
      : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Filtered sermons for playlist
  const filteredSermons = sermons.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <div className="youtube-style-container">
        {/* Main Video Section */}
        <div className="main-video-section">
          {selectedSermon && (
            <>
              <div className="video-wrapper">{renderVideo(selectedSermon)}</div>
              <h2 className="video-title">{selectedSermon.title}</h2>

              {/* Icon Actions */}
              <div className="video-actions">
                <div className="icon-action" onClick={likeSermon}>
                  <FaHeart /> {selectedSermon.likes || 0}
                </div>
                <div className="icon-action" onClick={donate}>
                  <FaGift />
                </div>
                <div className="icon-action" onClick={shareSermon}>
                  <FaShare />
                </div>
              </div>

              {/* Join Live Button */}
              {getYouTubeLiveUrl(selectedSermon) && (
                <button className="live-btn" onClick={joinYouTubeLive}>
                  🔴 Join Live
                </button>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {selectedSermon && (
            <>
              <div className="comments-section">
                <h4>Comments</h4>
                <div id="comment-box" className="comment-box">
                  {comments
                    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                    .map((c) => (
                      <div key={c.id} className={`yt-comment ${c.pinned ? 'pinned' : ''}`}>
                        <div className="yt-avatar">{c.user_name?.charAt(0).toUpperCase() || 'U'}</div>
                        <div className="yt-comment-body">
                          <span className="yt-username">{c.user_name || 'User'}</span>
                          <p className="yt-comment-text">{c.content}</p>
                          <div className="yt-actions">
                            <span onClick={() => console.log('Like', c.id)}>👍 {c.likes || 0}</span>
                            <span onClick={() => console.log('Reply to', c.id)}>Reply</span>
                            <span onClick={() => console.log('Pin', c.id)}>📌</span>
                          </div>

                          {c.replies?.map((r) => (
                            <div key={r.id} className="yt-reply">
                              <div className="yt-avatar small">{r.user_name?.charAt(0).toUpperCase() || 'U'}</div>
                              <div>
                                <span className="yt-username">{r.user_name}</span>
                                <p>{r.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
                <input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendComment()}
                />
                <button onClick={sendComment} className="send-comment-btn">
                  Send
                </button>
              </div>

              {/* Up Next Playlist */}
              <h3>Up Next</h3>
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="playlist-list">
                {filteredSermons.map((s) => {
                  const liveUrl = getYouTubeLiveUrl(s);
                  const isYouTube = !!liveUrl;
                  const isLocalVideo = !!s.media_url && !isYouTube && !s.tiktokUsername;
                  const isLive = !!liveUrl || !!s.tiktokUsername;

                  return (
                    <div
                      key={s.id}
                      className={`playlist-item ${s.id === selectedSermon?.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedSermon(s);
                        setComments([]);
                      }}
                      onMouseEnter={() => {
                        if (isLocalVideo) {
                          const video = playlistVideoRefs.current[s.id];
                          if (video) {
                            video.currentTime = 0;
                            video.muted = true;
                            video.play();
                          }
                        }
                      }}
                      onMouseLeave={() => {
                        if (isLocalVideo) {
                          const video = playlistVideoRefs.current[s.id];
                          if (video) video.pause();
                        }
                      }}
                    >
                      {isLocalVideo ? (
                        <video
                          ref={(el) => (playlistVideoRefs.current[s.id] = el)}
                          src={s.media_url}
                          className="playlist-thumbnail"
                          preload="metadata"
                          muted
                        />
                      ) : (
                        <>
                          <img
                            src={getVideoThumbnail(s)}
                            className="playlist-thumbnail"
                            alt={s.title}
                          />
                          {isLive && <span className="live-badge">LIVE</span>}
                        </>
                      )}
                      <p className="playlist-title">{s.title}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <About />
    </>
  );
};

export default Sermons;
