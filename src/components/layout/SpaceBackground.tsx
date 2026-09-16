import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

const STAR_COUNTS = { far: 140, mid: 90, near: 40 };
const PARALLAX = { far: 0.15, mid: 0.4, near: 0.8 };
const METEOR_MAX = 14;
const METEOR_BASE_INTERVAL_MS = [450, 1100];
const METEOR_LEN_RANGE = [80, 220];
const METEOR_SPEED_RANGE = [6, 16];
const WARP_V_MAX = 40;
const WARP_SPAWN_MULT = 4;
const TWINKLE_AMP = 0.15;
const MOBILE_BREAKPOINT = 768;

type Layer = 'far' | 'mid' | 'near';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  color: string;
  layer: Layer;
  phase: number;
  speed: number;
  glow: boolean;
}

interface Meteor {
  active: boolean;
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  colorHead: string;
  isShootingStar: boolean;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rAF: number;
    let width: number, height: number, dpr: number;
    let stars: Star[] = [];
    const meteors: Meteor[] = Array.from({ length: METEOR_MAX }, () => ({
      active: false,
      x: 0, y: 0, length: 0, speed: 0, angle: 0, colorHead: '', isShootingStar: false
    }));

    let lastTime = performance.now();
    let meteorTimer = 0;
    let nextMeteorDelay = getRandom(METEOR_BASE_INTERVAL_MS[0], METEOR_BASE_INTERVAL_MS[1]);
    let isPaused = false;
    let lastScrollY = window.scrollY;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLight = theme === 'light';

    function init() {
      // Setup canvas size
      dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);

      // Initialize stars
      const isMobile = width < MOBILE_BREAKPOINT;
      const countMultiplier = isMobile ? 0.6 : 1;
      
