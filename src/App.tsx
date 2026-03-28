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
  beneficios: string;
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
      }
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
