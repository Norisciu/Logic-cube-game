export function CubeFaceUpdate({ side, children }) {
  return <div className={`cube__face cube__face--${side}`}>{children}</div>;
}
