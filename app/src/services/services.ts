import app from "./app/app";

export class services {
  app: app;

  constructor() {
    this.app = new app();
  }
}