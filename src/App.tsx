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
interface ProtocolDay {
  dia: number;
  titulo: string;
  descricao: string;
}

interface Recipe {
  nome: string;
  ingredientes: string[];
  beneficios: string;
  preparo: {
    limpeza: string;
    fogo: string;
    finalizacao: string;
  };
  contra: string;
  protocolo?: ProtocolDay[];
}

interface Category {
  icone: string;
  subs: Record<string, Recipe>;
}

const DATABASE: Record<string, Category> = {
  "Emagrecimento": {
    icone: "🏃‍♀️",
    subs: {
      "Gordura Abdominal": { 
        nome: "Chá de Canela e Gengibre", 
        ingredientes: ["1 pau de canela", "2 fatias de gengibre", "300ml de água"], 
        beneficios: "Este chá combina o poder termogênico da canela com a ação anti-inflamatória do gengibre, ajudando a acelerar a queima de gordura na região da barriga e a melhorar a digestão.",
        preparo: { 
          limpeza: "Lave o gengibre em água corrente para remover qualquer resíduo de terra e corte duas fatias finas. Lave também o pau de canela para garantir que esteja livre de impurezas.", 
          fogo: "Coloque a água e a canela em uma panela pequena. Deixe ferver por cerca de 5 a 7 minutos para extrair bem o sabor. Em seguida, adicione as fatias de gengibre e mantenha em fogo baixo por mais 5 minutos.", 
          finalizacao: "Desligue o fogo, tampe o recipiente com um pratinho e deixe descansar por 5 a 10 minutos. Beba ainda morno, preferencialmente pela manhã ou antes das refeições." 
        }, 
        contra: "Evite o consumo se você sofre de hipertensão (pressão alta), gastrite severa ou úlceras, pois o gengibre e a canela podem irritar a mucosa gástrica." 
      },
      "Retenção de Líquidos": { 
        nome: "Chá de Cavalinha", 
        ingredientes: ["1 colher de sopa de cavalinha seca", "250ml de água filtrada"], 
        beneficios: "A cavalinha é um dos melhores diuréticos naturais, auxiliando na eliminação do excesso de líquidos e toxinas, além de ser rica em minerais que fortalecem unhas e cabelos.",
        preparo: { 
          limpeza: "Coloque a erva seca em uma peneira fina e passe rapidamente por água corrente para remover o pó acumulado durante o armazenamento.", 
          fogo: "Aqueça a água sozinha. Assim que começar a formar as primeiras bolinhas no fundo da panela (antes de ferver totalmente), desligue o fogo imediatamente.", 
          finalizacao: "Adicione a cavalinha na água quente, tampe o recipiente e deixe em infusão por exatos 10 minutos. Coe e beba ao longo do dia, mas evite tomar muito tarde para não atrapalhar o sono." 
        }, 
        contra: "Não é recomendado para pessoas com insuficiência renal ou cardíaca grave. O uso prolongado (mais de 2 semanas) deve ser evitado sem pausa." 
      },
      "Metabolismo Lento": { 
        nome: "Chá Verde e Limão", 
        ingredientes: ["1 colher de sobremesa de chá verde", "Suco de meio limão espremido na hora"], 
        beneficios: "O chá verde é rico em catequinas que estimulam o metabolismo, enquanto o limão fornece vitamina C e ajuda na alcalinização do sangue, potencializando a queima calórica.",
        preparo: { 
          limpeza: "Lave bem o limão antes de cortar. Se usar folhas frescas de chá verde, lave-as delicadamente em água fria.", 
          fogo: "Aqueça a água até atingir cerca de 80°C (quando começarem a subir pequenas bolinhas). É crucial não deixar a água ferver para não queimar as folhas e deixar o chá amargo.", 
          finalizacao: "Coloque o chá verde na água, tampe e aguarde apenas 3 minutos. Após coar, adicione o suco de limão fresco e beba imediatamente para aproveitar todos os nutrientes." 
        }, 
        contra: "Devido à cafeína, evite se tiver arritmia cardíaca, ansiedade ou insônia. Não consuma logo após as refeições, pois pode atrapalhar a absorção de ferro." 
      },
      "Compulsão por Doces": { 
        nome: "Chá de Casca de Maçã", 
        ingredientes: ["Cascas de 2 maçãs higienizadas", "1 pau de canela", "500ml de água"], 
        beneficios: "O aroma doce da maçã cozida com canela envia sinais de saciedade ao cérebro, ajudando a controlar o desejo por açúcar e proporcionando uma sensação de conforto.",
        preparo: { 
          limpeza: "Lave as maçãs muito bem, preferencialmente com uma escovinha. Use apenas as cascas, garantindo que não haja partes estragadas.", 
          fogo: "Ferva a água com o pau de canela por 5 minutos. Em seguida, adicione as cascas de maçã e deixe ferver por mais 2 a 3 minutos em fogo baixo.", 
          finalizacao: "Abafe o chá por 10 minutos antes de servir. O cheiro que se espalha pela casa é parte da terapia para acalmar a ansiedade por doces." 
        }, 
        contra: "Geralmente seguro para todos. Pessoas com hipertensão devem limitar o consumo devido à canela (máximo de 2 xícaras por dia)." 
      },
      "Inchaço Abdominal": { 
        nome: "Chá de Hibisco com Cavalinha", 
        ingredientes: ["1 colher de chá de flores de hibisco", "1 colher de chá de cavalinha"], 
        beneficios: "Esta dupla poderosa combate o inchaço de forma rápida, melhorando a circulação e ajudando na digestão de gorduras, além de ter um sabor refrescante.",
        preparo: { 
          limpeza: "Passe as ervas secas rapidamente por água corrente em uma peneira para remover poeira.", 
          fogo: "Ferva 500ml de água. Assim que atingir a ebulição, desligue o fogo.", 
          finalizacao: "Adicione o hibisco e a cavalinha, tampe e deixe descansar por 10 a 15 minutos. Coe e beba preferencialmente entre as refeições principais." 
        }, 
        contra: "Pode causar queda de pressão em pessoas sensíveis. Contraindicado para gestantes e mulheres que desejam engravidar, pois pode interferir nos níveis de estrogênio." 
      },
      "Gordura no Fígado": { 
        nome: "Chá de Boldo", 
        ingredientes: ["2 folhas grandes de boldo do Chile ou boldo brasileiro", "200ml de água"], 
        beneficios: "O boldo estimula a produção de bile e ajuda o fígado a processar melhor as gorduras e toxinas, sendo um excelente aliado após excessos alimentares.",
        preparo: { 
          limpeza: "Lave as folhas frescas cuidadosamente em água corrente para remover impurezas.", 
          fogo: "Ferva a água e, assim que desligar o fogo, prepare-se para a infusão.", 
          finalizacao: "Amasse levemente as folhas com as mãos ou uma colher e coloque na água quente. Abafe por 5 a 8 minutos. Beba morno e sem adoçar para não perder as propriedades medicinais." 
        }, 
        contra: "Não deve ser utilizado por gestantes ou pessoas com obstrução das vias biliares. O uso contínuo por mais de 10 dias não é recomendado." 
      },
      "Fome Noturna": { 
        nome: "Chá de Melissa com Maracujá", 
        ingredientes: ["1 colher de sopa de folhas de melissa", "Polpa de 1 maracujá pequeno"], 
        beneficios: "Ajuda a acalmar o sistema nervoso e a reduzir a ansiedade que muitas vezes se manifesta como fome emocional durante a noite.",
        preparo: { 
          limpeza: "Lave bem as folhas de melissa e o exterior do maracujá antes de abrir.", 
          fogo: "Ferva a água com a polpa do maracujá (com sementes) por cerca de 3 minutos para liberar os ativos.", 
          finalizacao: "Desligue o fogo, adicione as folhas de melissa, tampe e deixe em infusão por 10 minutos. Coe e beba cerca de 1 hora antes de dormir." 
        }, 
        contra: "Pode causar sonolência acentuada. Evite se precisar dirigir ou operar máquinas pesadas após o consumo." 
      },
      "Celulite": { 
        nome: "Chá de Centelha Asiática", 
        ingredientes: ["1 colher de sopa de centelha asiática seca", "300ml de água"], 
        beneficios: "Melhora a microcirculação e estimula a produção de colágeno, ajudando a reduzir o aspecto da celulite e a fortalecer os tecidos da pele.",
        preparo: { 
          limpeza: "Lave a erva seca rapidamente em uma peneira.", 
          fogo: "Aqueça a água até ferver e desligue.", 
          finalizacao: "Adicione a centelha, tampe e deixe em infusão por 10 minutos. O consumo regular (2x ao dia) apresenta melhores resultados a longo prazo." 
        }, 
        contra: "Pode causar sensibilidade gástrica em algumas pessoas. Não recomendado para quem tem problemas hepáticos graves." 
      },
      "Detox Hepático": { 
        nome: "Chá de Dente-de-Leão", 
        ingredientes: ["1 colher de sopa de raiz de dente-de-leão picada", "250ml de água"], 
        beneficios: "Atua como um tônico para o fígado e rins, auxiliando na filtragem do sangue e na eliminação de resíduos metabólicos acumulados.",
        preparo: { 
          limpeza: "Lave muito bem os pedaços da raiz para garantir que não haja resquícios de terra.", 
          fogo: "Como é uma raiz, deve ser feita por decocção: coloque a raiz na água fria e leve ao fogo baixo. Deixe ferver por 10 minutos.", 
          finalizacao: "Desligue o fogo, tampe e deixe descansar por mais 5 minutos antes de coar e beber." 
        }, 
        contra: "Contraindicado para pessoas com cálculos biliares ou inflamação da vesícula. Pode interagir com medicamentos diuréticos." 
      },
      "Redução de Medidas": { 
        nome: "Chá de Carqueja", 
        ingredientes: ["1 colher de sopa de carqueja picada", "250ml de água"], 
        beneficios: "Apesar do sabor amargo, a carqueja é excelente para o controle glicêmico e para auxiliar o corpo na queima de gordura estocada.",
        preparo: { 
          limpeza: "Lave a erva rapidamente em água corrente.", 
          fogo: "Ferva a água e desligue o fogo.", 
          finalizacao: "Adicione a carqueja, tampe e deixe descansar por 10 minutos. Dica: beba gelado com um pouco de hortelã para suavizar o sabor amargo." 
        }, 
        contra: "Pode reduzir drasticamente os níveis de açúcar no sangue; diabéticos devem monitorar a glicemia. Não recomendado para gestantes." 
      },
      "Ansiedade Alimentar": { 
        nome: "Chá de Maracujá com Maçã", 
        ingredientes: ["Folhas de maracujá", "Casca de 1 maçã", "1 pau de canela"], 
        beneficios: "Acalma o sistema nervoso e reduz a vontade de comer por ansiedade, proporcionando conforto emocional.",
        preparo: { 
          limpeza: "Lave bem as folhas e as cascas.", 
          fogo: "Ferva a maçã e a canela por 5 minutos.", 
          finalizacao: "Adicione as folhas de maracujá, abafe por 10 minutos e beba morno." 
        }, 
        contra: "Pode causar sonolência. Evite antes de dirigir." 
      },
      "Gordura Localizada": { 
        nome: "Chá de Salsaparrilha", 
        ingredientes: ["1 colher de sopa de raiz de salsaparrilha", "250ml de água"], 
        beneficios: "Ajuda na mobilização de gorduras estocadas e na eliminação de toxinas que favorecem o acúmulo de gordura.",
        preparo: { 
          limpeza: "Lave bem a raiz.", 
          fogo: "Ferva por 10 minutos (decocção).", 
          finalizacao: "Abafe por 5 minutos e coe. Beba 2 vezes ao dia." 
        }, 
        contra: "Pode irritar o estômago em pessoas sensíveis." 
      },
      "Desejo por Salgados": { 
        nome: "Chá de Alcaçuz", 
        ingredientes: ["1 colher de chá de raiz de alcaçuz", "250ml de água"], 
        beneficios: "O alcaçuz ajuda a equilibrar as glândulas adrenais, reduzindo o desejo por alimentos salgados e processados.",
        preparo: { 
          limpeza: "Lave a raiz rapidamente.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. Tem um sabor naturalmente doce e persistente." 
        }, 
        contra: "NÃO recomendado para hipertensos, pois pode elevar a pressão arterial." 
      },
      "Inchaço Pós-Festa": { 
        nome: "Chá de Dente-de-Leão com Limão", 
        ingredientes: ["1 colher de dente-de-leão", "Suco de meio limão"], 
        beneficios: "Excelente para 'limpar' o organismo após excessos de álcool ou comida pesada, reduzindo o inchaço rapidamente.",
        preparo: { 
          limpeza: "Lave a erva.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe a erva por 10 minutos, coe e adicione o limão no final." 
        }, 
        contra: "Evite se tiver cálculos biliares." 
      },
      "Queima Noturna": { 
        nome: "Chá de Camomila com Canela", 
        ingredientes: ["1 colher de camomila", "1 pedaço pequeno de canela"], 
        beneficios: "Ajuda a manter o metabolismo ativo durante o sono sem interferir na qualidade do descanso.",
        preparo: { 
          limpeza: "Lave a canela.", 
          fogo: "Ferva a canela por 3 minutos.", 
          finalizacao: "Adicione a camomila, abafe por 5 minutos e beba antes de deitar." 
        }, 
        contra: "Geralmente seguro. Evite se tiver alergia a camomila." 
      },
      "Saciedade": { 
        nome: "Chá de Psyllium (Infusão)", 
        ingredientes: ["1 colher de chá de cascas de psyllium", "200ml de água morna"], 
        beneficios: "As fibras do psyllium expandem no estômago, criando uma sensação de saciedade prolongada.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Aqueça a água até ficar morna.", 
          finalizacao: "Misture o psyllium e beba imediatamente antes que vire gel. Beba muita água depois." 
        }, 
        contra: "Beba muita água ao longo do dia para evitar constipação." 
      },
      "Detox Açúcar": { 
        nome: "Chá de Gymnema Sylvestre", 
        ingredientes: ["1 colher de chá de folhas de Gymnema", "250ml de água"], 
        beneficios: "Conhecida como 'destruidora de açúcar', ajuda a reduzir a percepção do sabor doce e a vontade de comer doces.",
        preparo: { 
          limpeza: "Lave as folhas secas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba 30 minutos antes de refeições onde costuma comer doces." 
        }, 
        contra: "Diabéticos devem monitorar a glicemia de perto." 
      },
      "Gordura no Sangue": { 
        nome: "Chá de Berinjela", 
        ingredientes: ["3 rodelas de berinjela", "500ml de água"], 
        beneficios: "Ajuda a reduzir os níveis de colesterol e triglicerídeos, auxiliando na saúde cardiovascular.",
        preparo: { 
          limpeza: "Lave bem a berinjela.", 
          fogo: "Ferva as rodelas por 10 minutos.", 
          finalizacao: "Deixe esfriar e beba ao longo do dia. Pode adicionar limão para melhorar o sabor." 
        }, 
        contra: "Geralmente seguro. Pode ter efeito diurético." 
      },
      "Glicemia": { 
        nome: "Chá de Pata-de-Vaca", 
        ingredientes: ["2 folhas de pata-de-vaca", "250ml de água"], 
        beneficios: "Auxilia no controle dos níveis de açúcar no sangue, sendo um ótimo complemento para quem busca emagrecer com saúde.",
        preparo: { 
          limpeza: "Lave bem as folhas.", 
          fogo: "Ferva as folhas por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Não substitui medicamentos para diabetes. Consulte seu médico." 
      },
      "Efeito Sanfona": { 
        nome: "Chá de Spirulina (Infusão)", 
        ingredientes: ["1 colher de chá de spirulina em pó", "200ml de água"], 
        beneficios: "Rica em nutrientes, ajuda a manter o corpo nutrido durante dietas, evitando a fome rebote e o efeito sanfona.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Use água em temperatura ambiente ou morna.", 
          finalizacao: "Misture bem e beba. O sabor é forte, pode misturar com suco de laranja." 
        }, 
        contra: "Pessoas com fenilcetonúria devem evitar." 
      },
      "Compulsão Noturna": { 
        nome: "Chá de Alface (Talos)", 
        ingredientes: ["3 talos de alface", "200ml de água"], 
        beneficios: "Contém lactucina, que acalma o sistema nervoso e reduz a fome emocional que surge à noite.",
        preparo: { 
          limpeza: "Lave bem os talos.", 
          fogo: "Ferva os talos por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos e beba morno antes de dormir." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Metabolismo Estagnado": { 
        nome: "Chá de Pimenta Caiena com Mel", 
        ingredientes: ["Uma pitada de pimenta caiena", "1 colher de mel", "250ml de água"], 
        beneficios: "A capsaicina da pimenta eleva a temperatura corporal, forçando o metabolismo a queimar mais calorias.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione a pimenta e o mel, misture bem e beba ainda quente." 
        }, 
        contra: "Evite se tiver gastrite ou hemorroidas." 
      },
      "Retenção Pós-Treino": { 
        nome: "Chá de Melancia (Casca Branca)", 
        ingredientes: ["Pedaços da parte branca da melancia", "300ml de água"], 
        beneficios: "Rico em citrulina, ajuda a eliminar o excesso de líquidos e toxinas após exercícios intensos.",
        preparo: { 
          limpeza: "Lave bem a casca da melancia.", 
          fogo: "Ferva os pedaços por 10 minutos.", 
          finalizacao: "Deixe esfriar e beba como um refresco diurético." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Detox de Metais Pesados": { 
        nome: "Chá de Coentro com Chlorella", 
        ingredientes: ["Punhado de coentro fresco", "1 colher de chlorella em pó"], 
        beneficios: "O coentro ajuda a mobilizar metais pesados dos tecidos e a chlorella ajuda a eliminá-los do corpo.",
        preparo: { 
          limpeza: "Lave bem o coentro.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione o coentro, abafe por 10 min. Depois de coado, misture a chlorella." 
        }, 
        contra: "Pode causar sintomas de detox (dor de cabeça leve) nos primeiros dias." 
      },
      "Queima de Gordura Visceral": { 
        nome: "Chá de Pu-erh (Chá Vermelho)", 
        ingredientes: ["1 colher de chá de Pu-erh fermentado"], 
        beneficios: "Conhecido como 'devorador de gordura', atua especificamente na gordura que envolve os órgãos.",
        preparo: { 
          limpeza: "Lave as folhas rapidamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 5 minutos. Beba 30 minutos após o almoço." 
        }, 
        contra: "Contém cafeína. Evite se tiver insônia." 
      },
      "Controle de Cortisol": { 
        nome: "Chá de Manjericão Sagrado (Tulsi)", 
        ingredientes: ["1 colher de sopa de Tulsi"], 
        beneficios: "Ajuda a equilibrar o hormônio do estresse, que é o principal responsável pelo acúmulo de gordura abdominal.",
        preparo: { 
          limpeza: "Lave bem as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba ao final do dia." 
        }, 
        contra: "Pode baixar o açúcar no sangue." 
      },
      "Saciedade Prolongada": { 
        nome: "Chá de Psyllium (Infusão Fria)", 
        ingredientes: ["1 colher de sopa de casca de psyllium", "300ml de chá de camomila frio"], 
        beneficios: "As fibras do psyllium expandem no estômago, criando uma sensação de saciedade que dura horas.",
        preparo: { 
          limpeza: "Prepare o chá de camomila e deixe esfriar.", 
          fogo: "Não ferva o psyllium.", 
          finalizacao: "Misture o psyllium no chá frio e beba IMEDIATAMENTE antes que vire gel." 
        }, 
        contra: "Beba MUITA água ao longo do dia para evitar constipação." 
      },
      "Redução de Medidas Abdominais": { 
        nome: "Chá de Casca de Laranja com Canela", 
        ingredientes: ["Casca de 1 laranja orgânica", "1 pau de canela"], 
        beneficios: "A casca de laranja contém sinefrina, que ajuda na quebra de gordura, e a canela controla a insulina.",
        preparo: { 
          limpeza: "Lave muito bem a casca da laranja.", 
          fogo: "Ferva a casca e a canela por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e beba morno." 
        }, 
        contra: "Evite se for hipertenso." 
      },
      "Termogênico Matinal": { 
        nome: "Chá de Matchá com Limão", 
        ingredientes: ["1 colher de chá de matchá", "Suco de meio limão"], 
        beneficios: "Energia pura e queima calórica acelerada logo no início do dia.",
        preparo: { 
          limpeza: "Peneire o matchá.", 
          fogo: "Aqueça a água sem ferver (80°C).", 
          finalizacao: "Bata o matchá na água com um batedor, adicione o limão e beba." 
        }, 
        contra: "Contém muita cafeína. Não beba em jejum se tiver estômago sensível." 
      },
      "Equilíbrio da Tireoide": { 
        nome: "Chá de Alga Fucus", 
        ingredientes: ["1 colher de chá de alga fucus seca"], 
        beneficios: "Rica em iodo natural, ajuda a estimular a tireoide preguiçosa, combatendo o ganho de peso.",
        preparo: { 
          limpeza: "Lave a alga rapidamente.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. O sabor é bem marinho." 
        }, 
        contra: "PROIBIDO para quem tem hipertireoidismo ou doenças autoimunes da tireoide." 
      },
      "Redução de Gordura Visceral": {
        nome: "Chá de Garcinia Cambogia",
        ingredientes: ["1 colher de chá de casca de Garcinia", "250ml de água"],
        beneficios: "Ajuda a bloquear a síntese de gordura e reduz o acúmulo de gordura visceral.",
        preparo: {
          limpeza: "Lave a casca seca.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba 30 min antes do almoço."
        },
        contra: "Não recomendado para diabéticos sem orientação médica."
      },
      "Bloqueador de Açúcar": {
        nome: "Chá de Gymnema Sylvestre",
        ingredientes: ["1 colher de chá de folhas de Gymnema", "200ml de água"],
        beneficios: "Reduz a percepção do sabor doce e ajuda a controlar os níveis de açúcar no sangue.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione as folhas, abafe por 5 minutos e beba após as refeições."
        },
        contra: "Pode interagir com medicamentos para diabetes."
      },
      "Queima Termogênica Intensa": {
        nome: "Chá de Casca de Laranja Amarga (Citrus Aurantium)",
        ingredientes: ["1 colher de sopa de cascas secas", "300ml de água"],
        beneficios: "Rico em sinefrina, que aumenta o gasto energético e a queima de gordura.",
        preparo: {
          limpeza: "Lave bem as cascas.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Evite se tiver problemas cardíacos ou pressão alta."
      },
      "Energia e Saciedade": {
        nome: "Chá de Erva-Mate com Limão",
        ingredientes: ["1 colher de sopa de erva-mate", "Suco de meio limão", "250ml de água"],
        beneficios: "Aumenta a saciedade e fornece energia para o dia a dia, auxiliando no emagrecimento.",
        preparo: {
          limpeza: "Peneire a erva-mate.",
          fogo: "Aqueça a água até quase ferver (80°C).",
          finalizacao: "Adicione a erva, abafe por 5 min, coe e adicione o limão."
        },
        contra: "Pode causar insônia se tomado à noite."
      },
      "Metabolismo Hepático": {
        nome: "Chá de Boldo-do-Chile",
        ingredientes: ["1 colher de chá de folhas de boldo", "200ml de água"],
        beneficios: "Melhora a digestão de gorduras e auxilia o fígado no processo de emagrecimento.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione as folhas, abafe por 10 minutos e beba morno."
        },
        contra: "Evite se tiver obstrução das vias biliares ou gravidez."
      },
      "Drenagem Linfática Natural": {
        nome: "Chá de Dente-de-Leão com Gengibre",
        ingredientes: ["1 colher de sopa de dente-de-leão", "1 rodela de gengibre", "300ml de água"],
        beneficios: "Poderoso diurético que ajuda a eliminar toxinas e reduzir o inchaço.",
        preparo: {
          limpeza: "Lave bem a raiz e as folhas.",
          fogo: "Ferva o gengibre por 5 min, adicione o dente-de-leão e ferva por mais 2 min.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver cálculos biliares."
      },
      "Eliminação de Gordura": {
        nome: "Chá de Alcachofra",
        ingredientes: ["1 colher de sopa de folhas de alcachofra", "250ml de água"],
        beneficios: "Estimula a produção de bile, facilitando a queima de gorduras ingeridas.",
        preparo: {
          limpeza: "Lave as folhas secas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba antes das refeições."
        },
        contra: "Sabor muito amargo, pode causar desconforto gástrico em sensíveis."
      },
      "Digestão Termogênica": {
        nome: "Chá de Funcho com Canela",
        ingredientes: ["1 colher de chá de sementes de funcho", "1 pau de canela", "200ml de água"],
        beneficios: "Combate o inchaço abdominal e acelera levemente o metabolismo.",
        preparo: {
          limpeza: "Lave a canela e o funcho.",
          fogo: "Ferva a canela por 5 min, adicione o funcho e desligue.",
          finalizacao: "Abafe por 10 minutos e beba após o almoço."
        },
        contra: "Geralmente seguro, mas evite canela em excesso na gravidez."
      },
      "Antioxidante de Emagrecimento": {
        nome: "Chá de Casca de Romã",
        ingredientes: ["1 colher de sopa de cascas de romã secas", "300ml de água"],
        beneficios: "Rico em polifenóis que ajudam a reduzir a inflamação e o peso corporal.",
        preparo: {
          limpeza: "Lave bem as cascas.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Pode causar náuseas se tomado em jejum por pessoas sensíveis."
      },
      "Equilíbrio Glicêmico": {
        nome: "Chá de Folha de Amora",
        ingredientes: ["1 colher de sopa de folhas de amora", "250ml de água"],
        beneficios: "Ajuda a controlar os picos de insulina, reduzindo o acúmulo de gordura abdominal.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione as folhas, abafe por 10 minutos e beba ao longo do dia."
        },
        contra: "Geralmente seguro."
      },
      "Controle de Insulina": {
        nome: "Chá de Canela com Maçã",
        ingredientes: ["1 pau de canela", "Casca de 1 maçã", "300ml de água"],
        beneficios: "Melhora a sensibilidade à insulina, ajudando a evitar o acúmulo de gordura.",
        preparo: {
          limpeza: "Lave bem a maçã e a canela.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e beba morno."
        },
        contra: "Evite se for hipertenso."
      },
      "Redução de Apetite Emocional": {
        nome: "Chá de Passiflora com Melissa",
        ingredientes: ["1 colher de passiflora", "1 colher de melissa", "250ml de água"],
        beneficios: "Acalma a ansiedade que leva à compulsão alimentar.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba entre as refeições."
        },
        contra: "Pode causar sonolência."
      },
      "Detox Intestinal": {
        nome: "Chá de Cáscara Sagrada",
        ingredientes: ["1 colher de chá de cáscara sagrada", "200ml de água"],
        beneficios: "Estimula o funcionamento do intestino, auxiliando na desintoxicação.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba à noite."
        },
        contra: "Não use por mais de 7 dias seguidos."
      },
      "Queima de Gordura Pós-Almoço": {
        nome: "Chá de Alecrim com Limão",
        ingredientes: ["1 raminho de alecrim", "Suco de meio limão", "250ml de água"],
        beneficios: "Ajuda na digestão e acelera o metabolismo após a refeição.",
        preparo: {
          limpeza: "Lave o alecrim.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe o alecrim por 10 min, coe e adicione o limão."
        },
        contra: "Evite se tiver pressão alta."
      },
      "Aceleração Metabólica Noturna": {
        nome: "Chá de Gengibre com Camomila",
        ingredientes: ["1 rodela de gengibre", "1 colher de camomila", "250ml de água"],
        beneficios: "Mantém o metabolismo ativo sem prejudicar o sono.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o gengibre por 5 minutos.",
          finalizacao: "Adicione a camomila, abafe por 5 minutos e beba."
        },
        contra: "Geralmente seguro."
      },
      "Redução de Inchaço Menstrual": {
        nome: "Chá de Folha de Framboesa",
        ingredientes: ["1 colher de folhas de framboesa", "250ml de água"],
        beneficios: "Ajuda a reduzir a retenção de líquidos e o inchaço durante o ciclo.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Consulte se estiver grávida."
      },
      "Controle de Grelina": {
        nome: "Chá de Yerba Mate",
        ingredientes: ["1 colher de erva-mate", "250ml de água"],
        beneficios: "Ajuda a suprimir o hormônio da fome, aumentando a saciedade.",
        preparo: {
          limpeza: "Peneire a erva.",
          fogo: "Aqueça a água a 80°C.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Contém cafeína."
      },
      "Queima de Gordura em Repouso": {
        nome: "Chá de Oolong",
        ingredientes: ["1 colher de chá de folhas de Oolong", "200ml de água"],
        beneficios: "Estimula a oxidação de gorduras mesmo em períodos de descanso.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Aqueça a água sem ferver.",
          finalizacao: "Abafe por 5 minutos e beba."
        },
        contra: "Contém cafeína."
      },
      "Detox de Carboidratos": {
        nome: "Chá de Feijão Branco (Faseolamina)",
        ingredientes: ["1 colher de farinha de feijão branco ou vagens", "250ml de água"],
        beneficios: "Ajuda a reduzir a absorção de carboidratos das refeições.",
        preparo: {
          limpeza: "Lave as vagens.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e beba antes das refeições."
        },
        contra: "Pode causar gases."
      },
      "Equilíbrio da Leptina": {
        nome: "Chá de Rooibos com Baunilha",
        ingredientes: ["1 colher de rooibos", "Essência natural de baunilha", "200ml de água"],
        beneficios: "Ajuda a regular os sinais de saciedade no cérebro.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e adicione a baunilha."
        },
        contra: "Geralmente seguro."
      },
      "Gordura nas Coxas": {
        nome: "Chá de Castanha-da-Índia com Centelha",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Melhora a circulação nas pernas e ajuda a reduzir a gordura e a celulite localizada nas coxas.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver problemas renais ou hepáticos."
      },
      "Retenção de Sódio": {
        nome: "Chá de Salsinha com Limão",
        ingredientes: ["Um punhado de salsinha", "Meio limão", "250ml de água"],
        beneficios: "Poderoso diurético que ajuda a eliminar o excesso de sódio e reduzir o inchaço facial e corporal.",
        preparo: {
          limpeza: "Lave bem a salsinha.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a salsinha, abafe por 10 min, coe e adicione o limão."
        },
        contra: "Evite se tiver pedras nos rins de oxalato."
      },
      "Compulsão por Massas": {
        nome: "Chá de Feijão Branco com Canela",
        ingredientes: ["1 colher de farinha de feijão branco", "1 pau de canela", "200ml de água"],
        beneficios: "A faseolamina do feijão reduz a absorção de amido e a canela controla o desejo por carboidratos.",
        preparo: {
          limpeza: "Lave a canela.",
          fogo: "Ferva a canela por 5 min.",
          finalizacao: "Misture a farinha de feijão branco e beba antes de comer massas."
        },
        contra: "Pode causar gases intestinais."
      },
      "Metabolismo Pós-Menopausa": {
        nome: "Chá de Amora com Gengibre",
        ingredientes: ["Folhas de amora", "1 rodela de gengibre", "250ml de água"],
        beneficios: "Ajuda a equilibrar os hormônios e acelerar o metabolismo que tende a ficar lento após a menopausa.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o gengibre por 5 min.",
          finalizacao: "Adicione as folhas de amora, abafe por 10 min e coe."
        },
        contra: "Geralmente seguro."
      },
      "Queima de Gordura Matinal": {
        nome: "Chá de Café Verde",
        ingredientes: ["1 colher de chá de grãos de café verde moídos", "200ml de água"],
        beneficios: "Rico em ácido clorogênico, que impede a absorção de gordura e estimula a queima logo cedo.",
        preparo: {
          limpeza: "Use grãos moídos puros.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe. Beba em jejum."
        },
        contra: "Pode causar nervosismo ou palpitações."
      },
      "Detox de Laticínios": {
        nome: "Chá de Dente-de-Leão com Hortelã",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Ajuda o fígado e o intestino a processar melhor as gorduras e proteínas do leite.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver cálculos biliares."
      },
      "Sensibilidade Insulínica": {
        nome: "Chá de Pata-de-Vaca com Canela",
        ingredientes: ["2 folhas de pata-de-vaca", "1 pau de canela", "250ml de água"],
        beneficios: "Melhora a sensibilidade à insulina, evitando picos que levam ao acúmulo de gordura abdominal.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Diabéticos devem monitorar a glicemia."
      },
      "Saciedade de Fibras": {
        nome: "Chá de Sementes de Chia (Infusão Fria)",
        ingredientes: ["1 colher de sopa de chia", "300ml de água", "Hortelã"],
        beneficios: "As sementes formam um gel que ocupa espaço no estômago, reduzindo a fome por horas.",
        preparo: {
          limpeza: "Não precisa lavar.",
          fogo: "Não use fogo.",
          finalizacao: "Deixe a chia na água com hortelã por 30 min e beba a mistura gelatinosa."
        },
        contra: "Beba muita água para evitar constipação."
      },
      "Gordura no Pescoço": {
        nome: "Chá de Algas Marinhas (Fucus)",
        ingredientes: ["Meia colher de chá de fucus", "200ml de água"],
        beneficios: "O iodo natural ajuda a estimular a tireoide e a queima de gordura em regiões difíceis.",
        preparo: {
          limpeza: "Lave a alga.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "PROIBIDO para quem tem problemas de tireoide sem orientação médica."
      },
      "Equilíbrio de Adiponectina": {
        nome: "Chá de Framboesa (Folhas)",
        ingredientes: ["1 colher de sopa de folhas de framboesa", "250ml de água"],
        beneficios: "Estimula a produção de adiponectina, um hormônio que ajuda o corpo a queimar gordura.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se estiver grávida sem orientação."
      },
      "Gordura Visceral": {
        nome: "Chá de Casca de Pinheiro (Pycnogenol)",
        ingredientes: ["1 colher de chá de casca de pinheiro", "300ml de água"],
        beneficios: "Ajuda a reduzir a gordura que envolve os órgãos internos, melhorando a saúde metabólica.",
        preparo: {
          limpeza: "Lave bem a casca.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Pode interagir com medicamentos imunossupressores."
      },
      "Cortisol e Estresse": {
        nome: "Chá de Ashwagandha",
        ingredientes: ["1 colher de chá de raiz de ashwagandha", "250ml de água"],
        beneficios: "Reduz o estresse e os níveis de cortisol, evitando o acúmulo de gordura abdominal por estresse.",
        preparo: {
          limpeza: "Lave a raiz.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Evite se tiver doenças autoimunes."
      },
      "Termogênico de Inverno": {
        nome: "Chá de Pimenta-de-Caiena com Cacau",
        ingredientes: ["Pitada de pimenta-de-caiena", "1 colher de cacau puro", "250ml de água"],
        beneficios: "Aquece o corpo e acelera o metabolismo, ideal para dias frios quando o corpo gasta mais energia.",
        preparo: {
          limpeza: "Não precisa lavar.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Misture os ingredientes e beba quente."
        },
        contra: "Evite se tiver gastrite."
      },
      "Detox de Fim de Semana": {
        nome: "Chá de Alcachofra com Limão",
        ingredientes: ["1 folha de alcachofra", "Suco de meio limão", "300ml de água"],
        beneficios: "Limpeza profunda do fígado e rins após excessos alimentares.",
        preparo: {
          limpeza: "Lave a folha.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Adicione o limão no final e beba morno."
        },
        contra: "Evite se tiver obstrução biliar."
      },
      "Gordura nos Braços": {
        nome: "Chá de Bardana",
        ingredientes: ["1 colher de raiz de bardana", "250ml de água"],
        beneficios: "Ajuda na eliminação de toxinas e na redução de depósitos de gordura em áreas periféricas.",
        preparo: {
          limpeza: "Lave bem a raiz.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Pode causar reações alérgicas em pessoas sensíveis."
      },
      "Inibidor de Apetite": {
        nome: "Chá de Erva-Mate com Limão",
        ingredientes: ["1 colher de erva-mate", "Limão", "300ml de água"],
        beneficios: "Aumenta a saciedade e retarda o esvaziamento gástrico.",
        preparo: {
          limpeza: "Lave o limão.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 5 minutos e adicione o limão."
        },
        contra: "Evite se tiver insônia ou ansiedade."
      },
      "Queima Pós-Refeição": {
        nome: "Chá de Oolong",
        ingredientes: ["1 colher de chá de folhas de oolong", "250ml de água"],
        beneficios: "Ajuda o corpo a queimar gordura de forma mais eficiente logo após as refeições.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Aqueça a água a 90°C.",
          finalizacao: "Abafe por 3 a 5 minutos e coe."
        },
        contra: "Contém cafeína."
      },
      "Equilíbrio de Leptina": {
        nome: "Chá de Amora Branca",
        ingredientes: ["1 colher de folhas de amora branca", "250ml de água"],
        beneficios: "Ajuda a regular os sinais de fome e saciedade no cérebro.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Geralmente seguro."
      },
      "Detox de Metais": {
        nome: "Chá de Coentro com Limão",
        ingredientes: ["Punhado de coentro", "Limão", "300ml de água"],
        beneficios: "Ajuda a quelar metais pesados que podem estar travando o metabolismo.",
        preparo: {
          limpeza: "Lave bem o coentro.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe o coentro por 10 min e adicione o limão."
        },
        contra: "Geralmente seguro."
      },
      "Metabolismo Noturno": {
        nome: "Chá de Rooibos com Baunilha",
        ingredientes: ["1 colher de rooibos", "Essência de baunilha natural", "250ml de água"],
        beneficios: "Sem cafeína, ajuda a manter o metabolismo estável durante a noite.",
        preparo: {
          limpeza: "Não precisa lavar.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 7 minutos e adicione a baunilha."
        },
        contra: "Geralmente seguro."
      },
      "Protocolo: Detox e Emagrecimento": {
        nome: "7 dias para eliminar o inchaço e começar a emagrecer",
        ingredientes: ["Gengibre", "Limão", "Chá Verde", "Canela", "Hibisco", "Hortelã", "Dente-de-leão", "Cavalinha", "Erva-cidreira"],
        beneficios: "OBJETIVO: Drenar retenção, desinchar e ativar o metabolismo. META: Perder entre 1-3cm de medida em 7 dias.",
        preparo: {
          limpeza: "Siga o cronograma diário abaixo.",
          fogo: "Prepare as infusões conforme as instruções de cada erva.",
          finalizacao: "Mantenha a constância para melhores resultados."
        },
        protocolo: [
          { dia: 1, titulo: "Ativação", descricao: "Gengibre + Limão em jejum (quente)." },
          { dia: 2, titulo: "Drenagem", descricao: "Manhã: Chá Verde + Canela. Tarde: Hibisco gelado + Hortelã. Beba 2L de água." },
          { dia: 3, titulo: "Intensivo", descricao: "Manhã (Gengibre+Limão), Tarde (Hibisco+Canela), Noite (Dente-de-leão+Cavalinha). Reduza o sal." },
          { dia: 4, titulo: "Movimento", descricao: "10min de pulos ou caminhada + Hibisco + Cavalinha." },
          { dia: 5, titulo: "Limpeza", descricao: "Sem ultraprocessados. Lanches: Chá Verde gelado." },
          { dia: 6, titulo: "Estímulo", descricao: "Automassagem circular na barriga (5min) + Gengibre + Erva-cidreira quente." },
          { dia: 7, titulo: "Protocolo Completo", descricao: "Gengibre jejum + 2L água + Hibisco (suco) + Sem sal + Movimento + Automassagem + Chá drenante noite." }
        ],
        contra: "Hibisco e Cavalinha podem baixar a pressão. Evite se tiver problemas renais ou for gestante."
      }
    }
  },
  "Sono": {
    icone: "😴",
    subs: {
      "Insônia Inicial": { 
        nome: "Chá de Mulungu", 
        ingredientes: ["1 colher de sopa de cascas de Mulungu", "300ml de água"], 
        beneficios: "O mulungu é um sedativo natural potente, ideal para quem tem dificuldade em 'desligar' o cérebro e pegar no sono logo que deita.",
        preparo: { 
          limpeza: "Lave bem as cascas de madeira para remover qualquer poeira ou resíduo.", 
          fogo: "Coloque as cascas na água e ferva por cerca de 10 a 15 minutos (decocção) para extrair os princípios ativos da madeira.", 
          finalizacao: "Desligue o fogo, abafe por 5 minutos e coe. Beba cerca de 40 minutos antes de ir para a cama." 
        }, 
        contra: "Pode baixar a pressão arterial. Se você já tem pressão baixa ou toma medicamentos anti-hipertensivos, consulte um médico." 
      },
      "Ansiedade Noturna": { 
        nome: "Passiflora e Melissa", 
        ingredientes: ["1 colher de folhas de maracujá (passiflora)", "1 colher de melissa fresca ou seca"], 
        beneficios: "Combina o efeito calmante do maracujá com a suavidade da melissa, reduzindo palpitações e pensamentos ansiosos antes de dormir.",
        preparo: { 
          limpeza: "Lave bem as folhas, especialmente se forem colhidas diretamente do jardim.", 
          fogo: "Ferva a água separadamente e, assim que desligar, despeje sobre as ervas.", 
          finalizacao: "Tampe imediatamente para evitar que os óleos essenciais (o aroma) evaporem. Deixe em infusão por 12 a 15 minutos." 
        }, 
        contra: "Não deve ser consumido antes de dirigir ou operar máquinas, pois reduz os reflexos devido ao relaxamento profundo." 
      },
      "Sono Agitado": { 
        nome: "Camomila com Lavanda", 
        ingredientes: ["1 colher de flores de camomila", "1 colher de chá de flores de lavanda seca (própria para consumo)"], 
        beneficios: "A camomila relaxa os músculos enquanto a lavanda atua diretamente no sistema nervoso central, promovendo um sono mais profundo e sem interrupções.",
        preparo: { 
          limpeza: "Lave as flores secas rapidamente em uma peneira fina.", 
          fogo: "Aqueça a água até quase ferver e desligue.", 
          finalizacao: "Adicione as flores, tampe e deixe descansar por 10 minutos. O aroma liberado durante a infusão já ajuda a relaxar o cérebro." 
        }, 
        contra: "Pessoas com alergia a plantas da família das margaridas ou à lavanda devem evitar." 
      },
      "Mente Acelerada": { 
        nome: "Chá de Valeriana", 
        ingredientes: ["1 colher de chá de raiz de valeriana", "250ml de água"], 
        beneficios: "A valeriana é conhecida como o 'valium natural', sendo extremamente eficaz para silenciar o diálogo interno incessante que impede o sono.",
        preparo: { 
          limpeza: "Lave bem a raiz para remover resíduos de terra.", 
          fogo: "Ferva a água com a raiz por 5 minutos em fogo baixo.", 
          finalizacao: "Desligue, abafe por longos 15 minutos. Atenção: o cheiro da raiz é forte e característico, mas o efeito relaxante compensa." 
        }, 
        contra: "Não misture com bebidas alcoólicas ou outros medicamentos sedativos. Pode causar sonhos muito vívidos em algumas pessoas." 
      },
      "Bruxismo": { 
        nome: "Chá de Erva-Cidreira", 
        ingredientes: ["Um punhado de folhas frescas de erva-cidreira (Melissa officinalis)"], 
        beneficios: "Ajuda a relaxar a musculatura da face e da mandíbula, reduzindo a tensão que leva ao ranger de dentes durante a noite.",
        preparo: { 
          limpeza: "Lave as folhas em água corrente e seque-as levemente.", 
          fogo: "Ferva a água e desligue o fogo.", 
          finalizacao: "Rasgue as folhas com as mãos para liberar os óleos e coloque na água. Abafe por 10 minutos e beba morno." 
        }, 
        contra: "Geralmente seguro para todas as idades. Evite se tiver hipotireoidismo severo sem controle médico." 
      },
      "Pesadelos": { 
        nome: "Chá de Alecrim com Mel", 
        ingredientes: ["1 raminho pequeno de alecrim fresco", "1 colher de chá de mel"], 
        beneficios: "O alecrim ajuda a limpar a mente de energias pesadas e o mel fornece uma pequena dose de glicose que estabiliza o cérebro durante a noite.",
        preparo: { 
          limpeza: "Lave o raminho de alecrim cuidadosamente.", 
          fogo: "Faça uma infusão rápida: jogue a água fervente sobre o alecrim.", 
          finalizacao: "Deixe abafado por apenas 5 minutos (para não ficar muito forte). Coe, adicione o mel e beba mentalizando tranquilidade." 
        }, 
        contra: "Evite se tiver pressão arterial muito alta, pois o alecrim pode ter um leve efeito estimulante em algumas pessoas." 
      },
      "Acordar no Meio da Noite": { 
        nome: "Chá de Alface", 
        ingredientes: ["3 folhas grandes de alface (use o talo central)", "300ml de água"], 
        beneficios: "O talo da alface contém lactucina, uma substância com propriedades sedativas que ajudam a manter a continuidade do sono.",
        preparo: { 
          limpeza: "Lave muito bem as folhas e o talo em água corrente.", 
          fogo: "Ferva a água com as folhas picadas por 5 minutos.", 
          finalizacao: "Desligue, abafe por mais 5 minutos e beba morno. É um remédio caseiro antigo e muito eficaz." 
        }, 
        contra: "Seguro para quase todos. Pode ter um leve efeito diurético, então não beba em grandes quantidades se tiver bexiga sensível." 
      },
      "Estresse do Dia": { 
        nome: "Chá de Tília", 
        ingredientes: ["1 colher de sopa de flores de tília", "250ml de água"], 
        beneficios: "A tília é excelente para 'desarmar' o estresse acumulado no corpo, relaxando os vasos sanguíneos e acalmando o coração acelerado.",
        preparo: { 
          limpeza: "Lave as flores secas rapidamente.", 
          fogo: "Aqueça a água até ferver e desligue.", 
          finalizacao: "Adicione as flores, tampe e deixe em infusão por 10 minutos. Beba lentamente, aproveitando o momento de pausa." 
        }, 
        contra: "Pode causar sonolência. Pessoas com problemas cardíacos crônicos devem consultar um médico antes do uso frequente." 
      },
      "Higiene do Sono": { 
        nome: "Chá de Lúpulo", 
        ingredientes: ["1 colher de chá de flores de lúpulo", "200ml de água"], 
        beneficios: "O lúpulo ajuda a regular a temperatura corporal e prepara o sistema endócrino para a produção de melatonina.",
        preparo: { 
          limpeza: "Lave as flores secas em uma peneira.", 
          fogo: "Infusão simples: água fervente sobre as flores.", 
          finalizacao: "Deixe abafado por 8 a 10 minutos. O sabor é levemente amargo, mas o efeito no sono é muito positivo." 
        }, 
        contra: "Não recomendado para pessoas com depressão profunda ou histórico de tumores dependentes de estrogênio." 
      },
      "Cansaço Mental": { 
        nome: "Chá de Ashwagandha", 
        ingredientes: ["1 colher de chá de raiz de ashwagandha em pedaços ou pó", "250ml de água"], 
        beneficios: "Esta raiz adaptógena ajuda o corpo a lidar com o cortisol (hormônio do estresse), permitindo que a mente descanse de verdade.",
        preparo: { 
          limpeza: "Lave bem a raiz se estiver em pedaços.", 
          fogo: "Ferva a raiz na água por 10 minutos em fogo bem baixo.", 
          finalizacao: "Abafe por 5 minutos. Se usar em pó, basta misturar na água quente e deixar descansar por 5 minutos." 
        }, 
        contra: "Consulte um médico se tiver doenças autoimunes ou se estiver grávida. Pode interagir com medicamentos para tireoide." 
      },
      "Sono Interrompido": { 
        nome: "Chá de Erva-de-São-João", 
        ingredientes: ["1 colher de chá de hipérico", "250ml de água"], 
        beneficios: "Ajuda a estabilizar o ciclo do sono, evitando despertares frequentes durante a madrugada.",
        preparo: { 
          limpeza: "Lave a erva seca.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Use por períodos curtos." 
        }, 
        contra: "Interage com muitos medicamentos. Consulte um farmacêutico ou médico." 
      },
      "Terror Noturno": { 
        nome: "Chá de Flor de Laranjeira", 
        ingredientes: ["1 colher de sopa de flores de laranjeira", "200ml de água"], 
        beneficios: "Extremamente calmante, ajuda a reduzir pesadelos e agitação noturna intensa.",
        preparo: { 
          limpeza: "Lave as flores secas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. O aroma é muito relaxante." 
        }, 
        contra: "Geralmente seguro. Pode causar leve sonolência diurna se tomado em excesso." 
      },
      "Pernas Inquietas": { 
        nome: "Chá de Magnésio (Cloreto em Infusão)", 
        ingredientes: ["Uma pitada de cloreto de magnésio", "Chá de camomila"], 
        beneficios: "O magnésio ajuda no relaxamento muscular profundo, aliviando a síndrome das pernas inquietas.",
        preparo: { 
          limpeza: "Prepare o chá de camomila normalmente.", 
          fogo: "Ferva a água para a camomila.", 
          finalizacao: "Adicione o magnésio ao chá pronto e mexa até dissolver." 
        }, 
        contra: "Pode ter efeito laxante. Cuidado se tiver problemas renais." 
      },
      "Apneia Leve": { 
        nome: "Chá de Hortelã com Eucalipto", 
        ingredientes: ["Folhas de hortelã", "1 folha de eucalipto"], 
        beneficios: "Ajuda a abrir as vias respiratórias, facilitando a passagem do ar durante o sono.",
        preparo: { 
          limpeza: "Lave bem as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Inale o vapor antes de beber." 
        }, 
        contra: "Não substitui o uso de CPAP se indicado por médico." 
      },
      "Jet Lag": { 
        nome: "Chá de Melatonina Natural (Cereja)", 
        ingredientes: ["Punhado de cerejas secas ou frescas", "250ml de água"], 
        beneficios: "A cereja é uma das poucas fontes alimentares de melatonina, ajudando a ajustar o relógio biológico.",
        preparo: { 
          limpeza: "Lave as cerejas.", 
          fogo: "Ferva as cerejas por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos e beba no horário local de dormir do destino." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Turno da Noite": { 
        nome: "Chá de Manjericão", 
        ingredientes: ["Folhas de manjericão fresco"], 
        beneficios: "Ajuda o corpo a lidar com o estresse de trocar o dia pela noite, protegendo o sistema nervoso.",
        preparo: { 
          limpeza: "Lave bem as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba ao chegar em casa para relaxar." 
        }, 
        contra: "Evite se tiver pressão muito baixa." 
      },
      "Relaxamento Muscular": { 
        nome: "Chá de Erva-Cidreira com Lavanda", 
        ingredientes: ["Erva-cidreira", "Flores de lavanda"], 
        beneficios: "Combinação perfeita para relaxar os músculos tensionados pelo estresse do dia.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Tome um banho morno após beber." 
        }, 
        contra: "Pode causar sonolência profunda." 
      },
      "Mente Barulhenta": { 
        nome: "Chá de Lótus", 
        ingredientes: ["Pétalas de lótus secas"], 
        beneficios: "Usado milenarmente para acalmar pensamentos obsessivos e trazer paz mental antes de dormir.",
        preparo: { 
          limpeza: "Lave as pétalas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Pratique respiração profunda enquanto bebe." 
        }, 
        contra: "Raro de encontrar, certifique-se da procedência." 
      },
      "Despertar Precoce": { 
        nome: "Chá de Aveia", 
        ingredientes: ["2 colheres de sopa de aveia em flocos", "300ml de água"], 
        beneficios: "A aveia contém substâncias que ajudam a manter o sono por mais tempo, evitando acordar antes da hora.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Ferva a aveia na água por 5 minutos.", 
          finalizacao: "Coe e beba o líquido morno antes de deitar." 
        }, 
        contra: "Contém glúten (a menos que seja aveia certificada sem glúten)." 
      },
      "Qualidade REM": { 
        nome: "Chá de Mugwort (Artemísia Vulgaris)", 
        ingredientes: ["Meia colher de chá de Mugwort"], 
        beneficios: "Conhecida por intensificar os sonhos e melhorar a qualidade da fase REM do sono.",
        preparo: { 
          limpeza: "Lave a erva seca.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Use apenas ocasionalmente." 
        }, 
        contra: "PROIBIDO para gestantes (é abortivo)." 
      },
      "Sono Polifásico (Ajuste)": { 
        nome: "Chá de Guayusa (Uso Diurno)", 
        ingredientes: ["1 colher de chá de folhas de Guayusa"], 
        beneficios: "Ajuda a manter o foco durante o dia sem a ansiedade do café, facilitando o ajuste de horários de sono.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba apenas durante o dia." 
        }, 
        contra: "Contém cafeína, não beba à noite." 
      },
      "Despertar com Cansaço": { 
        nome: "Chá de Ginseng Siberiano (Eleuthero)", 
        ingredientes: ["1 colher de raiz de Eleuthero"], 
        beneficios: "Melhora a qualidade do sono profundo, fazendo com que você acorde sentindo-se realmente descansado.",
        preparo: { 
          limpeza: "Lave bem a raiz.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Abafe por 5 minutos. Use por 3 semanas e pare 1." 
        }, 
        contra: "Evite se tiver pressão alta severa." 
      },
      "Tensão Mandibular": { 
        nome: "Chá de Kava-Kava", 
        ingredientes: ["1 colher de raiz de Kava-Kava"], 
        beneficios: "Relaxante muscular potente, excelente para quem sofre de bruxismo e tensão na mandíbula.",
        preparo: { 
          limpeza: "Lave a raiz.", 
          fogo: "Não ferva! Use água morna.", 
          finalizacao: "Deixe em infusão por 20 minutos. O sabor é amargo e anestesia a boca levemente." 
        }, 
        contra: "Pode afetar o fígado se usado em excesso. Não misture com álcool." 
      },
      "Sonambulismo Leve": { 
        nome: "Chá de Skullcap (Escutelária)", 
        ingredientes: ["1 colher de chá de Skullcap"], 
        beneficios: "Acalma o sistema nervoso central e ajuda a manter o corpo 'ancorado' durante o sono.",
        preparo: { 
          limpeza: "Lave a erva seca.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba 1 hora antes de deitar." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Pesadelos Recorrentes": { 
        nome: "Chá de Artemísia (Dose Baixa)", 
        ingredientes: ["Meia colher de chá de artemísia"], 
        beneficios: "Em doses baixas, ajuda a organizar os sonhos e reduzir a carga emocional negativa do subconsciente.",
        preparo: { 
          limpeza: "Lave a erva.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Use apenas 2 vezes por semana." 
        }, 
        contra: "PROIBIDO para gestantes." 
      },
      "Ansiedade Pré-Sono": { 
        nome: "Chá de Magnólia (Casca)", 
        ingredientes: ["1 colher de casca de magnólia"], 
        beneficios: "Reduz o cortisol e induz um estado de relaxamento profundo comparável a sedativos leves.",
        preparo: { 
          limpeza: "Lave a casca.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos. Beba e vá direto para a cama." 
        }, 
        contra: "Pode causar sonolência intensa." 
      },
      "Relaxamento de Nervos": { 
        nome: "Chá de Erva-de-São-Cristóvão", 
        ingredientes: ["1 colher de raiz de erva-de-são-cristóvão"], 
        beneficios: "Ajuda a acalmar os nervos periféricos, reduzindo espasmos e agitação corporal noturna.",
        preparo: { 
          limpeza: "Lave a raiz.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Consulte um médico se tiver histórico de problemas hepáticos." 
      },
      "Sono Profundo (Delta)": { 
        nome: "Chá de Reishi (Cogumelo)", 
        ingredientes: ["1 fatia de cogumelo Reishi seco"], 
        beneficios: "Melhora a arquitetura do sono, aumentando o tempo gasto nas fases mais profundas e reparadoras.",
        preparo: { 
          limpeza: "Lave o cogumelo.", 
          fogo: "Ferva por 30 minutos em fogo baixo.", 
          finalizacao: "Beba o líquido amargo. Pode adicionar mel para melhorar o sabor." 
        }, 
        contra: "Pode interagir com anticoagulantes." 
      },
      "Meditação com Chá": { 
        nome: "Chá de Sândalo", 
        ingredientes: ["Pedaços de madeira de sândalo"], 
        beneficios: "O aroma e a ingestão ajudam a elevar o estado de consciência e relaxar o corpo para meditação pré-sono.",
        preparo: { 
          limpeza: "Lave a madeira.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Abafe por 10 minutos. Inale profundamente o vapor." 
        }, 
        contra: "Certifique-se de que é sândalo próprio para consumo humano." 
      },
      "Despertar Natural": { 
        nome: "Chá de Hibisco com Maçã", 
        ingredientes: ["Hibisco", "Maçã seca"], 
        beneficios: "Ajuda a limpar o organismo durante a noite para que você acorde sentindo-se leve e renovado.",
        preparo: { 
          limpeza: "Lave os ingredientes.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba morno." 
        }, 
        contra: "Evite se tiver pressão muito baixa." 
      },
      "Insônia Severa": {
        nome: "Chá de Lúpulo",
        ingredientes: ["1 colher de chá de flores de lúpulo", "200ml de água"],
        beneficios: "Poderoso sedativo natural que ajuda a induzir o sono em casos de insônia persistente.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione o lúpulo, abafe por 10 minutos e beba antes de deitar."
        },
        contra: "Evite se tiver depressão, pois pode acentuar os sintomas."
      },
      "Pensamentos Acelerados": {
        nome: "Chá de Kava-Kava",
        ingredientes: ["1 colher de chá de raiz de Kava-Kava", "250ml de água"],
        beneficios: "Reduz a ansiedade e promove um relaxamento muscular profundo, facilitando o sono.",
        preparo: {
          limpeza: "Lave a raiz.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe. Beba morno."
        },
        contra: "Pode causar toxicidade hepática se usado em excesso ou com álcool."
      },
      "Relaxamento Mental": {
        nome: "Chá de Flor de Maracujá (Passiflora)",
        ingredientes: ["1 colher de sopa de folhas e flores de maracujá", "200ml de água"],
        beneficios: "Acalma a mente agitada e ajuda a 'desligar' os pensamentos antes de dormir.",
        preparo: {
          limpeza: "Lave bem as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a passiflora, abafe por 10 minutos e beba."
        },
        contra: "Pode causar sonolência excessiva se tomado com outros sedativos."
      },
      "Conforto Noturno": {
        nome: "Chá de Casca de Laranja com Cravo",
        ingredientes: ["Casca de meia laranja", "3 cravos-da-índia", "250ml de água"],
        beneficios: "O aroma e as propriedades relaxantes ajudam a criar um ambiente interno propício ao sono.",
        preparo: {
          limpeza: "Lave la laranja e os cravos.",
          fogo: "Ferva a casca e os cravos por 5 minutos.",
          finalizacao: "Abafe por 5 minutos e beba ainda quente."
        },
        contra: "Geralmente seguro."
      },
      "Sono Reparador": {
        nome: "Chá de Tília com Mel",
        ingredientes: ["1 colher de sopa de flores de tília", "1 colher de mel", "200ml de água"],
        beneficios: "Ajuda a reduzir a tensão nervosa e promove um sono contínuo e reparador.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a tília, abafe por 10 min, coe e adicione o mel."
        },
        contra: "Evite se tiver problemas cardíacos graves."
      },
      "Sedativo Suave": {
        nome: "Chá de Folha de Alface (Lactucarium)",
        ingredientes: ["3 folhas de alface grandes", "250ml de água"],
        beneficios: "Contém lactucário, uma substância com propriedades sedativas leves e naturais.",
        preparo: {
          limpeza: "Lave muito bem as folhas.",
          fogo: "Ferva as folhas por 5 minutos.",
          finalizacao: "Abafe por 5 minutos, coe e beba antes de dormir."
        },
        contra: "Geralmente muito seguro."
      },
      "Equilíbrio Adrenal": {
        nome: "Chá de Raiz de Alcaçuz",
        ingredientes: ["1 colher de chá de raiz de alcaçuz", "200ml de água"],
        beneficios: "Ajuda a equilibrar o cortisol, permitindo que o corpo relaxe naturalmente à noite.",
        preparo: {
          limpeza: "Lave a raiz.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver pressão alta ou problemas renais."
      },
      "Bem-Estar Emocional": {
        nome: "Chá de Erva-de-São-João (Hipericão)",
        ingredientes: ["1 colher de chá de erva-de-são-joão", "200ml de água"],
        beneficios: "Ajuda a combater a depressão leve e a ansiedade que podem prejudicar o sono.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a erva, abafe por 10 minutos e beba."
        },
        contra: "Interage com muitos medicamentos (anticoncepcionais, antidepressivos)."
      },
      "Sono Perfumado": {
        nome: "Chá de Jasmim",
        ingredientes: ["1 colher de chá de flores de jasmim", "200ml de água"],
        beneficios: "O aroma sedutor e as propriedades relaxantes do jasmim induzem um sono tranquilo.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione o jasmim, abafe por 5 minutos e beba."
        },
        contra: "Geralmente seguro."
      },
      "Relaxamento de Lavanda": {
        nome: "Chá de Lavanda com Mel",
        ingredientes: ["1 colher de chá de flores de lavanda seca", "1 colher de mel", "200ml de água"],
        beneficios: "Poderoso relaxante do sistema nervoso central, ideal para estresse extremo.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a lavanda, abafe por 5 min, coe e adicione o mel."
        },
        contra: "Pode causar sonolência excessiva."
      },
      "Redução de Ronco": {
        nome: "Chá de Hortelã com Gengibre",
        ingredientes: ["Folhas de hortelã", "1 rodela de gengibre", "250ml de água"],
        beneficios: "Ajuda a limpar as vias respiratórias e reduzir a inflamação na garganta.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o gengibre por 5 minutos.",
          finalizacao: "Adicione a hortelã, abafe por 5 minutos e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Equilíbrio de Melatonina": {
        nome: "Chá de Cereja Amarga",
        ingredientes: ["Punhado de cerejas secas", "250ml de água"],
        beneficios: "Fonte natural de melatonina, ajuda a regular o ciclo do sono.",
        preparo: {
          limpeza: "Lave as cerejas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba antes de deitar."
        },
        contra: "Geralmente seguro."
      },
      "Sono após Estudo Intenso": {
        nome: "Chá de Alecrim com Camomila",
        ingredientes: ["Alecrim", "Camomila"],
        beneficios: "O alecrim limpa a mente e a camomila induz o relaxamento necessário para dormir.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba."
        },
        contra: "Pode elevar levemente a pressão."
      },
      "Relaxamento de Olhos Cansados": {
        nome: "Chá de Eufrásia (Uso Externo)",
        ingredientes: ["1 colher de eufrásia", "150ml de água"],
        beneficios: "Alivia a tensão ocular após o uso excessivo de telas.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 min, deixe esfriar e use como compressa nos olhos."
        },
        contra: "Uso externo apenas."
      },
      "Sono em Ambientes Barulhentos": {
        nome: "Chá de Valeriana com Maracujá",
        ingredientes: ["Valeriana", "Passiflora"],
        beneficios: "Induz um sono profundo que ajuda a ignorar ruídos externos.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a valeriana por 5 minutos.",
          finalizacao: "Adicione a passiflora, abafe por 10 minutos e beba."
        },
        contra: "Não use com álcool."
      },
      "Redução de Sudorese Noturna": {
        nome: "Chá de Sálvia",
        ingredientes: ["1 colher de sálvia", "200ml de água"],
        beneficios: "Ajuda a controlar a temperatura corporal e reduzir o suor excessivo à noite.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba frio."
        },
        contra: "Evite se estiver amamentando."
      },
      "Sono em Climas Quentes": {
        nome: "Chá de Hortelã Gelado",
        ingredientes: ["Folhas de hortelã fresca", "Água"],
        beneficios: "Refresca o corpo internamente, facilitando o início do sono no calor.",
        preparo: {
          limpeza: "Lave bem as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 min, deixe esfriar e beba com gelo."
        },
        contra: "Geralmente seguro."
      },
      "Ajuste de Ciclo Circadiano": {
        nome: "Chá de Erva-Mate (Manhã) e Melissa (Noite)",
        ingredientes: ["Erva-mate", "Melissa"],
        beneficios: "Usa o estímulo matinal e o relaxamento noturno para resetar o relógio biológico.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Infusão normal.",
          finalizacao: "Beba o mate ao acordar e a melissa antes de dormir."
        },
        contra: "Evite o mate após as 15h."
      },
      "Sono após Exercício Tardio": {
        nome: "Chá de Magnésio com Camomila",
        ingredientes: ["Camomila", "Suplemento de magnésio"],
        beneficios: "Relaxa os músculos e o sistema nervoso após a agitação do treino.",
        preparo: {
          limpeza: "Prepare o chá.",
          fogo: "Infusão normal.",
          finalizacao: "Adicione o magnésio ao chá pronto e beba morno."
        },
        contra: "Consulte se tiver problemas renais."
      },
      "Relaxamento de Coluna e Costas": {
        nome: "Chá de Garra-do-Diabo com Tília",
        ingredientes: ["Garra-do-diabo", "Tília"],
        beneficios: "Alivia dores nas costas que impedem uma boa posição para dormir.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a garra-do-diabo por 10 minutos.",
          finalizacao: "Adicione a tília, abafe por 5 minutos e coe."
        },
        contra: "Evite se tiver úlceras."
      },
      "Pesadelos Recorrentes II": {
        nome: "Chá de Artemísia (Moderação)",
        ingredientes: ["Meia colher de chá de artemísia", "200ml de água"],
        beneficios: "Tradicionalmente usada para promover sonhos lúcidos e reduzir pesadelos (use com cautela).",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 5 minutos e coe. Beba 1 hora antes de dormir."
        },
        contra: "PROIBIDO para gestantes (abortivo)."
      },
      "Sono em Viagens (Jet Lag)": {
        nome: "Chá de Gengibre com Melissa",
        ingredientes: ["1 rodela de gengibre", "1 colher de melissa", "250ml de água"],
        beneficios: "O gengibre ajuda na náusea da viagem e a melissa ajuda a ajustar o sono no novo fuso.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o gengibre por 5 min.",
          finalizacao: "Adicione a melissa, abafe por 10 min e beba."
        },
        contra: "Geralmente seguro."
      },
      "Tensão Mandibular (Bruxismo)": {
        nome: "Chá de Mulungu com Camomila",
        ingredientes: ["1 colher de cada", "250ml de água"],
        beneficios: "Relaxante muscular potente que ajuda a reduzir a tensão na mandíbula durante a noite.",
        preparo: {
          limpeza: "Lave as cascas de mulungu.",
          fogo: "Ferva o mulungu por 10 min.",
          finalizacao: "Adicione a camomila, abafe por 5 min e coe."
        },
        contra: "Pode causar muita sonolência."
      },
      "Sono após Cafeína": {
        nome: "Chá de Casca de Maçã com Alface",
        ingredientes: ["Casca de 1 maçã", "2 folhas de alface", "300ml de água"],
        beneficios: "Ajuda a neutralizar levemente o efeito estimulante da cafeína residual no corpo.",
        preparo: {
          limpeza: "Lave muito bem.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Mãos e Pés Gelados no Sono": {
        nome: "Chá de Canela com Erva-Doce",
        ingredientes: ["1 pau de canela", "1 colher de erva-doce", "250ml de água"],
        beneficios: "Aquece o corpo internamente e melhora a circulação periférica, facilitando o sono no frio.",
        preparo: {
          limpeza: "Lave a canela.",
          fogo: "Ferva a canela por 5 min.",
          finalizacao: "Adicione a erva-doce, abafe por 5 min e beba quente."
        },
        contra: "Evite se for hipertenso."
      },
      "Sono em Turnos (Trabalho Noturno)": {
        nome: "Chá de Ashwagandha",
        ingredientes: ["1 colher de chá de pó de ashwagandha", "200ml de leite ou água"],
        beneficios: "Adaptógeno que ajuda o corpo a lidar com o estresse de horários de sono irregulares.",
        preparo: {
          limpeza: "Use pó puro.",
          fogo: "Aqueça o líquido e misture o pó.",
          finalizacao: "Beba antes do seu período de descanso, independente do horário."
        },
        contra: "Consulte se tiver doenças autoimunes."
      },
      "Agitação de Pernas (Síndrome)": {
        nome: "Chá de Magnésio Natural (Sementes de Abóbora)",
        ingredientes: ["2 colheres de sementes de abóbora", "300ml de água"],
        beneficios: "Rico em magnésio, mineral que ajuda a acalmar os impulsos nervosos nas pernas.",
        preparo: {
          limpeza: "Lave as sementes.",
          fogo: "Ferva as sementes por 10 minutos.",
          finalizacao: "Coe o líquido e beba morno à noite."
        },
        contra: "Geralmente seguro."
      },
      "Sono com Congestão Nasal": {
        nome: "Chá de Eucalipto com Hortelã",
        ingredientes: ["1 folha de cada", "250ml de água"],
        beneficios: "Ajuda a abrir as vias aéreas para uma respiração melhor durante o sono.",
        preparo: {
          limpeza: "Lave bem as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e inale o vapor antes de beber."
        },
        contra: "Evite se tiver asma severa sem orientação."
      },
      "Relaxamento de Ombros e Pescoço": {
        nome: "Chá de Alecrim com Lavanda",
        ingredientes: ["1 raminho de cada", "250ml de água"],
        beneficios: "Alivia a tensão muscular acumulada na região cervical durante o dia.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba morno."
        },
        contra: "Pode elevar levemente a pressão."
      },
      "Sono com Digestão Lenta": {
        nome: "Chá de Camomila com Anis Estrelado",
        ingredientes: ["1 colher de camomila", "1 anis estrelado", "200ml de água"],
        beneficios: "Acalma o estômago e o sistema nervoso simultaneamente.",
        preparo: {
          limpeza: "Lave o anis.",
          fogo: "Ferva o anis por 3 min.",
          finalizacao: "Adicione a camomila, abafe por 5 min e coe."
        },
        contra: "Geralmente seguro."
      },
      "Protocolo: 8 Horas de Sono": {
        nome: "Do caos para 8 horas de sono em 7 dias",
        ingredientes: ["Valeriana", "Melissa", "Camomila", "Maracujá", "Lavanda", "Chá Verde", "Hortelã"],
        beneficios: "OBJETIVO: Reprogramar o ciclo do sono naturalmente. META: Dormir 7-8 horas seguidas toda noite.",
        preparo: {
          limpeza: "Siga o cronograma diário abaixo.",
          fogo: "Prepare as infusões 30-60min antes de dormir.",
          finalizacao: "Crie um ambiente propício ao descanso."
        },
        protocolo: [
          { dia: 1, titulo: "O Chá Certo", descricao: "Valeriana + Melissa 30min antes de deitar. Sem celular." },
          { dia: 2, titulo: "Desligue Telas", descricao: "Sem telas 2h antes. Camomila + Maracujá. Leia um livro físico." },
          { dia: 3, titulo: "Banho do Sono", descricao: "Banho morno 1h antes. Melissa + Lavanda." },
          { dia: 4, titulo: "Santuário", descricao: "Quarto escuro. Gota de lavanda no travesseiro. Valeriana na cama. Escreva 3 gratidões." },
          { dia: 5, titulo: "Sem Cafeína", descricao: "Sem cafeína após meio-dia. Tarde: Chá Verde + Hortelã. Noite: Protocolo completo." },
          { dia: 6, titulo: "Respiração", descricao: "Ritual 4-7-8 (respiração) com Camomila quente." },
          { dia: 7, titulo: "Protocolo Completo", descricao: "Sem telas 2h + Banho + Quarto escuro + Respiração 4-7-8 + Valeriana/Melissa + Gratidões." }
        ],
        contra: "Não use Valeriana com álcool. Se os sintomas persistirem, procure um especialista em sono."
      }
    }
  },
  "Digestão": {
    icone: "🍃",
    subs: {
      "Azia": { 
        nome: "Espinheira-Santa", 
        ingredientes: ["1 colher de sopa de folhas de espinheira-santa", "250ml de água"], 
        beneficios: "Protege a mucosa do estômago e reduz a acidez excessiva, sendo um dos melhores tratamentos naturais para gastrite e úlceras.",
        preparo: { 
          limpeza: "Lave as folhas secas rapidamente em água corrente.", 
          fogo: "Ferva a água, desligue e prepare a infusão.", 
          finalizacao: "Adicione as folhas, abafe por 10 a 15 minutos. O ideal é beber 30 minutos antes das refeições principais." 
        }, 
        contra: "Não deve ser consumido por mulheres que estão amamentando, pois pode reduzir a produção de leite materno." 
      },
      "Gases": { 
        nome: "Funcho", 
        ingredientes: ["1 colher de sobremesa de sementes de funcho (erva-doce)", "200ml de água"], 
        beneficios: "Elimina o desconforto e a pressão causados pelos gases intestinais, relaxando os músculos do trato digestivo.",
        preparo: { 
          limpeza: "Esmague levemente as sementes com as costas de uma colher para liberar os óleos medicinais.", 
          fogo: "Ferva a água e desligue o fogo.", 
          finalizacao: "Coloque as sementes na água quente, tampe e deixe descansar por 10 minutos. Beba após as refeições ou quando sentir desconforto." 
        }, 
        contra: "Geralmente muito seguro. Em doses excessivas, pode ter um leve efeito estimulante em crianças pequenas." 
      },
      "Refluxo": { 
        nome: "Gengibre com Camomila", 
        ingredientes: ["1 fatia bem fina de gengibre fresco", "1 colher de flores de camomila"], 
        beneficios: "O gengibre ajuda a fechar a válvula do estômago mais rapidamente, enquanto a camomila acalma a irritação no esôfago.",
        preparo: { 
          limpeza: "Lave bem o gengibre e as flores de camomila.", 
          fogo: "Ferva o gengibre na água por 5 minutos para extrair sua força.", 
          finalizacao: "Desligue o fogo, adicione a camomila e abafe por mais 10 minutos. Beba em pequenos goles, nunca muito quente." 
        }, 
        contra: "Se a gastrite estiver muito atacada, o gengibre pode causar ardência inicial. Nesse caso, use apenas a camomila." 
      },
      "Prisão de Ventre": { 
        nome: "Chá de Sene", 
        ingredientes: ["1 colher de chá (rasa) de folhas de sene", "250ml de água"], 
        beneficios: "Possui propriedades laxativas fortes que estimulam os movimentos do intestino, sendo indicado para casos pontuais de constipação.",
        preparo: { 
          limpeza: "Lave as folhas secas rapidamente.", 
          fogo: "Faça uma infusão curta: jogue a água fervente sobre as folhas.", 
          finalizacao: "Abafe por apenas 5 minutos (não deixe mais tempo para não causar cólicas fortes). Beba antes de dormir para fazer efeito pela manhã." 
        }, 
        contra: "Não use por mais de 7 dias seguidos. Proibido para gestantes, crianças e pessoas com inflamações intestinais graves." 
      },
      "Diarreia": { 
        nome: "Chá de Broto de Goiabeira", 
        ingredientes: ["3 a 5 brotos novos de goiabeira", "300ml de água"], 
        beneficios: "Rico em taninos que ajudam a 'prender' o intestino e combatem microrganismos que causam infecções intestinais.",
        preparo: { 
          limpeza: "Lave muito bem os brotos (as folhinhas mais novas da ponta do galho).", 
          fogo: "Ferva os brotos na água por 5 a 8 minutos.", 
          finalizacao: "Desligue, abafe por 10 minutos e beba sem açúcar. Ajuda a repor líquidos e estabilizar o sistema." 
        }, 
        contra: "Não deve ser usado se houver suspeita de infecção grave com febre alta sem orientação médica. Pode causar constipação se usado em excesso." 
      },
      "Enjoo": { 
        nome: "Chá de Hortelã-Pimenta", 
        ingredientes: ["Um punhado de folhas frescas de hortelã", "200ml de água"], 
        beneficios: "O mentol presente na hortelã relaxa o estômago e reduz a sensação de náusea e tontura quase instantaneamente.",
        preparo: { 
          limpeza: "Lave as folhas frescas em água corrente.", 
          fogo: "Ferva a água e despeje sobre as folhas rasgadas.", 
          finalizacao: "Abafe por 5 a 7 minutos. Beba em pequenos goles, preferencialmente morno ou frio." 
        }, 
        contra: "Pode piorar o refluxo em algumas pessoas, pois relaxa o esfíncter esofágico. Não recomendado para quem tem cálculos biliares." 
      },
      "Fígado Gorduroso": { 
        nome: "Chá de Alcachofra", 
        ingredientes: ["1 colher de sopa de folhas de alcachofra secas", "250ml de água"], 
        beneficios: "Auxilia na regeneração das células do fígado e melhora o metabolismo das gorduras, ajudando a reduzir o colesterol.",
        preparo: { 
          limpeza: "Lave as folhas secas rapidamente.", 
          fogo: "Ferva a água com as folhas por 10 minutos (decocção leve).", 
          finalizacao: "Desligue, abafe por 5 minutos e coe. O sabor é amargo, mas muito benéfico para a saúde hepática." 
        }, 
        contra: "Evite se tiver pedras na vesícula ou obstrução dos ductos biliares. Não recomendado durante a amamentação." 
      },
      "Má Digestão": { 
        nome: "Chá de Alecrim com Sálvia", 
        ingredientes: ["1 raminho de alecrim", "3 folhas de sálvia"], 
        beneficios: "Estimula a produção de sucos gástricos e enzimas digestivas, eliminando a sensação de 'peso' após refeições gordurosas.",
        preparo: { 
          limpeza: "Lave bem as ervas frescas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as ervas, abafe por 10 minutos. Beba logo após as refeições mais pesadas do dia." 
        }, 
        contra: "Evite se tiver pressão alta descontrolada ou se estiver grávida (a sálvia pode estimular contrações)." 
      },
      "Intolerância": { 
        nome: "Chá de Coentro", 
        ingredientes: ["1 colher de chá de sementes de coentro", "250ml de água"], 
        beneficios: "Ajuda a reduzir a fermentação intestinal e os gases causados por intolerâncias alimentares leves.",
        preparo: { 
          limpeza: "Lave as sementes em uma peneira.", 
          fogo: "Ferva as sementes na água por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. O chá de coentro tem um sabor terroso que combina bem com um pouco de limão." 
        }, 
        contra: "Geralmente seguro. Pessoas com alergia severa ao coentro devem evitar." 
      },
      "Colite": { 
        nome: "Chá de Calêndula", 
        ingredientes: ["1 colher de sopa de flores de calêndula", "250ml de água"], 
        beneficios: "Possui propriedades anti-inflamatórias e cicatrizantes que ajudam a acalmar as paredes do intestino irritado.",
        preparo: { 
          limpeza: "Lave as flores secas ou frescas cuidadosamente.", 
          fogo: "Ferva a água e despeje sobre as flores.", 
          finalizacao: "Abafe por 10 a 12 minutos. Beba morno, preferencialmente longe das refeições." 
        }, 
        contra: "Evite se tiver alergia a plantas da família Asteraceae (como margaridas e girassóis)." 
      },
      "Estufamento": { 
        nome: "Chá de Cardamomo", 
        ingredientes: ["3 sementes de cardamomo esmagadas", "200ml de água"], 
        beneficios: "Excelente para reduzir a pressão abdominal e o estufamento logo após as refeições.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva as sementes por 5 minutos.", 
          finalizacao: "Abafe por 5 minutos e beba morno." 
        }, 
        contra: "Evite se tiver gastrite severa." 
      },
      "Intestino Preso": { 
        nome: "Chá de Sene (Uso Pontual)", 
        ingredientes: ["Meia colher de chá de folhas de sene", "200ml de água"], 
        beneficios: "Laxante natural potente para casos de constipação aguda.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por apenas 5 minutos. Beba à noite para fazer efeito pela manhã." 
        }, 
        contra: "NÃO use por mais de 3 dias seguidos. Pode causar dependência intestinal." 
      },
      "Diarreia Leve": { 
        nome: "Chá de Folha de Goiabeira", 
        ingredientes: ["3 folhas de goiabeira", "250ml de água"], 
        beneficios: "Ação adstringente que ajuda a 'prender' o intestino e combater infecções leves.",
        preparo: { 
          limpeza: "Lave bem as folhas.", 
          fogo: "Ferva as folhas por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e beba sem açúcar." 
        }, 
        contra: "Não use se a diarreia for acompanhada de febre alta ou sangue." 
      },
      "Parasitas": { 
        nome: "Chá de Mastruz (Erva-de-Santa-Maria)", 
        ingredientes: ["1 raminho de mastruz", "200ml de água"], 
        beneficios: "Tradicionalmente usado para eliminar vermes e parasitas intestinais.",
        preparo: { 
          limpeza: "Lave muito bem o raminho.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba em jejum por 3 dias." 
        }, 
        contra: "Tóxico em doses altas. PROIBIDO para gestantes e crianças pequenas." 
      },
      "Náuseas": { 
        nome: "Chá de Hortelã-Pimenta", 
        ingredientes: ["Folhas de hortelã-pimenta frescas"], 
        beneficios: "Acalma o estômago e reduz a sensação de enjoo e náusea rapidamente.",
        preparo: { 
          limpeza: "Lave bem as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba em pequenos goles." 
        }, 
        contra: "Pode piorar o refluxo em algumas pessoas." 
      },
      "Fígado": { 
        nome: "Chá de Alcachofra", 
        ingredientes: ["1 colher de folhas de alcachofra"], 
        beneficios: "Estimula a regeneração das células do fígado e a produção de bile.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. O sabor é amargo, mas muito eficaz." 
        }, 
        contra: "Evite se tiver obstrução dos ductos biliares." 
      },
      "Mau Hálito": { 
        nome: "Chá de Cravo com Canela", 
        ingredientes: ["3 cravos", "1 pedaço de canela"], 
        beneficios: "Combate as bactérias na boca e ajuda na digestão estomacal, tratando o mau hálito na origem.",
        preparo: { 
          limpeza: "Lave os ingredientes.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Use como bochecho ou beba após as refeições." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Gastrite Nervosa": { 
        nome: "Chá de Espinheira-Santa com Melissa", 
        ingredientes: ["Espinheira-santa", "Melissa"], 
        beneficios: "Protege o estômago e acalma a ansiedade que causa a dor gástrica.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 15 minutos. Beba 30 min antes das refeições." 
        }, 
        contra: "Não recomendado para lactantes." 
      },
      "Flora Intestinal": { 
        nome: "Chá de Chicória (Raiz)", 
        ingredientes: ["1 colher de raiz de chicória"], 
        beneficios: "Rica em inulina, uma fibra prebiótica que alimenta as bactérias boas do intestino.",
        preparo: { 
          limpeza: "Lave bem a raiz.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos. Tem um sabor que lembra o café." 
        }, 
        contra: "Pode causar gases em pessoas não acostumadas a fibras." 
      },
      "Proteínas": { 
        nome: "Chá de Mamão (Folhas)", 
        ingredientes: ["Meia folha de mamoeiro jovem"], 
        beneficios: "Contém papaína, uma enzima que ajuda a quebrar proteínas difíceis de digerir.",
        preparo: { 
          limpeza: "Lave bem a folha.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. Beba após churrascos ou refeições pesadas." 
        }, 
        contra: "Evite se estiver grávida." 
      },
      "Refluxo Noturno": { 
        nome: "Chá de Batata-Doce (Caldo)", 
        ingredientes: ["Meia batata-doce fatiada"], 
        beneficios: "O caldo da batata-doce ajuda a neutralizar o ácido gástrico e protege o esôfago.",
        preparo: { 
          limpeza: "Lave e descasque.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Beba o caldo morno antes de deitar." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Digestão de Gorduras": { 
        nome: "Chá de Boldo-do-Chile", 
        ingredientes: ["1 colher de folhas de boldo"], 
        beneficios: "Estimula a produção de bile, facilitando a quebra de gorduras pesadas.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba após refeições gordurosas." 
        }, 
        contra: "Não use se tiver cálculos biliares." 
      },
      "Intolerância a Glúten (Alívio)": { 
        nome: "Chá de Marshmallow (Raiz)", 
        ingredientes: ["1 colher de raiz de marshmallow"], 
        beneficios: "Cria uma camada protetora no intestino, reduzindo a inflamação por glúten.",
        preparo: { 
          limpeza: "Lave a raiz.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e coe." 
        }, 
        contra: "Pode retardar a absorção de outros remédios." 
      },
      "Gases em Bebês (Massagem/Chá)": { 
        nome: "Chá de Erva-Doce (Uso Materno)", 
        ingredientes: ["Erva-doce"], 
        beneficios: "A mãe bebe para passar os benefícios anti-gases através do leite materno.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Infusão normal.", 
          finalizacao: "A mãe deve beber 3 xícaras ao dia." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Vermes Intestinais": { 
        nome: "Chá de Semente de Abóbora", 
        ingredientes: ["Punhado de sementes de abóbora cruas"], 
        beneficios: "Contém cucurbitacina, que paralisa os vermes para que sejam eliminados.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Beba o caldo e coma as sementes em jejum." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Fígado Gorduroso (Cardo-Mariano)": { 
        nome: "Chá de Cardo-Mariano", 
        ingredientes: ["1 colher de sementes de cardo-mariano"], 
        beneficios: "A silimarina ajuda a regenerar o fígado e reduzir a gordura acumulada.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e coe." 
        }, 
        contra: "Consulte se tiver histórico de câncer hormonal." 
      },
      "Estômago Alto": { 
        nome: "Chá de Carqueja Amarga", 
        ingredientes: ["1 colher de carqueja"], 
        beneficios: "Reduz a fermentação e o inchaço na parte superior do abdômen.",
        preparo: { 
          limpeza: "Lave a erva.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 5 minutos. Beba antes das refeições." 
        }, 
        contra: "Evite se for diabético (pode baixar muito o açúcar)." 
      },
      "Soluço Persistente": { 
        nome: "Chá de Endro (Dill)", 
        ingredientes: ["1 colher de sementes de endro"], 
        beneficios: "Relaxa o diafragma e interrompe os espasmos do soluço.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e beba morno." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Detox Pós-Festa": { 
        nome: "Chá de Carvão Vegetal (Infusão)", 
        ingredientes: ["1 colher de carvão vegetal ativado em pó"], 
        beneficios: "Absorve toxinas e álcool do trato digestivo rapidamente.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Use água morna.", 
          finalizacao: "Misture bem e beba. Não tome perto de outros remédios." 
        }, 
        contra: "Pode escurecer as fezes." 
      },
      "Equilíbrio de Ácido Gástrico": { 
        nome: "Chá de Alcaçuz", 
        ingredientes: ["1 colher de raiz de alcaçuz"], 
        beneficios: "Ajuda a equilibrar a acidez e protege a mucosa do estômago.",
        preparo: { 
          limpeza: "Lave a raiz.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e coe." 
        }, 
        contra: "Evite se tiver pressão alta." 
      },
      "Digestão Lenta": {
        nome: "Chá de Angélica",
        ingredientes: ["1 colher de chá de raiz de angélica", "200ml de água"],
        beneficios: "Estimula as secreções gástricas e biliares, acelerando a digestão de refeições pesadas.",
        preparo: {
          limpeza: "Lave bem a raiz.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e beba morno após as refeições."
        },
        contra: "Evite se tiver úlceras gástricas ativas ou gravidez."
      },
      "Vermes e Parasitas": {
        nome: "Chá de Artemísia",
        ingredientes: ["1 colher de chá de folhas de artemísia", "250ml de água"],
        beneficios: "Ajuda a eliminar parasitas intestinais e melhora a função digestiva geral.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione la artemísia, abafe por 10 minutos e coe."
        },
        contra: "Não use por períodos prolongados sem orientação."
      },
      "Alívio de Diarreia": {
        nome: "Chá de Casca de Romã (Forte)",
        ingredientes: ["2 colheres de sopa de cascas de romã", "400ml de água"],
        beneficios: "Rico em taninos que ajudam a prender o intestino e reduzir a inflamação intestinal.",
        preparo: {
          limpeza: "Lave bem as cascas.",
          fogo: "Ferva por 15 minutos até a água escurecer.",
          finalizacao: "Abafe por 10 minutos e beba em pequenas doses ao longo do dia."
        },
        contra: "Pode causar constipação se usado em excesso."
      },
      "Gases e Inchaço": {
        nome: "Chá de Coentro",
        ingredientes: ["1 colher de sopa de sementes de coentro", "250ml de água"],
        beneficios: "Excelente para reduzir a formação de gases e aliviar a sensação de estufamento.",
        preparo: {
          limpeza: "Lave as sementes.",
          fogo: "Ferva as sementes por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Geralmente seguro."
      },
      "Cólicas Intestinais": {
        nome: "Chá de Endro (Dill)",
        ingredientes: ["1 colher de chá de sementes de endro", "200ml de água"],
        beneficios: "Propriedades antiespasmódicas que aliviam rapidamente as cólicas e dores abdominais.",
        preparo: {
          limpeza: "Lave as sementes.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione o endro, abafe por 10 minutos e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Proteção Gástrica": {
        nome: "Chá de Espinheira-Santa com Camomila",
        ingredientes: ["1 colher de cada erva", "300ml de água"],
        beneficios: "Combina a proteção da mucosa da espinheira-santa com o relaxamento da camomila.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 minutos e beba entre as refeições."
        },
        contra: "Evite durante a amamentação."
      },
      "Digestão de Proteínas": {
        nome: "Chá de Casca de Abacaxi",
        ingredientes: ["Casca de 1/4 de abacaxi", "1 rodela de gengibre", "500ml de água"],
        beneficios: "A bromelina do abacaxi ajuda na quebra de proteínas, facilitando a digestão de carnes.",
        preparo: {
          limpeza: "Lave muito bem a casca com uma escovinha.",
          fogo: "Ferva a casca e o gengibre por 15 minutos.",
          finalizacao: "Deixe esfriar um pouco e beba após o churrasco ou refeições pesadas."
        },
        contra: "Pode causar sensibilidade na boca devido à acidez."
      },
      "Refluxo Gastroesofágico": {
        nome: "Chá de Raiz de Althea (Malva-Branca)",
        ingredientes: ["1 colher de sopa de raiz de althea", "250ml de água fria"],
        beneficios: "Cria uma camada protetora (mucilagem) que evita a irritação do esôfago pelo ácido.",
        preparo: {
          limpeza: "Lave la raiz.",
          fogo: "Não ferva! Deixe a raiz de molho na água fria por 4 a 6 horas.",
          finalizacao: "Coe e beba o líquido viscoso antes das refeições."
        },
        contra: "Pode retardar a absorção de outros medicamentos tomados simultaneamente."
      },
      "Equilíbrio da Flora": {
        nome: "Chá de Bardana",
        ingredientes: ["1 colher de chá de raiz de bardana", "200ml de água"],
        beneficios: "Atua como prebiótico, alimentando as bactérias boas do intestino e melhorando a digestão.",
        preparo: {
          limpeza: "Lave bem a raiz.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Evite se tiver alergia a plantas da família Asteraceae."
      },
      "Náuseas e Enjoo": {
        nome: "Chá de Folhas de Framboesa",
        ingredientes: ["1 colher de sopa de folhas de framboesa", "200ml de água"],
        beneficios: "Suave para o estômago, ajuda a acalmar náuseas leves e desconforto gástrico.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione as folhas, abafe por 10 minutos e beba em pequenos goles."
        },
        contra: "Geralmente seguro."
      },
      "Úlcera Gástrica": {
        nome: "Chá de Batata-Doce com Espinheira-Santa",
        ingredientes: ["Caldo de batata-doce", "Espinheira-santa"],
        beneficios: "Cria uma barreira protetora e reduz a acidez que irrita a úlcera.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a batata por 15 min, adicione a erva e desligue.",
          finalizacao: "Abafe por 10 minutos e beba o caldo morno."
        },
        contra: "Não substitui tratamento médico."
      },
      "Síndrome do Intestino Irritável": {
        nome: "Chá de Hortelã com Camomila",
        ingredientes: ["Hortelã", "Camomila"],
        beneficios: "Acalma os espasmos intestinais e reduz a inflamação.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba lentamente."
        },
        contra: "Geralmente seguro."
      },
      "Digestão de Laticínios": {
        nome: "Chá de Gengibre com Canela",
        ingredientes: ["Gengibre", "Canela"],
        beneficios: "Ajuda a reduzir o inchaço e gases causados pela lactose.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e beba após consumir laticínios."
        },
        contra: "Evite se for hipertenso."
      },
      "Redução de Inchaço Pós-Refeição": {
        nome: "Chá de Funcho com Louro",
        ingredientes: ["Funcho", "1 folha de louro"],
        beneficios: "Combinação potente para eliminar gases e reduzir o volume abdominal.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o louro por 3 min, adicione o funcho e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Geralmente seguro."
      },
      "Equilíbrio de Ácido Gástrico II": {
        nome: "Chá de Alcaçuz com Marshmallow",
        ingredientes: ["Raiz de alcaçuz", "Raiz de marshmallow"],
        beneficios: "Regula a produção de ácido e protege as paredes do estômago.",
        preparo: {
          limpeza: "Lave as raízes.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 10 minutos e beba morno."
        },
        contra: "Evite se tiver pressão alta."
      },
      "Digestão de Frituras": {
        nome: "Chá de Boldo com Limão",
        ingredientes: ["Boldo", "Limão"],
        beneficios: "O boldo quebra as gorduras e o limão ajuda na alcalinização.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Infusão do boldo.",
          finalizacao: "Adicione o limão no final e beba sem açúcar."
        },
        contra: "Evite se tiver pedras na vesícula."
      },
      "Redução de Cólicas Intestinais": {
        nome: "Chá de Erva-Doce com Anis Estrelado",
        ingredientes: ["Erva-doce", "1 anis estrelado"],
        beneficios: "Relaxa a musculatura intestinal e alivia dores agudas.",
        preparo: {
          limpeza: "Lave as sementes.",
          fogo: "Ferva o anis por 5 min, adicione a erva-doce e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Geralmente seguro."
      },
      "Detox de Vesícula": {
        nome: "Chá de Alcachofra com Dente-de-Leão",
        ingredientes: ["Alcachofra", "Dente-de-leão"],
        beneficios: "Estimula o fluxo biliar e a limpeza da vesícula.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba em jejum."
        },
        contra: "PROIBIDO se houver obstrução biliar."
      },
      "Melhora de Absorção de Nutrientes": {
        nome: "Chá de Alfafa",
        ingredientes: ["1 colher de alfafa"],
        beneficios: "Rica em minerais, ajuda o intestino a absorver melhor os alimentos.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba 1 vez ao dia."
        },
        contra: "Consulte se tiver lúpus."
      },
      "Redução de Arrotos Excessivos": {
        nome: "Chá de Cardamomo com Hortelã",
        ingredientes: ["Cardamomo", "Hortelã"],
        beneficios: "Neutraliza os gases estomacais e refresca o hálito.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o cardamomo por 5 minutos.",
          finalizacao: "Adicione a hortelã, abafe por 5 minutos e beba."
        },
        contra: "Geralmente seguro."
      },
      "Sensibilidade ao Glúten (Alívio)": {
        nome: "Chá de Raiz de Marshmallow com Camomila",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Cria uma camada protetora na mucosa intestinal, reduzindo a irritação causada pelo glúten.",
        preparo: {
          limpeza: "Lave as raízes.",
          fogo: "Ferva a raiz de marshmallow por 10 min.",
          finalizacao: "Adicione a camomila, abafe por 5 min e coe."
        },
        contra: "Não substitui a dieta sem glúten para celíacos."
      },
      "Digestão de Leguminosas (Feijão)": {
        nome: "Chá de Cominho com Louro",
        ingredientes: ["Meia colher de cominho", "1 folha de louro", "250ml de água"],
        beneficios: "Ajuda a quebrar os açúcares complexos do feijão que causam gases.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Beba logo após a refeição com feijão ou lentilha."
        },
        contra: "Geralmente seguro."
      },
      "Hálito Estomacal": {
        nome: "Chá de Cravo com Canela e Hortelã",
        ingredientes: ["2 cravos", "1 pau de canela", "Hortelã", "300ml de água"],
        beneficios: "Trata o mau hálito que vem de problemas digestivos no estômago.",
        preparo: {
          limpeza: "Lave os ingredientes.",
          fogo: "Ferva o cravo e a canela por 5 min.",
          finalizacao: "Adicione a hortelã, abafe por 5 min e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Digestão de Carne Vermelha": {
        nome: "Chá de Casca de Mamão Verde",
        ingredientes: ["Pedaço pequeno de casca de mamão verde", "250ml de água"],
        beneficios: "A papaína ajuda a quebrar as fibras da carne, facilitando a digestão pesada.",
        preparo: {
          limpeza: "Lave muito bem a casca.",
          fogo: "Ferva a casca por 5 minutos.",
          finalizacao: "Abafe por 5 minutos e beba após o churrasco."
        },
        contra: "Evite se estiver grávida."
      },
      "Inflamação do Cólon": {
        nome: "Chá de Calêndula com Tília",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Acalma a inflamação nas paredes do cólon e relaxa o sistema nervoso entérico.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 minutos e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Digestão de Fibras": {
        nome: "Chá de Gengibre com Erva-Doce",
        ingredientes: ["1 rodela de gengibre", "1 colher de erva-doce", "250ml de água"],
        beneficios: "Ajuda o intestino a lidar com o aumento de fibras na dieta, evitando cólicas.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o gengibre por 5 min.",
          finalizacao: "Adicione a erva-doce, abafe por 5 min e beba."
        },
        contra: "Evite se tiver gastrite severa."
      },
      "Espasmos Esofágicos": {
        nome: "Chá de Melissa com Camomila",
        ingredientes: ["1 colher de cada", "200ml de água"],
        beneficios: "Relaxa a musculatura do esôfago, reduzindo a sensação de 'bolo' na garganta.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba em pequenos goles."
        },
        contra: "Geralmente seguro."
      },
      "Detox de Pâncreas": {
        nome: "Chá de Carqueja com Alcachofra",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Estimula as funções pancreáticas e hepáticas de forma profunda.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba 1 vez ao dia."
        },
        contra: "Sabor muito amargo. Evite se tiver pedras na vesícula."
      },
      "Digestão de Álcool": {
        nome: "Chá de Casca de Maçã com Gengibre e Mel",
        ingredientes: ["Casca de 1 maçã", "Gengibre", "Mel", "300ml de água"],
        beneficios: "Ajuda o corpo a processar o álcool e protege a mucosa gástrica pós-ressaca.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a maçã e o gengibre por 10 min.",
          finalizacao: "Abafe por 5 min, coe e adicione o mel."
        },
        contra: "Geralmente seguro."
      },
      "Equilíbrio de Microbiota": {
        nome: "Chá de Raiz de Chicória com Bardana",
        ingredientes: ["1 colher de cada raiz", "300ml de água"],
        beneficios: "Rico em prebióticos que alimentam as bactérias benéficas do intestino.",
        preparo: {
          limpeza: "Lave bem as raízes.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Pode causar gases inicialmente."
      },
      "Protocolo: Estômago Saudável": {
        nome: "7 dias para seu estômago funcionar de verdade",
        ingredientes: ["Hortelã", "Alcaçuz", "Erva-doce", "Camomila", "Gengibre", "Limão", "Erva-cidreira", "Melissa"],
        beneficios: "OBJETIVO: Acalmar a mucosa gástrica e regular a digestão. META: Eliminar desconforto pós-refeição e azia.",
        preparo: {
          limpeza: "Siga o cronograma diário abaixo.",
          fogo: "Infusões mornas são melhores para o estômago.",
          finalizacao: "Coma com calma e atenção plena."
        },
        protocolo: [
          { dia: 1, titulo: "Despertar Gástrico", descricao: "Hortelã + Alcaçuz em jejum (morno). Espere 20min para comer." },
          { dia: 2, titulo: "Mastigação", descricao: "Mastigar 20x cada garfada. Pós-almoço: Erva-doce + Camomila." },
          { dia: 3, titulo: "Abstinência", descricao: "Sem café, fritura ou álcool. Gengibre + Limão morno entre refeições." },
          { dia: 4, titulo: "Digestão Ativa", descricao: "Pós-refeição (20min): Erva-cidreira + Hortelã morno + 10min caminhada leve." },
          { dia: 5, titulo: "Alcalinização", descricao: "Alimentação antiácida. Noite: Alcaçuz + Camomila." },
          { dia: 6, titulo: "Eixo Cérebro-Intestino", descricao: "Gerenciamento de estresse (respiração 3x dia) + Camomila + Melissa." },
          { dia: 7, titulo: "Protocolo Permanente", descricao: "Chá jejum + Mastigar 20x + Chá pós-refeição + Caminhada + Sem café excessivo + Respiração + Alcaçuz noite." }
        ],
        contra: "Alcaçuz não recomendado para hipertensos. Evite chás muito quentes se tiver gastrite."
      }
    }
  },
  "Dores e Articulações": {
    icone: "🩹",
    subs: {
      "Enxaqueca": { 
        nome: "Chá de Tanaceto", 
        ingredientes: ["1 colher de sobremesa de folhas de tanaceto", "250ml de água"], 
        beneficios: "O tanaceto é um dos fitoterápicos mais estudados para a prevenção da enxaqueca, ajudando a reduzir a frequência e a intensidade das crises de dor de cabeça.",
        preparo: { 
          limpeza: "Lave as folhas secas ou frescas rapidamente em água corrente.", 
          fogo: "Aqueça a água até ferver e desligue o fogo imediatamente.", 
          finalizacao: "Adicione o tanaceto, abafe por 10 minutos e coe. O uso preventivo (1 xícara ao dia) costuma ser mais eficaz que o uso apenas durante a dor." 
        }, 
        contra: "Não deve ser usado por gestantes, pois pode estimular contrações uterinas. Cuidado se você utiliza medicamentos anticoagulantes." 
      },
      "Artrite": { 
        nome: "Chá de Cúrcuma com Pimenta Preta", 
        ingredientes: ["1 colher de chá de cúrcuma em pó ou raiz ralada", "Uma pitada de pimenta preta", "250ml de água"], 
        beneficios: "A curcumina é um potente anti-inflamatório natural. A pimenta preta aumenta em até 2000% a absorção da cúrcuma pelo corpo, aliviando dores articulares.",
        preparo: { 
          limpeza: "Se usar a raiz fresca, lave bem e rale na hora para preservar os ativos.", 
          fogo: "Ferva a água com a cúrcuma por 10 minutos em fogo baixo para liberar os curcuminoides.", 
          finalizacao: "Desligue, adicione a pitada de pimenta preta, abafe por 2 minutos e beba. Pode adicionar um pouco de mel ou óleo de coco para melhorar a absorção." 
        }, 
        contra: "Evite se tiver pedras na vesícula ou se for passar por cirurgia em breve, devido ao efeito levemente anticoagulante." 
      },
      "Lombar": { 
        nome: "Chá de Garra do Diabo", 
        ingredientes: ["1 colher de sopa de raiz de Garra do Diabo picada", "300ml de água"], 
        beneficios: "Esta raiz africana é famosa por sua ação analgésica em dores na coluna e processos inflamatórios crônicos nos ossos e tendões.",
        preparo: { 
          limpeza: "Lave bem os pedaços da raiz para remover qualquer impureza.", 
          fogo: "Coloque a raiz na água fria e leve ao fogo. Deixe ferver por 15 minutos (decocção).", 
          finalizacao: "Desligue o fogo, abafe por mais 5 a 10 minutos e coe. Beba 2 a 3 vezes ao dia para melhores resultados." 
        }, 
        contra: "Contraindicado para quem tem úlceras gástricas ou duodenais, pois pode aumentar a produção de ácido no estômago." 
      },
      "Muscular": { 
        nome: "Chá de Arnica (Uso Interno Controlado)", 
        ingredientes: ["1 colher de chá de flores de arnica", "250ml de água"], 
        beneficios: "Ajuda na recuperação de tecidos musculares após esforços intensos ou traumas, reduzindo hematomas e inflamações internas.",
        preparo: { 
          limpeza: "Lave as flores secas rapidamente.", 
          fogo: "Ferva a água e despeje sobre as flores.", 
          finalizacao: "Abafe por apenas 5 minutos. Beba no máximo uma xícara pequena por dia. Atenção: a arnica é mais segura para uso externo (compressas)." 
        }, 
        contra: "Pode ser tóxico em grandes quantidades. NUNCA exceda a dose recomendada. Proibido para gestantes e crianças." 
      },
      "Menstrual": { 
        nome: "Chá de Orégano", 
        ingredientes: ["1 colher de sopa de orégano seco", "250ml de água"], 
        beneficios: "O orégano tem propriedades antiespasmódicas que relaxam o útero, aliviando as cólicas e ajudando a regular o fluxo menstrual.",
        preparo: { 
          limpeza: "Lave o orégano seco rapidamente em uma peneira fina.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione o orégano, abafe por 10 minutos e beba bem quente. O calor potencializa o relaxamento muscular." 
        }, 
        contra: "Evite se tiver fluxo menstrual excessivamente intenso ou se houver suspeita de gravidez." 
      },
      "Dente": { 
        nome: "Chá de Cravo-da-Índia", 
        ingredientes: ["5 a 7 cravos-da-índia", "200ml de água"], 
        beneficios: "O cravo contém eugenol, um anestésico e antisséptico natural poderosíssimo que alivia dores de dente e inflamações na gengiva.",
        preparo: { 
          limpeza: "Lave os cravos rapidamente.", 
          fogo: "Ferva a água com os cravos por 5 a 8 minutos.", 
          finalizacao: "Abafe por 5 minutos. Você pode beber o chá ou usá-lo para fazer bochechos no local da dor." 
        }, 
        contra: "Pode causar irritação na mucosa da boca se for usado muito concentrado ou por tempo prolongado." 
      },
      "Garganta": { 
        nome: "Chá de Malva", 
        ingredientes: ["1 colher de sopa de folhas de malva", "250ml de água"], 
        beneficios: "A malva é rica em mucilagens que criam uma camada protetora na garganta, aliviando a dor, a irritação e a rouquidão.",
        preparo: { 
          limpeza: "Lave bem as folhas frescas ou secas.", 
          fogo: "Ferva a água e despeje sobre as folhas.", 
          finalizacao: "Abafe por 10 a 15 minutos. Faça gargarejos com o chá morno e depois beba o restante lentamente." 
        }, 
        contra: "Geralmente muito seguro. Evite se tiver diarreia crônica, pois as mucilagens podem soltar levemente o intestino." 
      },
      "Reumatismo": { 
        nome: "Chá de Chapéu-de-Couro", 
        ingredientes: ["1 colher de sopa de folhas de chapéu-de-couro", "300ml de água"], 
        beneficios: "Excelente depurativo do sangue, ajuda a eliminar o excesso de ácido úrico, aliviando dores reumáticas e gota.",
        preparo: { 
          limpeza: "Lave as folhas cuidadosamente.", 
          fogo: "Ferva as folhas na água por 5 minutos.", 
          finalizacao: "Desligue, abafe por 10 minutos e coe. Beba ao longo do dia para estimular a limpeza dos rins." 
        }, 
        contra: "Pode ter um efeito diurético muito forte. Pessoas com insuficiência cardíaca ou renal devem usar com cautela." 
      },
      "Tendinite": { 
        nome: "Chá de Salgueiro Branco", 
        ingredientes: ["1 colher de sopa de cascas de salgueiro branco", "250ml de água"], 
        beneficios: "Conhecido como a 'aspirina natural', contém salicina, que combate a inflamação nos tendões e alivia a dor crônica.",
        preparo: { 
          limpeza: "Lave bem os pedaços da casca.", 
          fogo: "Ferva a casca na água por 15 minutos em fogo baixo (decocção).", 
          finalizacao: "Abafe por 5 minutos e coe. O efeito analgésico costuma demorar um pouco mais que o remédio químico, mas dura mais tempo." 
        }, 
        contra: "Não deve ser consumido por pessoas alérgicas à aspirina (AAS) ou por crianças com sintomas de gripe (risco de Síndrome de Reye)." 
      },
      "Ciático": { 
        nome: "Chá de Erva-de-São-João (Hipérico)", 
        ingredientes: ["1 colher de sobremesa de erva-de-são-joão", "250ml de água"], 
        beneficios: "Ajuda na regeneração de nervos inflamados e reduz a dor neuropática característica da inflamação do nervo ciático.",
        preparo: { 
          limpeza: "Lave a erva seca rapidamente.", 
          fogo: "Ferva a água e despeje sobre a erva.", 
          finalizacao: "Abafe por 10 minutos. Beba 2 vezes ao dia. O uso deve ser contínuo por alguns dias para sentir o efeito nos nervos." 
        }, 
        contra: "Interage com muitos medicamentos (anticoncepcionais, antidepressivos). Pode causar sensibilidade à luz solar." 
      },
      "Fibromialgia": { 
        nome: "Chá de Hipérico com Melissa", 
        ingredientes: ["Hipérico", "Melissa"], 
        beneficios: "Ajuda a reduzir a sensibilidade à dor e melhora a qualidade do sono, fundamental para quem tem fibromialgia.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba 2 vezes ao dia." 
        }, 
        contra: "Consulte um médico devido às interações do hipérico." 
      },
      "Bursite": { 
        nome: "Chá de Unha-de-Gato", 
        ingredientes: ["1 colher de casca de unha-de-gato"], 
        beneficios: "Poderoso anti-inflamatório que ajuda a reduzir o inchaço e a dor nas articulações inflamadas.",
        preparo: { 
          limpeza: "Lave a casca.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Abafe por 5 minutos e coe." 
        }, 
        contra: "Não recomendado para gestantes." 
      },
      "Gota": { 
        nome: "Chá de Chapéu-de-Couro", 
        ingredientes: ["1 colher de folhas de chapéu-de-couro"], 
        beneficios: "Ajuda a eliminar o ácido úrico através da urina, aliviando as crises de gota.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. Beba muita água durante o dia." 
        }, 
        contra: "Pode baixar a pressão arterial." 
      },
      "Torcicolo": { 
        nome: "Chá de Erva-Cidreira com Gengibre", 
        ingredientes: ["Erva-cidreira", "Gengibre"], 
        beneficios: "O gengibre combate a inflamação e a erva-cidreira ajuda a relaxar a musculatura do pescoço.",
        preparo: { 
          limpeza: "Lave os ingredientes.", 
          fogo: "Ferva o gengibre por 5 minutos.", 
          finalizacao: "Adicione a erva-cidreira, abafe por 10 minutos e beba quente." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Dor de Cabeça Tensional": { 
        nome: "Chá de Lavanda com Hortelã", 
        ingredientes: ["Flores de lavanda", "Folhas de hortelã"], 
        beneficios: "Alivia a tensão muscular na cabeça e pescoço, reduzindo a dor causada pelo estresse.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Inale o aroma enquanto bebe." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Osteoartrite": { 
        nome: "Chá de Boswellia Serrata", 
        ingredientes: ["1 colher de resina de Boswellia"], 
        beneficios: "Ajuda a preservar a cartilagem e reduz a dor articular crônica.",
        preparo: { 
          limpeza: "Limpe a resina.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e coe bem." 
        }, 
        contra: "Pode causar desconforto gástrico." 
      },
      "Dor nos Pés": { 
        nome: "Escalda-pés de Alecrim e Sal Grosso", 
        ingredientes: ["Punhado de alecrim", "Meia xícara de sal grosso"], 
        beneficios: "Melhora a circulação e relaxa os tendões dos pés após um dia longo.",
        preparo: { 
          limpeza: "Lave o alecrim.", 
          fogo: "Ferva 2 litros de água com o alecrim.", 
          finalizacao: "Coloque em uma bacia, adicione o sal e deixe os pés por 20 minutos." 
        }, 
        contra: "Uso externo apenas." 
      },
      "Neuralgia": { 
        nome: "Chá de Verbasco", 
        ingredientes: ["1 colher de folhas de verbasco"], 
        beneficios: "Ajuda a acalmar nervos inflamados e reduz dores agudas tipo choque.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 15 minutos e coe muito bem (tem pelinhos)." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Contusão": { 
        nome: "Chá de Confrei (Compressa)", 
        ingredientes: ["Folhas de confrei"], 
        beneficios: "Acelera a cicatrização de tecidos e reduz o inchaço de batidas.",
        preparo: { 
          limpeza: "Lave bem as folhas.", 
          fogo: "Ferva as folhas por 5 minutos.", 
          finalizacao: "Deixe esfriar e aplique a folha ou o líquido sobre o local." 
        }, 
        contra: "APENAS USO EXTERNO. Tóxico se ingerido." 
      },
      "Câimbra": { 
        nome: "Chá de Salsinha", 
        ingredientes: ["Um punhado de salsinha fresca"], 
        beneficios: "Rica em minerais que ajudam na contração muscular correta.",
        preparo: { 
          limpeza: "Lave bem a salsinha.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e beba morno." 
        }, 
        contra: "Evite se tiver problemas renais graves." 
      },
      "Dor Ciática Aguda": { 
        nome: "Chá de Erva-de-São-João com Gengibre", 
        ingredientes: ["Hipérico", "Gengibre fresco"], 
        beneficios: "Combinação poderosa para reduzir a inflamação do nervo e a dor irradiada.",
        preparo: { 
          limpeza: "Lave os ingredientes.", 
          fogo: "Ferva o gengibre por 5 minutos.", 
          finalizacao: "Adicione o hipérico, abafe por 10 minutos e beba morno." 
        }, 
        contra: "Consulte um médico devido às interações do hipérico." 
      },
      "Inflamação de Tendão": { 
        nome: "Chá de Cavalinha com Cúrcuma", 
        ingredientes: ["Cavalinha", "Cúrcuma"], 
        beneficios: "A cavalinha fornece sílica para o tendão e a cúrcuma reduz a inflamação local.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. Beba 2 vezes ao dia." 
        }, 
        contra: "Não use por longos períodos devido à cavalinha." 
      },
      "Rigidez Matinal": { 
        nome: "Chá de Alecrim com Canela", 
        ingredientes: ["Alecrim", "Canela em pau"], 
        beneficios: "Melhora a circulação periférica e ajuda a 'aquecer' as articulações logo cedo.",
        preparo: { 
          limpeza: "Lave os ingredientes.", 
          fogo: "Ferva a canela por 5 minutos.", 
          finalizacao: "Adicione o alecrim, abafe por 5 minutos e beba quente." 
        }, 
        contra: "Evite se for hipertenso." 
      },
      "Dor de Crescimento": { 
        nome: "Chá de Camomila com Erva-Doce", 
        ingredientes: ["Camomila", "Erva-doce"], 
        beneficios: "Suave e relaxante, ajuda a aliviar o desconforto nas pernas de crianças em fase de crescimento.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Ofereça morno antes de dormir." 
        }, 
        contra: "Geralmente seguro para crianças." 
      },
      "Recuperação de Fratura": { 
        nome: "Chá de Consolida (Uso Externo)", 
        ingredientes: ["Raiz de Consolida"], 
        beneficios: "Contém alantoína, que estimula a regeneração óssea e de tecidos.",
        preparo: { 
          limpeza: "Lave bem a raiz.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Use o líquido para fazer compressas sobre o local da fratura (após retirada do gesso)." 
        }, 
        contra: "APENAS USO EXTERNO." 
      },
      "Dor no Joelho": { 
        nome: "Chá de Sucupira (Sementes)", 
        ingredientes: ["2 sementes de sucupira quebradas"], 
        beneficios: "Famoso por aliviar dores de desgaste no joelho e inflamações crônicas.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva as sementes quebradas por 10 minutos em 1 litro de água.", 
          finalizacao: "Beba ao longo do dia. O sabor é resinoso." 
        }, 
        contra: "Geralmente seguro, mas use com moderação." 
      },
      "Dor no Ombro": { 
        nome: "Chá de Salgueiro com Garra do Diabo", 
        ingredientes: ["Salgueiro branco", "Garra do diabo"], 
        beneficios: "Combinação analgésica forte para bursites e tendinites no ombro.",
        preparo: { 
          limpeza: "Lave as cascas/raízes.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Evite se tiver úlceras gástricas." 
      },
      "Túnel do Carpo": { 
        nome: "Chá de Vitamina B6 Natural (Aveia e Banana)", 
        ingredientes: ["Aveia", "Casca de banana"], 
        beneficios: "Ajuda na saúde dos nervos do punho, reduzindo o formigamento e a dor.",
        preparo: { 
          limpeza: "Lave a casca da banana.", 
          fogo: "Ferva os ingredientes por 10 minutos.", 
          finalizacao: "Coe e beba o líquido nutritivo." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Espasmos Musculares": { 
        nome: "Chá de Valeriana com Passiflora", 
        ingredientes: ["Raiz de valeriana", "Folhas de maracujá"], 
        beneficios: "Relaxante muscular e do sistema nervoso, interrompe espasmos causados por estresse.",
        preparo: { 
          limpeza: "Lave os ingredientes.", 
          fogo: "Ferva a raiz de valeriana por 5 minutos.", 
          finalizacao: "Adicione a passiflora, abafe por 10 minutos e beba." 
        }, 
        contra: "Causa muita sonolência." 
      },
      "Dor de Ouvido (Compressa)": { 
        nome: "Chá de Arruda (Uso Externo)", 
        ingredientes: ["Folhas de arruda"], 
        beneficios: "O calor da compressa com arruda ajuda a aliviar a dor de ouvido por inflamação.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Aqueça as folhas no vapor ou em infusão rápida.", 
          finalizacao: "Envolva as folhas mornas em um pano limpo e coloque SOBRE o ouvido (nunca dentro)." 
        }, 
        contra: "USO EXTERNO APENAS. Tóxico se ingerido." 
      },
      "Dor Ciática": {
        nome: "Chá de Erva-de-São-João com Camomila",
        ingredientes: ["1 colher de cada erva", "300ml de água"],
        beneficios: "Ajuda a reduzir a inflamação nervosa e a dor irradiada do nervo ciático.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 minutos e beba 2 vezes ao dia."
        },
        contra: "Cuidado com exposição ao sol após o uso (fotossensibilidade)."
      },
      "Artrite Reumatoide": {
        nome: "Chá de Boswellia Serrata",
        ingredientes: ["1 colher de chá de resina de Boswellia", "250ml de água"],
        beneficios: "Poderoso anti-inflamatório natural que reduz a rigidez matinal e a dor articular.",
        preparo: {
          limpeza: "Não precisa lavar.",
          fogo: "Ferva a resina por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe bem."
        },
        contra: "Pode causar desconforto gástrico leve."
      },
      "Câimbras Musculares": {
        nome: "Chá de Casca de Salgueiro com Magnésio",
        ingredientes: ["1 colher de casca de salgueiro", "Pitada de cloreto de magnésio", "300ml de água"],
        beneficios: "Alivia a dor muscular e repõe o mineral essencial para evitar contrações involuntárias.",
        preparo: {
          limpeza: "Lave a casca.",
          fogo: "Ferva a casca por 10 minutos.",
          finalizacao: "Adicione o magnésio após coar e beba antes de dormir."
        },
        contra: "Não use se for alérgico a aspirina."
      },
      "Tendinite e Inflamação": {
        nome: "Chá de Cavalinha com Unha-de-Gato",
        ingredientes: ["1 colher de cada erva", "400ml de água"],
        beneficios: "A unha-de-gato reduz a inflamação e a cavalinha ajuda na regeneração do tecido conjuntivo.",
        preparo: {
          limpeza: "Lave bem as ervas.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 10 minutos e beba ao longo do dia."
        },
        contra: "Evite se tiver doenças autoimunes."
      },
      "Dor Lombar": {
        nome: "Chá de Gengibre com Canela",
        ingredientes: ["2 rodelas de gengibre", "1 pau de canela", "300ml de água"],
        beneficios: "Aquece a região e aumenta a circulação, aliviando a tensão e a dor na lombar.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 15 minutos.",
          finalizacao: "Abafe por 5 minutos e beba bem quente."
        },
        contra: "Evite se tiver pressão alta descontrolada."
      },
      "Fibromialgia (Alívio)": {
        nome: "Chá de Valeriana com Erva-Doce",
        ingredientes: ["1 colher de raiz de valeriana", "1 colher de erva-doce", "250ml de água"],
        beneficios: "Promove o relaxamento muscular e ajuda a modular a percepção da dor crônica.",
        preparo: {
          limpeza: "Lave la raiz e as sementes.",
          fogo: "Ferva a valeriana por 5 min, adicione a erva-doce e desligue.",
          finalizacao: "Abafe por 15 minutos e beba à noite."
        },
        contra: "Pode causar sonolência intensa."
      },
      "Gota (Ácido Úrico)": {
        nome: "Chá de Chapéu-de-Couro",
        ingredientes: ["1 colher de sopa de folhas de chapéu-de-couro", "300ml de água"],
        beneficios: "Ajuda os rins a eliminar o excesso de ácido úrico, reduzindo as crises de gota.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver insuficiência renal grave."
      },
      "Bursite e Inchaço": {
        nome: "Chá de Salsaparrilha",
        ingredientes: ["1 colher de sopa de raiz de salsaparrilha", "300ml de água"],
        beneficios: "Depurativo e anti-inflamatório, auxilia na redução do inchaço nas bolsas sinoviais.",
        preparo: {
          limpeza: "Lave bem la raiz.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Pode causar irritação gástrica em doses elevadas."
      },
      "Dor de Dente (Emergência)": {
        nome: "Chá de Cravo-da-Índia (Bochecho)",
        ingredientes: ["10 cravos-da-índia", "100ml de água"],
        beneficios: "O eugenol do cravo atua como um anestésico local potente e antisséptico.",
        preparo: {
          limpeza: "Lave os cravos.",
          fogo: "Ferva por 10 minutos até ficar bem concentrado.",
          finalizacao: "Deixe amornar e faça bochechos no local da dor. Não engula."
        },
        contra: "Uso tópico apenas. Não substitui a visita ao dentista."
      },
      "Recuperação Pós-Cirúrgica": {
        nome: "Chá de Arnica (Homeopático/Diluído)",
        ingredientes: ["Flores de arnica", "1 litro de água"],
        beneficios: "Ajuda na reabsorção de hematomas e reduz o trauma tecidual pós-operatório.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Use para compressas externas ou beba apenas se for diluição homeopática orientada."
        },
        contra: "Arnica em chá concentrado é tóxica se ingerida. Use preferencialmente externo."
      },
      "Dor no Punho": {
        nome: "Chá de Salgueiro Branco",
        ingredientes: ["1 colher de sopa de casca de salgueiro", "250ml de água"],
        beneficios: "Contém salicina, precursora da aspirina, excelente para inflamações no punho e síndrome do túnel do carpo.",
        preparo: {
          limpeza: "Lave a casca.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Não usar se for alérgico a aspirina ou se estiver tomando anticoagulantes."
      },
      "Dor no Tornozelo": {
        nome: "Chá de Erva-Baleeira",
        ingredientes: ["1 colher de sopa de folhas de erva-baleeira", "250ml de água"],
        beneficios: "Poderoso anti-inflamatório natural, muito eficaz para entorses e dores nos tornozelos.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione as folhas, abafe por 10 minutos e beba morno."
        },
        contra: "Geralmente seguro, mas evite em excesso."
      },
      "Dor no Quadril": {
        nome: "Chá de Unha-de-Gato com Gengibre",
        ingredientes: ["1 colher de unha-de-gato", "2 fatias de gengibre", "300ml de água"],
        beneficios: "Combinação potente para reduzir a inflamação nas articulações grandes como o quadril.",
        preparo: {
          limpeza: "Lave os ingredientes.",
          fogo: "Ferva por 15 minutos em fogo baixo.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver doenças autoimunes ou se for fazer cirurgia em breve."
      },
      "Dor no Pescoço (Cervicalgia)": {
        nome: "Chá de Erva-Cidreira com Camomila",
        ingredientes: ["1 colher de cada erva", "250ml de água"],
        beneficios: "Ajuda a relaxar a musculatura do pescoço e ombros, aliviando a tensão cervical.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba antes de dormir."
        },
        contra: "Pode causar sonolência."
      },
      "Dor nos Dedos (Artrite)": {
        nome: "Chá de Sucupira",
        ingredientes: ["2 sementes de sucupira quebradas", "500ml de água"],
        beneficios: "Tradicionalmente usado para tratar dores ósseas e inflamações nas pequenas articulações dos dedos.",
        preparo: {
          limpeza: "Lave as sementes.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 10 minutos e beba ao longo do dia."
        },
        contra: "Não recomendado para crianças e gestantes."
      },
      "Dor Pós-Treino Intensa": {
        nome: "Chá de Cúrcuma com Pimenta Preta",
        ingredientes: ["1 colher de chá de cúrcuma", "Uma pitada de pimenta preta", "250ml de água"],
        beneficios: "A pimenta aumenta a absorção da curcumina, ajudando na recuperação muscular rápida.",
        preparo: {
          limpeza: "Use pós de boa procedência.",
          fogo: "Ferva a água e misture os pós.",
          finalizacao: "Abafe por 5 minutos e beba ainda morno."
        },
        contra: "Evite se tiver pedras na vesícula."
      },
      "Dor de Pancada (Hematoma)": {
        nome: "Chá de Confrei (Uso Externo)",
        ingredientes: ["2 colheres de folhas de confrei", "250ml de água"],
        beneficios: "Acelera a cicatrização de tecidos e a reabsorção de hematomas causados por pancadas.",
        preparo: {
          limpeza: "Lave bem as folhas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Deixe esfriar e use para fazer compressas no local da pancada."
        },
        contra: "APENAS USO EXTERNO. Tóxico se ingerido."
      },
      "Dor de Nervo Inflamado": {
        nome: "Chá de Hipérico (Erva-de-São-João)",
        ingredientes: ["1 colher de chá de hipérico", "250ml de água"],
        beneficios: "Ajuda na regeneração de nervos e alivia dores nevrálgicas.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Interage com muitos medicamentos (antidepressivos, anticoncepcionais). Consulte um médico."
      },
      "Dor de Má Postura": {
        nome: "Chá de Alecrim com Alfazema",
        ingredientes: ["1 raminho de cada", "300ml de água"],
        beneficios: "Melhora a circulação e relaxa os músculos tensionados por longas horas na mesma posição.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba morno."
        },
        contra: "Evite se tiver pressão alta descontrolada."
      },
      "Dor de Tensão nos Ombros": {
        nome: "Chá de Valeriana",
        ingredientes: ["1 colher de chá de raiz de valeriana", "250ml de água"],
        beneficios: "Relaxante muscular potente para tensões acumuladas na região do trapézio e ombros.",
        preparo: {
          limpeza: "Lave a raiz.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba à noite."
        },
        contra: "Não misturar com álcool ou outros sedativos."
      }
    }
  },
  "Imunidade": {
    icone: "🛡️",
    subs: {
      "Resfriado": { 
        nome: "Chá de Sabugueiro", 
        ingredientes: ["1 colher de sopa de flores de sabugueiro", "250ml de água"], 
        beneficios: "O sabugueiro é excelente para baixar a febre e reduzir a duração de resfriados, além de ajudar a limpar as vias respiratórias.",
        preparo: { 
          limpeza: "Lave as flores secas rapidamente em uma peneira fina.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as flores, abafe por 10 minutos. Beba bem quente e, se possível, deite-se em seguida para estimular o suor." 
        }, 
        contra: "Geralmente seguro. Evite o consumo de frutos verdes ou folhas da planta, que podem ser tóxicos." 
      },
      "Gripe Forte": { 
        nome: "Chá de Alho, Gengibre e Mel", 
        ingredientes: ["1 dente de alho amassado", "2 fatias de gengibre", "1 colher de mel", "Suco de 1 limão"], 
        beneficios: "Um verdadeiro antibiótico natural. O alho combate vírus, o gengibre reduz a dor no corpo e o mel acalma a garganta.",
        preparo: { 
          limpeza: "Descasque e amasse o alho (deixe descansar 5 min antes de usar para ativar a alicina). Lave o gengibre.", 
          fogo: "Ferva o alho e o gengibre por 5 minutos em 300ml de água.", 
          finalizacao: "Desligue, adicione o suco de limão e o mel. Beba o mais quente que conseguir suportar." 
        }, 
        contra: "Pode causar hálito forte e leve desconforto gástrico em pessoas com estômago muito sensível." 
      },
      "Tosse Seca": { 
        nome: "Chá de Guaco", 
        ingredientes: ["3 a 5 folhas de guaco fresco ou 1 colher de sopa de erva seca", "250ml de água"], 
        beneficios: "O guaco é um broncodilatador natural que ajuda a relaxar os pulmões e a eliminar a tosse persistente.",
        preparo: { 
          limpeza: "Lave bem as folhas frescas em água corrente.", 
          fogo: "Ferva a água, desligue e adicione as folhas.", 
          finalizacao: "Abafe por 10 a 15 minutos. Beba 3 vezes ao dia, preferencialmente adoçado com um pouco de mel." 
        }, 
        contra: "Não recomendado para quem usa medicamentos anticoagulantes, pois o guaco contém cumarina." 
      },
      "Catarro": { 
        nome: "Chá de Tomilho", 
        ingredientes: ["2 ramos de tomilho fresco ou 1 colher de sopa de tomilho seco", "250ml de água"], 
        beneficios: "O tomilho tem ação expectorante e antisséptica pulmonar, ajudando a soltar o catarro preso e a combater infecções.",
        preparo: { 
          limpeza: "Lave bem os ramos de tomilho fresco.", 
          fogo: "Ferva a água e despeje sobre a erva.", 
          finalizacao: "Abafe por 10 minutos. Inale o vapor que sai da xícara antes de beber para ajudar a abrir os brônquios." 
        }, 
        contra: "Evite se tiver gastrite ou úlceras gástricas ativas, pois pode ser levemente irritante." 
      },
      "Sinusite": { 
        nome: "Chá de Eucalipto", 
        ingredientes: ["3 a 5 folhas de eucalipto (próprio para chá)", "500ml de água"], 
        beneficios: "O cineol presente no eucalipto ajuda a dissolver o muco acumulado nos seios da face e facilita a respiração.",
        preparo: { 
          limpeza: "Lave bem as folhas de eucalipto.", 
          fogo: "Ferva a água com as folhas por 3 minutos.", 
          finalizacao: "Desligue e faça uma inalação do vapor por 5 minutos (com cuidado para não se queimar). Depois, coe e beba uma xícara." 
        }, 
        contra: "Não deve ser usado por crianças menores de 3 anos ou por pessoas com asma severa sem orientação médica." 
      },
      "Rinite": { 
        nome: "Chá de Ortiga", 
        ingredientes: ["1 colher de sopa de folhas de ortiga seca", "250ml de água"], 
        beneficios: "Atua como um anti-histamínico natural, reduzindo a coriza, os espirros e a coceira no nariz causados por alergias.",
        preparo: { 
          limpeza: "Lave a erva seca rapidamente (a ortiga seca não queima a mão).", 
          fogo: "Aqueça a água até ferver e desligue.", 
          finalizacao: "Adicione a ortiga, abafe por 10 minutos e coe. Beba 2 vezes ao dia durante as crises alérgicas." 
        }, 
        contra: "Pode causar queda de pressão em algumas pessoas. Não recomendado para quem tem problemas cardíacos ou renais graves." 
      },
      "Amigdalite": { 
        nome: "Chá de Romã", 
        ingredientes: ["Casca de meia romã", "300ml de água"], 
        beneficios: "A casca da romã é riquíssima em taninos com ação adstringente e antibacteriana, excelente para desinflamar as amígdalas.",
        preparo: { 
          limpeza: "Lave muito bem a casca externa da romã antes de usar.", 
          fogo: "Ferva a casca na água por 10 a 12 minutos (decocção).", 
          finalizacao: "Abafe por 5 minutos. Use o chá morno para fazer gargarejos profundos 3 a 4 vezes ao dia." 
        }, 
        contra: "Não deve ser ingerido em grandes quantidades, pois o excesso de taninos pode causar irritação gástrica." 
      },
      "Herpes": { 
        nome: "Chá de Equinácea", 
        ingredientes: ["1 colher de sopa de raízes ou folhas de equinácea", "250ml de água"], 
        beneficios: "Estimula o sistema imunológico a combater o vírus do herpes, reduzindo o tempo de cicatrização das feridas.",
        preparo: { 
          limpeza: "Lave bem a erva ou a raiz.", 
          fogo: "Ferva por 5 minutos se for raiz, ou apenas infusão se forem folhas.", 
          finalizacao: "Abafe por 10 minutos. Beba 3 vezes ao dia logo nos primeiros sinais de formigamento do herpes." 
        }, 
        contra: "Não recomendado para pessoas com doenças autoimunes (como lúpus ou esclerose múltipla). Não use por mais de 8 semanas." 
      },
      "Inflamação": { 
        nome: "Chá de Unha-de-Gato", 
        ingredientes: ["1 colher de sopa de cascas de unha-de-gato", "300ml de água"], 
        beneficios: "Um dos anti-inflamatórios naturais mais potentes do mundo, ajuda em qualquer processo inflamatório no corpo.",
        preparo: { 
          limpeza: "Lave bem os pedaços da casca.", 
          fogo: "Ferva a casca por 15 minutos em fogo baixo (decocção).", 
          finalizacao: "Desligue o fogo, abafe por 5 a 10 minutos e coe. Beba ao longo do dia." 
        }, 
        contra: "Contraindicado para quem vai passar por cirurgia, gestantes e mulheres que desejam engravidar." 
      },
      "Recuperação": { 
        nome: "Chá de Astragalus", 
        ingredientes: ["1 colher de sopa de raiz de Astragalus fatiada", "400ml de água"], 
        beneficios: "Fortalece a energia vital e ajuda o corpo a se recuperar após doenças longas ou períodos de grande debilidade física.",
        preparo: { 
          limpeza: "Lave bem as fatias da raiz.", 
          fogo: "Ferva a raiz por 20 a 30 minutos em fogo baixo para extrair todos os polissacarídeos.", 
          finalizacao: "Abafe por 10 minutos. O sabor é levemente adocicado e agradável. Pode ser tomado diariamente." 
        }, 
        contra: "Evite o uso se estiver com febre alta ou infecções agudas muito intensas." 
      },
      "Imunidade Baixa Crônica": { 
        nome: "Chá de Cogumelo Shiitake", 
        ingredientes: ["2 shiitakes secos", "300ml de água"], 
        beneficios: "Rico em lentinana, estimula a produção de glóbulos brancos de forma constante.",
        preparo: { 
          limpeza: "Lave os cogumelos.", 
          fogo: "Ferva por 15 minutos.", 
          finalizacao: "Beba o caldo e coma os cogumelos se desejar." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Prevenção de Inverno": { 
        nome: "Chá de Própolis com Limão", 
        ingredientes: ["10 gotas de extrato de própolis", "Suco de 1 limão", "200ml de água morna"], 
        beneficios: "Cria uma barreira protetora contra vírus e bactérias sazonais.",
        preparo: { 
          limpeza: "Lave o limão.", 
          fogo: "Aqueça a água sem ferver.", 
          finalizacao: "Misture tudo e beba em jejum." 
        }, 
        contra: "Evite se for alérgico a produtos de abelha." 
      },
      "Garganta Inflamada": { 
        nome: "Chá de Sálvia com Vinagre de Maçã", 
        ingredientes: ["Sálvia", "1 colher de vinagre de maçã"], 
        beneficios: "Poderoso antisséptico para gargarejo que elimina bactérias e reduz a dor.",
        preparo: { 
          limpeza: "Lave a sálvia.", 
          fogo: "Faça a infusão da sálvia.", 
          finalizacao: "Adicione o vinagre e faça gargarejos 3 vezes ao dia." 
        }, 
        contra: "Não engula o vinagre puro." 
      },
      "Pulmão Limpo": { 
        nome: "Chá de Pulmonária", 
        ingredientes: ["1 colher de folhas de pulmonária"], 
        beneficios: "Ajuda a regenerar os tecidos pulmonares e facilita a expectoração profunda.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Detox de Poluição": { 
        nome: "Chá de Clorela", 
        ingredientes: ["1 colher de chá de clorela em pó"], 
        beneficios: "Ajuda a filtrar metais pesados e toxinas inaladas no ar das grandes cidades.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Use água morna.", 
          finalizacao: "Misture bem e beba rapidamente." 
        }, 
        contra: "Pode causar gases inicialmente." 
      },
      "Sistema Linfático": { 
        nome: "Chá de Amor-do-Hortelão", 
        ingredientes: ["1 colher de erva seca"], 
        beneficios: "Estimula a drenagem linfática, ajudando a eliminar toxinas e reduzir inchaços ganglionares.",
        preparo: { 
          limpeza: "Lave a erva.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Evite se tiver problemas renais." 
      },
      "Candidíase Recorrente": { 
        nome: "Chá de Orégano com Alho", 
        ingredientes: ["Orégano", "1 dente de alho"], 
        beneficios: "Ação antifúngica potente que ajuda a equilibrar a flora e combater o excesso de fungos.",
        preparo: { 
          limpeza: "Lave os ingredientes.", 
          fogo: "Ferva o alho por 5 minutos.", 
          finalizacao: "Adicione o orégano, abafe por 10 minutos e beba." 
        }, 
        contra: "Sabor forte, pode causar hálito característico." 
      },
      "Infecção Urinária (Prevenção)": { 
        nome: "Chá de Cranberry (Frutos)", 
        ingredientes: ["Punhado de cranberries secos"], 
        beneficios: "Evita que as bactérias grudem nas paredes da bexiga.",
        preparo: { 
          limpeza: "Lave os frutos.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos e beba diariamente." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Estresse Oxidativo": { 
        nome: "Chá de Goji Berry", 
        ingredientes: ["1 colher de sopa de goji berries"], 
        beneficios: "Riquíssimo em antioxidantes que protegem as células do sistema imune.",
        preparo: { 
          limpeza: "Lave as bagas.", 
          fogo: "Ferva por 3 minutos.", 
          finalizacao: "Abafe por 5 minutos e coma as bagas ao final." 
        }, 
        contra: "Pode interagir com anticoagulantes." 
      },
      "Vitalidade Pós-Gripe": { 
        nome: "Chá de Mel com Pólen", 
        ingredientes: ["1 colher de mel", "Meia colher de pólen de abelha"], 
        beneficios: "Repõe nutrientes e energia perdidos durante o período de doença.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Use água morna.", 
          finalizacao: "Misture bem e beba para revitalizar o corpo." 
        }, 
        contra: "Evite se for alérgico a pólen." 
      },
      "Gripe Forte e Febre": {
        nome: "Chá de Sabugueiro com Mel",
        ingredientes: ["1 colher de flores de sabugueiro", "1 colher de mel", "250ml de água"],
        beneficios: "Reduz a febre e ajuda a combater o vírus da gripe de forma mais rápida.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione o sabugueiro, abafe por 10 min, coe e adicione o mel."
        },
        contra: "Geralmente seguro."
      },
      "Tosse Alérgica": {
        nome: "Chá de Guaco com Eucalipto",
        ingredientes: ["1 folha de guaco", "1 folha de eucalipto", "300ml de água"],
        beneficios: "Poderoso broncodilatador que ajuda a abrir as vias respiratórias e acalmar a tosse.",
        preparo: {
          limpeza: "Lave bem as folhas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba morno."
        },
        contra: "Evite se tiver problemas hepáticos graves."
      },
      "Sinusite e Congestão": {
        nome: "Chá de Hortelã com Gengibre (Inalação e Ingestão)",
        ingredientes: ["Folhas de hortelã", "1 rodela de gengibre", "400ml de água"],
        beneficios: "Ajuda a descongestionar os seios da face e reduzir a inflamação.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Inale o vapor por 5 minutos e depois beba o chá morno."
        },
        contra: "Evite se tiver refluxo severo."
      },
      "Fortalecimento Pulmonar": {
        nome: "Chá de Pulmonária",
        ingredientes: ["1 colher de chá de folhas de pulmonária", "200ml de água"],
        beneficios: "Tradicionalmente usado para fortalecer os pulmões e tratar doenças respiratórias crônicas.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a pulmonária, abafe por 10 minutos e coe."
        },
        contra: "Use com moderação."
      },
      "Garganta Inflamada e Dor": {
        nome: "Chá de Malva com Sálvia",
        ingredientes: ["1 colher de cada erva", "250ml de água"],
        beneficios: "A malva acalma a mucosa e a sálvia atua como um potente antisséptico bucal.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 minutos. Pode beber ou fazer gargarejos."
        },
        contra: "Evite sálvia durante a gravidez."
      },
      "Imunidade Intestinal": {
        nome: "Chá de Calêndula com Camomila",
        ingredientes: ["1 colher de cada flor", "300ml de água"],
        beneficios: "Ajuda a regenerar a mucosa intestinal, onde reside grande parte do sistema imune.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba ao longo do dia."
        },
        contra: "Geralmente seguro."
      },
      "Antiviral Natural": {
        nome: "Chá de Folha de Oliveira",
        ingredientes: ["1 colher de sopa de folhas de oliveira", "250ml de água"],
        beneficios: "Contém oleuropeína, que ajuda a combater vírus e bactérias patogênicas.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Pode baixar a pressão arterial."
      },
      "Recuperação de Virose": {
        nome: "Chá de Casca de Maçã com Cravo",
        ingredientes: ["Casca de 1 maçã", "2 cravos", "300ml de água"],
        beneficios: "Suave e hidratante, ajuda o corpo a se recuperar após episódios de vômito ou diarreia.",
        preparo: {
          limpeza: "Lave bem a maçã.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Proteção Contra Poluição": {
        nome: "Chá de Alecrim com Limão",
        ingredientes: ["1 raminho de alecrim", "Suco de meio limão", "250ml de água"],
        beneficios: "Rico em antioxidantes que ajudam a neutralizar os danos causados por poluentes ambientais.",
        preparo: {
          limpeza: "Lave o alecrim.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione o alecrim, abafe por 5 min, coe e adicione o limão."
        },
        contra: "Evite se for hipertenso."
      },
      "Energia Imunológica": {
        nome: "Chá de Astragalus",
        ingredientes: ["1 colher de chá de raiz de astragalus fatiada", "300ml de água"],
        beneficios: "Adaptógeno que fortalece o sistema imune a longo prazo e aumenta a vitalidade.",
        preparo: {
          limpeza: "Lave la raiz.",
          fogo: "Ferva por 20 minutos em fogo baixo.",
          finalizacao: "Abafe por 10 minutos e beba."
        },
        contra: "Evite se tiver doenças autoimunes em fase ativa."
      },
      "Imunidade Pós-Antibiótico": {
        nome: "Chá de Bardana com Dente-de-Leão",
        ingredientes: ["1 colher de cada raiz", "300ml de água"],
        beneficios: "Ajuda a limpar o sangue e apoia o fígado na recuperação após o uso de medicamentos fortes.",
        preparo: {
          limpeza: "Lave bem as raízes.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Evite se tiver obstrução das vias biliares."
      },
      "Prevenção de Alergias Sazonais": {
        nome: "Chá de Urtiga com Hortelã",
        ingredientes: ["1 colher de urtiga seca", "Folhas de hortelã", "250ml de água"],
        beneficios: "A urtiga tem propriedades anti-histamínicas naturais que ajudam a reduzir a rinite alérgica.",
        preparo: {
          limpeza: "Lave a hortelã.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione as ervas, abafe por 10 minutos e coe."
        },
        contra: "Pode interagir com medicamentos para pressão."
      },
      "Fortalecimento de Glóbulos Brancos": {
        nome: "Chá de Unha-de-Gato",
        ingredientes: ["1 colher de sopa de casca de unha-de-gato", "300ml de água"],
        beneficios: "Estimula a produção e atividade dos glóbulos brancos, essenciais para a defesa do corpo.",
        preparo: {
          limpeza: "Lave a casca.",
          fogo: "Ferva por 15 minutos.",
          finalizacao: "Abafe por 10 minutos e beba morno."
        },
        contra: "Não usar se estiver tentando engravidar ou se tiver doenças autoimunes."
      },
      "Proteção de Mucosas": {
        nome: "Chá de Alcaçuz com Marshmallow (Raiz)",
        ingredientes: ["Meia colher de cada raiz", "250ml de água"],
        beneficios: "Cria uma camada protetora nas mucosas respiratórias e digestivas contra invasores.",
        preparo: {
          limpeza: "Lave as raízes.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Evite se tiver pressão alta (devido ao alcaçuz)."
      },
      "Imunidade para Idosos": {
        nome: "Chá de Ginseng com Mel",
        ingredientes: ["1 fatia de raiz de ginseng", "1 colher de mel", "250ml de água"],
        beneficios: "Fortalece a resistência física e mental, apoiando o sistema imune em idades avançadas.",
        preparo: {
          limpeza: "Lave o ginseng.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Adicione o mel e beba pela manhã."
        },
        contra: "Pode causar insônia se tomado à noite."
      },
      "Recuperação de Fadiga Pós-Infecção": {
        nome: "Chá de Erva-Mate com Limão",
        ingredientes: ["1 colher de erva-mate", "Limão", "250ml de água"],
        beneficios: "Combate o cansaço residual após gripes e resfriados, fornecendo antioxidantes.",
        preparo: {
          limpeza: "Lave o limão.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe a erva por 5 min, coe e adicione o limão."
        },
        contra: "Evite se tiver gastrite ou insônia."
      },
      "Proteção contra Fungos": {
        nome: "Chá de Pau d'Arco (Ipê Roxo)",
        ingredientes: ["1 colher de sopa de casca de ipê roxo", "300ml de água"],
        beneficios: "Conhecido por suas propriedades antifúngicas e antibacterianas potentes.",
        preparo: {
          limpeza: "Lave a casca.",
          fogo: "Ferva por 10 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Não usar durante a gravidez."
      },
      "Equilíbrio do Sistema Linfático": {
        nome: "Chá de Amor-do-Hortelão (Cleavers)",
        ingredientes: ["1 colher de erva seca", "250ml de água"],
        beneficios: "Ajuda a drenar o sistema linfático, removendo toxinas e apoiando a imunidade.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Geralmente seguro."
      },
      "Imunidade e Estresse": {
        nome: "Chá de Ashwagandha",
        ingredientes: ["Meia colher de chá de pó de ashwagandha", "200ml de água ou leite vegetal"],
        beneficios: "Reduz o cortisol, impedindo que o estresse crônico enfraqueça o sistema imune.",
        preparo: {
          limpeza: "Use pó de qualidade.",
          fogo: "Aqueça o líquido e misture o pó.",
          finalizacao: "Misture bem e beba antes de dormir."
        },
        contra: "Consulte se tiver problemas de tireoide."
      },
      "Barreira Antiviral de Inverno": {
        nome: "Chá de Shiitake (Infusão)",
        ingredientes: ["2 cogumelos shiitake secos", "300ml de água"],
        beneficios: "Contém lentinana, que estimula as células de defesa contra vírus sazonais.",
        preparo: {
          limpeza: "Lave os cogumelos.",
          fogo: "Ferva por 15 minutos.",
          finalizacao: "Abafe por 5 minutos. Pode comer os cogumelos depois."
        },
        contra: "Geralmente seguro."
      }
    }
  },
  "Foco e Memória": {
    icone: "🧠",
    subs: {
      "Estudos": { 
        nome: "Chá de Alecrim", 
        ingredientes: ["1 raminho de alecrim fresco ou 1 colher de sopa de alecrim seco", "250ml de água"], 
        beneficios: "O alecrim é conhecido como a 'erva da memória'. Seu aroma e ativos estimulam a circulação cerebral e a retenção de informações.",
        preparo: { 
          limpeza: "Lave bem o raminho de alecrim em água corrente.", 
          fogo: "Ferva a água e desligue o fogo.", 
          finalizacao: "Adicione o alecrim, abafe por 10 minutos. Dica: deixe a xícara aberta por um momento para inalar o aroma antes de beber." 
        }, 
        contra: "Pode elevar levemente a pressão arterial. Evite o consumo excessivo à noite se tiver dificuldade para dormir." 
      },
      "Fadiga": { 
        nome: "Chá de Ginseng", 
        ingredientes: ["1 colher de chá de raiz de Ginseng fatiada", "250ml de água"], 
        beneficios: "Aumenta a resistência física e mental, combatendo o esgotamento e melhorando a resposta do corpo ao estresse.",
        preparo: { 
          limpeza: "Lave bem os pedaços da raiz.", 
          fogo: "Ferva a raiz na água por 10 minutos em fogo baixo.", 
          finalizacao: "Abafe por 5 minutos. Beba preferencialmente pela manhã para ter energia ao longo de todo o dia." 
        }, 
        contra: "Não recomendado para quem tem hipertensão, insônia crônica ou mulheres com câncer de mama (devido a efeitos estrogênicos)." 
      },
      "Clareza": { 
        nome: "Chá de Sálvia", 
        ingredientes: ["3 a 5 folhas de sálvia fresca", "200ml de água"], 
        beneficios: "Ajuda a 'limpar' a mente e melhora a velocidade de raciocínio, além de proteger as células cerebrais contra o envelhecimento.",
        preparo: { 
          limpeza: "Lave as folhas de sálvia cuidadosamente.", 
          fogo: "Aqueça a água até ferver e desligue.", 
          finalizacao: "Adicione as folhas, abafe por 8 minutos e coe. O sabor é forte e levemente canforado." 
        }, 
        contra: "Contraindicado para gestantes e mulheres que estão amamentando (pode secar o leite)." 
      },
      "Bloqueio": { 
        nome: "Chá de Bacopa Monnieri", 
        ingredientes: ["1 colher de chá de Bacopa seca", "250ml de água"], 
        beneficios: "Uma erva tradicional da medicina indiana que ajuda a reduzir a ansiedade e melhora a comunicação entre os neurônios.",
        preparo: { 
          limpeza: "Lave a erva seca rapidamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione a Bacopa, abafe por 10 a 12 minutos. O efeito é cumulativo, sendo melhor se tomado diariamente." 
        }, 
        contra: "Pode causar leve desconforto gástrico ou náuseas em jejum. Beba após uma leve refeição." 
      },
      "Esgotamento": { 
        nome: "Chá de Rhodiola Rosea", 
        ingredientes: ["1 colher de chá de raiz de Rhodiola picada", "250ml de água"], 
        beneficios: "Ajuda a mente a se recuperar de longos períodos de trabalho intelectual intenso, reduzindo a sensação de 'burnout'.",
        preparo: { 
          limpeza: "Lave bem os pedaços da raiz.", 
          fogo: "Ferva a raiz por 10 minutos em fogo baixo.", 
          finalizacao: "Abafe por 5 minutos e coe. Tem um leve aroma de rosas, o que torna o consumo muito agradável." 
        }, 
        contra: "Evite se você tiver transtorno bipolar ou se estiver em fases de mania/excitação excessiva." 
      },
      "TDAH": { 
        nome: "Chá de Ginkgo Biloba", 
        ingredientes: ["1 colher de sopa de folhas de Ginkgo Biloba", "250ml de água"], 
        beneficios: "Melhora a microcirculação cerebral, auxiliando na concentração e na redução da distração em tarefas complexas.",
        preparo: { 
          limpeza: "Lave as folhas secas rapidamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as folhas, abafe por 10 a 15 minutos. Beba uma xícara por dia, preferencialmente pela manhã." 
        }, 
        contra: "Pode aumentar o risco de sangramentos. Não use se tomar anticoagulantes ou se for fazer cirurgia." 
      },
      "Longevidade": { 
        nome: "Chá de Gotu Kola (Centelha Asiática)", 
        ingredientes: ["1 colher de sopa de folhas de Gotu Kola", "250ml de água"], 
        beneficios: "Conhecida como a 'erva da longevidade', ajuda a manter as funções cognitivas preservadas com o passar dos anos.",
        preparo: { 
          limpeza: "Lave as folhas cuidadosamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as folhas, abafe por 10 minutos. Pode ser tomado regularmente como um tônico cerebral." 
        }, 
        contra: "Em doses muito altas, pode causar sonolência ou afetar levemente a função do fígado." 
      },
      "Reuniões": { 
        nome: "Chá de Hortelã com Limão", 
        ingredientes: ["Um punhado de hortelã fresca", "Rodelas de 1 limão", "Água gelada ou quente"], 
        beneficios: "A combinação do mentol com o aroma cítrico desperta os sentidos e mantém o alerta mental sem causar agitação.",
        preparo: { 
          limpeza: "Lave muito bem a hortelã e o limão.", 
          fogo: "Se for quente, faça a infusão da hortelã por 5 minutos.", 
          finalizacao: "Adicione o limão por último. Se for frio, amasse a hortelã com o limão e adicione água gelada." 
        }, 
        contra: "Geralmente seguro para todos. Evite se tiver refluxo gastroesofágico severo." 
      },
      "Stress": { 
        nome: "Chá de Manjericão Sagrado (Tulsi)", 
        ingredientes: ["1 colher de sopa de folhas de Tulsi", "250ml de água"], 
        beneficios: "Considerada uma erva sagrada na Índia, ajuda a equilibrar as emoções e a manter a calma sob pressão.",
        preparo: { 
          limpeza: "Lave bem as folhas frescas ou secas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione o Tulsi, abafe por 10 minutos. Beba ao final de um dia estressante para 'resetar' a mente." 
        }, 
        contra: "Pode baixar os níveis de açúcar no sangue. Não recomendado para mulheres grávidas ou que amamentam." 
      },
      "Revitalização": { 
        nome: "Chá de Mate com Canela", 
        ingredientes: ["1 colher de sopa de erva-mate", "1 pau de canela", "300ml de água"], 
        beneficios: "Fornece energia rápida e duradoura, sendo excelente para substituir o café em momentos de cansaço mental.",
        preparo: { 
          limpeza: "Lave o pau de canela.", 
          fogo: "Ferva a água com a canela por 5 minutos.", 
          finalizacao: "Desligue, adicione a erva-mate, abafe por apenas 3 a 5 minutos (para não amargar) e coe." 
        }, 
        contra: "Contém cafeína. Evite se tiver sensibilidade a estimulantes, gastrite ou se for hipertenso." 
      },
      "Concentração em Provas": { 
        nome: "Chá de Guaraná com Hortelã", 
        ingredientes: ["Pó de guaraná", "Hortelã fresca"], 
        beneficios: "Dá o alerta do guaraná com o frescor da hortelã para manter o foco por horas.",
        preparo: { 
          limpeza: "Lave a hortelã.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Misture o pó e a hortelã, abafe por 5 minutos e beba." 
        }, 
        contra: "Evite se tiver arritmia." 
      },
      "Memória de Curto Prazo": { 
        nome: "Chá de Sálvia com Alecrim", 
        ingredientes: ["Sálvia", "Alecrim"], 
        beneficios: "Combinação clássica para melhorar a retenção de nomes e fatos recentes.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e beba durante o estudo." 
        }, 
        contra: "Pode elevar a pressão." 
      },
      "Raciocínio Lógico": { 
        nome: "Chá de Erva-Mate (Chimarrão)", 
        ingredientes: ["Erva-mate"], 
        beneficios: "Aumenta a velocidade de processamento mental e a clareza de raciocínio.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Use água a 70°C.", 
          finalizacao: "Beba de forma tradicional ou como infusão." 
        }, 
        contra: "Contém cafeína." 
      },
      "Criatividade": { 
        nome: "Chá de Cacau com Pimenta", 
        ingredientes: ["Nibs de cacau", "Pitada de pimenta"], 
        beneficios: "Estimula a dopamina e a circulação, favorecendo o fluxo criativo.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Ferva os nibs por 5 minutos.", 
          finalizacao: "Adicione a pimenta e beba morno." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Equilíbrio Mental": { 
        nome: "Chá de Gotu Kola", 
        ingredientes: ["Folhas de Gotu Kola"], 
        beneficios: "Acalma a mente enquanto mantém a lucidez, ideal para decisões difíceis.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Proteção Neuronal": { 
        nome: "Chá Verde (Matchá)", 
        ingredientes: ["Pó de Matchá"], 
        beneficios: "Rico em EGCG, protege os neurônios contra o estresse oxidativo.",
        preparo: { 
          limpeza: "Peneire o pó.", 
          fogo: "Água a 80°C.", 
          finalizacao: "Bata bem até espumar." 
        }, 
        contra: "Evite à noite." 
      },
      "Foco no Trabalho": { 
        nome: "Chá de Gengibre com Limão", 
        ingredientes: ["Gengibre", "Limão"], 
        beneficios: "Mantém o corpo e a mente despertos e ativos para tarefas repetitivas.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva o gengibre por 5 minutos.", 
          finalizacao: "Adicione o limão e beba." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Agilidade Mental": { 
        nome: "Chá de Ginkgo com Ginseng", 
        ingredientes: ["Ginkgo biloba", "Ginseng"], 
        beneficios: "Aumenta o fluxo sanguíneo e a energia mental simultaneamente.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva o ginseng por 10 minutos.", 
          finalizacao: "Adicione o ginkgo, abafe por 5 minutos e coe." 
        }, 
        contra: "Consulte se usar anticoagulantes." 
      },
      "Redução de Distração": { 
        nome: "Chá de Melissa com Alecrim", 
        ingredientes: ["Melissa", "Alecrim"], 
        beneficios: "A melissa acalma a ansiedade da distração e o alecrim foca a atenção.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Sono Reparador (Foco)": { 
        nome: "Chá de Ashwagandha com Leite", 
        ingredientes: ["Ashwagandha", "Leite vegetal"], 
        beneficios: "Garante que o cérebro descanse para estar focado no dia seguinte.",
        preparo: { 
          limpeza: "Lave a raiz.", 
          fogo: "Ferva a raiz no leite por 10 minutos.", 
          finalizacao: "Beba morno antes de dormir." 
        }, 
        contra: "Evite se estiver grávida." 
      },
      "Memória de Longo Prazo": {
        nome: "Chá de Gotu Kola (Centelha Asiática)",
        ingredientes: ["1 colher de chá de folhas de Gotu Kola", "200ml de água"],
        beneficios: "Conhecida como a 'erva da longevidade', melhora a microcirculação cerebral e a memória.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a erva, abafe por 10 minutos e beba."
        },
        contra: "Evite se tiver problemas hepáticos."
      },
      "Agilidade Mental II": {
        nome: "Chá de Guaraná com Hortelã",
        ingredientes: ["1 colher de chá de pó de guaraná", "Folhas de hortelã", "250ml de água"],
        beneficios: "Proporciona um alerta rápido e refrescante, ideal para momentos de cansaço mental.",
        preparo: {
          limpeza: "Lave a hortelã.",
          fogo: "Ferva a água com a hortelã por 2 min.",
          finalizacao: "Adicione o guaraná, misture bem e beba imediatamente."
        },
        contra: "Evite se tiver sensibilidade à cafeína ou arritmia."
      },
      "Redução de Névoa Mental": {
        nome: "Chá de Cogumelo Lion's Mane (Juba de Leão)",
        ingredientes: ["1 colher de chá de Lion's Mane em pó", "200ml de água"],
        beneficios: "Estimula o fator de crescimento nervoso (NGF), ajudando na clareza mental e foco.",
        preparo: {
          limpeza: "Não precisa lavar.",
          fogo: "Misture na água quente (não fervendo).",
          finalizacao: "Beba pela manhã para melhores resultados."
        },
        contra: "Geralmente seguro, mas consulte se tiver alergia a fungos."
      },
      "Foco Criativo": {
        nome: "Chá de Damiana",
        ingredientes: ["1 colher de chá de folhas de damiana", "250ml de água"],
        beneficios: "Ajuda a relaxar o corpo enquanto mantém a mente alerta e criativa.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a damiana, abafe por 10 minutos e coe."
        },
        contra: "Pode afetar os níveis de açúcar no sangue."
      },
      "Proteção Neuronal II": {
        nome: "Chá de Sálvia",
        ingredientes: ["1 colher de chá de folhas de sálvia", "200ml de água"],
        beneficios: "Melhora a atenção e a memória de trabalho, protegendo contra o declínio cognitivo.",
        preparo: {
          limpeza: "Lave bem as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a sálvia, abafe por 5 minutos e coe."
        },
        contra: "Evite o uso prolongado devido à tujona."
      },
      "Clareza de Pensamento": {
        nome: "Chá de Manjericão Sagrado (Tulsi)",
        ingredientes: ["1 colher de sopa de folhas de Tulsi", "250ml de água"],
        beneficios: "Adaptógeno que reduz o estresse mental e promove a clareza de pensamento.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione o Tulsi, abafe por 10 minutos e beba morno."
        },
        contra: "Pode ter efeito antifertilidade (estudos em animais)."
      },
      "Vigor Intelectual": {
        nome: "Chá de Rhodiola Rosea",
        ingredientes: ["1 colher de chá de raiz de Rhodiola", "300ml de água"],
        beneficios: "Aumenta a resistência ao estresse mental e reduz a fadiga durante estudos intensos.",
        preparo: {
          limpeza: "Lave a raiz.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Pode causar agitação se tomado em excesso."
      },
      "Memória Visual": {
        nome: "Chá de Mirtilo (Folhas e Frutos)",
        ingredientes: ["1 colher de sopa de folhas e frutos secos", "250ml de água"],
        beneficios: "Rico em antocianinas que melhoram a comunicação entre os neurônios.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba."
        },
        contra: "Geralmente seguro."
      },
      "Foco em Leitura": {
        nome: "Chá de Erva-Mate com Canela",
        ingredientes: ["1 colher de erva-mate", "1 pau de canela", "300ml de água"],
        beneficios: "Combina o estímulo da cafeína com o foco proporcionado pela canela.",
        preparo: {
          limpeza: "Lave a canela.",
          fogo: "Ferva a canela por 5 min, adicione a erva-mate e desligue.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "Evite se tiver sensibilidade a estimulantes."
      },
      "Paz Mental para Estudo": {
        nome: "Chá de Lavanda com Alecrim",
        ingredientes: ["Meia colher de cada erva", "200ml de água"],
        beneficios: "Reduz a ansiedade de provas enquanto mantém a mente afiada.",
        preparo: {
          limpeza: "Lave as flores e folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 5 minutos e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Concentração em Ambientes Barulhentos": {
        nome: "Chá de Manjericão com Melissa",
        ingredientes: ["1 colher de cada", "250ml de água"],
        beneficios: "Ajuda a isolar a mente de distrações externas e ruídos.",
        preparo: {
          limpeza: "Lave bem as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba em pequenos goles."
        },
        contra: "Geralmente seguro."
      },
      "Memória de Longo Prazo II": {
        nome: "Chá de Gotu Kola (Centelha Asiática)",
        ingredientes: ["1 colher de sopa de centelha seca", "300ml de água"],
        beneficios: "Conhecida como a 'erva da longevidade', fortalece a retenção de informações.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 minutos e coe."
        },
        contra: "Evite se tiver problemas hepáticos."
      },
      "Agilidade Mental III": {
        nome: "Chá de Guaraná com Hortelã",
        ingredientes: ["Meia colher de guaraná em pó", "Hortelã fresca", "200ml de água"],
        beneficios: "Proporciona um 'boost' rápido de energia e rapidez de raciocínio.",
        preparo: {
          limpeza: "Lave a hortelã.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Adicione a hortelã e o guaraná, abafe por 5 min e beba."
        },
        contra: "Evite se for hipertenso ou tiver arritmia."
      },
      "Foco em Cálculos e Lógica": {
        nome: "Chá de Sálvia com Gengibre",
        ingredientes: ["1 colher de sálvia", "1 rodela de gengibre", "250ml de água"],
        beneficios: "A sálvia melhora a precisão e o gengibre mantém o cérebro alerta.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o gengibre por 5 min.",
          finalizacao: "Adicione a sálvia, abafe por 5 min e coe."
        },
        contra: "Evite o uso contínuo de sálvia por mais de 2 semanas."
      },
      "Redução de Esquecimentos": {
        nome: "Chá de Casca de Maçã com Alecrim",
        ingredientes: ["Casca de 1 maçã", "1 raminho de alecrim", "300ml de água"],
        beneficios: "A quercetina da maçã e o ácido rosmarínico do alecrim protegem os neurônios.",
        preparo: {
          limpeza: "Lave muito bem.",
          fogo: "Ferva a casca por 5 min.",
          finalizacao: "Adicione o alecrim, abafe por 5 min e beba."
        },
        contra: "Geralmente seguro."
      },
      "Criatividade e Inspiração": {
        nome: "Chá de Jasmim com Casca de Laranja",
        ingredientes: ["Flores de jasmim", "Casca de laranja", "250ml de água"],
        beneficios: "O aroma cítrico e floral estimula as áreas criativas do cérebro.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a casca por 3 min.",
          finalizacao: "Adicione o jasmim, abafe por 5 min e beba apreciando o aroma."
        },
        contra: "Geralmente seguro."
      },
      "Foco em Escrita e Redação": {
        nome: "Chá de Melissa com Canela",
        ingredientes: ["1 colher de melissa", "1 pau de canela", "250ml de água"],
        beneficios: "Acalma a ansiedade da 'página em branco' e mantém o fluxo de ideias.",
        preparo: {
          limpeza: "Lave a canela.",
          fogo: "Ferva a canela por 5 min.",
          finalizacao: "Adicione a melissa, abafe por 10 min e coe."
        },
        contra: "Geralmente seguro."
      },
      "Memória de Nomes e Rostos": {
        nome: "Chá de Ginkgo Biloba com Ginseng",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Potente combinação para melhorar a circulação cerebral e a retenção de detalhes.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva o ginseng por 10 min.",
          finalizacao: "Adicione o ginkgo, abafe por 10 min e coe."
        },
        contra: "NÃO use se tomar anticoagulantes."
      },
      "Foco em Reuniões Longas": {
        nome: "Chá de Chá Verde com Limão e Mel",
        ingredientes: ["1 colher de chá verde", "Limão", "Mel", "500ml de água"],
        beneficios: "Energia sustentada e foco por várias horas, sem agitação.",
        preparo: {
          limpeza: "Lave o limão.",
          fogo: "Aqueça a água a 80°C.",
          finalizacao: "Abafe o chá verde por 3 min, adicione limão e mel e leve em uma garrafa térmica."
        },
        contra: "Evite se tiver gastrite."
      },
      "Equilíbrio de Dopamina (Foco)": {
        nome: "Chá de Mucuna Pruriens (Moderação)",
        ingredientes: ["Meia colher de chá de pó de mucuna", "200ml de água"],
        beneficios: "Fonte natural de L-Dopa, ajuda na motivação e no foco direcionado.",
        preparo: {
          limpeza: "Use pó puro.",
          fogo: "Aqueça a água e misture o pó.",
          finalizacao: "Misture bem e beba pela manhã. Use apenas sob orientação se possível."
        },
        contra: "Consulte um médico. Pode interagir com medicamentos para Parkinson."
      },
      "Protocolo: Anti-Ansiedade": {
        nome: "7 dias para acalmar o que ninguém conseguiu acalmar",
        ingredientes: ["Camomila", "Maracujá", "Melissa", "Erva-cidreira", "Passiflora", "Lavanda"],
        beneficios: "OBJETIVO: Reduzir ansiedade de forma progressiva e natural. META: Reduzir episódios de ansiedade em 70%.",
        preparo: {
          limpeza: "Siga o cronograma diário abaixo.",
          fogo: "Use água filtrada e não ferva as ervas delicadas.",
          finalizacao: "Pratique a atenção plena durante o consumo."
        },
        protocolo: [
          { dia: 1, titulo: "Consciência", descricao: "Identifique gatilhos. Camomila + Maracujá." },
          { dia: 2, titulo: "Âncora", descricao: "Âncora da manhã: Melissa + Erva-cidreira antes de olhar o celular." },
          { dia: 3, titulo: "Presença", descricao: "Técnica 5-4-3-2-1 + Camomila." },
          { dia: 4, titulo: "Corpo em Movimento", descricao: "15min de movimento + Passiflora + Melissa." },
          { dia: 5, titulo: "Expressão", descricao: "Diário da ansiedade (10min) + Maracujá + Camomila." },
          { dia: 6, titulo: "Detox Mental", descricao: "Detox de notícias 24h. Erva-cidreira + Lavanda + Prazer (música/série)." },
          { dia: 7, titulo: "Protocolo Permanente", descricao: "Chá manhã + 5-4-3-2-1 + Movimento + Diário + Sem notícia noite + Camomila antes de dormir." }
        ],
        contra: "Passiflora pode causar sonolência. Não substitui acompanhamento psicológico."
      }
    }
  },
  "Pele e Beleza": {
    icone: "✨",
    subs: {
      "Acne": { 
        nome: "Chá de Bardana", 
        ingredientes: ["1 colher de sobremesa de raiz de bardana picada", "250ml de água"], 
        beneficios: "A bardana é um poderoso depurativo do sangue que ajuda a eliminar toxinas, reduzindo a oleosidade da pele e a inflamação da acne.",
        preparo: { 
          limpeza: "Lave bem a raiz para remover qualquer resquício de terra.", 
          fogo: "Ferva a raiz na água por 10 minutos (decocção).", 
          finalizacao: "Abafe por 5 minutos e coe. Pode ser bebido ou usado frio como tônico facial com um algodão." 
        }, 
        contra: "Pode ter efeito laxante leve. Evite se tiver diarreia ou se estiver grávida." 
      },
      "Colágeno": { 
        nome: "Chá Branco", 
        ingredientes: ["1 colher de sobremesa de folhas de chá branco", "200ml de água"], 
        beneficios: "Riquíssimo em polifenóis que protegem o colágeno e a elastina da pele contra a degradação, mantendo a firmeza e a elasticidade.",
        preparo: { 
          limpeza: "Lave as folhas rapidamente.", 
          fogo: "Aqueça a água até começar a formar bolinhas no fundo (75-80°C), não deixe ferver.", 
          finalizacao: "Adicione as folhas, abafe por apenas 5 minutos para não amargar. Beba 2 xícaras ao dia." 
        }, 
        contra: "Contém cafeína. Evite se tiver sensibilidade a estimulantes ou gastrite severa." 
      },
      "Rugas": { 
        nome: "Chá de Rosa Mosqueta", 
        ingredientes: ["1 colher de sopa de frutos de rosa mosqueta secos", "250ml de água"], 
        beneficios: "Fonte excepcional de Vitamina C e ácidos graxos que estimulam a renovação celular e combatem o envelhecimento precoce.",
        preparo: { 
          limpeza: "Lave os frutos secos em água corrente.", 
          fogo: "Ferva os frutos na água por 5 a 8 minutos.", 
          finalizacao: "Abafe por 10 minutos. O sabor é levemente azedinho e muito refrescante." 
        }, 
        contra: "Geralmente muito seguro. Pessoas com propensão a cálculos renais de oxalato devem consumir com moderação." 
      },
      "Olheiras": { 
        nome: "Chá de Camomila (Compressa)", 
        ingredientes: ["2 saquinhos de chá de camomila ou 2 colheres de flores", "150ml de água"], 
        beneficios: "A ação calmante e vasoconstritora da camomila ajuda a reduzir o inchaço e a coloração escura das olheiras por cansaço.",
        preparo: { 
          limpeza: "Lave as flores se usar a erva a granel.", 
          fogo: "Faça uma infusão bem concentrada com pouca água.", 
          finalizacao: "Deixe o chá esfriar e coloque na geladeira. Aplique os saquinhos ou compressas de algodão geladas sobre os olhos por 15 minutos." 
        }, 
        contra: "Apenas uso externo. Evite se tiver alergia conhecida a pólen ou plantas da família das margaridas." 
      },
      "Cabelo": { 
        nome: "Chá de Alecrim (Enxágue Capilar)", 
        ingredientes: ["2 ramos grandes de alecrim fresco", "500ml de água"], 
        beneficios: "Estimula a circulação no couro cabeludo, combatendo a queda, a caspa e acelerando o crescimento dos fios.",
        preparo: { 
          limpeza: "Lave muito bem os ramos de alecrim.", 
          fogo: "Ferva o alecrim na água por 10 minutos.", 
          finalizacao: "Deixe esfriar completamente. Após lavar o cabelo normalmente, use este chá como último enxágue, massageando o couro cabeludo." 
        }, 
        contra: "Uso externo. Pode escurecer levemente cabelos muito claros ou tingidos de loiro platinado." 
      },
      "Pele Seca": { 
        nome: "Chá de Calêndula com Mel", 
        ingredientes: ["1 colher de sopa de flores de calêndula", "250ml de água", "1 colher de chá de mel"], 
        beneficios: "Hidrata a pele de dentro para fora e ajuda a acalmar irritações, vermelhidões e descamações comuns em peles secas.",
        preparo: { 
          limpeza: "Lave as flores secas ou frescas.", 
          fogo: "Ferva a água e despeje sobre as flores.", 
          finalizacao: "Abafe por 10 minutos, coe e adicione o mel enquanto estiver morno. Beba diariamente." 
        }, 
        contra: "Evite se for alérgico a produtos apícolas ou a plantas da família Asteraceae." 
      },
      "Detox Pele": { 
        nome: "Chá de Salsaparrilha", 
        ingredientes: ["1 colher de sopa de raiz de salsaparrilha", "300ml de água"], 
        beneficios: "Excelente para 'limpar' a pele de impurezas internas, sendo muito usado no tratamento auxiliar de psoríase e eczemas.",
        preparo: { 
          limpeza: "Lave bem os pedaços da raiz.", 
          fogo: "Ferva a raiz na água por 10 a 15 minutos (decocção).", 
          finalizacao: "Abafe por 5 minutos e coe. Beba 2 xícaras ao dia por períodos de até 2 semanas." 
        }, 
        contra: "Pode causar irritação na mucosa gástrica se tomado em excesso ou por tempo muito prolongado." 
      },
      "Manchas": { 
        nome: "Chá de Amora", 
        ingredientes: ["1 colher de sopa de folhas de amora seca", "250ml de água"], 
        beneficios: "Rico em antioxidantes que ajudam a uniformizar o tom da pele e combatem os danos causados pelo sol.",
        preparo: { 
          limpeza: "Lave as folhas secas rapidamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as folhas, abafe por 10 minutos e coe. Pode ser tomado quente ou gelado." 
        }, 
        contra: "Geralmente muito seguro. Pode ter um leve efeito hipoglicemiante (baixa o açúcar no sangue)." 
      },
      "Queimadura": { 
        nome: "Chá de Erva-Moura (Uso Externo)", 
        ingredientes: ["Um punhado de folhas de erva-moura", "500ml de água"], 
        beneficios: "Tradicionalmente usado para acalmar queimaduras leves de sol e coceiras intensas na pele devido à sua ação refrescante.",
        preparo: { 
          limpeza: "Lave muito bem as folhas frescas.", 
          fogo: "Ferva a água e despeje sobre as folhas.", 
          finalizacao: "Abafe por 15 minutos e deixe esfriar totalmente. Use compressas de pano limpo embebidas no chá sobre a área afetada." 
        }, 
        contra: "ATENÇÃO: Uso estritamente externo. A planta é tóxica se ingerida. Mantenha longe de crianças." 
      },
      "Antioxidante": { 
        nome: "Chá de Rooibos", 
        ingredientes: ["1 colher de chá de erva Rooibos", "250ml de água"], 
        beneficios: "Livre de cafeína e riquíssimo em minerais e antioxidantes que combatem os radicais livres, preservando a juventude da pele.",
        preparo: { 
          limpeza: "Lave a erva rapidamente em peneira fina.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione a erva, abafe por 7 a 10 minutos. Tem um sabor naturalmente adocicado e cor avermelhada linda." 
        }, 
        contra: "Extremamente seguro para todas as idades, inclusive gestantes e crianças, por não conter estimulantes." 
      },
      "Fortalecimento de Unhas": { 
        nome: "Chá de Cavalinha", 
        ingredientes: ["1 colher de cavalinha"], 
        beneficios: "Rica em silício, mineral essencial para unhas fortes e sem quebras.",
        preparo: { 
          limpeza: "Lave a erva.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. Beba 1 xícara ao dia." 
        }, 
        contra: "Não use por mais de 2 semanas seguidas." 
      },
      "Brilho no Cabelo": { 
        nome: "Chá de Hibisco (Enxágue)", 
        ingredientes: ["2 colheres de hibisco", "500ml de água"], 
        beneficios: "Fecha as cutículas do cabelo e proporciona um brilho intenso e cor vibrante.",
        preparo: { 
          limpeza: "Lave o hibisco.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Deixe esfriar e use como último enxágue no banho." 
        }, 
        contra: "Pode manchar cabelos loiros muito claros." 
      },
      "Redução de Poros": { 
        nome: "Chá Verde Gelado (Tônico)", 
        ingredientes: ["Chá verde concentrado"], 
        beneficios: "Ação adstringente que ajuda a fechar os poros e controlar a oleosidade.",
        preparo: { 
          limpeza: "Prepare o chá.", 
          fogo: "Infusão normal.", 
          finalizacao: "Gele bem e aplique com algodão no rosto limpo." 
        }, 
        contra: "Uso externo." 
      },
      "Hidratação Profunda": { 
        nome: "Chá de Aloe Vera (Suco)", 
        ingredientes: ["Gel de 1 folha de Aloe Vera", "Suco de limão"], 
        beneficios: "Hidrata as células da pele de dentro para fora, combatendo o ressecamento.",
        preparo: { 
          limpeza: "Lave bem a folha e retire apenas o gel transparente.", 
          fogo: "Não ferva.", 
          finalizacao: "Bata o gel com água e limão e beba imediatamente." 
        }, 
        contra: "Certifique-se de usar a espécie correta (Barbadensis Miller)." 
      },
      "Proteção Solar Interna": { 
        nome: "Chá de Tomate (Licopeno)", 
        ingredientes: ["1 tomate maduro picado"], 
        beneficios: "O licopeno ajuda a proteger a pele contra os danos dos raios UV.",
        preparo: { 
          limpeza: "Lave bem o tomate.", 
          fogo: "Ferva o tomate por 10 minutos.", 
          finalizacao: "Coe e beba o caldo morno. Adicione uma gota de azeite para absorção." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Firmeza da Pele": { 
        nome: "Chá de Centelha Asiática", 
        ingredientes: ["1 colher de centelha"], 
        beneficios: "Estimula a produção de colágeno e melhora a circulação, combatendo a flacidez.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Evite se tiver problemas hepáticos." 
      },
      "Detox de Maquiagem": { 
        nome: "Chá de Dente-de-Leão", 
        ingredientes: ["1 colher de dente-de-leão"], 
        beneficios: "Limpa o fígado, o que se reflete em uma pele mais limpa e sem impurezas.",
        preparo: { 
          limpeza: "Lave a erva.", 
          fogo: "Ferva por 3 minutos.", 
          finalizacao: "Abafe por 5 minutos e beba." 
        }, 
        contra: "Diurético potente." 
      },
      "Olheiras Profundas": { 
        nome: "Chá Preto (Compressa)", 
        ingredientes: ["2 saquinhos de chá preto"], 
        beneficios: "A cafeína ajuda a drenar os líquidos e clarear a região dos olhos.",
        preparo: { 
          limpeza: "Prepare o chá.", 
          fogo: "Infusão concentrada.", 
          finalizacao: "Gele os saquinhos e aplique nos olhos por 10 minutos." 
        }, 
        contra: "Uso externo." 
      },
      "Cicatrizante Natural": { 
        nome: "Chá de Calêndula com Própolis", 
        ingredientes: ["Calêndula", "5 gotas de própolis"], 
        beneficios: "Acelera a cicatrização de pequenas espinhas e marcas na pele.",
        preparo: { 
          limpeza: "Lave a calêndula.", 
          fogo: "Infusão da calêndula.", 
          finalizacao: "Adicione o própolis e beba ou aplique no local." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Rejuvenescimento": { 
        nome: "Chá de Romã com Gengibre", 
        ingredientes: ["Casca de romã", "Gengibre"], 
        beneficios: "Bomba de antioxidantes que combatem o envelhecimento celular.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e beba." 
        }, 
        contra: "Pode ser forte para o estômago." 
      },
      "Fortalecimento de Unhas II": {
        nome: "Chá de Cavalinha com Alecrim",
        ingredientes: ["1 colher de cada", "250ml de água"],
        beneficios: "Rico em sílica e minerais essenciais para a queratina das unhas.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a cavalinha por 5 min.",
          finalizacao: "Adicione o alecrim, abafe por 10 min e beba diariamente."
        },
        contra: "Evite se tiver problemas renais."
      },
      "Brilho do Cabelo": {
        nome: "Chá de Alecrim com Vinagre de Maçã (Enxágue)",
        ingredientes: ["2 colheres de alecrim", "1 colher de vinagre de maçã", "500ml de água"],
        beneficios: "Fecha as cutículas do fio e estimula o brilho natural.",
        preparo: {
          limpeza: "Lave o alecrim.",
          fogo: "Ferva o alecrim por 10 min.",
          finalizacao: "Deixe esfriar, adicione o vinagre e use no último enxágue do banho."
        },
        contra: "Uso externo. Evite se tiver couro cabeludo sensível."
      },
      "Redução de Poros Abertos": {
        nome: "Chá de Hamamélis (Tônico)",
        ingredientes: ["1 colher de hamamélis", "200ml de água"],
        beneficios: "Adstringente natural que ajuda a fechar os poros e controlar a oleosidade.",
        preparo: {
          limpeza: "Lave a erva.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 min, gele e use como tônico facial com algodão."
        },
        contra: "Uso externo."
      },
      "Pele Oleosa (Controle)": {
        nome: "Chá de Bardana com Sálvia",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Ajuda a equilibrar as glândulas sebáceas de dentro para fora.",
        preparo: {
          limpeza: "Lave as raízes e folhas.",
          fogo: "Ferva a bardana por 10 min.",
          finalizacao: "Adicione a sálvia, abafe por 5 min e coe."
        },
        contra: "Evite se estiver grávida."
      },
      "Pele Seca (Hidratação Interna)": {
        nome: "Chá de Semente de Linhaça com Camomila",
        ingredientes: ["1 colher de linhaça", "1 colher de camomila", "300ml de água"],
        beneficios: "As mucilagens da linhaça ajudam a manter a hidratação das mucosas e da pele.",
        preparo: {
          limpeza: "Lave as sementes.",
          fogo: "Ferva a linhaça por 5 min.",
          finalizacao: "Adicione a camomila, abafe por 10 min e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Manchas de Sol (Clareamento)": {
        nome: "Chá de Salsa com Limão",
        ingredientes: ["1 raminho de salsa", "Suco de meio limão", "250ml de água"],
        beneficios: "Rico em vitamina C e antioxidantes que ajudam na uniformidade do tom da pele.",
        preparo: {
          limpeza: "Lave bem a salsa.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe a salsa por 10 min, adicione o limão e beba imediatamente."
        },
        contra: "Evite exposição solar direta após manusear limão."
      },
      "Redução de Inchaço Facial": {
        nome: "Chá de Hibisco com Cavalinha",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Poderoso efeito drenante que reduz o inchaço matinal no rosto.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a cavalinha por 5 min.",
          finalizacao: "Adicione o hibisco, abafe por 5 min e beba gelado."
        },
        contra: "Pode baixar a pressão arterial."
      },
      "Saúde do Couro Cabeludo": {
        nome: "Chá de Tomilho com Hortelã",
        ingredientes: ["1 colher de cada", "250ml de água"],
        beneficios: "Antisséptico natural que ajuda a combater a caspa e a coceira.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 min e use para massagear o couro cabeludo."
        },
        contra: "Uso externo ou interno moderado."
      },
      "Pele Pós-Sol (Alívio)": {
        nome: "Chá de Camomila com Erva-Cidreira (Compressa)",
        ingredientes: ["2 colheres de cada", "500ml de água"],
        beneficios: "Acalma a pele queimada pelo sol e reduz a vermelhidão.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 20 min, gele bem e aplique com toalhas macias sobre a pele."
        },
        contra: "Uso externo."
      },
      "Elasticidade da Pele": {
        nome: "Chá de Chá Branco com Amora",
        ingredientes: ["1 colher de chá branco", "3 folhas de amora", "300ml de água"],
        beneficios: "Protege a elastina e o colágeno contra a degradação enzimática.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Aqueça a água a 80°C.",
          finalizacao: "Abafe por 5 minutos e beba 2 vezes ao dia."
        },
        contra: "Contém cafeína leve."
      }
    }
  },
  "Saúde Feminina": {
    icone: "🌸",
    subs: {
      "Cólica": { 
        nome: "Chá de Artemísia", 
        ingredientes: ["1 colher de sobremesa de folhas de artemísia", "250ml de água"], 
        beneficios: "Poderoso antiespasmódico que relaxa a musculatura uterina, aliviando as cólicas menstruais mais intensas.",
        preparo: { 
          limpeza: "Lave as folhas secas ou frescas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione a artemísia, abafe por 10 minutos. Comece a tomar 2 dias antes da menstruação chegar." 
        }, 
        contra: "ABSOLUTAMENTE PROIBIDO na gravidez, pois é abortivo. Também evite durante a amamentação." 
      },
      "Menopausa": { 
        nome: "Chá de Folhas de Amora", 
        ingredientes: ["1 colher de sopa de folhas de amora", "250ml de água"], 
        beneficios: "Contém fitoestrogênios naturais que ajudam a reduzir os fogachos (calores), a insônia e a irritabilidade da menopausa.",
        preparo: { 
          limpeza: "Lave as folhas secas cuidadosamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as folhas, abafe por 10 minutos. Beba 3 xícaras ao dia para um efeito hormonal equilibrado." 
        }, 
        contra: "Geralmente muito seguro. Pode interagir levemente com medicamentos para diabetes." 
      },
      "TPM Irritação": { 
        nome: "Chá de Passiflora (Folhas de Maracujá)", 
        ingredientes: ["1 colher de sopa de folhas de maracujá secas", "250ml de água"], 
        beneficios: "Acalma o sistema nervoso central, reduzindo a ansiedade, a irritabilidade e a oscilação de humor típica da TPM.",
        preparo: { 
          limpeza: "Lave as folhas secas rapidamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as folhas, abafe por 10 minutos. Beba preferencialmente no final da tarde ou à noite." 
        }, 
        contra: "Pode causar sonolência. Evite se precisar dirigir ou operar máquinas logo em seguida." 
      },
      "Fluxo": { 
        nome: "Chá de Algodoeiro", 
        ingredientes: ["1 colher de sopa de folhas de algodoeiro", "250ml de água"], 
        beneficios: "Ajuda a regular e reduzir o fluxo menstrual excessivo, além de auxiliar na recuperação do útero após o parto.",
        preparo: { 
          limpeza: "Lave bem as folhas de algodoeiro.", 
          fogo: "Ferva as folhas na água por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos e coe. Beba 2 vezes ao dia durante o período menstrual." 
        }, 
        contra: "Evite se tiver pressão arterial muito baixa ou se houver suspeita de gravidez." 
      },
      "Candidíase": { 
        nome: "Chá de Barbatimão (Banho de Assento)", 
        ingredientes: ["2 colheres de sopa de cascas de barbatimão", "1 litro de água"], 
        beneficios: "Ação adstringente e antifúngica poderosíssima que ajuda a combater o excesso de fungos e acalma a coceira local.",
        preparo: { 
          limpeza: "Lave bem os pedaços da casca.", 
          fogo: "Ferva a casca na água por 15 a 20 minutos (decocção).", 
          finalizacao: "Deixe amornar até uma temperatura agradável. Coe e use em uma bacia para banho de assento por 15 minutos." 
        }, 
        contra: "Uso externo. NUNCA beba se estiver grávida. Não substitui o tratamento médico convencional." 
      },
      "Libido": { 
        nome: "Chá de Catuaba", 
        ingredientes: ["1 colher de sopa de cascas de catuaba", "300ml de água"], 
        beneficios: "Conhecido tônico afrodisíaco que melhora a circulação sanguínea e aumenta a disposição física e o desejo.",
        preparo: { 
          limpeza: "Lave as cascas cuidadosamente.", 
          fogo: "Ferva a casca na água por 10 minutos (decocção).", 
          finalizacao: "Abafe por 5 minutos e coe. O efeito costuma ser sentido após alguns dias de uso regular." 
        }, 
        contra: "Pode causar insônia ou agitação em pessoas muito sensíveis. Evite tomar após as 18h." 
      },
      "Endometriose": { 
        nome: "Chá de Unha-de-Gato com Uxi Amarelo", 
        ingredientes: ["1 colher de sobremesa de cada casca", "500ml de água"], 
        beneficios: "A combinação clássica da fitoterapia brasileira para auxiliar no tratamento de miomas, cistos e inflamações uterinas.",
        preparo: { 
          limpeza: "Lave bem todas as cascas.", 
          fogo: "Ferva as cascas por 15 minutos em fogo baixo.", 
          finalizacao: "Divida em duas porções: tome uma pela manhã (Uxi) e outra à tarde (Unha-de-Gato) para melhores resultados." 
        }, 
        contra: "Não substitui o tratamento médico. Contraindicado para gestantes e lactantes." 
      },
      "Ovários": { 
        nome: "Chá de Agoniada", 
        ingredientes: ["1 colher de sopa de cascas de agoniada", "250ml de água"], 
        beneficios: "Ajuda a regular o ciclo menstrual e auxilia no tratamento de inflamações nos ovários e útero.",
        preparo: { 
          limpeza: "Lave bem as cascas da planta.", 
          fogo: "Ferva a casca por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos. Comece a tomar na semana anterior à menstruação para regular o ciclo." 
        }, 
        contra: "Pode causar diarreia em algumas pessoas. Não use durante a gravidez." 
      },
      "Inchaço TPM": { 
        nome: "Chá de Cabelo de Milho", 
        ingredientes: ["Um punhado de cabelo de milho seco", "250ml de água"], 
        beneficios: "Poderoso diurético natural que ajuda a eliminar a retenção de líquidos e o inchaço abdominal e nas pernas.",
        preparo: { 
          limpeza: "Lave o cabelo de milho em água corrente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione o cabelo de milho, abafe por 10 minutos e coe. Beba 3 xícaras ao longo do dia." 
        }, 
        contra: "Pode baixar os níveis de potássio se usado em excesso. Cuidado se já usa remédios diuréticos." 
      },
      "Pele TPM": { 
        nome: "Chá de Prímula", 
        ingredientes: ["1 colher de chá de erva de prímula", "200ml de água"], 
        beneficios: "Ajuda a equilibrar os ácidos graxos no corpo, reduzindo a acne hormonal e a sensibilidade nos seios durante a TPM.",
        preparo: { 
          limpeza: "Lave a erva seca rapidamente.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione a erva, abafe por 10 minutos. O uso contínuo apresenta melhores resultados na pele." 
        }, 
        contra: "Pode causar náuseas ou dor de cabeça leve em algumas pessoas. Consulte um médico se tiver epilepsia." 
      },
      "Fertilidade (Apoio)": { 
        nome: "Chá de Maca Peruana", 
        ingredientes: ["1 colher de chá de maca em pó"], 
        beneficios: "Ajuda no equilíbrio hormonal e aumenta a vitalidade reprodutiva.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Use água morna.", 
          finalizacao: "Misture bem e beba pela manhã." 
        }, 
        contra: "Consulte se tiver problemas de tireoide." 
      },
      "Pós-Parto (Recuperação)": { 
        nome: "Chá de Cominho", 
        ingredientes: ["1 colher de sementes de cominho"], 
        beneficios: "Ajuda o útero a voltar ao tamanho normal e reduz cólicas pós-parto.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos e beba." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Amamentação (Estímulo)": { 
        nome: "Chá de Erva-Doce com Funcho", 
        ingredientes: ["Erva-doce", "Funcho"], 
        beneficios: "Tradicionalmente usado para aumentar a produção de leite materno.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e beba morno." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Ovários Policísticos": { 
        nome: "Chá de Hortelã (Spearmint)", 
        ingredientes: ["Folhas de hortelã comum"], 
        beneficios: "Ajuda a reduzir os níveis de testosterona em excesso, combatendo pelos indesejados e acne.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba 2 vezes ao dia." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Secura Vaginal": { 
        nome: "Chá de Sálvia (Uso Interno)", 
        ingredientes: ["Folhas de sálvia"], 
        beneficios: "Ajuda a regular a hidratação das mucosas através do equilíbrio estrogênico.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Não use se estiver amamentando (seca o leite)." 
      },
      "Libido Feminina": { 
        nome: "Chá de Damiana", 
        ingredientes: ["1 colher de folhas de damiana"], 
        beneficios: "Tônico sexual que ajuda a aumentar a sensibilidade e o desejo feminino.",
        preparo: { 
          limpeza: "Lave as folhas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Beba à noite." 
        }, 
        contra: "Pode afetar os níveis de açúcar no sangue." 
      },
      "Equilíbrio de Estrogênio": { 
        nome: "Chá de Linhaça (Infusão)", 
        ingredientes: ["1 colher de sementes de linhaça"], 
        beneficios: "As lignanas da linhaça ajudam a modular o estrogênio no corpo.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos e beba o líquido viscoso." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Prevenção de Infecção": { 
        nome: "Chá de Barbatimão (Uso Interno)", 
        ingredientes: ["Pequeno pedaço de casca de barbatimão"], 
        beneficios: "Ação anti-inflamatória e antisséptica para o trato urinário e reprodutor.",
        preparo: { 
          limpeza: "Lave bem a casca.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e beba em pequenas doses." 
        }, 
        contra: "PROIBIDO para gestantes." 
      },
      "Bem-estar na Menopausa": { 
        nome: "Chá de Cimicífuga", 
        ingredientes: ["1 colher de raiz de cimicífuga"], 
        beneficios: "Excelente para reduzir os calores e a irritabilidade da menopausa.",
        preparo: { 
          limpeza: "Lave a raiz.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e coe." 
        }, 
        contra: "Consulte se tiver problemas de fígado." 
      },
      "Autoestima": { 
        nome: "Chá de Jasmim", 
        ingredientes: ["Flores de jasmim"], 
        beneficios: "O aroma e o sabor ajudam a elevar o humor e a sensação de bem-estar feminino.",
        preparo: { 
          limpeza: "Lave as flores.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 5 minutos. Beba apreciando o aroma." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Regulação Hormonal": {
        nome: "Chá de Vitex (Agno-Casto)",
        ingredientes: ["1 colher de chá de frutos de vitex", "250ml de água"],
        beneficios: "Ajuda a equilibrar a progesterona e o estrogênio, regulando o ciclo menstrual.",
        preparo: {
          limpeza: "Lave os frutos.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Não usar com anticoncepcionais ou tratamentos hormonais sem orientação médica."
      },
      "Cistite (Alívio)": {
        nome: "Chá de Cabelo de Milho com Quebra-Pedra",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Diurético e calmante para as vias urinárias, aliviando o desconforto da cistite.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba bastante água junto."
        },
        contra: "Consulte se tiver pedras nos rins grandes."
      },
      "Libido (Aumento)": {
        nome: "Chá de Damiana",
        ingredientes: ["1 colher de chá de folhas de damiana", "200ml de água"],
        beneficios: "Tradicional afrodisíaco feminino que ajuda a aumentar o desejo e a sensibilidade.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba à noite."
        },
        contra: "Evite se tiver diabetes (pode baixar o açúcar)."
      },
      "Pele na Menopausa": {
        nome: "Chá de Amora com Gérmen de Soja",
        ingredientes: ["Folhas de amora", "1 colher de gérmen de soja"],
        beneficios: "Rico em isoflavonas que ajudam a manter a elasticidade da pele durante a queda hormonal.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver restrição a soja."
      },
      "Ansiedade Pré-Menstrual": {
        nome: "Chá de Passiflora com Melissa",
        ingredientes: ["1 colher de cada", "250ml de água"],
        beneficios: "Acalma a irritabilidade e a oscilação de humor típicas da TPM.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba 2 vezes ao dia na semana da TPM."
        },
        contra: "Pode causar sonolência."
      },
      "Sono na Menopausa": {
        nome: "Chá de Valeriana com Lúpulo",
        ingredientes: ["Meia colher de cada", "200ml de água"],
        beneficios: "Ajuda a combater a insônia causada pelos fogachos e suores noturnos.",
        preparo: {
          limpeza: "Lave as raízes/flores.",
          fogo: "Ferva la valeriana por 5 min.",
          finalizacao: "Adicione o lúpulo, abafe por 5 min e coe."
        },
        contra: "Evite se tiver depressão severa (lúpulo pode ser depressor)."
      },
      "Retenção de Líquidos TPM": {
        nome: "Chá de Cavalinha com Hibisco",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Reduz o inchaço nas pernas e abdômen comum no período pré-menstrual.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e coe."
        },
        contra: "Evite se tiver pressão baixa."
      },
      "Saúde dos Seios (Alívio)": {
        nome: "Chá de Calêndula (Compressa)",
        ingredientes: ["2 colheres de flores de calêndula", "250ml de água"],
        beneficios: "Alivia a sensibilidade e o inchaço nos seios (mastalgia) através de compressas mornas.",
        preparo: {
          limpeza: "Lave as flores.",
          fogo: "Ferva por 3 minutos.",
          finalizacao: "Deixe amornar, embeba uma gaze e aplique nos seios por 15 min."
        },
        contra: "Apenas uso externo para este fim."
      },
      "Equilíbrio da Tireoide (Feminino)": {
        nome: "Chá de Alga Fucus (Moderação)",
        ingredientes: ["Meia colher de chá de fucus", "250ml de água"],
        beneficios: "Fonte natural de iodo que pode apoiar a tireoide (consulte seu médico primeiro).",
        preparo: {
          limpeza: "Lave a alga.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 5 minutos e coe."
        },
        contra: "PROIBIDO se tiver hipertireoidismo ou sensibilidade ao iodo."
      },
      "Vigor e Vitalidade Feminina": {
        nome: "Chá de Shatavari",
        ingredientes: ["1 colher de chá de pó de shatavari", "200ml de leite ou água"],
        beneficios: "Tônico ayurvédico que nutre o sistema reprodutor e aumenta a energia vital feminina.",
        preparo: {
          limpeza: "Use pó puro.",
          fogo: "Aqueça o líquido e misture o pó.",
          finalizacao: "Misture bem e beba pela manhã."
        },
        contra: "Geralmente seguro."
      },
      "Endometriose (Alívio Inflamatório)": {
        nome: "Chá de Curcuma com Gengibre e Pimenta Preta",
        ingredientes: ["1 colher de chá de curcuma", "1 rodela de gengibre", "Pitada de pimenta preta", "300ml de água"],
        beneficios: "Poderoso anti-inflamatório que ajuda a reduzir as dores crônicas da endometriose.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva o gengibre por 5 min.",
          finalizacao: "Adicione a curcuma e a pimenta, abafe por 10 min e beba morno."
        },
        contra: "Evite se tomar anticoagulantes."
      },
      "Candidíase (Apoio Interno)": {
        nome: "Chá de Barbatimão com Orégano",
        ingredientes: ["1 pedaço pequeno de casca de barbatimão", "1 colher de orégano", "300ml de água"],
        beneficios: "Propriedades antifúngicas potentes que auxiliam no combate à Candida de dentro para fora.",
        preparo: {
          limpeza: "Lave a casca.",
          fogo: "Ferva o barbatimão por 10 min.",
          finalizacao: "Adicione o orégano, abafe por 10 min e coe."
        },
        contra: "Não use por mais de 7 dias seguidos."
      },
      "Infecção Urinária (Prevenção)": {
        nome: "Chá de Cranberry com Cabelo de Milho",
        ingredientes: ["1 colher de cranberry seco", "1 punhado de cabelo de milho", "400ml de água"],
        beneficios: "Evita a adesão de bactérias na bexiga e tem efeito diurético suave.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba ao longo do dia."
        },
        contra: "Geralmente seguro."
      },
      "Libido Feminina II": {
        nome: "Chá de Damiana com Canela",
        ingredientes: ["1 colher de damiana", "1 pau de canela", "250ml de água"],
        beneficios: "Estimulante natural que ajuda a aumentar o desejo e a circulação na região pélvica.",
        preparo: {
          limpeza: "Lave a canela.",
          fogo: "Ferva a canela por 5 min.",
          finalizacao: "Adicione a damiana, abafe por 10 min e beba morno."
        },
        contra: "Pode afetar os níveis de açúcar no sangue."
      },
      "Saúde Pós-Parto (Recuperação)": {
        nome: "Chá de Erva-Doce com Camomila",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Acalma a mãe, ajuda na digestão e pode auxiliar na redução de cólicas no bebê via leite materno.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Amamentação (Estímulo de Leite)": {
        nome: "Chá de Funcho com Algodoeiro",
        ingredientes: ["1 colher de funcho", "1 folha de algodoeiro", "300ml de água"],
        beneficios: "Galactagogo tradicional que ajuda a aumentar a produção de leite materno.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva por 3 minutos.",
          finalizacao: "Abafe por 10 minutos e beba 2 vezes ao dia."
        },
        contra: "Consulte o pediatra antes de usar ervas na amamentação."
      },
      "Equilíbrio de Progesterona": {
        nome: "Chá de Vitex (Agno-Casto)",
        ingredientes: ["1 colher de chá de frutos de vitex", "250ml de água"],
        beneficios: "Ajuda a regular a produção de progesterona, sendo útil para ciclos irregulares.",
        preparo: {
          limpeza: "Lave os frutos.",
          fogo: "Ferva por 5 minutos.",
          finalizacao: "Abafe por 10 minutos e beba pela manhã."
        },
        contra: "Não use se estiver grávida ou amamentando."
      },
      "Saúde dos Ovários (SOP)": {
        nome: "Chá de Hortelã-Pimenta com Canela",
        ingredientes: ["1 colher de hortelã", "1 pau de canela", "300ml de água"],
        beneficios: "Estudos sugerem que a hortelã pode ajudar a reduzir os níveis de testosterona na SOP.",
        preparo: {
          limpeza: "Lave bem.",
          fogo: "Ferva a canela por 5 min.",
          finalizacao: "Adicione a hortelã, abafe por 10 min e beba morno."
        },
        contra: "Geralmente seguro."
      },
      "Pele na Menopausa II": {
        nome: "Chá de Amora com Sálvia",
        ingredientes: ["1 colher de cada", "300ml de água"],
        beneficios: "Combate o ressecamento da pele e os calores (fogachos) da menopausa.",
        preparo: {
          limpeza: "Lave as folhas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 15 minutos e beba gelado."
        },
        contra: "Evite se tiver histórico de câncer sensível a hormônios."
      },
      "Ansiedade Hormonal": {
        nome: "Chá de Passiflora com Melissa",
        ingredientes: ["1 colher de cada", "250ml de água"],
        beneficios: "Acalma as oscilações de humor causadas pelas variações hormonais mensais.",
        preparo: {
          limpeza: "Lave as ervas.",
          fogo: "Ferva a água e desligue.",
          finalizacao: "Abafe por 10 minutos e beba à noite."
        },
        contra: "Pode causar sonolência."
      }
    }
  },
  "Esportes": {
    icone: "👟",
    subs: {
      "Pré-Treino": { 
        nome: "Chá de Guaraná com Gengibre", 
        ingredientes: ["1 colher de chá de guaraná em pó", "2 fatias de gengibre", "250ml de água"], 
        beneficios: "Fornece energia imediata, aumenta o foco e acelera o metabolismo, preparando o corpo para o esforço físico.",
        preparo: { 
          limpeza: "Lave o gengibre.", 
          fogo: "Ferva o gengibre por 5 minutos.", 
          finalizacao: "Desligue, adicione o pó de guaraná, misture bem e beba morno 30 minutos antes do treino." 
        }, 
        contra: "Evite se tiver arritmia cardíaca, hipertensão severa ou sensibilidade extrema à cafeína." 
      },
      "Recuperação": { 
        nome: "Chá de Cúrcuma e Melancia (Suco/Chá)", 
        ingredientes: ["1 colher de chá de cúrcuma", "Casca branca de melancia (opcional)", "250ml de água"], 
        beneficios: "A cúrcuma reduz a inflamação muscular pós-treino, enquanto a citrulina (da melancia) ajuda na remoção de amônia.",
        preparo: { 
          limpeza: "Lave a raiz de cúrcuma ou use o pó.", 
          fogo: "Ferva a cúrcuma por 10 minutos.", 
          finalizacao: "Deixe esfriar e beba. Se usar a casca de melancia, ferva-a junto com a cúrcuma." 
        }, 
        contra: "Geralmente seguro. Evite se tiver obstrução biliar." 
      },
      "Fadiga": { 
        nome: "Chá de Tribulus Terrestris", 
        ingredientes: ["1 colher de sopa de erva de Tribulus", "300ml de água"], 
        beneficios: "Ajuda na recuperação hormonal natural e aumenta a disposição e a força muscular ao longo do tempo.",
        preparo: { 
          limpeza: "Lave a erva seca.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione a erva, abafe por 10 minutos e coe. Beba preferencialmente pela manhã." 
        }, 
        contra: "Pode causar alterações hormonais. Não recomendado para menores de 18 anos ou gestantes." 
      },
      "Resistência": { 
        nome: "Chá de Cogumelo Cordyceps", 
        ingredientes: ["1 colher de chá de Cordyceps seco ou em pó", "250ml de água"], 
        beneficios: "Aumenta a utilização de oxigênio pelas células, melhorando a resistência aeróbica em treinos longos.",
        preparo: { 
          limpeza: "Lave se for o cogumelo inteiro.", 
          fogo: "Ferva por 15 minutos em fogo baixo.", 
          finalizacao: "Abafe por 5 minutos. Tem um sabor terroso peculiar, pode ser misturado com outros chás." 
        }, 
        contra: "Consulte um médico se tiver doenças autoimunes ou se usar medicamentos imunossupressores." 
      },
      "Cãibras": { 
        nome: "Chá de Casca de Banana", 
        ingredientes: ["Casca de 1 banana orgânica bem lavada", "300ml de água"], 
        beneficios: "Riquíssimo em potássio e magnésio, minerais essenciais para prevenir contrações musculares involuntárias.",
        preparo: { 
          limpeza: "Lave a casca muito bem com uma escovinha e sabão neutro.", 
          fogo: "Ferva a casca picada na água por 10 minutos.", 
          finalizacao: "Coe e beba a água. O sabor é suave e lembra levemente a fruta." 
        }, 
        contra: "Certifique-se de que a banana é orgânica para evitar a ingestão de agrotóxicos da casca." 
      },
      "Isotônico": { 
        nome: "Chá de Hibisco com Sal e Mel", 
        ingredientes: ["1 colher de sopa de hibisco", "Uma pitada de sal marinho", "1 colher de mel", "500ml de água"], 
        beneficios: "Repõe eletrólitos perdidos no suor e fornece glicose rápida, mantendo a hidratação e a energia durante o exercício.",
        preparo: { 
          limpeza: "Lave o hibisco rapidamente.", 
          fogo: "Faça a infusão do hibisco por 5 minutos.", 
          finalizacao: "Adicione o sal e o mel, misture bem e deixe gelar. Beba em pequenos goles durante o treino." 
        }, 
        contra: "Cuidado se tiver pressão muito baixa, pois o hibisco pode baixá-la ainda mais." 
      },
      "Performance": { 
        nome: "Chá de Beterraba (Infusão)", 
        ingredientes: ["Meia beterraba fatiada", "300ml de água"], 
        beneficios: "Os nitratos da beterraba melhoram a eficiência mitocondrial, permitindo treinar com mais intensidade por mais tempo.",
        preparo: { 
          limpeza: "Lave e descasque a beterraba.", 
          fogo: "Ferva as fatias por 10 minutos.", 
          finalizacao: "Beba o líquido roxo intenso cerca de 2 horas antes da atividade física principal." 
        }, 
        contra: "Pode causar 'beeturia' (urina ou fezes rosadas), o que é inofensivo. Evite se tiver cálculos renais de oxalato." 
      },
      "Concentração": { 
        nome: "Chá de Casca de Cacau", 
        ingredientes: ["1 colher de sopa de cascas de cacau", "250ml de água"], 
        beneficios: "Contém teobromina, que melhora o fluxo sanguíneo e o estado de alerta sem a 'queda' brusca da cafeína.",
        preparo: { 
          limpeza: "Lave as cascas de cacau.", 
          fogo: "Ferva as cascas por 5 minutos.", 
          finalizacao: "Abafe por 10 minutos. Tem um aroma delicioso de chocolate amargo." 
        }, 
        contra: "Contém estimulantes leves. Evite se tiver insônia ou sensibilidade cardíaca." 
      },
      "Tendões": { 
        nome: "Chá de Cavalinha com Bambu", 
        ingredientes: ["1 colher de chá de cada erva", "300ml de água"], 
        beneficios: "Riquíssimo em sílica orgânica, mineral fundamental para a síntese de colágeno nos tendões e ligamentos.",
        preparo: { 
          limpeza: "Lave as ervas secas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as ervas, abafe por 10 a 15 minutos e coe. Beba 1 vez ao dia." 
        }, 
        contra: "Diurético muito potente. Não use por mais de 2 semanas seguidas sem pausa." 
      },
      "Vigor": { 
        nome: "Chá de Marapuama", 
        ingredientes: ["1 colher de sopa de cascas de marapuama", "250ml de água"], 
        beneficios: "Tônico neuromuscular que combate a fraqueza e aumenta o vigor físico e a resistência ao cansaço.",
        preparo: { 
          limpeza: "Lave bem as cascas.", 
          fogo: "Ferva a casca por 10 minutos (decocção).", 
          finalizacao: "Abafe por 5 minutos e coe. Beba preferencialmente pela manhã." 
        }, 
        contra: "Pode causar tremores ou palpitações em doses elevadas. Evite se for hipertenso." 
      },
      "Explosão Muscular": { 
        nome: "Chá de Creatina Natural (Espinafre)", 
        ingredientes: ["Punhado de espinafre fresco"], 
        beneficios: "O espinafre contém nitratos que ajudam na força e explosão muscular.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva por 3 minutos.", 
          finalizacao: "Beba o caldo verde antes do treino." 
        }, 
        contra: "Evite se tiver pedras nos rins." 
      },
      "Resistência de Longa Duração": { 
        nome: "Chá de Chia (Infusão)", 
        ingredientes: ["1 colher de chia"], 
        beneficios: "Libera energia de forma lenta e constante, ideal para maratonas ou treinos longos.",
        preparo: { 
          limpeza: "Não precisa lavar.", 
          fogo: "Não ferva.", 
          finalizacao: "Deixe a chia na água por 30 min e beba a mistura." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Recuperação de Lesão": { 
        nome: "Chá de Arnica com Consolida (Compressa)", 
        ingredientes: ["Arnica", "Consolida"], 
        beneficios: "Acelera a regeneração de tecidos e reduz o inchaço de lesões.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Use como compressa fria no local lesionado." 
        }, 
        contra: "Uso externo apenas." 
      },
      "Redução de Ácido Lático": { 
        nome: "Chá de Bicarbonato Natural (Limão)", 
        ingredientes: ["Suco de 1 limão", "Pitada de sal"], 
        beneficios: "Ajuda a alcalinizar o sangue, reduzindo a queimação muscular pós-treino.",
        preparo: { 
          limpeza: "Lave o limão.", 
          fogo: "Água morna.", 
          finalizacao: "Misture e beba após o treino intenso." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Foco em Competição": { 
        nome: "Chá de Alecrim com Ginseng", 
        ingredientes: ["Alecrim", "Ginseng"], 
        beneficios: "Foco total e energia sem o nervosismo do excesso de café.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva o ginseng por 10 min.", 
          finalizacao: "Adicione o alecrim, abafe por 5 min e beba." 
        }, 
        contra: "Evite se for hipertenso." 
      },
      "Hidratação com Eletrólitos": { 
        nome: "Chá de Casca de Maçã com Sal", 
        ingredientes: ["Casca de maçã", "Pitada de sal"], 
        beneficios: "Repõe potássio e sódio de forma natural e saborosa.",
        preparo: { 
          limpeza: "Lave bem a maçã.", 
          fogo: "Ferva a casca por 5 minutos.", 
          finalizacao: "Adicione o sal, deixe gelar e beba." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Queima de Gordura (Esporte)": { 
        nome: "Chá de Canela com Gengibre", 
        ingredientes: ["Canela", "Gengibre"], 
        beneficios: "Acelera o metabolismo e aumenta a queima de gordura durante o aeróbico.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Beba 20 min antes do treino." 
        }, 
        contra: "Pode causar azia em alguns." 
      },
      "Proteção de Articulações": { 
        nome: "Chá de Gelatina Natural (Pés de Galinha)", 
        ingredientes: ["Caldo de pés de galinha"], 
        beneficios: "Riquíssimo em colágeno para proteger as articulações do impacto.",
        preparo: { 
          limpeza: "Lave muito bem.", 
          fogo: "Cozinhe por 2 horas.", 
          finalizacao: "Use o caldo como base para sopas ou beba temperado." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Sono do Atleta": { 
        nome: "Chá de Magnésio com Camomila", 
        ingredientes: ["Magnésio", "Camomila"], 
        beneficios: "Garante o relaxamento muscular necessário para a hipertrofia durante o sono.",
        preparo: { 
          limpeza: "Lave a camomila.", 
          fogo: "Infusão normal.", 
          finalizacao: "Adicione o magnésio e beba antes de deitar." 
        }, 
        contra: "Pode soltar o intestino." 
      },
      "Vigor Matinal": { 
        nome: "Chá de Catuaba com Marapuama", 
        ingredientes: ["Catuaba", "Marapuama"], 
        beneficios: "Energia e vigor para quem treina logo cedo.",
        preparo: { 
          limpeza: "Lave as cascas.", 
          fogo: "Ferva por 10 minutos.", 
          finalizacao: "Abafe por 5 minutos e beba." 
        }, 
        contra: "Evite se tiver insônia." 
      },
      "Protocolo: Energia e Vigor": {
        nome: "7 dias para trocar o cansaço pela melhor versão de você",
        ingredientes: ["Chá Verde", "Guaraná", "Gengibre", "Limão", "Hortelã", "Erva-cidreira"],
        beneficios: "OBJETIVO: Energia sustentada o dia todo sem cafeína excessiva. META: Energia constante do acordar até dormir.",
        preparo: {
          limpeza: "Siga o cronograma diário abaixo.",
          fogo: "Evite consumir os chás estimulantes após as 16h.",
          finalizacao: "A constância é a chave para a energia duradoura."
        },
        protocolo: [
          { dia: 1, titulo: "Substituição", descricao: "Substitua o 2º café do dia por Chá Verde + Guaraná." },
          { dia: 2, titulo: "Ritual Matinal", descricao: "Antes do celular: Alongamento + Água + Gengibre + Limão." },
          { dia: 3, titulo: "Foco", descricao: "Identifique ladrões de energia. Queda de energia: Chá Verde + Hortelã gelado." },
          { dia: 4, titulo: "Recuperação", descricao: "Sesta estratégica (20min pós-almoço) + Erva-cidreira morno." },
          { dia: 5, titulo: "Hidratação", descricao: "Hidratação (2L água + 2 xícaras Chá Verde). Alarme a cada 2h para beber água." },
          { dia: 6, titulo: "Ignição", descricao: "10min movimento rápido + Guaraná + Gengibre." },
          { dia: 7, titulo: "Protocolo Permanente", descricao: "Manhã (água/alongamento/chá) + Sem celular 30min + Chá Verde (2º café) + Pausa 20min + 2L água + Movimento tarde." }
        ],
        contra: "Contém cafeína e guaraná. Evite após as 16h para não prejudicar o sono."
      }
    }
  },
  "Saúde Infantil": {
    icone: "👶",
    subs: {
      "Cólica Bebê": { 
        nome: "Chá de Erva-Doce (Funcho Suave)", 
        ingredientes: ["Meia colher de chá de sementes de erva-doce", "100ml de água"], 
        beneficios: "Ajuda a relaxar o sistema digestivo do bebê, facilitando a expulsão de gases e aliviando o desconforto das cólicas.",
        preparo: { 
          limpeza: "Lave as sementes in uma peneira bem fina.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as sementes, abafe por 5 minutos e coe muito bem. Ofereça morno em pequenas quantidades." 
        }, 
        contra: "CONSULTE SEMPRE O PEDIATRA antes de oferecer qualquer chá a bebês menores de 6 meses." 
      },
      "Sono Infantil": { 
        nome: "Chá de Camomila Suave", 
        ingredientes: ["1 colher de chá de flores de camomila", "150ml de água"], 
        beneficios: "Acalma a agitação da criança e prepara o corpo para um sono mais tranquilo e profundo.",
        preparo: { 
          limpeza: "Lave as flores de camomila.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as flores, abafe por apenas 5 minutos (para não ficar forte). Ofereça 30 min antes de dormir." 
        }, 
        contra: "Certifique-se de que a criança não tem alergia a plantas da família Asteraceae." 
      },
      "Resfriado": { 
        nome: "Chá de Maçã com Canela", 
        ingredientes: ["Metade de uma maçã com casca", "1 pedaço pequeno de canela", "200ml de água"], 
        beneficios: "A maçã acalma a tosse e a canela ajuda a aquecer o corpo e combater o mal-estar do resfriado.",
        preparo: { 
          limpeza: "Lave muito bem a maçã e a canela.", 
          fogo: "Ferva a maçã picada com a canela por 5 a 8 minutos.", 
          finalizacao: "Abafe por 5 minutos. Pode adicionar mel apenas se a criança tiver mais de 1 ano de idade." 
        }, 
        contra: "MEL É PROIBIDO para menores de 1 ano devido ao risco de botulismo." 
      },
      "Gases": { 
        nome: "Chá de Funcho", 
        ingredientes: ["Meia colher de chá de sementes de funcho", "150ml de água"], 
        beneficios: "Excelente para eliminar o estufamento e as dores abdominais causadas por gases em crianças maiores.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione o funcho, abafe por 5 minutos e coe. Ofereça entre as refeições." 
        }, 
        contra: "Não use em excesso. Doses altas podem ser estimulantes para crianças pequenas." 
      },
      "Nervosismo": { 
        nome: "Chá de Capim-Limão", 
        ingredientes: ["1 colher de sobremesa de folhas de capim-limão", "200ml de água"], 
        beneficios: "Tem um sabor cítrico que as crianças adoram e ajuda a baixar a ansiedade e a hiperatividade leve.",
        preparo: { 
          limpeza: "Lave bem as folhas frescas ou secas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione as folhas, abafe por 10 minutos. Pode ser tomado gelado como um refresco calmante." 
        }, 
        contra: "Geralmente muito seguro. Evite se a criança tiver glaucoma (raro em crianças, mas é uma contraindicação da planta)." 
      },
      "Apetite": { 
        nome: "Chá de Funcho com Camomila", 
        ingredientes: ["Meia colher de cada erva", "150ml de água"], 
        beneficios: "A combinação ajuda a preparar o estômago para a digestão, estimulando levemente o apetite de forma natural.",
        preparo: { 
          limpeza: "Lave as ervas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 5 a 8 minutos. Ofereça cerca de 20 a 30 minutos antes das principais refeições." 
        }, 
        contra: "Não force a ingestão se a criança recusar o sabor." 
      },
      "Imunidade": { 
        nome: "Chá de Acerola (Infusão Fria)", 
        ingredientes: ["5 acerolas maduras", "200ml de água morna"], 
        beneficios: "Bomba de Vitamina C natural que fortalece as defesas da criança contra gripes e viroses escolares.",
        preparo: { 
          limpeza: "Lave muito bem as acerolas.", 
          fogo: "Não ferva! Aqueça a água apenas até ficar morna.", 
          finalizacao: "Amasse as acerolas na água morna, deixe descansar por 10 minutos e coe. O calor excessivo destrói a Vitamina C." 
        }, 
        contra: "Seguro para todas as crianças. Evite se houver alergia específica à fruta." 
      },
      "Tosse": { 
        nome: "Chá de Poejo", 
        ingredientes: ["1 raminho pequeno de poejo fresco", "150ml de água"], 
        beneficios: "Tradicionalmente usado para 'limpar o peito' e acalmar tosses com catarro em crianças.",
        preparo: { 
          limpeza: "Lave bem o raminho de poejo.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione o poejo, abafe por apenas 5 minutos. O sabor é forte, pode precisar de um pouco de mel (se > 1 ano)." 
        }, 
        contra: "NUNCA use o óleo essencial de poejo em crianças, apenas o chá das folhas em doses baixas." 
      },
      "Pele Irritada": { 
        nome: "Banho de Calêndula (Uso Externo)", 
        ingredientes: ["3 colheres de sopa de flores de calêndula", "1 liter de água"], 
        beneficios: "Acalma assaduras, brotoejas e irritações alérgicas na pele sensível dos bebês e crianças.",
        preparo: { 
          limpeza: "Lave as flores secas.", 
          fogo: "Ferva a água com as flores por 5 minutos.", 
          finalizacao: "Abafe por 15 minutos, coe e misture na água morna da banheira da criança. Não precisa enxaguar depois." 
        }, 
        contra: "Uso externo. Teste em uma pequena área da pele antes do banho completo." 
      },
      "Foco": { 
        nome: "Chá de Melissa (Erva-Cidreira)", 
        ingredientes: ["1 colher de sobremesa de folhas de melissa", "200ml de água"], 
        beneficios: "Ajuda a criança a se concentrar em tarefas escolares, reduzindo a agitação motora e mental.",
        preparo: { 
          limpeza: "Lave bem as folhas frescas ou secas.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Adicione a melissa, abafe por 10 minutos. Tem um sabor delicioso que agrada muito o paladar infantil." 
        }, 
        contra: "Geralmente muito seguro. Pode causar leve sonolência se o chá for feito muito concentrado." 
      },
      "Concentração Escolar": { 
        nome: "Chá de Alecrim Suave", 
        ingredientes: ["Meio raminho de alecrim", "200ml de água"], 
        beneficios: "Ajuda a criança a focar nas tarefas escolares sem agitação.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 5 minutos e ofereça morno." 
        }, 
        contra: "Não use em excesso à noite." 
      },
      "Crescimento Saudável": { 
        nome: "Chá de Alfafa", 
        ingredientes: ["1 colher de chá de alfafa"], 
        beneficios: "Rica em vitaminas e minerais essenciais para o desenvolvimento infantil.",
        preparo: { 
          limpeza: "Lave a erva.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e coe." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Imunidade de Creche": { 
        nome: "Chá de Equinácea Suave", 
        ingredientes: ["Meia colher de equinácea"], 
        beneficios: "Fortalece as defesas da criança contra viroses comuns em ambientes escolares.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos. Use por 1 semana quando houver surtos." 
        }, 
        contra: "Consulte o pediatra." 
      },
      "Apetite Seletivo": { 
        nome: "Chá de Casca de Laranja Suave", 
        ingredientes: ["Pequeno pedaço de casca de laranja"], 
        beneficios: "Estimula levemente as papilas gustativas e o apetite.",
        preparo: { 
          limpeza: "Lave muito bem.", 
          fogo: "Ferva por 3 minutos.", 
          finalizacao: "Ofereça 15 min antes da refeição." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Relaxamento Pós-Brincadeira": { 
        nome: "Chá de Melissa com Maçã", 
        ingredientes: ["Melissa", "Maçã"], 
        beneficios: "Acalma a euforia após brincadeiras intensas, preparando para o descanso.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva a maçã por 5 min.", 
          finalizacao: "Adicione a melissa, abafe por 5 min e ofereça." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Tosse Noturna": { 
        nome: "Chá de Malva Suave", 
        ingredientes: ["1 folha de malva"], 
        beneficios: "Acalma a garganta e reduz a tosse que impede a criança de dormir.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Ferva a água e desligue.", 
          finalizacao: "Abafe por 10 minutos e ofereça morno." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Picadas de Inseto (Alívio)": { 
        nome: "Chá de Manjericão (Compressa)", 
        ingredientes: ["Folhas de manjericão"], 
        beneficios: "Reduz a coceira e o inchaço de picadas de mosquitos.",
        preparo: { 
          limpeza: "Lave bem.", 
          fogo: "Amasse as folhas.", 
          finalizacao: "Aplique as folhas amassadas ou o chá forte gelado sobre a picada." 
        }, 
        contra: "Uso externo." 
      },
      "Saúde dos Ossos": { 
        nome: "Chá de Gergelim (Leite de Gergelim)", 
        ingredientes: ["1 colher de gergelim"], 
        beneficios: "Fonte de cálcio natural para o fortalecimento dos ossos em crescimento.",
        preparo: { 
          limpeza: "Lave o gergelim.", 
          fogo: "Não ferva.", 
          finalizacao: "Bata o gergelim com água, coe e ofereça o 'leite'." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Digestão de Leite": { 
        nome: "Chá de Cominho Suave", 
        ingredientes: ["Uma pitada de sementes de cominho"], 
        beneficios: "Ajuda crianças com dificuldade leve em digerir laticínios, reduzindo gases.",
        preparo: { 
          limpeza: "Lave as sementes.", 
          fogo: "Ferva por 2 minutos.", 
          finalizacao: "Abafe por 5 minutos e coe bem." 
        }, 
        contra: "Geralmente seguro." 
      },
      "Alegria e Vigor": { 
        nome: "Chá de Frutas Vermelhas Suave", 
        ingredientes: ["Morango, Amora"], 
        beneficios: "Rico em vitaminas e saboroso, mantém a criança disposta e saudável.",
        preparo: { 
          limpeza: "Lave muito bem.", 
          fogo: "Ferva as frutas por 5 min.", 
          finalizacao: "Abafe por 5 minutos e ofereça como suco morno." 
        }, 
        contra: "Geralmente seguro." 
      }
    }
  }
};


