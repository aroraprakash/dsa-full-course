const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

let engine, render, runner;
let gravityEnabled = false;
let physicsBodies = [];

function initPhysics() {
    const container = document.getElementById('physics-container');
    if (!container) return;

    engine = Engine.create();

    render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    const ground = Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight + 50,
        window.innerWidth * 2,
        100,
        { isStatic: true }
    );

    const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight * 2, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);
}

function enableGravity() {
    if (gravityEnabled) return;
    gravityEnabled = true;

    // Prevent scrolling to avoid "looping" or broken positioning
    document.body.style.overflow = 'hidden';

    const btns = document.querySelectorAll('.gravity-btn');

    btns.forEach((btn) => {
        const rect = btn.getBoundingClientRect();

        // Skip if not even close to viewport to save performance on mobile
        if (rect.top < -500 || rect.top > window.innerHeight + 500) return;

        const body = Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                restitution: 0.5,
                friction: 0.1,
                chamfer: { radius: rect.width > 50 ? 10 : 5 }
            }
        );

        physicsBodies.push({
            element: btn,
            body: body,
            originalRect: rect
        });

        // Set fixed position to follow physics body in viewport
        btn.style.position = 'fixed';
        btn.style.width = rect.width + 'px';
        btn.style.height = rect.height + 'px';
        btn.style.left = '0px';
        btn.style.top = '0px';
        btn.style.margin = '0';
        btn.style.zIndex = '10000';
        btn.style.transition = 'none'; // Disable CSS transitions during physics

        Composite.add(engine.world, body);
    });

    Events.on(runner, 'afterUpdate', () => {
        physicsBodies.forEach(item => {
            const { element, body } = item;
            const { x, y } = body.position;
            const angle = body.angle;
            element.style.transform = `translate(${x - element.offsetWidth / 2}px, ${y - element.offsetHeight / 2}px) rotate(${angle}rad)`;
        });
    });
}

// Physics is initialized but gravity toggle is removed from UI

window.addEventListener('resize', () => {
    if (render && !gravityEnabled) {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
    }
});

initPhysics();
