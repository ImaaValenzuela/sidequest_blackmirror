const http = require('https');

const FIREBASE_BASE = 'https://realtimechat-67f5c-default-rtdb.firebaseio.com';
const MY_PHONE = '+5491155559999';

// Localized mock chats highlighting Mellow's filter profiles
const seedRooms = {
  "room_jefe": {
    "id": "room_jefe",
    "name": "Jefe de Proyecto 💼",
    "phone": "+5491150321144",
    "avatar": "https://i.pravatar.cc/150?img=11",
    "profile": "corporate",
    "lastMessage": "Reporte enviado por mail. Saludos.",
    "lastMessageTime": Date.now() - 3600000 * 1,
    "unreadCount": 0,
    "messages": {
      "msg_j_1": {
        "id": "msg_j_1",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Buenos días, ¿tenés listos los accesos para el nuevo desarrollador?",
        "timestamp": Date.now() - 3600000 * 8,
        "status": "received"
      },
      "msg_j_2": {
        "id": "msg_j_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola. Sí, ya le envié las credenciales de GitHub y el acceso a la base de datos de pruebas.",
        "timestamp": Date.now() - 3600000 * 7,
        "status": "sent"
      },
      "msg_j_3": {
        "id": "msg_j_3",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Perfecto. Recordá que a la tarde tenemos la demo con el cliente del exterior.",
        "timestamp": Date.now() - 3600000 * 6,
        "status": "received"
      },
      "msg_j_4": {
        "id": "msg_j_4",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "¿Hola? ¿Vas a llegar a entregar el reporte de hoy o tenemos que reprogramar con el cliente?",
        "timestamp": Date.now() - 3600000 * 4,
        "status": "received"
      },
      "msg_j_5": {
        "id": "msg_j_5",
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
      "msg_j_6": {
        "id": "msg_j_6",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Excelente respuesta, me alegro de tu profesionalismo. Quedo al aguardo.",
        "timestamp": Date.now() - 3600000 * 2,
        "status": "received"
      },
      "msg_j_7": {
        "id": "msg_j_7",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Reporte enviado por mail. Saludos.",
        "timestamp": Date.now() - 3600000 * 1,
        "status": "sent"
      }
    }
  },
  "room_amor": {
    "id": "room_amor",
    "name": "Mi Amor 💕",
    "phone": "+5491138224911",
    "avatar": "https://i.pravatar.cc/150?img=32",
    "profile": "couple",
    "lastMessage": "Llegando a casa en 10 minutos. Poné la pava.",
    "lastMessageTime": Date.now() - 1200000,
    "unreadCount": 0,
    "messages": {
      "msg_a_1": {
        "id": "msg_a_1",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Hola, ¿cómo vas con tu día? ¿Te acordaste de comprar las cosas para la cena?",
        "timestamp": Date.now() - 3600000 * 10,
        "status": "received"
      },
      "msg_a_2": {
        "id": "msg_a_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola mi vida, sí, ya salgo de la oficina y paso por el súper. ¿Falta algo más aparte de la verdura?",
        "timestamp": Date.now() - 3600000 * 9,
        "status": "sent"
      },
      "msg_a_3": {
        "id": "msg_a_3",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Comprá queso port salut y unos fideos si encontrás. ¡Gracias!",
        "timestamp": Date.now() - 3600000 * 8,
        "status": "received"
      },
      "msg_a_4": {
        "id": "msg_a_4",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale, agendado. Nos vemos en un rato.",
        "timestamp": Date.now() - 3600000 * 7,
        "status": "sent"
      },
      "msg_a_5": {
        "id": "msg_a_5",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "¿Por qué no respondes los mensajes? Siempre hacés lo mismo cuando te enojás.",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "received"
      },
      "msg_a_6": {
        "id": "msg_a_6",
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
      "msg_a_7": {
        "id": "msg_a_7",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Gracias por decirlo así, yo también te quiero y quiero que estemos bien. Hablemos cuando llegues.",
        "timestamp": Date.now() - 3600000 * 1,
        "status": "received"
      },
      "msg_a_8": {
        "id": "msg_a_8",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Llegando a casa en 10 minutos. Poné la pava.",
        "timestamp": Date.now() - 1200000,
        "status": "sent"
      }
    }
  },
  "room_mama": {
    "id": "room_mama",
    "name": "Mamá 🙏",
    "phone": "+5491149876543",
    "avatar": "https://i.pravatar.cc/150?img=47",
    "profile": "family",
    "lastMessage": "¡Buenísimo ma! Llevo el postre. Beso grande.",
    "lastMessageTime": Date.now() - 1500000,
    "unreadCount": 0,
    "messages": {
      "msg_m_1": {
        "id": "msg_m_1",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Hola hijito, ¿cómo estás de salud? ¿Te estás abrigando?",
        "timestamp": Date.now() - 3600000 * 24,
        "status": "received"
      },
      "msg_m_2": {
        "id": "msg_m_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola ma, todo bien por suerte, sí, hace frío pero ando con campera. ¿Ustedes cómo están?",
        "timestamp": Date.now() - 3600000 * 23,
        "status": "sent"
      },
      "msg_m_3": {
        "id": "msg_m_3",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Acá bien, papá con un poco de tos pero nada grave. Acordate de llamarlo para su cumpleaños.",
        "timestamp": Date.now() - 3600000 * 20,
        "status": "received"
      },
      "msg_m_4": {
        "id": "msg_m_4",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Hijo, ¿vas a venir a cenar el domingo? Hace tres semanas que no te vemos.",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "received"
      },
      "msg_m_5": {
        "id": "msg_m_5",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola mamá. Lamento no haber estado tan presente últimamente debido a mis compromisos laborales. Me encantaría verlos este domingo.",
        "originalText": "Estoy ocupado con mis cosas, no me rompan las bolas con las cenas familiares.",
        "timestamp": Date.now() - 3600000 * 2,
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
      "msg_m_6": {
        "id": "msg_m_6",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Qué alegría hijo, te preparamos tu comida favorita. Cuidate mucho.",
        "timestamp": Date.now() - 3600000 * 1,
        "status": "received"
      },
      "msg_m_7": {
        "id": "msg_m_7",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "¡Buenísimo ma! Llevo el postre. Beso grande.",
        "timestamp": Date.now() - 1500000,
        "status": "sent"
      }
    }
  },
  "room_socio": {
    "id": "room_socio",
    "name": "Socio Comercial 💼",
    "phone": "+5491161129876",
    "avatar": "https://i.pravatar.cc/150?img=59",
    "profile": "corporate",
    "lastMessage": "Avisame qué te dice apenas salgas de la reunión.",
    "lastMessageTime": Date.now() - 300000,
    "unreadCount": 0,
    "messages": {
      "msg_s_1": {
        "id": "msg_s_1",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "Hola, ¿viste la propuesta del nuevo diseño UX?",
        "timestamp": Date.now() - 3600000 * 12,
        "status": "received"
      },
      "msg_s_2": {
        "id": "msg_s_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Sí, me gustó bastante. Creo que es más limpio y se adapta mejor al mobile.",
        "timestamp": Date.now() - 3600000 * 11,
        "status": "sent"
      },
      "msg_s_3": {
        "id": "msg_s_3",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "El inversor está dudando sobre el presupuesto que pasamos. Hay que bajar los números.",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "received"
      },
      "msg_s_4": {
        "id": "msg_s_4",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Entiendo su postura. Podemos analizar optimizaciones en el alcance del proyecto para alinear el presupuesto con sus expectativas sin comprometer el estándar de calidad.",
        "originalText": "Dile al inversor que no sea tan tacaño, el desarrollo de software de calidad cuesta plata.",
        "timestamp": Date.now() - 3600000 * 2,
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
      "msg_s_5": {
        "id": "msg_s_5",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "Perfecto, le presento esta propuesta de optimización por la tarde.",
        "timestamp": Date.now() - 3600000 * 1,
        "status": "received"
      },
      "msg_s_6": {
        "id": "msg_s_6",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Avisame qué te dice apenas salgas de la reunión.",
        "timestamp": Date.now() - 300000,
        "status": "sent"
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
