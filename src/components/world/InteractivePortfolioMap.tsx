import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RetroProjectMarker from './RetroProjectMarker';
import RetroPlayerIcon from './RetroPlayerIcon';
import styles from './InteractivePortfolioMap.module.css';
import { defaultProjectNodes } from './projectNodes';
import type { InteractivePortfolioMapProps, PortfolioProjectNode } from '@/types/index';

const WorldGrid: React.FC = () => {
  return (
    <group>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[86, 86, 1, 1]} />
        <meshStandardMaterial color="#16181a" roughness={0.92} metalness={0.04} />
      </mesh>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <gridHelper args={[86, 28, '#4e5f5b', '#232a2e']} position={[0, 0.01, 0]} />
    </group>
  );
};

const WorldScene: React.FC<{
  projects: PortfolioProjectNode[];
  selectedProjectId: string;
  onSelect: (project: PortfolioProjectNode) => void;
}> = ({ projects, selectedProjectId, onSelect }) => {
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId]
  );

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <fog attach="fog" args={['#080a0f', 24, 105]} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <ambientLight intensity={0.45} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight position={[14, 20, 10]} intensity={1.15} castShadow />

      <WorldGrid />

      {projects.map((project) => (
        <RetroProjectMarker
          key={project.id}
          project={project}
          isSelected={project.id === selectedProjectId}
          onSelect={onSelect}
        />
      ))}

      <RetroPlayerIcon
        position={[
          selectedProject.position[0] + 2.6,
          selectedProject.position[1] + 0.6,
          selectedProject.position[2] + 2.1,
        ]}
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={18}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.02}
      />
    </>
  );
};

export const InteractivePortfolioMap: React.FC<InteractivePortfolioMapProps> = ({
  projects = defaultProjectNodes,
  selectedProjectId,
  onSelectProject,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(projects[0]?.id ?? '');

  const activeProjectId = selectedProjectId ?? internalSelectedId;
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];

  return (
    <div className={styles.layout}>
      <div className={styles.canvasPanel}>
        <div className={styles.canvasBadge}>Interactive Retro Project Map</div>
        <Canvas
          shadows
          camera={{ position: [18, 24, 30], fov: 48, near: 0.1, far: 500 }}
          gl={{ antialias: true }}
        >
          <WorldScene
            projects={projects}
            selectedProjectId={activeProject.id}
            onSelect={(project) => {
              setInternalSelectedId(project.id);
              onSelectProject?.(project);
            }}
          />
        </Canvas>
      </div>

      <aside className={styles.sidePanel}>
        <h2>Project Nodes</h2>
        <p className={styles.subtitle}>
          Mapa 3D inicial para navegação de portfólio. Clique nos ícones do cenário para alternar o
          foco entre projetos.
        </p>

        <div className={styles.projectList}>
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={`${styles.projectButton} ${
                project.id === activeProject.id ? styles.projectButtonActive : ''
              }`}
              onClick={() => {
                setInternalSelectedId(project.id);
                onSelectProject?.(project);
              }}
            >
              <div className={styles.projectTitle}>{project.title}</div>
              <div className={styles.projectSummary}>{project.summary}</div>
            </button>
          ))}
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>Tech Stack</h3>
          <div className={styles.stack}>
            {activeProject.stack.map((item) => (
              <span key={item} className={styles.stackItem}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className={styles.controlsHint}>
          Camera: click + drag para girar, scroll para zoom, click direito para pan.
        </p>
      </aside>
    </div>
  );
};

export default InteractivePortfolioMap;
