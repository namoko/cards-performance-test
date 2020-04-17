import * as React from "react";

import "./CardsContianer.css";

const cardImage = "https://stackblitz.com/files/alix-cards-test/github/namoko/cards-performance-test/master/cardSmall.png";

const WIDTH = 1000;
const HEIGHT = 1000;

export enum DrawMethod {
  None, Map, ForEach, For
}

export class CardsContianer extends React.Component {

  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private frameHandler: number;
  private disposed = false;
  private r2 = Math.random();

  private cards: Card[] = [];

  private lastTime = 0;
  private frames = 0;
  private frameTime = 0;
  private fps = "fps";

  private drawMethod = DrawMethod.None;
  private cardCount = 100;

  public constructor(props) {
    super(props);

    console.log("===", cardImage)

    this.image = new Image();
    this.image.src = cardImage;
    this.image.onload = () => {
      console.log("image loaded");
      this.cards = prepareCards(this.image, this.cardCount);
    };
  }

  public render() {
    return <div className="container">
      <canvas key="cards-canvas" width={WIDTH} height={HEIGHT} ref={this.createCanvasRef}/>
    </div>;
  }

  public changeValues(cardCount: number, drawMethod: DrawMethod) {
    this.cardCount = cardCount;
    this.drawMethod = drawMethod;
    this.cards = prepareCards(this.image, cardCount);
  }

  private createCanvasRef = (canvas: HTMLCanvasElement | null) => {
    console.log("createCanvasRef", canvas);
    if (canvas) {
      this.ctx = canvas.getContext("2d");
      this.onFrame(0);
    } else {
      window.cancelAnimationFrame(this.frameHandler);
      this.disposed = true;
    }
  }

  // on StackBlitz this is not stopped and cloned on every update. Need manual refresh
  private onFrame = (time: number) => {
    if (this.disposed) return;
    this.frameHandler = window.requestAnimationFrame(this.onFrame);
    const dt = time - this.lastTime;
    this.lastTime = time;

    this.draw(dt * 0.001);
  }

  private draw(dt: number) {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (this.drawMethod === DrawMethod.Map) {
      this.drawWithMap(ctx, this.cards, dt);
    } else if (this.drawMethod === DrawMethod.ForEach) {
      this.drawWithForEach(ctx, this.cards, dt);
    } else if (this.drawMethod === DrawMethod.For) {
      this.drawWithFor(ctx, this.cards, dt);
    }
    
    this.drawFps(ctx, dt);
  }

  private drawFps(ctx: CanvasRenderingContext2D, dt: number) {
    this.frames++;
    this.frameTime += dt;
    if (this.frameTime >= 1) {
      this.frameTime = this.frameTime % 1;
      this.fps = this.frames.toString();
      this.frames = 0;
    }
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    ctx.fillText(this.fps, 0, 0);
  }

  private drawWithMap(ctx: CanvasRenderingContext2D, cards: Card[], dt: number) {
    this.cards.map(c => {
      this.updateCard(c, dt);
      ctx.drawImage(c.canvas, c.x, c.y);
    })
  }
  private drawWithForEach(ctx: CanvasRenderingContext2D, cards: Card[], dt: number) {
    this.cards.forEach(c => {
      this.updateCard(c, dt);
      ctx.drawImage(c.canvas, c.x, c.y);
    })
  }
  private drawWithFor(ctx: CanvasRenderingContext2D, cards: Card[], dt: number) {
    for (let i = 0, n = cards.length; i < n; i++) {
      const c = cards[i];
      this.updateCard(c, dt);
      ctx.drawImage(c.canvas, c.x, c.y);
    }
  }
  
  private updateCard(card: Card, dt: number) {
    card.x += card.hSpeed * dt;
    card.y += card.vSpeed * dt;
    if (card.x < 0 && card.hSpeed < 0) card.hSpeed = -card.hSpeed;
    else if (card.x > WIDTH - card.width && card.hSpeed > 0) card.hSpeed = -card.hSpeed;
    if (card.y < 0 && card.vSpeed < 0) card.vSpeed = -card.vSpeed;
    else if (card.y > HEIGHT - card.height && card.vSpeed > 0) card.vSpeed = -card.vSpeed;
  }
}

class Card {
  public canvas: HTMLCanvasElement;
  public x: number;
  public y: number;
  public hSpeed: number;
  public vSpeed: number;
  // public angle: number; // 0 - 360
  public scale = 1;

  private ctx: CanvasRenderingContext2D;

  public constructor(src: HTMLImageElement, public width: number, public height: number) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.drawImage(src, 0, 0, width, height);
  }
}

function prepareCards(src: HTMLImageElement, num: number): Card[] {
  const ret = [];
  for (let i = 0; i < num; i++) {
    const scale = Math.random() + 0.5;
    const width = Math.round(src.width * scale);
    const height = Math.round(src.height * scale);
    const card = new Card(src, width, height);
    card.x = Math.random() * (WIDTH - width);
    card.y = Math.random() * (HEIGHT - height);
    // card.angle = Math.random() * 360;
    // card.speed = Math.random() * 5 + 1;
    card.hSpeed = Math.random() * 500 - 250;
    card.vSpeed = Math.random() * 500 - 250;
    ret[i] = card;
  }
  return ret;
}
