import type { WidgetEntity } from "../../../shared/types";
import { makeEntityHook } from "./makeEntityHook";

export const useWidgets = makeEntityHook<WidgetEntity>("/api/widgets");

