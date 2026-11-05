import "../nemi.css";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="nemi-me-page">{children}</div>;
}
