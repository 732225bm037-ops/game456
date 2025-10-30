import { useState } from 'react';
import { Heart } from 'lucide-react';

interface HomePageProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (playerName: string, roomCode: string) => void;
}

export function HomePage({ onCreateRoom, onJoinRoom }: HomePageProps) {
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateRoom(playerName.trim());
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && roomCode.trim()) {
      onJoinRoom(playerName.trim(), roomCode.trim().toUpperCase());
    }
  };

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mb-4 animate-pulse">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Room</h2>
              <p className="text-gray-600">Enter your name to start</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-all"
                  maxLength={20}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Create Room
              </button>

              <button
                type="button"
                onClick={() => setMode('home')}
                className="w-full text-gray-600 font-medium py-3 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mb-4 animate-pulse">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Room</h2>
              <p className="text-gray-600">Enter room code and your name</p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-6 py-4 text-lg font-mono tracking-wider border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-all uppercase"
                  maxLength={6}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-all"
                  maxLength={20}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Join Room
              </button>

              <button
                type="button"
                onClick={() => setMode('home')}
                className="w-full text-gray-600 font-medium py-3 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white/20 fill-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mb-6 animate-bounce">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Truth or Dare</h1>
            <p className="text-lg text-gray-600">Connect and Play</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-5 px-6 rounded-2xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg text-lg"
            >
              Create Room
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full bg-white border-2 border-pink-500 text-pink-600 font-bold py-5 px-6 rounded-2xl hover:bg-pink-50 transform hover:scale-105 transition-all text-lg"
            >
              Join Room
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            Play with a friend in real-time
          </div>
        </div>
      </div>
    </div>
  );
}
