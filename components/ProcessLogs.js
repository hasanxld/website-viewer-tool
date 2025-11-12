export default function ProcessLogs({ logs }) {
  return (
    <div className="p-8">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <i className="ri-terminal-line mr-2 text-purple-400"></i>
        Process Logs
      </h3>
      <div className="bg-gray-900 border-2 border-gray-700 h-64 overflow-y-auto p-4 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <i className="ri-information-line text-2xl mb-2 block"></i>
            Logs will appear here when process starts
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id}
              className={`py-2 border-b border-gray-800 last:border-b-0 ${
                log.type === 'success' ? 'text-green-400' :
                log.type === 'warning' ? 'text-yellow-400' :
                log.type === 'error' ? 'text-red-400' :
                'text-gray-300'
              }`}
            >
              <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
