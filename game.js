// Astronautas reales legendarios
const astronauts = [
    { id: 'armstrong', name: 'Neil Armstrong', country: '🇺🇸 Estados Unidos', mission: 'Primer humano en la Luna (Apollo 11, 1969)', color: '#FFD700', suitColor: '#FFFFFF' },
    { id: 'gagarin', name: 'Yuri Gagarin', country: '🇷🇺 Unión Soviética', mission: 'Primer humano en el espacio (Vostok 1, 1961)', color: '#FF6B6B', suitColor: '#FF4444' },
    { id: 'ride', name: 'Sally Ride', country: '🇺🇸 Estados Unidos', mission: 'Primera mujer estadounidense en el espacio (STS-7, 1983)', color: '#9B59B6', suitColor: '#8E44AD' },
    { id: 'tereshkova', name: 'Valentina Tereshkova', country: '🇷🇺 Unión Soviética', mission: 'Primera mujer en el espacio (Vostok 6, 1963)', color: '#FF69B4', suitColor: '#FF1493' },
    { id: 'aldrin', name: 'Buzz Aldrin', country: '🇺🇸 Estados Unidos', mission: 'Segundo humano en la Luna (Apollo 11, 1969)', color: '#00D4FF', suitColor: '#0099CC' },
    { id: 'kelly', name: 'Scott Kelly', country: '🇺🇸 Estados Unidos', mission: '340 días en la ISS (Estudio de gemelos, 2015-2016)', color: '#00FF88', suitColor: '#00CC66' },
    { id: 'hadfield', name: 'Chris Hadfield', country: '🇨🇦 Canadá', mission: 'Comandante de la ISS (Expedición 35, 2013)', color: '#FFA500', suitColor: '#FF8C00' },
    { id: 'peake', name: 'Tim Peake', country: '🇬🇧 Reino Unido', mission: 'Primera misión británica a la ISS (2015-2016)', color: '#4169E1', suitColor: '#1E90FF' }
];

let selectedAstronaut = null;

