import { useEffect } from "react";

export function useUnmountCleanup(fun) {
  useEffect(() => () => fun(), []);
}
