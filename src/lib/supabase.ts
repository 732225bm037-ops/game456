import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Room {
  id: string;
  room_code: string;
  status: 'waiting' | 'playing' | 'ended';
  created_at: string;
  expires_at: string;
}

export interface Player {
  id: string;
  room_id: string;
  name: string;
  player_number: 1 | 2;
  is_active: boolean;
  joined_at: string;
}

export interface GameTurn {
  id: string;
  room_id: string;
  player_id: string;
  choice_type: 'truth' | 'dare';
  question: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  player_id: string;
  message: string;
  created_at: string;
}
