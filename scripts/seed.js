const http = require('https');

const FIREBASE_BASE = 'https://realtimechat-67f5c-default-rtdb.firebaseio.com';
const MY_PHONE = '+5491155559999';

// Extensively populated Argentinized mock chats highlighting Mellow's filter profiles
const seedRooms = {
  "room_jefe": {
    "id": "room_jefe",
    "name": "Jefe de Proyecto 💼",
    "phone": "+5491150321144",
    "avatar": "https://i.pravatar.cc/150?img=11",
    "profile": "corporate",
    "lastMessage": "Dale, avisame cualquier cosa. Saludos.",
    "lastMessageTime": Date.now() - 3600000 * 1,
    "unreadCount": 0,
    "messages": {
      "msg_j_1": {
        "id": "msg_j_1",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Che, ¿cómo andás? ¿Llegás a entregar el reporte de hoy o reprogramamos con el cliente?",
        "timestamp": Date.now() - 3600000 * 12,
        "status": "received"
      },
      "msg_j_2": {
        "id": "msg_j_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola. Sí, ya le pasé los accesos de GitHub al desarrollador nuevo y la base de datos de prueba está levantada.",
        "timestamp": Date.now() - 3600000 * 11,
        "status": "sent"
      },
      "msg_j_3": {
        "id": "msg_j_3",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Buenísimo. Acordate que a la tarde tenemos la demo con los clientes de afuera.",
        "timestamp": Date.now() - 3600000 * 10,
        "status": "received"
      },
      "msg_j_4": {
        "id": "msg_j_4",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "¿Che, estás ahí? ¿Terminás el reporte de métricas hoy o se nos cae la presentación?",
        "timestamp": Date.now() - 3600000 * 8,
        "status": "received"
      },
      "msg_j_5": {
        "id": "msg_j_5",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola. Comprendo la importancia del reporte para el cliente. Estoy priorizando esta tarea para asegurar una entrega óptima a la brevedad.",
        "originalText": "La verdad que me tienen podrido con las urgencias a último momento, dejen de cambiar las fechas a cada rato que es un quilombo.",
        "timestamp": Date.now() - 3600000 * 7,
        "status": "filtered",
        "toxicityLevel": 0.82,
        "originalToxicity": 0.82,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 20,
          "filteredWordsCount": 18,
          "delayMs": 480
        }
      },
      "msg_j_6": {
        "id": "msg_j_6",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Excelente respuesta, me alegro de tu profesionalismo. Quedo al aguardo.",
        "timestamp": Date.now() - 3600000 * 6,
        "status": "received"
      },
      "msg_j_7": {
        "id": "msg_j_7",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Reporte enviado por mail. Saludos.",
        "timestamp": Date.now() - 3600000 * 5,
        "status": "sent"
      },
      "msg_j_8": {
        "id": "msg_j_8",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Che, el cliente me está pidiendo si podemos adelantar la entrega del módulo 2 para el lunes a primera hora.",
        "timestamp": Date.now() - 3600000 * 4,
        "status": "received"
      },
      "msg_j_9": {
        "id": "msg_j_9",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola. Adelantar la entrega para el lunes implicaría reasignar recursos durante el fin de semana. ¿Podríamos evaluar esto el lunes en la reunión de la mañana para mantener la calidad?",
        "originalText": "El lunes a primera hora es imposible, ¿estás loco? No pienso laburar el fin de semana por dos mangos.",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "filtered",
        "toxicityLevel": 0.88,
        "originalToxicity": 0.88,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 18,
          "filteredWordsCount": 27,
          "delayMs": 510
        }
      },
      "msg_j_10": {
        "id": "msg_j_10",
        "senderId": "+5491150321144",
        "senderName": "Jefe de Proyecto 💼",
        "text": "Tenés razón, mejor lo charlamos el lunes temprano. Gracias.",
        "timestamp": Date.now() - 3600000 * 2,
        "status": "received"
      },
      "msg_j_11": {
        "id": "msg_j_11",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale, avisame cualquier cosa. Saludos.",
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
    "lastMessage": "Dale, llego a casa en 10 minutos. Poné la pava para unos mates.",
    "lastMessageTime": Date.now() - 600000,
    "unreadCount": 0,
    "messages": {
      "msg_a_1": {
        "id": "msg_a_1",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Hola lindo, ¿cómo va tu día? ¿Te acordaste de comprar las cosas para la cena de esta noche?",
        "timestamp": Date.now() - 3600000 * 15,
        "status": "received"
      },
      "msg_a_2": {
        "id": "msg_a_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola gordi, sí, ya salgo del laburo y paso por el súper. ¿Falta algo más aparte de la verdura?",
        "timestamp": Date.now() - 3600000 * 14,
        "status": "sent"
      },
      "msg_a_3": {
        "id": "msg_a_3",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Comprá queso port salut y unos fideos si encontrás. ¡Gracias!",
        "timestamp": Date.now() - 3600000 * 13,
        "status": "received"
      },
      "msg_a_4": {
        "id": "msg_a_4",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale, ya me lo anoté. Nos vemos en un ratito.",
        "timestamp": Date.now() - 3600000 * 12,
        "status": "sent"
      },
      "msg_a_5": {
        "id": "msg_a_5",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "¿Por qué no me contestás los mensajes? Siempre hacés la misma cuando te enojás, che.",
        "timestamp": Date.now() - 3600000 * 10,
        "status": "received"
      },
      "msg_a_6": {
        "id": "msg_a_6",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola gordi. Perdón por colgarme y no contestar antes, a veces me cuesta encontrar las palabras correctas cuando discutimos. Te amo mucho.",
        "originalText": "No te contesto porque decís cualquiera y no te soporto cuando te ponés así de pesada.",
        "timestamp": Date.now() - 3600000 * 9,
        "status": "filtered",
        "toxicityLevel": 0.94,
        "originalToxicity": 0.94,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 14,
          "filteredWordsCount": 21,
          "delayMs": 520
        }
      },
      "msg_a_7": {
        "id": "msg_a_7",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Gracias por decirlo así, yo también te amo y quiero que estemos bien. Charlamos tranquilos cuando llegues.",
        "timestamp": Date.now() - 3600000 * 8,
        "status": "received"
      },
      "msg_a_8": {
        "id": "msg_a_8",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Che, traé también facturas de dulce de leche de la panadería de la esquina.",
        "timestamp": Date.now() - 3600000 * 6,
        "status": "received"
      },
      "msg_a_9": {
        "id": "msg_a_9",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "De una, paso por ahí antes de entrar al barrio.",
        "timestamp": Date.now() - 3600000 * 5,
        "status": "sent"
      },
      "msg_a_10": {
        "id": "msg_a_10",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Uh, y fijate si el gato tiene comida. Me parece que se terminó la bolsa.",
        "timestamp": Date.now() - 3600000 * 4,
        "status": "received"
      },
      "msg_a_11": {
        "id": "msg_a_11",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale, gordi. Compro una bolsa chiquita para zafar hoy y el fin de semana compramos la grande.",
        "originalText": "Fijate vos, yo vengo de laburar todo el día y me mandás a hacer de todo. ¿Por qué no te movés un poco?",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "filtered",
        "toxicityLevel": 0.87,
        "originalToxicity": 0.87,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 20,
          "filteredWordsCount": 18,
          "delayMs": 440
        }
      },
      "msg_a_12": {
        "id": "msg_a_12",
        "senderId": "+5491138224911",
        "senderName": "Mi Amor 💕",
        "text": "Gracias gordo, sos un sol. Te espero con el agua caliente lista.",
        "timestamp": Date.now() - 3600000 * 2,
        "status": "received"
      },
      "msg_a_13": {
        "id": "msg_a_13",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "¡Buenísimo! Ya salgo para allá.",
        "timestamp": Date.now() - 3600000 * 1,
        "status": "sent"
      },
      "msg_a_14": {
        "id": "msg_a_14",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale, llego a casa en 10 minutos. Poné la pava para unos mates.",
        "timestamp": Date.now() - 600000,
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
    "lastMessage": "¡Buenísimo ma! Llevo unas facturas. Beso grande.",
    "lastMessageTime": Date.now() - 1500000,
    "unreadCount": 0,
    "messages": {
      "msg_m_1": {
        "id": "msg_m_1",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Hola hijito, ¿cómo estás? ¿Te estás abrigando bien que hace un frío bárbaro?",
        "timestamp": Date.now() - 3600000 * 24,
        "status": "received"
      },
      "msg_m_2": {
        "id": "msg_m_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola ma, todo de diez por suerte, sí, está helado pero ando abrigado. ¿Ustedes cómo andan?",
        "timestamp": Date.now() - 3600000 * 23,
        "status": "sent"
      },
      "msg_m_3": {
        "id": "msg_m_3",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Acá bien, papá anda con un poco de tos pero nada grave. Acordate de llamarlo para su cumple.",
        "timestamp": Date.now() - 3600000 * 20,
        "status": "received"
      },
      "msg_m_4": {
        "id": "msg_m_4",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Hijo, ¿vas a venir a comer el domingo? Hace como tres semanas que no te vemos, che.",
        "timestamp": Date.now() - 3600000 * 12,
        "status": "received"
      },
      "msg_m_5": {
        "id": "msg_m_5",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola ma. Lamento no haber estado tan presente últimamente debido al laburo. Me encantaría ir a almorzar con ustedes este domingo.",
        "originalText": "Estoy a mil con mis cosas, no me rompan las bolas con los almuerzos familiares de los domingos.",
        "timestamp": Date.now() - 3600000 * 11,
        "status": "filtered",
        "toxicityLevel": 0.78,
        "originalToxicity": 0.78,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 15,
          "filteredWordsCount": 19,
          "delayMs": 410
        }
      },
      "msg_m_6": {
        "id": "msg_m_6",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Qué alegría hijo, te preparamos un asadito y flan casero. Cuidate mucho.",
        "timestamp": Date.now() - 3600000 * 10,
        "status": "received"
      },
      "msg_m_7": {
        "id": "msg_m_7",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Hijo, ¿podrás pasar a buscar a tu tía Pocha por el camino? No tiene cómo venir.",
        "timestamp": Date.now() - 3600000 * 8,
        "status": "received"
      },
      "msg_m_8": {
        "id": "msg_m_8",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola ma, no hay drama. Yo paso por la casa de la tía Pocha tipo 12 y la llevo conmigo. Besos.",
        "originalText": "Ufa, siempre me meten de chofer de toda la familia. Que se tome un taxi o un bondi.",
        "timestamp": Date.now() - 3600000 * 7,
        "status": "filtered",
        "toxicityLevel": 0.81,
        "originalToxicity": 0.81,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 18,
          "filteredWordsCount": 20,
          "delayMs": 430
        }
      },
      "msg_m_9": {
        "id": "msg_m_9",
        "senderId": "+5491149876543",
        "senderName": "Mamá 🙏",
        "text": "Gracias mi amor, sos re bueno. Nos vemos el domingo.",
        "timestamp": Date.now() - 3600000 * 5,
        "status": "received"
      },
      "msg_m_10": {
        "id": "msg_m_10",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale ma, un beso grande.",
        "timestamp": Date.now() - 3600000 * 3,
        "status": "sent"
      },
      "msg_m_11": {
        "id": "msg_m_11",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "¡Buenísimo ma! Llevo unas facturas. Beso grande.",
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
    "lastMessage": "Dale, esperemos que acepte. Nos mantenemos al habla.",
    "lastMessageTime": Date.now() - 300000,
    "unreadCount": 1, // Set unread count so a notification badge shows up!
    "messages": {
      "msg_s_1": {
        "id": "msg_s_1",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "Che, ¿viste la propuesta del nuevo diseño UX? ¿Qué te pareció?",
        "timestamp": Date.now() - 3600000 * 12,
        "status": "received"
      },
      "msg_s_2": {
        "id": "msg_s_2",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Sí, la miré. Me pareció re limpia y en el celu se ve bárbara.",
        "timestamp": Date.now() - 3600000 * 11,
        "status": "sent"
      },
      "msg_s_3": {
        "id": "msg_s_3",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "Che, el inversor está dando vueltas con el presupuesto que pasamos. Hay que bajar los números sí o sí.",
        "timestamp": Date.now() - 3600000 * 9,
        "status": "received"
      },
      "msg_s_4": {
        "id": "msg_s_4",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Entiendo su postura. Podemos analizar optimizaciones en el alcance del proyecto para alinear el presupuesto con sus expectativas sin comprometer el estándar de calidad.",
        "originalText": "Decile al inversor que deje de ratear, el desarrollo de software de calidad cuesta guita y no lo regalamos.",
        "timestamp": Date.now() - 3600000 * 8,
        "status": "filtered",
        "toxicityLevel": 0.85,
        "originalToxicity": 0.85,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 16,
          "filteredWordsCount": 22,
          "delayMs": 490
        }
      },
      "msg_s_5": {
        "id": "msg_s_5",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "De una, le presento esta propuesta de optimización a la tarde.",
        "timestamp": Date.now() - 3600000 * 7,
        "status": "received"
      },
      "msg_s_6": {
        "id": "msg_s_6",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale, avisame qué te dice apenas salgas de la reunión. Abrazo.",
        "timestamp": Date.now() - 3600000 * 6,
        "status": "sent"
      },
      "msg_s_7": {
        "id": "msg_s_7",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "Che, dice el inversor que si bajamos un 15% cerramos el trato ahora mismo. ¿Qué hacemos?",
        "timestamp": Date.now() - 3600000 * 5,
        "status": "received"
      },
      "msg_s_8": {
        "id": "msg_s_8",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Hola. Un descuento del 15% comprometería nuestro margen operativo. Propongo ofrecer un 5% o bien reducir el alcance de la primera etapa para adaptarnos a su número.",
        "originalText": "Ese tipo es un usurero, si bajamos un 15% nos fundimos. Mandalo a cagar.",
        "timestamp": Date.now() - 3600000 * 4,
        "status": "filtered",
        "toxicityLevel": 0.89,
        "originalToxicity": 0.89,
        "metadata": {
          "modelUsed": "gpt-4o-mini",
          "originalWordsCount": 14,
          "filteredWordsCount": 27,
          "delayMs": 480
        }
      },
      "msg_s_9": {
        "id": "msg_s_9",
        "senderId": "+5491161129876",
        "senderName": "Socio Comercial 💼",
        "text": "Perfecto, le planteo la reducción de alcance. Es más viable.",
        "timestamp": Date.now() - 3600000 * 2,
        "status": "received"
      },
      "msg_s_10": {
        "id": "msg_s_10",
        "senderId": MY_PHONE,
        "senderName": "Tú",
        "text": "Dale, esperemos que acepte. Nos mantenemos al habla.",
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
    "interceptedCount": 8
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
