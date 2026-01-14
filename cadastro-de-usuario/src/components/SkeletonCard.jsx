import "./SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-content">
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line medium"></div>
      </div>
      <div className="skeleton-icon"></div>
    </div>
  );
}

export default SkeletonCard;
