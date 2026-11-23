import {makeT} from '../../kitV2';
import {buildSecretos} from '../gtasecretos/Main';
import words from './words.json';

const T = makeT(words as any);
export const DURATION_S = 63.5;
const R = buildSecretos(words as any, {
  U1: T('one'), TAR: T('it'), NID: T('and'), DROP: T('throw'), NOD: T("it's"), D2: T('two'), REAL: T('and', 4), T3: T('three'), MIT: T('mitsubishi'),
  PLATE: T('dude'), C4: T('four'), WOODS: T('players', 2), C5: T('five', 2), YRS: T('13'), END: T('which'),
}, {
  hook: ['5 SECRETS', 'IN GTA 6'], hook2: ['PLAYERS', 'ALREADY FOUND'], s1: ['SECRET 1', 'THE TOWER'], min: ['7 MINUTES', 'CLIMBING'], nest: ['EASTER', 'EGGS'],
  drop: ['THROW IT', 'ON THE ROAD'], nod: ['A NOD TO', 'VICE CITY 2002'], s2: ['SECRET 2', 'LIFEGUARD DOG'], real: ['BASED ON', 'A REAL DOG'],
  s3: ['SECRET 3', "PAUL WALKER'S CAR"], plate: ['"DUDE, I', 'ALMOST HAD YOU"'], s4: ['SECRET 4', 'BIGFOOT'], woods: ['COTTONMOUTH', 'LAKE'],
  s5: ['SECRET 5', 'MOUNT CHILIAD'], yrs: ['13 YEARS', 'LATER'], end: ['WHICH ONE', 'FIRST?'], stampReal: 'REAL', thumb: ['5 SECRETS', 'GTA 6'],
}, 'gtasecretosen/mezcla.wav');
export const GtaSecretosEnShort = R.Short;
export const GtaSecretosEnThumb = R.Thumb;
