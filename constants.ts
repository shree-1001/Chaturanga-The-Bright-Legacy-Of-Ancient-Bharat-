
import { PieceType, Player, Board, Language } from './types';

export const BOARD_SIZE = 8;

export const PIECE_VALUES: Record<PieceType, number> = {
  [PieceType.PADATI]: 1,
  [PieceType.RATHA]: 2,
  [PieceType.ASHVA]: 3,
  [PieceType.Gaja]: 4,
  [PieceType.RAJA]: 5,
};

export const PLAYER_INFO: Record<Player, { defaultName: string; color: string; bg: string; side: string }> = {
  [Player.P1]: { defaultName: 'Dakshina', color: '#ff4d4d', bg: 'bg-red-900/50', side: 'South' },
  [Player.P2]: { defaultName: 'Pashchima', color: '#4dff4d', bg: 'bg-green-900/50', side: 'West' },
  [Player.P3]: { defaultName: 'Uttara', color: '#ffff4d', bg: 'bg-yellow-900/50', side: 'North' },
  [Player.P4]: { defaultName: 'Purva', color: '#e0e0e0', bg: 'bg-zinc-800/50', side: 'East' },
};

export const PIECE_INFO: Record<PieceType, { name: string; srv: string; symbol: string; description: string }> = {
  [PieceType.RAJA]: { name: 'Raja', srv: 'राजा', symbol: '♔', description: 'Commander: 1 square any direction.' },
  [PieceType.Gaja]: { name: 'Gaja', srv: 'गज', symbol: '♗', description: 'Elephant: Jumps 2 squares orthogonally.' },
  [PieceType.ASHVA]: { name: 'Ashva', srv: 'अश्व', symbol: '♘', description: 'Horse: Standard L-shape jump.' },
  [PieceType.RATHA]: { name: 'Nauka', srv: 'नौका', symbol: '♖', description: 'Boat: Jumps 2 squares diagonally.' },
  [PieceType.PADATI]: { name: 'Padati', srv: 'पदाति', symbol: '♙', description: 'Footman: 1 square forward, diagonal capture.' },
};

