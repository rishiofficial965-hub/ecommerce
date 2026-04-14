const Loader = () => {
  return (
    <main className="min-h-screen w-full bg-desert-khaki flex flex-col items-center justify-center gap-4">
      {/* Rotating logo diamond — now with a drop-and-spin sequence */}
      <div className="w-14 h-14 rounded-full bg-copper-green flex items-center justify-center shadow-[0_8px_24px_rgba(63,78,60,0.25)] animate-drop-bounce">
        <div 
          className="w-7 h-7 bg-albescent-white rounded-sm animate-soft-rotate" 
          style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
        />
      </div>
    </main>
  );
};

export default Loader;
