/*
  # Truth or Dare Connect Game Schema

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key) - Unique room identifier
      - `room_code` (text, unique) - 6-character shareable room code
      - `status` (text) - Room status: 'waiting', 'playing', 'ended'
      - `created_at` (timestamptz) - Room creation timestamp
      - `expires_at` (timestamptz) - Room expiration (24 hours)
    
    - `players`
      - `id` (uuid, primary key) - Player identifier
      - `room_id` (uuid, foreign key) - Reference to room
      - `name` (text) - Player display name
      - `player_number` (int) - 1 or 2
      - `is_active` (boolean) - Whether player is currently connected
      - `joined_at` (timestamptz) - When player joined
    
    - `game_turns`
      - `id` (uuid, primary key) - Turn identifier
      - `room_id` (uuid, foreign key) - Reference to room
      - `player_id` (uuid, foreign key) - Player who chose
      - `choice_type` (text) - 'truth' or 'dare'
      - `question` (text) - The question/dare shown
      - `created_at` (timestamptz) - When turn was created
    
    - `chat_messages`
      - `id` (uuid, primary key) - Message identifier
      - `room_id` (uuid, foreign key) - Reference to room
      - `player_id` (uuid, foreign key) - Player who sent message
      - `message` (text) - Chat message content
      - `created_at` (timestamptz) - Message timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for players to access their room data
    - Add policies for real-time subscriptions

  3. Indexes
    - Index on room_code for fast lookups
    - Index on room_id for related queries
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text UNIQUE NOT NULL,
  status text DEFAULT 'waiting' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '24 hours') NOT NULL
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  player_number int NOT NULL CHECK (player_number IN (1, 2)),
  is_active boolean DEFAULT true NOT NULL,
  joined_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(room_id, player_number)
);

-- Create game_turns table
CREATE TABLE IF NOT EXISTS game_turns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  choice_type text NOT NULL CHECK (choice_type IN ('truth', 'dare')),
  question text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_players_room_id ON players(room_id);
CREATE INDEX IF NOT EXISTS idx_game_turns_room_id ON game_turns(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_turns ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms
CREATE POLICY "Anyone can create rooms"
  ON rooms FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view rooms"
  ON rooms FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update rooms"
  ON rooms FOR UPDATE
  TO anon
  USING (true);

-- RLS Policies for players
CREATE POLICY "Anyone can create players"
  ON players FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view players"
  ON players FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update players"
  ON players FOR UPDATE
  TO anon
  USING (true);

-- RLS Policies for game_turns
CREATE POLICY "Anyone can create game turns"
  ON game_turns FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view game turns"
  ON game_turns FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for chat_messages
CREATE POLICY "Anyone can create chat messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT
  TO anon
  USING (true);