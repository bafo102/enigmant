
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
  }

  update(gravity) {
    const vx = this.x - this.oldX;
    const vy = this.y - this.oldY + gravity;

    this.oldX = this.x;
    this.oldY = this.y;

    this.x += vx;
    this.y += vy;
  }
}


// import Point from "./Point";

/**
 * @typedef {Object} CableConfig
 * @property {HTMLElement|Point} start - The start element to attach the cable to.
 * @property {HTMLElement|Point} end - The end element to attach the cable to.
 * @property {string} [color='#000000'] - The color of the cable.
 * @property {number} [dragHandleSize=25] - The size of the drag handles.
 * @property {number} [gravity=1] - The gravity factor of the cable.
 * @property {number} [iterations=5] - The number of iterations to solve constraints.
 * @property {number} [lineThickness=2] - The thickness of the cable line.
 * @property {number} [segments=20] - The number of segments in the cable.
 * @property {number} [slack=1.1] - The slack factor of the cable.
 * @property {number} [snapRadius=100] - The radius for snapping to connector elements.
 * @property {string} [snapTargetSelector='.cable-connector'] - The selector for snap target elements.
 * @property {boolean} [draggable=true] - Whether the cable start/end points are draggable.
 */

class Cable {
  config = {
    color: "#000000",
    dragHandleSize: 25,
    gravity: 1,
    iterations: 5,
    lineThickness: 2,
    segments: 20,
    slack: 1.1,
    snapRadius: 100,
    snapTargetSelector: ".plughole",
    draggable: true,
  };

  /**
   * @param {CableConfig} [config] - The configuration object to override default settings.
   */
  constructor(config = {}) {
    this.config = { ...this.config, ...config };
    this.start = this.config.start;
    this.end = this.config.end;

    this.isDragging = false;
    this.draggedEnd = null;

    this.element = this.createMainElement();
    this.points = this.initializePoints();
    this.segmentElements = this.createSegmentElements();

    if (this.config.draggable) {
      this.setupDragHandles();
      this.setupDragEvents();
    }
  }

  createMainElement() {
    const element = document.createElement("div");
    element.classList.add("cable");
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.pointerEvents = "none";
    // console.log(event.target);
    return element;
  }

  removeMainElement() { // remove the cable
    this.element.remove();
  }

  addStartingPlug(startPoint) {
    this.element.dataset.startingPlug = startPoint.id[startPoint.id.length - 1];
  }

  addEndingPlug(snapTarget) {
    this.element.dataset.endingPlug = snapTarget.id[snapTarget.id.length - 1];
  }

  initializePoints() {
    const startPos = this.getElementCenter(this.start);
    const endPos = this.getElementCenter(this.end);
    const points = [new Point(startPos.x, startPos.y)];
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const totalLength = Math.sqrt(dx * dx + dy * dy) * this.config.slack;
    const segmentLength = totalLength / (this.config.segments - 1);

    for (let i = 1; i < this.config.segments - 1; i++) {
      const t = i / (this.config.segments - 1);
      points.push(
        new Point(
          startPos.x + dx * t + (Math.random() - 0.5) * segmentLength,
          startPos.y + dy * t + (Math.random() - 0.5) * segmentLength,
        ),
      );
    }
    points.push(new Point(endPos.x, endPos.y));

    return points;
  }

  /**
   * Get the center of an element or point.
   *
   * @param {HTMLElement|Point|{x: number, y: number}} element
   * @returns {{x, y}|null|{x: number, y: number}}
   */
  getElementCenter(element) {
    if (element instanceof Point || (element.hasOwnProperty("x") && element.hasOwnProperty("y"))) {
      return {
        x: element.x,
        y: element.y,
      };
    }

    if (element instanceof HTMLElement) {
      const { height, left, top, width } = element.getBoundingClientRect();
      return {
        x: left + width / 2,
        y: top + height / 2,
      };
    }

    return null;
  }

  setupDragHandles() {
    this.startHandle = this.createDragHandle();
    this.endHandle = this.createDragHandle();
    this.element.appendChild(this.startHandle);
    this.element.appendChild(this.endHandle);
  }

  setupDragEvents() {
    this.startHandle.addEventListener("mousedown", (e) => this.startDragging(e, "start"));
    this.endHandle.addEventListener("mousedown", (e) => this.startDragging(e, "end"));

    document.addEventListener("mousemove", (e) => this.drag(e));
    document.addEventListener("mouseup", (e) => this.stopDragging(e));
    
    // update plughole pairings
    document.addEventListener("mouseup", () => updatePlugholePairings());
  }

