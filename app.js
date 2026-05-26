document.addEventListener("DOMContentLoaded", () => {
    initViewRouter();
    initTextSplitting();
    initSmoothScroll();
    initGPURaymarchedShader();
    initCustomCursor();
    initAdvancedMagneticSystem();
    initIntersectionObservers();
});

// Dynamic global variables to modify GLSL vectors based on portfolio interactions
let globalShaderMode = 0.0; 
let globalShaderSpeed = 1.0;

/**
 * 1. HIGH-END VIEW-PORT APPLICATION ROUTER
 */
function initViewRouter() {
    const routers = document.querySelectorAll(".view-router");
    
    routers.forEach(router => {
        router.addEventListener("click", (e) => {
            const targetId = router.getAttribute("data-target");
            if (!targetId) return;
            
            e.preventDefault();

            // Toggle active styling states
            document.querySelectorAll(".view-router").forEach(r => r.classList.remove("active-route"));
            router.classList.add("active-route");

            // Execute spatial visual transit translations
            const currentActiveView = document.querySelector(".spatial-view.view-active");
            const nextTargetView = document.getElementById(targetId);

            if(currentActiveView && currentActiveView !== nextTargetView) {
                currentActiveView.style.opacity = "0";
                currentActiveView.style.transform = "translate3d(0, -30px, 0)";
                
                setTimeout(() => {
                    currentActiveView.classList.remove("view-active");
                    
                    nextTargetView.classList.add("view-active");
                    // Force DOM reflow execution
                    nextTargetView.getBoundingClientRect();
                    
                    nextTargetView.style.opacity = "1";
                    nextTargetView.style.transform = "translate3d(0, 0, 0)";
                    
                    // Recalculate virtualized scroll parameters smoothly
                    window.scrollTo(0, 0);
                    resetScrollChassisHeight();
                }, 400);
            }

            // Morph Raymarch shaders dynamically based on selected routes
            if (targetId === "home-view") { globalShaderMode = 0.0; globalShaderSpeed = 1.0; }
            else if (targetId === "portfolio-view") { globalShaderMode = 1.0; globalShaderSpeed = 0.4; }
            else if (targetId === "contact-view") { globalShaderMode = 2.0; globalShaderSpeed = 2.5; }
        });
    });
}

/**
 * 2. GLSL HARDWARE RAYMARCH VECTOR ENGINE
 */
