import React, { useState } from 'react';
import PS1TerrainCanvas from './PS1TerrainCanvas';

/**
 * Exemplo de uso completo com controles
 */
export const PS1Demo = () => {
  const [gridSize, setGridSize] = useState(8);
  const [wobbleStrength, setWobbleStrength] = useState(0.8);
  const [posterizationEnabled, setPosterizationEnabled] = useState(true);
  const [posterizationLevels, setPosterizationLevels] = useState(8);
  const [dithering, setDithering] = useState(false);
  const [smoothTerrain, setSmoothTerrain] = useState(true);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex' }}>
      {/* Canvas 3D */}
      <div style={{ flex: 1 }}>
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
      <div
        style={{
          width: 300,
          padding: 20,
          backgroundColor: '#222',
          color: '#fff',
          overflowY: 'auto',
          fontFamily: 'monospace',
        }}
      >
        <h2>PS1 Vertex Jitter</h2>

        <div style={{ marginBottom: 20 }}>
          <label>Grid Size: {gridSize}</label>
          <input
            type="range"
            min={2}
            max={32}
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <small>Menor = efeito mais suave, Maior = mais wobble</small>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Wobble Strength: {wobbleStrength.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={wobbleStrength}
            onChange={(e) => setWobbleStrength(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>
            <input
              type="checkbox"
              checked={posterizationEnabled}
              onChange={(e) => setPosterizationEnabled(e.target.checked)}
            />{' '}
            Posterization
          </label>
        </div>

        {posterizationEnabled && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label>Posterization Levels: {posterizationLevels}</label>
              <input
                type="range"
                min={2}
                max={16}
                value={posterizationLevels}
                onChange={(e) => setPosterizationLevels(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <small>8 = ~256 cores (8³), 6 = ~216 cores</small>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>
                <input
                  type="checkbox"
                  checked={dithering}
                  onChange={(e) => setDithering(e.target.checked)}
                />{' '}
                Dithering
              </label>
            </div>
          </>
        )}

        <div style={{ marginBottom: 20 }}>
          <label>
            <input
              type="checkbox"
              checked={smoothTerrain}
              onChange={(e) => setSmoothTerrain(e.target.checked)}
            />{' '}
            Smooth Terrain (Perlin-like)
          </label>
        </div>

        <hr style={{ opacity: 0.3 }} />

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          <p>Controles da câmera:</p>
          <ul>
            <li>Clique e arraste para girar</li>
            <li>Scroll para zoom</li>
            <li>Clique direito para pan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PS1Demo;
