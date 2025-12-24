(function () {
  const PIXEL_UNIT = 4;

  // 1) canvas 확보
  let canvas = document.getElementById('bg');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // ✅ 화면 면적 기반 파티클 밀도 // 모바일 : 데스크탑
  const PARTICLE_DENSITY = isMobile ? 0.00003 : 0.00004;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    adjustParticleCount(); // ✅ resize 시 보정
  }
  window.addEventListener('resize', resize);

  // 2) 노이즈
  function noise(x, y) {
    return Math.sin(x * 0.01) * Math.cos(y * 0.01);
  }

  // 3) 파티클 생성 함수
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random(),
      size: 0.1 + Math.random() * 2,
      speed: 0.05 + Math.random() * 0.4,
      seed: Math.random() * 1000
    };
  }

  // 4) 파티클 관리
  const particles = [];

  function getTargetParticleCount() {
    return Math.floor(canvas.width * canvas.height * PARTICLE_DENSITY);
  }

  function adjustParticleCount() {
    const target = getTargetParticleCount();

    if (particles.length < target) {
      const add = target - particles.length;
      for (let i = 0; i < add; i++) {
        particles.push(createParticle());
      }
    } else if (particles.length > target) {
      particles.length = target;
    }
  }

  resize(); // 초기 캔버스 + 파티클 세팅

  const MARGIN = 50;
  let time = 0;

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      const angle = noise(p.x + p.seed, p.y + time) * Math.PI * 2;

      p.x += Math.cos(angle) * p.speed * (0.3 + p.z);
      p.y += Math.sin(angle) * p.speed * (0.3 + p.z);

      // 경계 소멸 → 재생성
      if (
        p.x < -MARGIN ||
        p.x > canvas.width + MARGIN ||
        p.y < -MARGIN ||
        p.y > canvas.height + MARGIN
      ) {
        particles[i] = createParticle();
        continue;
      }

      const pixelSize = p.size * 2;
      const alpha = 0.3 + p.z * 0.7;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), pixelSize, pixelSize);
    }

    time += 0.2;
    requestAnimationFrame(animate);
  }

  animate();
})();
