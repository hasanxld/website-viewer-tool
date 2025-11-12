export default function ControlPanel({ 
  url, 
  setUrl, 
  viewsCount, 
  setViewsCount, 
  isRunning, 
  error, 
  onStart, 
  onStop, 
  onReset 
}) {
  return (
    <div className="p-8 border-b-2 border-gray-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL Input */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
            <i className="ri-global-line mr-2 text-blue-400"></i>
            Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            disabled={isRunning}
          />
        </div>

        {/* Views Count */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
            <i className="ri-eye-line mr-2 text-green-400"></i>
            Views Count (Max: 5000)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={viewsCount}
              onChange={(e) => setViewsCount(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={isRunning}
            />
            <input
              type="number"
              value={viewsCount}
              onChange={(e) => {
                const value = Math.min(5000, Math.max(10, parseInt(e.target.value) || 100));
                setViewsCount(value);
              }}
              className="w-20 px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white text-center font-bold"
              disabled={isRunning}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900 border-2 border-red-700 text-red-200 flex items-center">
          <i className="ri-error-warning-line mr-2"></i>
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={isRunning ? onStop : onStart}
          disabled={!url.trim() && !isRunning}
          className={`flex-1 py-4 px-8 font-bold text-lg flex items-center justify-center transition-all ${
            isRunning 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <i className={`ri-${isRunning ? 'stop-line' : 'play-line'} mr-3`}></i>
          {isRunning ? 'Stop Viewing' : 'Start Viewing'}
        </button>
        
        <button
          onClick={onReset}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 font-bold flex items-center justify-center transition-colors"
        >
          <i className="ri-restart-line mr-3"></i>
          Reset
        </button>
      </div>
    </div>
  );
}
