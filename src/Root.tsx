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
import {TiempoShort, TiempoThumb, DURATION_S as D_TIE} from './videos/tiempo/Main';
import {InsomnioShort, InsomnioThumb, DURATION_S as D_INS} from './videos/insomnio/Main';
import {AguaShort, AguaThumb, DURATION_S as D_AGU} from './videos/agua/Main';
import {EspacioShort, EspacioThumb, DURATION_S as D_ESP} from './videos/espacio/Main';
import {LimitesLargo, LimitesLargoThumb, DURATION_S as D_LIM} from './videos/limites/Main';
import {MarShort, MarThumb, DURATION_S as D_MAR} from './videos/mar/Main';
import {RapidoShort, RapidoThumb, DURATION_S as D_RAP} from './videos/rapido/Main';
import {MarteShort, MarteThumb, DURATION_S as D_MRT} from './videos/marte/Main';
import {SaltoShort, SaltoThumb, DURATION_S as D_SAL} from './videos/salto/Main';
import {VolcanShort, VolcanThumb, DURATION_S as D_VOL} from './videos/volcan/Main';
import {AniosShort, AniosThumb, DURATION_S as D_ANI} from './videos/anios/Main';
import {Gta19Short, Gta19Thumb, DURATION_S as D_G19} from './videos/gta19/Main';
import {InventaShort, InventaThumb, DURATION_S as D_INV} from './videos/inventa/Main';
import {Test3D} from './videos/td/Test';
import {RuedaShort, RuedaThumb, DURATION_S as D_RUE} from './videos/rueda/Main';
import {RuedaIAShort, RuedaIAThumb, DURATION_S as D_RIA} from './videos/rueda/IA';
import {AvionIAShort, AvionIAThumb, AvionEsqShort, AvionEsqThumb, AvionMovShort, DURATION_S as D_AVI} from './videos/avion/IA';
import {CongelaShort, CongelaThumb, DURATION_S as D_CON} from './videos/congela/Main';
import {GtaHoyShort, GtaHoyThumb, DURATION_S as D_GH} from './videos/gtahoy/Main';
import {GtaFloridaShort, GtaFloridaThumb, DURATION_S as D_GF} from './videos/gtaflorida/Main';
import {GtaEggsShort, GtaEggsThumb, DURATION_S as D_GE} from './videos/gtaeggs/Main';
import {GtaLeakShort, GtaLeakThumb, DURATION_S as D_GL} from './videos/gtaleak/Main';
import {GtaHoyEnShort, GtaHoyEnThumb, DURATION_S as D_GHE} from './videos/gtahoyen/Main';
import {GtaLeakEnShort, GtaLeakEnThumb, DURATION_S as D_GLE} from './videos/gtaleaken/Main';
import {GtaTrucosShort, GtaTrucosThumb, DURATION_S as D_GTR} from './videos/gtatrucos/Main';
import {GtaTipsEnShort, GtaTipsEnThumb, DURATION_S as D_GTE} from './videos/gtatipsen/Main';
import {GtaRealShort, GtaRealThumb, DURATION_S as D_GRE} from './videos/gtareal/Main';
import {VenusShort, VenusThumb, DURATION_S as D_VEN} from './videos/venus/Main';
import {GtaTrucos2Short, GtaTrucos2Thumb, DURATION_S as D_GT2} from './videos/gtatrucos2/Main';
import {JupiterShort, JupiterThumb, DURATION_S as D_JUP} from './videos/jupiter/Main';
import {AntartidaShort, AntartidaThumb, DURATION_S as D_ANT} from './videos/antartida/Main';
import {GtaSecretosShort, GtaSecretosThumb, DURATION_S as D_GSEC} from './videos/gtasecretos/Main';
import {GtaRicoShort, GtaRicoThumb, DURATION_S as D_GRIC} from './videos/gtarico/Main';
import {GtaSecretosEnShort, GtaSecretosEnThumb, DURATION_S as D_GSEN} from './videos/gtasecretosen/Main';
import {GtaTrucos3Short, GtaTrucos3Thumb, DURATION_S as D_GTR3} from './videos/gtatrucos3/Main';
import {HuracanShort, HuracanThumb, DURATION_S as D_HUR} from './videos/huracan/Main';
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
    <Composition id="TiempoShort" component={TiempoShort} durationInFrames={Math.round(D_TIE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="TiempoThumb" component={TiempoThumb} width={W} height={H} />
    <Composition id="InsomnioShort" component={InsomnioShort} durationInFrames={Math.round(D_INS * FPS)} fps={FPS} width={W} height={H} />
    <Still id="InsomnioThumb" component={InsomnioThumb} width={W} height={H} />
    <Composition id="AguaShort" component={AguaShort} durationInFrames={Math.round(D_AGU * FPS)} fps={FPS} width={W} height={H} />
    <Still id="AguaThumb" component={AguaThumb} width={W} height={H} />
    <Composition id="EspacioShort" component={EspacioShort} durationInFrames={Math.round(D_ESP * FPS)} fps={FPS} width={W} height={H} />
    <Still id="EspacioThumb" component={EspacioThumb} width={W} height={H} />
    <Composition id="LimitesLargo" component={LimitesLargo} durationInFrames={Math.round(D_LIM * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="LimitesLargoThumb" component={LimitesLargoThumb} width={1280} height={720} />
    <Composition id="MarShort" component={MarShort} durationInFrames={Math.round(D_MAR * FPS)} fps={FPS} width={W} height={H} />
    <Still id="MarThumb" component={MarThumb} width={W} height={H} />
    <Composition id="RapidoShort" component={RapidoShort} durationInFrames={Math.round(D_RAP * FPS)} fps={FPS} width={W} height={H} />
    <Still id="RapidoThumb" component={RapidoThumb} width={W} height={H} />
    <Composition id="MarteShort" component={MarteShort} durationInFrames={Math.round(D_MRT * FPS)} fps={FPS} width={W} height={H} />
    <Still id="MarteThumb" component={MarteThumb} width={W} height={H} />
    <Composition id="SaltoShort" component={SaltoShort} durationInFrames={Math.round(D_SAL * FPS)} fps={FPS} width={W} height={H} />
    <Still id="SaltoThumb" component={SaltoThumb} width={W} height={H} />
    <Composition id="VolcanShort" component={VolcanShort} durationInFrames={Math.round(D_VOL * FPS)} fps={FPS} width={W} height={H} />
    <Still id="VolcanThumb" component={VolcanThumb} width={W} height={H} />
    <Composition id="AniosShort" component={AniosShort} durationInFrames={Math.round(D_ANI * FPS)} fps={FPS} width={W} height={H} />
    <Still id="AniosThumb" component={AniosThumb} width={W} height={H} />
    <Composition id="Gta19Short" component={Gta19Short} durationInFrames={Math.round(D_G19 * FPS)} fps={FPS} width={W} height={H} />
    <Still id="Gta19Thumb" component={Gta19Thumb} width={W} height={H} />
    <Composition id="InventaShort" component={InventaShort} durationInFrames={Math.round(D_INV * FPS)} fps={FPS} width={W} height={H} />
    <Still id="InventaThumb" component={InventaThumb} width={W} height={H} />
    <Still id="Test3D" component={Test3D} width={W} height={H} />
    <Composition id="RuedaShort" component={RuedaShort} durationInFrames={Math.round(D_RUE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="RuedaThumb" component={RuedaThumb} width={W} height={H} />
    <Composition id="RuedaIAShort" component={RuedaIAShort} durationInFrames={Math.round(D_RIA * FPS)} fps={FPS} width={W} height={H} />
    <Still id="RuedaIAThumb" component={RuedaIAThumb} width={W} height={H} />
    <Composition id="AvionIAShort" component={AvionIAShort} durationInFrames={Math.round(D_AVI * FPS)} fps={FPS} width={W} height={H} />
    <Still id="AvionIAThumb" component={AvionIAThumb} width={W} height={H} />
    <Composition id="AvionEsqShort" component={AvionEsqShort} durationInFrames={Math.round(D_AVI * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="AvionMovShort" component={AvionMovShort} durationInFrames={Math.round(D_AVI * FPS)} fps={FPS} width={W} height={H} />
    <Still id="AvionEsqThumb" component={AvionEsqThumb} width={W} height={H} />
    <Composition id="CongelaShort" component={CongelaShort} durationInFrames={Math.round(D_CON * FPS)} fps={FPS} width={W} height={H} />
    <Still id="CongelaThumb" component={CongelaThumb} width={W} height={H} />
    <Composition id="GtaHoyShort" component={GtaHoyShort} durationInFrames={Math.round(D_GH * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaHoyThumb" component={GtaHoyThumb} width={W} height={H} />
    <Composition id="GtaFloridaShort" component={GtaFloridaShort} durationInFrames={Math.round(D_GF * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaFloridaThumb" component={GtaFloridaThumb} width={W} height={H} />
    <Composition id="GtaEggsShort" component={GtaEggsShort} durationInFrames={Math.round(D_GE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaEggsThumb" component={GtaEggsThumb} width={W} height={H} />
    <Composition id="GtaLeakShort" component={GtaLeakShort} durationInFrames={Math.round(D_GL * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaLeakThumb" component={GtaLeakThumb} width={W} height={H} />
    <Composition id="GtaHoyEnShort" component={GtaHoyEnShort} durationInFrames={Math.round(D_GHE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaHoyEnThumb" component={GtaHoyEnThumb} width={W} height={H} />
    <Composition id="GtaLeakEnShort" component={GtaLeakEnShort} durationInFrames={Math.round(D_GLE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaLeakEnThumb" component={GtaLeakEnThumb} width={W} height={H} />
    <Composition id="GtaTrucosShort" component={GtaTrucosShort} durationInFrames={Math.round(D_GTR * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaTrucosThumb" component={GtaTrucosThumb} width={W} height={H} />
    <Composition id="GtaTipsEnShort" component={GtaTipsEnShort} durationInFrames={Math.round(D_GTE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaTipsEnThumb" component={GtaTipsEnThumb} width={W} height={H} />
    <Composition id="GtaRealShort" component={GtaRealShort} durationInFrames={Math.round(D_GRE * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaRealThumb" component={GtaRealThumb} width={W} height={H} />
    <Composition id="VenusShort" component={VenusShort} durationInFrames={Math.round(D_VEN * FPS)} fps={FPS} width={W} height={H} />
    <Still id="VenusThumb" component={VenusThumb} width={W} height={H} />
    <Composition id="GtaTrucos2Short" component={GtaTrucos2Short} durationInFrames={Math.round(D_GT2 * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaTrucos2Thumb" component={GtaTrucos2Thumb} width={W} height={H} />
    <Composition id="JupiterShort" component={JupiterShort} durationInFrames={Math.round(D_JUP * FPS)} fps={FPS} width={W} height={H} />
    <Still id="JupiterThumb" component={JupiterThumb} width={W} height={H} />
    <Composition id="AntartidaShort" component={AntartidaShort} durationInFrames={Math.round(D_ANT * FPS)} fps={FPS} width={W} height={H} />
    <Still id="AntartidaThumb" component={AntartidaThumb} width={W} height={H} />
    <Composition id="GtaSecretosShort" component={GtaSecretosShort} durationInFrames={Math.round(D_GSEC * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaSecretosThumb" component={GtaSecretosThumb} width={W} height={H} />
    <Composition id="GtaRicoShort" component={GtaRicoShort} durationInFrames={Math.round(D_GRIC * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaRicoThumb" component={GtaRicoThumb} width={W} height={H} />
    <Composition id="GtaSecretosEnShort" component={GtaSecretosEnShort} durationInFrames={Math.round(D_GSEN * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaSecretosEnThumb" component={GtaSecretosEnThumb} width={W} height={H} />
    <Composition id="GtaTrucos3Short" component={GtaTrucos3Short} durationInFrames={Math.round(D_GTR3 * FPS)} fps={FPS} width={W} height={H} />
    <Still id="GtaTrucos3Thumb" component={GtaTrucos3Thumb} width={W} height={H} />
    <Composition id="HuracanShort" component={HuracanShort} durationInFrames={Math.round(D_HUR * FPS)} fps={FPS} width={W} height={H} />
    <Still id="HuracanThumb" component={HuracanThumb} width={W} height={H} />
    <Still id="CharacterTest" component={CharacterTest} width={W} height={H} />
    <Still id="CinematicTest" component={CinematicTest} width={1920} height={1080} />
  </>
);
