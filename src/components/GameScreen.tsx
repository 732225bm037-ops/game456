import { useState, useEffect, useRef } from 'react';
import { Send, Heart, Shield } from 'lucide-react';
import { supabase, GameTurn, ChatMessage, Player } from '../lib/supabase';
import { getRandomTruth, getRandomDare } from '../lib/questions';

interface GameScreenProps {
  roomId: string;
  roomCode: string;
  playerId: string;
  playerName: string;
  players: Player[];
}

export function GameScreen({ roomId, playerId, playerName, players }: GameScreenProps) {
  const [turns, setTurns] = useState<(GameTurn & { playerName: string })[]>([]);
  const [messages, setMessages] = useState<(ChatMessage & { playerName: string })[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChoosing, setIsChoosing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherPlayer = players.find((p) => p.id !== playerId);
  const lastTurn = turns[turns.length - 1];
  const isMyTurn = !lastTurn || lastTurn.player_id !== playerId;

  useEffect(() => {
    loadTurns();
    loadMessages();

    const turnsChannel = supabase
      .channel(`room-${roomId}-turns`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_turns',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          loadTurns();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel(`room-${roomId}-messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(turnsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (lastTurn) {
      setCurrentQuestion(lastTurn.question);
    }
  }, [lastTurn]);

  const loadTurns = async () => {
    const { data } = await supabase
      .from('game_turns')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (data) {
      const turnsWithNames = data.map((turn) => {
        const player = players.find((p) => p.id === turn.player_id);
        return {
          ...turn,
          playerName: player?.name || 'Unknown',
        };
      });
      setTurns(turnsWithNames);
    }
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (data) {
      const messagesWithNames = data.map((msg) => {
        const player = players.find((p) => p.id === msg.player_id);
        return {
          ...msg,
          playerName: player?.name || 'Unknown',
        };
      });
      setMessages(messagesWithNames);
    }
  };

  const handleChoice = async (type: 'truth' | 'dare') => {
    setIsChoosing(true);
    const question = type === 'truth' ? getRandomTruth() : getRandomDare();
    setCurrentQuestion(question);

    await supabase.from('game_turns').insert({
      room_id: roomId,
      player_id: playerId,
      choice_type: type,
      question,
    });

    setIsChoosing(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await supabase.from('chat_messages').insert({
      room_id: roomId,
      player_id: playerId,
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 flex flex-col">
      <div className="bg-white/95 backdrop-blur shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Truth or Dare</h1>
              <p className="text-sm text-gray-600">
                {playerName} vs {otherPlayer?.name || 'Waiting...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${isMyTurn ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-gray-700 font-medium">{isMyTurn ? 'Your Turn' : `${otherPlayer?.name}'s Turn`}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Board</h2>

            {currentQuestion ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mb-6">
                    {lastTurn?.choice_type === 'truth' ? (
                      <Shield className="w-8 h-8 text-white" />
                    ) : (
                      <Heart className="w-8 h-8 text-white fill-white" />
                    )}
                  </div>
                  <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full font-bold text-lg mb-6">
                    {lastTurn?.choice_type === 'truth' ? 'TRUTH' : 'DARE'}
                  </div>
                  <p className="text-2xl font-semibold text-gray-800 leading-relaxed">{currentQuestion}</p>
                  <p className="text-sm text-gray-500 mt-6">Asked to: {lastTurn?.playerName}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Make your first choice to start the game</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleChoice('truth')}
                  disabled={!isMyTurn || isChoosing}
                  className="flex-1 max-w-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg disabled:transform-none flex items-center justify-center gap-2"
                >
                  <Shield className="w-6 h-6" />
                  <span>Truth</span>
                </button>
                <button
                  onClick={() => handleChoice('dare')}
                  disabled={!isMyTurn || isChoosing}
                  className="flex-1 max-w-xs bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-rose-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg disabled:transform-none flex items-center justify-center gap-2"
                >
                  <Heart className="w-6 h-6 fill-white" />
                  <span>Dare</span>
                </button>
              </div>
              {!isMyTurn && (
                <p className="text-center text-sm text-gray-500 mt-4">Waiting for {otherPlayer?.name} to choose...</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 h-[calc(100vh-200px)] lg:h-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 flex-1 flex flex-col min-h-0">
            <h3 className="text-xl font-bold text-gray-800 mb-4">History</h3>
            <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
              {turns.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No history yet</p>
              ) : (
                turns.map((turn) => (
                  <div key={turn.id} className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-1 rounded-full uppercase">
                        {turn.choice_type}
                      </span>
                      <span className="text-xs text-gray-600">{turn.playerName}</span>
                    </div>
                    <p className="text-sm text-gray-700">{turn.question}</p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col max-h-96">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Chat</h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.player_id === playerId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.player_id === playerId
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-xs opacity-75 mb-1">{msg.playerName}</p>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                maxLength={200}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-3 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
