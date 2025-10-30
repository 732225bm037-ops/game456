import { useState } from 'react';
import { Copy, Check, Heart, Users } from 'lucide-react';
import { getRoomUrl, copyToClipboard } from '../lib/roomUtils';

interface WaitingRoomProps {
  roomCode: string;
  playerName: string;
  isCreator: boolean;
  otherPlayerJoined: boolean;
}

export function WaitingRoom({ roomCode, playerName, isCreator, otherPlayerJoined }: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = getRoomUrl(roomCode);
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = async () => {
    await copyToClipboard(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white/20 fill-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mb-4">
              {otherPlayerJoined ? (
                <Users className="w-10 h-10 text-white" />
              ) : (
                <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {otherPlayerJoined ? 'Both Players Ready!' : 'Waiting for Player...'}
            </h2>
            <p className="text-gray-600">Welcome, {playerName}</p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">Room Code</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-4xl font-bold font-mono tracking-wider text-pink-600">
                  {roomCode}
                </p>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {isCreator && !otherPlayerJoined && (
              <button
                onClick={handleCopyLink}
                className="w-full bg-white border-2 border-pink-300 text-pink-600 font-semibold py-3 px-4 rounded-xl hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Share Room Link</span>
                  </>
                )}
              </button>
            )}
          </div>

          {otherPlayerJoined ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-semibold animate-bounce">
                <Check className="w-5 h-5" />
                <span>Starting game...</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="text-gray-500">
                {isCreator
                  ? 'Share the room code with your friend to start playing'
                  : 'Waiting for the room creator to start the game'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
