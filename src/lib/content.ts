export type Scenario = {
  id: string;
  title: string;
  category: string;
  week: number;
  duration: number;
  objective: string;
  opening: string;
  followups: string[];
  expressions: string[];
};
const rows: [string, string, number, string, string, string[]][] = [
  [
    "presentarte",
    "Una primera conversación",
    1,
    "Presentarte",
    "What do you enjoy doing after work or school?",
    ["I enjoy…", "In my free time…", "How about you?"],
  ],
  [
    "fin-de-semana",
    "¿Qué tal tu fin de semana?",
    2,
    "Contar experiencias",
    "What did you do last weekend?",
    ["Last weekend I…", "We decided to…", "What did you do?"],
  ],
  [
    "cafe",
    "Tu café, a tu manera",
    1,
    "Resolver algo cotidiano",
    "Hi there! What can I get for you today?",
    ["Could I have…?", "To take away, please.", "How much is it?"],
  ],
  [
    "conocer-alguien",
    "Romper el hielo",
    1,
    "Presentarte",
    "Hi! Is this your first time here?",
    ["Nice to meet you.", "I am here because…", "What about you?"],
  ],
  [
    "rutina",
    "Un día en tu vida",
    1,
    "Presentarte",
    "What does a typical morning look like for you?",
    ["I usually…", "After that…", "I tend to…"],
  ],
  [
    "barrio",
    "El lugar que llamas casa",
    1,
    "Presentarte",
    "What do you like about your neighborhood?",
    ["There is…", "My favorite place is…", "It is close to…"],
  ],
  [
    "aficiones",
    "Eso que te encanta hacer",
    1,
    "Presentarte",
    "Tell me about something you love doing.",
    ["I am really into…", "I started…", "It helps me…"],
  ],
  [
    "pelicula",
    "¿Viste esa película?",
    2,
    "Contar experiencias",
    "Have you watched anything good recently?",
    ["I watched…", "The story was about…", "I would recommend it."],
  ],
  [
    "comida",
    "Una comida para recordar",
    2,
    "Contar experiencias",
    "Tell me about a meal you really enjoyed.",
    ["We went to…", "I ordered…", "It tasted…"],
  ],
  [
    "sorpresa",
    "Algo que no esperabas",
    2,
    "Contar experiencias",
    "Did anything surprising happen this week?",
    ["I was surprised when…", "At first…", "In the end…"],
  ],
  [
    "recuerdo",
    "Un buen recuerdo",
    2,
    "Contar experiencias",
    "What is a happy memory you would like to share?",
    ["I remember…", "We used to…", "It made me feel…"],
  ],
  [
    "aprender",
    "La última vez que aprendiste algo",
    2,
    "Contar experiencias",
    "What is something new you learned recently?",
    ["I learned how to…", "It was difficult to…", "Now I can…"],
  ],
  [
    "elegir-plan",
    "¿Salimos o nos quedamos?",
    3,
    "Dar tu opinión",
    "Would you rather go out or stay home tonight?",
    ["I would rather…", "How about…?", "That sounds good."],
  ],
  [
    "recomendacion",
    "Tu mejor recomendación",
    3,
    "Dar tu opinión",
    "What is a place you think I should visit?",
    ["You should try…", "What I like most is…", "It is worth…"],
  ],
  [
    "opinion",
    "Decir lo que piensas",
    3,
    "Dar tu opinión",
    "Do you think it is better to live in a small town or a big city?",
    ["In my opinion…", "I agree because…", "On the other hand…"],
  ],
  [
    "musica",
    "La canción que siempre vuelve",
    3,
    "Dar tu opinión",
    "What kind of music do you listen to, and why?",
    ["I prefer…", "It reminds me of…", "I like the way…"],
  ],
  [
    "planes",
    "Hacer planes juntos",
    3,
    "Dar tu opinión",
    "What should we do together this weekend?",
    ["We could…", "Would you like to…?", "Let us meet at…"],
  ],
  [
    "acuerdo",
    "Otra forma de verlo",
    3,
    "Dar tu opinión",
    "I think everyone should learn to cook. What do you think?",
    ["I see your point.", "I am not sure about…", "I agree that…"],
  ],
  [
    "tienda",
    "Encontrar lo que buscas",
    4,
    "Resolver algo cotidiano",
    "Hello! Can I help you find something?",
    ["I am looking for…", "Do you have…?", "Could I try it on?"],
  ],
  [
    "devolucion",
    "Algo no salió como esperabas",
    4,
    "Resolver algo cotidiano",
    "Hi! Is there a problem with your order?",
    ["I ordered…", "There seems to be…", "Could you help me?"],
  ],
  [
    "direcciones",
    "Un poco de orientación",
    4,
    "Resolver algo cotidiano",
    "Excuse me, do you know how to get to the library?",
    ["Go straight ahead.", "Turn left at…", "It is next to…"],
  ],
  [
    "cita",
    "Encontrar un buen horario",
    4,
    "Resolver algo cotidiano",
    "When would you like to make an appointment?",
    [
      "Are you available on…?",
      "Would Thursday work?",
      "Could we change it to…?",
    ],
  ],
  [
    "ayuda",
    "Pedir una mano",
    4,
    "Resolver algo cotidiano",
    "You look a little lost. Do you need any help?",
    ["Could you show me…?", "I am trying to…", "Thank you for your help."],
  ],
  [
    "aclarar",
    "¿Puedes decirlo de otra forma?",
    4,
    "Resolver algo cotidiano",
    "We need to reschedule our plan. Does that work for you?",
    ["Could you repeat that?", "Do you mean…?", "Let me check I understood."],
  ],
];
export const scenarios: Scenario[] = rows.map(
  ([id, title, week, category, opening, expressions]) => ({
    id,
    title,
    category,
    week,
    opening,
    expressions,
    duration: week === 1 ? 5 : 10,
    objective:
      id === "fin-de-semana"
        ? "Cuenta dos actividades y haz una pregunta de seguimiento."
        : `Comparte una idea sobre esta situación y haz una pregunta de seguimiento.`,
    followups: [
      "Can you tell me a little more about that?",
      "What did you enjoy the most? You can ask me a question too.",
      "Thanks for sharing! Take your time to finish your thought.",
    ],
  }),
);
export const scenarioById = (id?: string) =>
  scenarios.find((s) => s.id === id) || scenarios[0];
