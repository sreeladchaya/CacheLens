import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = "http://localhost:8080/api/cache";

function App() {
  const [stats, setStats] = useState({
    size: 0,
    capacity: 10,
    hits: 0,
    misses: 0,
    hitRate: 0,
    evictions: 0,
    policy: "LRU",
  });

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState(30000);

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const loadStats = async () => {
    try {
      const response = await fetch(`${API}/stats`);
      const data = await response.json();

      setStats(data);

      setHistory((old) => [
        ...old.slice(-9),
        {
          time: new Date().toLocaleTimeString(),
          hitRate: Number(data.hitRate.toFixed(1)),
          hits: data.hits,
          misses: data.misses,
        },
      ]);
    } catch (error) {
      console.error("Backend connection error:", error);
    }
  };

  useEffect(() => {
    loadStats();

    const interval = setInterval(loadStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const putCache = async () => {
    if (!key || !value) {
      setResult({
        status: "ERROR",
        message: "Enter both key and value",
      });
      return;
    }

    try {
      const response = await fetch(`${API}/${encodeURIComponent(key)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value,
          ttl: Number(ttl),
        }),
      });

      const data = await response.json();

      setResult(data);
      await loadStats();
    } catch (error) {
      setResult({
        status: "ERROR",
        message: "Backend is not connected",
      });
    }
  };

  const getCache = async () => {
    if (!key) {
      setResult({
        status: "ERROR",
        message: "Enter a key",
      });
      return;
    }

    try {
      const response = await fetch(`${API}/${encodeURIComponent(key)}`);
      const data = await response.json();

      setResult(data);
      await loadStats();
    } catch (error) {
      setResult({
        status: "ERROR",
        message: "Backend is not connected",
      });
    }
  };

  const changePolicy = async (newPolicy) => {
    try {
      await fetch(`${API}/policy?value=${newPolicy}`, {
        method: "POST",
      });

      await loadStats();
    } catch (error) {
      console.error(error);
    }
  };

  const clearCache = async () => {
    try {
      await fetch(`${API}/clear`, {
        method: "DELETE",
      });

      setResult({
        status: "CLEARED",
      });

      await loadStats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logoIcon">⚡</div>

          <div>
            <h1>CacheLens</h1>
            <span>Cache Intelligence</span>
          </div>
        </div>

        <nav>
          <div className="navItem active">
            <span>▣</span>
            Dashboard
          </div>

          <div className="navItem">
            <span>◉</span>
            Cache Playground
          </div>

          <div className="navItem">
            <span>◈</span>
            Analytics
          </div>
        </nav>

        <div className="sidebarBottom">
          <div className="statusDot"></div>
          Backend Connected
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <header className="header">
          <div>
            <p className="eyebrow">REAL-TIME CACHE MONITOR</p>
            <h2>Cache Dashboard</h2>
            <p className="subtitle">
              Monitor performance, eviction behavior and cache efficiency.
            </p>
          </div>

          <div className="headerRight">
            <span className="live">
              <span className="liveDot"></span>
              LIVE
            </span>

            <button className="clearButton" onClick={clearCache}>
              Clear Cache
            </button>
          </div>
        </header>

        {/* STATS */}
        <section className="statsGrid">

          <div className="statCard">
            <div className="statTop">
              <span>Cache Size</span>
              <span className="statIcon">▣</span>
            </div>

            <strong>
              {stats.size}
              <small> / {stats.capacity}</small>
            </strong>

            <div className="progress">
              <div
                style={{
                  width: `${Math.min(
                    (stats.size / stats.capacity) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="statCard">
            <div className="statTop">
              <span>Hit Rate</span>
              <span className="statIcon">↗</span>
            </div>

            <strong>{stats.hitRate.toFixed(1)}%</strong>

            <p className="statDescription">
              {stats.hits} successful requests
            </p>
          </div>

          <div className="statCard">
            <div className="statTop">
              <span>Cache Hits</span>
              <span className="statIcon">✓</span>
            </div>

            <strong>{stats.hits}</strong>

            <p className="statDescription">
              Successful GET operations
            </p>
          </div>

          <div className="statCard">
            <div className="statTop">
              <span>Evictions</span>
              <span className="statIcon">↘</span>
            </div>

            <strong>{stats.evictions}</strong>

            <p className="statDescription">
              Items removed from cache
            </p>
          </div>

        </section>

        {/* CONTENT GRID */}
        <section className="contentGrid">

          {/* PLAYGROUND */}
          <div className="panel playground">

            <div className="panelHeader">
              <div>
                <p className="eyebrow">INTERACTIVE</p>
                <h3>Cache Playground</h3>
              </div>

              <div className="policy">
                <span>Policy</span>

                <select
                  value={stats.policy}
                  onChange={(e) => changePolicy(e.target.value)}
                >
                  <option value="LRU">LRU</option>
                  <option value="LFU">LFU</option>
                </select>
              </div>
            </div>

            <div className="form">

              <label>Cache Key</label>

              <input
                type="text"
                placeholder="e.g. user_101"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />

              <label>Value</label>

              <input
                type="text"
                placeholder="e.g. Sree"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              <label>TTL (milliseconds)</label>

              <input
                type="number"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
              />

              <div className="buttonRow">

                <button className="putButton" onClick={putCache}>
                  PUT
                </button>

                <button className="getButton" onClick={getCache}>
                  GET
                </button>

              </div>

            </div>

            {result && (
              <div
                className={`result ${
                  result.status === "HIT"
                    ? "success"
                    : result.status === "MISS"
                    ? "miss"
                    : ""
                }`}
              >
                <div className="resultTitle">
                  {result.status}
                </div>

                <pre>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

          </div>

          {/* CHART */}
          <div className="panel chartPanel">

            <div className="panelHeader">
              <div>
                <p className="eyebrow">PERFORMANCE</p>
                <h3>Hit Rate</h3>
              </div>

              <span className="policyBadge">
                {stats.policy}
              </span>
            </div>

            <div className="chart">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="hitRate"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="emptyChart">
                  Waiting for cache activity...
                </div>
              )}
            </div>

            <div className="chartFooter">

              <div>
                <span className="legendDot"></span>
                Hit Rate
              </div>

              <div>
                Misses: <strong>{stats.misses}</strong>
              </div>

            </div>

          </div>

        </section>

        {/* EXPLAINABLE SECTION */}
        <section className="explainPanel">

          <div>
            <p className="eyebrow">CACHE INTELLIGENCE</p>

            <h3>Explainable Cache Behavior</h3>

            <p>
              CacheLens doesn't just show numbers. It helps explain
              how your cache behaves and why items are being removed.
            </p>
          </div>

          <div className="insightGrid">

            <div className="insight">
              <span>⚡</span>
              <div>
                <strong>Current Policy</strong>
                <p>{stats.policy}</p>
              </div>
            </div>

            <div className="insight">
              <span>🎯</span>
              <div>
                <strong>Hit Rate</strong>
                <p>{stats.hitRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="insight">
              <span>📦</span>
              <div>
                <strong>Capacity Usage</strong>
                <p>
                  {stats.size} / {stats.capacity}
                </p>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default App;