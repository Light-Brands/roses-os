import Link from 'next/link';

export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Subtle back-to-site link so users aren't trapped in the funnel */}
      <div className="fixed top-5 left-5 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white/90 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          International Aura and Dream School
        </Link>
      </div>
      {children}
    </>
  );
}
