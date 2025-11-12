'use client'
import { useState, useRef, useCallback } from 'react'
import ControlPanel from '../components/ControlPanel'
import ProgressStats from '../components/ProgressStats'
import ProcessLogs from '../components/ProcessLogs'
import { validateUrl, delay } from '../lib/utils'

export default function WebsiteViewer() {
  const [url, setUrl] = useState('')
  const [viewsCount, setViewsCount] = useState(100)
  const [isRunning, setIsRunning] = useState(false)
  const [completedViews, setCompletedViews] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [logs, setLogs] = useState([])
  const [activeProxies, setActiveProxies] = useState(0)
  
  const abortControllerRef = useRef(null)

  const addLog = useCallback((message, type = 'info') => {
    setLogs(prev => [...prev.slice(-99), {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }])
  }, [])

  const sendViewRequest = useCallback(async (targetUrl, attempt = 1) => {
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
        signal: abortControllerRef.current?.signal
      })

      const data = await response.json()

      if (data.success) {
        addLog(`View #${completedViews + 1}: Success (${data.status}) - ${data.responseTime}ms - Proxy: ${data.proxy.ip}`, 'success')
        return true
      } else {
        addLog(`View #${completedViews + 1}: Failed - ${data.error}`, 'error')
        return false
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error
      }
      
      if (attempt < 3) {
        addLog(`View #${completedViews + 1}: Retry attempt ${attempt}`, 'warning')
        await delay(1000)
        return sendViewRequest(targetUrl, attempt + 1)
      } else {
        addLog(`View #${completedViews + 1}: Failed after ${attempt} attempts`, 'error')
        return false
      }
    }
  }, [completedViews, addLog])

  const startViewing = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please include http:// or https:// in the URL')
      return
    }

    setError('')
    setIsRunning(true)
    setCompletedViews(0)
    setProgress(0)
    setLogs([])
    setActiveProxies(5) // Simulate active proxies

    abortControllerRef.current = new AbortController()

    addLog('Starting view process with proxy support...', 'success')
    addLog(`Target: ${viewsCount} views`, 'info')
    addLog('Proxy rotation enabled', 'info')

    let currentCompleted = 0
    const concurrentWorkers = 5
    const delayBetweenBatches = 200

    try {
      while (currentCompleted < viewsCount && isRunning) {
        const remaining = viewsCount - currentCompleted
        const currentBatch = Math.min(concurrentWorkers, remaining)

        // Update active proxies count
        setActiveProxies(currentBatch)

        const batchPromises = Array.from({ length: currentBatch }, async (_, index) => {
          if (currentCompleted + index < viewsCount) {
            const success = await sendViewRequest(url)
            if (success) {
              setCompletedViews(prev => {
                const newCount = prev + 1
                setProgress((newCount / viewsCount) * 100)
                return newCount
              })
            }
          }
        })

        await Promise.allSettled(batchPromises)
        currentCompleted = completedViews

        if (currentCompleted % 20 === 0) {
          addLog(`Progress: ${currentCompleted}/${viewsCount} views completed`, 'info')
        }

        if (currentCompleted < viewsCount) {
          await delay(delayBetweenBatches)
        }
      }

      if (currentCompleted >= viewsCount) {
        addLog('All views completed successfully!', 'success')
        setActiveProxies(0)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        addLog(`Process error: ${error.message}`, 'error')
      }
    } finally {
      setIsRunning(false)
      setActiveProxies(0)
    }
  }, [url, viewsCount, isRunning, completedViews, sendViewRequest, addLog])

  const stopViewing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsRunning(false)
    setActiveProxies(0)
    addLog('Viewing process stopped by user', 'warning')
  }, [addLog])

  const resetProcess = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsRunning(false)
    setCompletedViews(0)
    setProgress(0)
    setActiveProxies(0)
    setLogs([])
    addLog('Process reset', 'info')
  }, [addLog])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Advanced Website Viewer
          </h1>
          <p className="text-xl text-gray-300">Proxy-powered super fast website views</p>
        </div>

        {/* Main Card */}
        <div className="max-w-6xl mx-auto bg-gray-800 border-2 border-gray-700 shadow-2xl">
          <ControlPanel
            url={url}
            setUrl={setUrl}
            viewsCount={viewsCount}
            setViewsCount={setViewsCount}
            isRunning={isRunning}
            error={error}
            onStart={startViewing}
            onStop={stopViewing}
            onReset={resetProcess}
          />

          <ProgressStats
            progress={progress}
            completedViews={completedViews}
            viewsCount={viewsCount}
            isRunning={isRunning}
            activeProxies={activeProxies}
          />

          <ProcessLogs logs={logs} />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-gray-800 border-2 border-gray-700">
            <i className="ri-shield-keyhole-line text-3xl text-blue-400 mb-4"></i>
            <h3 className="font-bold text-lg mb-2">Proxy Support</h3>
            <p className="text-gray-400">Rotating proxies for each request</p>
          </div>
          <div className="text-center p-6 bg-gray-800 border-2 border-gray-700">
            <i className="ri-zap-line text-3xl text-yellow-400 mb-4"></i>
            <h3 className="font-bold text-lg mb-2">Super Fast</h3>
            <p className="text-gray-400">Concurrent processing</p>
          </div>
          <div className="text-center p-6 bg-gray-800 border-2 border-gray-700">
            <i className="ri-infinity-line text-3xl text-green-400 mb-4"></i>
            <h3 className="font-bold text-lg mb-2">Unlimited Views</h3>
            <p className="text-gray-400">Up to 5000 views per session</p>
          </div>
          <div className="text-center p-6 bg-gray-800 border-2 border-gray-700">
            <i className="ri-global-line text-3xl text-purple-400 mb-4"></i>
            <h3 className="font-bold text-lg mb-2">Real Views</h3>
            <p className="text-gray-400">Simulates real user traffic</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
