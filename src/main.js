import "./styles/main.css";

import { Alpine } from "alpinejs";
import { persist } from "@alpinejs/persist";
import { Application } from "@splinetool/runtime";

window.Alpine = Alpine;

Alpine.plugin(persist);

document.addEventListener("alpine:init", () => {});

Alpine.start();

const canvas = document.getElementById("canvas3d");
const app = new Application(canvas);
app.load("https://prod.spline.design/hVsrYOWgXz-v8CVc/scene.splinecode");
