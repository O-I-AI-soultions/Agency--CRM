import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Most components under test call `useRouter()` from `next/navigation` (e.g.
// StatusActionButtons calls `router.refresh()`). Provide a lightweight mock
// so component tests don't need an AppRouterContext provider.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// jsdom does not implement the Pointer Events capture API used by
// LeadCard's drag-and-drop handlers, nor `document.elementFromPoint`.
// Provide no-op/overridable stubs so pointer-event-driven tests don't throw.
// Cast to a plain record so TS doesn't complain about properties that are
// missing from the DOM lib's HTMLElement/Document types.
const elementProto = HTMLElement.prototype as unknown as Record<string, unknown>;
if (!("setPointerCapture" in elementProto)) {
  elementProto.setPointerCapture = vi.fn();
}
if (!("releasePointerCapture" in elementProto)) {
  elementProto.releasePointerCapture = vi.fn();
}
if (!("hasPointerCapture" in elementProto)) {
  elementProto.hasPointerCapture = vi.fn(() => false);
}

const documentRecord = document as unknown as Record<string, unknown>;
if (!("elementFromPoint" in documentRecord)) {
  documentRecord.elementFromPoint = vi.fn(() => null);
}
