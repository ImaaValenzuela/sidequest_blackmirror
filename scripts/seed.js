const http = require('https');

const FIREBASE_BASE = 'https://realtimechat-67f5c-default-rtdb.firebaseio.com';
const MY_PHONE = '+5491155559999';

// Localized mock chats highlighting Mellow's filter profiles
const seedRooms = {
  "room_jefe": {
    "id": "room_jefe",
    "name": "Jefe de Proyecto 💼",
    "phone": "+5491150321144",
    "profile": "corporate",
    "lastMessage": "Excelente respuesta, me alegro de tu profesionalismo. Quedo al aguardo.",
    "lastMessageTime": Date.now() - 3600000 * 2,
    "unreadCount": 0,
    "messages": {
      "msg_j_1": {
        "id": "msg_j_1",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "¿Hola? ¿Vas a llegar a entregar el reporte de hoy o tenemos que reprogramar con el cliente?",
        "timestamp": Date.now() - 3600000 * 4,
        "status": "received"
      },
      "msg_j_2": {
        "id": "msg_j_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola. Comprendo la importancia del reporte para el cliente. Estoy priorizando esta tarea para asegurar una entrega óptima a la brevedad.",
        "originalText": "La verdad que me tienen cansado con sus urgencias de último minuto, dejen de cambiar las fechas.",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "filtered",
        "toxicityLevel": 0.82,
        "originalToxicity": 0.82,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 14,
          "filteredWordsCount": 18,
          "delayMs": 480
        }
      },
      "msg_j_3": {
        "id": "msg_j_3",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Excelente respuesta, me alegro de tu profesionalismo. Quedo al aguardo.",
        "timestamp": Date.now() - 3600000 * 2,
        "status": "received"
      }
    }
  },
  "room_amor": {
    "id": "room_amor",
    "name": "Mi Amor 💕",
    "phone": "+5491138224911",
    "profile": "couple",
    "lastMessage": "Gracias por decirlo así, yo también te quiero y quiero que estemos bien. Hablemos cuando llegues.",
    "lastMessageTime": Date.now() - 3600000 * 1,
    "unreadCount": 0,
    "messages": {
      "msg_a_1": {
        "id": "msg_a_1",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "¿Por qué no respondes los mensajes? Siempre hacés lo mismo cuando te enojás.",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "received"
      },
      "msg_a_2": {
        "id": "msg_a_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola cariño. Lamento no haber respondido antes, a veces me cuesta encontrar las palabras correctas cuando tenemos diferencias. Te quiero mucho.",
        "originalText": "No respondo porque decís puras tonterías y no te soporto cuando te ponés así.",
        "timestamp": Date.now() - 3600000 * 2,
        "status": "filtered",
        "toxicityLevel": 0.94,
        "originalToxicity": 0.94,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 13,
          "filteredWordsCount": 21,
          "delayMs": 520
        }
      },
      "msg_a_3": {
        "id": "msg_a_3",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Gracias por decirlo así, yo también te quiero y quiero que estemos bien. Hablemos cuando llegues.",
        "timestamp": Date.now() - 3600000 * 1,
        "status": "received"
      }
    }
  },
  "room_mama": {
    "id": "room_mama",
    "name": "Mamá 🙏",
    "phone": "+5491149876543",
    "profile": "family",
    "lastMessage": "Qué alegría hijo, te preparamos tu comida favorita. Cuidate mucho.",
    "lastMessageTime": Date.now() - 1800000,
    "unreadCount": 0,
    "messages": {
      "msg_m_1": {
        "id": "msg_m_1",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Hijo, ¿vas a venir a cenar el domingo? Hace tres semanas que no te vemos.",
        "timestamp": Date.now() - 3600000,
        "status": "received"
      },
      "msg_m_2": {
        "id": "msg_m_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola mamá. Lamento no haber estado tan presente últimamente debido a mis compromisos laborales. Me encantaría verlos este domingo.",
        "originalText": "Estoy ocupado con mis cosas, no me rompan las bolas con las cenas familiares.",
        "timestamp": Date.now() - 2700000,
        "status": "filtered",
        "toxicityLevel": 0.78,
        "originalToxicity": 0.78,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 12,
          "filteredWordsCount": 19,
          "delayMs": 410
        }
      },
      "msg_m_3": {
        "id": "msg_m_3",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Qué alegría hijo, te preparamos tu comida favorita. Cuidate mucho.",
        "timestamp": Date.now() - 1800000,
        "status": "received"
      }
    }
  },
  "room_socio": {
    "id": "room_socio",
    "name": "Socio Comercial 💼",
    "phone": "+5491161129876",
    "profile": "corporate",
    "lastMessage": "Perfecto, le presento esta propuesta de optimización por la tarde.",
    "lastMessageTime": Date.now() - 600000,
    "unreadCount": 0,
    "messages": {
      "msg_s_1": {
        "id": "msg_s_1",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "El inversor está dudando sobre el presupuesto que pasamos. Hay que bajar los números.",
        "timestamp": Date.now() - 1800000,
        "status": "received"
      },
      "msg_s_2": {
        "id": "msg_s_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Entiendo su postura. Podemos analizar optimizaciones en el alcance del proyecto para alinear el presupuesto con sus expectativas sin comprometer el estándar de calidad.",
        "originalText": "Dile al inversor que no sea tan tacaño, el desarrollo de software de calidad cuesta plata.",
        "timestamp": Date.now() - 1200000,
        "status": "filtered",
        "toxicityLevel": 0.85,
        "originalToxicity": 0.85,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 13,
          "filteredWordsCount": 22,
          "delayMs": 490
        }
      },
      "msg_s_3": {
        "id": "msg_s_3",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "Perfecto, le presento esta propuesta de optimización por la tarde.",
        "timestamp": Date.now() - 600000,
        "status": "received"
      }
    }
  }
};

