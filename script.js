class TVIPlayer {
    constructor() {
        this.videos = [
            'https://res.cloudinary.com/dj3kbeio1/video/upload/video1_agkfqt.mp4',
            'https://res.cloudinary.com/dj3kbeio1/video/upload/video2_w7ahng.mp4',
            'https://res.cloudinary.com/dj3kbeio1/video/upload/video3_jxfuvq.mp4'
        ];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.player = document.getElementById('main-player');
        this.sidebar = document.querySelector('.sidebar');

        this.player.muted = true;
        this.player.src = this.videos[this.currentIndex];
        this.player.onended = () => this.transitionToNext();

        this.updateTime();
        this.updateWeatherLive();
        this.startSidebarCycle();

        document.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen().catch(err => console.log(err));
            }
        });
    }

    transitionToNext() {
        this.player.classList.add('fade-out');
        setTimeout(() => {
            this.currentIndex = (this.currentIndex + 1) % this.videos.length;
            this.player.src = this.videos[this.currentIndex];
            this.player.load();
            this.player.oncanplay = () => {
                this.player.play().catch(e => console.log("Interacción requerida"));
                this.player.classList.remove('fade-out');
                this.player.oncanplay = null;
            };
        }, 800);
    }

    startSidebarCycle() {
        const hide = () => {
            this.sidebar.classList.add('hidden-panel');
            setTimeout(show, 15000); 
        };
        const show = () => {
            this.sidebar.classList.remove('hidden-panel');
            setTimeout(hide, 30000); 
        };
        setTimeout(hide, 30000);
    }

    async updateWeatherLive() {
        try {
            const response = await fetch(`https://wttr.in/Arica?format=j1&m&_=${new Date().getTime()}`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            const current = data.current_condition[0];
            
            document.getElementById('temperatura').textContent = `${current.temp_C}°C`;
            document.getElementById('ciudad').textContent = `Arica (${current.humidity}% Hum.)`;
            
            const code = current.weatherCode;
            const iconElement = document.getElementById('clima-icon');
            
            // Mapeo preciso de iconos según el código de clima
            const weatherIcons = {
                "113": "☀️", // Despejado
                "116": "⛅", // Parcialmente nublado
                "119": "☁️", // Nublado
                "122": "☁️", // Muy nublado
                "143": "🌫️", // Neblina
                "248": "🌫️", // Niebla
                "260": "🌫️", // Niebla helada
                "176": "🌦️", // Llovizna dispersa
                "296": "🌧️", // Lluvia ligera
                "302": "🌧️", // Lluvia moderada
                "308": "🌧️", // Lluvia fuerte
                "389": "⛈️", // Tormenta eléctrica
            };

            // Si el código no está en la lista, usamos uno por defecto basado en el rango
            iconElement.textContent = weatherIcons[code] || (parseInt(code) > 200 ? "🌧️" : "☀️");

            setTimeout(() => this.updateWeatherLive(), 120000);
        } catch (e) { 
            setTimeout(() => this.updateWeatherLive(), 10000);
        }
    }

    updateTime() {
        const now = new Date();
        document.getElementById('hora').textContent = now.toLocaleTimeString('es-CL', { 
            hour: '2-digit', minute: '2-digit', hour12: false 
        });
        document.getElementById('fecha').textContent = now.toLocaleDateString('es-CL', { 
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' 
        }).replace(/^\w/, c => c.toUpperCase());
        setTimeout(() => this.updateTime(), 1000);
    }
}

window.onload = () => new TVIPlayer();