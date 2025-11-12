export default function ProgressStats({ progress, completedViews, viewsCount, isRunning, activeProxies }) {
  return (
    <div className="p-8 border-b-2 border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <i className="ri-dashboard-line mr-2 text-yellow-400"></i>
          Progress Overview
        </h3>
        <span className="text-sm text-gray-400">
          {completedViews} / {viewsCount} views
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-4 mb-2">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
          <div className="text-2xl font-bold text-green-400">{completedViews}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{viewsCount - completedViews}</div>
          <div className="text-sm text-gray-400">Remaining</div>
        </div>
        <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
          <div className="text-2xl font-bold text-purple-400">{Math.round(progress)}%</div>
          <div className="text-sm text-gray-400">Progress</div>
        </div>
        <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
          <div className="text-2xl font-bold text-yellow-400">
            {isRunning ? 'Running' : 'Stopped'}
          </div>
          <div className="text-sm text-gray-400">Status</div>
        </div>
        <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
          <div className="text-2xl font-bold text-cyan-400">{activeProxies}</div>
          <div className="text-sm text-gray-400">Active Proxies</div>
        </div>
      </div>
    </div>
  );
                 }