const seedUsers = {
  "user_1": {
    "phone": MY_PHONE,
    "name": "Tú (Usuario Principal)",
    "role": "Ciudadano",
    "status": "Activo",
    "empathyScore": 0.88,
    "interceptedCount": 4
  },
  "user_2": {
    "phone": "+5491150321144",
    "name": "Jefe de Proyecto",
    "role": "Supervisor",
    "status": "Activo",
    "empathyScore": 0.95,
    "interceptedCount": 0
  },
  "user_3": {
    "phone": "+5491138224911",
    "name": "Mi Amor",
    "role": "Ciudadano",
    "status": "Activo",
    "empathyScore": 0.72,
    "interceptedCount": 0
  },
  "user_4": {
    "phone": "+5491149876543",
    "name": "Mamá",
    "role": "Ciudadano",
    "status": "Activo",
    "empathyScore": 0.99,
    "interceptedCount": 0
  },
  "user_5": {
    "phone": "+5491161129876",
    "name": "Socio Comercial",
    "role": "Socio",
    "status": "Activo",
    "empathyScore": 0.84,
    "interceptedCount": 0
  }
};

function uploadNode(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const url = new URL(`${FIREBASE_BASE}/${path}.json`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(body);
        } else {
          reject(new Error(`Failed to upload ${path}. Status: ${res.statusCode}. Resp: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runSeeder() {
  try {
    console.log('Iniciando Seeding en nodos correctos...');
    
    // Upload Chats
    console.log('Subiendo chats a /mellow_chats_v2...');
    await uploadNode('mellow_chats_v2', seedRooms);
    
    // Upload Users
    console.log('Subiendo usuarios a /mellow_users...');
    await uploadNode('mellow_users', seedUsers);
    
    console.log('¡Seeding completado con éxito en todos los nodos!');
  } catch (err) {
    console.error('Error durante el seeding:', err);
  }
}

runSeeder();
