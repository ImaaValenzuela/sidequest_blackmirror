'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, set, update, get } from 'firebase/database';
import { db } from '../lib/firebase';

export interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  originalText?: string;
  status: 'filtering' | 'filtered' | 'failed';
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
}

const SEED_DATA: Record<string, Room> = {
  'room-1': {
    id: 'room-1',
    name: 'Mi Amor 💔',
    avatar: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=150&auto=format&fit=crop&q=80',
    profile: 'couple',
    statusText: 'en línea',
    phone: '+54 9 11 5555-4321',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1-1',
        sender: 'other',
        text: 'Hola mi amor, ¿sabes a qué hora regresas? El perrito te extraña para dar su paseo. Te esperamos con mucho amor en casa. 💕',
        originalText: 'Hola. ¿A qué hora pensás venir? El perro no se pasea solo.',
        status: 'filtered',
        timestamp: Date.now() - 3600000 * 2,
        profile: 'couple',
        toxicityLevel: 0.65,
        originalTone: 'Quejoso y demandante',
        savedMetric: 'Evitó 2 horas de discusión por tareas del hogar.'
      },
      {
        id: 'msg-1-2',
        sender: 'me',
        text: 'Hola hermosa, estoy terminando unos pendientes importantes de trabajo para poder liberarme temprano y estar contigo. Te mando un beso gigante. ❤️',
        originalText: 'Estoy laburando, no me rompas las pelotas.',
        status: 'filtered',
        timestamp: Date.now() - 3600000,
        profile: 'couple',
        toxicityLevel: 0.88,
        originalTone: 'Agresivo y hostil',
        savedMetric: 'Evitó un fin de semana completo de silencio glacial.'
      }
    ]
  },
  'room-2': {
    id: 'room-2',
    name: 'Jefe de Proyecto 💼',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    profile: 'corporate',
    statusText: 'Escribiendo...',
    phone: '+54 9 11 9876-5432',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-2-1',
        sender: 'other',
        text: 'Apreciado equipo, sugiero alinear nuestras agendas para revisar el progreso actual y asegurar que alcancemos los objetivos del sprint de manera colaborativa.',
        originalText: 'El commit de ayer rompió todo el build de staging si siguen subiendo código basura sin testear.',
        status: 'filtered',
        timestamp: Date.now() - 3600000 * 5,
        profile: 'corporate',
        toxicityLevel: 0.78,
        originalTone: 'Pasivo-agresivo e inculpador',
        savedMetric: 'Previno pánico en el canal de Slack y 4 renuncias de juniors.'
      },
      {
        id: 'msg-2-2',
        sender: 'me',
        text: 'Agradezco el feedback. Procedo a realizar una revisión detallada del pipeline y coordinaré las correcciones necesarias de manera inmediata para optimizar la estabilidad del producto.',
        originalText: 'No es mi culpa que el deployer esté roto, revisen su config de mierda.',
        status: 'filtered',
        timestamp: Date.now() - 3600000 * 4,
        profile: 'corporate',
        toxicityLevel: 0.85,
        originalTone: 'A la defensiva e irritable',
        savedMetric: 'Evitó una reunión de emergencia de 3 horas y un descuento salarial.'
      }
    ]
  },
  'room-3': {
    id: 'room-3',
    name: 'Mamá 👵',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    profile: 'family',
    statusText: 'últ. vez hoy a las 17:45',
    phone: '+54 9 11 4444-8888',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-3-1',
        sender: 'other',
        text: 'Hola hijito, espero que estés muy bien. ¿Cuándo vas a venir a visitarnos? Nos harías muy felices si vienes a almorzar el domingo. 🙏😊',
        originalText: 'Nunca llamás, parece que te olvidaste de que tenés familia.',
        status: 'filtered',
        timestamp: Date.now() - 3600000 * 10,
        profile: 'family',
        toxicityLevel: 0.7,
        originalTone: 'Generador de culpa',
        savedMetric: 'Evitó una llamada telefónica de 45 minutos de reproches.'
      }
    ]
  },
  'room-4': {
    id: 'room-4',
    name: 'Grupo Consorcio 🏢',
    avatar: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=150&auto=format&fit=crop&q=80',
    profile: 'family',
    statusText: 'Grupo • 45 participantes',
    phone: 'Consorcio Edificio 4B',
    unreadCount: 3,
    messages: [
      {
        id: 'msg-4-1',
        sender: 'other',
        text: 'Estimados vecinos, recuerden que de acuerdo a las normativas vigentes, el mantenimiento de los espacios comunes garantiza la armonía de nuestro edificio. Agradecemos su colaboración.',
        originalText: 'Alguien dejó una bolsa de basura goteando en el ascensor. Son unos mugrientos maleducados.',
        status: 'filtered',
        timestamp: Date.now() - 3600000 * 12,
        profile: 'family',
        toxicityLevel: 0.8,
        originalTone: 'Enojado y hostil',
        savedMetric: 'Previno una guerra pasivo-agresiva en la cartelera del hall.'
      }
    ]
  },
  'room-5': {
    id: 'room-5',
    name: 'Soporte Técnico 🛠️',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    profile: 'corporate',
    statusText: 'en línea',
    phone: '+1 (800) 555-0199',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-5-1',
        sender: 'other',
        text: 'Buenas tardes. Le informamos que estamos realizando una mantención proactiva en su nodo de red para asegurar los más altos niveles de disponibilidad de ancho de banda. Quedamos a su servicio.',
        originalText: 'Se va a cortar internet por 2 horas porque tenemos que cambiar unos cables rotos.',
        status: 'filtered',
        timestamp: Date.now() - 3600000 * 24,
        profile: 'corporate',
        toxicityLevel: 0.5,
        originalTone: 'Cortante e informativo',
        savedMetric: 'Evitó reclamos masivos por chat y llamadas al call center.'
      }
    ]
  }
};

