import CalendarWidget from "@/components/CalendarWidget";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-zinc-100">
      <div className="w-full max-w-7xl">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Interactive Calendar
          </h1>
          <p className="mt-2 text-lg leading-8 text-zinc-600">
            Select a date range to add persistent notes. Built with React, Next.js, and Framer Motion.
          </p>
        </div>
        
        {/* Our built component */}
        <CalendarWidget />
        
      </div>
    </main>
  );
}