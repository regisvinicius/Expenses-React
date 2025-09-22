import type { ApiRoutes } from "../../../api/app";
import { hc } from "hono/client";

export const client = hc<ApiRoutes>("http://localhost:3000");

export const api = client.api;
