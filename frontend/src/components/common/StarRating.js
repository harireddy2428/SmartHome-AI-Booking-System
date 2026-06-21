import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating, size = 14 }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <FaStar key={s} size={size} color={s <= rating ? '#f59e0b' : '#334155'} />
      ))}
    </span>
  );
}
