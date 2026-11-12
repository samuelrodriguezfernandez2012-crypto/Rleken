import React from 'react';
import {Composition, Still} from 'remotion';
import {MentirasShort, DURATION_S as D_MENTIRAS} from './videos/mentiras/Main';
import {Thumbnail} from './videos/mentiras/Thumbnail';
import {ReflejoShort, ReflejoThumb, DURATION_S as D_REFLEJO} from './videos/reflejo/Main';
import {MentesShort, MentesThumb, DURATION_S as D_MENTES} from './videos/mentes/Main';
import {TierraShort, TierraThumb, DURATION_S as D_TIERRA} from './videos/tierra/Main';
import {CharacterTest} from './tests/CharacterTest';
import {CinematicTest} from './tests/CinematicTest';
import {SolShort, SolThumb, DURATION_S as D_SOL} from './videos/sol/Main';
import {DuplicarShort, DuplicarThumb, DURATION_S as D_DUP} from './videos/duplicar/Main';
import {Largo1, DURATION_S as D_LARGO1} from './videos/largo1/Main';
import {Largo1Thumb, Largo1ThumbV2} from './videos/largo1/Thumb';
import {ParpadeoShort, ParpadeoThumb, DURATION_S as D_PARP} from './videos/parpadeo/Main';
import {AgujeroShort, AgujeroThumb, DURATION_S as D_AGU} from './videos/agujero/Main';
import {Gta6Short, Gta6Thumb, DURATION_S as D_GTA} from './videos/gta6/Main';
import {FuturoLargo, FuturoThumb, DURATION_S as D_FUT} from './videos/futuro/Main';
import {Nivel0Short, Nivel0Thumb, DURATION_S as D_N0} from './videos/nivel0/Main';
import {FuerteLargo, FuerteThumb, DURATION_S as D_FU} from './videos/fuerte/Main';
import {LunaShort, LunaThumb, DURATION_S as D_LUNA} from './videos/luna/Main';
import {DobleShort, DobleThumb, DURATION_S as D_DOB} from './videos/doble/Main';
import {Nivel0Largo, Nivel0LargoThumb, DURATION_S as D_N0L} from './videos/nivel0largo/Main';
import {OceanosShort, OceanosThumb, DURATION_S as D_OCE} from './videos/oceanos/Main';
import {NombreShort, NombreThumb, DURATION_S as D_NOM} from './videos/nombre/Main';
import {PresenteShort, PresenteThumb, DURATION_S as D_PRE} from './videos/presente/Main';
import {FPS, W, H} from './fx';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MentirasShort" component={MentirasShort} durationInFrames={Math.round(D_MENTIRAS * FPS)} fps={FPS} width={W} height={H} />
    <Still id="Thumbnail" component={Thumbnail} width={W} height={H} />
    <Composition id="ReflejoShort" component={ReflejoShort} durationInFrames={Math.round(D_REFLEJO * FPS)} fps={FPS} width={W} height={H} />
    <Still id="ReflejoThumb" component={ReflejoThumb} width={W} height={H} />
    <Composition id="MentesShort" component={MentesShort} durationInFrames={Math.round(D_MENTES * FPS)} fps={FPS} width={W} height={H} />
    <Still id="MentesThumb" component={MentesThumb} width={W} height={H} />
    <Composition id="TierraShort" component={TierraShort} durationInFrames={Math.round(D_TIERRA * FPS)} fps={FPS} width={W} height={H} />
    <Still id="TierraThumb" component={TierraThumb} width={W} height={H} />
    <Composition id="Largo1" component={Largo1} durationInFrames={D_LARGO1 * FPS} fps={FPS} width={1920} height={1080} />
    <Still id="Largo1Thumb" component={Largo1Thumb} width={1280} height={720} />
    <Still id="Largo1ThumbV2" component={Largo1ThumbV2} width={1280} height={720} />
    <Composition id="DuplicarShort" component={DuplicarShort} durationInFrames={Math.round(D_DUP * FPS)} fps={FPS} width={W} height={H} />
    <Still id="DuplicarThumb" component={DuplicarThumb} width={W} height={H} />
    <Composition id="SolShort" component={SolShort} durationInFrames={Math.round(D_SOL * FPS)} fps={FPS} width={W} height={H} />
    <Still id="SolThumb" component={SolThumb} width={W} height={H} />
    <Composition id="ParpadeoShort" component={ParpadeoShort} durationInFrames={Math.round(D_PARP * FPS)} fps={FPS} width={W} height={H} />
    <Still id="ParpadeoThumb" component={ParpadeoThumb} width={W} height={H} />
    <Composition id="AgujeroShort" component={AgujeroShort} durationInFrames={Math.round(D_AGU * FPS)} fps={FPS} width={W} height={H} />
    <Still id="AgujeroThumb" component={AgujeroThumb} width={W} height={H} />
    <Composition id="Gta6Short" component={Gta6Short} durationInFrames={Math.round(D_GTA * FPS)} fps={FPS} width={W} height={H} />
    <Still id="Gta6Thumb" component={Gta6Thumb} width={W} height={H} />
    <Composition id="FuturoLargo" component={FuturoLargo} durationInFrames={D_FUT * FPS} fps={FPS} width={1920} height={1080} />
    <Still id="FuturoThumb" component={FuturoThumb} width={1280} height={720} />
    <Composition id="Nivel0Short" component={Nivel0Short} durationInFrames={Math.round(D_N0 * FPS)} fps={FPS} width={W} height={H} />
    <Still id="Nivel0Thumb" component={Nivel0Thumb} width={W} height={H} />
    <Composition id="FuerteLargo" component={FuerteLargo} durationInFrames={D_FU * FPS} fps={FPS} width={1920} height={1080} />
    <Still id="FuerteThumb" component={FuerteThumb} width={1280} height={720} />
    <Composition id="LunaShort" component={LunaShort} durationInFrames={Math.round(D_LUNA * FPS)} fps={FPS} width={W} height={H} />
    <Still id="LunaThumb" component={LunaThumb} width={W} height={H} />
    <Composition id="DobleShort" component={DobleShort} durationInFrames={Math.round(D_DOB * FPS)} fps={FPS} width={W} height={H} />
    <Still id="DobleThumb" component={DobleThumb} width={W} height={H} />
    <Composition id="Nivel0Largo" component={Nivel0Largo} durationInFrames={D_N0L * FPS} fps={FPS} width={1920} height={1080} />
    <Still id="Nivel0LargoThumb" component={Nivel0LargoThumb} width={1280} height={720} />
    <Composition id="OceanosShort" component={OceanosShort} durationInFrames={Math.round(D_OCE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="OceanosThumb" component={OceanosThumb} width={W} height={H} />
    <Composition id="NombreShort" component={NombreShort} durationInFrames={Math.round(D_NOM * FPS)} fps={FPS} width={W} height={H} />
    <Still id="NombreThumb" component={NombreThumb} width={W} height={H} />
    <Composition id="PresenteShort" component={PresenteShort} durationInFrames={Math.round(D_PRE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="PresenteThumb" component={PresenteThumb} width={W} height={H} />
    <Still id="CharacterTest" component={CharacterTest} width={W} height={H} />
    <Still id="CinematicTest" component={CinematicTest} width={1920} height={1080} />
  </>
);
