'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, set, update, get } from 'firebase/database';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

export interface Message {
  id: string;
  sender: 'me' | 'other';
  senderId?: string;
  senderName?: string;
  text: string;
  originalText?: string;
  status: 'filtering' | 'filtered' | 'failed' | 'sent' | 'received';
  timestamp: number;
  profile: 'couple' | 'family' | 'corporate';
  toxicityLevel?: number;
  originalTone?: string;
  savedMetric?: string;
}

export interface Room {
  id: string;
  name: string;
  avatar: string;
  profile: 'couple' | 'family' | 'corporate';
  statusText: string;
  phone: string;
  messages: Message[];
  unreadCount?: number;
  isGroup?: boolean;
  isPinned?: boolean;
}

// Empty baseline for fully dynamic real-time data
const SEED_DATA: Record<string, Room> = {};

export function useChatSync() {
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Record<string, any>>({});
  
  const [metrics, setMetrics] = useState({
    avoidedFights: 0,
    avgToxicity: 0,
    modifiedCount: 0,
  });

  // Track Firebase Auth state
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Check if Firebase is properly configured
  useEffect(() => {
    const hasConfig = !!(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    if (hasConfig && db) {
      setIsFirebaseConnected(true);
      
      const rootRef = ref(db, 'mellow_chats_v2');
      get(rootRef).then((snapshot) => {
        if (!snapshot.exists()) {
          set(rootRef, SEED_DATA);
        }
      });
    } else {
      const local = localStorage.getItem('mellow_rooms_v2');
      if (local) {
        setRooms(JSON.parse(local));
      } else {
        localStorage.setItem('mellow_rooms_v2', JSON.stringify(SEED_DATA));
        setRooms(SEED_DATA);
      }
    }
  }, []);

  // Auto-select first room when rooms list loads and none is active
  useEffect(() => {
    const roomKeys = Object.keys(rooms);
    if (roomKeys.length > 0 && !activeRoomId) {
      setActiveRoomId(roomKeys[0]);
    }
  }, [rooms, activeRoomId]);

  // Sync active room messages from Firebase or local state
  useEffect(() => {
    if (!activeRoomId) {
      setMessages([]);
      return;
    }

    if (isFirebaseConnected && db) {
      const roomRef = ref(db, `mellow_chats_v2/${activeRoomId}/messages`);
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const list = Object.values(val) as Message[];
          list.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(list);
        } else {
          setMessages([]);
        }
      });
      return () => unsubscribe();
    } else {
      const activeRoom = rooms[activeRoomId];
      if (activeRoom) {
        setMessages(activeRoom.messages ? Object.values(activeRoom.messages) : []);
      }
    }
  }, [activeRoomId, rooms, isFirebaseConnected]);

  // Sync structural changes of rooms from Firebase
  useEffect(() => {
    if (isFirebaseConnected && db) {
      const rootRef = ref(db, 'mellow_chats_v2');
      const unsubscribe = onValue(rootRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          // Normalize messages format if it's stored as map
          const normalizedRooms = { ...val };
          Object.keys(normalizedRooms).forEach(key => {
            if (normalizedRooms[key].messages && !Array.isArray(normalizedRooms[key].messages)) {
              normalizedRooms[key].messages = Object.values(normalizedRooms[key].messages);
            }
          });
          setRooms(normalizedRooms);
        } else {
          setRooms({});
        }
      });
      return () => unsubscribe();
    }
  }, [isFirebaseConnected]);

  // Sync users list from Firebase
  useEffect(() => {
    if (isFirebaseConnected && db) {
      const usersRef = ref(db, 'mellow_users');
      const unsubscribe = onValue(usersRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setUsers(val);
        } else {
          setUsers({});
        }
      });
      return () => unsubscribe();
    }
  }, [isFirebaseConnected]);

  // Create user profile in mellow_users on login
  useEffect(() => {
    if (isFirebaseConnected && db && currentUser) {
      const phoneClean = currentUser.phoneNumber || '+5491155559999';
      get(ref(db, 'mellow_users')).then((snapshot) => {
        const usersVal = snapshot.val();
        let exists = false;
        if (usersVal) {
          exists = Object.values(usersVal).some((u: any) => u.phone === phoneClean);
        }
        if (!exists) {
          const newKey = `user_${Date.now()}`;
          set(ref(db, `mellow_users/${newKey}`), {
            phone: phoneClean,
            name: `Ciudadano ${phoneClean.slice(-4)}`,
            role: 'Ciudadano',
            status: 'Activo',
            empathyScore: 1.0,
            interceptedCount: 0
          });
        }
      });
    }
  }, [currentUser, isFirebaseConnected]);

  // Aggregate metrics
  useEffect(() => {
    let totalToxicity = 0;
    let filteredCount = 0;
    let originalCount = 0;

    Object.values(rooms).forEach((room) => {
      if (room.messages) {
        const msgList = (Array.isArray(room.messages) ? room.messages : Object.values(room.messages)) as Message[];
        msgList.forEach((msg) => {
          if (msg.status === 'filtered') {
            filteredCount++;
            if (msg.toxicityLevel) {
              totalToxicity += msg.toxicityLevel;
              originalCount++;
            }
          }
        });
      }
    });

    const calculatedAvgToxicity = originalCount > 0 ? totalToxicity / originalCount : 0;
    const calculatedAvoided = filteredCount;

    setMetrics({
      avoidedFights: calculatedAvoided,
      avgToxicity: parseFloat(calculatedAvgToxicity.toFixed(2)),
      modifiedCount: filteredCount,
    });
  }, [rooms, messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!activeRoomId || !textToSend.trim() || isSending) return;
    setIsSending(true);

    const targetProfile = rooms[activeRoomId].profile;
    const messageId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: messageId,
      sender: 'me',
      text: 'Mellow está puliendo tu tono...',
      originalText: textToSend,
      status: 'filtering',
      timestamp: Date.now(),
      profile: targetProfile
    };

    // Update UI and DB with filtering state immediately
    if (isFirebaseConnected && db) {
      await set(ref(db, `mellow_chats_v2/${activeRoomId}/messages/${messageId}`), newMsg);
    } else {
      const updatedRooms = { ...rooms };
      if (!updatedRooms[activeRoomId].messages) {
        updatedRooms[activeRoomId].messages = [];
      }
      updatedRooms[activeRoomId].messages.push(newMsg);
      setRooms(updatedRooms);
      localStorage.setItem('mellow_rooms_v2', JSON.stringify(updatedRooms));
    }

    // Call rewrite API
    try {
      const response = await fetch('/api/buffer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend, context: targetProfile })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      
      const updatedFields = {
        text: data.refactored_message,
        status: 'filtered' as const,
        toxicityLevel: data.toxicity_level,
        originalTone: data.original_tone,
        savedMetric: data.saved_metric
      };

      if (isFirebaseConnected && db) {
        await update(ref(db, `mellow_chats_v2/${activeRoomId}/messages/${messageId}`), updatedFields);
      } else {
        setRooms(prev => {
          const updated = { ...prev };
          updated[activeRoomId].messages = updated[activeRoomId].messages.map(m => 
            m.id === messageId ? { ...m, ...updatedFields } : m
          );
          localStorage.setItem('mellow_rooms_v2', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      const errorFields = {
        text: textToSend,
        status: 'failed' as const,
        originalTone: 'Error del sistema',
        toxicityLevel: 0.99,
        savedMetric: 'Fallo de red: El mensaje hostil fue expuesto sin pulir.'
      };

      if (isFirebaseConnected && db) {
        await update(ref(db, `mellow_chats_v2/${activeRoomId}/messages/${messageId}`), errorFields);
      } else {
        setRooms(prev => {
          const updated = { ...prev };
          updated[activeRoomId].messages = updated[activeRoomId].messages.map(m => 
            m.id === messageId ? { ...m, ...errorFields } : m
          );
          localStorage.setItem('mellow_rooms_v2', JSON.stringify(updated));
          return updated;
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const sendProcessedMessage = async (
    text: string, 
    originalText?: string, 
    status: 'filtered' | 'failed' = 'filtered',
    metadata?: { toxicityLevel?: number; originalTone?: string; savedMetric?: string }
  ) => {
    if (!activeRoomId) return;
    const targetProfile = rooms[activeRoomId].profile;
    const messageId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: messageId,
      sender: 'me',
      text,
      originalText,
      status,
      timestamp: Date.now(),
      profile: targetProfile,
      ...metadata
    };

    if (isFirebaseConnected && db) {
      await set(ref(db, `mellow_chats_v2/${activeRoomId}/messages/${messageId}`), newMsg);
      
      // Update empathy metrics dynamically in mellow_users node
      if (currentUser) {
        const cleanPhone = currentUser.phoneNumber || '+5491155559999';
        get(ref(db, 'mellow_users')).then((snapshot) => {
          const usersVal = snapshot.val();
          if (usersVal) {
            const userKey = Object.keys(usersVal).find(k => usersVal[k].phone.replace(/[\s\-\(\)]/g, '') === cleanPhone);
            if (userKey) {
              const user = usersVal[userKey];
              const newCount = (user.interceptedCount || 0) + 1;
              const msgToxicity = metadata?.toxicityLevel || 0;
              const newEmpathy = Math.max(0.1, Math.min(1.0, user.empathyScore - (msgToxicity * 0.04) + 0.01));
              
              update(ref(db, `mellow_users/${userKey}`), {
                interceptedCount: newCount,
                empathyScore: parseFloat(newEmpathy.toFixed(2))
              });
            }
          }
        });
      }
    } else {
      const updatedRooms = { ...rooms };
      if (!updatedRooms[activeRoomId].messages) {
        updatedRooms[activeRoomId].messages = [];
      }
      updatedRooms[activeRoomId].messages.push(newMsg);
      setRooms(updatedRooms);
      localStorage.setItem('mellow_rooms_v2', JSON.stringify(updatedRooms));
    }
  };

  const createRoom = async (name: string, phone: string, profile: 'couple' | 'family' | 'corporate') => {
    const roomId = `room-${Date.now()}`;
    // Fetch a nice diverse set of contact avatars dynamically
    const avatarSeed = Math.floor(Math.random() * 70);
    const newRoom: Room = {
      id: roomId,
      name,
      avatar: `https://i.pravatar.cc/150?img=${avatarSeed}`,
      profile,
      statusText: 'Disponible',
      phone,
      messages: []
    };

    if (isFirebaseConnected && db) {
      await set(ref(db, `mellow_chats_v2/${roomId}`), newRoom);
    } else {
      const updated = { ...rooms, [roomId]: newRoom };
      setRooms(updated);
      localStorage.setItem('mellow_rooms_v2', JSON.stringify(updated));
    }
    setActiveRoomId(roomId);
  };

  const changeRoomProfile = async (roomId: string, newProfile: 'couple' | 'family' | 'corporate') => {
    if (isFirebaseConnected && db) {
      await update(ref(db, `mellow_chats_v2/${roomId}`), { profile: newProfile });
    } else {
      setRooms(prev => {
        const updated = { ...prev };
        updated[roomId].profile = newProfile;
        localStorage.setItem('mellow_rooms_v2', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return {
    activeRoomId,
    setActiveRoomId,
    rooms,
    messages,
    isFirebaseConnected,
    isSending,
    metrics,
    currentUser,
    authLoading,
    users,
    sendMessage: handleSendMessage,
    sendProcessedMessage,
    createRoom,
    changeRoomProfile,
    logout
  };
}
