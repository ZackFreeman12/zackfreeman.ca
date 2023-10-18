const matterContainer = document.getElementById("matter-container");
const homeSection = document.getElementById("homeSection");
const groundHeight = 60;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: 'transparent',
        wireframes: false,
        showAngleIndicator: false
    }
});
const particles = [];
// Function to add particles
function addParticle(x, y, radius) {
    const particle = Bodies.circle(x, y, radius, {
        friction: 0,
        frictionAir: 0.02,
        restitution: 0.6,
        render: {
            fillStyle: "#BEADFA"
        }
    });
    particles.push(particle);
    Composite.add(engine.world, particle);
}
/* for (let i = 0; i < 5; i++) {
    let circle = Bodies.circle(i, 10, 30, {
        friction: 0.3,
        frictionAir: 0.0001,
        restitution: 0.4
    });
    Composite.add(engine.world, circle);
} */

var ground = Bodies.rectangle(matterContainer.clientWidth / 2, homeSection.clientHeight - 20 + groundHeight / 2, 27184, groundHeight, { isStatic: true });

let leftWall = Bodies.rectangle(
    0 - groundHeight / 2,
    homeSection.clientHeight / 2, groundHeight,
    homeSection.clientHeight * 5,
    {
        isStatic: true
    }
);
let rightWall = Bodies.rectangle(
    matterContainer.clientWidth + groundHeight / 2,
    homeSection.clientHeight / 2, groundHeight,
    homeSection.clientHeight * 5,
    {
        isStatic: true
    }
);

// add all of the bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall]);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(engine.world, mouseConstraint);

mouseConstraint.mouse.element.removeEventListener(
    "mousewheel",
    mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
    "DOMmousewScroll",
    mouseConstraint.mouse.mousewheel
);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// Add particles initially
for (let i = 0; i < 400; i++) {
    addParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        Math.random() * 20 + 10
    );
}

function handleResize(matterContainer) {
    render.canvas.width = matterContainer.clientWidth;
    render.canvas.height = homeSection.clientHeight - 20;

    Matter.Body.setPosition(
        ground,
        Matter.Vector.create(matterContainer.clientWidth / 2, homeSection.clientHeight - 20 + groundHeight / 2)
    );

    Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(matterContainer.clientWidth + groundHeight / 2, homeSection.clientHeight - 20 / 2)
    );



}

window.addEventListener('resize', () => handleResize(matterContainer));