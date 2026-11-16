/** Remounts on every navigation, giving each page a short fade so moving around the site doesn't feel abrupt. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
