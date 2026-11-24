/**
 * IRON MAN COMIC 3D PORTFOLIO - J.A.R.V.I.S. INTERACTION & THREE.JS ENGINE
 * Sabhaym Trivedi - Zero Emojis
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL AUDIO SYNTHESIZER (Web Audio API)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playRepulsorBlast() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      // Low punch oscillator
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.36);

      // Noise blast burst
      const bufferSize = audioCtx.sampleRate * 0.25;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.25);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.26);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  function playUiBeep(freq = 880, duration = 0.08) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch (e) {
      console.warn('UI beep error:', e);
    }
  }

  // Audio Toggle Button Setup
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function () {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggleBtn.textContent = 'AUDIO: ENGAGED';
        soundToggleBtn.style.background = '#00f0ff';
        soundToggleBtn.style.color = '#000000';
        playUiBeep(1046, 0.12);
      } else {
        soundToggleBtn.textContent = 'AUDIO: STANDBY';
        soundToggleBtn.style.background = '';
        soundToggleBtn.style.color = '';
      }
    });
  }

  // =========================================================================
  // 2. THREE.JS 3D ARC REACTOR SIMULATION
  // =========================================================================
  let scene, camera, renderer, reactorGroup;
  let outerRing, innerRing1, innerRing2, coreMesh, particleSystem;
  let repulsorLight;
  let targetRotationX = 0, targetRotationY = 0;
  let currentRotationX = 0, currentRotationY = 0;
  let isOvercharged = false;

  function initThreeJsArcReactor() {
    const canvasContainer = document.getElementById('arc-reactor-webgl-canvas');
    if (!canvasContainer || typeof THREE === 'undefined') {
      console.warn('Three.js container or library unavailable');
      return;
    }

    const width = canvasContainer.clientWidth || 400;
    const height = canvasContainer.clientHeight || 400;

    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(renderer.domElement);

    // Root Group
    reactorGroup = new THREE.Group();
    scene.add(reactorGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffd166, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    repulsorLight = new THREE.PointLight(0x00f0ff, 3.5, 30);
    repulsorLight.position.set(0, 0, 1);
    reactorGroup.add(repulsorLight);

    // 1. Outer Dark Titanium Armor Ring
    const outerRingGeo = new THREE.TorusGeometry(3.6, 0.35, 16, 64);
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1a2130,
      metalness: 0.9,
      roughness: 0.25
    });
    outerRing = new THREE.Mesh(outerRingGeo, titaniumMat);
    reactorGroup.add(outerRing);

    // 2. 10 Copper Solenoid Induction Coils
    const coilCount = 10;
    const coilGroup = new THREE.Group();
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.2
    });
    const coilGeo = new THREE.BoxGeometry(0.3, 0.8, 0.5);

    for (let i = 0; i < coilCount; i++) {
      const angle = (i / coilCount) * Math.PI * 2;
      const coil = new THREE.Mesh(coilGeo, copperMat);
      coil.position.x = Math.cos(angle) * 3.6;
      coil.position.y = Math.sin(angle) * 3.6;
      coil.rotation.z = angle + Math.PI / 2;
      coilGroup.add(coil);
    }
    reactorGroup.add(coilGroup);

    // 3. Middle Rotating Notched Ring
    const middleRingGeo = new THREE.RingGeometry(2.5, 2.9, 32);
    const middleRingMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      side: THREE.DoubleSide,
      metalness: 0.95,
      roughness: 0.15
    });
    innerRing1 = new THREE.Mesh(middleRingGeo, middleRingMat);
    reactorGroup.add(innerRing1);

    // 4. Inner Cyan Plasma Channel Ring
    const innerRingGeo = new THREE.TorusGeometry(1.9, 0.12, 16, 48);
    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      metalness: 0.2,
      roughness: 0.1
    });
    innerRing2 = new THREE.Mesh(innerRingGeo, cyanGlowMat);
    reactorGroup.add(innerRing2);

    // 5. Central Glowing Plasma Arc Core
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.1
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    reactorGroup.add(coreMesh);

    // 6. Holographic J.A.R.V.I.S. HUD Orbit Lines
    const hudRingGeo = new THREE.RingGeometry(4.2, 4.25, 64);
    const hudRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const hudRing = new THREE.Mesh(hudRingGeo, hudRingMat);
    reactorGroup.add(hudRing);

    // 7. Swirling Energy Particle Vortex
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.5 + Math.random() * 3.5;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      velocities.push({
        radius: radius,
        angle: angle,
        speed: 0.015 + Math.random() * 0.02,
        zSpeed: (Math.random() - 0.5) * 0.01
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.userData = { velocities: velocities };
    reactorGroup.add(particleSystem);

    // Window Resize Handler
    window.addEventListener('resize', onWindowResize);

    // Mouse Interaction for 3D Tilt
    canvasContainer.addEventListener('mousemove', function (e) {
      const rect = canvasContainer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.65;
      targetRotationX = -y * 0.65;
    });

    canvasContainer.addEventListener('mouseleave', function () {
      targetRotationX = 0;
      targetRotationY = 0;
    });

    // Click to Overcharge Repulsor
    canvasContainer.addEventListener('click', triggerRepulsorOvercharge);

    const overchargeBtn = document.getElementById('overcharge-repulsor-btn');
    if (overchargeBtn) {
      overchargeBtn.addEventListener('click', triggerRepulsorOvercharge);
    }

    // Start Animation Loop
    animate();
  }

  function triggerRepulsorOvercharge() {
    initAudio();
    playRepulsorBlast();
    isOvercharged = true;

    // Flash core and blast particles
    if (repulsorLight) repulsorLight.intensity = 12.0;
    if (coreMesh) coreMesh.material.emissiveIntensity = 5.0;

    // Camera shake effect
    const originalZ = 12;
    let shakeCount = 0;
    const shakeInterval = setInterval(function () {
      camera.position.x = (Math.random() - 0.5) * 0.4;
      camera.position.y = (Math.random() - 0.5) * 0.4;
      shakeCount++;
      if (shakeCount > 15) {
        clearInterval(shakeInterval);
        camera.position.set(0, 0, originalZ);
      }
    }, 20);

    setTimeout(function () {
      isOvercharged = false;
      if (repulsorLight) repulsorLight.intensity = 3.5;
      if (coreMesh) coreMesh.material.emissiveIntensity = 1.5;
    }, 600);
  }

  function onWindowResize() {
    const canvasContainer = document.getElementById('arc-reactor-webgl-canvas');
    if (!canvasContainer || !renderer || !camera) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Smooth 3D tilt tracking
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;

    if (reactorGroup) {
      reactorGroup.rotation.x = currentRotationX;
      reactorGroup.rotation.y = currentRotationY;
    }

    // Counter-rotating mechanical rings
    if (innerRing1) {
      innerRing1.rotation.z -= delta * (isOvercharged ? 4.5 : 0.8);
    }
    if (innerRing2) {
      innerRing2.rotation.z += delta * (isOvercharged ? 6.0 : 1.2);
    }

    // Pulsating plasma core
    if (coreMesh) {
      const pulse = 1.0 + Math.sin(time * 4) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);
      if (!isOvercharged) {
        coreMesh.material.emissiveIntensity = 1.4 + Math.sin(time * 6) * 0.35;
      }
    }

    // Particle vortex animation
    if (particleSystem && particleSystem.userData.velocities) {
      const positions = particleSystem.geometry.attributes.position.array;
      const velocities = particleSystem.userData.velocities;
      const count = velocities.length;

      for (let i = 0; i < count; i++) {
        const v = velocities[i];
        v.angle += v.speed * (isOvercharged ? 4.0 : 1.0);

        positions[i * 3] = Math.cos(v.angle) * v.radius;
        positions[i * 3 + 1] = Math.sin(v.angle) * v.radius;
        positions[i * 3 + 2] += v.zSpeed;

        if (Math.abs(positions[i * 3 + 2]) > 1.2) {
          v.zSpeed = -v.zSpeed;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // =========================================================================
  // 3. ARMOR PHOTO VAULT LIGHTBOX & FILTER CONTROLS
  // =========================================================================
  function initGallery() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const photoCards = document.querySelectorAll('.armor-photo-card');
    const lightbox = document.getElementById('comic-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    // Filter switching
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        initAudio();
        playUiBeep(659, 0.06);

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        photoCards.forEach(function (card) {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat.includes(category)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Open Lightbox on card click
    photoCards.forEach(function (card) {
      card.addEventListener('click', function () {
        initAudio();
        playUiBeep(880, 0.08);

        const img = card.querySelector('.armor-photo-img');
        const title = card.querySelector('.armor-photo-title');
        const desc = card.getAttribute('data-desc') || '';

        if (img && lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxTitle.textContent = title ? title.textContent : 'STARK ARMOR SPECIFICATION';
          lightboxCaption.textContent = desc;
          lightbox.classList.add('active');
        }
      });
    });

    // Close Lightbox
    if (lightboxClose) {
      lightboxClose.addEventListener('click', function () {
        playUiBeep(440, 0.05);
        lightbox.classList.remove('active');
      });
    }

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          lightbox.classList.remove('active');
        }
      });
    }

    // Keyboard ESC to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 4. STARK INTEL BOOKSHELF INSPECTION MODAL
  // =========================================================================
  const BOOK_DATA = {
    'steve-jobs': {
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      quote: 'The people who are crazy enough to think they can change the world are the ones who do.',
      lesson: 'Engineering perfection down to the parts no one will ever see. Stark-grade obsession with product architecture and seamless hardware-software integration.'
    },
    'zero-to-one': {
      title: 'Zero to One',
      author: 'Peter Thiel',
      quote: 'Doing what we already know how to do takes the world from 1 to n. Every new creation goes from 0 to 1.',
      lesson: 'Monopolistic engineering advantages through proprietary technology. Building category-defining autonomous systems that create entirely new frontiers.'
    },
    'build-dont-talk': {
      title: 'Build, Don’t Talk',
      author: 'Raj Shamani',
      quote: 'Execution is the only currency that matters in the arena.',
      lesson: 'Velocity over hesitation. Continuous shipping, rigorous market feedback, and building tangible working software instead of endless theorizing.'
    }
  };

  function initBookshelf() {
    const bookItems = document.querySelectorAll('.stark-book-item');
    const lightbox = document.getElementById('comic-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCaption = document.getElementById('lightbox-caption');

    bookItems.forEach(function (book) {
      book.addEventListener('click', function () {
        initAudio();
        playUiBeep(784, 0.08);

        const bookKey = book.getAttribute('data-book');
        const data = BOOK_DATA[bookKey];
        const coverImg = book.querySelector('img');

        if (data && lightbox && lightboxImg) {
          lightboxImg.src = coverImg ? coverImg.src : '';
          lightboxTitle.textContent = data.title + ' // BY ' + data.author.toUpperCase();
          lightboxCaption.innerHTML = '<strong>KEY DIRECTIVE:</strong> "' + data.quote + '"<br><br>' + data.lesson;
          lightbox.classList.add('active');
        }
      });
    });
  }

  // =========================================================================
  // 5. STARK ENCRYPTED COMMS & CLIPBOARD
  // =========================================================================
  function initComms() {
    const copyBtn = document.getElementById('copy-comms-email-btn');
    const emailText = document.getElementById('comms-email-text');

    if (copyBtn && emailText) {
      copyBtn.addEventListener('click', function () {
        initAudio();
        playUiBeep(1174, 0.1);

        const email = emailText.textContent.trim();
        navigator.clipboard.writeText(email).then(function () {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'TRANSMISSION READY!';
          copyBtn.style.background = '#00f0ff';
          copyBtn.style.color = '#000000';

          setTimeout(function () {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
          }, 2500);
        }).catch(function (err) {
          console.error('Clipboard copy failed:', err);
        });
      });
    }
  }

  // =========================================================================
  // 6. DOM READY INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', function () {
    initThreeJsArcReactor();
    initGallery();
    initBookshelf();
    initComms();
  });

})();