type View = { type: 'home' } | { type: 'subs'; category: string } | { type: 'recipe'; category: string; sub: string };

const PROTOCOLS = [
  { name: "Protocolo: 8 Horas de Sono", category: "Sono", icon: "🌙", color: "bg-indigo-50 text-indigo-700 border-indigo-100", label: "Sono Profundo" },
  { name: "Protocolo: Anti-Ansiedade", category: "Foco e Memória", icon: "🧘", color: "bg-purple-50 text-purple-700 border-purple-100", label: "Mente Calma" },
  { name: "Protocolo: Detox e Emagrecimento", category: "Emagrecimento", icon: "🔥", color: "bg-orange-50 text-orange-700 border-orange-100", label: "Detox 7 Dias" },
  { name: "Protocolo: Estômago Saudável", category: "Digestão", icon: "🍃", color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Digestão Leve" },
  { name: "Protocolo: Energia e Vigor", category: "Esportes", icon: "⚡", color: "bg-yellow-50 text-yellow-700 border-yellow-100", label: "Energia Total" },
];

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
              className="space-y-10"
            >
              {/* Categorias Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="bg-stone-200 p-2 rounded-lg">
                    <BookOpen className="text-stone-700 w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-800">Explorar por Categoria</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                </div>
              </section>

              {/* Protocolos Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Clock className="text-emerald-700 w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-800">Protocolos de 7 Dias</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROTOCOLS.map((proto) => (
                    <button
                      key={proto.name}
                      onClick={() => setView({ type: 'recipe', category: proto.category, sub: proto.name })}
                      className={`flex items-center gap-4 p-4 rounded-2xl border ${proto.color} hover:shadow-lg transition-all text-left group`}
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {proto.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{proto.label}</span>
                        <h3 className="font-bold text-sm md:text-base leading-tight">{proto.name}</h3>
                      </div>
                      <ArrowRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </section>
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
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-4">{DATABASE[view.category].subs[view.sub].nome}</h2>
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 italic text-emerald-800 text-sm leading-relaxed shadow-sm">
                    <div className="flex items-center gap-2 mb-2 font-bold not-italic uppercase tracking-tighter text-[10px]">
                      <Sparkles size={14} /> Por que este chá é incrível:
                    </div>
                    "{DATABASE[view.category].subs[view.sub].beneficios}"
                  </div>
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

                {DATABASE[view.category].subs[view.sub].protocolo ? (
                  <section className="mb-10">
                    <div className="flex items-center gap-3 text-stone-800 font-bold mb-6">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Clock size={18} className="text-emerald-600" />
                      </div>
                      <h3 className="text-lg">Cronograma de 7 Dias:</h3>
                    </div>
                    <div className="space-y-4">
                      {DATABASE[view.category].subs[view.sub].protocolo?.map((step) => (
                        <div key={step.dia} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                          <div className="shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex flex-col items-center justify-center border border-emerald-100">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Dia</span>
                            <span className="text-xl font-black text-emerald-700 leading-none">{step.dia}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-800 mb-1">{step.titulo}</h4>
                            <p className="text-stone-600 text-sm leading-relaxed">{step.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="mb-10">
                  <div className="flex items-center gap-3 text-stone-800 font-bold mb-6">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Flame size={18} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg">{DATABASE[view.category].subs[view.sub].protocolo ? 'Dicas de Preparo:' : 'Passo a passo bem explicadinho:'}</h3>
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
