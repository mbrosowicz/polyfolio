import React, { useState } from 'react';
import PS1TerrainCanvas from './PS1TerrainCanvas';
import styles from './PS1Demo.module.css';

/**
 * Demo interativa do PS1 Shader
 */
const PS1Demo: React.FC = () => {
  const [gridSize, setGridSize] = useState(8);
  const [wobbleStrength, setWobbleStrength] = useState(0.8);
  const [posterizationEnabled, setPosterizationEnabled] = useState(true);
  const [posterizationLevels, setPosterizationLevels] = useState(8);
  const [dithering, setDithering] = useState(false);
  const [smoothTerrain, setSmoothTerrain] = useState(true);

  return (
    <div className={styles.container}>
      {/* Canvas 3D */}
      <div className={styles.canvas}>
        <PS1TerrainCanvas
          gridSize={gridSize}
          wobbleStrength={wobbleStrength}
          posterizationEnabled={posterizationEnabled}
          posterizationLevels={posterizationLevels}
          dithering={dithering}
          smoothTerrain={smoothTerrain}
        />
      </div>

      {/* Painel de Controles */}
      <div className={styles.controlPanel}>
        <h2>PS1 Vertex Jitter</h2>

        <div className={styles.controlGroup}>
          <label htmlFor="gridSize">
            Grid Size: <span className={styles.value}>{gridSize}</span>
          </label>
          <input
            id="gridSize"
            type="range"
            min={2}
            max={32}
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
          <small>Menor = suave, Maior = mais wobble</small>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="wobbleStrength">
            Wobble Strength: <span className={styles.value}>{wobbleStrength.toFixed(2)}</span>
          </label>
          <input
            id="wobbleStrength"
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={wobbleStrength}
            onChange={(e) => setWobbleStrength(Number(e.target.value))}
          />
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="posterization">
            <input
              id="posterization"
              type="checkbox"
              checked={posterizationEnabled}
              onChange={(e) => setPosterizationEnabled(e.target.checked)}
            />
            <span>Posterization</span>
          </label>
        </div>

        {posterizationEnabled && (
          <>
            <div className={styles.controlGroup}>
              <label htmlFor="posterizationLevels">
                Posterization Levels: <span className={styles.value}>{posterizationLevels}</span>
              </label>
              <input
                id="posterizationLevels"
                type="range"
                min={2}
                max={16}
                value={posterizationLevels}
                onChange={(e) => setPosterizationLevels(Number(e.target.value))}
              />
              <small>8 = ~256 cores (8³)</small>
            </div>

            <div className={styles.controlGroup}>
              <label htmlFor="dithering">
                <input
                  id="dithering"
                  type="checkbox"
                  checked={dithering}
                  onChange={(e) => setDithering(e.target.checked)}
                />
                <span>Dithering</span>
              </label>
            </div>
          </>
        )}

        <div className={styles.controlGroup}>
          <label htmlFor="smoothTerrain">
            <input
              id="smoothTerrain"
              type="checkbox"
              checked={smoothTerrain}
              onChange={(e) => setSmoothTerrain(e.target.checked)}
            />
            <span>Smooth Terrain (Perlin-like)</span>
          </label>
        </div>

        <hr className={styles.divider} />

        <div className={styles.info}>
          <p>Controles da câmera:</p>
          <ul>
            <li>Click + arraste para girar</li>
            <li>Scroll para zoom</li>
            <li>Click direito para pan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PS1Demo;
