export default function Skeleton({
  width = "100%",
  height = 14,
  radius = 8,
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, var(--skeleton) 25%, var(--well) 37%, var(--skeleton) 63%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.3s linear infinite",
        ...style,
      }}
    />
  );
}