// Initialize start screen
function initStartScreen() {
    const grid = document.getElementById('astronautsGrid');
    const startBtn = document.getElementById('startGameBtn');
    
    astronauts.forEach(astronaut => {
        const card = document.createElement('div');
        card.className = 'astronaut-card';
        card.dataset.id = astronaut.id;
        
        card.innerHTML = `
            <div class="astronaut-icon" style="color: ${astronaut.color};">🧑‍🚀</div>
            <div class="astronaut-name">${astronaut.name}</div>
            <div class="astronaut-country">${astronaut.country}</div>
            <div class="astronaut-mission">${astronaut.mission}</div>
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.astronaut-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedAstronaut = astronaut;
            startBtn.disabled = false;
        });
        
        grid.appendChild(card);
    });
    
    startBtn.addEventListener('click', () => {
        if (selectedAstronaut) {
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'flex';
            // Show astronaut name in header
            document.getElementById('astronautName').textContent = `Astronauta: ${selectedAstronaut.name}`;
            document.getElementById('astronautName').style.color = selectedAstronaut.color;
            // Initialize canvas first
            initCanvas();
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                initGame();
                // Start game loop if not running
                if (!gameState.gameLoopRunning) {
                    gameState.gameLoopRunning = true;
                    gameLoop();
                }
            }, 100);
        }
    });
}

// Canvas and Context - Will be initialized after DOM loads
let canvas = null;
let ctx = null;

// Set canvas size to fit container
function resizeCanvas() {
    if (!canvas) return;
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = Math.min(1000, rect.width - 20);
    canvas.height = 600;
}

// Initialize canvas
function initCanvas() {
    canvas = document.getElementById('gameCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
    } else {
        console.error('Canvas element not found!');
    }
}

// Intro animation
function startIntroAnimation() {
    const introScreen = document.getElementById('introScreen');
    const startScreen = document.getElementById('startScreen');
    
    // After 5.5 seconds, transition to start screen
    setTimeout(() => {
        introScreen.style.opacity = '0';
        introScreen.style.transition = 'opacity 1s ease-out';
        
        setTimeout(() => {
            introScreen.style.display = 'none';
            startScreen.style.display = 'flex';
            startScreen.style.opacity = '0';
            
            setTimeout(() => {
                startScreen.style.opacity = '1';
                startScreen.style.transition = 'opacity 1s ease-in';
            }, 50);
        }, 1000);
    }, 5500);
}

// Reset to start screen
function resetToStartScreen() {
    // Hide game container
    document.getElementById('gameContainer').style.display = 'none';
    
    // Reset selected astronaut
    selectedAstronaut = null;
    
    // Clear astronaut cards selection
    document.querySelectorAll('.astronaut-card').forEach(c => c.classList.remove('selected'));
    
    // Disable start button
    document.getElementById('startGameBtn').disabled = true;
    
    // Show start screen
    const startScreen = document.getElementById('startScreen');
    startScreen.style.display = 'flex';
    startScreen.style.opacity = '0';
    
    setTimeout(() => {
        startScreen.style.opacity = '1';
        startScreen.style.transition = 'opacity 0.5s ease-in';
    }, 50);
}

// Call init on page load
window.addEventListener('DOMContentLoaded', () => {
    initStartScreen();
    startIntroAnimation();
});

// Game state
const gameState = {
    energy: 100,
    oxygen: 100,
    maxOxygen: 100,
    score: 0,
    day: 1,
    isPaused: false,
    isGameOver: false,
    isDying: false,
    deathAnimation: 0,
    missions: [],
    inventory: [],
    currentMinigame: null,
    time: 0,
    particles: [],
    isOutside: false,
    marsResources: 0,
    roverFuel: 0,
    marsCrystals: [],
    hazards: [],  // Micrometeoritos y tormentas de radiación
    bullets: [],
    visitedRooms: new Set(),
    collectedMineral: null,  // Mineral real de Marte
    readInfoPanels: new Set(),  // Paneles de información leídos
    carlSaganSpawned: false,  // Si Carl Sagan ha aparecido
    listenersSetup: false,  // Para evitar duplicar event listeners
    gameLoopRunning: false,  // Para evitar múltiples game loops
    collectingCrystal: null,  // Crystal being collected
    collectProgress: 0  // Progress of collection (0-1)
};

// Camera
const camera = {
    x: 0,
    y: 0,
    width: 1000,
    height: 600
};

// Player
const player = {
    x: 500,
    y: 300,
    width: 32,
    height: 32,
    speed: 4,
    direction: 'down',
    walkCycle: 0,
    isMoving: false
};

// Input handling
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false,
    space: false
};

// World map - Larger open world ship layout (cross pattern like the image)
const rooms = [
    // Central vertical corridor
    {
        id: 'central_corridor',
        name: 'Pasillo Central',
        x: 880,
        y: 0,
        width: 240,
        height: 1950,
        color: '#1a2a3a',
        icon: '',
        interactables: []
    },
    
    // Top left room
    {
        id: 'cockpit',
        name: 'Cabina',
        x: 600,
        y: 0,
        width: 300,
        height: 350,
        color: '#2a3a5a',
        icon: '🎮',
        interactables: [
            { type: 'console', x: 750, y: 200, icon: '🖥️', minigame: 'asteroids' },
            { type: 'info', x: 650, y: 120, icon: '📚', action: 'showInfo', room: 'cockpit' }
        ]
    },
    
    // Top right room
    {
        id: 'navigation',
        name: 'Navegación',
        x: 1100,
        y: 0,
        width: 300,
        height: 350,
        color: '#2a4a7a',
        icon: '🗺️',
        interactables: [
            { type: 'console', x: 1250, y: 200, icon: '🖥️', minigame: 'navigation' },
            { type: 'info', x: 1150, y: 120, icon: '📚', action: 'showInfo', room: 'navigation' }
        ]
    },
    
    // Middle left room
    {
        id: 'greenhouse',
        name: 'Invernadero',
        x: 600,
        y: 350,
        width: 300,
        height: 400,
        color: '#2a5a3a',
        icon: '🌱',
        interactables: [
            { type: 'plants', x: 750, y: 600, icon: '🌿', minigame: 'watering' },
            { type: 'info', x: 650, y: 520, icon: '📚', action: 'showInfo', room: 'greenhouse' }
        ]
    },
    
    // Middle right room
    {
        id: 'lab',
        name: 'Laboratorio',
        x: 1100,
        y: 350,
        width: 300,
        height: 400,
        color: '#3a3a5a',
        icon: '🔬',
        interactables: [
            { type: 'microscope', x: 1250, y: 600, icon: '🔬', minigame: 'experiment' },
            { type: 'info', x: 1150, y: 520, icon: '📚', action: 'showInfo', room: 'lab' }
        ]
    },
    
    // Center left room
    {
        id: 'living',
        name: 'Habitación',
        x: 600,
        y: 750,
        width: 300,
        height: 400,
        color: '#3a4a5a',
        icon: '🛏️',
        interactables: [
            { type: 'bed', x: 750, y: 1000, icon: '🛏️', action: 'rest' },
            { type: 'info', x: 650, y: 920, icon: '📚', action: 'showInfo', room: 'living' }
        ]
    },
    
    // Center right room
    {
        id: 'storage',
        name: 'Almacén',
        x: 1100,
        y: 750,
        width: 300,
        height: 400,
        color: '#4a4a3a',
        icon: '📦',
        interactables: [
            { type: 'crate', x: 1250, y: 1000, icon: '📦', action: 'collect' },
            { type: 'info', x: 1150, y: 920, icon: '📚', action: 'showInfo', room: 'storage' }
        ]
    },
    
    // Bottom left room
    {
        id: 'engine',
        name: 'Motor',
        x: 600,
        y: 1150,
        width: 300,
        height: 400,
        color: '#5a3a2a',
        icon: '⚙️',
        interactables: [
            { type: 'engine', x: 750, y: 1400, icon: '⚙️', minigame: 'repair' },
            { type: 'info', x: 650, y: 1320, icon: '📚', action: 'showInfo', room: 'engine' }
        ]
    },
    
    // Bottom right room
    {
        id: 'medical',
        name: 'Enfermería',
        x: 1100,
        y: 1150,
        width: 300,
        height: 400,
        color: '#2a6a5a',
        icon: '💊',
        interactables: [
            { type: 'bed', x: 1250, y: 1400, icon: '💊', minigame: 'medical' },
            { type: 'info', x: 1150, y: 1320, icon: '📚', action: 'showInfo', room: 'medical' }
        ]
    },
    
    // Bottom airlock room
    {
        id: 'airlock',
        name: 'Esclusa',
        x: 800,
        y: 1550,
        width: 400,
        height: 400,
        color: '#3a2a2a',
        icon: '🚪',
        interactables: [
            { type: 'door', x: 1000, y: 1775, icon: '🚪', action: 'exitShip' },
            { type: 'victory_door', x: 850, y: 1775, icon: '🏆', action: 'victoryDoor' },
            { type: 'info', x: 900, y: 1700, icon: '📚', action: 'showInfo', room: 'airlock' }
        ]
    }
];

// Mission templates
const missionTemplates = [
    { id: 'nav', title: 'Esquivar Asteroides', room: 'cockpit', reward: 50, energyCost: 20 },
    { id: 'water', title: 'Regar Plantas', room: 'greenhouse', reward: 30, energyCost: 15, oxygenBonus: 10 },
    { id: 'exp', title: 'Completar Experimento', room: 'lab', reward: 40, energyCost: 20 },
    { id: 'repair', title: 'Reparar Motor', room: 'engine', reward: 60, energyCost: 30 },
    { id: 'rest', title: 'Descansar', room: 'living', reward: 10, energyCost: -30 },
    { id: 'collect', title: 'Organizar Almacén', room: 'storage', reward: 25, energyCost: 15 },
    { id: 'medical', title: 'Diagnóstico Médico', room: 'medical', reward: 40, energyCost: 15 }
];

// Educational info for each room - Información científica detallada
const roomEducation = {
    cockpit: {
        title: "CABINA DE CONTROL - SISTEMAS DE NAVEGACIÓN",
        info: `<strong>Navegación Inercial y Estelar:</strong> Los sistemas de guiado utilizan <em>Unidades de Medición Inercial (IMU)</em> con giroscopios de anillo láser y acelerómetros de precisión. Los <strong>sensores estelares</strong> identifican constelaciones mediante algoritmos de reconocimiento de patrones, comparando con catálogos de más de 5,000 estrellas.<br><br>
        
        <strong>Detección de Asteroides:</strong> Los radares Doppler y sistemas LIDAR (Light Detection and Ranging) detectan objetos en trayectorias de colisión. La NASA utiliza el sistema <em>Sentry</em> para calcular probabilidades de impacto con precisión de 10⁻⁸.<br><br>
        
        <strong>Dato NASA:</strong> La Estación Espacial Internacional (ISS) realiza maniobras de evasión de desechos espaciales aproximadamente 1 vez al año, utilizando sus propulsores Progress.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/iss068e027836orig.jpg"
    },
    navigation: {
        title: "SALA DE NAVEGACIÓN - MECÁNICA ORBITAL",
        info: `<strong>Ecuaciones de Kepler:</strong> La navegación espacial se basa en las tres leyes de Kepler y la ecuación de órbita: r = a(1-e²)/(1+e·cos(θ)). Los cálculos orbitales determinan transferencias de Hohmann, ventanas de lanzamiento y encuentros planetarios.<br><br>
        
        <strong>Sistema GPS Espacial:</strong> Las naves utilizan triangulación con satélites TDRS (Tracking and Data Relay Satellite) y mediciones de tiempo de vuelo con precisión de nanosegundos. El efecto de dilatación temporal relativista (Δt = 38 microsegundos/día) debe corregirse.<br><br>
        
        <strong>Dato NASA:</strong> El rover Perseverance en Marte utiliza el sistema de navegación autónoma AutoNav, que procesa imágenes estereoscópicas a 1 Hz para evitar obstáculos.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/pia25969-1041.jpg"
    },
    greenhouse: {
        title: "INVERNADERO - SISTEMAS BIOREGENERATIVOS",
        info: `<strong>Fotosíntesis en Microgravedad:</strong> La ecuación 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂ es fundamental. Las plantas en el experimento <em>Veggie</em> de la NASA producen 0.5-1 kg de biomasa comestible por m² al mes, con eficiencia fotosintética del 3-6%.<br><br>
        
        <strong>Control Ambiental:</strong> Los sistemas ECLSS (Environmental Control and Life Support System) mantienen: CO₂ < 0.5%, O₂ = 21%, humedad 40-70%, temperatura 18-27°C. Los LEDs de espectro rojo (660nm) y azul (450nm) optimizan el crecimiento.<br><br>
        
        <strong>Dato NASA:</strong> El proyecto MELISSA (Micro-Ecological Life Support System Alternative) busca reciclar el 100% de recursos: 1 kg de plantas produce 0.73 kg O₂ y consume 1.1 kg CO₂.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/iss066e106245orig.jpg"
    },
    lab: {
        title: "LABORATORIO - INVESTIGACIÓN EN MICROGRAVEDAD",
        info: `<strong>Física de Fluidos:</strong> En microgravedad (10⁻⁶ g), la tensión superficial domina sobre la gravedad. Los experimentos de cristalización de proteínas producen estructuras 3D más ordenadas, esenciales para diseño de fármacos contra cáncer y Alzheimer.<br><br>
        
        <strong>Ciencia de Materiales:</strong> La ausencia de convección térmica permite crear aleaciones metálicas imposibles en Tierra. Los experimentos de solidificación direccional producen materiales con propiedades mecánicas superiores (resistencia +30%).<br><br>
        
        <strong>Dato NASA:</strong> El Cold Atom Laboratory (CAL) en la ISS enfría átomos a 100 picokelvins (10⁻¹⁰ K), creando el lugar más frío del universo conocido, para estudiar condensados de Bose-Einstein.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/iss068e006904orig.jpg"
    },
    living: {
        title: "HABITACIÓN - FISIOLOGÍA ESPACIAL",
        info: `<strong>Adaptación Cardiovascular:</strong> En microgravedad, el corazón reduce su masa muscular un 10-15% en 6 meses. La redistribución de fluidos hacia la cabeza (fluid shift) causa el síndrome de adaptación espacial en 60-80% de astronautas.<br><br>
        
        <strong>Pérdida Ósea:</strong> Los astronautas pierden 1-2% de densidad mineral ósea mensual, principalmente en fémur y columna vertebral. El ejercicio de resistencia (2.5 horas/día) y suplementos de vitamina D + calcio mitigan la pérdida.<br><br>
        
        <strong>Dato NASA:</strong> Los estudios de gemelos (Scott y Mark Kelly) revelaron cambios epigenéticos, elongación de telómeros (+7%) durante el vuelo, y alteraciones en expresión de 1,000+ genes.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/iss068e030577orig.jpg"
    },
    storage: {
        title: "ALMACÉN - LOGÍSTICA Y GESTIÓN DE RECURSOS",
        info: `<strong>Optimización de Carga:</strong> El algoritmo de empaquetamiento 3D maximiza el uso del volumen limitado. Cada kg lanzado a la ISS cuesta ~$10,000 USD. Los suministros se organizan por prioridad: críticos (O₂, agua), consumibles (alimentos), y opcionales.<br><br>
        
        <strong>Conservación de Alimentos:</strong> La liofilización (freeze-drying) reduce el peso 75% y permite almacenamiento por 2-5 años. Los alimentos termoestabilizados en bolsas retort resisten radiación y mantienen valor nutricional.<br><br>
        
        <strong>Dato NASA:</strong> La ISS recibe ~3,000 kg de suministros cada 2-3 meses mediante naves Progress, Dragon, Cygnus y HTV. El sistema de inventario RFID rastrea 8,000+ items en tiempo real.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/iss068e041234orig.jpg"
    },
    engine: {
        title: "SALA DE MOTORES - PROPULSIÓN Y ENERGÍA",
        info: `<strong>Propulsión Iónica:</strong> Los motores de efecto Hall aceleran iones de xenón mediante campos electromagnéticos, alcanzando velocidades de 30 km/s (Isp = 3,000s). Consumen 1-10 kW pero generan empuje de solo 90 mN, ideal para misiones de larga duración.<br><br>
        
        <strong>Generación Solar:</strong> Los paneles fotovoltaicos de triple unión (GaInP/GaAs/Ge) alcanzan eficiencia del 32-34%. La ISS genera 120 kW con 2,500 m² de paneles. La degradación por radiación es ~2.5% anual.<br><br>
        
        <strong>Dato NASA:</strong> El sistema de propulsión del Mars Reconnaissance Orbiter utiliza hidrazina (N₂H₄) con tetróxido de nitrógeno (N₂O₄), generando Isp = 320s y ΔV total de 1,400 m/s.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/pia25440-1041.jpg"
    },
    medical: {
        title: "ENFERMERÍA - MEDICINA AEROESPACIAL",
        info: `<strong>Efectos de Radiación:</strong> Los astronautas en LEO reciben 150-200 mSv/año (vs 3 mSv en Tierra). La radiación cósmica galáctica (GCR) y eventos de partículas solares (SPE) aumentan riesgo de cáncer +3% y cataratas.<br><br>
        
        <strong>Atrofia Muscular:</strong> La pérdida de masa muscular alcanza 20% en 6 meses sin ejercicio. El dispositivo ARED (Advanced Resistive Exercise Device) simula cargas de hasta 270 kg mediante cilindros de vacío.<br><br>
        
        <strong>Dato NASA:</strong> El experimento Twins Study identificó cambios en metilación del ADN, microbioma intestinal (↑Bacteroidetes, ↓Firmicutes), y función cognitiva. El 93% de cambios genéticos revirtieron tras 6 meses en Tierra.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/iss068e016789orig.jpg"
    },
    airlock: {
        title: "ESCLUSA - ACTIVIDADES EXTRAVEHICULARES (EVA)",
        info: `<strong>Despresurización Controlada:</strong> El protocolo de EVA reduce presión de 101.3 kPa (1 atm) a 29.6 kPa (4.3 psi) en 4 horas para prevenir enfermedad descompresiva (DCS). Los astronautas pre-respiran O₂ puro para eliminar N₂ disuelto en sangre.<br><br>
        
        <strong>Traje EMU:</strong> El Extravehicular Mobility Unit pesa 145 kg, mantiene 29.6 kPa, temperatura 18-24°C, y protege de radiación UV, micrometeoritos (hasta 1 cm/s) y vacío. La autonomía es de 8 horas con PLSS (Portable Life Support System).<br><br>
        
        <strong>Dato NASA:</strong> Se han realizado 500+ EVAs desde 1965. El récord de duración es 8h 56min (James Voss y Susan Helms, 2001). La NASA desarrolla el traje xEMU para misiones Artemis a la Luna.`,
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/iss068e008114orig.jpg"
    }
};

// Particle system
class Particle {
    constructor(x, y, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.size = Math.random() * 3 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life -= 0.02;
    }
    
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Bullet class
class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.speed = 8;
        this.size = 4;
        this.active = true;
        
        // Set velocity based on direction
        switch(direction) {
            case 'up': this.vx = 0; this.vy = -this.speed; break;
            case 'down': this.vx = 0; this.vy = this.speed; break;
            case 'left': this.vx = -this.speed; this.vy = 0; break;
            case 'right': this.vx = this.speed; this.vy = 0; break;
        }
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Deactivate if out of bounds
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Micrometeorite class - Pequeñas rocas espaciales
class Micrometeorite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 15 + Math.random() * 20;
        this.height = this.width;
        this.speed = 3 + Math.random() * 3;
        this.health = 1;
        this.active = true;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        
        // Trayectoria más realista - principalmente hacia abajo con variación
        if (y < 0) {
            // Viene desde arriba
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = this.speed;
        } else if (x < 0 || x > canvas.width) {
            // Viene desde los lados - diagonal hacia abajo
            this.vx = x < 0 ? this.speed * 0.7 : -this.speed * 0.7;
            this.vy = this.speed * 0.7;
        } else {
            // Por defecto
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = this.speed;
        }
    }
    
    update(playerX, playerY) {
        // Move in trajectory (not towards player)
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        // Remove if out of bounds (no wrap)
        if (this.x < -100 || this.x > canvas.width + 100 || 
            this.y > canvas.height + 100 || this.y < -100) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Meteorite body - rocky appearance
        ctx.fillStyle = '#8b7355';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 10;
        
        // Irregular shape
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = this.width / 2 * (0.7 + Math.random() * 0.3);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Craters
        ctx.fillStyle = '#5a4a3a';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(-this.width/4, -this.width/4, this.width/6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.width/5, this.width/5, this.width/8, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow trail
        ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-this.width, 0, this.width * 1.5, this.width / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Radiation Storm class - Tormenta de radiación solar
class RadiationStorm {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.speed = 0.5 + Math.random();
        this.health = 3;
        this.active = true;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.particles = [];
        
        // Create radiation particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                angle: Math.random() * Math.PI * 2,
                distance: Math.random() * 40,
                speed: Math.random() * 0.05 + 0.02
            });
        }
    }
    
    update(playerX, playerY) {
        // Slow drift towards player
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        this.pulsePhase += 0.05;
        
        // Update particles
        this.particles.forEach(p => {
            p.angle += p.speed;
            p.distance = 30 + Math.sin(p.angle * 3) * 10;
        });
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        
        // Radiation core
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2 * pulse);
        gradient.addColorStop(0, 'rgba(255, 0, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.5)');
        gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Radiation particles
        this.particles.forEach(p => {
            const x = Math.cos(p.angle) * p.distance;
            const y = Math.sin(p.angle) * p.distance;
            
            ctx.fillStyle = `rgba(255, 0, 255, ${pulse * 0.8})`;
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.shadowBlur = 0;
        
        // Warning symbol
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☢', 0, 0);
        
        ctx.restore();
        
        // Health bar
        if (this.health < 3) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - 20, this.y - 50, 40, 4);
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(this.x - 20, this.y - 50, (this.health / 3) * 40, 4);
        }
    }
}

// Initialize game
function initGame() {
    gameState.energy = 100;
    gameState.oxygen = 100;
    gameState.maxOxygen = 100;
    gameState.score = 0;
    gameState.day = 1;
    gameState.isPaused = false;
    gameState.isGameOver = false;
    gameState.isDying = false;
    gameState.deathAnimation = 0;
    gameState.missions = [];
    gameState.inventory = []; // Start with empty inventory
    gameState.time = 0;
    gameState.particles = [];
    gameState.isOutside = false;
    gameState.marsResources = 0;
    gameState.roverFuel = 0;
    gameState.marsCrystals = [];
    gameState.hazards = [];
    gameState.bullets = [];
    gameState.visitedRooms = new Set();
    gameState.collectedMineral = null;
    gameState.readInfoPanels = new Set();
    gameState.carlSaganSpawned = false;
    gameState.collectingCrystal = null;
    gameState.collectProgress = 0;
    
    player.x = 1000;
    player.y = 900;
    player.speed = 4;
    player.isMoving = false;
    player.walkCycle = 0;
    player.velocityY = 0;
    player.hasJumped = false;
    
    // Reset camera
    camera.x = 0;
    camera.y = 0;
    
    // Close any open modals
    closeModal('gameOverModal');
    closeModal('pauseModal');
    closeModal('minigameModal');
    
    // Show missions panel
    document.querySelector('.mission-panel').style.display = 'block';
    
    generateMissions();
    
    // Only setup event listeners once
    if (!gameState.listenersSetup) {
        setupEventListeners();
        gameState.listenersSetup = true;
    }
    
    updateUI();
    addLogEntry('🚀 Usa WASD para moverte por la nave. Presiona E para interactuar.');
}

// Generate missions
function generateMissions() {
    gameState.missions = [];
    const numMissions = Math.min(3 + Math.floor(gameState.day / 2), 5);
    
    for (let i = 0; i < numMissions; i++) {
        const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
        gameState.missions.push({
            ...template,
            completed: false,
            active: i === 0
        });
    }
    
    renderMissions();
}

// Render missions
function renderMissions() {
    const missionsList = document.getElementById('missionsList');
    missionsList.innerHTML = '';
    
    gameState.missions.forEach((mission, index) => {
        const missionElement = document.createElement('div');
        missionElement.className = `mission-item ${mission.completed ? 'completed' : ''} ${mission.active ? 'active' : ''}`;
        missionElement.innerHTML = `
            <div class="mission-title">${mission.completed ? '✓ ' : ''}${mission.title}</div>
            <div class="mission-description">📍 ${getRoomName(mission.room)}</div>
            <div class="mission-progress">⭐ ${mission.reward} pts | ⚡ ${mission.energyCost > 0 ? '-' : '+'}${Math.abs(mission.energyCost)}</div>
        `;
        missionsList.appendChild(missionElement);
    });
}

// Get room name
function getRoomName(roomId) {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : roomId;
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) {
            keys[key] = true;
        }
        if (key === 'escape') {
            togglePause();
        }
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            keys.space = true;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) {
            keys[key] = false;
        }
        if (e.key === ' ' || e.code === 'Space') {
            keys.space = false;
        }
    });
    
    // UI Buttons
    document.getElementById('mapBtn').addEventListener('click', showMap);
    document.getElementById('inventoryBtn').addEventListener('click', showInventory);
    document.getElementById('marsBtn').addEventListener('click', toggleMars);
    document.getElementById('restartBtn').addEventListener('click', () => {
        closeModal('gameOverModal');
        resetToStartScreen();
    });
    document.getElementById('resumeBtn').addEventListener('click', togglePause);
    document.getElementById('restartFromPauseBtn').addEventListener('click', () => {
        closeModal('pauseModal');
        resetToStartScreen();
    });
    
    // Close modals
    document.getElementById('closeMinigame').addEventListener('click', () => closeModal('minigameModal'));
    document.getElementById('closeMap').addEventListener('click', () => closeModal('mapModal'));
    document.getElementById('closeInventory').addEventListener('click', () => closeModal('inventoryModal'));
}

// Toggle between Mars and Ship
function toggleMars() {
    if (gameState.isOutside) {
        // Return to ship
        returnToShip();
    } else {
        // Go to Mars
        exitToMars();
    }
    
    // Update button text
    updateMarsButton();
}

// Update Mars button text
function updateMarsButton() {
    const marsBtn = document.getElementById('marsBtn');
    const btnText = marsBtn.querySelector('.btn-text');
    const btnIcon = marsBtn.querySelector('.btn-icon');
    
    if (gameState.isOutside) {
        btnText.textContent = 'Volver a Nave';
        btnIcon.textContent = '🚀';
        marsBtn.style.background = 'linear-gradient(135deg, #4a90e2, #5aa0f2)';
    } else {
        btnText.textContent = 'Ir a Marte';
        btnIcon.textContent = '🔴';
        marsBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8787)';
    }
}

// Game loop
function gameLoop() {
    if (!canvas || !ctx) {
        console.error('Game loop: Canvas or context not initialized!');
        return;
    }
    if (!gameState.isPaused && !gameState.isGameOver) {
        update();
        render();
    }
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Update time
    gameState.time += 1/60;
    
    // Different depletion rates for inside vs outside
    if (gameState.isOutside) {
        // On Mars: use rover fuel instead
        if (player.isMoving) {
            gameState.roverFuel -= 0.05;
        }
        if (gameState.roverFuel < 0) gameState.roverFuel = 0;
    } else {
        // Inside ship: normal depletion
        gameState.oxygen -= 0.02;
        gameState.energy -= 0.008;
        if (gameState.oxygen < 0) gameState.oxygen = 0;
        if (gameState.energy < 0) gameState.energy = 0;
    }
    
    // Check if dying
    if (gameState.oxygen <= 0 && !gameState.isDying && !gameState.isGameOver) {
        gameState.isDying = true;
        gameState.deathAnimation = 0;
    }
    
    // Death animation
    if (gameState.isDying) {
        gameState.deathAnimation += 0.02;
        
        // Create death particles
        if (Math.random() < 0.3) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            gameState.particles.push(new Particle(
                player.x + player.width / 2,
                player.y + player.height / 2,
                '#ff6b6b',
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 2
            ));
        }
        
        if (gameState.deathAnimation >= 1) {
            gameState.isGameOver = true;
            gameState.isDying = false;
            showGameOver();
        }
        return;
    }
    
    // Move player
    let newX = player.x;
    let newY = player.y;
    player.isMoving = false;
    
    // Mars physics - free movement on terrain
    if (gameState.isOutside) {
        const terrainHeight = 300;
        const terrainTop = canvas.height - terrainHeight;
        const terrainBottom = canvas.height;
        
        // Free movement in all directions
        if (keys.w) {
            newY -= player.speed;
            player.direction = 'up';
            player.isMoving = true;
        }
        if (keys.s) {
            newY += player.speed;
            player.direction = 'down';
            player.isMoving = true;
        }
        if (keys.a) {
            newX -= player.speed;
            player.direction = 'left';
            player.isMoving = true;
        }
        if (keys.d) {
            newX += player.speed;
            player.direction = 'right';
            player.isMoving = true;
        }
        
        // Create dust trail particles when moving
        if (player.isMoving && Math.random() < 0.3) {
            gameState.particles.push(new Particle(
                player.x + Math.random() * player.width,
                player.y + player.height,
                '#cd853f',
                (Math.random() - 0.5) * 2,
                -Math.random() * 2
            ));
        }
        
        // Keep rover within terrain bounds (can't go into sky or below ground)
        newY = Math.max(terrainTop, Math.min(terrainBottom - player.height, newY));
        
        player.x = newX;
        player.y = newY;
        
    } else {
        // Inside ship: normal movement
        if (keys.w) {
            newY -= player.speed;
            player.direction = 'up';
            player.isMoving = true;
        }
        if (keys.s) {
            newY += player.speed;
            player.direction = 'down';
            player.isMoving = true;
        }
        if (keys.a) {
            newX -= player.speed;
            player.direction = 'left';
            player.isMoving = true;
        }
        if (keys.d) {
            newX += player.speed;
            player.direction = 'right';
            player.isMoving = true;
        }
        
        // Create movement trail particles inside ship
        if (player.isMoving && Math.random() < 0.15) {
            gameState.particles.push(new Particle(
                player.x + player.width / 2,
                player.y + player.height / 2,
                selectedAstronaut ? selectedAstronaut.color : '#4a90e2',
                (Math.random() - 0.5) * 1,
                (Math.random() - 0.5) * 1
            ));
        }
        
        // Check collision with rooms/corridors
        if (canMoveTo(newX, newY)) {
            player.x = newX;
            player.y = newY;
        }
    }
    
    // Update walk cycle
    if (player.isMoving) {
        player.walkCycle += 0.2;
        if (player.walkCycle > Math.PI * 2) player.walkCycle = 0;
    }
    
    // Keep player in world bounds (not canvas bounds)
    const worldWidth = 2000;
    const worldHeight = 2000;
    player.x = Math.max(0, Math.min(worldWidth - player.width, player.x));
    player.y = Math.max(0, Math.min(worldHeight - player.height, player.y));
    
    // Update camera to follow player
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;
    
    // Keep camera in world bounds
    camera.x = Math.max(0, Math.min(worldWidth - canvas.width, camera.x));
    camera.y = Math.max(0, Math.min(worldHeight - canvas.height, camera.y));
    
    // Check for interactions
    checkInteractions();
    
    // Update particles
    gameState.particles = gameState.particles.filter(p => {
        p.update();
        return p.life > 0;
    });
    
    // Mars-specific updates
    if (gameState.isOutside) {
        // Shoot bullets
        if (keys.space) {
            keys.space = false;
            gameState.bullets.push(new Bullet(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.direction
            ));
        }
        
        // Update bullets
        gameState.bullets = gameState.bullets.filter(bullet => {
            bullet.update();
            return bullet.active;
        });
        
        // Update hazards (micrometeoritos y tormentas)
        gameState.hazards.forEach(hazard => {
            if (hazard.active) {
                hazard.update(player.x + player.width / 2, player.y + player.height / 2);
                
                // Check collision with player
                const dist = Math.sqrt(
                    Math.pow(hazard.x - (player.x + player.width / 2), 2) +
                    Math.pow(hazard.y - (player.y + player.height / 2), 2)
                );
                
                const collisionDist = hazard instanceof RadiationStorm ? 40 : 20;
                if (dist < collisionDist) {
                    const damage = hazard instanceof RadiationStorm ? 25 : 20;
                    gameState.roverFuel -= damage;
                    hazard.active = false;  // Ambos se destruyen al impactar
                    const hazardName = hazard instanceof RadiationStorm ? '☢️ Tormenta de radiación' : '☄️ Micrometeorito';
                    addLogEntry(`${hazardName} te golpeó! -${damage} combustible`);
                    
                    // Efecto de impacto
                    for (let i = 0; i < 5; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 2 + 1;
                        const color = hazard instanceof RadiationStorm ? '#ff00ff' : '#ff6600';
                        gameState.particles.push(new Particle(
                            hazard.x,
                            hazard.y,
                            color,
                            Math.cos(angle) * speed,
                            Math.sin(angle) * speed
                        ));
                    }
                }
            }
        });
        
        // Check bullet-hazard collisions
        gameState.bullets.forEach(bullet => {
            if (!bullet.active) return;
            
            gameState.hazards.forEach(hazard => {
                if (!hazard.active) return;
                
                const dist = Math.sqrt(
                    Math.pow(bullet.x - hazard.x, 2) +
                    Math.pow(bullet.y - hazard.y, 2)
                );
                
                if (dist < 25) {
                    hazard.health--;
                    bullet.active = false;
                    
                    if (hazard.health <= 0) {
                        hazard.active = false;
                        const points = hazard instanceof RadiationStorm ? 30 : 15;
                        gameState.score += points;
                        const hazardName = hazard instanceof RadiationStorm ? '☢️ Tormenta' : '☄️ Meteorito';
                        addLogEntry(`${hazardName} destruido! +${points} puntos`);
                        
                        // Explosion particles
                        const color = hazard instanceof RadiationStorm ? '#ff00ff' : '#ff6600';
                        for (let i = 0; i < 8; i++) {
                            const angle = (i / 8) * Math.PI * 2;
                            const speed = Math.random() * 3 + 2;
                            gameState.particles.push(new Particle(
                                hazard.x,
                                hazard.y,
                                color,
                                Math.cos(angle) * speed,
                                Math.sin(angle) * speed - 1
                            ));
                        }
                    }
                }
            });
        });
        
        // Remove inactive hazards
        gameState.hazards = gameState.hazards.filter(h => h.active);
        
        // Spawn new hazards periodically
        if (Math.random() < 0.012 && gameState.hazards.length < 5) {
            let x, y;
            
            // 55% micrometeoritos, 45% tormentas de radiación
            if (Math.random() < 0.55) {
                // Meteoritos vienen principalmente desde arriba (más realista)
                const spawnSide = Math.random();
                if (spawnSide < 0.6) {
                    // Desde arriba (60%)
                    x = Math.random() * canvas.width;
                    y = -30;
                } else if (spawnSide < 0.8) {
                    // Desde los lados (20%)
                    y = Math.random() * canvas.height;
                    x = Math.random() < 0.5 ? -30 : canvas.width + 30;
                } else {
                    // Diagonal (20%)
                    x = Math.random() < 0.5 ? -30 : canvas.width + 30;
                    y = -30;
                }
                gameState.hazards.push(new Micrometeorite(x, y));
            } else {
                // Tormentas de radiación aparecen en cualquier lado
                const side = Math.floor(Math.random() * 4);
                switch(side) {
                    case 0: x = Math.random() * canvas.width; y = -30; break;
                    case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
                    case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break;
                    case 3: x = -30; y = Math.random() * canvas.height; break;
                }
                gameState.hazards.push(new RadiationStorm(x, y));
            }
        }
    }
    
    // Update UI periodically
    if (Math.floor(gameState.time * 10) % 6 === 0) {
        updateUI();
    }
    
    checkGameOver();
}

// Check if player can move to position
function canMoveTo(x, y) {
    const playerRect = { x, y, width: player.width, height: player.height };
    
    // If outside on Mars, prevent going outside canvas bounds
    if (gameState.isOutside) {
        // Keep rover within canvas bounds
        if (x < 0 || x + player.width > canvas.width || 
            y < 0 || y + player.height > canvas.height) {
            return false;
        }
        return true;
    }
    
    // Define all valid areas including corridors
    const validAreas = [
        ...rooms,
        // Vertical corridor (connecting top to bottom)
        { x: 900, y: 0, width: 200, height: 1950 },
        // Horizontal corridors (removed - rooms now connect directly)
        { x: 800, y: 1550, width: 400, height: 50 }   // Airlock connector
    ];
    
    // Player must be at least 50% inside a valid area (prevents going to space)
    const playerCenterX = x + player.width / 2;
    const playerCenterY = y + player.height / 2;
    
    for (const area of validAreas) {
        // Check if player's center is inside the area
        if (playerCenterX >= area.x && 
            playerCenterX <= area.x + area.width &&
            playerCenterY >= area.y && 
            playerCenterY <= area.y + area.height) {
            return true;
        }
    }
    
    return false;
}

// Check collision
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check for nearby interactables
function checkInteractions() {
    // Don't check interactions if on Mars
    if (gameState.isOutside) {
        const prompt = document.getElementById('interactionPrompt');
        prompt.classList.remove('visible');
        return;
    }
    
    let nearInteractable = null;
    let nearCarlSagan = false;
    
    // Check for Carl Sagan interaction
    if (gameState.carlSaganSpawned) {
        const carlX = 1000;
        const carlY = 900;
        const distanceToCarl = Math.sqrt(
            Math.pow(player.x + player.width / 2 - carlX, 2) +
            Math.pow(player.y + player.height / 2 - carlY, 2)
        );
        
        if (distanceToCarl < 80) {
            nearCarlSagan = true;
        }
    }
    
    rooms.forEach(room => {
        room.interactables.forEach(inter => {
            const distance = Math.sqrt(
                Math.pow(player.x + player.width / 2 - inter.x, 2) +
                Math.pow(player.y + player.height / 2 - inter.y, 2)
            );
            
            if (distance < 80) {
                nearInteractable = inter;
            }
        });
    });
    
    const prompt = document.getElementById('interactionPrompt');
    
    if (nearCarlSagan) {
        prompt.classList.add('visible');
        prompt.textContent = 'Presiona E para hablar con Carl Sagan';
        
        if (keys.e) {
            keys.e = false;
            showCarlSaganMessage();
        }
    } else if (nearInteractable) {
        prompt.classList.add('visible');
        
        if (nearInteractable.type === 'door') {
            prompt.textContent = 'Presiona E para salir a MARTE';
        } else {
            prompt.textContent = 'Presiona E para interactuar';
        }
        
        if (keys.e) {
            keys.e = false;
            if (nearInteractable.minigame) {
                startMinigame(nearInteractable.minigame);
            } else if (nearInteractable.action) {
                if (nearInteractable.action === 'showInfo' && nearInteractable.room) {
                    showRoomInfo(nearInteractable.room);
                } else {
                    performAction(nearInteractable.action);
                }
            }
        }
    } else {
        prompt.classList.remove('visible');
        prompt.textContent = 'Presiona E para interactuar';
    }
}

// Interact with object
function interact(interactable) {
    if (interactable.minigame) {
        startMinigame(interactable.minigame);
    } else if (interactable.action) {
        performAction(interactable.action);
    }
}

// Perform action
function performAction(action) {
    switch (action) {
        case 'rest':
            if (gameState.energy < 100) {
                gameState.energy = Math.min(100, gameState.energy + 30);
                gameState.oxygen -= 5;
                addLogEntry('😴 Descansaste. +30 energía');
                completeMission('rest');
            } else {
                addLogEntry('⚠️ Ya tienes energía completa');
            }
            break;
        case 'collect':
            startMinigame('storage');
            break;
        case 'exitShip':
            exitToMars();
            break;
        case 'victoryDoor':
            victoryDoor();
            break;
        case 'showInfo':
            showRoomInfo(action.room);
            break;
    }
    updateUI();
    checkGameOver();
}

// Show Carl Sagan message
function showCarlSaganMessage() {
    const messages = [
        {
            quote: "El cosmos está dentro de nosotros. Estamos hechos de materia estelar. Somos una forma de que el universo se conozca a sí mismo.",
            context: "Carl Sagan nos recuerda que los átomos en nuestros cuerpos fueron forjados en el corazón de estrellas antiguas."
        },
        {
            quote: "En algún lugar, algo increíble está esperando ser conocido.",
            context: "Cada descubrimiento científico abre puertas a nuevos misterios. El universo está lleno de maravillas por explorar."
        },
        {
            quote: "La Tierra es un escenario muy pequeño en una vasta arena cósmica.",
            context: "Desde el espacio, nuestras diferencias parecen insignificantes. Somos una sola especie en un planeta frágil."
        },
        {
            quote: "La ciencia es una forma de pensar mucho más que un cuerpo de conocimiento.",
            context: "El método científico nos enseña a cuestionar, investigar y buscar evidencia. Es una herramienta para entender la realidad."
        },
        {
            quote: "Somos polvo de estrellas que contempla las estrellas.",
            context: "Los elementos que nos componen nacieron en explosiones estelares hace miles de millones de años."
        }
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const modal = document.getElementById('minigameModal');
    const title = document.getElementById('minigameTitle');
    const container = document.getElementById('minigameContainer');
    
    title.textContent = '⭐ Carl Sagan - Astrónomo y Divulgador Científico';
    container.innerHTML = `
        <div style="padding: 30px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 80px; margin-bottom: 15px;">🌌</div>
                <h2 style="color: #ffd700; font-size: 1.6em; margin-bottom: 10px;">
                    ¡Felicitaciones, Explorador del Cosmos!
                </h2>
                <p style="color: #00ff88; font-size: 1.1em;">
                    Has leído todos los paneles educativos de la nave
                </p>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(74, 144, 226, 0.1)); padding: 25px; border-radius: 15px; border: 3px solid #ffd700; margin: 25px 0; box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);">
                <p style="font-size: 1.3em; font-style: italic; color: #ffffff; line-height: 1.8; margin: 0; text-align: center;">
                    "${randomMessage.quote}"
                </p>
            </div>
            
            <div style="background: rgba(74, 144, 226, 0.2); padding: 20px; border-radius: 10px; border-left: 4px solid #4a90e2; margin: 20px 0;">
                <p style="font-size: 1.05em; line-height: 1.7; color: #e0e0e0; margin: 0; text-align: justify;">
                    ${randomMessage.context}
                </p>
            </div>
            
            <div style="background: rgba(0, 255, 136, 0.2); padding: 20px; border-radius: 10px; border: 2px solid #00ff88; margin: 20px 0;">
                <p style="color: #00ff88; margin: 0; font-size: 1em; text-align: center;">
                    🎓 Tu curiosidad y dedicación por aprender te honran. Continúa explorando el cosmos.
                </p>
            </div>
            
            <div style="margin-top: 25px; text-align: center;">
                <button onclick="closeModal('minigameModal')" class="restart-btn" style="padding: 12px 40px; font-size: 1.1em;">✨ Gracias, Carl</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    gameState.score += 100;
    addLogEntry('⭐ Carl Sagan compartió su sabiduría contigo. +100 puntos');
}

// Show room educational information
function showRoomInfo(roomId) {
    const info = roomEducation[roomId];
    if (!info) return;
    
    // Mark room as visited
    gameState.visitedRooms.add(roomId);
    
    // Mark info panel as read
    gameState.readInfoPanels.add(roomId);
    
    // Check if all info panels have been read (9 rooms with info)
    const totalInfoPanels = 9; // cockpit, navigation, greenhouse, lab, quarters, storage, engines, medical, airlock
    if (gameState.readInfoPanels.size >= totalInfoPanels && !gameState.carlSaganSpawned) {
        gameState.carlSaganSpawned = true;
        addLogEntry('✨ ¡Un visitante especial ha aparecido en el Pasillo Central!');
        addLogEntry('🌟 Carl Sagan te espera para compartir su sabiduría del cosmos');
    }
    
    const modal = document.getElementById('minigameModal');
    const title = document.getElementById('minigameTitle');
    const container = document.getElementById('minigameContainer');
    
    title.textContent = '📚 ' + info.title;
    container.innerHTML = `
        <div style="padding: 25px; max-width: 800px; margin: 0 auto;">
            ${info.image ? `
                <div style="margin-bottom: 25px; text-align: center;">
                    <img src="${info.image}" alt="${info.title}" 
                         style="max-width: 100%; height: auto; border-radius: 10px; border: 3px solid #4a90e2; box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);"
                         onerror="this.style.display='none'">
                </div>
            ` : ''}
            <div style="font-size: 1.05em; line-height: 1.8; color: #e0e0e0; text-align: justify; background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; border-left: 4px solid #00ff88;">
                ${info.info}
            </div>
            <div style="margin-top: 25px; padding: 15px; background: rgba(74, 144, 226, 0.2); border-radius: 8px; border: 2px solid #4a90e2;">
                <p style="font-size: 0.9em; color: #4a90e2; margin: 0; text-align: center;">
                    🔬 Información basada en investigaciones de NASA, ESA e ISS
                </p>
            </div>
            <div style="margin-top: 15px; padding: 12px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; border: 2px solid #ffd700;">
                <p style="font-size: 0.85em; color: #ffd700; margin: 0; text-align: center;">
                    📖 Paneles leídos: ${gameState.readInfoPanels.size}/${totalInfoPanels}
                </p>
            </div>
            <div style="margin-top: 25px; text-align: center;">
                <button onclick="closeModal('minigameModal')" class="restart-btn" style="padding: 12px 40px; font-size: 1.1em;">✅ Entendido</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Victory door interaction
function victoryDoor() {
    if (gameState.marsResources < 15) {
        addLogEntry('⚠️ Necesitas 15 recursos de Marte para completar la misión.');
        alert(`🔒 Puerta bloqueada\n\nRecursos recolectados: ${gameState.marsResources}/15\n\nVuelve a Marte y recolecta más cristales para desbloquear la puerta de victoria.`);
        return;
    }
    
    // Show victory screen
    showVictoryScreen();
}

// Show victory screen
function showVictoryScreen() {
    const modal = document.getElementById('minigameModal');
    const title = document.getElementById('minigameTitle');
    const container = document.getElementById('minigameContainer');
    
    gameState.isPaused = true;
    
    title.textContent = '🎉 ¡MISIÓN COMPLETADA!';
    container.innerHTML = `
        <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #1a1f3a, #2a3f5a); border-radius: 15px;">
            <div style="font-size: 100px; margin: 20px 0; animation: bounce 1s infinite;">
                🚀
            </div>
            
            <h1 style="color: #ffd700; font-size: 2.5em; margin: 20px 0; text-shadow: 0 0 20px #ffd700;">
                ¡FELICITACIONES!
            </h1>
            
            <div style="background: rgba(0, 255, 136, 0.2); padding: 25px; border-radius: 15px; border: 3px solid #00ff88; margin: 30px 0;">
                <p style="font-size: 1.3em; color: #ffffff; line-height: 1.8; margin: 0;">
                    Has completado exitosamente la misión espacial en Marte.<br>
                    Recolectaste <strong style="color: #ffd700;">${gameState.marsResources} recursos</strong> valiosos<br>
                    y obtuviste <strong style="color: #00ff88;">${gameState.score} puntos</strong>.
                </p>
            </div>
            
            <div style="background: rgba(74, 144, 226, 0.2); padding: 20px; border-radius: 10px; border-left: 4px solid #4a90e2; margin: 25px 0;">
                <h3 style="color: #4a90e2; margin-bottom: 15px;">📡 Mensaje de la NASA</h3>
                <p style="font-size: 1.1em; color: #e0e0e0; line-height: 1.7; margin: 0; font-style: italic;">
                    "Astronauta <strong style="color: ${selectedAstronaut.color};">${selectedAstronaut.name}</strong>,
                    tu valentía y dedicación han sido ejemplares. Los recursos que recolectaste
                    son cruciales para futuras misiones a Marte. La humanidad te agradece
                    por tu servicio. Bienvenido de vuelta a la Tierra."
                </p>
            </div>
            
            <div style="margin: 30px 0;">
                <div style="font-size: 80px; margin: 20px 0;">🌍</div>
                <p style="font-size: 1.2em; color: #00ff88; margin: 10px 0;">
                    El rover ha regresado exitosamente a la Tierra
                </p>
            </div>
            
            <div style="background: rgba(255, 215, 0, 0.2); padding: 20px; border-radius: 10px; border: 2px solid #ffd700; margin: 25px 0;">
                <h3 style="color: #ffd700; margin-bottom: 10px;">🏆 Estadísticas Finales</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left; max-width: 400px; margin: 0 auto;">
                    <div><strong>Puntuación:</strong></div><div style="color: #00ff88;">${gameState.score}</div>
                    <div><strong>Recursos:</strong></div><div style="color: #ffd700;">${gameState.marsResources}</div>
                    <div><strong>Día:</strong></div><div style="color: #4a90e2;">${gameState.day}</div>
                    <div><strong>Astronauta:</strong></div><div style="color: ${selectedAstronaut.color};">${selectedAstronaut.name}</div>
                </div>
            </div>
            
            <div style="font-size: 3em; margin: 30px 0; color: #ffd700; text-shadow: 0 0 30px #ffd700;">
                FIN DEL JUEGO
            </div>
            
            <button onclick="location.reload()" class="restart-btn" style="padding: 15px 50px; font-size: 1.3em; background: linear-gradient(135deg, #00ff88, #00cc66); margin-top: 20px;">
                🔄 Jugar de Nuevo
            </button>
        </div>
        
        <style>
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        </style>
    `;
    
    modal.classList.add('active');
    addLogEntry('🎉 ¡MISIÓN COMPLETADA! Has regresado victorioso a la Tierra.');
}

// Exit to Mars surface
function exitToMars() {
    // Check if player has at least one resource from each room type
    const requiredResources = {
        '🛰️': { name: 'Sensor de Navegación', room: 'Cabina' },
        '💊': { name: 'Kit Médico', room: 'Enfermería' },
        '🌱': { name: 'Semillas Espaciales', room: 'Invernadero' },
        '🧪': { name: 'Muestra Científica', room: 'Laboratorio' },
        '⚙️': { name: 'Pieza de Repuesto', room: 'Motor' },
        '🔩': { name: 'Componente del Almacén', room: 'Almacén' },
        '🔋': { name: 'Componente del Almacén', room: 'Almacén' },
        '💎': { name: 'Componente del Almacén', room: 'Almacén' },
        '🛠️': { name: 'Componente del Almacén', room: 'Almacén' }
    };
    
    // Check which room types have resources
    const roomsWithResources = new Set();
    gameState.inventory.forEach(item => {
        if (requiredResources[item]) {
            roomsWithResources.add(requiredResources[item].room);
        }
    });
    
    const requiredRooms = ['Cabina', 'Enfermería', 'Invernadero', 'Laboratorio', 'Motor', 'Almacén'];
    const missingRooms = requiredRooms.filter(room => !roomsWithResources.has(room));
    
    if (missingRooms.length > 0) {
        const message = `⚠️ Necesitas al menos 1 recurso de cada área:\n\n` +
            `✅ Recursos obtenidos de: ${Array.from(roomsWithResources).join(', ')}\n` +
            `❌ Faltan recursos de: ${missingRooms.join(', ')}\n\n` +
            `Completa misiones en todas las áreas para poder salir a Marte.`;
        
        addLogEntry('⚠️ Faltan recursos de algunas áreas: ' + missingRooms.join(', '));
        alert(message);
        return;
    }
    
    // Convert inventory to rover fuel
    gameState.roverFuel = gameState.inventory.length * 25;
    gameState.isOutside = true;
    // Position rover on Mars terrain (terrain starts at canvas.height - 300)
    player.x = 100;
    player.y = canvas.height - 300 - player.height;
    
    // Generate Mars crystals
    gameState.marsCrystals = [];
    for (let i = 0; i < 15; i++) {
        gameState.marsCrystals.push({
            x: 150 + Math.random() * (canvas.width - 300),
            y: canvas.height - 280 + Math.random() * 220,
            collected: false,
            type: Math.random() > 0.7 ? 'rare' : 'common',
            floatOffset: Math.random() * Math.PI * 2
        });
    }
    
    addLogEntry('🚀 Saliste a Marte. Ahora eres un rover con ' + gameState.roverFuel + ' de combustible!');
    
    // Hide missions panel
    document.querySelector('.mission-panel').style.display = 'none';
}

// Catálogo de recursos del juego
const resourceCatalog = {
    '🛰️': { name: 'Sensor de Navegación', desc: 'Sistema avanzado para detectar objetos espaciales y calcular trayectorias' },
    '💊': { name: 'Kit Médico', desc: 'Suministros médicos esenciales para emergencias y tratamiento de astronautas' },
    '🌱': { name: 'Semillas Espaciales', desc: 'Semillas modificadas genéticamente para crecer en microgravedad' },
    '🧪': { name: 'Muestra Científica', desc: 'Datos experimentales valiosos de investigación espacial' },
    '⚙️': { name: 'Pieza de Repuesto', desc: 'Componente mecánico crítico para sistemas de propulsión' },
    '🔩': { name: 'Componente Mecánico', desc: 'Tornillo de titanio reforzado para reparaciones estructurales' },
    '🔋': { name: 'Batería de Litio', desc: 'Celda de energía de alta capacidad para sistemas eléctricos' },
    '💎': { name: 'Cristal de Energía', desc: 'Cristal sintético capaz de almacenar energía solar' },
    '🛠️': { name: 'Kit de Reparación', desc: 'Conjunto completo de herramientas para mantenimiento' },
    '🟢': { name: 'Olivino', desc: 'Silicato verde común en rocas ígneas marcianas - (Mg,Fe)₂SiO₄' },
    '⚫': { name: 'Piroxeno', desc: 'Mineral volcánico abundante en basaltos marcianos - (Ca,Mg,Fe)SiO₃' },
    '🔴': { name: 'Hematita', desc: 'Óxido de hierro que da el color rojo a Marte - Fe₂O₃' },
    '🟡': { name: 'Jarosita', desc: 'Indica presencia de agua ácida en el pasado - KFe₃(SO₄)₂(OH)₆' },
    '⚪': { name: 'Perclorato', desc: 'Sales encontradas en el suelo marciano - ClO₄⁻' },
    '🔵': { name: 'Carbonatos', desc: 'Evidencia de agua líquida antigua - CO₃²⁻' }
};

// Minerales reales de Marte documentados por NASA/Perseverance
const marsMineral = [
    { name: 'Olivino', formula: '(Mg,Fe)₂SiO₄', description: 'Silicato verde común en rocas ígneas marcianas', icon: '🟢' },
    { name: 'Piroxeno', formula: '(Ca,Mg,Fe)SiO₃', description: 'Mineral volcánico abundante en basaltos marcianos', icon: '⚫' },
    { name: 'Hematita', formula: 'Fe₂O₃', description: 'Óxido de hierro que da el color rojo a Marte', icon: '🔴' },
    { name: 'Jarosita', formula: 'KFe₃(SO₄)₂(OH)₆', description: 'Indica presencia de agua ácida en el pasado', icon: '🟡' },
    { name: 'Perclorato', formula: 'ClO₄⁻', description: 'Sales encontradas en el suelo marciano', icon: '⚪' },
    { name: 'Magnetita', formula: 'Fe₃O₄', description: 'Óxido magnético de hierro en polvo marciano', icon: '⚫' },
    { name: 'Carbonatos', formula: 'CO₃²⁻', description: 'Evidencia de agua líquida antigua', icon: '🔵' },
    { name: 'Sulfatos', formula: 'SO₄²⁻', description: 'Minerales formados por evaporación de agua', icon: '⚪' }
];

// Return to ship
function returnToShip() {
    gameState.isOutside = false;
    player.x = 950;
    player.y = 250;
    
    // Seleccionar un mineral aleatorio si recolectó recursos
    if (gameState.marsResources > 0 && !gameState.collectedMineral) {
        gameState.collectedMineral = marsMineral[Math.floor(Math.random() * marsMineral.length)];
        gameState.inventory.push(gameState.collectedMineral.icon);
        
        addLogEntry(`🚪 Regresaste a la nave con ${gameState.marsResources} recursos!`);
        addLogEntry(`🔬 ¡Descubriste ${gameState.collectedMineral.name}! ${gameState.collectedMineral.formula}`);
        addLogEntry(`📝 ${gameState.collectedMineral.description}`);
        
        // Mostrar modal con el descubrimiento
        setTimeout(() => {
            const modal = document.getElementById('minigameModal');
            const title = document.getElementById('minigameTitle');
            const container = document.getElementById('minigameContainer');
            
            title.textContent = '🔬 ¡Descubrimiento Científico!';
            container.innerHTML = `
                <div style="padding: 30px; text-align: center;">
                    <div style="font-size: 80px; margin: 20px 0;">${gameState.collectedMineral.icon}</div>
                    <h2 style="color: #00ff88; margin: 20px 0;">${gameState.collectedMineral.name}</h2>
                    <p style="font-size: 1.3em; color: #4a90e2; margin: 15px 0;">${gameState.collectedMineral.formula}</p>
                    <p style="font-size: 1.1em; line-height: 1.6; color: #ffffff; margin: 20px 0;">
                        ${gameState.collectedMineral.description}
                    </p>
                    <div style="background: rgba(0, 255, 136, 0.2); padding: 15px; border-radius: 10px; margin: 20px 0; border: 2px solid #00ff88;">
                        <p style="color: #00ff88; margin: 0;">
                            ✅ Mineral documentado por el rover Perseverance de la NASA
                        </p>
                    </div>
                    <button onclick="closeModal('minigameModal')" class="restart-btn" style="margin-top: 20px;">Continuar</button>
                </div>
            `;
            
            modal.classList.add('active');
        }, 500);
    } else {
        addLogEntry('🚪 Regresaste a la nave con ' + gameState.marsResources + ' recursos de Marte!');
    }
    
    // Show missions panel again
    document.querySelector('.mission-panel').style.display = 'block';
}

// Start minigame
function startMinigame(type) {
    gameState.currentMinigame = type;
    const modal = document.getElementById('minigameModal');
    const title = document.getElementById('minigameTitle');
    const container = document.getElementById('minigameContainer');
    
    switch (type) {
        case 'navigation':
            title.textContent = '🎮 Sistema de Navegación';
            container.innerHTML = createNavigationMinigame();
            break;
        case 'asteroids':
            title.textContent = '☄️ Esquivar Asteroides';
            container.innerHTML = createAsteroidsMinigame();
            break;
        case 'watering':
            title.textContent = '🌱 Regar Plantas';
            container.innerHTML = createWateringMinigame();
            break;
        case 'experiment':
            title.textContent = '🔬 Experimento Científico';
            container.innerHTML = createExperimentMinigame();
            break;
        case 'repair':
            title.textContent = '⚙️ Reparar Motor';
            container.innerHTML = createRepairMinigame();
            break;
        case 'storage':
            title.textContent = '📦 Organizar Almacén';
            container.innerHTML = createStorageMinigame();
            break;
        case 'medical':
            title.textContent = '💊 Diagnóstico Médico';
            container.innerHTML = createMedicalMinigame();
            break;
    }
    
    modal.classList.add('active');
}

// Navigation minigame
function createNavigationMinigame() {
    const target = Math.floor(Math.random() * 100);
    
    setTimeout(() => {
        const slider = document.getElementById('navSlider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const valueDisplay = document.getElementById('navValue');
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
            });
        }
    }, 100);
    
    return `
        <div style="padding: 15px; background: linear-gradient(135deg, #2a3a5a, #1a2a4a); border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <div style="background: rgba(74, 144, 226, 0.2); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 2px solid #4a90e2;">
                <p style="font-size: 1.5em; margin: 0; color: #4a90e2; text-align: center; font-weight: bold;">
                    🎯 Objetivo: <span style="color: #00ff88; font-size: 1.3em;">${target}</span>
                </p>
            </div>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 25px; border-radius: 10px; border: 2px solid #00d4ff;">
                <input type="range" id="navSlider" min="0" max="100" value="50" style="width: 100%; height: 50px; cursor: pointer;">
                <p style="font-size: 3em; margin: 25px 0; text-align: center; color: #00ff88; font-weight: bold; text-shadow: 0 0 10px #00ff88;" id="navValue">50</p>
            </div>
            <button onclick="checkNavigation(${target})" class="restart-btn" style="width: 100%; margin-top: 20px; font-size: 1.2em; padding: 15px;">✅ Confirmar Coordenadas</button>
        </div>
    `;
}

// Watering minigame
function createWateringMinigame() {
    setTimeout(() => {
        let watered = 0;
        window.waterPlant = function(id) {
            const plant = document.getElementById('plant' + id);
            if (plant && plant.textContent === '🌱') {
                plant.textContent = '🌿';
                watered++;
                document.getElementById('waterCount').textContent = 'Plantas regadas: ' + watered + '/6';
                if (watered === 6) {
                    setTimeout(() => window.completeWatering(), 500);
                }
            }
        };
    }, 100);
    
    return `
        <div style="padding: 15px; background: linear-gradient(135deg, #2a5a3a, #1a4a2a); border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <div style="background: rgba(42, 90, 58, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #2a5a3a;">
                <p style="font-size: 1.3em; margin: 0; color: #00ff88; text-align: center; font-weight: bold;">
                    🌱 ¡Haz clic en las plantas para regarlas!
                </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; background: rgba(0, 0, 0, 0.3); padding: 30px; border-radius: 15px; border: 3px solid #00ff88; box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);">
                ${Array(6).fill(0).map((_, i) => `
                    <div onclick="waterPlant(${i})" id="plant${i}" style="font-size: 5em; cursor: pointer; transition: all 0.3s; text-align: center; background: rgba(42, 90, 58, 0.2); padding: 20px; border-radius: 10px; border: 2px solid #2a5a3a;" onmouseover="this.style.transform='scale(1.1)'; this.style.background='rgba(42, 90, 58, 0.4)';" onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(42, 90, 58, 0.2)';">🌱</div>
                `).join('')}
            </div>
            <div style="background: rgba(0, 255, 136, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #00ff88; margin-top: 20px;">
                <p id="waterCount" style="font-size: 1.4em; text-align: center; margin: 0; color: #00ff88; font-weight: bold;">Plantas regadas: 0/6</p>
            </div>
        </div>
    `;
}

// Experiment minigame - Completamente arreglado
function createExperimentMinigame() {
    const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
    const colorEmojis = { 'RED': '🔴', 'BLUE': '🔵', 'GREEN': '🟢', 'YELLOW': '🟡' };
    const sequence = Array(3).fill(0).map(() => colors[Math.floor(Math.random() * colors.length)]);
    
    setTimeout(() => {
        let correctSeq = sequence.join(',');
        let userSeq = [];
        
        setTimeout(() => {
            const display = document.getElementById('sequenceDisplay');
            if (display) {
                display.textContent = '❓ ❓ ❓';
            }
        }, 3000);
        
        window.expClickColor = function(color) {
            if (userSeq.length < 3) {
                userSeq.push(color);
                const userDisplay = document.getElementById('userSequence');
                if (userDisplay) {
                    userDisplay.textContent = userSeq.map(c => colorEmojis[c]).join(' ');
                }
                
                if (userSeq.length === 3) {
                    setTimeout(() => {
                        if (userSeq.join(',') === correctSeq) {
                            window.completeExperiment();
                        } else {
                            alert('❌ Secuencia incorrecta. Intenta de nuevo.');
                            userSeq = [];
                            const userDisplay = document.getElementById('userSequence');
                            if (userDisplay) {
                                userDisplay.textContent = '';
                            }
                        }
                    }, 500);
                }
            }
        };
        
        window.expReset = function() {
            userSeq = [];
            const userDisplay = document.getElementById('userSequence');
            if (userDisplay) {
                userDisplay.textContent = '';
            }
        };
    }, 100);
    
    return `
        <div style="padding: 15px; background: linear-gradient(135deg, #3a3a5a, #2a2a4a); border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <div style="background: rgba(74, 58, 106, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #4a3a6a;">
                <p style="font-size: 1.3em; margin: 0; color: #ff00ff; text-align: center; font-weight: bold;">
                    🔬 Memoriza y repite la secuencia:
                </p>
            </div>
            <div style="background: rgba(0, 0, 0, 0.5); padding: 20px; border-radius: 15px; border: 3px solid #ff00ff; box-shadow: 0 0 30px rgba(255, 0, 255, 0.3); margin-bottom: 20px;">
                <div id="sequenceDisplay" style="font-size: 5em; margin: 20px 0; min-height: 100px; text-align: center;">
                    ${sequence.map(c => colorEmojis[c]).join(' ')}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 450px; margin: 30px auto;">
                <button onclick="expClickColor('RED')" style="font-size: 4.5em; padding: 25px; border: 4px solid #ff0000; background: linear-gradient(135deg, #ff6b6b, #ff8787); border-radius: 15px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🔴</button>
                <button onclick="expClickColor('BLUE')" style="font-size: 4.5em; padding: 25px; border: 4px solid #0000ff; background: linear-gradient(135deg, #4a90e2, #5aa0f2); border-radius: 15px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 5px 15px rgba(0, 0, 255, 0.3);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🔵</button>
                <button onclick="expClickColor('GREEN')" style="font-size: 4.5em; padding: 25px; border: 4px solid #00ff00; background: linear-gradient(135deg, #00ff88, #00ffaa); border-radius: 15px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 5px 15px rgba(0, 255, 0, 0.3);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🟢</button>
                <button onclick="expClickColor('YELLOW')" style="font-size: 4.5em; padding: 25px; border: 4px solid #ffff00; background: linear-gradient(135deg, #ffd700, #ffed4e); border-radius: 15px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 5px 15px rgba(255, 255, 0, 0.3);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🟡</button>
            </div>
            <div style="background: rgba(255, 0, 255, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #ff00ff; margin-top: 20px;">
                <p id="userSequence" style="font-size: 3.5em; min-height: 80px; text-align: center; margin: 0; color: #ffffff;"></p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button onclick="expReset()" class="restart-btn" style="background: linear-gradient(135deg, #ff6b6b, #ff8787); font-size: 1.1em; padding: 12px 30px;">🔄 Reiniciar</button>
            </div>
        </div>
    `;
}

// Repair minigame
function createRepairMinigame() {
    setTimeout(() => {
        let clicks = 0;
        window.repair = function() {
            clicks++;
            const progress = (clicks / 20) * 100;
            const progressBar = document.getElementById('repairProgress');
            const countDisplay = document.getElementById('repairCount');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            if (countDisplay) {
                countDisplay.textContent = 'Progreso: ' + clicks + '/20';
            }
            if (clicks >= 20) {
                setTimeout(() => window.completeRepair(), 500);
            }
        };
    }, 100);
    
    return `
        <div style="padding: 15px; background: linear-gradient(135deg, #5a3a2a, #4a2a1a); border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <div style="background: rgba(90, 58, 42, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #5a3a2a;">
                <p style="font-size: 1.3em; margin: 0; color: #ff6600; text-align: center; font-weight: bold;">
                    ⚙️ ¡Haz clic rápido para reparar el motor!
                </p>
            </div>
            <div style="text-align: center; margin: 40px 0;">
                <button id="repairBtn" onclick="repair()" style="font-size: 3.5em; padding: 40px 80px; background: linear-gradient(135deg, #ff6b6b, #ff8787); border: 4px solid #ff0000; border-radius: 20px; cursor: pointer; color: white; font-weight: bold; box-shadow: 0 8px 20px rgba(255, 0, 0, 0.4); transition: all 0.2s;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                    ⚙️ REPARAR
                </button>
            </div>
            <div style="width: 100%; height: 50px; background: rgba(0,0,0,0.5); border-radius: 25px; overflow: hidden; border: 3px solid #ff6600; box-shadow: 0 0 20px rgba(255, 102, 0, 0.3);">
                <div id="repairProgress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #ff6600, #ffd700); transition: width 0.3s; box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);"></div>
            </div>
            <div style="background: rgba(255, 102, 0, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #ff6600; margin-top: 20px;">
                <p id="repairCount" style="font-size: 1.5em; margin: 0; text-align: center; color: #ffd700; font-weight: bold;">Progreso: 0/20</p>
            </div>
        </div>
    `;
}

// Storage minigame - Match items
function createStorageMinigame() {
    const items = ['🔧', '🔋', '💊', '🍎', '💧', '📡', '🔬', '⚙️'];
    const selectedItems = [];
    
    // Select 6 random items and duplicate them for matching
    for (let i = 0; i < 6; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        selectedItems.push(item, item);
    }
    
    // Shuffle the items
    selectedItems.sort(() => Math.random() - 0.5);
    
    setTimeout(() => {
        let firstCard = null;
        let secondCard = null;
        let matches = 0;
        let canClick = true;
        
        window.flipCard = function(index) {
            if (!canClick) return;
            
            const card = document.getElementById('card' + index);
            if (!card || card.classList.contains('matched') || card.classList.contains('flipped')) return;
            
            card.classList.add('flipped');
            card.textContent = selectedItems[index];
            
            if (firstCard === null) {
                firstCard = { index, element: card, item: selectedItems[index] };
            } else if (secondCard === null && index !== firstCard.index) {
                secondCard = { index, element: card, item: selectedItems[index] };
                canClick = false;
                
                setTimeout(() => {
                    if (firstCard.item === secondCard.item) {
                        // Match found
                        firstCard.element.classList.add('matched');
                        secondCard.element.classList.add('matched');
                        matches++;
                        
                        const matchCount = document.getElementById('matchCount');
                        if (matchCount) {
                            matchCount.textContent = 'Parejas encontradas: ' + matches + '/6';
                        }
                        
                        if (matches === 6) {
                            setTimeout(() => window.completeStorage(), 500);
                        }
                    } else {
                        // No match
                        firstCard.element.classList.remove('flipped');
                        secondCard.element.classList.remove('flipped');
                        firstCard.element.textContent = '❓';
                        secondCard.element.textContent = '❓';
                    }
                    
                    firstCard = null;
                    secondCard = null;
                    canClick = true;
                }, 800);
            }
        };
    }, 100);
    
    return `
        <div style="padding: 15px; background: linear-gradient(135deg, #4a4a3a, #3a3a2a); border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <div style="background: rgba(74, 74, 58, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #4a4a3a;">
                <p style="font-size: 1.3em; margin: 0; color: #ffd700; text-align: center; font-weight: bold;">
                    📦 ¡Encuentra las parejas de objetos!
                </p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);">
                ${selectedItems.map((_, i) => `
                    <div onclick="flipCard(${i})" id="card${i}" 
                         style="font-size: 2.8em; padding: 18px; background: linear-gradient(135deg, #2a4a6a, #3a5a7a); 
                                border: 3px solid #4a7a9a; border-radius: 10px; cursor: pointer; 
                                text-align: center; transition: all 0.3s; min-height: 70px; display: flex; 
                                align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);">
                        ❓
                    </div>
                `).join('')}
            </div>
            <div style="background: rgba(255, 215, 0, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #ffd700; margin-top: 20px;">
                <p id="matchCount" style="font-size: 1.4em; margin: 0; text-align: center; color: #ffd700; font-weight: bold;">Parejas encontradas: 0/6</p>
            </div>
        </div>
        <style>
            .flipped {
                background: linear-gradient(135deg, #3a6a4a, #4a7a5a) !important;
                transform: scale(1.05);
            }
            .matched {
                background: linear-gradient(135deg, #2a5a3a, #3a6a4a) !important;
                opacity: 0.7;
                cursor: default !important;
                border-color: #00ff88 !important;
            }
        </style>
    `;
}

// Asteroids minigame - Esquivar asteroides (ARREGLADO)
function createAsteroidsMinigame() {
    setTimeout(() => {
        const canvas = document.getElementById('asteroidsCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let dodged = 0;
        let asteroids = [];
        let safezones = [];
        let gameActive = true;
        let mouseX = 200;
        let mouseY = 200;
        
        function spawnAsteroid() {
            if (!gameActive) return;
            const size = 25 + Math.random() * 25;
            asteroids.push({
                x: Math.random() * (350 - size),
                y: -size,
                size: size,
                speed: 2 + Math.random() * 3
            });
            
            // Create safe zone
            safezones.push({
                x: Math.random() * 300,
                y: 300 + Math.random() * 30,
                size: 35
            });
        }
        
        function draw() {
            if (!gameActive || !canvas) return;
            
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 350, 350);
            
            // Draw stars
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 20; i++) {
                ctx.fillRect((i * 37) % 350, (i * 53) % 350, 2, 2);
            }
            
            // Draw and update asteroids
            for (let i = asteroids.length - 1; i >= 0; i--) {
                const ast = asteroids[i];
                ast.y += ast.speed;
                
                // Check collision with mouse
                const distToMouse = Math.sqrt(
                    Math.pow(mouseX - (ast.x + ast.size/2), 2) + 
                    Math.pow(mouseY - (ast.y + ast.size/2), 2)
                );
                
                if (distToMouse < ast.size/2) {
                    gameActive = false;
                    alert('❌ ¡Un asteroide te golpeó! Intenta de nuevo.');
                    closeModal('minigameModal');
                    return;
                }
                
                ctx.fillStyle = '#8b4513';
                ctx.beginPath();
                ctx.arc(ast.x + ast.size/2, ast.y + ast.size/2, ast.size/2, 0, Math.PI * 2);
                ctx.fill();
                
                if (ast.y > 350) {
                    asteroids.splice(i, 1);
                }
            }
            
            // Draw safe zones
            safezones.forEach((zone) => {
                ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(zone.x + zone.size/2, zone.y + zone.size/2, zone.size/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
            
            // Draw mouse cursor
            ctx.fillStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            requestAnimationFrame(draw);
        }
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        
        canvas.addEventListener('click', (e) => {
            if (!gameActive) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            for (let i = safezones.length - 1; i >= 0; i--) {
                const zone = safezones[i];
                const dist = Math.sqrt(Math.pow(x - (zone.x + zone.size/2), 2) + Math.pow(y - (zone.y + zone.size/2), 2));
                if (dist < zone.size/2) {
                    safezones.splice(i, 1);
                    dodged++;
                    const scoreEl = document.getElementById('asteroidsScore');
                    if (scoreEl) {
                        scoreEl.textContent = 'Asteroides esquivados: ' + dodged + '/10';
                    }
                    
                    if (dodged >= 10) {
                        gameActive = false;
                        // Show victory message
                        setTimeout(() => {
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                            ctx.fillRect(0, 0, 350, 350);
                            ctx.fillStyle = '#00ff88';
                            ctx.font = 'bold 36px Arial';
                            ctx.textAlign = 'center';
                            ctx.shadowColor = '#00ff88';
                            ctx.shadowBlur = 25;
                            ctx.fillText('¡MISIÓN EXITOSA!', 175, 150);
                            ctx.font = 'bold 24px Arial';
                            ctx.fillStyle = '#00d4ff';
                            ctx.fillText('10/10 Asteroides', 175, 185);
                            ctx.fillText('Esquivados', 175, 215);
                            ctx.shadowBlur = 0;
                            
                            setTimeout(() => {
                                window.completeAsteroids();
                            }, 1500);
                        }, 300);
                    }
                    break;
                }
            }
        });
        
        const spawnInterval = setInterval(() => {
            if (gameActive && dodged < 10) {
                spawnAsteroid();
            } else {
                clearInterval(spawnInterval);
            }
        }, 1500);
        
        draw();
    }, 100);
    
    return `
        <div style="padding: 15px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <div style="background: rgba(74, 106, 138, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #4a6a8a;">
                <p style="font-size: 1.3em; margin: 0; color: #00d4ff; text-align: center; font-weight: bold;">
                    ☄️ ¡Esquiva los asteroides! Haz clic en las zonas seguras (verdes)
                </p>
                <p style="font-size: 0.9em; margin: 10px 0 0 0; color: #ffaa00; text-align: center;">
                    ⚠️ No dejes que un asteroide toque tu cursor
                </p>
            </div>
            <div id="asteroidsGame" style="position: relative; width: 350px; height: 350px; margin: 10px auto; background: #000; border: 3px solid #00d4ff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);">
                <canvas id="asteroidsCanvas" width="350" height="350"></canvas>
            </div>
            <div style="background: rgba(0, 212, 255, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #00d4ff;">
                <p id="asteroidsScore" style="font-size: 1.4em; text-align: center; margin: 0; color: #00ff88; font-weight: bold;">Asteroides esquivados: 0/10</p>
            </div>
        </div>
    `;
}

window.completeAsteroids = function() {
    gameState.energy -= 20;
    gameState.oxygen += 25;
    gameState.score += 50;
    
    const resource = { icon: '🛰️', name: 'Sensor de Navegación', desc: 'Sistema avanzado para detectar objetos espaciales' };
    gameState.inventory.push(resource.icon);
    addLogEntry(`✅ Asteroides esquivados! +50 puntos, +25 oxígeno. Recurso: ${resource.icon} ${resource.name}`);
    completeMission('nav');
    closeModal('minigameModal');
    updateUI();
};

// Medical minigame - Recoger medicinas
function createMedicalMinigame() {
    setTimeout(() => {
        const canvas = document.getElementById('medicalCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let collected = 0;
        let medicines = [];
        let gameActive = true;
        let mouseX = 200;
        let mouseY = 350;
        
        const basket = {
            x: mouseX - 30,
            y: 300,
            width: 60,
            height: 20
        };
        
        function spawnMedicine() {
            if (!gameActive) return;
            const types = ['💊', '💉', '🧬'];
            medicines.push({
                x: Math.random() * 310 + 20,
                y: -20,
                type: types[Math.floor(Math.random() * types.length)],
                speed: 2 + Math.random() * 2
            });
        }
        
        function draw() {
            if (!gameActive || !canvas) return;
            
            ctx.fillStyle = '#1a2a3a';
            ctx.fillRect(0, 0, 350, 350);
            
            // Draw basket
            basket.x = mouseX - 30;
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
            ctx.strokeStyle = '#5a3a0a';
            ctx.lineWidth = 3;
            ctx.strokeRect(basket.x, basket.y, basket.width, basket.height);
            
            // Draw and update medicines
            for (let i = medicines.length - 1; i >= 0; i--) {
                const med = medicines[i];
                med.y += med.speed;
                
                ctx.font = '30px Arial';
                ctx.fillText(med.type, med.x, med.y);
                
                // Check collision with basket
                if (med.y + 20 >= basket.y && 
                    med.y <= basket.y + basket.height &&
                    med.x >= basket.x && 
                    med.x <= basket.x + basket.width) {
                    medicines.splice(i, 1);
                    collected++;
                    const scoreEl = document.getElementById('medicalScore');
                    if (scoreEl) {
                        scoreEl.textContent = 'Medicinas recolectadas: ' + collected + '/15';
                    }
                    
                    if (collected >= 15) {
                        gameActive = false;
                        // Show victory message
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                        ctx.fillRect(0, 0, 350, 350);
                        ctx.fillStyle = '#00ff88';
                        ctx.font = 'bold 32px Arial';
                        ctx.textAlign = 'center';
                        ctx.shadowColor = '#00ff88';
                        ctx.shadowBlur = 20;
                        ctx.fillText('¡COMPLETADO!', 175, 160);
                        ctx.font = 'bold 22px Arial';
                        ctx.fillText('15/15 Medicinas', 175, 195);
                        ctx.shadowBlur = 0;
                        setTimeout(() => {
                            window.completeMedical();
                        }, 1500);
                    }
                } else if (med.y > 350) {
                    medicines.splice(i, 1);
                }
            }
            
            requestAnimationFrame(draw);
        }
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        
        const spawnInterval = setInterval(() => {
            if (gameActive && collected < 15) {
                spawnMedicine();
            } else {
                clearInterval(spawnInterval);
            }
        }, 800);
        
        draw();
    }, 100);
    
    return `
        <div style="padding: 15px; background: linear-gradient(135deg, #1e3a5f, #2a6a5a); border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <div style="background: rgba(42, 106, 90, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #2a6a5a;">
                <p style="font-size: 1.3em; margin: 0; color: #00ff88; text-align: center; font-weight: bold;">
                    💊 ¡Recoge las medicinas con la canasta!
                </p>
                <p style="font-size: 0.9em; margin: 10px 0 0 0; color: #ffaa00; text-align: center;">
                    🖱️ Mueve el mouse para controlar la canasta
                </p>
            </div>
            <div style="position: relative; width: 350px; height: 350px; margin: 10px auto; background: #1a2a3a; border: 3px solid #00ff88; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);">
                <canvas id="medicalCanvas" width="350" height="350"></canvas>
            </div>
            <div style="background: rgba(0, 255, 136, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #00ff88;">
                <p id="medicalScore" style="font-size: 1.4em; text-align: center; margin: 0; color: #00ff88; font-weight: bold;">Medicinas recolectadas: 0/15</p>
            </div>
        </div>
    `;
}

window.completeMedical = function() {
    gameState.energy += 20;
    gameState.oxygen += 30;
    gameState.score += 40;
    
    const resource = { icon: '💊', name: 'Kit Médico', desc: 'Suministros médicos esenciales para emergencias' };
    gameState.inventory.push(resource.icon);
    addLogEntry(`✅ Medicinas recolectadas! +40 puntos, +20 energía, +30 oxígeno. Recurso: ${resource.icon} ${resource.name}`);
    closeModal('minigameModal');
    updateUI();
};

// Complete minigames
window.checkNavigation = function(target) {
    const value = parseInt(document.getElementById('navSlider').value);
    const diff = Math.abs(target - value);
    
    if (diff <= 5) {
        gameState.energy -= 20;
        gameState.oxygen += 20;
        gameState.score += 50;
        addLogEntry('✅ Navegación calibrada! +50 puntos, +20 oxígeno');
        completeMission('nav');
        closeModal('minigameModal');
        updateUI();
    } else {
        alert(`❌ Demasiado lejos. Diferencia: ${diff}`);
    }
};

window.completeWatering = function() {
    gameState.energy -= 15;
    gameState.oxygen += 25;
    gameState.score += 30;
    
    const resource = { icon: '🌱', name: 'Semillas Espaciales', desc: 'Semillas modificadas genéticamente para crecer en microgravedad' };
    gameState.inventory.push(resource.icon);
    addLogEntry(`✅ Plantas regadas! +30 puntos, +25 oxígeno. Recurso: ${resource.icon} ${resource.name}`);
    completeMission('water');
    closeModal('minigameModal');
    updateUI();
};

window.completeExperiment = function() {
    gameState.energy -= 20;
    gameState.oxygen += 20;
    gameState.score += 40;
    
    const resource = { icon: '🧪', name: 'Muestra Científica', desc: 'Datos experimentales valiosos de investigación espacial' };
    gameState.inventory.push(resource.icon);
    addLogEntry(`✅ Experimento completado! +40 puntos, +20 oxígeno. Recurso: ${resource.icon} ${resource.name}`);
    completeMission('exp');
    closeModal('minigameModal');
    updateUI();
};

window.completeRepair = function() {
    gameState.energy -= 25;
    gameState.oxygen += 15;
    gameState.score += 60;
    
    const resource = { icon: '⚙️', name: 'Pieza de Repuesto', desc: 'Componente mecánico crítico para sistemas de propulsión' };
    gameState.inventory.push(resource.icon);
    addLogEntry(`✅ Motor reparado! +60 puntos, +15 oxígeno. Recurso: ${resource.icon} ${resource.name}`);
    completeMission('repair');
    closeModal('minigameModal');
    updateUI();
};

window.completeStorage = function() {
    gameState.energy -= 15;
    gameState.oxygen += 15;
    gameState.score += 35;
    
    // Add mission resource to inventory
    const resources = [
        { icon: '🔩', name: 'Componente Mecánico' },
        { icon: '⚙️', name: 'Engranaje de Titanio' },
        { icon: '🔋', name: 'Batería de Litio' },
        { icon: '💎', name: 'Cristal de Energía' },
        { icon: '🛠️', name: 'Kit de Reparación' }
    ];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    gameState.inventory.push(resource.icon);
    addLogEntry(`✅ Almacén organizado! +35 puntos, +15 oxígeno. Recurso obtenido: ${resource.icon} ${resource.name}`);
    completeMission('collect');
    closeModal('minigameModal');
    updateUI();
};

// Complete mission
function completeMission(missionId) {
    const mission = gameState.missions.find(m => m.id === missionId && !m.completed);
    if (mission) {
        mission.completed = true;
        renderMissions();
        
        // Check if all missions completed
        if (gameState.missions.every(m => m.completed)) {
            gameState.score += 100;
            gameState.day++;
            addLogEntry('🎉 ¡Todas las misiones completadas! +100 puntos bonus. Día ' + gameState.day);
            setTimeout(() => generateMissions(), 2000);
        }
    }
}

// Draw rover sprite with weapon
function drawRover(x, y, direction) {
    ctx.save();
    
    const scale = 1.3;
    
    // Dust particles when moving
    if (player.isMoving) {
        for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = Math.random() * 10 + 25;
            const size = Math.random() * 4 + 2;
            const alpha = Math.random() * 0.4 + 0.2;
            
            ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY * scale, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 25 * scale, 25 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wheels (6 wheels like Perseverance)
    ctx.fillStyle = '#2a2a2a';
    const wheelPositions = [-18, -6, 6, 18];
    wheelPositions.forEach(pos => {
        // Wheel
        ctx.beginPath();
        ctx.arc(x + pos * scale, y + 20 * scale, 7 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Wheel treads
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x + pos * scale, y + 20 * scale, (4 + i * 1.5) * scale, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
    
    // Main body (chassis) with gradient
    const bodyGradient = ctx.createLinearGradient(x - 22 * scale, y - 12 * scale, x + 22 * scale, y + 16 * scale);
    bodyGradient.addColorStop(0, '#e8e8e8');
    bodyGradient.addColorStop(0.5, '#d4d4d4');
    bodyGradient.addColorStop(1, '#b0b0b0');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(x - 22 * scale, y - 12 * scale, 44 * scale, 28 * scale);
    
    // Body outline
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 22 * scale, y - 12 * scale, 44 * scale, 28 * scale);
    
    // Body details - panels
    ctx.fillStyle = '#a0a0a0';
    ctx.fillRect(x - 20 * scale, y - 10 * scale, 18 * scale, 11 * scale);
    ctx.fillRect(x + 2 * scale, y - 10 * scale, 18 * scale, 11 * scale);
    ctx.fillRect(x - 20 * scale, y + 3 * scale, 18 * scale, 11 * scale);
    ctx.fillRect(x + 2 * scale, y + 3 * scale, 18 * scale, 11 * scale);
    
    // Panel lines
    ctx.strokeStyle = '#707070';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.strokeRect(x - 20 * scale + (i % 2) * 22 * scale, y - 10 * scale + Math.floor(i / 2) * 13 * scale, 18 * scale, 11 * scale);
    }
    
    // RTG (power source) - golden box with glow
    const rtgGradient = ctx.createRadialGradient(x, y - 2 * scale, 0, x, y - 2 * scale, 12 * scale);
    rtgGradient.addColorStop(0, '#ffed4e');
    rtgGradient.addColorStop(0.7, '#ffd700');
    rtgGradient.addColorStop(1, '#b8860b');
    ctx.fillStyle = rtgGradient;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.fillRect(x - 8 * scale, y - 8 * scale, 16 * scale, 12 * scale);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 8 * scale, y - 8 * scale, 16 * scale, 12 * scale);
    
    // RTG vents
    ctx.fillStyle = '#8b6914';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - 6 * scale + i * 4 * scale, y - 6 * scale, 2 * scale, 8 * scale);
    }
    
    // Mast with cameras
    ctx.fillStyle = '#888';
    ctx.fillRect(x - 2 * scale, y - 25 * scale, 4 * scale, 15 * scale);
    
    // Camera head
    ctx.fillStyle = '#666';
    ctx.fillRect(x - 6 * scale, y - 28 * scale, 12 * scale, 8 * scale);
    
    // Camera lenses
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 3 * scale, y - 24 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 3 * scale, y - 24 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Robotic arm with laser based on direction
    ctx.fillStyle = '#777';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    
    switch(direction) {
        case 'up':
            // Arm segments
            ctx.fillRect(x + 10 * scale, y - 5 * scale, 4 * scale, 10 * scale);
            ctx.fillRect(x + 10 * scale, y - 15 * scale, 4 * scale, 12 * scale);
            // Laser tip
            ctx.fillStyle = '#ff3300';
            ctx.shadowColor = '#ff3300';
            ctx.shadowBlur = 10;
            ctx.fillRect(x + 9 * scale, y - 18 * scale, 6 * scale, 4 * scale);
            ctx.shadowBlur = 0;
            break;
        case 'down':
            ctx.fillRect(x + 10 * scale, y + 5 * scale, 4 * scale, 10 * scale);
            ctx.fillRect(x + 10 * scale, y + 12 * scale, 4 * scale, 12 * scale);
            ctx.fillStyle = '#ff3300';
            ctx.shadowColor = '#ff3300';
            ctx.shadowBlur = 10;
            ctx.fillRect(x + 9 * scale, y + 22 * scale, 6 * scale, 4 * scale);
            ctx.shadowBlur = 0;
            break;
        case 'left':
            ctx.fillRect(x - 15 * scale, y, 10 * scale, 4 * scale);
            ctx.fillRect(x - 25 * scale, y, 12 * scale, 4 * scale);
            ctx.fillStyle = '#ff3300';
            ctx.shadowColor = '#ff3300';
            ctx.shadowBlur = 10;
            ctx.fillRect(x - 28 * scale, y - 1 * scale, 4 * scale, 6 * scale);
            ctx.shadowBlur = 0;
            break;
        case 'right':
            ctx.fillRect(x + 5 * scale, y, 10 * scale, 4 * scale);
            ctx.fillRect(x + 13 * scale, y, 12 * scale, 4 * scale);
            ctx.fillStyle = '#ff3300';
            ctx.shadowColor = '#ff3300';
            ctx.shadowBlur = 10;
            ctx.fillRect(x + 24 * scale, y - 1 * scale, 4 * scale, 6 * scale);
            ctx.shadowBlur = 0;
            break;
    }
    
    // NASA logo
    ctx.fillStyle = '#ff0000';
    ctx.font = `bold ${8 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('NASA', x, y + 2 * scale);
    
    // Antenna
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 15 * scale, y - 10 * scale);
    ctx.lineTo(x - 20 * scale, y - 20 * scale);
    ctx.stroke();
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(x - 20 * scale, y - 20 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x - 15 * scale, y + 18 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 15 * scale, y + 18 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.stroke();
    
    // Camera/sensor
    ctx.fillStyle = '#4a90e2';
    ctx.beginPath();
    ctx.arc(x, y - 5 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Camera lens
    ctx.fillStyle = '#2c5aa0';
    ctx.beginPath();
    ctx.arc(x, y - 5 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Antenna
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 10 * scale, y - 10 * scale);
    ctx.lineTo(x + 10 * scale, y - 25 * scale);
    ctx.stroke();
    
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(x + 10 * scale, y - 25 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Lights
    const lightBlink = Math.sin(gameState.time * 5) > 0;
    if (lightBlink) {
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.fillRect(x - 18 * scale, y - 8 * scale, 4 * scale, 4 * scale);
        ctx.fillRect(x + 14 * scale, y - 8 * scale, 4 * scale, 4 * scale);
        ctx.shadowBlur = 0;
    }
    
    ctx.restore();
}

// Draw player sprite with animation
function drawPlayer(x, y, direction) {
    // If outside, draw rover instead
    if (gameState.isOutside) {
        drawRover(x, y, direction);
        return;
    }
    
    ctx.save();
    
    // Apply death animation
    if (gameState.isDying) {
        ctx.globalAlpha = 1 - gameState.deathAnimation;
        ctx.translate(x + 16, y + 20);
        ctx.rotate(gameState.deathAnimation * Math.PI);
        ctx.scale(1 - gameState.deathAnimation * 0.5, 1 - gameState.deathAnimation * 0.5);
        ctx.translate(-(x + 16), -(y + 20));
    }
    
    // Walking animation offset
    const walkOffset = player.isMoving ? Math.sin(player.walkCycle) * 2 : 0;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 40, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Backpack (life support) - draw first if facing down
    if (direction === 'down' || direction === 'left' || direction === 'right') {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(x + 11, y + 18, 10, 8);
        ctx.fillStyle = '#ff8787';
        ctx.fillRect(x + 13, y + 20, 2, 4);
        ctx.fillRect(x + 17, y + 20, 2, 4);
        
        // Backpack glow
        ctx.shadowColor = '#ff6b6b';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(x + 15, y + 22, 2, 2);
        ctx.shadowBlur = 0;
    }
    
    // Body (space suit) - Use selected astronaut color with gradient
    const suitColor = selectedAstronaut ? selectedAstronaut.suitColor : '#e8e8e8';
    const bodyGradient = ctx.createRadialGradient(x + 16, y + 20 + walkOffset, 0, x + 16, y + 20 + walkOffset, 14);
    bodyGradient.addColorStop(0, suitColor);
    bodyGradient.addColorStop(1, selectedAstronaut ? selectedAstronaut.color : '#d0d0d0');
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 20 + walkOffset, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Body outline with glow
    ctx.strokeStyle = selectedAstronaut ? selectedAstronaut.color : '#d0d0d0';
    ctx.lineWidth = 2;
    ctx.shadowColor = selectedAstronaut ? selectedAstronaut.color : '#d0d0d0';
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Chest panel detail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + 12, y + 18 + walkOffset, 8, 6);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 12, y + 18 + walkOffset, 8, 6);
    
    // Helmet with better gradient
    const helmetGradient = ctx.createRadialGradient(x + 16, y + 10 + walkOffset, 0, x + 16, y + 10 + walkOffset, 10);
    helmetGradient.addColorStop(0, '#6ab0ff');
    helmetGradient.addColorStop(0.7, '#4a90e2');
    helmetGradient.addColorStop(1, '#3a7ac2');
    ctx.fillStyle = helmetGradient;
    ctx.beginPath();
    ctx.arc(x + 16, y + 10 + walkOffset, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Helmet outline
    ctx.strokeStyle = '#2a5a8a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Helmet visor (darker blue with gradient)
    const visorGradient = ctx.createRadialGradient(x + 16, y + 10 + walkOffset, 0, x + 16, y + 10 + walkOffset, 7);
    visorGradient.addColorStop(0, '#3a6aa0');
    visorGradient.addColorStop(1, '#1a3a60');
    ctx.fillStyle = visorGradient;
    ctx.beginPath();
    ctx.arc(x + 16, y + 10 + walkOffset, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Visor reflection (more realistic)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(x + 14, y + 8 + walkOffset, 3, 2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Small reflection dot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x + 13, y + 7 + walkOffset, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Arms with animation
    const armSwing = player.isMoving ? Math.sin(player.walkCycle) * 5 : 0;
    ctx.strokeStyle = suitColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 22 + walkOffset);
    ctx.lineTo(x + 4, y + 28 + walkOffset + armSwing);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + 24, y + 22 + walkOffset);
    ctx.lineTo(x + 28, y + 28 + walkOffset - armSwing);
    ctx.stroke();
    
    // Legs with animation
    const legSwing = player.isMoving ? Math.sin(player.walkCycle + Math.PI) * 4 : 0;
    
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 32 + walkOffset);
    ctx.lineTo(x + 10, y + 38 + walkOffset + legSwing);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 32 + walkOffset);
    ctx.lineTo(x + 22, y + 38 + walkOffset - legSwing);
    ctx.stroke();
    
    ctx.restore();
}

// Draw interactable object
function drawInteractable(x, y, type, roomId) {
    ctx.save();
    
    const scale = 1.5; // Aumentar tamaño de sprites
    
    switch(type) {
        case 'console':
            // Computer console - más grande y detallado con gradiente
            const consoleGrad = ctx.createLinearGradient(x - 22 * scale, y - 15 * scale, x + 22 * scale, y + 15 * scale);
            consoleGrad.addColorStop(0, '#3a4a6a');
            consoleGrad.addColorStop(1, '#1a2a4a');
            ctx.fillStyle = consoleGrad;
            ctx.fillRect(x - 22 * scale, y - 15 * scale, 44 * scale, 30 * scale);
            
            // Console border
            ctx.strokeStyle = '#4a5a7a';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 22 * scale, y - 15 * scale, 44 * scale, 30 * scale);
            
            // Screen glow with gradient
            const screenGrad = ctx.createRadialGradient(x, y - 2 * scale, 0, x, y - 2 * scale, 20 * scale);
            screenGrad.addColorStop(0, '#5aa0f2');
            screenGrad.addColorStop(1, '#3a7ac2');
            ctx.shadowColor = '#4a90e2';
            ctx.shadowBlur = 15;
            ctx.fillStyle = screenGrad;
            ctx.fillRect(x - 18 * scale, y - 11 * scale, 36 * scale, 22 * scale);
            ctx.shadowBlur = 0;
            
            // Screen details
            ctx.fillStyle = '#00ff88';
            const blinkTime = Math.sin(gameState.time * 3) > 0 ? 1 : 0.3;
            ctx.globalAlpha = blinkTime;
            ctx.fillRect(x - 15 * scale, y - 8 * scale, 6 * scale, 3 * scale);
            ctx.fillRect(x - 6 * scale, y - 8 * scale, 6 * scale, 3 * scale);
            ctx.fillRect(x + 3 * scale, y - 8 * scale, 6 * scale, 3 * scale);
            ctx.globalAlpha = 1;
            
            // Keyboard with keys
            ctx.fillStyle = '#1a2a3a';
            ctx.fillRect(x - 18 * scale, y + 12 * scale, 36 * scale, 6 * scale);
            
            // Individual keys
            ctx.fillStyle = '#2a3a4a';
            for (let i = 0; i < 6; i++) {
                ctx.fillRect(x - 15 * scale + i * 6 * scale, y + 13 * scale, 4 * scale, 3 * scale);
            }
            break;
            
        case 'plants':
            // Plant pot - más grande
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(x - 15 * scale, y, 30 * scale, 15 * scale);
            
            // Pot shine
            ctx.fillStyle = '#a0651f';
            ctx.fillRect(x - 13 * scale, y + 2 * scale, 4 * scale, 10 * scale);
            
            // Plants with glow
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#2a5a3a';
            ctx.beginPath();
            ctx.moveTo(x - 8 * scale, y);
            ctx.lineTo(x - 12 * scale, y - 22 * scale);
            ctx.lineTo(x - 3 * scale, y - 15 * scale);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 3 * scale, y - 27 * scale);
            ctx.lineTo(x + 5 * scale, y - 18 * scale);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 8 * scale, y);
            ctx.lineTo(x + 12 * scale, y - 22 * scale);
            ctx.lineTo(x + 3 * scale, y - 15 * scale);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Leaves highlights
            ctx.fillStyle = '#3a7a4a';
            ctx.beginPath();
            ctx.arc(x - 8 * scale, y - 18 * scale, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y - 23 * scale, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 8 * scale, y - 18 * scale, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'microscope':
            // Microscope - más grande y detallado
            ctx.fillStyle = '#666';
            ctx.fillRect(x - 12 * scale, y - 8 * scale, 24 * scale, 15 * scale);
            ctx.fillStyle = '#888';
            ctx.beginPath();
            ctx.arc(x, y - 15 * scale, 9 * scale, 0, Math.PI * 2);
            ctx.fill();
            
            // Lens glow
            ctx.shadowColor = '#4a90e2';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#4a90e2';
            ctx.beginPath();
            ctx.arc(x, y - 15 * scale, 6 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            break;
            
        case 'engine':
            // Engine - más grande con animación
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(x - 18 * scale, y - 18 * scale, 36 * scale, 36 * scale);
            
            // Engine core with pulse
            const enginePulse = Math.sin(gameState.time * 4) * 0.2 + 0.8;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 15 * enginePulse;
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(x, y, 12 * scale * enginePulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Energy rays
            ctx.strokeStyle = '#ff8787';
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8 + gameState.time;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(angle) * 18 * scale, y + Math.sin(angle) * 18 * scale);
                ctx.stroke();
            }
            break;
            
        case 'bed':
            // Bed - más grande
            ctx.fillStyle = '#4a4a6a';
            ctx.fillRect(x - 22 * scale, y - 8 * scale, 44 * scale, 15 * scale);
            ctx.fillStyle = '#6a6a8a';
            ctx.fillRect(x - 22 * scale, y - 12 * scale, 44 * scale, 4 * scale);
            ctx.fillStyle = '#8a8aaa';
            ctx.fillRect(x - 18 * scale, y - 15 * scale, 12 * scale, 3 * scale);
            
            // Pillow details
            ctx.fillStyle = '#9a9aba';
            ctx.beginPath();
            ctx.ellipse(x - 12 * scale, y - 10 * scale, 8 * scale, 4 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'crate':
            // Storage crate - más grande
            ctx.fillStyle = '#8b6914';
            ctx.fillRect(x - 18 * scale, y - 18 * scale, 36 * scale, 36 * scale);
            ctx.strokeStyle = '#5a4a0a';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 18 * scale, y - 18 * scale, 36 * scale, 36 * scale);
            
            // Crate bands
            ctx.beginPath();
            ctx.moveTo(x - 18 * scale, y);
            ctx.lineTo(x + 18 * scale, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y - 18 * scale);
            ctx.lineTo(x, y + 18 * scale);
            ctx.stroke();
            
            // Warning label
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(x - 8 * scale, y - 8 * scale, 16 * scale, 16 * scale);
            ctx.fillStyle = '#000';
            ctx.font = `${12 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('!', x, y + 4 * scale);
            break;
            
        case 'door':
            // Airlock door - MÁS GRANDE Y VISIBLE
            const doorScale = scale * 1.5;
            
            // Glow effect
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 20;
            
            // Door body
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(x - 25 * doorScale, y - 40 * doorScale, 50 * doorScale, 80 * doorScale);
            ctx.shadowBlur = 0;
            
            // Door frame (animated)
            const framePulse = Math.sin(gameState.time * 3) * 0.3 + 0.7;
            ctx.strokeStyle = `rgba(255, 170, 0, ${framePulse})`;
            ctx.lineWidth = 6;
            ctx.strokeRect(x - 25 * doorScale, y - 40 * doorScale, 50 * doorScale, 80 * doorScale);
            
            // Door window with glow
            ctx.fillStyle = '#ff6600';
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y - 15 * doorScale, 15 * doorScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Inner window
            ctx.fillStyle = '#2a5a8a';
            ctx.beginPath();
            ctx.arc(x, y - 15 * doorScale, 12 * doorScale, 0, Math.PI * 2);
            ctx.fill();
            
            // Warning stripes (animated)
            ctx.fillStyle = '#ffaa00';
            for (let i = 0; i < 4; i++) {
                const yPos = y + 5 * doorScale + i * 10 * doorScale;
                const stripeAlpha = Math.sin(gameState.time * 5 + i) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 170, 0, ${stripeAlpha})`;
                ctx.fillRect(x - 23 * doorScale, yPos, 46 * doorScale, 5 * doorScale);
            }
            
            // "MARS" text
            ctx.fillStyle = '#ff0000';
            ctx.font = `bold ${16 * doorScale}px Arial`;
            ctx.textAlign = 'center';
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 10;
            ctx.fillText('MARS', x, y + 35 * doorScale);
            ctx.shadowBlur = 0;
            
            // Pulsing indicator
            const indicatorSize = 8 + Math.sin(gameState.time * 5) * 3;
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(x - 20 * doorScale, y - 35 * doorScale, indicatorSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            break;
            
        case 'victory_door':
            // Victory door - only visible if 15 resources collected
            if (gameState.marsResources < 15) {
                // Draw locked door
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(x - 25, y - 40, 50, 80);
                
                // Lock symbol
                ctx.fillStyle = '#666';
                ctx.font = 'bold 30px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🔒', x, y);
                
                // Requirements text
                ctx.fillStyle = '#ff6b6b';
                ctx.font = 'bold 12px Arial';
                ctx.fillText(`${gameState.marsResources}/15`, x, y + 25);
            } else {
                // Draw unlocked victory door with glow
                const victoryPulse = Math.sin(gameState.time * 3) * 0.3 + 0.7;
                
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 20 * victoryPulse;
                
                // Door body
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(x - 25, y - 40, 50, 80);
                
                // Trophy
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🏆', x, y + 5);
                
                // "VICTORIA" text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Arial';
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 10;
                ctx.fillText('VICTORIA', x, y + 35);
                
                ctx.shadowBlur = 0;
            }
            break;
            
        case 'info':
            // Educational info icon - libro brillante
            const isVisited = roomId && gameState.visitedRooms.has(roomId);
            
            ctx.fillStyle = isVisited ? '#888888' : '#ffd700';
            ctx.shadowColor = isVisited ? '#888888' : '#ffd700';
            ctx.shadowBlur = 15;
            
            // Book cover
            ctx.fillRect(x - 12 * scale, y - 15 * scale, 24 * scale, 30 * scale);
            
            // Book pages
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - 10 * scale, y - 13 * scale, 20 * scale, 26 * scale);
            
            // Book lines
            ctx.strokeStyle = isVisited ? '#888888' : '#ffd700';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(x - 8 * scale, y - 8 * scale + i * 6 * scale);
                ctx.lineTo(x + 8 * scale, y - 8 * scale + i * 6 * scale);
                ctx.stroke();
            }
            
            // Pulsing glow (solo si no ha sido visitado)
            if (!isVisited) {
                const infoPulse = Math.sin(gameState.time * 3) * 0.5 + 0.5;
                ctx.shadowBlur = 20 * infoPulse;
                ctx.fillStyle = `rgba(255, 215, 0, ${infoPulse})`;
                ctx.beginPath();
                ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Checkmark para visitado
                ctx.fillStyle = '#00ff88';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('✓', x, y + 35);
            }
            
            ctx.shadowBlur = 0;
            break;
    }
    
    ctx.restore();
}

// Render game
function render() {
    if (gameState.isOutside) {
        renderMars();
        return;
    }
    
    // Save context and apply camera transform
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    // Clear canvas with gradient
    const bgGradient = ctx.createLinearGradient(camera.x, camera.y, camera.x, camera.y + canvas.height);
    bgGradient.addColorStop(0, '#0a0e1f');
    bgGradient.addColorStop(1, '#1a1f35');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
    
    // Draw stars in background (fixed to world, not camera) - MEJORADO
    for (let i = 0; i < 300; i++) {
        const x = (i * 137.5) % 2000;
        const y = (i * 219.3) % 2000;
        const size = (i % 4) * 0.5 + 0.3;
        const twinkle = Math.sin(gameState.time * 2 + i) * 0.3 + 0.7;
        
        // Different star colors
        if (i % 20 === 0) {
            ctx.fillStyle = `rgba(100, 150, 255, ${twinkle})`;
        } else if (i % 15 === 0) {
            ctx.fillStyle = `rgba(255, 200, 100, ${twinkle})`;
        } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw distant planets
    const planets = [
        { x: 300, y: 200, size: 40, color1: '#ff6b6b', color2: '#ff8787' },
        { x: 1600, y: 400, size: 60, color1: '#4a90e2', color2: '#5aa0f2' },
        { x: 500, y: 1500, size: 35, color1: '#ffd700', color2: '#ffed4e' },
        { x: 1400, y: 1600, size: 50, color1: '#00ff88', color2: '#00ffaa' }
    ];
    
    planets.forEach(planet => {
        const planetGrad = ctx.createRadialGradient(
            planet.x - planet.size * 0.3, 
            planet.y - planet.size * 0.3, 
            0, 
            planet.x, 
            planet.y, 
            planet.size
        );
        planetGrad.addColorStop(0, planet.color1);
        planetGrad.addColorStop(1, planet.color2);
        
        ctx.fillStyle = planetGrad;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Planet glow
        ctx.shadowColor = planet.color1;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    ctx.globalAlpha = 1;
    
    // Draw rooms with improved visuals and decorations
    rooms.forEach(room => {
        // First, fill entire room with base color to avoid black spaces
        ctx.fillStyle = room.color;
        ctx.fillRect(room.x, room.y, room.width, room.height);
        
        // Floor with metallic texture
        const floorHeight = room.height * 0.3;
        const floorGradient = ctx.createLinearGradient(room.x, room.y + room.height - floorHeight, room.x, room.y + room.height);
        floorGradient.addColorStop(0, adjustColor(room.color, -40));
        floorGradient.addColorStop(0.5, adjustColor(room.color, -50));
        floorGradient.addColorStop(1, adjustColor(room.color, -60));
        ctx.fillStyle = floorGradient;
        ctx.fillRect(room.x, room.y + room.height - floorHeight, room.width, floorHeight);
        
        // Floor tiles
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        for (let i = 0; i < room.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(room.x + i, room.y + room.height - floorHeight);
            ctx.lineTo(room.x + i, room.y + room.height);
            ctx.stroke();
        }
        for (let i = 0; i < floorHeight; i += 50) {
            ctx.beginPath();
            ctx.moveTo(room.x, room.y + room.height - floorHeight + i);
            ctx.lineTo(room.x + room.width, room.y + room.height - floorHeight + i);
            ctx.stroke();
        }
        
        // Walls with gradient
        const wallHeight = room.height - floorHeight;
        const wallGradient = ctx.createLinearGradient(room.x, room.y, room.x, room.y + wallHeight);
        wallGradient.addColorStop(0, adjustColor(room.color, 10));
        wallGradient.addColorStop(0.5, room.color);
        wallGradient.addColorStop(1, adjustColor(room.color, -20));
        ctx.fillStyle = wallGradient;
        ctx.fillRect(room.x, room.y, room.width, wallHeight);
        
        // Metallic panels effect on walls
        if (room.name) {
            ctx.strokeStyle = 'rgba(150, 170, 190, 0.2)';
            ctx.lineWidth = 1;
            
            // Vertical panels
            for (let i = 0; i < room.width; i += 60) {
                ctx.beginPath();
                ctx.moveTo(room.x + i, room.y);
                ctx.lineTo(room.x + i, room.y + wallHeight);
                ctx.stroke();
                
                // Panel highlights
                ctx.strokeStyle = 'rgba(200, 220, 240, 0.1)';
                ctx.beginPath();
                ctx.moveTo(room.x + i + 2, room.y + 10);
                ctx.lineTo(room.x + i + 2, room.y + wallHeight - 10);
                ctx.stroke();
                ctx.strokeStyle = 'rgba(150, 170, 190, 0.2)';
            }
            
            // Horizontal panels
            for (let i = 0; i < wallHeight; i += 60) {
                ctx.beginPath();
                ctx.moveTo(room.x, room.y + i);
                ctx.lineTo(room.x + room.width, room.y + i);
                ctx.stroke();
            }
            
            // Rivets on panels
            ctx.fillStyle = 'rgba(100, 120, 140, 0.5)';
            for (let i = 30; i < room.width; i += 60) {
                for (let j = 30; j < wallHeight; j += 60) {
                    ctx.beginPath();
                    ctx.arc(room.x + i, room.y + j, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        // Central corridor specific decorations
        if (room.id === 'central_corridor') {
            // Vertical stripe lights (solo azules, sin naranjas)
            for (let i = 0; i < room.height; i += 100) {
                const lightPulse = Math.sin(gameState.time * 2 + i * 0.01) * 0.3 + 0.7;
                
                // Left light strip
                ctx.fillStyle = `rgba(0, 212, 255, ${lightPulse * 0.5})`;
                ctx.shadowColor = '#00d4ff';
                ctx.shadowBlur = 10;
                ctx.fillRect(room.x + 10, room.y + i, 5, 80);
                
                // Right light strip
                ctx.fillRect(room.x + room.width - 15, room.y + i, 5, 80);
                ctx.shadowBlur = 0;
            }
        }
        
        // DECORATIONS - Cables along walls
        if (room.name && room.id !== 'central_corridor') {
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 5;
            
            // Top cable
            ctx.beginPath();
            ctx.moveTo(room.x + 10, room.y + 15);
            for (let i = 0; i < room.width - 20; i += 20) {
                ctx.lineTo(room.x + 10 + i, room.y + 15 + Math.sin(i * 0.3) * 3);
            }
            ctx.stroke();
            
            // Side cable
            ctx.strokeStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.beginPath();
            ctx.moveTo(room.x + room.width - 15, room.y + 20);
            for (let i = 0; i < room.height - 40; i += 20) {
                ctx.lineTo(room.x + room.width - 15 + Math.sin(i * 0.3) * 3, room.y + 20 + i);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        // Room-specific decorations
        if (room.id === 'cockpit' || room.id === 'navigation') {
            // Windows with stars view - MEJORADAS
            for (let i = 0; i < 2; i++) {
                const wx = room.x + 50 + i * 150;
                const wy = room.y + 40;
                
                // Window outer frame (metal)
                ctx.fillStyle = '#3a4a5a';
                ctx.fillRect(wx - 5, wy - 5, 90, 70);
                
                // Window frame with depth
                const frameGrad = ctx.createLinearGradient(wx, wy, wx + 80, wy + 60);
                frameGrad.addColorStop(0, '#4a5a6a');
                frameGrad.addColorStop(1, '#2a3a4a');
                ctx.fillStyle = frameGrad;
                ctx.fillRect(wx, wy, 80, 60);
                
                // Window glass with space view
                const windowGrad = ctx.createRadialGradient(wx + 40, wy + 30, 0, wx + 40, wy + 30, 50);
                windowGrad.addColorStop(0, '#1a1a3a');
                windowGrad.addColorStop(0.7, '#0a0a2a');
                windowGrad.addColorStop(1, '#000000');
                ctx.fillStyle = windowGrad;
                ctx.fillRect(wx + 5, wy + 5, 70, 50);
                
                // Stars in window with twinkle
                for (let s = 0; s < 8; s++) {
                    const twinkle = Math.sin(gameState.time * 2 + s) * 0.3 + 0.7;
                    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
                    ctx.beginPath();
                    ctx.arc(wx + 10 + (s % 3) * 25, wy + 12 + Math.floor(s / 3) * 15, 1 + (s % 2), 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Distant planet in window
                if (i === 1) {
                    ctx.fillStyle = '#ff8844';
                    ctx.shadowColor = '#ff8844';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(wx + 60, wy + 20, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
                
                // Window reflection
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(wx + 8, wy + 8, 30, 20);
                
                // Window frame rivets
                ctx.fillStyle = '#5a6a7a';
                for (let r = 0; r < 4; r++) {
                    const rx = wx + (r % 2) * 70 + 5;
                    const ry = wy + Math.floor(r / 2) * 50 + 5;
                    ctx.beginPath();
                    ctx.arc(rx, ry, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Control panels with lights
            for (let i = 0; i < 3; i++) {
                const px = room.x + 30 + i * 80;
                const py = room.y + room.height - 50;
                
                ctx.fillStyle = '#1a2a3a';
                ctx.fillRect(px, py, 60, 30);
                
                // Blinking lights
                const blink = Math.sin(gameState.time * 3 + i) > 0;
                ctx.fillStyle = blink ? '#00ff00' : '#003300';
                ctx.beginPath();
                ctx.arc(px + 15, py + 15, 4, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = blink ? '#ff0000' : '#330000';
                ctx.beginPath();
                ctx.arc(px + 45, py + 15, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        if (room.id === 'greenhouse') {
            // Grow lights bar
            ctx.fillStyle = '#2a2a3a';
            ctx.fillRect(room.x + 20, room.y + 100, room.width - 40, 15);
            
            // LED lights
            for (let i = 0; i < 8; i++) {
                const lightX = room.x + 40 + i * 30;
                const pulse = Math.sin(gameState.time * 2 + i) * 0.3 + 0.7;
                
                // Purple grow light
                ctx.fillStyle = `rgba(255, 0, 255, ${pulse})`;
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(lightX, room.y + 107, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            // Extra plants decoration
            for (let i = 0; i < 4; i++) {
                const px = room.x + 50 + i * 60;
                const py = room.y + room.height - 100;
                
                // Pot with gradient
                const potGrad = ctx.createLinearGradient(px, py + 30, px + 30, py + 50);
                potGrad.addColorStop(0, '#a0651f');
                potGrad.addColorStop(1, '#6b4513');
                ctx.fillStyle = potGrad;
                ctx.fillRect(px, py + 30, 30, 20);
                
                // Pot rim
                ctx.fillStyle = '#8b5a1f';
                ctx.fillRect(px - 2, py + 28, 34, 4);
                
                // Plant leaves with glow
                ctx.fillStyle = '#2a8a3a';
                ctx.shadowColor = '#00ff88';
                ctx.shadowBlur = 10;
                for (let j = 0; j < 3; j++) {
                    ctx.beginPath();
                    ctx.ellipse(px + 15 + (j - 1) * 10, py + 20 - j * 8, 8, 12, j * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.shadowBlur = 0;
                
                // Soil
                ctx.fillStyle = '#3a2a1a';
                ctx.fillRect(px + 3, py + 32, 24, 6);
            }
        }
        
        if (room.id === 'lab') {
            // Lab equipment
            for (let i = 0; i < 3; i++) {
                const lx = room.x + 40 + i * 80;
                const ly = room.y + 150;
                
                // Beakers
                ctx.fillStyle = '#4a90e2';
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.moveTo(lx, ly);
                ctx.lineTo(lx - 15, ly + 40);
                ctx.lineTo(lx + 15, ly + 40);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
                
                // Bubbles
                if (Math.sin(gameState.time * 2 + i) > 0.5) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.beginPath();
                    ctx.arc(lx, ly + 20, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        if (room.id === 'engine') {
            // Engine pipes with gradient
            for (let i = 0; i < 3; i++) {
                const pipeX = room.x + 50 + i * 80;
                
                // Pipe gradient
                const pipeGrad = ctx.createLinearGradient(pipeX - 4, room.y, pipeX + 4, room.y);
                pipeGrad.addColorStop(0, '#555');
                pipeGrad.addColorStop(0.5, '#999');
                pipeGrad.addColorStop(1, '#555');
                ctx.strokeStyle = pipeGrad;
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(pipeX, room.y);
                ctx.lineTo(pipeX, room.y + room.height);
                ctx.stroke();
                
                // Pipe joints
                for (let j = 0; j < 3; j++) {
                    ctx.fillStyle = '#666';
                    ctx.fillRect(pipeX - 8, room.y + 60 + j * 80, 16, 12);
                    ctx.strokeStyle = '#444';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(pipeX - 8, room.y + 60 + j * 80, 16, 12);
                }
            }
            
            // Warning stripes
            ctx.fillStyle = '#ffcc00';
            for (let i = 0; i < room.width; i += 40) {
                ctx.fillRect(room.x + i, room.y + 20, 20, 10);
            }
            ctx.fillStyle = '#000';
            for (let i = 20; i < room.width; i += 40) {
                ctx.fillRect(room.x + i, room.y + 20, 20, 10);
            }
            
            // Steam/exhaust with glow
            for (let i = 0; i < 5; i++) {
                const sx = room.x + 100 + i * 40;
                const sy = room.y + 50 + Math.sin(gameState.time * 2 + i) * 20;
                const alpha = 0.4 - i * 0.06;
                ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
                ctx.shadowColor = '#ff8800';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(sx, sy, 10 + i * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            // Pressure gauges
            for (let i = 0; i < 2; i++) {
                const gx = room.x + 80 + i * 120;
                const gy = room.y + room.height - 80;
                
                // Gauge body
                ctx.fillStyle = '#2a2a3a';
                ctx.beginPath();
                ctx.arc(gx, gy, 20, 0, Math.PI * 2);
                ctx.fill();
                
                // Gauge face
                ctx.fillStyle = '#1a1a2a';
                ctx.beginPath();
                ctx.arc(gx, gy, 16, 0, Math.PI * 2);
                ctx.fill();
                
                // Needle
                const needleAngle = Math.sin(gameState.time + i) * 0.5 + Math.PI;
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(gx, gy);
                ctx.lineTo(gx + Math.cos(needleAngle) * 12, gy + Math.sin(needleAngle) * 12);
                ctx.stroke();
            }
        }
        
        if (room.id === 'medical') {
            // Medical cross on wall
            ctx.fillStyle = '#ff4444';
            ctx.shadowColor = '#ff4444';
            ctx.shadowBlur = 10;
            const crossX = room.x + room.width / 2;
            const crossY = room.y + 60;
            ctx.fillRect(crossX - 5, crossY - 20, 10, 40);
            ctx.fillRect(crossX - 20, crossY - 5, 40, 10);
            ctx.shadowBlur = 0;
            
            // Medical cabinets
            for (let i = 0; i < 2; i++) {
                const cabX = room.x + 40 + i * 150;
                const cabY = room.y + 120;
                
                // Cabinet body
                ctx.fillStyle = '#e8e8e8';
                ctx.fillRect(cabX, cabY, 60, 80);
                
                // Cabinet door
                ctx.strokeStyle = '#c0c0c0';
                ctx.lineWidth = 2;
                ctx.strokeRect(cabX + 5, cabY + 5, 50, 70);
                
                // Handle
                ctx.fillStyle = '#888';
                ctx.fillRect(cabX + 45, cabY + 40, 8, 3);
                
                // Medical supplies visible through glass
                ctx.fillStyle = '#4a90e2';
                ctx.fillRect(cabX + 10, cabY + 15, 15, 8);
                ctx.fillStyle = '#ff6b6b';
                ctx.fillRect(cabX + 30, cabY + 15, 15, 8);
            }
        }
        
        if (room.id === 'medical') {
            // Medical cross
            ctx.fillStyle = '#ff0000';
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 10;
            const cx = room.x + room.width / 2;
            const cy = room.y + 50;
            ctx.fillRect(cx - 5, cy - 20, 10, 40);
            ctx.fillRect(cx - 20, cy - 5, 40, 10);
            ctx.shadowBlur = 0;
            
            // Medical cabinets
            for (let i = 0; i < 2; i++) {
                const mx = room.x + 50 + i * 150;
                const my = room.y + 100;
                
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(mx, my, 80, 120);
                ctx.strokeStyle = '#888';
                ctx.lineWidth = 2;
                ctx.strokeRect(mx, my, 80, 120);
                
                // Shelves
                for (let j = 0; j < 3; j++) {
                    ctx.beginPath();
                    ctx.moveTo(mx, my + 30 + j * 30);
                    ctx.lineTo(mx + 80, my + 30 + j * 30);
                    ctx.stroke();
                }
            }
        }
        
        if (room.id === 'storage') {
            // Stacked crates
            for (let i = 0; i < 6; i++) {
                const bx = room.x + 30 + (i % 3) * 80;
                const by = room.y + 150 + Math.floor(i / 3) * 60;
                
                ctx.fillStyle = '#8b6914';
                ctx.fillRect(bx, by, 50, 50);
                ctx.strokeStyle = '#5a4a0a';
                ctx.lineWidth = 2;
                ctx.strokeRect(bx, by, 50, 50);
            }
        }
        
        // Corner bolts/rivets
        if (room.name) {
            ctx.fillStyle = '#6a7a8a';
            const boltSize = 4;
            ctx.beginPath();
            ctx.arc(room.x + 10, room.y + 10, boltSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(room.x + room.width - 10, room.y + 10, boltSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(room.x + 10, room.y + room.height - 10, boltSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(room.x + room.width - 10, room.y + room.height - 10, boltSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Room border with glow
        ctx.strokeStyle = '#4a6a8a';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#4a6a8a';
        ctx.shadowBlur = 5;
        ctx.strokeRect(room.x, room.y, room.width, room.height);
        ctx.shadowBlur = 0;
        
        // Inner border highlight
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(room.x + 2, room.y + 2, room.width - 4, room.height - 4);
        
        // Draw room name with background
        if (room.name && room.icon) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(room.x + 5, room.y + 5, room.name.length * 9 + 10, 20);
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 1;
            ctx.strokeRect(room.x + 5, room.y + 5, room.name.length * 9 + 10, 20);
            
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#00d4ff';
            ctx.textAlign = 'left';
            ctx.fillText(room.name, room.x + 10, room.y + 20);
        }
        
        
        // Draw interactables
        room.interactables.forEach(inter => {
            drawInteractable(inter.x, inter.y, inter.type, inter.room);
            
            // Draw animated glow effect for nearby interactables
            const distance = Math.sqrt(
                Math.pow(player.x + player.width / 2 - inter.x, 2) +
                Math.pow(player.y + player.height / 2 - inter.y, 2)
            );
            
            if (distance < 60) {
                const pulse = Math.sin(gameState.time * 5) * 0.3 + 0.7;
                ctx.strokeStyle = `rgba(0, 255, 136, ${pulse})`;
                ctx.lineWidth = 3;
                ctx.shadowColor = '#00ff88';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(inter.x, inter.y, 20 + Math.sin(gameState.time * 3) * 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        });
        
        // Draw Carl Sagan if spawned and in central corridor
        if (gameState.carlSaganSpawned && room.id === 'central_corridor') {
            const carlX = 1000;
            const carlY = 900;
            
            // Draw Carl Sagan sprite
            ctx.save();
            
            // Glow effect
            const pulse = Math.sin(gameState.time * 2) * 0.3 + 0.7;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20 * pulse;
            
            // Body
            ctx.fillStyle = '#4a3a2a';
            ctx.fillRect(carlX - 12, carlY + 10, 24, 30);
            
            // Head
            ctx.fillStyle = '#f4c2a0';
            ctx.beginPath();
            ctx.arc(carlX, carlY, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Hair
            ctx.fillStyle = '#8b7355';
            ctx.beginPath();
            ctx.arc(carlX, carlY - 5, 13, Math.PI, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(carlX - 4, carlY - 2, 2, 0, Math.PI * 2);
            ctx.arc(carlX + 4, carlY - 2, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Smile
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(carlX, carlY + 2, 5, 0, Math.PI);
            ctx.stroke();
            
            // Stars around him
            for (let i = 0; i < 5; i++) {
                const angle = (gameState.time + i * Math.PI * 2 / 5) * 2;
                const starX = carlX + Math.cos(angle) * 30;
                const starY = carlY + Math.sin(angle) * 30;
                ctx.fillStyle = '#ffd700';
                ctx.font = '16px Arial';
                ctx.fillText('⭐', starX, starY);
            }
            
            ctx.shadowBlur = 0;
            ctx.restore();
            
            // Check if player is near Carl Sagan
            const distanceToCarl = Math.sqrt(
                Math.pow(player.x + player.width / 2 - carlX, 2) +
                Math.pow(player.y + player.height / 2 - carlY, 2)
            );
            
            if (distanceToCarl < 60) {
                const pulse2 = Math.sin(gameState.time * 5) * 0.3 + 0.7;
                ctx.strokeStyle = `rgba(255, 215, 0, ${pulse2})`;
                ctx.lineWidth = 3;
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(carlX, carlY, 25 + Math.sin(gameState.time * 3) * 3, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    });
    
    // CRITICAL FIX: Fill the gap between engine (x:600-900) and medical (x:1100-1400)
    // Gap area: x:900-1100, y:1150-1550
    const gapX = 900;
    const gapY = 1150;
    const gapWidth = 200;
    const gapHeight = 400;
    const gapFloorHeight = gapHeight * 0.3;
    
    // Floor with same texture as other rooms
    const gapFloorGradient = ctx.createLinearGradient(gapX, gapY + gapHeight - gapFloorHeight, gapX, gapY + gapHeight);
    gapFloorGradient.addColorStop(0, '#0a1520');
    gapFloorGradient.addColorStop(0.5, '#081218');
    gapFloorGradient.addColorStop(1, '#060f10');
    ctx.fillStyle = gapFloorGradient;
    ctx.fillRect(gapX, gapY + gapHeight - gapFloorHeight, gapWidth, gapFloorHeight);
    
    // Floor tiles
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < gapWidth; i += 50) {
        ctx.beginPath();
        ctx.moveTo(gapX + i, gapY + gapHeight - gapFloorHeight);
        ctx.lineTo(gapX + i, gapY + gapHeight);
        ctx.stroke();
    }
    for (let i = 0; i < gapFloorHeight; i += 50) {
        ctx.beginPath();
        ctx.moveTo(gapX, gapY + gapHeight - gapFloorHeight + i);
        ctx.lineTo(gapX + gapWidth, gapY + gapHeight - gapFloorHeight + i);
        ctx.stroke();
    }
    
    // Walls with gradient (upper 70%)
    const gapWallHeight = gapHeight - gapFloorHeight;
    const gapWallGradient = ctx.createLinearGradient(gapX, gapY, gapX, gapY + gapWallHeight);
    gapWallGradient.addColorStop(0, '#2a3a4a');
    gapWallGradient.addColorStop(0.5, '#1a2a3a');
    gapWallGradient.addColorStop(1, '#0a1a2a');
    ctx.fillStyle = gapWallGradient;
    ctx.fillRect(gapX, gapY, gapWidth, gapWallHeight);
    
    // Decorations for the gap corridor
    // Vertical light strips on both sides
    for (let i = 0; i < gapHeight; i += 80) {
        const lightPulse = Math.sin(gameState.time * 2 + i * 0.02) * 0.3 + 0.7;
        
        // Left light strip
        ctx.fillStyle = `rgba(0, 212, 255, ${lightPulse * 0.4})`;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.fillRect(gapX + 8, gapY + i, 4, 60);
        
        // Right light strip
        ctx.fillRect(gapX + gapWidth - 12, gapY + i, 4, 60);
        ctx.shadowBlur = 0;
    }
    
    // Horizontal warning stripe
    ctx.fillStyle = '#ffaa00';
    for (let i = 0; i < gapWidth; i += 30) {
        ctx.fillRect(gapX + i, gapY + 20, 15, 8);
    }
    ctx.fillStyle = '#000';
    for (let i = 15; i < gapWidth; i += 30) {
        ctx.fillRect(gapX + i, gapY + 20, 15, 8);
    }
    
    // Metallic panels on walls
    ctx.strokeStyle = 'rgba(150, 170, 190, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < gapWidth; i += 50) {
        ctx.beginPath();
        ctx.moveTo(gapX + i, gapY);
        ctx.lineTo(gapX + i, gapY + gapWallHeight);
        ctx.stroke();
    }
    
    // Rivets on panels
    ctx.fillStyle = 'rgba(100, 120, 140, 0.5)';
    for (let i = 25; i < gapWidth; i += 50) {
        for (let j = 30; j < gapWallHeight; j += 50) {
            ctx.beginPath();
            ctx.arc(gapX + i, gapY + j, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Ventilation grilles
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(gapX + 30, gapY + gapWallHeight - 50, 60, 30);
    ctx.fillRect(gapX + gapWidth - 90, gapY + gapWallHeight - 50, 60, 30);
    
    // Grille lines
    ctx.strokeStyle = 'rgba(100, 120, 140, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 30; i += 3) {
        ctx.beginPath();
        ctx.moveTo(gapX + 30, gapY + gapWallHeight - 50 + i);
        ctx.lineTo(gapX + 90, gapY + gapWallHeight - 50 + i);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(gapX + gapWidth - 90, gapY + gapWallHeight - 50 + i);
        ctx.lineTo(gapX + gapWidth - 30, gapY + gapWallHeight - 50 + i);
        ctx.stroke();
    }
    
    // Draw particles
    gameState.particles.forEach(p => p.draw(ctx));
    
    // Draw player
    drawPlayer(player.x, player.y, player.direction);
    
    // Draw death overlay
    if (gameState.isDying) {
        ctx.fillStyle = `rgba(255, 0, 0, ${gameState.deathAnimation * 0.5})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Death text
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = `rgba(255, 255, 255, ${gameState.deathAnimation})`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.fillText('SIN OXÍGENO', canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
    }
    
    // Restore context (end camera transform)
    ctx.restore();
    
    // Low oxygen warning (drawn in screen space, not world space)
    if (gameState.oxygen < 20 && gameState.oxygen > 0 && !gameState.isDying) {
        const warningAlpha = Math.sin(gameState.time * 10) * 0.3 + 0.3;
        ctx.fillStyle = `rgba(255, 0, 0, ${warningAlpha})`;
        ctx.fillRect(0, 0, canvas.width, 10);
        ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
        ctx.fillRect(0, 0, 10, canvas.height);
        ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
    }
}

// Render Mars surface - MEJORADO Y MÁGICO
function renderMars() {
    // Mars sky gradient - más mágico
    const skyGradient = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, canvas.height, canvas.height);
    skyGradient.addColorStop(0, '#ff6b4a');
    skyGradient.addColorStop(0.4, '#cd5a3f');
    skyGradient.addColorStop(0.7, '#8b3a1a');
    skyGradient.addColorStop(1, '#4a1a0a');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Distant stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 30; i++) {
        const x = (i * 157.3) % canvas.width;
        const y = (i * 89.7) % (canvas.height * 0.4);
        const twinkle = Math.sin(gameState.time * 3 + i) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Far distant mountains (background layer)
    ctx.fillStyle = '#4a1a0a';
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i += 40) {
        const height = 180 + Math.sin(i * 0.01) * 60;
        if (i === 0) {
            ctx.moveTo(i, canvas.height - height);
        } else {
            ctx.lineTo(i, canvas.height - height);
        }
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Mid-distance mountains
    ctx.fillStyle = '#6b2a1a';
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i += 50) {
        const height = 140 + Math.sin(i * 0.02 + 1) * 50 + Math.cos(i * 0.015) * 30;
        if (i === 0) {
            ctx.moveTo(i, canvas.height - height);
        } else {
            ctx.lineTo(i, canvas.height - height);
        }
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Mars terrain with texture (increased height to 300px)
    const terrainHeight = 300;
    const terrainGradient = ctx.createLinearGradient(0, canvas.height - terrainHeight, 0, canvas.height);
    terrainGradient.addColorStop(0, '#a0522d');
    terrainGradient.addColorStop(0.5, '#8b3a0a');
    terrainGradient.addColorStop(1, '#6b2a0a');
    ctx.fillStyle = terrainGradient;
    ctx.fillRect(0, canvas.height - terrainHeight, canvas.width, terrainHeight);
    
    // Terrain texture details
    for (let i = 0; i < 50; i++) {
        const x = (i * 123.4) % canvas.width;
        const y = canvas.height - terrainHeight + (i * 67.8) % terrainHeight;
        const size = 2 + (i % 3);
        ctx.fillStyle = `rgba(139, 69, 19, ${0.3 + (i % 3) * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Sand dunes
    for (let i = 0; i < 3; i++) {
        const duneX = (i * 300 + gameState.time * 5) % (canvas.width + 200) - 100;
        const duneY = canvas.height - 180;
        const duneGradient = ctx.createRadialGradient(duneX, duneY, 0, duneX, duneY, 150);
        duneGradient.addColorStop(0, 'rgba(205, 133, 63, 0.4)');
        duneGradient.addColorStop(1, 'rgba(205, 133, 63, 0)');
        ctx.fillStyle = duneGradient;
        ctx.beginPath();
        ctx.ellipse(duneX, duneY, 150, 40, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Dust particles in air
    for (let i = 0; i < 20; i++) {
        const x = (i * 73.5 + gameState.time * 20) % canvas.width;
        const y = canvas.height - 200 + (i * 17.3) % 150;
        const alpha = Math.sin(gameState.time * 2 + i) * 0.2 + 0.3;
        ctx.fillStyle = `rgba(205, 133, 63, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Rocks and craters - más detallados
    for (let i = 0; i < 25; i++) {
        const x = (i * 213.7) % canvas.width;
        const y = canvas.height - 140 + (i * 37.3) % 120;
        const size = 15 + (i % 5) * 8;
        
        // Rock shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + 5, y + 5, size * 1.2, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Rock
        ctx.fillStyle = '#6b2a0a';
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Rock highlight
        ctx.fillStyle = '#8b4a1a';
        ctx.beginPath();
        ctx.ellipse(x - size * 0.3, y - size * 0.2, size * 0.4, size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Find nearest crystal for collection
    let nearestCrystal = null;
    let nearestDistance = Infinity;
    
    gameState.marsCrystals.forEach(crystal => {
        if (crystal.collected) return;
        
        const floatY = crystal.y + Math.sin(gameState.time * 2 + crystal.floatOffset) * 5;
        const distance = Math.sqrt(
            Math.pow(player.x + player.width / 2 - crystal.x, 2) +
            Math.pow(player.y + player.height / 2 - floatY, 2)
        );
        
        if (distance < 50 && distance < nearestDistance) {
            nearestDistance = distance;
            nearestCrystal = crystal;
        }
    });
    
    // Resource crystals - MEJORADOS Y COLECTABLES
    gameState.marsCrystals.forEach((crystal, index) => {
        if (crystal.collected) return;
        
        const floatY = crystal.y + Math.sin(gameState.time * 2 + crystal.floatOffset) * 5;
        
        // Crystal glow aura
        const glowSize = 30 + Math.sin(gameState.time * 3 + index) * 10;
        const gradient = ctx.createRadialGradient(crystal.x, floatY, 0, crystal.x, floatY, glowSize);
        
        if (crystal.type === 'rare') {
            gradient.addColorStop(0, 'rgba(255, 0, 255, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(crystal.x, floatY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Crystal body
        ctx.save();
        ctx.translate(crystal.x, floatY);
        ctx.rotate(gameState.time + index);
        
        const crystalColor = crystal.type === 'rare' ? '#ff00ff' : '#00d4ff';
        ctx.fillStyle = crystalColor;
        ctx.shadowColor = crystalColor;
        ctx.shadowBlur = 20;
        
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-8, 10);
        ctx.lineTo(8, 10);
        ctx.lineTo(12, 0);
        ctx.closePath();
        ctx.fill();
        
        // Crystal shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(-4, -10);
        ctx.lineTo(-6, -5);
        ctx.lineTo(-2, -8);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // Check if player is near crystal
        const distance = Math.sqrt(
            Math.pow(player.x + player.width / 2 - crystal.x, 2) +
            Math.pow(player.y + player.height / 2 - floatY, 2)
        );
        
        if (distance < 50 && crystal === nearestCrystal) {
            // Check if collecting this crystal (only if it's the nearest one)
            if (keys.e) {
                if (gameState.collectingCrystal !== crystal) {
                    // Start collecting
                    gameState.collectingCrystal = crystal;
                    gameState.collectProgress = 0;
                } else {
                    // Continue collecting
                    gameState.collectProgress += 1/60 / 2; // 2 seconds at 60fps
                    
                    if (gameState.collectProgress >= 1) {
                        // Collection complete
                        crystal.collected = true;
                        const value = crystal.type === 'rare' ? 20 : 10;
                        const points = crystal.type === 'rare' ? 100 : 50;
                        gameState.marsResources += value;
                        gameState.score += points;
                        
                        // Create collection particles
                        for (let i = 0; i < 10; i++) {
                            const angle = (i / 10) * Math.PI * 2;
                            const speed = Math.random() * 3 + 2;
                            gameState.particles.push(new Particle(
                                crystal.x,
                                floatY,
                                crystalColor,
                                Math.cos(angle) * speed,
                                Math.sin(angle) * speed - 2
                            ));
                        }
                        
                        addLogEntry(`💎 Cristal ${crystal.type === 'rare' ? 'RARO' : 'común'}! +${value} recursos, +${points} puntos`);
                        
                        // Reset collection state
                        gameState.collectingCrystal = null;
                        gameState.collectProgress = 0;
                    }
                }
                
                // Show collection progress bar
                const barWidth = 60;
                const barHeight = 8;
                const barX = crystal.x - barWidth / 2;
                const barY = floatY - 50;
                
                // Background bar
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(barX, barY, barWidth, barHeight);
                
                // Progress bar
                ctx.fillStyle = '#00ff88';
                ctx.fillRect(barX, barY, barWidth * gameState.collectProgress, barHeight);
                
                // Border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(barX, barY, barWidth, barHeight);
                
                // Text
                ctx.fillStyle = '#00ff88';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Mantén E', crystal.x, floatY - 60);
            } else {
                // Reset if not pressing E
                if (gameState.collectingCrystal === crystal) {
                    gameState.collectingCrystal = null;
                    gameState.collectProgress = 0;
                }
                
                // Show prompt
                ctx.fillStyle = '#00ff88';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Mantén E (2s)', crystal.x, floatY - 35);
            }
        } else {
            // Reset if too far
            if (gameState.collectingCrystal === crystal) {
                gameState.collectingCrystal = null;
                gameState.collectProgress = 0;
            }
        }
    });
    
    // Ship in background (left side) - más detallado
    ctx.fillStyle = '#3a3a3a';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fillRect(20, canvas.height - 250, 80, 150);
    ctx.shadowBlur = 0;
    
    // Ship details
    ctx.fillStyle = '#5a5a5a';
    ctx.beginPath();
    ctx.moveTo(60, canvas.height - 250);
    ctx.lineTo(20, canvas.height - 280);
    ctx.lineTo(100, canvas.height - 280);
    ctx.closePath();
    ctx.fill();
    
    // Ship windows
    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 10;
    ctx.fillRect(40, canvas.height - 220, 15, 15);
    ctx.fillRect(65, canvas.height - 220, 15, 15);
    ctx.shadowBlur = 0;
    
    // Ship door
    ctx.fillStyle = '#4a90e2';
    ctx.shadowColor = '#4a90e2';
    ctx.shadowBlur = 15;
    ctx.fillRect(45, canvas.height - 150, 30, 50);
    ctx.shadowBlur = 0;
    
    // Draw particles
    gameState.particles.forEach(p => p.draw(ctx));
    
    // Draw bullets
    gameState.bullets.forEach(bullet => bullet.draw(ctx));
    
    // Draw hazards (micrometeoritos y tormentas)
    gameState.hazards.forEach(hazard => {
        if (hazard.active) {
            hazard.draw(ctx);
        }
    });
    
    // Draw rover
    drawPlayer(player.x, player.y, player.direction);
    
    // Mars info overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 280, 110);
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 280, 110);
    
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('🔴 SUPERFICIE DE MARTE', 20, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText(`💎 Cristales: ${gameState.marsCrystals.filter(c => !c.collected).length}/15`, 20, 60);
    ctx.fillText(`📦 Recolectados: ${gameState.marsResources}`, 20, 80);
    ctx.fillText(`⚠️ Peligros: ${gameState.hazards.length}`, 20, 100);
    
    // Controls hint
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('ESPACIO para disparar', 150, 100);
    
    // Fuel warning
    if (gameState.roverFuel < 50) {
        const warningAlpha = Math.sin(gameState.time * 10) * 0.3 + 0.5;
        ctx.fillStyle = `rgba(255, 100, 0, ${warningAlpha})`;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ COMBUSTIBLE BAJO', canvas.width / 2, canvas.height - 20);
    }
    
    // Out of fuel
    if (gameState.roverFuel <= 0 && !gameState.isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.fillText('SIN COMBUSTIBLE', canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Usa el botón para volver a la nave', canvas.width / 2, canvas.height / 2 + 20);
        ctx.shadowBlur = 0;
    }
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// UI Functions
function updateUI() {
    if (gameState.isOutside) {
        // Show rover fuel instead of oxygen
        document.getElementById('energyValue').textContent = Math.max(0, Math.round(gameState.roverFuel));
        document.getElementById('oxygenValue').textContent = Math.max(0, Math.round(gameState.marsResources));
        document.getElementById('scoreValue').textContent = gameState.score;
        document.getElementById('dayValue').textContent = 'MARTE';
        
        const energyBar = document.getElementById('energyBar');
        const oxygenBar = document.getElementById('oxygenBar');
        
        const maxFuel = gameState.inventory.length * 25;
        energyBar.style.width = `${Math.max(0, Math.min(100, (gameState.roverFuel / maxFuel) * 100))}%`;
        oxygenBar.style.width = `${Math.min(100, gameState.marsResources)}%`;
        
        energyBar.style.background = 'linear-gradient(90deg, #ff8800 0%, #ffaa00 100%)';
        oxygenBar.style.background = 'linear-gradient(90deg, #00d4ff 0%, #00ffff 100%)';
        
        // Update labels
        document.querySelector('.stat-label').textContent = '⛽ Combustible:';
        document.querySelectorAll('.stat-label')[1].textContent = '💎 Recursos:';
    } else {
        document.getElementById('energyValue').textContent = Math.max(0, Math.round(gameState.energy));
        document.getElementById('oxygenValue').textContent = Math.max(0, Math.round(gameState.oxygen));
        document.getElementById('scoreValue').textContent = gameState.score;
        document.getElementById('dayValue').textContent = gameState.day;
        
        const energyBar = document.getElementById('energyBar');
        const oxygenBar = document.getElementById('oxygenBar');
        
        energyBar.style.width = `${Math.max(0, Math.min(100, gameState.energy))}%`;
        oxygenBar.style.width = `${Math.max(0, Math.min(100, gameState.oxygen))}%`;
        
        if (gameState.energy < 30) {
            energyBar.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ff8787 100%)';
        } else {
            energyBar.style.background = 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)';
        }
        
        if (gameState.oxygen < 30) {
            oxygenBar.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ff8787 100%)';
        } else {
            oxygenBar.style.background = 'linear-gradient(90deg, #00d4ff 0%, #4de8ff 100%)';
        }
        
        // Reset labels
        document.querySelector('.stat-label').textContent = '⚡ Energía:';
        document.querySelectorAll('.stat-label')[1].textContent = '🧬 Oxígeno:';
    }
    
    // Update Mars button
    updateMarsButton();
}

function addLogEntry(message) {
    const logContent = document.getElementById('logContent');
    const entry = document.createElement('p');
    entry.className = 'log-entry';
    entry.textContent = message;
    logContent.appendChild(entry);
    
    logContent.scrollTop = logContent.scrollHeight;
    
    while (logContent.children.length > 8) {
        logContent.removeChild(logContent.firstChild);
    }
}

function checkGameOver() {
    if (gameState.energy <= 0 || gameState.oxygen <= 0) {
        gameState.isGameOver = true;
        showGameOver();
    }
}

function showGameOver() {
    const modal = document.getElementById('gameOverModal');
    const message = document.getElementById('gameOverMessage');
    const finalScore = document.getElementById('finalScore');
    const finalDays = document.getElementById('finalDays');
    
    if (gameState.energy <= 0) {
        message.textContent = 'Te quedaste sin energía. La misión ha terminado.';
    } else if (gameState.oxygen <= 0) {
        message.textContent = 'El oxígeno se agotó. La misión ha terminado.';
    }
    
    finalScore.textContent = gameState.score;
    finalDays.textContent = gameState.day;
    
    modal.classList.add('active');
}

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    const modal = document.getElementById('pauseModal');
    
    if (gameState.isPaused) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

function showMap() {
    const modal = document.getElementById('mapModal');
    const container = document.getElementById('mapContainer');
    
    // Create mini map
    container.innerHTML = `
        <canvas id="miniMap" width="800" height="600" style="border: 2px solid #4a6a8a; border-radius: 10px;"></canvas>
    `;
    
    const miniCanvas = document.getElementById('miniMap');
    const miniCtx = miniCanvas.getContext('2d');
    
    // Calculate the bounds of the entire ship
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    rooms.forEach(room => {
        minX = Math.min(minX, room.x);
        minY = Math.min(minY, room.y);
        maxX = Math.max(maxX, room.x + room.width);
        maxY = Math.max(maxY, room.y + room.height);
    });
    
    const shipWidth = maxX - minX;
    const shipHeight = maxY - minY;
    
    // Calculate scale to fit the canvas with padding
    const padding = 40;
    const scaleX = (miniCanvas.width - padding * 2) / shipWidth;
    const scaleY = (miniCanvas.height - padding * 2) / shipHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate offset to center the map
    const offsetX = (miniCanvas.width - shipWidth * scale) / 2 - minX * scale;
    const offsetY = (miniCanvas.height - shipHeight * scale) / 2 - minY * scale;
    
    // Draw background
    miniCtx.fillStyle = '#0a0a1a';
    miniCtx.fillRect(0, 0, miniCanvas.width, miniCanvas.height);
    
    // Draw rooms on mini map
    rooms.forEach(room => {
        const x = room.x * scale + offsetX;
        const y = room.y * scale + offsetY;
        const w = room.width * scale;
        const h = room.height * scale;
        
        // Draw room background
        miniCtx.fillStyle = room.color;
        miniCtx.fillRect(x, y, w, h);
        
        // Draw room border
        miniCtx.strokeStyle = '#4a6a8a';
        miniCtx.lineWidth = 2;
        miniCtx.strokeRect(x, y, w, h);
        
        // Draw room name and icon
        if (room.name) {
            miniCtx.font = 'bold 14px Arial';
            miniCtx.fillStyle = '#ffffff';
            miniCtx.textAlign = 'center';
            miniCtx.fillText(room.icon + ' ' + room.name, x + w/2, y + 20);
        }
        
        // Draw interactables on map
        room.interactables.forEach(inter => {
            const interX = inter.x * scale + offsetX;
            const interY = inter.y * scale + offsetY;
            
            miniCtx.fillStyle = '#00d4ff';
            miniCtx.beginPath();
            miniCtx.arc(interX, interY, 5, 0, Math.PI * 2);
            miniCtx.fill();
            
            // Draw interactable icon
            miniCtx.font = '12px Arial';
            miniCtx.fillText(inter.icon, interX, interY + 4);
        });
    });
    
    // Draw player position with glow
    const playerX = (player.x + player.width/2) * scale + offsetX;
    const playerY = (player.y + player.height/2) * scale + offsetY;
    
    miniCtx.shadowColor = '#00ff88';
    miniCtx.shadowBlur = 15;
    miniCtx.fillStyle = '#00ff88';
    miniCtx.beginPath();
    miniCtx.arc(playerX, playerY, 10, 0, Math.PI * 2);
    miniCtx.fill();
    miniCtx.shadowBlur = 0;
    
    // Draw player label
    miniCtx.font = 'bold 12px Arial';
    miniCtx.fillStyle = '#00ff88';
    miniCtx.textAlign = 'center';
    miniCtx.fillText('TÚ', playerX, playerY - 15);
    
    modal.classList.add('active');
}

function showInventory() {
    const modal = document.getElementById('inventoryModal');
    const grid = document.getElementById('inventoryGrid');
    
    grid.innerHTML = '';
    
    // Add inventory items
    gameState.inventory.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        
        const itemInfo = resourceCatalog[item] || { name: 'Recurso Desconocido', desc: 'Item sin clasificar' };
        
        slot.innerHTML = `
            <div class="item-icon">${item}</div>
            <div class="item-name">${itemInfo.name}</div>
        `;
        
        // Add click event to show item details
        slot.addEventListener('click', () => {
            showItemDetails(item, itemInfo);
        });
        
        grid.appendChild(slot);
    });
    
    // Add empty slots
    for (let i = gameState.inventory.length; i < 12; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot empty';
        slot.innerHTML = `
            <div class="item-icon">📭</div>
            <div class="item-name">Vacío</div>
        `;
        grid.appendChild(slot);
    }
    
    modal.classList.add('active');
}

// Show item details when clicked
function showItemDetails(itemIcon, itemInfo) {
    // Close inventory modal first
    closeModal('inventoryModal');
    
    const modal = document.getElementById('minigameModal');
    const title = document.getElementById('minigameTitle');
    const container = document.getElementById('minigameContainer');
    
    title.textContent = '📦 Información del Recurso';
    container.innerHTML = `
        <div style="padding: 30px; text-align: center;">
            <div style="font-size: 80px; margin: 20px 0;">${itemIcon}</div>
            <h2 style="color: #00ff88; margin: 20px 0; font-size: 1.8em;">${itemInfo.name}</h2>
            <div style="background: rgba(74, 144, 226, 0.2); padding: 20px; border-radius: 10px; border-left: 4px solid #4a90e2; margin: 20px 0;">
                <p style="font-size: 1.1em; line-height: 1.6; color: #e0e0e0; margin: 0; text-align: justify;">
                    ${itemInfo.desc}
                </p>
            </div>
            <div style="background: rgba(0, 255, 136, 0.2); padding: 15px; border-radius: 10px; border: 2px solid #00ff88; margin: 20px 0;">
                <p style="color: #00ff88; margin: 0; font-size: 1em;">
                    💡 Este recurso se convierte en combustible para el rover en Marte
                </p>
            </div>
            <button onclick="closeModal('minigameModal')" class="restart-btn" style="padding: 12px 40px; font-size: 1.1em;">✅ Cerrar</button>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Start game when page loads
window.addEventListener('load', initGame);
