/**
 * ====================================================
 * Virtual Art Gallery - 180m Imperial Palace Engine
 * 8 Grand Galleries, 32 Masterpieces, Dual Mobile Touch Controls
 * ====================================================
 */

class ImperialVirtualGallery {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.textureLoader = new THREE.TextureLoader();

    // Movement state
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.playerHeight = 2.4;

    // Mobile Touch Joystick State
    this.isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 900);
    this.joystickActive = false;
    this.joystickTouchId = null;
    this.joystickOrigin = { x: 0, y: 0 };
    this.joystickVector = { x: 0, y: 0 };
    this.lookTouchId = null;
    this.lookLastPos = { x: 0, y: 0 };
    this.cameraEuler = new THREE.Euler(0, 0, 0, 'YXZ');

    // Head bobbing & footsteps
    this.bobTimer = 0;
    this.lastStepTime = 0;

    // Interactive elements
    this.artworksMeshes = [];
    this.activeArtwork = null;
    this.raycaster = new THREE.Raycaster();
    this.centerScreen = new THREE.Vector2(0, 0);

    // Dynamic Objects & Performance Optimization
    this.cullableLights = [];
    this.frameCounter = 0;
    this.waterParticles = null;
    this.particleVelocities = [];
    this.centerSculpture = null;
    this.spotlights = [];
    this.relicMeshes = [];
    this.chandeliers = [];
    this.sunbeamMesh = null;

    // Cinematic Auto-Tour Mode
    this.isCinematicTour = false;
    this.tourProgress = 0;
    this.tourSpline = null;

    // Collision boundaries
    this.colliders = [];

    // Minimap
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    // UI elements
    this.promptEl = document.getElementById('interaction-prompt');
    this.crosshairEl = document.getElementById('crosshair');
    this.modalEl = document.getElementById('artwork-modal');
    this.blockerEl = document.getElementById('blocker');
    this.hudHeaderEl = document.getElementById('hud-header');
    this.minimapContainerEl = document.getElementById('minimap-container');
    this.photoOverlayEl = document.getElementById('photo-mode-overlay');
    this.photoPreviewModalEl = document.getElementById('photo-preview-modal');

    // Photo Mode & Graphics Quality State
    this.isPhotoMode = false;
    this.defaultFov = 60;
    this.currentFilter = 'none';
    this.lastCapturedPhotoData = null;
    this.graphicsQuality = localStorage.getItem('gallery_graphics_quality') || (this.isMobile ? 'low' : 'medium');

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0f18);
    this.scene.fog = new THREE.FogExp2(0x0c0f18, 0.0075);

    // 2. Camera setup - Start in Rotunda facing North
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    this.camera.position.set(0, this.playerHeight, 8);

    // 3. Renderer setup - Smooth & Balanced Performance
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      precision: this.isMobile ? 'mediump' : 'highp'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const initialPr = this.isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.3);
    this.renderer.setPixelRatio(initialPr);
    this.renderer.shadowMap.enabled = !this.isMobile;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.container.appendChild(this.renderer.domElement);

    // 4. Desktop Controls & Mobile Touch Controls
    this.setupDesktopControls();
    this.setupMobileTouchControls();

    // 5. Build 180m Imperial Palace with 8 Thematic Galleries
    this.buildImperialPalace();

    // 6. Spawn 32 Real Artworks
    this.spawnArtworks();

    // 7. Spawn Central Fountain & Volumetric Sunbeam
    this.spawnRotundaAtmosphere();

    // 8. Spawn Relic Showcases & Chandeliers
    this.spawnTreasuresAndChandeliers();

    // 9. Setup Cinematic Spline Tour
    this.setupCinematicTour();

    // 10. Event Listeners
    this.setupEvents();

    // 11. Initial theme & Graphics Quality
    this.setLightingTheme('day');
    this.setGraphicsQuality(this.graphicsQuality);

    // 12. Start Animation Loop
    this.animate();
  }

  setupDesktopControls() {
    this.controls = new THREE.PointerLockControls(this.camera, document.body);

    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
      this.blockerEl.classList.add('hidden');
      if (!this.isMobile && this.controls) {
        try {
          this.controls.lock();
        } catch (e) {
          console.warn('PointerLock not supported or blocked:', e);
        }
      }
      if (window.galleryAudio) {
        window.galleryAudio.init();
      }
    });

    this.controls.addEventListener('lock', () => {
      this.blockerEl.classList.add('hidden');
      if (this.isPhotoMode) {
        this.updatePhotoMouseState(true);
      }
    });

    this.controls.addEventListener('unlock', () => {
      if (this.modalEl.classList.contains('hidden') && !this.isCinematicTour && !this.isPhotoMode && !this.isMobile) {
        this.blockerEl.classList.remove('hidden');
      }
      if (this.isPhotoMode) {
        this.updatePhotoMouseState(false);
      }
    });
  }

  setupMobileTouchControls() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 960);
    const mobileUI = document.getElementById('mobile-controls');
    const joystickZone = document.getElementById('joystick-zone');
    const joystickKnob = document.getElementById('joystick-knob');
    const mobileActionBtn = document.getElementById('mobile-action-btn');

    if (!isTouch) return;

    this.isMobile = true;
    if (mobileUI) mobileUI.classList.remove('hidden');

    // Prevent Safari/Chrome mobile gestures (pinch zoom, pull-to-refresh, navigation swipes)
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

    // Tap on start button starts mobile experience smoothly
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      const handleStart = (e) => {
        if (e && e.cancelable) e.preventDefault();
        this.blockerEl.classList.add('hidden');
        if (window.galleryAudio) window.galleryAudio.init();
      };
      startBtn.addEventListener('touchstart', handleStart, { passive: false });
      startBtn.addEventListener('click', handleStart);
    }

    // Rock-Solid Dual-Zone Touch System:
    // Left 45% = Movement Joystick | Right 55% = Smooth 360° Looking Around
    const onTouchStart = (e) => {
      const target = e.target;
      const isInteractive = target.tagName === 'BUTTON' || 
                            target.closest('button') || 
                            target.closest('#artwork-modal') || 
                            target.closest('#quality-menu') ||
                            target.closest('.dropdown-content') ||
                            target.closest('.header-actions');

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        // 1. Left side of screen (X < 45% of viewport) -> Virtual Joystick for Walking
        if (touch.clientX < window.innerWidth * 0.45 && this.joystickTouchId === null) {
          if (!isInteractive) {
            if (e.cancelable) e.preventDefault();
            this.joystickTouchId = touch.identifier;
            this.joystickActive = true;

            if (joystickZone) {
              const rect = joystickZone.getBoundingClientRect();
              this.joystickOrigin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
              };
              this.updateJoystick(touch.clientX, touch.clientY, joystickKnob);
            }
          }
        }
        // 2. Right side of screen (X >= 45% of viewport) -> Smooth 360° Looking Around
        else if (touch.clientX >= window.innerWidth * 0.45 && this.lookTouchId === null) {
          if (!isInteractive) {
            if (e.cancelable) e.preventDefault();
            this.lookTouchId = touch.identifier;
            this.lookLastPos = { x: touch.clientX, y: touch.clientY };
          }
        }
      }
    };

    const onTouchMove = (e) => {
      // Allow scrolling inside artwork modal when reading descriptions
      if (this.modalEl && !this.modalEl.classList.contains('hidden') && e.target.closest('#artwork-modal')) {
        return;
      }

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystickTouchId) {
          if (e.cancelable) e.preventDefault();
          this.updateJoystick(touch.clientX, touch.clientY, joystickKnob);
        } else if (touch.identifier === this.lookTouchId) {
          if (e.cancelable) e.preventDefault();
          this.updateTouchLook(touch.clientX, touch.clientY);
        }
      }
    };

    const onTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystickTouchId) {
          this.joystickActive = false;
          this.joystickTouchId = null;
          this.joystickVector = { x: 0, y: 0 };
          if (joystickKnob) {
            joystickKnob.style.transform = 'translate(-50%, -50%)';
          }
        } else if (touch.identifier === this.lookTouchId) {
          this.lookTouchId = null;
        }
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onTouchEnd, { passive: false });

    // Mobile Action Button (Inspect Artwork)
    if (mobileActionBtn) {
      const handleAction = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (e && e.cancelable) e.preventDefault();
        if (this.activeArtwork) {
          this.openArtworkModal(this.activeArtwork);
        }
      };
      mobileActionBtn.addEventListener('click', handleAction);
      mobileActionBtn.addEventListener('touchstart', handleAction, { passive: false });
    }

    // Tapping floating prompt on screen also opens artwork
    if (this.promptEl) {
      const handlePrompt = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (this.activeArtwork) {
          this.openArtworkModal(this.activeArtwork);
        }
      };
      this.promptEl.addEventListener('click', handlePrompt);
      this.promptEl.addEventListener('touchstart', handlePrompt, { passive: false });
    }
  }

  updateJoystick(clientX, clientY, knob) {
    const maxRadius = 45;
    const dx = clientX - this.joystickOrigin.x;
    const dy = clientY - this.joystickOrigin.y;
    const dist = Math.hypot(dx, dy);

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    if (knob) {
      knob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
    }

    this.joystickVector = {
      x: knobX / maxRadius,
      y: knobY / maxRadius
    };
  }

  updateTouchLook(clientX, clientY) {
    const dx = clientX - this.lookLastPos.x;
    const dy = clientY - this.lookLastPos.y;
    this.lookLastPos = { x: clientX, y: clientY };

    // Filter out sudden coordinate jumps
    if (Math.abs(dx) > 120 || Math.abs(dy) > 120) return;

    this.cameraEuler.setFromQuaternion(this.camera.quaternion);
    this.cameraEuler.y -= dx * 0.0048;
    this.cameraEuler.x -= dy * 0.0038;
    this.cameraEuler.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.cameraEuler.x));

    this.camera.quaternion.setFromEuler(this.cameraEuler);
  }

  buildImperialPalace() {
    // 1. Ultra-Luxurious Modern Italian Polished Marble Floor (180m x 180m)
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fctx = floorCanvas.getContext('2d');

    // Deep Nero Marquina dark background
    fctx.fillStyle = '#0a0d14';
    fctx.fillRect(0, 0, 1024, 1024);

    // Large-format luxury marble slabs (512x512)
    fctx.strokeStyle = '#181d2a';
    fctx.lineWidth = 4;
    fctx.strokeRect(0, 0, 1024, 1024);
    fctx.strokeRect(512, 0, 512, 1024);
    fctx.strokeRect(0, 512, 1024, 512);

    // Delicate golden marble veining (Calacatta Gold veins)
    fctx.strokeStyle = 'rgba(212, 175, 55, 0.32)';
    fctx.lineWidth = 2.5;
    fctx.beginPath();
    fctx.moveTo(60, 20);
    fctx.bezierCurveTo(200, 150, 320, 120, 500, 300);
    fctx.bezierCurveTo(620, 420, 800, 350, 980, 512);
    fctx.stroke();

    fctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    fctx.lineWidth = 1.5;
    fctx.beginPath();
    fctx.moveTo(100, 600);
    fctx.bezierCurveTo(280, 720, 450, 650, 700, 850);
    fctx.bezierCurveTo(820, 920, 920, 880, 1020, 960);
    fctx.stroke();

    // Elegant brass corner inlays (Modern luxury geometric accents)
    fctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
    [0, 512, 1024].forEach(x => {
      [0, 512, 1024].forEach(y => {
        fctx.fillRect(x - 8, y - 8, 16, 16);
      });
    });

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(36, 36);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.12, // High-gloss polished mirror reflection
      metalness: 0.25
    });

    const floorGeo = new THREE.PlaneGeometry(180, 180);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. High Vaulted Ceiling (10.5m high) with Coffered Styling
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x12151f,
      roughness: 0.85
    });
    const ceilingGeo = new THREE.PlaneGeometry(180, 180);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = 10.5;
    ceiling.rotation.x = Math.PI / 2;
    this.scene.add(ceiling);

    // Modern Architectural Light Coves along the corridors
    const lightCoveMat = new THREE.MeshBasicMaterial({
      color: 0xfff2dc,
      transparent: true,
      opacity: 0.55
    });

    const coveN = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 58), lightCoveMat);
    coveN.position.set(0, 10.42, -48);
    coveN.rotation.x = Math.PI / 2;
    this.scene.add(coveN);

    const coveS = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 58), lightCoveMat);
    coveS.position.set(0, 10.42, 48);
    coveS.rotation.x = Math.PI / 2;
    this.scene.add(coveS);

    const coveE = new THREE.Mesh(new THREE.PlaneGeometry(58, 6.5), lightCoveMat);
    coveE.position.set(48, 10.42, 0);
    coveE.rotation.x = Math.PI / 2;
    this.scene.add(coveE);

    const coveW = new THREE.Mesh(new THREE.PlaneGeometry(58, 6.5), lightCoveMat);
    coveW.position.set(-48, 10.42, 0);
    coveW.rotation.x = Math.PI / 2;
    this.scene.add(coveW);

    // 3. Central Rotunda Monumental Dome (Cathedral/Pantheon Scale, 25m high)
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.65,
      side: THREE.BackSide
    });
    const domeGeo = new THREE.SphereGeometry(16.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 10.5, 0);
    this.scene.add(dome);

    // 16 Gilded Radial Architectural Structural Ribs
    const ribMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.92, roughness: 0.2 });
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 21.5, 8), ribMat);
      rib.position.set(Math.sin(angle) * 7.8, 17.8, Math.cos(angle) * 7.8);
      rib.rotation.y = -angle;
      rib.rotation.z = 0.52;
      this.scene.add(rib);
    }

    // Grand Gilded Oculus Skylight Ring (Radius 4.2m at height 24.8m)
    const oculusRing = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.22, 16, 48), ribMat);
    oculusRing.rotation.x = Math.PI / 2;
    oculusRing.position.set(0, 24.8, 0);
    this.scene.add(oculusRing);

    // Glowing Ethereal Skylight Glass
    const domeSkylightMat = new THREE.MeshStandardMaterial({
      color: 0x6e9fd8,
      roughness: 0.08,
      metalness: 0.85,
      emissive: 0x31527d,
      emissiveIntensity: 0.75
    });
    const domeSkylight = new THREE.Mesh(new THREE.CircleGeometry(4.1, 48), domeSkylightMat);
    domeSkylight.position.set(0, 24.85, 0);
    domeSkylight.rotation.x = Math.PI / 2;
    this.scene.add(domeSkylight);

    // 4. Red Velvet Carpet Runners extending into all Wings
    const carpetMat = new THREE.MeshStandardMaterial({ color: 0x851414, roughness: 0.88 });

    // North Carpet
    const carpetN = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 62), carpetMat);
    carpetN.rotation.x = -Math.PI / 2;
    carpetN.position.set(0, 0.02, -47);
    carpetN.receiveShadow = true;
    this.scene.add(carpetN);

    // South Carpet
    const carpetS = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 62), carpetMat);
    carpetS.rotation.x = -Math.PI / 2;
    carpetS.position.set(0, 0.02, 47);
    carpetS.receiveShadow = true;
    this.scene.add(carpetS);

    // East Carpet
    const carpetE = new THREE.Mesh(new THREE.PlaneGeometry(62, 5.5), carpetMat);
    carpetE.rotation.x = -Math.PI / 2;
    carpetE.position.set(47, 0.02, 0);
    carpetE.receiveShadow = true;
    this.scene.add(carpetE);

    // West Carpet
    const carpetW = new THREE.Mesh(new THREE.PlaneGeometry(62, 5.5), carpetMat);
    carpetW.rotation.x = -Math.PI / 2;
    carpetW.position.set(-47, 0.02, 0);
    carpetW.receiveShadow = true;
    this.scene.add(carpetW);

    // 5. Museum Walls (10.5m high) - Warm Imperial Cream Plaster with Classical Molding
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf5f2e9,
      roughness: 0.75,
      metalness: 0.03
    });

    // --- NORTH WING (Renaissance Gallery) ---
    // Far Northern Wall (Mona Lisa, Creation of Adam, Last Supper)
    this.createWall(28, 10.5, 0.8, 0, 5.25, -78, wallMat);
    // North West Wall (School of Athens) - with open 14m archway into Northwest Pavilion
    this.createWall(0.8, 10.5, 30, -13, 5.25, -33, wallMat);
    this.createWall(0.8, 10.5, 16, -13, 5.25, -70, wallMat);
    this.createWall(0.8, 2.5, 14, -13, 9.25, -55, wallMat, false, false); // Archway Lintel

    // North East Wall - with open 14m archway into Northeast Pavilion
    this.createWall(0.8, 10.5, 30, 13, 5.25, -33, wallMat);
    this.createWall(0.8, 10.5, 16, 13, 5.25, -70, wallMat);
    this.createWall(0.8, 2.5, 14, 13, 9.25, -55, wallMat, false, false); // Archway Lintel

    // --- NORTHEAST PAVILION (Dutch & Spanish Golden Age) ---
    // North Wall (The Night Watch, Girl with a Pearl Earring)
    this.createWall(46, 10.5, 0.8, 36, 5.25, -78, wallMat);
    // East Wall (Las Meninas, Arnolfini Portrait)
    this.createWall(0.8, 10.5, 46, 58, 5.25, -56, wallMat);
    // South Wall: Wall section + open arch into East Wing
    this.createWall(14, 10.5, 0.8, 51, 5.25, -33, wallMat);
    this.createWall(14, 2.5, 0.8, 37, 9.25, -33, wallMat, false, false);

    // --- EAST WING (French Impressionism Gallery) ---
    // Far East Wall (Starry Night, Sunflowers, Cafe Terrace)
    this.createWall(0.8, 10.5, 28, 78, 5.25, 0, wallMat);
    // North Wall of East Wing (Water Lilies) - with open arch into Northeast Pavilion
    this.createWall(20, 10.5, 0.8, 28, 5.25, -13, wallMat);
    this.createWall(20, 10.5, 0.8, 68, 5.25, -13, wallMat);
    this.createWall(20, 2.5, 0.8, 48, 9.25, -13, wallMat, false, false);

    // South Wall of East Wing - with open arch into Southeast Pavilion
    this.createWall(20, 10.5, 0.8, 28, 5.25, 13, wallMat);
    this.createWall(20, 10.5, 0.8, 68, 5.25, 13, wallMat);
    this.createWall(20, 2.5, 0.8, 48, 9.25, 13, wallMat, false, false);

    // --- SOUTHEAST PAVILION (Post-Impressionism & Botticelli) ---
    // East Wall (Sunday on La Grande Jatte, Woman with Parasol)
    this.createWall(0.8, 10.5, 46, 58, 5.25, 56, wallMat);
    // South Wall (The Birth of Venus, Impression Sunrise)
    this.createWall(46, 10.5, 0.8, 36, 5.25, 78, wallMat);
    // North Wall: Wall section + open arch into East Wing
    this.createWall(14, 10.5, 0.8, 51, 5.25, 33, wallMat);
    this.createWall(14, 2.5, 0.8, 37, 9.25, 33, wallMat, false, false);

    // --- SOUTH WING (Modernism, Romanticism & Symbolism) ---
    // Far Southern Wall (The Kiss, The Scream, The Great Wave)
    this.createWall(28, 10.5, 0.8, 0, 5.25, 78, wallMat);
    // South East Wall (Liberty Leading the People) - with open arch into Southeast Pavilion
    this.createWall(0.8, 10.5, 30, 13, 5.25, 33, wallMat);
    this.createWall(0.8, 10.5, 16, 13, 5.25, 70, wallMat);
    this.createWall(0.8, 2.5, 14, 13, 9.25, 55, wallMat, false, false);

    // South West Wall - with open arch into Southwest Pavilion
    this.createWall(0.8, 10.5, 30, -13, 5.25, 33, wallMat);
    this.createWall(0.8, 10.5, 16, -13, 5.25, 70, wallMat);
    this.createWall(0.8, 2.5, 14, -13, 9.25, 55, wallMat, false, false);

    // --- SOUTHWEST PAVILION (Surrealism & 20th Century) ---
    // South Wall (The Garden of Earthly Delights, Wanderer above Sea of Fog)
    this.createWall(46, 10.5, 0.8, -36, 5.25, 78, wallMat);
    // West Wall (Nighthawks, American Gothic)
    this.createWall(0.8, 10.5, 46, -58, 5.25, 56, wallMat);
    // North Wall: Wall section + open arch into West Wing
    this.createWall(14, 10.5, 0.8, -51, 5.25, 33, wallMat);
    this.createWall(14, 2.5, 0.8, -37, 9.25, 33, wallMat, false, false);

    // --- WEST WING (Kurdish National Heritage & Landscapes) ---
    // Far West Wall (Erbil Citadel, Zagros Mountains, Hawraman Village)
    this.createWall(0.8, 10.5, 28, -78, 5.25, 0, wallMat);
    // South Wall of West Wing (Zagros Nomads) - with open arch into Southwest Pavilion
    this.createWall(20, 10.5, 0.8, -28, 5.25, 13, wallMat);
    this.createWall(20, 10.5, 0.8, -68, 5.25, 13, wallMat);
    this.createWall(20, 2.5, 0.8, -48, 9.25, 13, wallMat, false, false);

    // North Wall of West Wing - with open arch into Northwest Pavilion
    this.createWall(20, 10.5, 0.8, -28, 5.25, -13, wallMat);
    this.createWall(20, 10.5, 0.8, -68, 5.25, -13, wallMat);
    this.createWall(20, 2.5, 0.8, -48, 9.25, -13, wallMat, false, false);

    // --- NORTHWEST PAVILION (Ancient Mesopotamia & Babylon) ---
    // North Wall (The Ishtar Gate, Lion of Babylon)
    this.createWall(46, 10.5, 0.8, -36, 5.25, -78, wallMat);
    // West Wall (The Arch of Ctesiphon, Kurdish Cultural Folklore)
    this.createWall(0.8, 10.5, 46, -58, 5.25, -56, wallMat);
    // South Wall: Wall section + open arch into West Wing
    this.createWall(14, 10.5, 0.8, -51, 5.25, -33, wallMat);
    this.createWall(14, 2.5, 0.8, -37, 9.25, -33, wallMat, false, false);

    // 4 Monumental Rotunda Archway Portals
    this.createWall(26, 2.8, 0.8, 0, 9.1, -18, wallMat, false, false);
    this.createWall(26, 2.8, 0.8, 0, 9.1, 18, wallMat, false, false);
    this.createWall(0.8, 2.8, 26, 18, 9.1, 0, wallMat, false, false);
    this.createWall(0.8, 2.8, 26, -18, 9.1, 0, wallMat, false, false);

    // 6. Colonnade of Corinthian Columns (32 columns lining the galleries)
    const columnGeo = new THREE.CylinderGeometry(0.45, 0.52, 10.5, 32);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0x242938, roughness: 0.3, metalness: 0.35 });

    const colonnadeCoords = [
      // North Gallery
      [-10.5, 5.25, -28], [10.5, 5.25, -28],
      [-10.5, 5.25, -42], [10.5, 5.25, -42],
      [-10.5, 5.25, -56], [10.5, 5.25, -56],
      [-10.5, 5.25, -70], [10.5, 5.25, -70],
      // South Gallery
      [-10.5, 5.25, 28], [10.5, 5.25, 28],
      [-10.5, 5.25, 42], [10.5, 5.25, 42],
      [-10.5, 5.25, 56], [10.5, 5.25, 56],
      [-10.5, 5.25, 70], [10.5, 5.25, 70],
      // East Gallery
      [28, 5.25, -10.5], [28, 5.25, 10.5],
      [42, 5.25, -10.5], [42, 5.25, 10.5],
      [56, 5.25, -10.5], [56, 5.25, 10.5],
      [70, 5.25, -10.5], [70, 5.25, 10.5],
      // West Gallery
      [-28, 5.25, -10.5], [-28, 5.25, 10.5],
      [-42, 5.25, -10.5], [-42, 5.25, 10.5],
      [-56, 5.25, -10.5], [-56, 5.25, 10.5],
      [-70, 5.25, -10.5], [-70, 5.25, 10.5]
    ];

    colonnadeCoords.forEach(([cx, cy, cz]) => {
      const col = new THREE.Mesh(columnGeo, columnMat);
      col.position.set(cx, cy, cz);
      col.castShadow = true;
      col.receiveShadow = true;
      this.scene.add(col);
      this.colliders.push(new THREE.Box3().setFromObject(col));
    });

    // 7. Museum Benches in all Halls
    this.createBench(0, 0, -52);
    this.createBench(0, 0, 52);
    this.createBench(52, 0, 0);
    this.createBench(-52, 0, 0);
    this.createBench(45, 0, -55);
    this.createBench(45, 0, 55);
    this.createBench(-45, 0, 55);
    this.createBench(-45, 0, -55);

    // VIP Velvet Stanchions in front of flagship masterpieces
    this.createVipStanchionRopes(0, -74, 0);              // Mona Lisa (North Hall)
    this.createVipStanchionRopes(74, 0, Math.PI / 2);     // Starry Night (East Hall)
    this.createVipStanchionRopes(0, 74, Math.PI);         // The Kiss (South Hall)
    this.createVipStanchionRopes(-74, 0, -Math.PI / 2);   // Erbil Citadel (West Hall)
    this.createVipStanchionRopes(-20, 74, Math.PI);       // Persistence of Memory (Southwest Wing)
    this.createVipStanchionRopes(-40, -74, 0);            // The Ishtar Gate (Northwest Wing)

    // 8 Illuminated Monumental Hall Portal Signboards
    this.createHallPortalSign(0, 8.8, -17.6, 0, '🏛️ هۆڵی باکوور • ڕێنیسانسی باڵا', 'HIGH RENAISSANCE MASTERS');
    this.createHallPortalSign(0, 8.8, 17.6, Math.PI, '🌊 هۆڵی باشوور • مۆدێرنیزم و سیمبۆلیزم', 'MODERN MASTERS & EXPRESSIONISM');
    this.createHallPortalSign(17.6, 8.8, 0, -Math.PI / 2, '🌻 هۆڵی ڕۆژهەڵات • ئیمپڕێشنیزمی فەڕەنسی', 'FRENCH IMPRESSIONISM & LIGHT');
    this.createHallPortalSign(-17.6, 8.8, 0, Math.PI / 2, '🏰 هۆڵی ڕۆژئاوا • کەلەپووری دێرینی کوردستان', 'KURDISH NATIONAL HERITAGE & FOLKLORE');
    this.createHallPortalSign(-37, 8.8, 32.6, 0, '🌀 باڵی باشووری ڕۆژئاوا • سوریالیزم و ئەقڵتەزێن', 'SURREALISM & MIND-BENDING ILLUSIONS');
    this.createHallPortalSign(-37, 8.8, -32.6, Math.PI, '🦁 باڵی باکووری ڕۆژئاوا • مێزۆپۆتامیا و بابل', 'ANCIENT MESOPOTAMIA & BABYLON');
    this.createHallPortalSign(37, 8.8, -32.6, Math.PI, '👑 باڵی باکووری ڕۆژهەڵات • سەردەمی زێڕینی هۆڵەندا', 'DUTCH GOLDEN AGE & BAROQUE');
    this.createHallPortalSign(37, 8.8, 32.6, 0, '🌸 باڵی باشووری ڕۆژهەڵات • خاڵکاری و بۆتیچێلی', 'POST-IMPRESSIONISM & FLORENCE');

    // 4 Classical Sculptures on Fluted Pedestals in Rotunda Diagonal Corners
    this.createClassicalStatuePedestal(-12, -12, 'apollo', Math.PI / 4);
    this.createClassicalStatuePedestal(12, -12, 'venus', -Math.PI / 4);
    this.createClassicalStatuePedestal(-12, 12, 'victory', 3 * Math.PI / 4);
    this.createClassicalStatuePedestal(12, 12, 'hermes', -3 * Math.PI / 4);

    // Museum Planters with Green Foliage
    this.createPalacePlanter(-12, -18);
    this.createPalacePlanter(12, -18);
    this.createPalacePlanter(-12, 18);
    this.createPalacePlanter(12, 18);
    this.createPalacePlanter(18, -12);
    this.createPalacePlanter(18, 12);
    this.createPalacePlanter(-18, -12);
    this.createPalacePlanter(-18, 12);

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.48);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaed, 0.95);
    this.dirLight.position.set(0, 26, 0);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.scene.add(this.dirLight);
  }

  createWall(w, h, d, x, y, z, mat, isCollider = true, hasDecorations = true) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const wall = new THREE.Mesh(geo, mat);
    wall.position.set(x, y, z);
    wall.receiveShadow = true;
    wall.castShadow = true;
    this.scene.add(wall);

    if (hasDecorations) {
      // 1. Sleek Modern Architectural Baseboard with Shadow Reveal (lower 0.45m)
      const baseH = 0.45;
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x12151e,
        roughness: 0.35,
        metalness: 0.3
      });
      const baseGeo = new THREE.BoxGeometry(
        w > d ? w : w + 0.05,
        baseH,
        d > w ? d : d + 0.05
      );
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(x, baseH / 2, z);
      this.scene.add(baseMesh);

      // 2. Embedded Linear LED Floor Wash Glow Strip
      const ledMat = new THREE.MeshBasicMaterial({
        color: 0xffe8aa,
        transparent: true,
        opacity: 0.45
      });
      const ledGeo = new THREE.BoxGeometry(
        w > d ? w : w + 0.08,
        0.04,
        d > w ? d : d + 0.08
      );
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(x, baseH + 0.02, z);
      this.scene.add(ledMesh);

      // 3. Modern Ceiling Track Lighting Channel at y = 10.25m
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x181a22,
        roughness: 0.3,
        metalness: 0.8
      });
      const trackGeo = new THREE.BoxGeometry(
        w > d ? w : w + 0.06,
        0.18,
        d > w ? d : d + 0.06
      );
      const trackMesh = new THREE.Mesh(trackGeo, trackMat);
      trackMesh.position.set(x, 10.25, z);
      this.scene.add(trackMesh);

      // 4. Subtle Champagne Gold Accent Trim below track
      const trimMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.25,
        metalness: 0.85
      });
      const trimGeo = new THREE.BoxGeometry(
        w > d ? w : w + 0.08,
        0.04,
        d > w ? d : d + 0.08
      );
      const trimMesh = new THREE.Mesh(trimGeo, trimMat);
      trimMesh.position.set(x, 10.14, z);
      this.scene.add(trimMesh);
    }

    if (isCollider) {
      this.colliders.push(new THREE.Box3().setFromObject(wall));
    }
    return wall;
  }

  createBench(x, y, z) {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(x, y, z);

    // Modern smoked ebony / dark walnut base
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x14161f, roughness: 0.3, metalness: 0.2 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 1.4), baseMat);
    base.position.y = 0.52;
    base.castShadow = true;
    benchGroup.add(base);

    // Ribbed luxury black leather cushion
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0x0a0c12, roughness: 0.45, metalness: 0.1 });
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.16, 1.25), cushionMat);
    cushion.position.y = 0.66;
    cushion.castShadow = true;
    benchGroup.add(cushion);

    // Modern brushed champagne-gold cantilever sled legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.92, roughness: 0.18 });
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 1.2), legMat);
    leg1.position.set(-1.8, 0.26, 0);
    benchGroup.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 1.2), legMat);
    leg2.position.set(1.8, 0.26, 0);
    benchGroup.add(leg2);

    this.scene.add(benchGroup);
    this.colliders.push(new THREE.Box3().setFromObject(benchGroup));
  }

  createVipStanchionRopes(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const postMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.15 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x851414, roughness: 0.8 });

    const xs = [-3.0, -1.0, 1.0, 3.0];
    xs.forEach((px, idx) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.0, 16), postMat);
      post.position.set(px, 0.5, 0);
      post.castShadow = true;
      group.add(post);

      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), postMat);
      ball.position.set(px, 1.05, 0);
      group.add(ball);

      if (idx < xs.length - 1) {
        const nextPx = xs[idx + 1];
        const ropeLength = nextPx - px;
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, ropeLength, 12), ropeMat);
        rope.position.set((px + nextPx) / 2, 0.88, 0);
        rope.rotation.z = Math.PI / 2;
        group.add(rope);
      }
    });

    this.scene.add(group);
  }

  createPalacePlanter(x, z) {
    // Modern fluted cylindrical architectural planter
    const potMat = new THREE.MeshStandardMaterial({ color: 0x151822, roughness: 0.35, metalness: 0.4 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.48, 1.3, 24), potMat);
    pot.position.set(x, 0.65, z);
    pot.castShadow = true;
    this.scene.add(pot);

    // Gilded accent collar
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.03, 16, 32), rimMat);
    rim.position.set(x, 1.28, z);
    rim.rotation.x = Math.PI / 2;
    this.scene.add(rim);

    // Sculpted Mediterranean boxwood foliage
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x1b4425, roughness: 0.65 });
    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 2), plantMat);
    foliage.position.set(x, 1.9, z);
    foliage.castShadow = true;
    this.scene.add(foliage);

    this.colliders.push(new THREE.Box3().setFromObject(pot));
  }

  createHallPortalSign(x, y, z, rotY, titleKu, titleEn, width = 6.8, height = 1.35) {
    const signGroup = new THREE.Group();
    signGroup.position.set(x, y, z);
    signGroup.rotation.y = rotY;

    // 1. High-Resolution Canvas Texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');

    // Imperial Obsidian Gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#0a0d14');
    grad.addColorStop(0.2, '#141824');
    grad.addColorStop(0.5, '#1b2234');
    grad.addColorStop(0.8, '#141824');
    grad.addColorStop(1, '#0a0d14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 220);

    // Triple Gilded Border with Corner Rosettes
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.strokeRect(8, 8, 1008, 204);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 988, 184);

    // Corner Accents
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(12, 12, 12, 12);
    ctx.fillRect(1000, 12, 12, 12);
    ctx.fillRect(12, 196, 12, 12);
    ctx.fillRect(1000, 196, 12, 12);

    // Kurdish Typography (Top, bold golden)
    ctx.fillStyle = '#ffea9f';
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
    ctx.shadowBlur = 12;
    ctx.fillText(titleKu, 512, 72);

    // English Subtitle (Bottom, elegant tracking)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#c5ccd9';
    ctx.font = '600 22px "Segoe UI", Georgia, serif';
    ctx.fillText(titleEn, 512, 145);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;

    // 2. Front Face Mesh
    const signMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.28,
      metalness: 0.4,
      emissive: 0x111622,
      emissiveIntensity: 0.35
    });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), signMat);
    signGroup.add(signMesh);

    // 3. Heavy Brushed Bronze Backing Plate
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x12151e,
      roughness: 0.35,
      metalness: 0.85
    });
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(width + 0.18, height + 0.18, 0.12), backMat);
    backMesh.position.z = -0.07;
    signGroup.add(backMesh);

    // 4. Chamfered Gold Frame Moulding
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.2
    });
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(width + 0.22, 0.08, 0.14), frameMat);
    topBar.position.set(0, height / 2 + 0.04, -0.02);
    signGroup.add(topBar);

    const botBar = new THREE.Mesh(new THREE.BoxGeometry(width + 0.22, 0.08, 0.14), frameMat);
    botBar.position.set(0, -height / 2 - 0.04, -0.02);
    signGroup.add(botBar);

    // 5. Downward Warm LED Linear Illumination
    const signLight = new THREE.PointLight(0xfffaea, 1.4, 8);
    signLight.position.set(0, -height / 2 - 0.3, 0.45);
    signGroup.add(signLight);

    this.scene.add(signGroup);
  }

  createClassicalStatuePedestal(x, z, statueType = 'apollo', rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    // 1. Octagonal Polished Nero Marquina Marble Pedestal
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.22,
      metalness: 0.45
    });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.35, 8), pedMat);
    plinth.position.y = 0.175;
    plinth.castShadow = true;
    group.add(plinth);

    const columnShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 1.25, 8), pedMat);
    columnShaft.position.y = 0.95;
    columnShaft.castShadow = true;
    group.add(columnShaft);

    // Gilded Capital Collar
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.18 });
    const trim = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.72, 0.18, 8), goldTrimMat);
    trim.position.y = 1.65;
    group.add(trim);

    // 2. Classical White Carrara Marble Statue Silhouette
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ea,
      roughness: 0.25,
      metalness: 0.05
    });

    const statueGroup = new THREE.Group();
    statueGroup.position.y = 1.74;

    if (statueType === 'venus') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.38, 1.7, 16), marbleMat);
      body.position.y = 0.85;
      statueGroup.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), marbleMat);
      head.position.y = 1.85;
      statueGroup.add(head);

      const drape = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 12, 24), marbleMat);
      drape.rotation.x = Math.PI / 2.3;
      drape.position.y = 0.7;
      statueGroup.add(drape);
    } else if (statueType === 'victory') {
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 1.5, 16), marbleMat);
      torso.position.y = 0.75;
      statueGroup.add(torso);

      const leftWing = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.3, 4), marbleMat);
      leftWing.position.set(-0.45, 1.4, -0.2);
      leftWing.rotation.set(-0.4, 0, 0.6);
      statueGroup.add(leftWing);

      const rightWing = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.3, 4), marbleMat);
      rightWing.position.set(0.45, 1.4, -0.2);
      rightWing.rotation.set(-0.4, 0, -0.6);
      statueGroup.add(rightWing);
    } else {
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 1.3, 16), marbleMat);
      torso.position.y = 0.95;
      statueGroup.add(torso);

      const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.8, 16), marbleMat);
      legs.position.y = 0.4;
      statueGroup.add(legs);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), marbleMat);
      head.position.y = 1.8;
      statueGroup.add(head);

      const cape = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.35, 1.2, 8, 1, true), marbleMat);
      cape.position.set(-0.25, 0.9, -0.15);
      statueGroup.add(cape);
    }

    group.add(statueGroup);

    const statueLight = new THREE.SpotLight(0xfffaec, 2.2, 10, Math.PI / 5, 0.4, 1.2);
    statueLight.position.set(0, 4.5, 2.0);
    statueLight.target = statueGroup;
    group.add(statueLight);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(columnShaft));
  }

  spawnRotundaAtmosphere() {
    // 1. 8-Pointed Imperial Compass Rose Inlay on Nero Marquina Floor (10m diameter)
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.18
    });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const isCardinal = i % 2 === 0;
      const starPoint = new THREE.Mesh(
        new THREE.ConeGeometry(isCardinal ? 0.55 : 0.35, isCardinal ? 5.2 : 3.8, 3),
        starMat
      );
      starPoint.rotation.x = -Math.PI / 2;
      starPoint.rotation.z = -angle;
      starPoint.position.set(Math.sin(angle) * (isCardinal ? 3.4 : 2.5), 0.025, Math.cos(angle) * (isCardinal ? 3.4 : 2.5));
      this.scene.add(starPoint);
    }
    const innerRing = new THREE.Mesh(new THREE.RingGeometry(2.7, 2.9, 48), starMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.026;
    this.scene.add(innerRing);

    // 2. Cascading 3-Tier Royal Carrara Marble Fountain
    const marbleBasinMat = new THREE.MeshStandardMaterial({
      color: 0xf4f2eb,
      roughness: 0.18,
      metalness: 0.08
    });
    const basinRimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18
    });

    // Tier 1: Ground White Carrara Basin (Radius 2.2m)
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.3, 0.55, 48), marbleBasinMat);
    b1.position.y = 0.275;
    b1.castShadow = true;
    b1.receiveShadow = true;
    this.scene.add(b1);
    this.colliders.push(new THREE.Box3().setFromObject(b1));

    const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.06, 16, 48), basinRimMat);
    r1.rotation.x = Math.PI / 2;
    r1.position.y = 0.55;
    this.scene.add(r1);

    // Turquoise Pool in Basin 1
    const pool1Mat = new THREE.MeshStandardMaterial({
      color: 0x00b4d8,
      roughness: 0.08,
      metalness: 0.85,
      emissive: 0x003355,
      emissiveIntensity: 0.5
    });
    const pool1 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.08, 48), pool1Mat);
    pool1.position.y = 0.5;
    this.scene.add(pool1);

    // Tier 2: Mid Basin (Radius 1.3m, Y = 0.9m)
    const b2Ped = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.6, 32), marbleBasinMat);
    b2Ped.position.y = 0.75;
    this.scene.add(b2Ped);

    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.4, 32), marbleBasinMat);
    b2.position.y = 1.15;
    b2.castShadow = true;
    this.scene.add(b2);

    const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.045, 16, 32), basinRimMat);
    r2.rotation.x = Math.PI / 2;
    r2.position.y = 1.35;
    this.scene.add(r2);

    const pool2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.05, 32), pool1Mat);
    pool2.position.y = 1.32;
    this.scene.add(pool2);

    // 4 Golden Lion Spouts on Tier 2
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const spout = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.28), basinRimMat);
      spout.position.set(Math.cos(angle) * 1.25, 1.22, Math.sin(angle) * 1.25);
      spout.rotation.y = -angle + Math.PI / 2;
      this.scene.add(spout);
    }

    // Tier 3: Top Basin (Radius 0.7m, Y = 1.7m)
    const b3Ped = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.5, 24), marbleBasinMat);
    b3Ped.position.y = 1.55;
    this.scene.add(b3Ped);

    const b3 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 0.3, 24), marbleBasinMat);
    b3.position.y = 1.85;
    this.scene.add(b3);

    // Rotating Golden Sculptural Finial
    const statueGeo = new THREE.TorusKnotGeometry(0.32, 0.09, 128, 32);
    const statueMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.98,
      roughness: 0.12,
      emissive: 0x443300,
      emissiveIntensity: 0.35
    });
    this.centerSculpture = new THREE.Mesh(statueGeo, statueMat);
    this.centerSculpture.position.set(0, 2.45, 0);
    this.centerSculpture.castShadow = true;
    this.scene.add(this.centerSculpture);

    // 3. Fountain Spray Particles
    const particleCount = 260;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    this.particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 1] = 1.7 + Math.random() * 0.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;

      this.particleVelocities.push({
        x: (Math.random() - 0.5) * 0.65,
        y: 1.8 + Math.random() * 1.2,
        z: (Math.random() - 0.5) * 0.65
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x90e0ef,
      size: 0.07,
      transparent: true,
      opacity: 0.85
    });
    this.waterParticles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.waterParticles);

    // 4. Monumental 2nd-Floor Mezzanine Balcony Walkway (Height 7.0m)
    const mezzanineGroup = new THREE.Group();
    mezzanineGroup.position.set(0, 7.0, 0);

    const walkwayMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.25,
      metalness: 0.35
    });
    const walkway = new THREE.Mesh(new THREE.RingGeometry(14.0, 17.6, 64), walkwayMat);
    walkway.rotation.x = Math.PI / 2;
    mezzanineGroup.add(walkway);

    const goldRailingMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.2
    });

    const topRail = new THREE.Mesh(new THREE.TorusGeometry(14.15, 0.065, 16, 64), goldRailingMat);
    topRail.rotation.x = Math.PI / 2;
    topRail.position.y = 1.0;
    mezzanineGroup.add(topRail);

    const baseRail = new THREE.Mesh(new THREE.TorusGeometry(14.15, 0.08, 16, 64), goldRailingMat);
    baseRail.rotation.x = Math.PI / 2;
    baseRail.position.y = 0.08;
    mezzanineGroup.add(baseRail);

    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.9, 8), goldRailingMat);
      baluster.position.set(Math.cos(angle) * 14.15, 0.54, Math.sin(angle) * 14.15);
      mezzanineGroup.add(baluster);
    }

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffe8aa }));
      lantern.position.set(Math.cos(angle) * 14.1, 1.25, Math.sin(angle) * 14.1);
      mezzanineGroup.add(lantern);

      const lanternLight = new THREE.PointLight(0xffeaad, 1.2, 14);
      lanternLight.position.copy(lantern.position);
      lanternLight.userData = { worldPos: new THREE.Vector3(lantern.position.x, 7.0 + lantern.position.y, lantern.position.z) };
      mezzanineGroup.add(lanternLight);
      this.cullableLights.push(lanternLight);
    }

    this.scene.add(mezzanineGroup);

    // 5. Volumetric Sunbeam God-Rays from Dome Oculus down to Fountain
    const sunbeamGeo = new THREE.CylinderGeometry(3.6, 12.0, 24.0, 32, 1, true);
    const sunbeamMat = new THREE.MeshBasicMaterial({
      color: 0xffeaae,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.sunbeamMesh = new THREE.Mesh(sunbeamGeo, sunbeamMat);
    this.sunbeamMesh.position.set(0, 12.5, 0);
    this.scene.add(this.sunbeamMesh);

    // 6. Floating Golden Dust Motes in the Sunbeam
    const dustCount = 180;
    const dGeo = new THREE.BufferGeometry();
    const dPos = new Float32Array(dustCount * 3);
    this.dustVelocities = [];

    for (let i = 0; i < dustCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 12;
      dPos[i * 3 + 1] = 1.0 + Math.random() * 20;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      this.dustVelocities.push({
        x: (Math.random() - 0.5) * 0.15,
        y: (Math.random() - 0.5) * 0.12,
        z: (Math.random() - 0.5) * 0.15
      });
    }
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dMat = new THREE.PointsMaterial({
      color: 0xffe8aa,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.dustParticles = new THREE.Points(dGeo, dMat);
    this.scene.add(this.dustParticles);
  }

  spawnTreasuresAndChandeliers() {
    // 9 Grand Crystal Chandeliers
    this.createChandelier(0, 12.5, 0, 2.0);      // Rotunda Chandelier
    this.createChandelier(0, 9.0, -45, 1.2);    // North Hall
    this.createChandelier(0, 9.0, 45, 1.2);     // South Hall
    this.createChandelier(45, 9.0, 0, 1.2);     // East Hall
    this.createChandelier(-45, 9.0, 0, 1.2);    // West Hall
    this.createChandelier(45, 9.0, -45, 1.1);   // North-East Pavilion
    this.createChandelier(45, 9.0, 45, 1.1);    // South-East Pavilion
    this.createChandelier(-45, 9.0, 45, 1.1);   // South-West Pavilion
    this.createChandelier(-45, 9.0, -45, 1.1);  // North-West Pavilion

    // All 56 cultural treasures and mind-bending artifacts are framed as authentic paintings on palace walls
  }

  createChandelier(x, y, z, scale = 1.0) {
    const chGroup = new THREE.Group();
    chGroup.position.set(x, y, z);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0xfffae6 });

    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.5 * scale), goldMat);
    chain.position.y = 1.25 * scale;
    chGroup.add(chain);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.4 * scale, 0.05 * scale, 8, 24), goldMat);
    ring1.rotation.x = Math.PI / 2;
    chGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.8 * scale, 0.04 * scale, 8, 24), goldMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.5 * scale;
    chGroup.add(ring2);

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08 * scale, 8, 8), crystalMat);
      bulb.position.set(Math.cos(angle) * 1.4 * scale, 0.15 * scale, Math.sin(angle) * 1.4 * scale);
      chGroup.add(bulb);
    }

    const chLight = new THREE.PointLight(0xffeedd, 1.8, 20);
    chLight.position.y = -0.2 * scale;
    chLight.userData = { worldPos: new THREE.Vector3(x, y - 0.2 * scale, z) };
    chGroup.add(chLight);
    this.cullableLights.push(chLight);

    this.scene.add(chGroup);
    this.chandeliers.push(chGroup);
  }

  createTreasureShowcase(x, z, type, colorHex) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const pedMat = new THREE.MeshStandardMaterial({ color: 0x181a22, roughness: 0.25, metalness: 0.3 });
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.4), pedMat);
    pedestal.position.y = 0.55;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.3,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1
    });
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.2, 1.3), glassMat);
    glass.position.y = 1.7;
    group.add(glass);

    let treasureMesh;
    const treasureMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x221100,
      emissiveIntensity: 0.3
    });

    if (type === 'crown') {
      treasureMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.25, 12, 1, true), treasureMat);
    } else if (type === 'chalice') {
      treasureMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.1, 0.45, 16), treasureMat);
    } else if (type === 'astrolabe') {
      treasureMesh = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 16, 32), treasureMat);
    } else {
      treasureMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), treasureMat);
    }

    treasureMesh.position.y = 1.65;
    group.add(treasureMesh);
    this.relicMeshes.push(treasureMesh);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(pedestal));
  }

  setupCinematicTour() {
    this.tourStations = [
      {
        pos: new THREE.Vector3(0, 3.2, 14),
        look: new THREE.Vector3(0, 3.8, 0),
        hall: '🏛️ ڕووتۆندای ناوەندی و فوارەی مەڕمەڕ',
        art: 'تاڤگەی کریستاڵ، پەیکەری زێڕین و چریکەی تیشکی خودایی'
      },
      {
        pos: new THREE.Vector3(0, 7.2, 5),
        look: new THREE.Vector3(0, 17.5, 0),
        hall: '👑 گومەزی شاهانەی مۆزەخانە (١٨ مەتر بەرزی)',
        art: 'پەنجەرەی ئۆکولیۆسی ئاسمانی و چرای زەبەلاحی کریستاڵی ٤٨ مۆم'
      },
      {
        pos: new THREE.Vector3(0, 3.2, -28),
        look: new THREE.Vector3(0, 3.8, -77.5),
        hall: '🎨 هۆڵی باکوور: ڕێنیسانسی باڵا',
        art: 'ڕێڕەوی مەزنی ستوونە کۆرینسییەکان بەرەو مۆنا لیزا'
      },
      {
        pos: new THREE.Vector3(0, 3.0, -66),
        look: new THREE.Vector3(0, 3.8, -77.5),
        hall: '🎨 هۆڵی باکوور: ڕێنیسانسی باڵا',
        art: 'مۆنا لیزا (دا ڤینچی) لەگەڵ دروستکردنی ئادەم (مایکل ئەنجیلۆ)'
      },
      {
        pos: new THREE.Vector3(12, 3.2, -50),
        look: new THREE.Vector3(38, 3.8, -60),
        hall: '👑 باڵی باکووری ڕۆژهەڵات: سەردەمی زێڕینی هۆڵەندا',
        art: 'پەڕینەوە لە دەروازەی زێڕین بەرەو هۆڵی شاکارەکانی ڤێرمیر'
      },
      {
        pos: new THREE.Vector3(38, 3.2, -64),
        look: new THREE.Vector3(38, 3.8, -77.5),
        hall: '👑 باڵی باکووری ڕۆژهەڵات: سەردەمی زێڕینی هۆڵەندا',
        art: 'ئێشکگری شەوانە (ڕێمبرانت) و کچێک بە گوارەی یاقووت (ڤێرمیر)'
      },
      {
        pos: new THREE.Vector3(45, 3.2, -45),
        look: new THREE.Vector3(57.2, 3.8, -52),
        hall: '👑 باڵی باکووری ڕۆژهەڵات: شاکارە کلاسیکییەکان',
        art: 'کچانی شەرەف (دیێگۆ ڤیلاسکێز) و هاوسەرگیری ئارنۆلفینی'
      },
      {
        pos: new THREE.Vector3(38, 3.2, -20),
        look: new THREE.Vector3(60, 3.8, 0),
        hall: '🌻 هۆڵی ڕۆژهەڵات: ئیمپڕێشنیزمی فەڕەنسی',
        art: 'دەروازەی ڕۆژهەڵات بەرەو شەوی ئەستێرەبارانی ڤان گۆگ'
      },
      {
        pos: new THREE.Vector3(65, 3.2, 0),
        look: new THREE.Vector3(77.5, 3.8, 0),
        hall: '🌻 هۆڵی ڕۆژهەڵات: ئیمپڕێشنیزم',
        art: 'شەوی ئەستێرەباران، گوڵەبەڕۆژەکان و کافێی شەوانە (ڤینسێنت ڤان گۆگ)'
      },
      {
        pos: new THREE.Vector3(48, 3.2, 0),
        look: new THREE.Vector3(68, 3.8, 12.2),
        hall: '🌻 هۆڵی ڕۆژهەڵات: ئیمپڕێشنیزم',
        art: 'نیلووفەرە ئاوییەکان (کلۆد مۆنێ)'
      },
      {
        pos: new THREE.Vector3(38, 3.2, 22),
        look: new THREE.Vector3(48, 3.8, 55),
        hall: '🌸 باڵی باشووری ڕۆژهەڵات: خاڵکاری و بۆتیچێلی',
        art: 'پەڕینەوە بەناو دەروازەی باشووری ڕۆژهەڵات بەرەو ڤینۆس'
      },
      {
        pos: new THREE.Vector3(46, 3.2, 64),
        look: new THREE.Vector3(48, 3.8, 77.5),
        hall: '🌸 باڵی باشووری ڕۆژهەڵات: خاڵکاری و بۆتیچێلی',
        art: 'لەدایکبوونی ڤینۆس (بۆتیچێلی) و گراند ژات (جۆرج سیۆرا)'
      },
      {
        pos: new THREE.Vector3(20, 3.2, 50),
        look: new THREE.Vector3(0, 3.8, 65),
        hall: '🌊 هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم',
        art: 'چوونەناو هۆڵی باشوور بەرەو ماچەکەی کلیمت'
      },
      {
        pos: new THREE.Vector3(0, 3.2, 65),
        look: new THREE.Vector3(0, 3.8, 77.5),
        hall: '🌊 هۆڵی باشوور: مۆدێرنیزم و سیمبۆلیزم',
        art: 'ماچەکە (گوستاڤ کلیمت)، هاوار (ئێدڤارد مونک) و شەپۆلە مەزنەکەی کاناگاوا'
      },
      {
        pos: new THREE.Vector3(0, 3.2, 42),
        look: new THREE.Vector3(-12.2, 3.8, 35),
        hall: '🌊 هۆڵی باشوور: ڕۆمانسیزم و ڕیالیزم',
        art: 'ئازادی ڕێبەری گەل دەکات (دێلاکروا) و گۆتیکی ئەمریکی (گرانت وود)'
      },
      {
        pos: new THREE.Vector3(-22, 3.2, 50),
        look: new THREE.Vector3(-38, 3.8, 65),
        hall: '🌀 باڵی باشووری ڕۆژئاوا: سوریالیزم و پارادۆکسی ئەقڵتەزێن',
        art: 'چوونەناو جیهانی خەیاڵ و تابلۆ دەروونییە قووڵەکان'
      },
      {
        pos: new THREE.Vector3(-25, 3.2, 65),
        look: new THREE.Vector3(-20, 3.8, 77.5),
        hall: '🌀 باڵی سوریالیزم: سەلڤادۆر دالی',
        art: 'کاتی بەردەوام (کاتژمێرە تواوەکان) و کوڕی مرۆڤ (ڕێنێ ماگریت)'
      },
      {
        pos: new THREE.Vector3(-44, 3.2, 65),
        look: new THREE.Vector3(-40, 3.8, 77.5),
        hall: '🌀 باڵی سوریالیزم: هیرۆنیمۆس بۆش',
        art: 'باخچەی چێژە زەمینییەکان و فریودانی وێنەکان (Ceci n’est pas une pipe)'
      },
      {
        pos: new THREE.Vector3(-48, 3.2, 60),
        look: new THREE.Vector3(-57.5, 3.8, 65),
        hall: '🌀 باڵی سوریالیزم: پارادۆکسەکانی ئێشەر',
        art: 'ڕێژەیی (پلیکانە دژە-کێشکردنەکان)، دەستە وێنەکێشەکان و تاڤگەی ئەبەدی'
      },
      {
        pos: new THREE.Vector3(-45, 3.2, 42),
        look: new THREE.Vector3(-46.5, 3.8, 33.5),
        hall: '🌀 باڵی سوریالیزم: وەهمی بینین',
        art: 'ڕوخساری میوە و گوڵەکان (ئارچیمبۆڵدۆ) و فیلە باڵابەرزەکانی دالی'
      },
      {
        pos: new THREE.Vector3(-38, 3.2, 22),
        look: new THREE.Vector3(-60, 3.8, 0),
        hall: '🏰 هۆڵی ڕۆژئاوا: کۆشکی کەلەپوور و شارستانیەتی کوردستان',
        art: 'دەروازەی شکۆداری نیشتمان بەرەو قەڵای هەولێر و زاگرۆس'
      },
      {
        pos: new THREE.Vector3(-65, 3.2, 0),
        look: new THREE.Vector3(-77.5, 3.8, 0),
        hall: '🏰 هۆڵی ڕۆژئاوا: کەلەپووری دێرینی کوردستان',
        art: 'قەڵای دێرینی هەولێر (٦٠٠٠ ساڵە) و قەڵای کەرکووک'
      },
      {
        pos: new THREE.Vector3(-65, 3.2, 5),
        look: new THREE.Vector3(-77.5, 3.8, 7),
        hall: '🏰 هۆڵی ڕۆژئاوا: شوێنەواری پێش مێژوو',
        art: 'ئەشکەوتی شانەدەر (گۆڕستانی گوڵی نیاندەرتاڵ لە برادۆست)'
      },
      {
        pos: new THREE.Vector3(-35, 3.2, 0),
        look: new THREE.Vector3(-28, 3.8, 12.5),
        hall: '🏰 هۆڵی ڕۆژئاوا: فەرهەنگ و کەلەپووری ڕەسەن',
        art: 'پەرستگای پیرۆزی لالش، فەرشی کوردی، جلوبەرگی ڕەسەن و نەورۆزی ئاکرێ'
      },
      {
        pos: new THREE.Vector3(-38, 3.2, -22),
        look: new THREE.Vector3(-45, 3.8, -55),
        hall: '🦁 باڵی باکووری ڕۆژئاوا: شارستانیەتی دێرینی مێزۆپۆتامیا',
        art: 'پەڕینەوە بەرەو دەروازەی عەشتار و شارستانیەتە دێرینەکان'
      },
      {
        pos: new THREE.Vector3(-40, 3.2, -65),
        look: new THREE.Vector3(-40, 3.8, -77.5),
        hall: '🦁 باڵی باکووری ڕۆژئاوا: مێزۆپۆتامیا و بابل',
        art: 'دەروازەی شکۆداری عەشتار و ڕێڕەوی کاروانی بابیلۆن (شێری زێڕین)'
      },
      {
        pos: new THREE.Vector3(-48, 3.2, -55),
        look: new THREE.Vector3(-57.5, 3.8, -68),
        hall: '🦁 باڵی باکووری ڕۆژئاوا: شوێنەواری مێخی و زێڕینکاری',
        art: 'تاتەبەردی لافاوەکەی گیلگامێش (نەینەوا) و قاپە زێڕینەکەی حەسەنلوو'
      },
      {
        pos: new THREE.Vector3(-14, 3.2, -14),
        look: new THREE.Vector3(0, 3.5, 0),
        hall: '🏛️ گەڕانەوە بۆ ڕووتۆندای سەرەکی (Grand Atrium)',
        art: 'کۆتایی گەشتە سینەماییە شاهانەییەکە بە دەوری فوارەی مەڕمەڕدا'
      }
    ];

    const posPoints = this.tourStations.map(s => s.pos);
    const lookPoints = this.tourStations.map(s => s.look);

    this.tourSpline = new THREE.CatmullRomCurve3(posPoints, true);
    this.tourLookSpline = new THREE.CatmullRomCurve3(lookPoints, true);
  }

  toggleCinematicTour() {
    this.isCinematicTour = !this.isCinematicTour;
    const btn = document.getElementById('cinematic-tour-btn');
    const hud = document.getElementById('cinematic-hud');

    if (this.isCinematicTour) {
      if (this.controls) this.controls.unlock();
      this.blockerEl.classList.add('hidden');
      if (btn) btn.classList.add('active');
      if (hud) hud.classList.remove('hidden');
      window.galleryAudio.playTeleport();
    } else {
      if (btn) btn.classList.remove('active');
      if (hud) hud.classList.add('hidden');
      if (!this.isMobile && this.controls) this.controls.lock();
    }
    return this.isCinematicTour;
  }

  getArtworkTextureSrc(art) {
    if (!art) return '';
    const filename = (art.localImage || '').replace(/^images\//, '');
    if (typeof ARTWORK_IMAGES !== 'undefined' && filename && ARTWORK_IMAGES[filename]) {
      return ARTWORK_IMAGES[filename];
    }
    if (art.base64) return art.base64;
    if (art.resolvedImageSrc) return art.resolvedImageSrc;
    return art.localImage || '';
  }

  spawnArtworks() {
    GALLERY_ARTWORKS.forEach((art) => {
      const artGroup = new THREE.Group();
      artGroup.position.set(art.wallPosition.x, art.wallPosition.y, art.wallPosition.z);
      artGroup.rotation.y = art.rotationY;

      // 1. Canvas Mesh - Elevated cleanly at z = 0.02 so nothing obscures the artwork
      const canvasGeo = new THREE.PlaneGeometry(art.width, art.height);
      const canvasMat = new THREE.MeshStandardMaterial({
        roughness: 0.22,
        metalness: 0.0,
        side: THREE.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      });
      const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
      canvasMesh.position.set(0, 0, 0.02);
      canvasMesh.receiveShadow = true;
      canvasMesh.userData = { artwork: art };
      artGroup.add(canvasMesh);
      this.artworksMeshes.push(canvasMesh);

      // Load Masterpiece Texture immediately (Direct Base64 from memory, 100% offline & CORS-free)
      const src = this.getArtworkTextureSrc(art);
      art.resolvedImageSrc = src;
      if (src) {
        this.textureLoader.load(
          src,
          (realTexture) => {
            realTexture.encoding = THREE.sRGBEncoding;
            realTexture.anisotropy = this.isMobile ? 1 : Math.min(this.renderer.capabilities.getMaxAnisotropy() || 1, 4);
            realTexture.minFilter = THREE.LinearMipmapLinearFilter;
            realTexture.magFilter = THREE.LinearFilter;
            realTexture.generateMipmaps = true;
            canvasMat.map = realTexture;
            canvasMat.needsUpdate = true;
          },
          undefined,
          (err) => {
            console.warn('Fallback canvas for', art.id, err);
            const fallback = createArtworkCanvasFallback(art, 512);
            const fbTex = new THREE.CanvasTexture(fallback);
            fbTex.encoding = THREE.sRGBEncoding;
            canvasMat.map = fbTex;
            canvasMat.needsUpdate = true;
          }
        );
      } else {
        const fallback = createArtworkCanvasFallback(art, 512);
        const fbTex = new THREE.CanvasTexture(fallback);
        fbTex.encoding = THREE.sRGBEncoding;
        canvasMat.map = fbTex;
        canvasMat.needsUpdate = true;
      }

      // 2. Luxury Stepped Museum Frame Dimensions
      const isVip = !!art.isVip;
      const filletW = 0.035;       // Inner delicate gold leaf fillet
      const matW = 0.12;          // Fine museum linen/velvet passe-partout mat board
      const frameMouldingW = isVip ? 0.28 : 0.22; // Outer stepped gold moulding
      const frameDepth = 0.14;

      // Primary Gilded Frame Material (24K Gold Leaf / Antique Gilt)
      const goldFrameMat = new THREE.MeshStandardMaterial({
        color: isVip ? 0xdfb743 : 0xcba345,
        metalness: 0.92,
        roughness: 0.22
      });

      // Inner Linen Mat Board (Passe-partout)
      const matBoardMat = new THREE.MeshStandardMaterial({
        color: isVip ? 0x181b24 : 0x12141c,
        roughness: 0.9,
        metalness: 0.05
      });

      // Framing Dimensions
      const filletInnerX = art.width / 2;
      const filletInnerY = art.height / 2;
      const matInnerX = filletInnerX + filletW;
      const matInnerY = filletInnerY + filletW;
      const frameInnerX = matInnerX + matW;
      const frameInnerY = matInnerY + matW;
      const outerTotalW = art.width + (filletW + matW + frameMouldingW) * 2;
      const outerTotalH = art.height + (filletW + matW + frameMouldingW) * 2;

      if (this.isMobile) {
        // High-Performance Mobile Frame: Single Unified Gilded Mesh (Saves ~1,300 draw calls)
        const mobileFrameGeo = new THREE.BoxGeometry(outerTotalW, outerTotalH, 0.05);
        const mobileFrame = new THREE.Mesh(mobileFrameGeo, goldFrameMat);
        mobileFrame.position.set(0, 0, -0.015);
        artGroup.add(mobileFrame);
      } else {
        // Desktop: Ultra-detailed ornamental stepped gallery frame
        // A. Inner Gold Leaf Fillet Bead - strictly outside canvas perimeter
        const fTop = new THREE.Mesh(new THREE.BoxGeometry(art.width + filletW * 2, filletW, 0.025), goldFrameMat);
        fTop.position.set(0, filletInnerY + filletW / 2, 0.015);
        artGroup.add(fTop);

        const fBot = new THREE.Mesh(new THREE.BoxGeometry(art.width + filletW * 2, filletW, 0.025), goldFrameMat);
        fBot.position.set(0, -filletInnerY - filletW / 2, 0.015);
        artGroup.add(fBot);

        const fLeft = new THREE.Mesh(new THREE.BoxGeometry(filletW, art.height, 0.025), goldFrameMat);
        fLeft.position.set(-filletInnerX - filletW / 2, 0, 0.015);
        artGroup.add(fLeft);

        const fRight = new THREE.Mesh(new THREE.BoxGeometry(filletW, art.height, 0.025), goldFrameMat);
        fRight.position.set(filletInnerX + filletW / 2, 0, 0.015);
        artGroup.add(fRight);

        // B. Linen Passe-Partout Mat Border - strictly outside fillet
        const matTop = new THREE.Mesh(new THREE.BoxGeometry(art.width + (filletW + matW) * 2, matW, 0.03), matBoardMat);
        matTop.position.set(0, matInnerY + matW / 2, 0.01);
        artGroup.add(matTop);

        const matBot = new THREE.Mesh(new THREE.BoxGeometry(art.width + (filletW + matW) * 2, matW, 0.03), matBoardMat);
        matBot.position.set(0, -matInnerY - matW / 2, 0.01);
        artGroup.add(matBot);

        const matLeft = new THREE.Mesh(new THREE.BoxGeometry(matW, art.height + filletW * 2, 0.03), matBoardMat);
        matLeft.position.set(-matInnerX - matW / 2, 0, 0.01);
        artGroup.add(matLeft);

        const matRight = new THREE.Mesh(new THREE.BoxGeometry(matW, art.height + filletW * 2, 0.03), matBoardMat);
        matRight.position.set(matInnerX + matW / 2, 0, 0.01);
        artGroup.add(matRight);

        // C. Outer Gilded Stepped Moulding Bars - strictly outside mat, projects forward by frameDepth
        const topBar = new THREE.Mesh(new THREE.BoxGeometry(outerTotalW, frameMouldingW, frameDepth), goldFrameMat);
        topBar.position.set(0, frameInnerY + frameMouldingW / 2, 0.02);
        artGroup.add(topBar);

        const botBar = new THREE.Mesh(new THREE.BoxGeometry(outerTotalW, frameMouldingW, frameDepth), goldFrameMat);
        botBar.position.set(0, -frameInnerY - frameMouldingW / 2, 0.02);
        artGroup.add(botBar);

        const leftBar = new THREE.Mesh(new THREE.BoxGeometry(frameMouldingW, art.height + (filletW + matW) * 2, frameDepth), goldFrameMat);
        leftBar.position.set(-frameInnerX - frameMouldingW / 2, 0, 0.02);
        artGroup.add(leftBar);

        const rightBar = new THREE.Mesh(new THREE.BoxGeometry(frameMouldingW, art.height + (filletW + matW) * 2, frameDepth), goldFrameMat);
        rightBar.position.set(frameInnerX + frameMouldingW / 2, 0, 0.02);
        artGroup.add(rightBar);

        // D. 4 Gilded Ornamental Corner Rosettes & Diamond Jewels
        const cornerSize = frameMouldingW * 1.15;
        const cornerGeo = new THREE.BoxGeometry(cornerSize, cornerSize, frameDepth + 0.025);
        const cx = frameInnerX + frameMouldingW / 2;
        const cy = frameInnerY + frameMouldingW / 2;

        [[-cx, cy], [cx, cy], [-cx, -cy], [cx, -cy]].forEach(([cornerX, cornerY]) => {
          const rosette = new THREE.Mesh(cornerGeo, goldFrameMat);
          rosette.position.set(cornerX, cornerY, 0.025);
          artGroup.add(rosette);

          const jewel = new THREE.Mesh(new THREE.ConeGeometry(cornerSize * 0.35, 0.05, 4), goldFrameMat);
          jewel.rotation.x = -Math.PI / 2;
          jewel.rotation.z = Math.PI / 4;
          jewel.position.set(cornerX, cornerY, 0.025 + frameDepth / 2 + 0.025);
          artGroup.add(jewel);
        });

        // E. Backing Bay Niche Panel with Architectural Flanking LED & Soft Ambient Halo
        const bayW = outerTotalW + 0.45;
        const bayH = outerTotalH + 0.45;
        const bayMat = new THREE.MeshStandardMaterial({
          color: 0x0c0f16,
          roughness: 0.5,
          metalness: 0.25
        });
        const bayMesh = new THREE.Mesh(new THREE.BoxGeometry(bayW, bayH, 0.04), bayMat);
        bayMesh.position.set(0, 0, -0.04);
        artGroup.add(bayMesh);

        const ledChannelMat = new THREE.MeshBasicMaterial({
          color: art.isVip ? 0xffe58f : 0xfffaed,
          transparent: true,
          opacity: 0.45
        });
        const leftStrip = new THREE.Mesh(new THREE.BoxGeometry(0.035, bayH - 0.1, 0.02), ledChannelMat);
        leftStrip.position.set(-bayW / 2 + 0.06, 0, -0.02);
        artGroup.add(leftStrip);

        const rightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.035, bayH - 0.1, 0.02), ledChannelMat);
        rightStrip.position.set(bayW / 2 - 0.06, 0, -0.02);
        artGroup.add(rightStrip);

        const haloGeo = new THREE.PlaneGeometry(outerTotalW + 0.8, outerTotalH + 0.8);
        const haloMat = new THREE.MeshBasicMaterial({
          color: art.isVip ? 0xffea9f : 0xfffaed,
          transparent: true,
          opacity: 0.2,
          depthWrite: false
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.set(0, 0, -0.065);
        artGroup.add(haloMesh);
      }

      // F. Engraved Beveled Brass Museum Title Plaque with Kurdish & English Typography
      const plaqueCanvas = document.createElement('canvas');
      plaqueCanvas.width = 512;
      plaqueCanvas.height = 128;
      const pctx = plaqueCanvas.getContext('2d');

      const pgrad = pctx.createLinearGradient(0, 0, 512, 128);
      pgrad.addColorStop(0, '#cca23b');
      pgrad.addColorStop(0.5, '#e4c46c');
      pgrad.addColorStop(1, '#cca23b');
      pctx.fillStyle = pgrad;
      pctx.fillRect(0, 0, 512, 128);

      pctx.strokeStyle = '#6b4f12';
      pctx.lineWidth = 3;
      pctx.strokeRect(6, 6, 500, 116);

      pctx.fillStyle = '#1c1505';
      pctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
      pctx.textAlign = 'center';
      pctx.textBaseline = 'middle';
      pctx.fillText(art.titleKu || art.titleEn, 256, 42);

      pctx.font = '600 17px "Segoe UI", Georgia, serif';
      pctx.fillStyle = '#3a2e12';
      pctx.fillText((art.artist || '') + (art.year ? ' • ' + art.year : ''), 256, 88);

      const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
      plaqueTex.anisotropy = 8;

      const plaqueMat = new THREE.MeshStandardMaterial({
        map: plaqueTex,
        metalness: 0.85,
        roughness: 0.25
      });
      const plaqueY = -frameInnerY - frameMouldingW - 0.28;
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.46, 0.035), plaqueMat);
      plaque.position.set(0, plaqueY, 0.02);
      artGroup.add(plaque);

      // G. Dedicated Warm Gallery Spotlight aimed at the canvas
      const spotLight = new THREE.SpotLight(0xfffaed, 3.4, 16, Math.PI / 4.2, 0.32, 1.15);
      spotLight.position.set(
        art.wallPosition.x,
        art.wallPosition.y + art.height / 2 + 0.85,
        art.wallPosition.z + (art.rotationY === 0 ? 1.2 : art.rotationY === Math.PI ? -1.2 : 0)
      );
      if (Math.abs(art.rotationY - Math.PI / 2) < 0.1) spotLight.position.x += 1.2;
      if (Math.abs(art.rotationY + Math.PI / 2) < 0.1) spotLight.position.x -= 1.2;

      spotLight.target = canvasMesh;
      this.scene.add(spotLight);
      this.spotlights.push(spotLight);
      this.cullableLights.push(spotLight);

      this.scene.add(artGroup);
    });
  }

  loadRealArtworkTexture(art, canvasMat) {
    const src = this.getArtworkTextureSrc(art);
    if (!src) return;

    this.textureLoader.load(
      src,
      (realTexture) => {
        realTexture.encoding = THREE.sRGBEncoding;
        realTexture.anisotropy = this.isMobile ? 1 : Math.min(this.renderer.capabilities.getMaxAnisotropy() || 1, 4);
        realTexture.minFilter = THREE.LinearMipmapLinearFilter;
        realTexture.magFilter = THREE.LinearFilter;
        canvasMat.map = realTexture;
        canvasMat.needsUpdate = true;
        art.resolvedImageSrc = src;
      },
      undefined,
      (err) => {
        console.warn('Fallback texture for', art.id, err);
      }
    );
  }

  setupEvents() {
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isSprinting = true;
          break;
        case 'KeyC':
          this.toggleCinematicTour();
          break;
        case 'KeyP':
          this.togglePhotoMode();
          break;
        case 'Tab':
        case 'KeyM':
          if (this.isPhotoMode) {
            this.togglePhotoMouseLock();
            event.preventDefault();
          }
          break;
        case 'Space':
        case 'Enter':
          if (this.isPhotoMode) {
            this.takePhoto();
            event.preventDefault();
          }
          break;
        case 'KeyE':
          if (this.activeArtwork) {
            this.openArtworkModal(this.activeArtwork);
          }
          break;
        case 'Escape':
          if (this.isPhotoMode) {
            if (this.controls && this.controls.isLocked) {
              this.controls.unlock();
            } else {
              this.exitPhotoMode();
            }
          } else if (this.isCinematicTour) {
            this.toggleCinematicTour();
          } else {
            this.closeArtworkModal();
          }
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isSprinting = false;
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    window.addEventListener('click', () => {
      if (!this.controls.isLocked && !this.isCinematicTour && !this.isMobile) {
        // Blocker handles lock
      } else if (this.activeArtwork) {
        this.openArtworkModal(this.activeArtwork);
      }
    });

    // Cinematic Tour Button
    const tourBtn = document.getElementById('cinematic-tour-btn');
    if (tourBtn) {
      tourBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCinematicTour();
      });
    }

    // Audio Toggle
    const audioBtn = document.getElementById('audio-toggle-btn');
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isPlaying = window.galleryAudio.toggleMusic();
      const label = audioBtn.querySelector('.audio-label');
      label.textContent = isPlaying ? 'میوزیک: چالاک' : 'میوزیک: ناچالاک';
      audioBtn.style.borderColor = isPlaying ? '#d4af37' : 'rgba(255,255,255,0.12)';
    });

    // Theme selector
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.setLightingTheme(btn.dataset.theme);
      });
    });

    // Teleportation Menu
    const teleportBtn = document.getElementById('teleport-btn');
    const teleportMenu = document.getElementById('teleport-menu');
    teleportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      teleportMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      teleportMenu.classList.add('hidden');
    });

    teleportMenu.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        teleportMenu.classList.add('hidden');
        if (this.isCinematicTour) this.toggleCinematicTour();
        this.teleportTo(b.dataset.goto);
      });
    });

    // Modal close & Audio guide voice
    document.getElementById('modal-close-btn').addEventListener('click', () => this.closeArtworkModal());
    document.getElementById('resume-tour-btn').addEventListener('click', () => this.closeArtworkModal());

    const voiceBtn = document.getElementById('audio-guide-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if (!this.activeArtwork) return;
        if (window.galleryAudio.isSpeaking) {
          window.galleryAudio.stopSpeaking();
          voiceBtn.querySelector('.voice-label').textContent = 'لێدانی دەنگ';
        } else {
          const textToSpeak = `${this.activeArtwork.titleKu}. شێوەکار: ${this.activeArtwork.artist}. ${this.activeArtwork.descKu}`;
          window.galleryAudio.speakText(textToSpeak, 'ku');
          voiceBtn.querySelector('.voice-label').textContent = 'وەستاندنی دەنگ';
        }
      });
    }

    // Download Artwork Image
    document.getElementById('download-art-btn').addEventListener('click', () => {
      if (!this.activeArtwork) return;
      const src = this.getArtworkTextureSrc(this.activeArtwork) || this.activeArtwork.resolvedImageSrc || this.activeArtwork.localImage;
      if (src) {
        const link = document.createElement('a');
        link.download = `${this.activeArtwork.id}.jpg`;
        link.href = src;
        link.target = '_blank';
        link.click();
      }
    });

    // Help Button
    document.getElementById('help-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.controls) this.controls.unlock();
      this.blockerEl.classList.remove('hidden');
    });

    // Photo Mode Trigger Button
    const photoBtn = document.getElementById('photo-mode-btn');
    if (photoBtn) {
      photoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePhotoMode();
      });
    }

    // Graphics Quality Dropdown & Selector
    const qualityBtn = document.getElementById('quality-btn');
    const qualityMenu = document.getElementById('quality-menu');
    if (qualityBtn && qualityMenu) {
      qualityBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        qualityMenu.classList.toggle('hidden');
      });

      qualityMenu.querySelectorAll('button').forEach((b) => {
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          qualityMenu.classList.add('hidden');
          this.setGraphicsQuality(b.dataset.quality);
        });
      });

      document.addEventListener('click', () => {
        qualityMenu.classList.add('hidden');
      });
    }

    // Photo Mode Mouse Lock/Unlock Toggle Buttons
    const photoMouseBtn = document.getElementById('photo-mouse-toggle-btn');
    if (photoMouseBtn) {
      photoMouseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePhotoMouseLock();
      });
    }

    const photoMouseQuickBtn = document.getElementById('photo-mouse-quick-btn');
    if (photoMouseQuickBtn) {
      photoMouseQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePhotoMouseLock();
      });
    }

    // Drag-to-Look on Viewfinder Screen when Mouse is Free
    let isDraggingPhoto = false;
    let prevX = 0;
    let prevY = 0;
    const vf = document.querySelector('.viewfinder-frame');
    if (vf) {
      vf.addEventListener('pointerdown', (e) => {
        if (!this.isPhotoMode || (this.controls && this.controls.isLocked)) return;
        if (e.target.closest('button') || e.target.closest('input')) return;
        isDraggingPhoto = true;
        prevX = e.clientX;
        prevY = e.clientY;
        try { vf.setPointerCapture(e.pointerId); } catch (err) {}
      });

      vf.addEventListener('pointermove', (e) => {
        if (!this.isPhotoMode || !isDraggingPhoto || (this.controls && this.controls.isLocked)) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;

        const sensitivity = 0.0028;
        this.cameraEuler.setFromQuaternion(this.camera.quaternion, 'YXZ');
        this.cameraEuler.y -= dx * sensitivity;
        this.cameraEuler.x = Math.max(
          -Math.PI / 2.2,
          Math.min(Math.PI / 2.2, this.cameraEuler.x - dy * sensitivity)
        );
        this.camera.quaternion.setFromEuler(this.cameraEuler);
      });

      const stopDrag = (e) => {
        if (isDraggingPhoto) {
          isDraggingPhoto = false;
          try { vf.releasePointerCapture(e.pointerId); } catch (err) {}
        }
      };
      vf.addEventListener('pointerup', stopDrag);
      vf.addEventListener('pointercancel', stopDrag);
    }

    // Photo Mode Exit Button
    const photoExitBtn = document.getElementById('photo-exit-btn');
    if (photoExitBtn) {
      photoExitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exitPhotoMode();
      });
    }

    // Photo Mode Shutter Button
    const photoShutterBtn = document.getElementById('photo-shutter-btn');
    if (photoShutterBtn) {
      photoShutterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.takePhoto();
      });
    }

    // Photo FOV Zoom Slider
    const fovSlider = document.getElementById('photo-fov-slider');
    if (fovSlider) {
      fovSlider.addEventListener('input', (e) => {
        this.setPhotoFov(parseFloat(e.target.value));
      });
    }

    // Photo Filter Pills
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setPhotoFilter(pill.dataset.filter);
      });
    });

    // Photo Preview Modal Actions
    const previewCloseBtn = document.getElementById('preview-close-btn');
    const retakePhotoBtn = document.getElementById('retake-photo-btn');
    const downloadPhotoBtn = document.getElementById('download-photo-btn');

    if (previewCloseBtn) {
      previewCloseBtn.addEventListener('click', () => {
        if (this.photoPreviewModalEl) this.photoPreviewModalEl.classList.add('hidden');
      });
    }
    if (retakePhotoBtn) {
      retakePhotoBtn.addEventListener('click', () => {
        if (this.photoPreviewModalEl) this.photoPreviewModalEl.classList.add('hidden');
      });
    }
    if (downloadPhotoBtn) {
      downloadPhotoBtn.addEventListener('click', () => {
        if (!this.lastCapturedPhotoData) return;
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.download = `Grand-Royal-Palace-${timestamp}.jpg`;
        link.href = this.lastCapturedPhotoData;
        link.target = '_blank';
        link.click();
        window.galleryAudio.playChime(659.25, 0.2);
      });
    }

    // Window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setGraphicsQuality(level) {
    this.graphicsQuality = level;
    localStorage.setItem('gallery_graphics_quality', level);

    const label = document.getElementById('quality-label');
    const menuButtons = document.querySelectorAll('#quality-menu button');
    menuButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.quality === level);
    });

    if (level === 'low') {
      if (label) label.textContent = 'خێرا';
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1.0);
      if (this.dirLight) this.dirLight.castShadow = false;
      if (this.dustParticles) this.dustParticles.visible = false;
      if (this.waterParticles) this.waterParticles.visible = false;
      this.renderer.toneMapping = THREE.LinearToneMapping;
    } else if (level === 'ultra') {
      if (label) label.textContent = 'شاهانە';
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.shadowMap.needsUpdate = true;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      if (this.dirLight) {
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
      }
      if (this.dustParticles) this.dustParticles.visible = true;
      if (this.waterParticles) this.waterParticles.visible = true;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.25;
    } else {
      // Medium / Balanced default
      if (label) label.textContent = 'هاوسەنگ';
      this.renderer.shadowMap.enabled = !this.isMobile;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.shadowMap.needsUpdate = true;
      this.renderer.setPixelRatio(this.isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25));
      if (this.dirLight) {
        this.dirLight.castShadow = !this.isMobile;
        this.dirLight.shadow.mapSize.width = 1024;
        this.dirLight.shadow.mapSize.height = 1024;
      }
      if (this.dustParticles) this.dustParticles.visible = !this.isMobile;
      if (this.waterParticles) this.waterParticles.visible = true;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.22;
    }

    this.scene.traverse((obj) => {
      if (obj.material) obj.material.needsUpdate = true;
    });
  }

  togglePhotoMode() {
    if (this.isPhotoMode) {
      this.exitPhotoMode();
    } else {
      this.enterPhotoMode();
    }
  }

  enterPhotoMode() {
    this.isPhotoMode = true;
    if (this.isCinematicTour) this.toggleCinematicTour();
    if (this.modalEl && !this.modalEl.classList.contains('hidden')) this.closeArtworkModal();

    // Hide normal HUD elements
    if (this.hudHeaderEl) this.hudHeaderEl.classList.add('hidden');
    if (this.minimapContainerEl) this.minimapContainerEl.classList.add('hidden');
    if (this.crosshairEl) this.crosshairEl.classList.add('hidden');
    if (this.promptEl) this.promptEl.classList.add('hidden');

    // Show Photo Mode viewfinder and controls
    if (this.photoOverlayEl) this.photoOverlayEl.classList.remove('hidden');

    // Sync FOV slider
    const fovSlider = document.getElementById('photo-fov-slider');
    const fovVal = document.getElementById('photo-fov-val');
    if (fovSlider) fovSlider.value = this.camera.fov;
    if (fovVal) fovVal.textContent = Math.round(this.camera.fov) + '°';

    // Automatically free mouse cursor so user can directly click on filters, zoom & buttons!
    if (this.controls) {
      this.controls.unlock();
    }
    this.updatePhotoMouseState(false);
    window.galleryAudio.playChime(784, 0.15);
  }

  togglePhotoMouseLock() {
    if (!this.controls) return;
    if (this.controls.isLocked) {
      this.controls.unlock();
      this.updatePhotoMouseState(false);
    } else {
      this.controls.lock();
      this.updatePhotoMouseState(true);
    }
  }

  updatePhotoMouseState(isLocked) {
    const statusEl = document.getElementById('photo-mouse-status');
    const toggleBtn = document.getElementById('photo-mouse-toggle-btn');
    const iconEl = document.getElementById('photo-mouse-icon');
    const textEl = document.getElementById('photo-mouse-text');
    const quickBtn = document.getElementById('photo-mouse-quick-btn');
    const quickIcon = document.getElementById('photo-mouse-quick-icon');
    const quickText = document.getElementById('photo-mouse-quick-text');

    if (this.photoOverlayEl) {
      this.photoOverlayEl.classList.toggle('camera-locked', isLocked);
    }

    if (isLocked) {
      if (statusEl) statusEl.textContent = '🔒 ماوس قفڵە لەسەر کامێرا (بۆ ئازادکردن کلیک بکە یان Tab دابگرە)';
      if (iconEl) iconEl.textContent = '🔓';
      if (textEl) textEl.textContent = 'ئازادکردنی ماوس (Free Cursor)';
      if (quickIcon) quickIcon.textContent = '🔒';
      if (quickText) quickText.textContent = 'ماوس: قفڵ';
      if (quickBtn) quickBtn.classList.add('active');
    } else {
      if (statusEl) statusEl.textContent = '🔓 ماوس ئازادە (دەستکاری فلتەر و زووم بکە یان بە ماوس ڕایبکێشە)';
      if (iconEl) iconEl.textContent = '🔒';
      if (textEl) textEl.textContent = 'سەیرکردنی 360° بە ماوس';
      if (quickIcon) quickIcon.textContent = '🔓';
      if (quickText) quickText.textContent = 'ماوس: ئازاد';
      if (quickBtn) quickBtn.classList.remove('active');
    }
  }

  exitPhotoMode() {
    this.isPhotoMode = false;

    // Restore normal HUD elements
    if (this.hudHeaderEl) this.hudHeaderEl.classList.remove('hidden');
    if (this.minimapContainerEl) this.minimapContainerEl.classList.remove('hidden');
    if (this.crosshairEl) this.crosshairEl.classList.remove('hidden');

    // Hide Photo Mode overlay & preview
    if (this.photoOverlayEl) this.photoOverlayEl.classList.add('hidden');
    if (this.photoPreviewModalEl) this.photoPreviewModalEl.classList.add('hidden');

    // Reset camera FOV to default
    this.camera.fov = this.defaultFov;
    this.camera.updateProjectionMatrix();

    // Reset filter
    this.setPhotoFilter('none');
    window.galleryAudio.playInspectClose();
  }

  setPhotoFov(fov) {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    const fovVal = document.getElementById('photo-fov-val');
    if (fovVal) fovVal.textContent = Math.round(fov) + '°';
  }

  setPhotoFilter(filterName) {
    this.currentFilter = filterName;
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach((p) => p.classList.toggle('active', p.dataset.filter === filterName));

    // Live CSS filter preview on container
    let cssFilter = 'none';
    if (filterName === 'cinematic') cssFilter = 'contrast(1.15) brightness(1.05) saturate(1.25) sepia(0.18)';
    if (filterName === 'vintage') cssFilter = 'sepia(0.55) contrast(1.1) brightness(0.95)';
    if (filterName === 'noir') cssFilter = 'grayscale(100%) contrast(1.35) brightness(0.92)';
    if (filterName === 'dramatic') cssFilter = 'contrast(1.3) saturate(1.4) brightness(1.05)';

    this.container.style.filter = cssFilter;
  }

  takePhoto() {
    // 1. Audio and Flash Effect
    window.galleryAudio.playCameraShutter();
    const flashEl = document.getElementById('photo-flash');
    if (flashEl) {
      flashEl.classList.remove('active');
      void flashEl.offsetWidth; // force reflow
      flashEl.classList.add('active');
    }

    // 2. Render 3D Scene directly
    this.renderer.render(this.scene, this.camera);
    const srcCanvas = this.renderer.domElement;

    // 3. Composite into 2D Canvas with Watermark & Filter
    const outCanvas = document.createElement('canvas');
    outCanvas.width = srcCanvas.width;
    outCanvas.height = srcCanvas.height;
    const ctx = outCanvas.getContext('2d');

    // Apply color filter
    let fStr = 'none';
    if (this.currentFilter === 'cinematic') fStr = 'contrast(1.15) brightness(1.05) saturate(1.25) sepia(0.18)';
    if (this.currentFilter === 'vintage') fStr = 'sepia(0.55) contrast(1.1) brightness(0.95)';
    if (this.currentFilter === 'noir') fStr = 'grayscale(100%) contrast(1.35) brightness(0.92)';
    if (this.currentFilter === 'dramatic') fStr = 'contrast(1.3) saturate(1.4) brightness(1.05)';

    ctx.filter = fStr;
    ctx.drawImage(srcCanvas, 0, 0);
    ctx.filter = 'none';

    // Cinematic Vignette Overlay
    const w = outCanvas.width;
    const h = outCanvas.height;
    const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.78);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // Gilded Royal Watermark Card (with Developer Branding)
    const scale = Math.max(0.65, Math.min(1.4, w / 1600));
    const badgeW = 460 * scale;
    const badgeH = 92 * scale;
    const bx = w - badgeW - 28 * scale;
    const by = h - badgeH - 28 * scale;

    ctx.fillStyle = 'rgba(10, 14, 24, 0.86)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2 * scale;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, 10 * scale);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(bx, by, badgeW, badgeH);
      ctx.strokeRect(bx, by, badgeW, badgeH);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Title
    ctx.fillStyle = '#dfb743';
    ctx.font = `bold ${Math.round(18 * scale)}px "Segoe UI", Arial, sans-serif`;
    ctx.fillText('مۆزەخانەی نەتەوەیی شاهانە 🏛️', bx + badgeW - 18 * scale, by + 23 * scale);

    // Creator / Developer Attribution
    ctx.fillStyle = '#fff4d0';
    ctx.font = `bold ${Math.round(13 * scale)}px "Segoe UI", "Vazirmatn", sans-serif`;
    ctx.fillText('✨ دروستکار و گەشەپێدەر: ژیار هێمن (Zhiyar Hemn)', bx + badgeW - 18 * scale, by + 47 * scale);

    // Subtitle
    ctx.fillStyle = '#a0aec0';
    ctx.font = `600 ${Math.round(10.5 * scale)}px "Segoe UI", sans-serif`;
    ctx.fillText('Grand Royal Art Palace • 56 Real Masterpieces', bx + badgeW - 18 * scale, by + 71 * scale);

    const dataUrl = outCanvas.toDataURL('image/jpeg', 0.95);
    this.lastCapturedPhotoData = dataUrl;

    // 4. Open Captured Preview Modal
    if (this.controls) this.controls.unlock();
    const previewImg = document.getElementById('preview-captured-img');
    if (previewImg) previewImg.src = dataUrl;
    if (this.photoPreviewModalEl) this.photoPreviewModalEl.classList.remove('hidden');
  }

  setLightingTheme(theme) {
    if (theme === 'day') {
      this.scene.background.setHex(0x0e111a);
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 0.52;
      this.dirLight.color.setHex(0xfffaed);
      this.dirLight.intensity = 0.95;
      this.spotlights.forEach((s) => (s.intensity = 2.6));
      if (this.sunbeamMesh) this.sunbeamMesh.material.opacity = 0.15;
    } else if (theme === 'sunset') {
      this.scene.background.setHex(0x1a0d18);
      this.ambientLight.color.setHex(0xffbfa0);
      this.ambientLight.intensity = 0.44;
      this.dirLight.color.setHex(0xff7744);
      this.dirLight.intensity = 1.0;
      this.spotlights.forEach((s) => (s.intensity = 3.0));
      if (this.sunbeamMesh) this.sunbeamMesh.material.opacity = 0.22;
    } else if (theme === 'night') {
      this.scene.background.setHex(0x03050a);
      this.ambientLight.color.setHex(0x102040);
      this.ambientLight.intensity = 0.22;
      this.dirLight.color.setHex(0x3366cc);
      this.dirLight.intensity = 0.38;
      this.spotlights.forEach((s) => (s.intensity = 3.8));
      if (this.sunbeamMesh) this.sunbeamMesh.material.opacity = 0.08;
    }
  }

  teleportTo(destination) {
    window.galleryAudio.playTeleport();
    switch (destination) {
      case 'rotunda':
        this.camera.position.set(0, this.playerHeight, 8);
        this.camera.lookAt(0, this.playerHeight, -10);
        break;
      case 'north':
        this.camera.position.set(0, this.playerHeight, -56);
        this.camera.lookAt(0, this.playerHeight, -77.5);
        break;
      case 'east':
        this.camera.position.set(56, this.playerHeight, 0);
        this.camera.lookAt(77.5, this.playerHeight, 0);
        break;
      case 'south':
        this.camera.position.set(0, this.playerHeight, 56);
        this.camera.lookAt(0, this.playerHeight, 77.5);
        break;
      case 'west':
        this.camera.position.set(-56, this.playerHeight, 0);
        this.camera.lookAt(-77.5, this.playerHeight, 0);
        break;
      case 'northeast':
        this.camera.position.set(38, this.playerHeight, -56);
        this.camera.lookAt(38, this.playerHeight, -77.5);
        break;
      case 'southeast':
        this.camera.position.set(42, this.playerHeight, 56);
        this.camera.lookAt(42, this.playerHeight, 77.5);
        break;
      case 'southwest':
        this.camera.position.set(-38, this.playerHeight, 56);
        this.camera.lookAt(-38, this.playerHeight, 77.5);
        break;
      case 'northwest':
        this.camera.position.set(-42, this.playerHeight, -56);
        this.camera.lookAt(-42, this.playerHeight, -77.5);
        break;
    }
  }

  checkArtworkProximity() {
    // Throttle check to every 5 frames for buttery smooth frame rate
    if (this.frameCounter % 5 !== 0) return;

    this.raycaster.setFromCamera(this.centerScreen, this.camera);
    const intersects = this.raycaster.intersectObjects(this.artworksMeshes);

    let nearest = null;

    if (intersects.length > 0 && intersects[0].distance < 8.0) {
      nearest = intersects[0].object.userData.artwork;
    } else {
      const camX = this.camera.position.x;
      const camZ = this.camera.position.z;
      for (let i = 0; i < this.artworksMeshes.length; i++) {
        const art = this.artworksMeshes[i].userData.artwork;
        if (!art || !art.wallPosition) continue;
        const dx = camX - art.wallPosition.x;
        const dz = camZ - art.wallPosition.z;
        if (dx * dx + dz * dz < 30.25) { // 5.5m distance squared (Zero allocation)
          nearest = art;
          break;
        }
      }
    }

    if (nearest !== this.activeArtwork) {
      this.activeArtwork = nearest;
      const mobileActionBtn = document.getElementById('mobile-action-btn');
      if (this.activeArtwork) {
        this.promptEl.classList.remove('hidden');
        this.crosshairEl.classList.add('active');
        if (mobileActionBtn) mobileActionBtn.classList.add('active');
        window.galleryAudio.playChime(784.00, 0.04);
      } else {
        this.promptEl.classList.add('hidden');
        this.crosshairEl.classList.remove('active');
        if (mobileActionBtn) mobileActionBtn.classList.remove('active');
      }
    }
  }

  openArtworkModal(artwork) {
    if (this.controls) this.controls.unlock();
    window.galleryAudio.playInspectOpen();

    document.getElementById('modal-art-title-ku').textContent = artwork.titleKu;
    document.getElementById('modal-art-title-en').textContent = artwork.titleEn;
    document.getElementById('modal-art-artist').textContent = artwork.artist;
    document.getElementById('modal-art-year').textContent = artwork.year;
    document.getElementById('modal-art-genre').textContent = artwork.genre;
    document.getElementById('modal-art-technique').textContent = artwork.technique;
    document.getElementById('modal-art-hall').textContent = artwork.hall;
    document.getElementById('modal-art-dimensions').textContent = artwork.dimensions;
    document.getElementById('modal-art-desc-ku').textContent = artwork.descKu;
    document.getElementById('modal-art-desc-en').textContent = artwork.descEn;

    const modalImg = document.getElementById('modal-art-img');
    const modalCanvas = document.getElementById('modal-art-canvas');
    const src = this.getArtworkTextureSrc(artwork) || artwork.resolvedImageSrc || artwork.localImage;

    if (src) {
      modalImg.src = src;
      modalImg.style.display = 'block';
      modalCanvas.style.display = 'none';
    } else {
      modalImg.style.display = 'none';
      modalCanvas.style.display = 'block';
      const mctx = modalCanvas.getContext('2d');
      const fallback = createArtworkCanvasFallback(artwork, modalCanvas.width);
      mctx.drawImage(fallback, 0, 0);
    }

    this.modalEl.classList.remove('hidden');
  }

  closeArtworkModal() {
    if (!this.modalEl.classList.contains('hidden')) {
      this.modalEl.classList.add('hidden');
      window.galleryAudio.stopSpeaking();
      window.galleryAudio.playInspectClose();
      if (!this.isCinematicTour && !this.isMobile && this.controls) this.controls.lock();
    }
  }

  drawMinimap() {
    if (!this.minimapCtx) return;
    if (this.frameCounter % 4 !== 0) return; // Update at smooth ~15 FPS to eliminate 2D canvas lag
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    ctx.fillStyle = '#0a0d16';
    ctx.fillRect(0, 0, w, h);

    // Map bounds: 180m x 180m
    const scale = (w - 24) / 180;
    const toMapX = (worldX) => w / 2 + worldX * scale;
    const toMapY = (worldZ) => h / 2 + worldZ * scale;

    // Rotunda circle
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 16 * scale, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Cardinal Wings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(toMapX(-14), toMapY(-78), 28 * scale, 60 * scale);
    ctx.strokeRect(toMapX(-14), toMapY(18), 28 * scale, 60 * scale);
    ctx.strokeRect(toMapX(18), toMapY(-14), 60 * scale, 28 * scale);
    ctx.strokeRect(toMapX(-78), toMapY(-14), 60 * scale, 28 * scale);

    // 4 Corner Pavilions
    ctx.strokeRect(toMapX(14), toMapY(-78), 44 * scale, 45 * scale);
    ctx.strokeRect(toMapX(14), toMapY(33), 44 * scale, 45 * scale);
    ctx.strokeRect(toMapX(-58), toMapY(33), 44 * scale, 45 * scale);
    ctx.strokeRect(toMapX(-58), toMapY(-78), 44 * scale, 45 * scale);

    // Central Fountain dot
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 32 Artworks locations (Golden Dots)
    ctx.fillStyle = '#f3cf65';
    GALLERY_ARTWORKS.forEach((art) => {
      const ax = toMapX(art.wallPosition.x);
      const ay = toMapY(art.wallPosition.z);
      ctx.fillRect(ax - 1.5, ay - 1.5, 3, 3);
    });

    // Player position & FOV cone
    const px = toMapX(this.camera.position.x);
    const py = toMapY(this.camera.position.z);

    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const angle = Math.atan2(dir.z, dir.x);

    ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, 14, angle - 0.5, angle + 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  updateMovement(delta) {
    if (this.isCinematicTour && this.tourSpline && this.tourLookSpline) {
      this.tourProgress += delta * 0.0072;
      if (this.tourProgress > 1.0) this.tourProgress = 0;

      const pos = this.tourSpline.getPoint(this.tourProgress);
      const lookTarget = this.tourLookSpline.getPoint(this.tourProgress);

      this.camera.position.copy(pos);
      this.camera.lookAt(lookTarget);

      // Update HUD banner with the current hall & artwork info
      if (this.tourStations && this.tourStations.length > 0) {
        const stationIdx = Math.floor(this.tourProgress * this.tourStations.length) % this.tourStations.length;
        const station = this.tourStations[stationIdx];
        const locEl = document.getElementById('cinematic-location');
        const artEl = document.getElementById('cinematic-artwork');
        if (locEl && artEl) {
          locEl.textContent = station.hall;
          artEl.textContent = station.art;
        }
      }
      return;
    }

    // Damping / Friction
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    let hasInput = false;

    // Handle Mobile Virtual Joystick or Desktop Keys
    if (this.isMobile && this.joystickActive) {
      const speed = 30.0;
      // joystickVector.y < 0 is UP/FORWARD -> moves forward
      // joystickVector.x > 0 is RIGHT -> moves right
      this.velocity.z += this.joystickVector.y * speed * delta;
      this.velocity.x -= this.joystickVector.x * speed * delta;
      hasInput = true;
    } else if (this.controls && this.controls.isLocked) {
      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.normalize();

      const speed = this.isSprinting ? 52.0 : 26.0;

      if (this.moveForward || this.moveBackward) {
        this.velocity.z -= this.direction.z * speed * delta;
        hasInput = true;
      }
      if (this.moveLeft || this.moveRight) {
        this.velocity.x -= this.direction.x * speed * delta;
        hasInput = true;
      }
    }

    if (!hasInput && this.velocity.lengthSq() < 0.001) {
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.playerHeight, delta * 6);
      return;
    }

    const prevPosition = this.camera.position.clone();

    if (this.controls && this.controls.isLocked) {
      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);
    } else {
      // Direct relative camera translate for mobile
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
      right.y = 0;
      right.normalize();

      this.camera.position.addScaledVector(forward, -this.velocity.z * delta);
      this.camera.position.addScaledVector(right, -this.velocity.x * delta);
    }

    // Collision Detection
    const playerRadius = 0.55;
    const playerBox = new THREE.Box3(
      new THREE.Vector3(this.camera.position.x - playerRadius, 0.1, this.camera.position.z - playerRadius),
      new THREE.Vector3(this.camera.position.x + playerRadius, this.playerHeight + 0.1, this.camera.position.z + playerRadius)
    );

    for (const collider of this.colliders) {
      if (playerBox.intersectsBox(collider)) {
        this.camera.position.x = prevPosition.x;
        this.camera.position.z = prevPosition.z;
        this.velocity.x = 0;
        this.velocity.z = 0;
        break;
      }
    }

    // Footsteps & Head Bobbing
    const isMoving = this.velocity.lengthSq() > 0.1;

    if (isMoving) {
      this.bobTimer += delta * (this.isSprinting ? 14 : 9.5);
      this.camera.position.y = this.playerHeight + Math.sin(this.bobTimer) * 0.05;

      const now = performance.now();
      if (now - this.lastStepTime > (this.isSprinting ? 290 : 470)) {
        window.galleryAudio.playFootstep();
        this.lastStepTime = now;
      }
    } else {
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.playerHeight, delta * 6);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.frameCounter = (this.frameCounter || 0) + 1;

    const camX = this.camera.position.x;
    const camY = this.camera.position.y;
    const camZ = this.camera.position.z;

    // 1. Dynamic Light Distance Culling (Evaluated every 6 frames)
    // Deactivates far spotlights & point lights so the GPU only renders lights in your current hall!
    if (this.frameCounter % 6 === 0 && this.cullableLights && this.cullableLights.length > 0) {
      const maxDistSq = this.isMobile ? 484 : 784; // 22m on mobile, 28m on desktop
      for (let i = 0; i < this.cullableLights.length; i++) {
        const light = this.cullableLights[i];
        if (!light) continue;
        const targetPos = (light.userData && light.userData.worldPos) ? light.userData.worldPos : light.position;
        const dx = camX - targetPos.x;
        const dy = camY - targetPos.y;
        const dz = camZ - targetPos.z;
        light.visible = (dx * dx + dy * dy + dz * dz < maxDistSq);
      }
    }

    // 2. Rotate Centerpiece & Relics (Only when nearby)
    const isNearRotunda = (camX * camX + camZ * camZ < 1296); // < 36m

    if (this.centerSculpture && isNearRotunda) {
      this.centerSculpture.rotation.y += delta * 0.35;
      this.centerSculpture.rotation.x += delta * 0.15;
    }

    // Rotate Relics (cull distant ones)
    for (let i = 0; i < this.relicMeshes.length; i++) {
      const relic = this.relicMeshes[i];
      const dx = camX - relic.position.x;
      const dz = camZ - relic.position.z;
      if (dx * dx + dz * dz < 400) {
        relic.rotation.y += delta * 0.5;
      }
    }

    // 3. Animate Sunbeam
    if (this.sunbeamMesh && isNearRotunda) {
      this.sunbeamMesh.rotation.y += delta * 0.03;
    }

    // 4. Animate Fountain Water & Dust Particles (only when inside Rotunda zone < 36m)
    if (this.waterParticles && isNearRotunda) {
      const positions = this.waterParticles.geometry.attributes.position.array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const vel = this.particleVelocities[i];
        positions[i * 3] += vel.x * delta;
        positions[i * 3 + 1] += vel.y * delta;
        positions[i * 3 + 2] += vel.z * delta;

        vel.y -= 4.2 * delta;

        if (positions[i * 3 + 1] < 0.6) {
          positions[i * 3] = (Math.random() - 0.5) * 0.2;
          positions[i * 3 + 1] = 1.1 + Math.random() * 0.2;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
          vel.x = (Math.random() - 0.5) * 0.5;
          vel.y = 1.6 + Math.random() * 1.0;
          vel.z = (Math.random() - 0.5) * 0.5;
        }
      }
      this.waterParticles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.dustParticles && this.dustVelocities && isNearRotunda) {
      const dPositions = this.dustParticles.geometry.attributes.position.array;
      const dCount = dPositions.length / 3;
      for (let i = 0; i < dCount; i++) {
        const dvel = this.dustVelocities[i];
        dPositions[i * 3] += dvel.x * delta;
        dPositions[i * 3 + 1] += dvel.y * delta;
        dPositions[i * 3 + 2] += dvel.z * delta;

        if (dPositions[i * 3 + 1] < 1.0) dPositions[i * 3 + 1] = 21.0;
        if (dPositions[i * 3 + 1] > 22.0) dPositions[i * 3 + 1] = 1.2;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Movement & Proximity
    this.updateMovement(delta);
    this.checkArtworkProximity();

    // 6. Render Minimap
    this.drawMinimap();

    // 7. Render 3D Scene
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.virtualGallery = new ImperialVirtualGallery();
});
