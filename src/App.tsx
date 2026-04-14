/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Instagram, Grid, Heart, MessageCircle, Bookmark, User, Search, PlusSquare, Compass, MoreHorizontal, Music } from 'lucide-react';
import { fetchMediaFiles, GitHubFile } from './services/githubService';

const CORRECT_PIN = '20041996';

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  useEffect(() => {
    if (!isLocked) {
      loadPosts();
    }
  }, [isLocked]);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchMediaFiles();
    setPosts(data);
    setLoading(false);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPin(value);
    setError(false);

    if (value.length === 8) {
      if (value === CORRECT_PIN) {
        setIsLocked(false);
      } else {
        setError(true);
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  const [selectedPost, setSelectedPost] = useState<GitHubFile | null>(null);

  const PROFILE_PICTURE = "https://scontent-cgk2-2.cdninstagram.com/v/t51.82787-15/669942182_17995935326937622_1275504927212784213_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzg3NDk2MjMxNzczMzYzMTA0Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjgxMHgxMDgwLnNkci5DMyJ9&_nc_ohc=c4eIjF5iMkYQ7kNvwE6l4jZ&_nc_oc=AdrM-6D7P_MDGBCfyt9q6kXplcH-JPB5V6MUaWrmsg0j609KnLklLnMF0MBCqJesins&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cgk2-2.cdninstagram.com&_nc_gid=pk9B0YDH0iIr2NB-S9Xt2w&_nc_ss=7a32e&oh=00_Af2CUXb78zAIuL_hk_PR57lEET0jVetvS0shFOjkLsDszg&oe=69E3F58F";

  const getMediaType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'm4a', 'aac'].includes(ext || '')) return 'audio';
    return 'image';
  };

  const cleanCaption = (filename: string) => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  const handleLogout = () => {
    setIsLocked(true);
    setPin('');
    setShowLogoutMenu(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans" onClick={() => setShowLogoutMenu(false)}>
      <AnimatePresence mode="wait">
        {isLocked ? (
          // ... lock screen code ...
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 p-6"
          >
            <div className="max-w-md w-full text-center space-y-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="flex justify-center"
              >
                <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
                  <Lock className="w-12 h-12 text-gray-400" />
                </div>
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-xl font-medium text-gray-800">Arsip Rahasia</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Hanya untuk hana. Masih ingat tanggal lahirku?
                </p>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••••••"
                  className={`w-full text-center text-2xl tracking-[1em] py-4 px-4 bg-white border-2 rounded-2xl outline-none transition-all ${
                    error ? 'border-red-400 animate-shake' : 'border-gray-200 focus:border-black'
                  }`}
                  maxLength={8}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 font-medium"
                  >
                    PIN salah, coba lagi ya...
                  </motion.p>
                )}
              </div>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                8 Digit PIN
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="profile-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto pb-20 sm:pb-0"
          >
            {/* Desktop Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 hidden sm:block">
              <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="w-6 h-6" />
                  <span className="font-semibold text-xl tracking-tight">Instagram</span>
                </div>
                <div className="flex-1 max-w-xs mx-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full bg-gray-100 rounded-lg py-1.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <PlusSquare className="w-6 h-6 cursor-pointer" />
                  <Compass className="w-6 h-6 cursor-pointer" />
                  <Heart className="w-6 h-6 cursor-pointer" />
                  <div className="relative">
                    <div 
                      className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLogoutMenu(!showLogoutMenu);
                      }}
                    >
                      <img src={PROFILE_PICTURE} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    
                    <AnimatePresence>
                      {showLogoutMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                        >
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-medium transition-colors"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Header */}
            <header className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg">skizoo</span>
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
              </div>
              <div className="flex items-center gap-4">
                <PlusSquare className="w-6 h-6" />
                <MoreHorizontal className="w-6 h-6" />
              </div>
            </header>

                <div className="px-4 py-6 sm:py-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-20">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
                    <img 
                      src={PROFILE_PICTURE} 
                      alt="skizoo" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 sm:space-y-6 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h2 className="text-xl font-light sm:text-2xl">skizoo</h2>
                </div>

                <div className="flex justify-center sm:justify-start gap-8 sm:gap-10">
                  <div className="flex flex-col sm:flex-row items-center gap-1">
                    <span className="font-semibold">{posts.length}</span>
                    <span className="text-gray-500 text-sm sm:text-base">posts</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-1">
                    <span className="font-semibold">0</span>
                    <span className="text-gray-500 text-sm sm:text-base">followers</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-1">
                    <span className="font-semibold">1</span>
                    <span className="text-gray-500 text-sm sm:text-base">following</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-sm sm:text-base">Pandu ❤ Hana</p>
                  <p className="text-sm sm:text-base text-gray-600">Diary depresi skizoo</p>
                  <p className="text-sm sm:text-base text-gray-600">Apa-apa aku curhatkan disini</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200">
              <div className="flex justify-center gap-12 sm:gap-16">
                <button className="flex items-center gap-2 py-3 border-t border-black -mt-[1px] text-xs font-semibold uppercase tracking-widest">
                  <Grid className="w-3 h-3" />
                  Posts
                </button>
                <button className="flex items-center gap-2 py-3 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                  <Compass className="w-3 h-3" />
                  Reels
                </button>
                <button className="flex items-center gap-2 py-3 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                  <Bookmark className="w-3 h-3" />
                  Saved
                </button>
                <button className="flex items-center gap-2 py-3 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                  <User className="w-3 h-3" />
                  Tagged
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-3 gap-1 sm:gap-8 px-0 sm:px-4 pb-10">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-sm sm:rounded-lg"></div>
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <motion.div
                    key={post.sha}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPost(post)}
                    className="relative aspect-square group cursor-pointer overflow-hidden sm:rounded-lg bg-gray-50"
                  >
                    {getMediaType(post.name) === 'video' ? (
                      <video
                        src={post.download_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : getMediaType(post.name) === 'audio' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Music className="w-12 h-12 text-gray-300" />
                      </div>
                    ) : (
                      <img
                        src={post.download_url}
                        alt={post.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                      <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 fill-current" />
                        <span>1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 fill-current" />
                        <span>0</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 py-20 text-center space-y-4">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <Grid className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">No Posts Yet</p>
                </div>
              )}
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between z-50">
              <Instagram className="w-6 h-6" />
              <Search className="w-6 h-6" />
              <PlusSquare className="w-6 h-6" />
              <Heart className="w-6 h-6" />
              <div className="relative">
                <div 
                  className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLogoutMenu(!showLogoutMenu);
                  }}
                >
                  <img src={PROFILE_PICTURE} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                
                <AnimatePresence>
                  {showLogoutMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 bottom-full mb-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-5xl w-full max-h-[90vh] rounded-lg overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                {getMediaType(selectedPost.name) === 'video' ? (
                  <video
                    src={selectedPost.download_url}
                    className="max-w-full max-h-full"
                    controls
                    autoPlay
                  />
                ) : getMediaType(selectedPost.name) === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-10">
                    <Music className="w-24 h-24 text-gray-700 mb-6" />
                    <audio
                      src={selectedPost.download_url}
                      className="w-full"
                      controls
                      autoPlay
                    />
                  </div>
                ) : (
                  <img
                    src={selectedPost.download_url}
                    alt={selectedPost.name}
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="w-full sm:w-[400px] flex flex-col bg-white">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src={PROFILE_PICTURE} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-semibold text-sm">skizoo</span>
                  </div>
                  <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      <img src={PROFILE_PICTURE} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold mr-2">skizoo</span>
                      <span className="text-gray-800">{cleanCaption(selectedPost.name)}</span>
                      <div className="text-gray-400 text-xs mt-2 uppercase tracking-tight">1 DAY AGO</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600" />
                      <MessageCircle className="w-6 h-6 cursor-pointer hover:text-gray-600" />
                      <Compass className="w-6 h-6 cursor-pointer hover:text-gray-600" />
                    </div>
                    <Bookmark className="w-6 h-6 cursor-pointer hover:text-gray-600" />
                  </div>
                  <div className="font-semibold text-sm">1 like</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
