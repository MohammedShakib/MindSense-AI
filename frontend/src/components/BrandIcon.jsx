import brandIcon from '../assets/brand-icon.png';
import { cn } from '../lib/utils';

export default function BrandIcon({ className, imageClassName }) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl',
        className
      )}
      aria-hidden="true"
    >
      <img
        src={brandIcon}
        alt=""
        className={cn(
          'h-full w-full object-cover',
          imageClassName
        )}
      />
    </span>
  );
}
