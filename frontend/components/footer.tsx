'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 px-4 border-t border-gray-200 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-adaptive-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <span>WorkMatch Argentina</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© {currentYear} WorkMatch</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">San Luis, Argentina</span>
            <span>•</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
