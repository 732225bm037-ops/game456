import { useState, useEffect } from 'react';
import { supabase, Room, Player } from './lib/supabase';
import { generateRoomCode } from './lib/roomUtils';
import { HomePage } from './components/HomePage';
import { WaitingRoom } from './components/WaitingRoom';
import { GameScreen } from './components/GameScreen';

type GameState = 'home' | 'waiting' | 'playing';

function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');
    if (roomCode) {
      checkRoomExists(roomCode);
    }
  }, []);

  useEffect(() => {
    if (!room) return;

    loadPlayers();

    const channel = supabase
      .channel(`room-${room.id}-players`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          loadPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  useEffect(() => {
    if (players.length === 2 && gameState === 'waiting') {
      setTimeout(() => {
        updateRoomStatus('playing');
        setGameState('playing');
      }, 1500);
    }
  }, [players, gameState]);

  const checkRoomExists = async (roomCode: string) => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (data && data.status === 'waiting') {
      setRoom(data);
    }
  };

  const loadPlayers = async () => {
    if (!room) return;

    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', room.id)
      .order('player_number', { ascending: true });

    if (data) {
      setPlayers(data);
    }
  };

  const updateRoomStatus = async (status: 'waiting' | 'playing' | 'ended') => {
    if (!room) return;
    await supabase.from('rooms').update({ status }).eq('id', room.id);
  };

  const handleCreateRoom = async (name: string) => {
    setPlayerName(name);
    setIsCreator(true);

    const roomCode = generateRoomCode();
    const { data: newRoom } = await supabase
      .from('rooms')
      .insert({ room_code: roomCode })
      .select()
      .single();

    if (newRoom) {
      setRoom(newRoom);

      const { data: newPlayer } = await supabase
        .from('players')
        .insert({
          room_id: newRoom.id,
          name,
          player_number: 1,
        })
        .select()
        .single();

      if (newPlayer) {
        setPlayerId(newPlayer.id);
        setGameState('waiting');
        window.history.pushState({}, '', `?room=${roomCode}`);
      }
    }
  };

  const handleJoinRoom = async (name: string, roomCode: string) => {
    setPlayerName(name);
    setIsCreator(false);

    const { data: existingRoom } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode)
      .maybeSingle();

    if (!existingRoom) {
      alert('Room not found! Please check the code and try again.');
      return;
    }

    if (existingRoom.status !== 'waiting') {
      alert('This room is no longer available.');
      return;
    }

    const { data: existingPlayers } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', existingRoom.id);

    if (existingPlayers && existingPlayers.length >= 2) {
      alert('Room is full!');
      return;
    }

    setRoom(existingRoom);

    const { data: newPlayer } = await supabase
      .from('players')
      .insert({
        room_id: existingRoom.id,
        name,
        player_number: 2,
      })
      .select()
      .single();

    if (newPlayer) {
      setPlayerId(newPlayer.id);
      setGameState('waiting');
      window.history.pushState({}, '', `?room=${roomCode}`);
    }
  };

  if (gameState === 'home') {
    return <HomePage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
  }

  if (gameState === 'waiting' && room) {
    return (
      <WaitingRoom
        roomCode={room.room_code}
        playerName={playerName}
        isCreator={isCreator}
        otherPlayerJoined={players.length === 2}
      />
    );
  }

  if (gameState === 'playing' && room && playerId) {
    return (
      <GameScreen
        roomId={room.id}
        roomCode={room.room_code}
        playerId={playerId}
        playerName={playerName}
        players={players}
      />
    );
  }

  return null;
}

export default App;