      stars = [];
      const createStars = (layer: Layer, count: number, sizeRange: [number, number], alphaRange: [number, number], glowProb: number = 0) => {
        const actualCount = Math.floor(count * countMultiplier);
        for (let i = 0; i < actualCount; i++) {
          const r = Math.random();
          // ~70% gold rgb(201,169,110), ~22% cream rgb(232,223,200), ~8% indigo rgb(110,100,200)
          let color = '201, 169, 110';
          if (r > 0.92) color = '110, 100, 200';
          else if (r > 0.70) color = '232, 223, 200';

          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: getRandom(sizeRange[0], sizeRange[1]),
            baseAlpha: getRandom(alphaRange[0], alphaRange[1]),
            color,
            layer,
            phase: Math.random() * Math.PI * 2,
            speed: getRandom(0.001, 0.003),
            glow: Math.random() < glowProb
          });
        }
      };

      createStars('far', STAR_COUNTS.far, [0.4, 0.9], [0.15, 0.35]);
      createStars('mid', STAR_COUNTS.mid, [0.8, 1.4], [0.25, 0.5]);
      createStars('near', STAR_COUNTS.near, [1.2, 2.2], [0.4, 0.75], 0.2);
    }

    function spawnMeteor(speedMultiplier: number, angleOffset: number) {
      const inactive = meteors.find(m => !m.active);
      if (!inactive) return;

      const isShootingStar = Math.random() < 0.125; // 1 in 8
      
      inactive.active = true;
      inactive.x = Math.random() * width * 1.5; // Can spawn a bit to the right
      inactive.y = -50; // Just above canvas
      inactive.length = getRandom(METEOR_LEN_RANGE[0], METEOR_LEN_RANGE[1]) * speedMultiplier * (isShootingStar ? 1.5 : 1);
      inactive.speed = getRandom(METEOR_SPEED_RANGE[0], METEOR_SPEED_RANGE[1]) * speedMultiplier * (isShootingStar ? 0.8 : 1);
      // Base angle 200-250 deg -> roughly 3.5 to 4.3 rad
      const baseAngle = getRandom(3.5, 4.3);
      inactive.angle = baseAngle + angleOffset;
      inactive.colorHead = isShootingStar ? '255, 255, 255' : '232, 223, 200';
      inactive.isShootingStar = isShootingStar;
    }

    let easedScrollSpeed = 0;

    function render(time: number) {
      if (isPaused) {
        lastTime = time;
        rAF = requestAnimationFrame(render);
        return;
      }

      const dt = time - lastTime;
      lastTime = time;

      ctx!.clearRect(0, 0, width, height);
      
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      
      // Get velocity from Lenis or fallback to scrollDelta
      const rawVelocity = (window as unknown as { lenis?: { velocity: number } }).lenis?.velocity ?? (scrollDelta * (1000/dt || 60));
      
      // Compute speed multiplier
      let targetSpeed = Math.min(1, Math.abs(rawVelocity) / WARP_V_MAX);
      if (isNaN(targetSpeed)) targetSpeed = 0;
      easedScrollSpeed += (targetSpeed - easedScrollSpeed) * 0.1; // lerp

      const warpSpawnMult = 1 + (WARP_SPAWN_MULT - 1) * easedScrollSpeed;
      const lengthMult = 1 + 0.8 * easedScrollSpeed;
      // Angle shifts closer to vertical (Math.PI / 2) as speed increases
      // +0.2 rad moves it towards vertical (270 deg / 4.71 rad)
      const angleOffset = easedScrollSpeed * 0.2; 
      
      // Draw stars
      const alphaMult = isLight ? 0.2 : 1;
      
      stars.forEach(star => {
        const py = (star.y - scrollY * PARALLAX[star.layer]) % height;
        const wrappedY = py < 0 ? py + height : py;
        
        let alpha = star.baseAlpha;
        if (!prefersReducedMotion) {
          alpha += Math.sin(time * star.speed + star.phase) * TWINKLE_AMP;
        }
        alpha = Math.max(0, Math.min(1, alpha)) * alphaMult;
        
        ctx!.fillStyle = `rgba(${star.color}, ${alpha})`;
        if (star.glow) {
          ctx!.shadowBlur = 4;
          ctx!.shadowColor = `rgba(${star.color}, ${alpha})`;
        } else {
          ctx!.shadowBlur = 0;
        }
        
        ctx!.beginPath();
        ctx!.arc(star.x, wrappedY, star.size, 0, Math.PI * 2);
        ctx!.fill();
      });

      // Draw meteors
      if (!isLight && !prefersReducedMotion) {
        meteorTimer += dt;
        if (meteorTimer > nextMeteorDelay / warpSpawnMult) {
          spawnMeteor(lengthMult, angleOffset);
          meteorTimer = 0;
          nextMeteorDelay = getRandom(METEOR_BASE_INTERVAL_MS[0], METEOR_BASE_INTERVAL_MS[1]);
        }

        ctx!.shadowBlur = 0; // reset for tails
        
        meteors.forEach(m => {
          if (!m.active) return;
          
          m.x += Math.cos(m.angle) * m.speed;
          m.y -= Math.sin(m.angle) * m.speed; // Canvas Y goes down, sin(200-250) is negative
          
          if (m.y > height + m.length || m.x < -m.length) {
            m.active = false;
            return;
          }
          
          const tailX = m.x - Math.cos(m.angle) * m.length;
          const tailY = m.y + Math.sin(m.angle) * m.length; // + because sin is negative
          
          const grad = ctx!.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${m.colorHead}, ${m.isShootingStar ? 0.9 : 0.7})`);
          grad.addColorStop(1, 'rgba(232, 223, 200, 0)');
          
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = m.isShootingStar ? 2.5 : 1.5;
          ctx!.lineCap = 'round';
          
          // Head glow
          ctx!.shadowBlur = m.isShootingStar ? 10 : 5;
          ctx!.shadowColor = `rgba(${m.colorHead}, 0.8)`;
          
          ctx!.beginPath();
          ctx!.moveTo(m.x, m.y);
          ctx!.lineTo(tailX, tailY);
          ctx!.stroke();
        });
      }

      // Optional subtle nebula
      if (!isLight && !prefersReducedMotion) {
        ctx!.shadowBlur = 0;
        
        const g1 = ctx!.createRadialGradient(width * 0.2, height * 0.3, 0, width * 0.2, height * 0.3, width * 0.6);
        g1.addColorStop(0, 'rgba(201, 169, 110, 0.015)');
        g1.addColorStop(1, 'rgba(201, 169, 110, 0)');
        
        const g2 = ctx!.createRadialGradient(width * 0.8, height * 0.7, 0, width * 0.8, height * 0.7, width * 0.6);
        g2.addColorStop(0, 'rgba(110, 100, 200, 0.015)');
        g2.addColorStop(1, 'rgba(110, 100, 200, 0)');
        
        const dx1 = Math.sin(time * 0.0005) * 50;
        const dy1 = Math.cos(time * 0.0004) * 50;
        const dx2 = Math.cos(time * 0.0003) * 50;
        const dy2 = Math.sin(time * 0.0006) * 50;
        
        ctx!.fillStyle = g1;
        ctx!.fillRect(-width + dx1, -height + dy1, width * 3, height * 3);
        
        ctx!.fillStyle = g2;
        ctx!.fillRect(-width + dx2, -height + dy2, width * 3, height * 3);
      }

      rAF = requestAnimationFrame(render);
    }

    let resizeTimeout: number;
    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(init, 150);
    };

    const handleVisibility = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    
    init();
    lastTime = performance.now();
    rAF = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearTimeout(resizeTimeout);
      cancelAnimationFrame(rAF);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
