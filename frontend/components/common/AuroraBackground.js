import React, { memo } from 'react';
import styles from './AuroraBackground.module.css';

/**
 * AuroraBackground - Tema Nórdico & Pergaminho Medieval
 * Textura de pergaminho ancestral, brasas de lareira/forja suavemente animadas
 * e marca d'água de nós rúnicos históricos.
 */
function AuroraBackgroundComponent() {
  return (
    <div className={styles.parchmentContainer} aria-hidden="true">
      {/* Luz ambiente de archotes e brasas da forja */}
      <div className={styles.hearthGlowWrapper}>
        <div className={styles.emberGlowPrimary} />
        <div className={styles.emberGlowWarm} />
        <div className={styles.candleFlicker} />
        <div className={styles.parchmentHalo} />
      </div>

      {/* Feixe sutil de claridade de lanterna ancestral */}
      <div className={styles.torchBeam} />

      {/* Marca d'água de runas e entrelaçados nórdicos sutis */}
      <div className={styles.runicWatermark} />

      {/* Textura de pergaminho envelhecido e vinheta clássica */}
      <div className={styles.parchmentTexture} />
      <div className={styles.vignetteOverlay} />
    </div>
  );
}

const AuroraBackground = memo(AuroraBackgroundComponent);
export default AuroraBackground;
