import { action, computed, decorate, observable } from "mobx";
import { random, sample } from "lodash";

class Planet {
  // const
  parent = null;
  color = "#fff";
  mass = -1.0;

  // movement
  trail = [];
  x = 0.0;
  y = 0.0;
  xViewport = 0.0;
  yViewport = 0.0;
  vx = 0.0;
  vy = 0.0;
  ay = 0.0;
  ax = 0.0;

  constructor(props) {
    this.parent = props.parent;
    this.color = props.color || this.color;
    this.mass = props.mass || this.mass;
    this.x = props.x || this.x;
    this.y = props.y || this.y;
    this.vx = props.vx || this.vx;
    this.vy = props.vy || this.vy;
  }

  get radius() {
    return Math.log(this.mass * 1.0e8);
  }

  convertViewport = (v, y) => {
    const dim = y ? this.parent.maxY : this.parent.maxX;
    const follow = this.parent.followPlanet[y ? "y" : "x"];

    return (follow - v) * this.parent.scale + dim / 2;
  };

  update = () => {
    var ax = 0;
    var ay = 0;

    this.parent.planets
      .filter((o) => o !== this)
      .forEach((other) => {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const d2 = dx * dx + dy * dy;
        const f = (this.parent.g * other.mass) / d2 / Math.sqrt(d2);
        ax += f * dx;
        ay += f * dy;
      });

    this.ax = ax;
    this.ay = ay;
    this.vx += this.ax * this.parent.dt;
    this.vy += this.ay * this.parent.dt;
    this.x += this.vx * this.parent.dt;
    this.y += this.vy * this.parent.dt;
    this.xViewport = this.convertViewport(this.x, false);
    this.yViewport = this.convertViewport(this.y, true);
    this.trail.push(this.xViewport);
    this.trail.push(this.yViewport);
  };
}

decorate(Planet, {
  parent: observable,
  color: observable,
  trail: observable,
  destroyed: observable,
  mass: observable,
  update: action,
  radius: computed,
  x: observable,
  y: observable,
  xViewport: observable,
  yViewport: observable,
  vx: observable,
  vy: observable,
  ax: observable,
  ay: observable,
});

class Store {
  g = 40; // const
  dt = 0.005; // days
  scale = 120;
  minX = 0;
  maxX = 0;
  minY = 0;
  maxY = 0;

  planets = [];
  followPlanet = new Planet({ parent: this });

  constructor() {
    this.resize();

    this.planets.push(
      new Planet({
        parent: this,
        mass: 0.8,
      })
    );

    new Array(random(2, 8)).fill(0).forEach(() => {
      const x = sample([random(0.3, 1, true), random(-0.3, -1, true)]);
      const y = sample([random(0.3, 1, true), random(-0.3, -1, true)]);

      this.planets.push(
        new Planet({
          parent: this,
          mass: random(0, 0.00001, true),
          x: x,
          y: y,
          vx: random(3, 10) * -y,
          vy: random(3, 10) * x,
        })
      );
    });

    this.followPlanet = this.planets[0];

    setInterval(() => {
      this.planets.forEach((p) => p.update());
    }, 30);
  }

  resize = () => {
    this.minX = 0;
    this.maxX = window.innerWidth;
    this.minY = 0;
    this.maxY = window.innerHeight;
  };
}

decorate(Store, {
  g: observable,
  dt: observable,
  scale: observable,
  planets: observable,
  followPlanet: observable,
  resize: action,
  add: action,
});

export default new Store();
