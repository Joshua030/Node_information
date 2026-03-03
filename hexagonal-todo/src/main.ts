import { createApp } from "@presentation/app";
import { configureDependencies } from "config/container";

// Step 1: Wire up the DI container
configureDependencies();

// Step 2: Create Express app (routes are already mounted)

// Step 2: Create Express app (routes are already mounted)
const app = createApp();

export { app };