export const TRANSLATIONS = {
  [Language.EN]: {
    title: "Chaturanga",
    subtitle: "Ancient Bharat War Simulation",
    march: "March to War",
    rules: "The Veda of War",
    footer: "भारत की गौरवशाली ❤️ धरोहर — चतुरंगा",
    langSelect: "Select Your Tongue",
    kingdomLabel: "Kingdom Name",
    sovereigns: "The Sovereigns",
    pact: "Diplomacy",
    restart: "Restart War",
    roll: "Cast the Pasha",
    detailedRules: [
      "Objective: Capture the opposing Rajas (Kings) to force their army to retreat.",
      "Nauka (Boat): Jumps exactly 2 squares diagonally, skipping any piece in between.",
      "Gaja (Elephant): Jumps exactly 2 squares orthogonally (horizontal or vertical).",
      "Ashva (Horse): Traditional L-shape jump (2+1 squares).",
      "Raja (King): Moves 1 square in any direction (orthogonal or diagonal).",
      "Padati (Pawn): Moves 1 square forward. Captures 1 square diagonally forward. Does not have a double-step initial move.",
      "Dice (Pasha): Movements are dictated by the roll. 5 (Pawn/Raja), 4 (Elephant), 3 (Horse), 2 (Boat).",
      "Karma (Scoring): Capturing a Pawn (+1), Boat (+2), Horse (+3), Elephant (+4), King (+5).",
      "Submission: A King may yield their sovereignty to another. All pieces of the yielding kingdom vanish, and their Karma is added to the liege's legacy."
    ]
  },
  [Language.HI]: {
    title: "चतुरंगा",
    subtitle: "प्राचीन भारत का युद्ध अनुकरण",
    march: "युद्ध की ओर",
    rules: "युद्ध के वेद",
    footer: "भारत की गौरवशाली ❤️ धरोहर — चतुरंगा",
    langSelect: "भाषा चुनें",
    kingdomLabel: "राज्य का नाम",
    sovereigns: "शासक",
    pact: "कूटनीति",
    restart: "पुनः आरंभ करें",
    roll: "पासा फेंकें",
    detailedRules: [
      "उद्देश्य: विपक्षी राजाओं को पकड़ना ताकि उनकी सेना पीछे हटने को मजबूर हो जाए।",
      "नौका: बिल्कुल 2 वर्ग तिरछे कूदती है, बीच के किसी भी टुकड़े को छोड़ देती है।",
      "गज (हाथी): बिल्कुल 2 वर्ग सीधे (क्षैतिज या ऊर्ध्वाधर) कूदता है।",
      "अश्व (घोड़ा): पारंपरिक एल-आकार की छलांग (2+1 वर्ग)।",
      "राजा: किसी भी दिशा (सीधे या तिरछे) में 1 वर्ग चलता है।",
      "पदाति (सैनिक): 1 वर्ग आगे बढ़ता है। तिरछे आगे 1 वर्ग पर कब्जा करता है।",
      "पासा: चालें पासे के अनुसार होती हैं। 5 (सैनिक/राजा), 4 (हाथी), 3 (घोड़ा), 2 (नौका)।",
      "कर्मा (अंक): सैनिक (+1), नौका (+2), घोड़ा (+3), हाथी (+4), राजा (+5) पकड़ने पर मिलते हैं।",
      "आत्मसमर्पण: एक राजा अपनी संप्रभुता दूसरे को सौंप सकता है। आत्मसमर्पण करने वाले राज्य के सभी मोहरे गायब हो जाते हैं।"
    ]
  },
  [Language.SA]: {
    title: "चतुरङ्ग",
    subtitle: "प्राचीन भारतस्य युद्धक्रीडा",
    march: "युद्धाय गच्छ",
    rules: "युद्धस्य वेदाः",
    footer: "भारत की गौरवशाली ❤️ धरोहर — चतुरंगा",
    langSelect: "भाषां वृणु",
    kingdomLabel: "राज्यस्य नाम",
    sovereigns: "राजाः",
    pact: "कूटनीतिः",
    restart: "पुनर्युद्धम्",
    roll: "पाशकं क्षिप",
    detailedRules: [
      "लक्ष्यम्: शत्रुराजानं गृहीत्वा तस्य सेनायाः पराजयः।",
      "नौका: कोणचतुष्टये द्विपदं कूर्दति।",
      "गजः: चतसृषु दिक्षु द्विपदं कूर्दति।",
      "अश्वः: अर्धतृतीयान् पदक्षेपान् करोति (L-आकारः)।",
      "राजा: सर्वदिक्षु एकपदं गच्छति।",
      "पदातिः: एकपदं पुरतः गच्छति, कोणे शत्रुं गृह्णाति।",
      "पाशकः: ५ (पदाति/राजा), ४ (गजः), ३ (अश्वः), २ (नौका)।",
      "कर्मा: पदाति (१), नौका (२), अश्व (३), गज (४), राजा (५)।",
      "शरणागतिः: यदा राजा शरणं गच्छति, तदा तस्य सर्वे सैनिकाः युद्धक्षेत्रात् अपसरन्ति।"
    ]
  }
};

const createEmptyBoard = (): Board => Array(8).fill(null).map(() => Array(8).fill(null));

export const getInitialBoard = (): Board => {
  const b = createEmptyBoard();

  // South (Bottom-Left)
  b[7][0] = { type: PieceType.RATHA, player: Player.P1 };
  b[7][1] = { type: PieceType.ASHVA, player: Player.P1 };
  b[7][2] = { type: PieceType.Gaja, player: Player.P1 };
  b[7][3] = { type: PieceType.RAJA, player: Player.P1 };
  for (let i = 0; i < 4; i++) b[6][i] = { type: PieceType.PADATI, player: Player.P1 };

  // West (Top-Left)
  b[0][0] = { type: PieceType.RATHA, player: Player.P2 };
  b[1][0] = { type: PieceType.ASHVA, player: Player.P2 };
  b[2][0] = { type: PieceType.Gaja, player: Player.P2 };
  b[3][0] = { type: PieceType.RAJA, player: Player.P2 };
  for (let i = 0; i < 4; i++) b[i][1] = { type: PieceType.PADATI, player: Player.P2 };

  // North (Top-Right)
  b[0][7] = { type: PieceType.RATHA, player: Player.P3 };
  b[0][6] = { type: PieceType.ASHVA, player: Player.P3 };
  b[0][5] = { type: PieceType.Gaja, player: Player.P3 };
  b[0][4] = { type: PieceType.RAJA, player: Player.P3 };
  for (let i = 4; i < 8; i++) b[1][i] = { type: PieceType.PADATI, player: Player.P3 };

  // East (Bottom-Right)
  b[7][7] = { type: PieceType.RATHA, player: Player.P4 };
  b[6][7] = { type: PieceType.ASHVA, player: Player.P4 };
  b[5][7] = { type: PieceType.Gaja, player: Player.P4 };
  b[4][7] = { type: PieceType.RAJA, player: Player.P4 };
  for (let i = 4; i < 8; i++) b[i][6] = { type: PieceType.PADATI, player: Player.P4 };

  return b;
};
