/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Flame,
  Droplets,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Database ---
interface Recipe {
  nome: string;
  ingredientes: string[];
  preparo: {
    limpeza: string;
    fogo: string;
    finalizacao: string;
  };
  contra: string;
}

interface Category {
  icone: string;
  subs: Record<string, Recipe>;
}

const DATABASE: Record<string, Category> = {
  "Emagrecimento": {
    icone: "🏃‍♀️",
    subs: {
      "Gordura Abdominal": { nome: "Chá de Canela e Gengibre", ingredientes: ["1 pau de canela", "2 fatias de gengibre", "300ml de água"], preparo: { limpeza: "Lave o gengibre na torneira para tirar a terra e corte duas rodelas. Lave a canela também.", fogo: "Ferva a água com a canela por 5 minutos. Coloque o gengibre e ferva mais 5 minutos no fogo baixo.", finalizacao: "Desligue o fogo, tampe com um pratinho e espere 5 minutos. Beba morninho." }, contra: "Não tome se você tiver pressão alta ou se o seu estômago arder (gastrite)." },
      "Retenção de Líquidos": { nome: "Chá de Cavalinha", ingredientes: ["1 colher de cavalinha", "250ml de água"], preparo: { limpeza: "Coloque a erva numa peneira e passe uma água rápida para tirar o pó.", fogo: "Ferva a água sozinha. Quando começar a fazer bolinhas, desligue.", finalizacao: "Jogue a erva na água quente, tampe por 10 minutos e coe." }, contra: "Pessoas com problemas nos rins não devem tomar sem falar com o médico." },
      "Metabolismo Lento": { nome: "Chá Verde e Limão", ingredientes: ["1 colher de chá verde", "Meio limão"], preparo: { limpeza: "Corte o limão na hora. Lave as folhas do chá verde.", fogo: "Aqueça a água até as primeiras bolinhas (80°C). Não deixe ferver forte.", finalizacao: "Coloque o chá, tampe por 3 minutos. Esprema o limão no fim." }, contra: "Evite se tiver arritmia ou insônia severa." },
      "Compulsão por Doces": { nome: "Chá de Casca de Maçã", ingredientes: ["Casca de 2 maçãs", "1 pau de canela"], preparo: { limpeza: "Lave bem as maçãs. Use só as cascas limpas.", fogo: "Ferva a água com canela por 5 minutos. Jogue as cascas e ferva mais 2 minutos.", finalizacao: "Abafe e beba quando der vontade de comer doce. O cheirinho ajuda o cérebro." }, contra: "Seguro para quase todo mundo. Quem tem pressão alta deve tomar só uma xícara." },
      "Inchaço Abdominal": { nome: "Chá de Hibisco com Cavalinha", ingredientes: ["1 colher de hibisco", "1 colher de cavalinha"], preparo: { limpeza: "Lave as ervas secas rapidamente.", fogo: "Ferva 500ml de água e desligue.", finalizacao: "Adicione as ervas, tampe por 10 minutos e coe." }, contra: "Pode baixar a pressão. Evite se estiver grávida." },
      "Gordura no Fígado": { nome: "Chá de Boldo", ingredientes: ["2 folhas de boldo fresco"], preparo: { limpeza: "Lave bem as folhas.", fogo: "Ferva a água e desligue.", finalizacao: "Amasse as folhas na água quente, tampe por 5 minutos e beba sem açúcar." }, contra: "Não use por mais de 10 dias seguidos." },
      "Fome Noturna": { nome: "Chá de Melissa com Maracujá", ingredientes: ["Folhas de melissa", "Polpa de 1 maracujá"], preparo: { limpeza: "Lave a melissa.", fogo: "Ferva a água com a polpa por 3 minutos.", finalizacao: "Desligue, jogue a melissa, abafe por 10 minutos." }, contra: "Dá muito sono, evite se for dirigir." },
      "Celulite": { nome: "Chá de Centelha Asiática", ingredientes: ["1 colher de centelha asiática"], preparo: { limpeza: "Lave a erva seca.", fogo: "Ferva a água e desligue.", finalizacao: "Infusão por 10 minutos. Melhora a circulação." }, contra: "Pode causar sensibilidade na pele em algumas pessoas." },
      "Detox Hepático": { nome: "Chá de Dente-de-Leão", ingredientes: ["1 colher de raiz de dente-de-leão"], preparo: { limpeza: "Lave bem a raiz.", fogo: "Ferva por 10 minutos em fogo baixo.", finalizacao: "Abafe por 5 minutos e coe." }, contra: "Evite se tiver obstrução dos ductos biliares." },
      "Redução de Medidas": { nome: "Chá de Carqueja", ingredientes: ["1 colher de carqueja"], preparo: { limpeza: "Lave a erva.", fogo: "Ferva a água e desligue.", finalizacao: "Abafe por 10 minutos. É amargo, mas eficiente." }, contra: "Pode baixar demais a glicose em diabéticos." }
    }
  },
  "Sono": {
    icone: "😴",
    subs: {
      "Insônia Inicial": { nome: "Chá de Mulungu", ingredientes: ["Casca de Mulungu"], preparo: { limpeza: "Lave as cascas de madeira.", fogo: "Ferva as cascas por 10 minutos.", finalizacao: "Abafe e beba 1h antes de deitar. Dá muito sono." }, contra: "Baixa a pressão. Se você toma remédio para o coração, pergunte ao médico." },
      "Ansiedade Noturna": { nome: "Passiflora e Melissa", ingredientes: ["Folhas de maracujá", "Melissa"], preparo: { limpeza: "Lave as folhas.", fogo: "Ferva água e jogue nas folhas.", finalizacao: "Tampe bem para o aroma não fugir por 12 min." }, contra: "Não beba se for dirigir ou mexer com ferramentas." },
      "Sono Agitado": { nome: "Camomila com Lavanda", ingredientes: ["Flores de Camomila", "Lavanda seca"], preparo: { limpeza: "Lave as flores secas.", fogo: "Infusão suave.", finalizacao: "Abafe por 10 minutos. O perfume acalma o cérebro." }, contra: "Cuidado quem tem alergia a flores de jardim." },
      "Mente Acelerada": { nome: "Chá de Valeriana", ingredientes: ["Raiz de Valeriana"], preparo: { limpeza: "Lave bem a raiz.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 15 minutos. O cheiro é forte, mas o efeito é potente." }, contra: "Não misture com álcool ou outros sedativos." },
      "Bruxismo": { nome: "Chá de Erva-Cidreira", ingredientes: ["Folhas frescas de erva-cidreira"], preparo: { limpeza: "Lave as folhas.", fogo: "Ferva a água e desligue.", finalizacao: "Abafe por 10 minutos. Relaxa a mandíbula." }, contra: "Geralmente seguro para todos." },
      "Pesadelos": { nome: "Chá de Alecrim com Mel", ingredientes: ["Raminho de alecrim", "1 colher de mel"], preparo: { limpeza: "Lave o alecrim.", fogo: "Infusão rápida de 5 minutos.", finalizacao: "Adoce com mel. Traz sensação de proteção." }, contra: "Evite se tiver pressão muito alta à noite." },
      "Acordar no Meio da Noite": { nome: "Chá de Alface", ingredientes: ["3 folhas de alface (o talo também)"], preparo: { limpeza: "Lave muito bem as folhas.", fogo: "Ferva as folhas por 5 minutos.", finalizacao: "Abafe por 5 minutos e beba morno." }, contra: "Seguro, mas pode ser diurético para algumas pessoas." },
      "Estresse do Dia": { nome: "Chá de Tília", ingredientes: ["Flores de Tília"], preparo: { limpeza: "Lave as flores.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba lentamente sentindo o aroma." }, contra: "Pode causar sonolência excessiva." },
      "Higiene do Sono": { nome: "Chá de Lúpulo", ingredientes: ["Flores de Lúpulo"], preparo: { limpeza: "Lave as flores.", fogo: "Infusão de 8 minutos.", finalizacao: "Beba 30 min antes de deitar." }, contra: "Evite se tiver depressão profunda." },
      "Cansaço Mental": { nome: "Chá de Ashwagandha", ingredientes: ["Raiz de Ashwagandha em pó ou pedaços"], preparo: { limpeza: "Lave se for raiz.", fogo: "Ferva por 10 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Consulte se tiver doenças autoimunes." }
    }
  },
  "Digestão": {
    icone: "🍃",
    subs: {
      "Azia": { nome: "Espinheira-Santa", ingredientes: ["1 colher de erva"], preparo: { limpeza: "Lave a erva seca.", fogo: "Água fervente desligada.", finalizacao: "Abafe por 10 min. Beba antes de comer." }, contra: "Mães que amamentam não devem tomar." },
      "Gases": { nome: "Funcho", ingredientes: ["Sementinhas de Funcho"], preparo: { limpeza: "Esmague as sementes.", fogo: "Ferva e desligue.", finalizacao: "Abafe por 10 minutos." }, contra: "Geralmente seguro." },
      "Refluxo": { nome: "Gengibre com Camomila", ingredientes: ["Fatia fina de gengibre", "Camomila"], preparo: { limpeza: "Lave bem.", fogo: "Ferva gengibre 5 min.", finalizacao: "Desligue e jogue camomila por 10 min." }, contra: "Gastrite muito forte pode doer." },
      "Prisão de Ventre": { nome: "Chá de Sene", ingredientes: ["Folhas de Sene"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 5 minutos.", finalizacao: "Beba antes de dormir para efeito de manhã." }, contra: "Não use por mais de 7 dias. Causa dependência intestinal." },
      "Diarreia": { nome: "Chá de Broto de Goiabeira", ingredientes: ["3 brotos de goiabeira"], preparo: { limpeza: "Lave bem os brotos.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 10 minutos e beba sem açúcar." }, contra: "Pode causar constipação se exagerar." },
      "Enjoo": { nome: "Chá de Hortelã-Pimenta", ingredientes: ["Folhas de hortelã"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 5 minutos.", finalizacao: "Beba em pequenos goles." }, contra: "Pode piorar o refluxo em algumas pessoas." },
      "Fígado Gorduroso": { nome: "Chá de Alcachofra", ingredientes: ["Folhas de alcachofra"], preparo: { limpeza: "Lave as folhas.", fogo: "Ferva por 10 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Evite se tiver pedras na vesícula." },
      "Má Digestão": { nome: "Chá de Alecrim com Sálvia", ingredientes: ["Alecrim", "Sálvia"], preparo: { limpeza: "Lave as ervas.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba após as refeições pesadas." }, contra: "Evite se tiver pressão alta." },
      "Intolerância": { nome: "Chá de Coentro", ingredientes: ["Sementes de coentro"], preparo: { limpeza: "Lave as sementes.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 10 minutos. Ajuda a reduzir gases." }, contra: "Geralmente seguro." },
      "Colite": { nome: "Chá de Calêndula", ingredientes: ["Flores de calêndula"], preparo: { limpeza: "Lave as flores.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba morno." }, contra: "Evite se tiver alergia a margaridas." }
    }
  },
  "Dores e Articulações": {
    icone: "🩹",
    subs: {
      "Enxaqueca": { nome: "Tanaceto", ingredientes: ["Erva Tanaceto"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão.", finalizacao: "Abafe 10 min." }, contra: "Cuidado se usar anticoagulantes." },
      "Artrite": { nome: "Cúrcuma", ingredientes: ["Raiz ou pó de Cúrcuma"], preparo: { limpeza: "Lave raiz.", fogo: "Ferva 10 min.", finalizacao: "Beba com pitada de pimenta." }, contra: "Evite se tiver pedras na vesícula." },
      "Lombar": { nome: "Garra do Diabo", ingredientes: ["Raiz de Garra do Diabo"], preparo: { limpeza: "Lave bem.", fogo: "Ferva por 15 min.", finalizacao: "Abafe 5 min." }, contra: "Evite se tiver úlceras." },
      "Muscular": { nome: "Chá de Arnica (Uso Interno Controlado)", ingredientes: ["Arnica montana"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão rápida.", finalizacao: "Beba apenas uma xícara pequena." }, contra: "Tóxico em grandes doses. Prefira compressas externas." },
      "Menstrual": { nome: "Chá de Orégano", ingredientes: ["1 colher de orégano seco"], preparo: { limpeza: "Lave o orégano.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba bem quente." }, contra: "Evite se tiver fluxo muito intenso." },
      "Dente": { nome: "Chá de Cravo-da-Índia", ingredientes: ["5 cravos"], preparo: { limpeza: "Lave os cravos.", fogo: "Ferva por 5 minutos.", finalizacao: "Faça bochecho ou beba." }, contra: "Pode irritar a gengiva se for muito forte." },
      "Garganta": { nome: "Chá de Malva", ingredientes: ["Folhas de malva"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 10 minutos.", finalizacao: "Gargareje e beba." }, contra: "Geralmente seguro." },
      "Reumatismo": { nome: "Chá de Chapéu-de-Couro", ingredientes: ["Folhas de chapéu-de-couro"], preparo: { limpeza: "Lave as folhas.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 10 minutos." }, contra: "Pode ser diurético forte." },
      "Tendinite": { nome: "Chá de Salgueiro Branco", ingredientes: ["Casca de salgueiro"], preparo: { limpeza: "Lave a casca.", fogo: "Ferva por 15 minutos.", finalizacao: "Abafe por 5 minutos. É a aspirina natural." }, contra: "Não tome se tiver alergia a aspirina." },
      "Ciático": { nome: "Chá de Erva-de-São-João", ingredientes: ["Erva-de-São-João"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba 2x ao dia." }, contra: "Interage com muitos remédios. Consulte o médico." }
    }
  },
  "Imunidade": {
    icone: "🛡️",
    subs: {
      "Resfriado": { nome: "Sabugueiro", ingredientes: ["Flores de Sabugueiro"], preparo: { limpeza: "Lave as flores.", fogo: "Infusão.", finalizacao: "Abafe 10 min. Ajuda na febre." }, contra: "Geralmente seguro." },
      "Gripe Forte": { nome: "Alho e Mel", ingredientes: ["Alho", "Gengibre", "Mel"], preparo: { limpeza: "Amasse o alho.", fogo: "Ferva alho e gengibre 5 min.", finalizacao: "Coloque mel e beba quente." }, contra: "Pode irritar estômagos sensíveis." },
      "Tosse Seca": { nome: "Guaco", ingredientes: ["Folhas de Guaco"], preparo: { limpeza: "Lave folhas.", fogo: "Ferva água desligue.", finalizacao: "Abafe 10 min." }, contra: "Cuidado com uso de anticoagulantes." },
      "Catarro": { nome: "Chá de Tomilho", ingredientes: ["Ramos de tomilho"], preparo: { limpeza: "Lave bem.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba morno. Ajuda a soltar o peito." }, contra: "Evite se tiver gastrite." },
      "Sinusite": { nome: "Chá de Eucalipto", ingredientes: ["Folhas de eucalipto"], preparo: { limpeza: "Lave as folhas.", fogo: "Ferva e inale o vapor antes de beber.", finalizacao: "Abafe por 10 minutos." }, contra: "Não use em crianças pequenas sem orientação." },
      "Rinite": { nome: "Chá de Ortiga", ingredientes: ["Folhas de ortiga seca"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba 2x ao dia. Anti-histamínico natural." }, contra: "Pode causar queda de pressão." },
      "Amigdalite": { nome: "Chá de Romã", ingredientes: ["Casca de romã"], preparo: { limpeza: "Lave bem a casca.", fogo: "Ferva por 10 minutos.", finalizacao: "Faça gargarejos frequentes." }, contra: "Não engula em grandes quantidades." },
      "Herpes": { nome: "Chá de Equinácea", ingredientes: ["Raiz ou folhas de equinácea"], preparo: { limpeza: "Lave bem.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 10 minutos." }, contra: "Não use por mais de 8 semanas seguidas." },
      "Inflamação": { nome: "Chá de Unha-de-Gato", ingredientes: ["Casca de unha-de-gato"], preparo: { limpeza: "Lave a casca.", fogo: "Ferva por 15 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Evite se estiver tentando engravidar." },
      "Recuperação": { nome: "Chá de Astragalus", ingredientes: ["Raiz de Astragalus"], preparo: { limpeza: "Lave a raiz.", fogo: "Ferva por 20 minutos.", finalizacao: "Abafe por 10 minutos." }, contra: "Evite se tiver febre alta." }
    }
  },
  "Foco e Memória": {
    icone: "🧠",
    subs: {
      "Estudos": { nome: "Alecrim", ingredientes: ["Alecrim"], preparo: { limpeza: "Lave.", fogo: "Infusão.", finalizacao: "Abafe 10 min." }, contra: "Pode elevar a pressão arterial." },
      "Fadiga": { nome: "Ginseng", ingredientes: ["Raiz de Ginseng"], preparo: { limpeza: "Lave.", fogo: "Ferva 10 min.", finalizacao: "Abafe 5 min." }, contra: "Evite se tiver hipertensão ou insônia." },
      "Clareza": { nome: "Sálvia", ingredientes: ["Folhas de Sálvia"], preparo: { limpeza: "Lave.", fogo: "Infusão.", finalizacao: "Abafe 8 min." }, contra: "Não recomendado para lactantes." },
      "Bloqueio": { nome: "Chá de Bacopa Monnieri", ingredientes: ["Erva Bacopa"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba pela manhã." }, contra: "Pode causar leve desconforto gástrico." },
      "Esgotamento": { nome: "Chá de Rhodiola Rosea", ingredientes: ["Raiz de Rhodiola"], preparo: { limpeza: "Lave a raiz.", fogo: "Ferva por 10 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Evite se tiver transtorno bipolar." },
      "TDAH": { nome: "Chá de Ginkgo Biloba", ingredientes: ["Folhas de Ginkgo"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba 1x ao dia." }, contra: "Cuidado com uso de anticoagulantes." },
      "Longevidade": { nome: "Chá de Gotu Kola", ingredientes: ["Folhas de Gotu Kola"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba regularmente." }, contra: "Pode afetar o fígado em doses altas." },
      "Reuniões": { nome: "Chá de Hortelã com Limão", ingredientes: ["Hortelã", "Limão"], preparo: { limpeza: "Lave bem.", fogo: "Infusão rápida.", finalizacao: "Beba gelado para despertar." }, contra: "Geralmente seguro." },
      "Stress": { nome: "Chá de Manjericão Sagrado (Tulsi)", ingredientes: ["Folhas de Tulsi"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba ao final do dia." }, contra: "Pode baixar o açúcar no sangue." },
      "Revitalização": { nome: "Chá de Mate com Canela", ingredientes: ["Erva-mate", "Canela"], preparo: { limpeza: "Lave a canela.", fogo: "Infusão de 5 minutos.", finalizacao: "Beba quente." }, contra: "Contém muita cafeína." }
    }
  },
  "Pele e Beleza": {
    icone: "✨",
    subs: {
      "Acne": { nome: "Bardana", ingredientes: ["Raiz de Bardana"], preparo: { limpeza: "Lave bem.", fogo: "Ferva 10 min.", finalizacao: "Beba ou use como tônico." }, contra: "Pode soltar o intestino." },
      "Colágeno": { nome: "Chá Branco", ingredientes: ["Folhas de Chá Branco"], preparo: { limpeza: "Lave.", fogo: "75 graus (antes de ferver).", finalizacao: "Abafe 5 min." }, contra: "Contém cafeína." },
      "Rugas": { nome: "Chá de Rosa Mosqueta", ingredientes: ["Frutos de rosa mosqueta"], preparo: { limpeza: "Lave os frutos.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 10 minutos. Rico em Vitamina C." }, contra: "Geralmente seguro." },
      "Olheiras": { nome: "Chá de Camomila (Compressa)", ingredientes: ["Flores de camomila"], preparo: { limpeza: "Lave as flores.", fogo: "Infusão forte.", finalizacao: "Gele e use saquinhos nos olhos." }, contra: "Não use se tiver alergia a pólen." },
      "Cabelo": { nome: "Chá de Alecrim (Enxágue)", ingredientes: ["Ramos de alecrim"], preparo: { limpeza: "Lave o alecrim.", fogo: "Ferva por 10 minutos.", finalizacao: "Use no último enxágue do banho." }, contra: "Pode escurecer levemente cabelos claros." },
      "Pele Seca": { nome: "Chá de Calêndula com Mel", ingredientes: ["Flores de calêndula", "Mel"], preparo: { limpeza: "Lave as flores.", fogo: "Infusão de 10 minutos.", finalizacao: "Adoce e beba." }, contra: "Evite se for alérgico a mel." },
      "Detox Pele": { nome: "Chá de Salsaparrilha", ingredientes: ["Raiz de salsaparrilha"], preparo: { limpeza: "Lave a raiz.", fogo: "Ferva por 10 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Pode irritar o estômago." },
      "Manchas": { nome: "Chá de Amora", ingredientes: ["Folhas de amora"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba 2x ao dia." }, contra: "Geralmente seguro." },
      "Queimadura": { nome: "Chá de Erva-Moura (Uso Externo)", ingredientes: ["Folhas de erva-moura"], preparo: { limpeza: "Lave bem.", fogo: "Infusão.", finalizacao: "Use compressas frias." }, contra: "NUNCA beba. É tóxico se ingerido." },
      "Antioxidante": { nome: "Chá de Rooibos", ingredientes: ["Erva Rooibos"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão de 7 minutos.", finalizacao: "Beba puro ou com leite." }, contra: "Geralmente seguro, sem cafeína." }
    }
  },
  "Saúde Feminina": {
    icone: "🌸",
    subs: {
      "Cólica": { nome: "Artemísia", ingredientes: ["Erva Artemísia"], preparo: { limpeza: "Lave.", fogo: "Infusão.", finalizacao: "Abafe 10 min." }, contra: "Proibido na gravidez." },
      "Menopausa": { nome: "Amora", ingredientes: ["Folhas de Amora"], preparo: { limpeza: "Lave.", fogo: "Infusão.", finalizacao: "Beba 3x ao dia." }, contra: "Geralmente seguro." },
      "TPM Irritação": { nome: "Chá de Passiflora", ingredientes: ["Folhas de maracujá"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba à noite." }, contra: "Dá sono." },
      "Fluxo": { nome: "Chá de Algodoeiro", ingredientes: ["Folhas de algodoeiro"], preparo: { limpeza: "Lave as folhas.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 10 minutos." }, contra: "Evite se tiver pressão baixa." },
      "Candidíase": { nome: "Chá de Barbatimão (Banho de Assento)", ingredientes: ["Casca de barbatimão"], preparo: { limpeza: "Lave a casca.", fogo: "Ferva por 15 minutos.", finalizacao: "Use morno para banho local." }, contra: "NUNCA beba se estiver grávida." },
      "Libido": { nome: "Chá de Catuaba", ingredientes: ["Casca de catuaba"], preparo: { limpeza: "Lave a casca.", fogo: "Ferva por 10 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Pode causar insônia." },
      "Endometriose": { nome: "Chá de Unha-de-Gato com Uxi Amarelo", ingredientes: ["Unha-de-gato", "Uxi amarelo"], preparo: { limpeza: "Lave as cascas.", fogo: "Ferva por 15 minutos.", finalizacao: "Beba ao longo do dia." }, contra: "Consulte o ginecologista." },
      "Ovários": { nome: "Chá de Agoniada", ingredientes: ["Casca de agoniada"], preparo: { limpeza: "Lave a casca.", fogo: "Ferva por 10 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Pode causar diarreia." },
      "Inchaço TPM": { nome: "Chá de Cabelo de Milho", ingredientes: ["Cabelo de milho"], preparo: { limpeza: "Lave bem.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba 3x ao dia." }, contra: "Pode baixar o potássio." },
      "Pele TPM": { nome: "Chá de Prímula", ingredientes: ["Erva de prímula"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba regularmente." }, contra: "Pode causar náuseas." }
    }
  },
  "Esportes": {
    icone: "👟",
    subs: {
      "Pré-Treino": { nome: "Guaraná", ingredientes: ["Pó de Guaraná"], preparo: { limpeza: "Peneire.", fogo: "Misture na água.", finalizacao: "Beba imediatamente." }, contra: "Evite se tiver problemas cardíacos." },
      "Recuperação": { nome: "Cúrcuma", ingredientes: ["Raiz de Cúrcuma"], preparo: { limpeza: "Lave.", fogo: "Ferva 10 min.", finalizacao: "Beba morno." }, contra: "Geralmente seguro." },
      "Fadiga": { nome: "Chá de Tribulus Terrestris", ingredientes: ["Erva Tribulus"], preparo: { limpeza: "Lave a erva.", fogo: "Infusão de 10 minutos.", finalizacao: "Beba pela manhã." }, contra: "Pode alterar hormônios." },
      "Resistência": { nome: "Chá de Cordyceps", ingredientes: ["Cogumelo Cordyceps seco"], preparo: { limpeza: "Lave.", fogo: "Ferva por 15 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Consulte se tiver doenças autoimunes." },
      "Cãibras": { nome: "Chá de Banana (Casca)", ingredientes: ["Casca de 1 banana limpa"], preparo: { limpeza: "Lave muito bem com escovinha.", fogo: "Ferva a casca por 10 minutos.", finalizacao: "Beba a água rica em potássio." }, contra: "Seguro." },
      "Isotônico": { nome: "Chá de Hibisco com Sal e Mel", ingredientes: ["Hibisco", "Pitada de sal", "Mel"], preparo: { limpeza: "Lave o hibisco.", fogo: "Infusão.", finalizacao: "Gele e beba durante o treino." }, contra: "Cuidado com a pressão." },
      "Performance": { nome: "Chá de Beterraba", ingredientes: ["Fatias de beterraba"], preparo: { limpeza: "Lave e descasque.", fogo: "Ferva por 10 minutos.", finalizacao: "Beba o caldo roxo." }, contra: "Pode colorir a urina." },
      "Concentração": { nome: "Chá de Cacau", ingredientes: ["Nibs ou casca de cacau"], preparo: { limpeza: "Lave se for casca.", fogo: "Ferva por 5 minutos.", finalizacao: "Abafe por 10 minutos." }, contra: "Contém teobromina (estimulante)." },
      "Tendões": { nome: "Chá de Cavalinha com Bambu", ingredientes: ["Cavalinha", "Folhas de bambu"], preparo: { limpeza: "Lave as ervas.", fogo: "Infusão de 10 minutos.", finalizacao: "Rico em sílica para os tendões." }, contra: "Diurético forte." },
      "Vigor": { nome: "Chá de Marapuama", ingredientes: ["Casca de marapuama"], preparo: { limpeza: "Lave a casca.", fogo: "Ferva por 10 minutos.", finalizacao: "Abafe por 5 minutos." }, contra: "Pode causar palpitações." }
    }
  },
  "Saúde Infantil": {
    icone: "👶",
    subs: {
      "Cólica Bebê": { nome: "Erva Doce", ingredientes: ["Sementes de Erva Doce"], preparo: { limpeza: "Lave.", fogo: "Infusão leve.", finalizacao: "Beba morno." }, contra: "Consulte sempre o pediatra." },
      "Sono Infantil": { nome: "Camomila", ingredientes: ["Flores de Camomila"], preparo: { limpeza: "Lave.", fogo: "Infusão fraca.", finalizacao: "Beba antes de dormir." }, contra: "Consulte o pediatra." },
      "Resfriado": { nome: "Chá de Maçã com Mel", ingredientes: ["Pedaços de maçã", "Mel (apenas > 1 ano)"], preparo: { limpeza: "Lave a maçã.", fogo: "Ferva a maçã por 5 minutos.", finalizacao: "Adoce levemente." }, contra: "Mel é proibido para menores de 1 ano." },
      "Gases": { nome: "Chá de Funcho Suave", ingredientes: ["Poucas sementes de funcho"], preparo: { limpeza: "Lave as sementes.", fogo: "Infusão de 5 minutos.", finalizacao: "Dê em pequenas colheradas." }, contra: "Consulte o pediatra." },
      "Nervosismo": { nome: "Chá de Capim-Limão", ingredientes: ["Folhas de capim-limão"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão suave.", finalizacao: "Beba morno." }, contra: "Geralmente seguro." },
      "Apetite": { nome: "Chá de Funcho com Camomila", ingredientes: ["Funcho", "Camomila"], preparo: { limpeza: "Lave.", fogo: "Infusão.", finalizacao: "Ofereça 30 min antes da refeição." }, contra: "Consulte o pediatra." },
      "Imunidade": { nome: "Chá de Acerola (Fruta)", ingredientes: ["Acerolas frescas"], preparo: { limpeza: "Lave bem.", fogo: "Amasse na água morna.", finalizacao: "Não ferva para não perder Vit C." }, contra: "Seguro." },
      "Tosse": { nome: "Chá de Poejo", ingredientes: ["Folhas de poejo"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão suave.", finalizacao: "Abafe por 10 minutos." }, contra: "Use doses muito pequenas." },
      "Pele Irritada": { nome: "Banho de Calêndula", ingredientes: ["Flores de calêndula"], preparo: { limpeza: "Lave as flores.", fogo: "Infusão forte.", finalizacao: "Misture na água do banho." }, contra: "Teste em uma pequena área primeiro." },
      "Foco": { nome: "Chá de Melissa", ingredientes: ["Folhas de melissa"], preparo: { limpeza: "Lave as folhas.", fogo: "Infusão suave.", finalizacao: "Beba durante o dia." }, contra: "Geralmente seguro." }
    }
  }
};


type View = { type: 'home' } | { type: 'subs'; category: string } | { type: 'recipe'; category: string; sub: string };

export default function App() {
  const [view, setView] = useState<View>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return null;
    const results: { cat: string; sub: string; recipe: Recipe }[] = [];
    Object.entries(DATABASE).forEach(([catName, cat]) => {
      Object.entries(cat.subs).forEach(([subName, recipe]) => {
        if (
          subName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          catName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.nome.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ cat: catName, sub: subName, recipe });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const handleBack = () => {
    if (view.type === 'recipe') setView({ type: 'subs', category: view.category });
    else if (view.type === 'subs') setView({ type: 'home' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-12 px-6 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Leaf className="absolute -top-4 -left-4 w-32 h-32 rotate-12 text-emerald-300" />
          <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 -rotate-12 text-emerald-300" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
              <Sparkles className="text-emerald-300 w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">🌿 Guia Inteligente de Chás</h1>
          <p className="text-emerald-100/80 text-sm md:text-base font-medium">Edição Pedagógica: Aprenda a preparar sua cura natural</p>
        </motion.div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Search Bar */}
        {(view.type === 'home' || searchQuery.length >= 2) && (
          <div className="sticky top-4 z-20 mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="O que você está sentindo? Ex: azia, foco, inchaço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-stone-200 rounded-2xl py-4 pl-12 pr-4 shadow-xl shadow-stone-200/50 focus:outline-none focus:border-emerald-500 transition-all text-lg placeholder:text-stone-300"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <ArrowRight className="rotate-180" size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {searchQuery.length >= 2 ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold text-stone-700">O que encontramos:</h2>
                <button onClick={() => setSearchQuery('')} className="text-emerald-600 font-bold text-sm hover:underline">Limpar busca</button>
              </div>
              {searchResults?.map((res, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setView({ type: 'recipe', category: res.cat, sub: res.sub });
                    setSearchQuery('');
                  }}
                  className="w-full bg-white p-5 rounded-2xl border border-stone-200 flex items-center justify-between hover:border-emerald-500 hover:shadow-md transition-all group text-left"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full mb-1 inline-block">{res.cat}</span>
                    <h3 className="text-lg font-semibold text-stone-800">{res.sub}</h3>
                  </div>
                  <ArrowRight className="text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={20} />
                </button>
              ))}
              {searchResults?.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-200">
                  <Search className="mx-auto text-stone-200 mb-4" size={48} />
                  <p className="text-stone-500 font-medium">Nenhum chá encontrado para sua busca.</p>
                </div>
              )}
            </motion.div>
          ) : view.type === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {Object.entries(DATABASE).map(([name, cat]) => (
                <button
                  key={name}
                  onClick={() => setView({ type: 'subs', category: name })}
                  className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-4xl mb-3 group-hover:scale-110 group-hover:bg-emerald-50 transition-all border border-stone-100 group-hover:border-emerald-100">
                    {cat.icone}
                  </div>
                  <h3 className="font-bold text-stone-700 text-sm md:text-base">{name}</h3>
                </button>
              ))}
            </motion.div>
          ) : view.type === 'subs' ? (
            <motion.div
              key="subs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button onClick={handleBack} className="flex items-center gap-2 text-stone-500 hover:text-emerald-600 mb-6 transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Voltar ao início</span>
              </button>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <span>Início</span>
                  <ChevronRight size={12} />
                  <span>{view.category}</span>
                </div>
                <h2 className="text-3xl font-bold text-emerald-800">{view.category}</h2>
              </div>
              <div className="space-y-3">
                {Object.keys(DATABASE[view.category].subs).map(sub => (
                  <button
                    key={sub}
                    onClick={() => setView({ type: 'recipe', category: view.category, sub })}
                    className="w-full bg-white p-5 rounded-2xl border border-stone-200 flex items-center justify-between hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <span className="font-semibold text-stone-700">{sub}</span>
                    <ArrowRight className="text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={20} />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recipe"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden"
            >
              <div className="p-6 md:p-10">
                <button onClick={handleBack} className="flex items-center gap-2 text-stone-500 hover:text-emerald-600 mb-8 transition-colors group">
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold text-sm">Voltar</span>
                </button>
                
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                      <span>Início</span>
                      <ChevronRight size={10} />
                      <span>{view.category}</span>
                      <ChevronRight size={10} />
                      <span className="text-emerald-600">{view.sub}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">{DATABASE[view.category].subs[view.sub].nome}</h2>
                </div>

                <section className="mb-10">
                  <div className="flex items-center gap-3 text-stone-800 font-bold mb-5">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={18} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg">O que vamos usar:</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DATABASE[view.category].subs[view.sub].ingredientes.map((ing, i) => (
                      <div key={i} className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-100 text-stone-700 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        {ing}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-10">
                  <div className="flex items-center gap-3 text-stone-800 font-bold mb-6">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Flame size={18} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg">Passo a passo bem explicadinho:</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="relative pl-8 border-l-2 border-emerald-100 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                      <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Droplets size={14} /> 1. Como arrumar as coisas
                      </h4>
                      <p className="text-stone-700 text-sm leading-relaxed font-medium">{DATABASE[view.category].subs[view.sub].preparo.limpeza}</p>
                    </div>
                    <div className="relative pl-8 border-l-2 border-orange-100 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm" />
                      <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Flame size={14} /> 2. No fogão
                      </h4>
                      <p className="text-stone-700 text-sm leading-relaxed font-medium">{DATABASE[view.category].subs[view.sub].preparo.fogo}</p>
                    </div>
                    <div className="relative pl-8 border-l-2 border-sky-100">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-sm" />
                      <h4 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Clock size={14} /> 3. Hora de terminar
                      </h4>
                      <p className="text-stone-700 text-sm leading-relaxed font-medium">{DATABASE[view.category].subs[view.sub].preparo.finalizacao}</p>
                    </div>
                  </div>
                </section>

                <section className="bg-amber-50 p-8 rounded-3xl border-l-8 border-amber-400 shadow-inner">
                  <div className="flex items-center gap-3 text-amber-800 font-bold mb-3">
                    <AlertTriangle size={24} className="shrink-0" />
                    <h3 className="text-lg">📢 Atenção! Quem não deve tomar:</h3>
                  </div>
                  <p className="text-amber-900/80 text-sm leading-relaxed font-medium">
                    {DATABASE[view.category].subs[view.sub].contra}
                  </p>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-stone-200/50 px-4 py-2 rounded-full text-stone-500 text-xs font-bold uppercase tracking-widest">
          <span>🌿 Use com sabedoria</span>
          <span className="text-stone-300">•</span>
          <span>Consulte seu médico</span>
        </div>
      </footer>
    </div>
  );
}