function initGPURaymarchedShader() {
    if (window.innerWidth <= 1024) return;

    const container = document.getElementById("shader-viewport");
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
        u_time: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_scroll: { value: 0.0 },
        u_mode: { value: 0.0 }
    };

    const vertexShaderCode = `void main() { gl_Position = vec4(position, 1.0); }`;

    const fragmentShaderCode = `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_scroll;
        uniform float u_mode;

        mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

        float sdSDF(vec3 p) {
            // Dynamic geometry interpolation mapping directly over application route indexes
            if (u_mode < 0.5) {
                p.xy *= rot(u_time * 0.12 + u_scroll * 0.001);
                p.xz *= rot(u_time * 0.08);
                vec3 s = sin(p * 2.0 + u_time);
                return (length(p) - 1.25) + (s.x + s.y + s.z) * 0.12;
            } else if (u_mode < 1.5) {
                // Morph into architectural network matrix formations
                p.xz *= rot(u_time * 0.05);
                vec3 q = abs(p) - vec3(1.1);
                return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) + sin(p.x*8.0)*0.03;
            } else {
                // Morph into fast dynamic frequency telemetry spikes
                p.yz *= rot(u_time * 0.4);
                return length(p.xz) - 0.25 + sin(p.y * 12.0 + u_time * 4.0) * 0.08;
            }
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
            vec3 ro = vec3(0.0, 0.0, -3.2);
            vec3 rd = normalize(vec3(uv, 1.0));
            
            rd.yx *= rot(u_mouse.y * 0.35);
            rd.xz *= rot(u_mouse.x * 0.35);

            float dO = 0.0;
            vec3 p;
            
            for(int i=0; i<50; i++) {
                p = ro + rd * dO;
                float dS = sdSDF(p);
                dO += dS;
                if(dO > 8.0 || abs(dS) < 0.001) break;
            }

            vec3 color = vec3(0.0);

            if(dO < 8.0) {
                vec2 e = vec2(0.01, 0.0);
                vec3 n = normalize(sdSDF(p) - vec3(sdSDF(p-e.xyy), sdSDF(p-e.yxy), sdSDF(p-e.yyx)));
                float diff = dot(n, normalize(vec3(1.0, 1.0, -1.0))) * 0.5 + 0.5;
                float spec = pow(max(dot(reflect(normalize(vec3(1.0, 1.0, -1.0)), n), rd), 0.0), 32.0);
                
                // Pure high-fashion monochrome liquid lighting parameters
                color = vec3(diff * 0.12 + spec * 0.75);
                color += sin(p * 3.5) * 0.03; 
            }

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShaderCode, fragmentShader: fragmentShaderCode, uniforms: uniforms
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let targetMouseX = 0, targetMouseY = 0;
    window.addEventListener("mousemove", (e) => {
        targetMouseX = (e.clientX / window.innerWidth) - 0.5;
        targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    const clock = new THREE.Clock();

    function animateShaderLoop() {
        requestAnimationFrame(animateShaderLoop);
        uniforms.u_time.value = clock.getElapsedTime() * globalShaderSpeed;
        uniforms.u_scroll.value = window.scrollY;
        
        // Fluid interpolation transitions across target routes
        uniforms.u_mode.value += (globalShaderMode - uniforms.u_mode.value) * 0.08;
        
        uniforms.u_mouse.value.x += (targetMouseX - uniforms.u_mouse.value.x) * 0.06;
        uniforms.u_mouse.value.y += (targetMouseY - uniforms.u_mouse.value.y) * 0.06;

        renderer.render(scene, camera);
    }
    animateShaderLoop();

    // Trigger local hover modifications over individual portfolio project matrices
    document.querySelectorAll(".shader-mod-trigger").forEach(trigger => {
        trigger.addEventListener("mouseenter", () => {
            const mode = trigger.getAttribute("data-shader-mode");
            if(mode === "hyper") globalShaderSpeed = 2.0;
            if(mode === "liquid") globalShaderSpeed = 0.1;
        });
        trigger.addEventListener("mouseleave", () => {
            globalShaderSpeed = 0.6;
        });
    });
}

/**
 * 3. RUNTIME ACCELERATED SCROLL CHASSIS PIPELINE
 */
let targetY = 0, currentY = 0;
function initSmoothScroll() {
    if (window.innerWidth <= 1024) return;
    const container = document.getElementById("scroll-container");
    resetScrollChassisHeight();

    window.addEventListener("scroll", () => { targetY = window.scrollY; });
    window.addEventListener("resize", resetScrollChassisHeight);

    function updateScrollAnimationFrame() {
        currentY += (targetY - currentY) * 0.055;
        container.style.transform = `translate3d(0, ${-Math.round(currentY * 100) / 100}px, 0)`;
        requestAnimationFrame(updateScrollAnimationFrame);
    }
    updateScrollAnimationFrame();
}

function resetScrollChassisHeight() {
    const container = document.getElementById("scroll-container");
    document.body.style.height = `${container.getBoundingClientRect().height}px`;
}

/**
 * 4. TYPOGRAPHY VECTOR PARSING
 */
function initTextSplitting() {
    const textElement = document.querySelector(".herotext");
    if (!textElement) return;

    const words = textElement.innerText.split(" ");
    textElement.innerHTML = "";

    words.forEach((word) => {
        const wordWrapper = document.createElement("span");
        wordWrapper.className = "word-wrapper";
        Array.from(word).forEach(char => {
            const charSpan = document.createElement("span");
            charSpan.className = "char-element";
            charSpan.innerText = char;
            wordWrapper.appendChild(charSpan);
        });
        textElement.appendChild(wordWrapper);
        textElement.appendChild(document.createTextNode(" "));
    });

    setTimeout(() => {
        document.querySelectorAll(".char-element").forEach((char, index) => {
            char.style.transitionDelay = `${index * 0.015}s`;
            char.style.transform = "translate3d(0, 0, 0)";
        });
        document.querySelectorAll(".layer-stagger").forEach((item, idx) => {
            item.style.transitionDelay = `${0.6 + (idx * 0.1)}s`;
            item.style.opacity = "1";
            item.style.transform = "translate3d(0, 0, 0)";
        });
    }, 100);
}

/**
 * 5. KINETIC ARRAY APPARATUS
 */
function initCustomCursor() {
    const cursor = document.querySelector(".custom-cursor");
    const dot = document.querySelector(".custom-cursor-dot");
    if (!cursor) return;

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.08; cursorY += (mouseY - cursorY) * 0.08;
        cursor.style.left = `${cursorX}px`; cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    document.querySelectorAll("a, label, .dynamic-magnetic, .matrix-input").forEach(target => {
        target.addEventListener("mouseenter", () => {
            cursor.style.width = "40px"; cursor.style.height = "40px";
            cursor.style.backgroundColor = "rgba(255,255,255,0.06)"; cursor.style.borderColor = "rgba(255,255,255,0.6)";
        });
        target.addEventListener("mouseleave", () => {
            cursor.style.width = "18px"; cursor.style.height = "18px";
            cursor.style.backgroundColor = "transparent"; cursor.style.borderColor = "rgba(255,255,255,0.45)";
        });
    });
}

/**
 * 6. MULTI-AXIS DECOUPLED PERSPECTIVE TRACKERS
 */
function initAdvancedMagneticSystem() {
    const elements = document.querySelectorAll(".dynamic-magnetic");
    if (window.innerWidth <= 1024) return;

    elements.forEach(el => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            el.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
            el.style.setProperty('--my', `${(y / rect.height) * 100}%`);

            const deltaX = x - rect.width / 2;
            const deltaY = y - rect.height / 2;

            el.style.transform = `translate3d(${deltaX * 0.08}px, ${deltaY * 0.08}px, 0) rotateX(${-deltaY * 0.015}deg) rotateY(${deltaX * 0.015}deg)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)`;
            el.style.transition = "transform 0.8s var(--text-pure)";
        });

        el.addEventListener("mouseenter", () => { el.style.transition = "none"; });
    });
}

/**
 * 7. PERFORMANCE ACCELERATION SECTIONS TRANSITIONS
 */
function initIntersectionObservers() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible-active");
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal-trigger").forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translate3d(0, 35px, 0)";
        el.style.transition = "transform 1.4s var(--cubic-quantum), opacity 1.4s var(--cubic-quantum)";
        observer.observe(el);
    });
}