  createDragHandle() {
    const handle = document.createElement("div");
    handle.classList.add("cable-drag-handle");
    handle.style.width = `${this.config.dragHandleSize}px`;
    handle.style.height = `${this.config.dragHandleSize}px`;
    handle.style.position = "absolute";
    handle.style.borderRadius = "50%";
    handle.style.backgroundColor = "transparent";
    handle.style.pointerEvents = "all";
    handle.style.cursor = "move";
    handle.style.zIndex = "9999";
    return handle;
  }

  startDragging(event, end) {
    this.isDragging = true;
    this.draggedEnd = end;

    if (end === "start") {
      this.start = null;
    } else {
      this.end = null;
    }
  }

  drag(event) {
    if (!this.isDragging) return;
    const { clientX, clientY } = event;
    if (this.draggedEnd === "start") {
      this.points[0].x = clientX;
      this.points[0].y = clientY;
    } else {
      this.points[this.points.length - 1].x = clientX;
      this.points[this.points.length - 1].y = clientY;
    }

    this.update();
  }

  stopDragging() {
    if (!this.isDragging) return;

    const draggedPoint = this.draggedEnd === "start" ? this.points[0] : this.points[this.points.length - 1];
    const snapTarget = this.findSnapTarget(draggedPoint.x, draggedPoint.y);

    if (snapTarget) {
      if (this.draggedEnd === "start") {
        this.start = snapTarget;
      } else {
        this.end = snapTarget;
      }
      const center = this.getElementCenter(snapTarget);
      draggedPoint.x = center.x;
      draggedPoint.y = center.y;

      // add ending plughole
      this.addEndingPlug(snapTarget);
    }

    else {
        this.removeMainElement();
    }

    this.isDragging = false;
    this.draggedEnd = null;
    this.update();
  }

  findSnapTarget(x, y) {
    const potentialTargets = document.querySelectorAll(this.config.snapTargetSelector);

    let closestElement = null;
    
    /* ORIGINAL CODES
    let closestDistance = Infinity;

    for (let element of potentialTargets) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = element;
      }
    }

    // Only return the closest element if it's within the snap radius
    return closestDistance <= this.config.snapRadius ? closestElement : null;
    */
    
    for (let element of potentialTargets) {
        const rect = element.getBoundingClientRect();
    
        // check if element is inside target
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        closestElement = element;
        }
    }

    // Only return if closestElement exist
    return closestElement !== null ? closestElement : null;
  }

  createSegmentElements() {
    return this.points.slice(0, -1).map((_, index) => {
      const segment = document.createElement("div");
      segment.classList.add("cable-segment");
      segment.style.position = "absolute";
      segment.style.background = this.config.color;
      segment.style.height = this.config.lineThickness + "px";
      segment.style.transformOrigin = "0 50%";
      this.element.appendChild(segment);
      return segment;
    });
  }

  update() {
    if (this.start) {
      const center = this.getElementCenter(this.start);
      this.points[0].x = center.x;
      this.points[0].y = center.y;
    }
    if (this.end) {
      const center = this.getElementCenter(this.end);
      this.points[this.points.length - 1].x = center.x;
      this.points[this.points.length - 1].y = center.y;
    }

    // Apply gravity
    for (let i = 1; i < this.points.length - 1; i++) {
      this.points[i].y += this.config.gravity;
    }

    // Solve constraints
    for (let j = 0; j < this.config.iterations; j++) {
      this.solveConstraints();
    }

    this.render();
  }

  solveConstraints() {
    const segmentLength = this.calculateSegmentLength();
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const difference = (segmentLength - distance) / distance;
      const offsetX = dx * 0.5 * difference;
      const offsetY = dy * 0.5 * difference;

      if (i > 0) {
        p1.x -= offsetX;
        p1.y -= offsetY;
      }
      if (i < this.points.length - 2) {
        p2.x += offsetX;
        p2.y += offsetY;
      }
    }
  }

  calculateSegmentLength() {
    const totalLength = this.calculateTotalLength();
    return totalLength / (this.config.segments - 1);
  }

  calculateTotalLength() {
    const start = this.points[0];
    const end = this.points[this.points.length - 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy) * this.config.slack;
  }

  render() {
    this.segmentElements.forEach((segment, index) => {
      const p1 = this.points[index];
      const p2 = this.points[index + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      segment.style.width = `${length}px`;
      segment.style.left = `${p1.x}px`;
      segment.style.top = `${p1.y}px`;
      segment.style.transform = `rotate(${angle}rad)`;
    });

    if (this.config.draggable) {
      this.updateDragHandlePosition(this.startHandle, this.points[0]);
      this.updateDragHandlePosition(this.endHandle, this.points[this.points.length - 1]);
    }
  }

  updateDragHandlePosition(handle, point) {
    handle.style.left = `${point.x - this.config.dragHandleSize / 2}px`;
    handle.style.top = `${point.y - this.config.dragHandleSize / 2}px`;
  }
}



