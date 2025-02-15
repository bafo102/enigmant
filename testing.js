const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Define rope properties
const ropeLength = 300; // Total length of the rope
const numPoints = 10; // Number of points in the rope
const points = [];
const fixedPoint = { x: 100, y: 100 }; // Fixed point at the top

// Initialize rope points
for (let i = 0; i < numPoints; i++) {
    points.push({
        x: fixedPoint.x + (ropeLength / (numPoints - 1)) * i,
        y: fixedPoint.y + (i * 20), // Spacing vertically
        oldY: fixedPoint.y + (i * 20), // Previous Y position
        mass: 1.0
    });
}

function updateRope() {
    // Update positions based on simple gravity
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const gravity = 0.5; // Simple gravity effect

        // Velocity and position update
        const velocityY = point.y - point.oldY;
        point.oldY = point.y;
        point.y += velocityY + gravity;

        // Constrain distance to previous point
        const prevPoint = points[i - 1];
        const dx = point.x - prevPoint.x;
        const dy = point.y - prevPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const desiredLength = 20; // Desired distance between points

        if (distance > desiredLength) {
            const diff = distance - desiredLength;
            const normalX = dx / distance;
            const normalY = dy / distance;

            // Pull points closer
            point.x -= normalX * diff * 0.5;
            point.y -= normalY * diff * 0.5;
        }
    }
}

function drawRope() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(fixedPoint.x, fixedPoint.y);
    for (const point of points) {
        context.lineTo(point.x, point.y);
    }
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();

    // Draw points
    for (const point of points) {
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, Math.PI * 2);
        context.fillStyle = 'blue';
        context.fill();
    }
}

function tick() {
    updateRope();
    drawRope();
    requestAnimationFrame(tick);
}

tick();