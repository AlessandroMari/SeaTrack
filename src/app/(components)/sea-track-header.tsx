import { Anchor } from 'lucide-react';
import Link from 'next/link';

export default function SeaTrackHeader() {
  return (
    <header className="mb-8 text-center">
      <Link href="/" className="inline-flex items-center gap-2 group">
        <div className="p-3 bg-primary rounded-full group-hover:bg-primary/90 transition-colors">
          <Anchor className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-primary group-hover:text-primary/90 transition-colors">
          SeaTrack
        </h1>
      </Link>
    </header>
  );
}
