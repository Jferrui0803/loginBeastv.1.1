import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

/* --------------------------------------------------------------------------
 * HumanBody – SVG interactivo (músculos anteriores y posteriores)
 * --------------------------------------------------------------------------
 * • Más fiel al contorno anatómico que la versión con <Polygon> cuadrados.
 * • Cada <Path id="…"> conserva los mismos IDs usados en la app para que
 *   PersonalizedTrainingScreen.tsx funcione sin cambios.
 * • Coordenadas dibujadas manualmente sobre un lienzo de 500×500 px.
 *   (Se pueden afinar más adelante si quieres todavía más detalle.)
 * ------------------------------------------------------------------------ */

const HumanBody = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 500}
    height={props.height || 500}
    viewBox="0 0 500 500"
    stroke="#ffffff"
    strokeWidth={1}
    fill="transparent"
  >
    {/* ===== FRONT (left half) ===== */}
    <G id="front">
      {/* - Deltoides - */}
      <Path
        id="deltoid_left"
        d="M60 95 Q73 75 90 90 L100 110 Q83 125 62 110 Z"
        {...(props.deltoid_left || {})}
      />
      <Path
        id="deltoid_right"
        d="M150 90 Q167 75 180 95 L170 110 Q155 125 140 110 Z"
        {...(props.deltoid_right || {})}
      />

      {/* - Pectoral mayor - */}
      <Path
        id="pectoralis"
        d="M70 115 Q125 95 180 115 L188 150 Q130 157 60 150 Z"
        {...(props.pectoralis || {})}
      />

      {/* - Recto abdominal - */}
      <Path
        id="rectus_abdominis"
        d="M100 165 Q125 155 150 165 L155 240 Q125 250 95 240 Z"
        {...(props.rectus_abdominis || {})}
      />

      {/* - Bíceps - */}
      <Path
        id="biceps_left"
        d="M50 145 Q55 132 68 140 L78 190 Q60 200 50 190 Z"
        {...(props.biceps_left || {})}
      />
      <Path
        id="biceps_right"
        d="M170 140 Q183 132 190 145 L190 190 Q175 200 165 190 Z"
        {...(props.biceps_right || {})}
      />

      {/* - Antebrazo - */}
      <Path
        id="forearm_left"
        d="M42 200 Q50 195 60 200 L66 260 Q52 265 44 260 Z"
        {...(props.forearm_left || {})}
      />
      <Path
        id="forearm_right"
        d="M180 200 Q190 195 200 200 L200 260 Q186 265 176 260 Z"
        {...(props.forearm_right || {})}
      />

      {/* - Cuádriceps - */}
      <Path
        id="quadriceps_left"
        d="M82 265 Q95 255 110 265 L118 360 Q100 372 88 360 Z"
        {...(props.quadriceps_left || {})}
      />
      <Path
        id="quadriceps_right"
        d="M142 265 Q155 255 168 265 L162 360 Q148 372 135 360 Z"
        {...(props.quadriceps_right || {})}
      />

      {/* - Gemelo / pantorrilla - */}
      <Path
        id="calf_left"
        d="M92 365 Q102 358 112 365 L116 450 Q102 457 96 450 Z"
        {...(props.calf_left || {})}
      />
      <Path
        id="calf_right"
        d="M142 365 Q152 358 160 365 L156 450 Q142 457 138 450 Z"
        {...(props.calf_right || {})}
      />
    </G>

    {/* ===== BACK (right half) ===== */}
    <G id="back">
      {/* - Trapecio - */}
      <Path
        id="trapezius_back"
        d="M340 105 Q385 70 430 105 L410 140 Q375 160 350 140 Z"
        {...(props.trapezius_back || {})}
      />

      {/* - Dorsal ancho - */}
      <Path
        id="latissimus_back"
        d="M330 155 Q385 135 440 155 L420 220 Q375 230 350 220 Z"
        {...(props.latissimus_back || {})}
      />

      {/* - Deltoides posteriores - */}
      <Path
        id="deltoid_back_left"
        d="M310 95 Q325 80 340 95 L350 110 Q335 122 318 110 Z"
        {...(props.deltoid_back_left || {})}
      />
      <Path
        id="deltoid_back_right"
        d="M400 95 Q415 80 430 95 L420 110 Q405 122 390 110 Z"
        {...(props.deltoid_back_right || {})}
      />

      {/* - Tríceps - */}
      <Path
        id="triceps_left"
        d="M310 145 Q318 132 330 142 L340 190 Q325 200 315 190 Z"
        {...(props.triceps_left || {})}
      />
      <Path
        id="triceps_right"
        d="M430 145 Q440 132 450 145 L450 190 Q435 200 425 190 Z"
        {...(props.triceps_right || {})}
      />

      {/* - Antebrazo posterior - */}
      <Path
        id="forearm_left_back"
        d="M302 200 Q310 195 320 200 L326 260 Q312 265 304 260 Z"
        {...(props.forearm_left_back || {})}
      />
      <Path
        id="forearm_right_back"
        d="M440 200 Q450 195 460 200 L460 260 Q446 265 436 260 Z"
        {...(props.forearm_right_back || {})}
      />

      {/* - Glúteo - */}
      <Path
        id="gluteus_back"
        d="M360 235 Q385 225 410 235 L405 270 Q375 278 365 270 Z"
        {...(props.gluteus_back || {})}
      />

      {/* - Isquiotibiales - */}
      <Path
        id="hamstrings_left"
        d="M350 265 Q365 255 380 265 L384 350 Q365 360 357 350 Z"
        {...(props.hamstrings_left || {})}
      />
      <Path
        id="hamstrings_right"
        d="M395 265 Q410 255 420 265 L416 350 Q397 360 390 350 Z"
        {...(props.hamstrings_right || {})}
      />

      {/* - Gemelo posterior - */}
      <Path
        id="calf_left_back"
        d="M357 355 Q368 348 378 355 L376 450 Q364 457 360 450 Z"
        {...(props.calf_left_back || {})}
      />
      <Path
        id="calf_right_back"
        d="M405 355 Q416 348 426 355 L420 450 Q408 457 402 450 Z"
        {...(props.calf_right_back || {})}
      />
    </G>
  </Svg>
);

export default HumanBody;