/**
 * @typedef {Object} PatchbayConfig
 * @property {number} [gravity=1] - The gravity force applied to cables.
 * @property {number} [iterations=5] - The number of constraint solving iterations per update.
 * @property {string} [color='#000000'] - The default color of cables.
 * @property {number} [slack=1.1] - The default slack factor of cables.
 * @property {number} [segments=20] - The number of segments in cables.
 * @property {number} [snapRadius=100] - The radius for snapping to connector elements.
 * @property {number} [dragHandleSize=25] - The size of the drag handles.
 *
 */

class Patchbay {
  /**
   * @type {PatchbayConfig}
   */
  config = {
    container: document.body,
    gravity: 1,
    iterations: 10,
    color: "#000000",
    slack: 1.1,
    segments: 20,
    snapRadius: 100,
    dragHandleSize: 20,
    lineThickness: 12,
    // snapElementSelector: ".cable-connector",
    snapElementSelector: ".plughole",
    zIndex: 9999,
  };

  /**
   * @param {Partial<PatchbayConfig>} [config] - The configuration object to override default settings.
   */
  constructor(config = {}) {
    this.config = { ...this.config, ...config };
    this.cables = [];

    if (!this.config.container) {
      throw new Error("No container element provided for patchbay");
    }

    this.root = this.createRootElement();
    this.config.container.appendChild(this.root);
  }

  createRootElement() {
    const root = document.createElement("div");

    root.classList.add("patchbay-container");
    root.style.position = "fixed";
    root.style.top = "0";
    root.style.bottom = "0";
    root.style.left = "0";
    root.style.right = "0";
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.zIndex = this.config.zIndex || 9999;
    root.style.pointerEvents = "none";

    return root;
  }

  /**
   * Create a new cable and add it to the patchbay.
   *
   * @param {HTMLElement} startElement - The start element to attach the cable to.
   * @param {HTMLElement} endElement - The end element to attach the cable to.
   * @param {Partial<CableConfig>} [cableConfig] - Override default cable settings for this cable.
   * @returns {Cable}
   */
  connect(startElement, endElement, cableConfig = {}) {
    const cableSettings = { ...this.config, ...cableConfig };

    // Don't pass container to cable
    delete cableSettings.container;

    const cable = new Cable({
      start: startElement,
      end: endElement,
      ...cableSettings,
    });
    this.cables.push(cable);
    this.root.appendChild(cable.element);
    return cable;
  }

  /**
   *
   * @param {Point|{x: number, y: number}} startPoint
   * @param {Point|{x: number, y: number}} endPoint
   * @param cableConfig
   */
  connectPoints(startPoint, endPoint, cableConfig = {}) {
    const cableSettings = { ...this.config, ...cableConfig };

    // Don't pass container to cable
    delete cableSettings.container;

    const cable = new Cable({
      start: startPoint,
      end: endPoint,
      ...cableSettings,
    });
    this.cables.push(cable);
    this.root.appendChild(cable.element);

    return cable;
  }

  startCable(startPoint, cableConfig = {}) {
    const cableSettings = { ...this.config, ...cableConfig };

    // Don't pass container to cable
    delete cableSettings.container;

    const cable = new Cable({
      start: startPoint,
      end: startPoint,
      ...cableSettings,
    });

    cable.startDragging("end");
    cable.update();

    // add starting plughole
    cable.addStartingPlug(startPoint);

    this.cables.push(cable);
    this.root.appendChild(cable.element);

    return cable;
  }

  /**
   * Remove a cable from the patchbay.
   * @param {Cable} cable - The Cable instance to remove.
   */
  removeCable(cable) {
    const index = this.cables.indexOf(cable);
    if (index > -1) {
      this.root.removeChild(cable.element);
      this.cables.splice(index, 1);
    }
  }

  clear() {
    for (let cable of this.cables) {
      this.removeCable(cable);
    }
    this.cables = [];
  }

  /**
   * Update the physics simulation for all cables.
   */
  update() {
    for (let cable of this.cables) {
      cable.update();
    }
  }

  /**
   * Start the animation loop.
   */
  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.loop();
  }

  /**
   * Animation loop for physics simulation.
   */
  loop() {
    this.update();
    requestAnimationFrame(() => this.loop());
  }

  /**
   * Stop the animation loop.
   */
  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.loop);
  }
}