export type Correction = {
  id: string;
  original: string;
  suggested: string;
  explanation: string;
  skill: string;
  target: string;
  type: "Error" | "Alternativa";
};
export function correctionsFor(turns: string[]): Correction[] {
  const result: Correction[] = [];
  for (const text of turns) {
    if (
      /\b(yesterday|last weekend|last week)\b/i.test(text) &&
      /\bgo\b/i.test(text) &&
      !result.some((c) => c.id === "past")
    )
      result.push({
        id: "past",
        original: text,
        suggested: text.replace(/\bgo\b/i, "went"),
        explanation:
          "Para contar algo que ocurrió ayer o el fin de semana pasado, usamos el pasado: go se convierte en went.",
        skill: "Hablar del pasado",
        target: "went",
        type: "Error",
      });
    if (/\bI am agree\b/i.test(text) && !result.some((c) => c.id === "agree"))
      result.push({
        id: "agree",
        original: text,
        suggested: text.replace(/\bI am agree\b/i, "I agree"),
        explanation:
          "Agree ya es un verbo. Para decir que estás de acuerdo, basta con I agree.",
        skill: "Expresar tu opinión",
        target: "I agree",
        type: "Error",
      });
    if (/\bhe don.t\b/i.test(text) && !result.some((c) => c.id === "does"))
      result.push({
        id: "does",
        original: text,
        suggested: text.replace(/\bhe don.t\b/i, "he doesn’t"),
        explanation:
          "Con he, she o it, usamos doesn’t para una oración negativa en presente.",
        skill: "Construir frases en presente",
        target: "does",
        type: "Error",
      });
  }
  return result.slice(0, 3);
}
export const faqs = [
  [
    "¿Necesito saber inglés?",
    "Está pensado para quienes ya entienden frases básicas y quieren practicar al hablar. La práctica inicial te orienta, sin asignarte una certificación.",
  ],
  [
    "¿Estoy hablando con una persona?",
    "VERVO está pensado para practicar con un tutor de inteligencia artificial. En esta demo las preguntas están preparadas y las correcciones utilizan reglas de ejemplo; todavía no hay un tutor de IA conectado.",
  ],
  [
    "¿Me corrige mientras hablo?",
    "En conversación revisas las correcciones al terminar. Así puedes concentrarte en comunicar lo que quieres decir.",
  ],
  [
    "¿Puedo usarlo en mi celular?",
    "Sí. La demo funciona por escrito y permite grabar audio en navegadores compatibles. El permiso del micrófono solo se solicita cuando tú lo activas.",
  ],
  [
    "¿Qué se guarda en esta demo?",
    "Tu nombre opcional, preferencias, textos de práctica y repasos se guardan en este navegador. El audio solo se conserva en el dispositivo si eliges guardarlo. Puedes borrar todo desde Cuenta.",
  ],
  [
    "¿Tengo que pagar para probar?",
    "No. El plan mensual es una simulación sin cargos. No pedimos tarjetas, contraseñas ni datos de facturación.",
  ],
];
