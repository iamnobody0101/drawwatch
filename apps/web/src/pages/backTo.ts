// Where the Back link goes. The Results page sends its own address in the router state.
export function parseBackTo(state: unknown): string {
  if (typeof state === "object" && state !== null && "backTo" in state) {
    const { backTo } = state;
    if (typeof backTo === "string" && backTo.startsWith("/") && !backTo.startsWith("//")) {
      return backTo;
    }
  }
  return "/";
}
