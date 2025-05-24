import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { Text } from 'react-native-paper';

// ⛑️ IMPORTA el componente/archivo que contiene los <Polygon id="...">
import HumanBody from '../../assets/human_body_vector_ids';

/* --------------------------------------------------------------------------
 * 1 ▸   Lista EXACTA de IDs que existen en el SVG
 * ----------------------------------------------------------------------- */
export const MUSCLE_IDS = [
  // --------- FRONT ---------
  'deltoid_left',
  'deltoid_right',
  'pectoralis',
  'rectus_abdominis',
  'biceps_left',
  'biceps_right',
  'forearm_left',
  'forearm_right',
  'quadriceps_left',
  'quadriceps_right',
  'calf_left',
  'calf_right',
  // --------- BACK ---------
  'trapezius_back',
  'latissimus_back',
  'deltoid_back_left',
  'deltoid_back_right',
  'triceps_left',
  'triceps_right',
  'forearm_left_back',
  'forearm_right_back',
  'gluteus_back',
  'hamstrings_left',
  'hamstrings_right',
  'calf_left_back',
  'calf_right_back',
] as const;

export type MuscleId = (typeof MUSCLE_IDS)[number];

/* --------------------------------------------------------------------------
 * 2 ▸   Colores y trazo
 * ----------------------------------------------------------------------- */
const ACTIVE = '#e10600';
const INACTIVE = 'rgba(0,0,0,0.01)'; // opacidad > 0 ⇒ recibe eventos
const STROKE = '#ffffff';

/* --------------------------------------------------------------------------
 * 3 ▸   Componente principal
 * ----------------------------------------------------------------------- */
export default function PersonalizedTrainingScreen() {
  const [selected, setSelected] = useState<MuscleId[]>([]);

  /* -- Alterna la selección de un músculo -------------------------------- */
  const toggle = useCallback((id: MuscleId) => {
    setSelected(curr =>
      curr.includes(id) ? curr.filter(m => m !== id) : [...curr, id]
    );
  }, []);

  /* -- Props dinámicos que inyectaremos en cada <Polygon> ----------------- */
  const dynamicProps = useMemo(() => {
    const obj: Record<string, object> = {};
    MUSCLE_IDS.forEach(id => {
      obj[id] = {
        fill: selected.includes(id) ? ACTIVE : INACTIVE,
        stroke: STROKE,
        strokeWidth: 1,
        onPress: () => toggle(id),
        hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: id.replace(/_/g, ' '),
      } as const;
    });
    return obj;
  }, [selected, toggle]);

  /* ---------------------------------------------------------------------- */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Entrenamiento Personalizado</Text>

      <View style={styles.canvas}>
        {/* Imagen de fondo: solo referencia visual, sin eventos */}
        <Image
          source={require('../../assets/human_body.png')}
          style={styles.background}
          resizeMode="contain"
          pointerEvents="none"
        />

        {/* SVG interactivo → NO anidamos otro <Svg>; directamente el componente */}
        {/* @ts-ignore – MUSCLE_IDS se pasa como props dinámicos */}
        <HumanBody width={320} height={320} {...dynamicProps} />
      </View>

      <Text style={styles.caption}>
        Seleccionados: {selected.length ? selected.join(', ') : '—'}
      </Text>
    </ScrollView>
  );
}

/* --------------------------------------------------------------------------
 * 4 ▸   Estilos
 * ----------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  canvas: {
    width: 320,
    height: 320,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  caption: {
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