export function useChatSync() {
  const [activeRoomId, setActiveRoomId] = useState<string>('room-1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<Record<string, Room>>(SEED_DATA);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [metrics, setMetrics] = useState({
    avoidedFights: 14,
    avgToxicity: 0.72,
    modifiedCount: 8,
  });

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

  // Sync rooms and messages from Firebase or local state
  useEffect(() => {
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
        setMessages(activeRoom.messages || []);
      }
    }
  }, [activeRoomId, rooms, isFirebaseConnected]);

  // Sync structural changes of rooms (e.g. profiles) from Firebase
  useEffect(() => {
    if (isFirebaseConnected && db) {
      const rootRef = ref(db, 'mellow_chats_v2');
      const unsubscribe = onValue(rootRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setRooms(val);
        }
      });
      return () => unsubscribe();
    }
  }, [isFirebaseConnected]);

  // Aggregate metrics
  useEffect(() => {
    let totalToxicity = 0;
    let filteredCount = 0;
    let originalCount = 0;

    Object.values(rooms).forEach((room) => {
      room.messages?.forEach((msg) => {
        if (msg.status === 'filtered') {
          filteredCount++;
          if (msg.toxicityLevel) {
            totalToxicity += msg.toxicityLevel;
            originalCount++;
          }
        }
      });
    });

    const calculatedAvgToxicity = originalCount > 0 ? totalToxicity / originalCount : 0.72;
    const calculatedAvoided = filteredCount + 6; // Baseline

    setMetrics({
      avoidedFights: calculatedAvoided,
      avgToxicity: parseFloat(calculatedAvgToxicity.toFixed(2)),
      modifiedCount: filteredCount,
    });
  }, [rooms, messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;
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
      updatedRooms[activeRoomId].messages = [...(updatedRooms[activeRoomId].messages || []), newMsg];
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

  return {
    activeRoomId,
    setActiveRoomId,
    rooms,
    messages,
    isFirebaseConnected,
    isSending,
    metrics,
    sendMessage: handleSendMessage,
    changeRoomProfile
  };
}
