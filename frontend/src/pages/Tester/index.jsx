import { useState, useEffect, useRef } from "react";

const API = "http://localhost:5001/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0c0c10; --bg2: #12121a; --bg3: #1a1a24; --bg4: #22222e;
    --border: rgba(255,255,255,0.06); --borderH: rgba(255,255,255,0.12);
    --text: #e8e8f0; --text2: #8888a0; --text3: #44445a;
    --green: #00d084; --greenG: rgba(0,208,132,0.12);
    --red: #ff4d6a; --redG: rgba(255,77,106,0.12);
    --yellow: #ffd060; --yellowG: rgba(255,208,96,0.12);
    --blue: #60aaff; --blueG: rgba(96,170,255,0.12);
    --purple: #a78bfa; --purpleG: rgba(167,139,250,0.12);
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Inter', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--sans); -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 4px; }
  button { font-family: var(--sans); cursor: pointer; border: none; outline: none; background: none; }
  input, textarea { font-family: var(--mono); outline: none; border: none; background: none; color: var(--text); }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

  .layout { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 260px; flex-shrink: 0; background: var(--bg2);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    overflow: hidden;
  }
  .sidebar-header {
    padding: 20px 16px 16px; border-bottom: 1px solid var(--border);
  }
  .logo { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .logo-mark {
    width: 28px; height: 28px; border-radius: 7px;
    background: linear-gradient(135deg, #00d084, #00b8d9);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .logo-text { font-family: var(--mono); font-weight: 700; font-size: 14px; letter-spacing: -0.3px; }
  .logo-badge {
    margin-left: auto; font-size: 10px; padding: 2px 8px; border-radius: 20px;
    background: var(--greenG); color: var(--green); border: 1px solid rgba(0,208,132,0.2);
    font-family: var(--mono); font-weight: 600;
  }
  .status-bar {
    display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text2);
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  .status-dot.dead { background: var(--red); animation: none; }

  .sidebar-scroll { flex: 1; overflow-y: auto; padding: 8px; }
  .section-label {
    font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 1px;
    text-transform: uppercase; padding: 12px 8px 6px;
  }
  .test-btn {
    width: 100%; display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 7px; font-size: 12px;
    color: var(--text2); transition: all 0.15s; text-align: left;
    margin-bottom: 2px; cursor: pointer;
  }
  .test-btn:hover { background: var(--bg3); color: var(--text); }
  .test-btn.active { background: var(--bg3); color: var(--text); }
  .test-btn.running { background: var(--blueG); color: var(--blue); }
  .test-btn.pass { background: var(--greenG); color: var(--green); }
  .test-btn.fail { background: var(--redG); color: var(--red); }
  .method-tag {
    font-family: var(--mono); font-size: 9px; font-weight: 700;
    padding: 2px 5px; border-radius: 4px; flex-shrink: 0; min-width: 36px; text-align: center;
  }
  .GET { background: rgba(96,170,255,0.15); color: var(--blue); }
  .POST { background: rgba(0,208,132,0.15); color: var(--green); }
  .PATCH { background: rgba(255,208,96,0.15); color: var(--yellow); }
  .DELETE { background: rgba(255,77,106,0.15); color: var(--red); }
  .test-name { flex: 1; font-size: 11px; }
  .test-status-icon { font-size: 11px; margin-left: auto; }

  .run-all-btn {
    margin: 8px; padding: 10px; border-radius: 8px;
    background: linear-gradient(135deg, #00d084, #00b8d9);
    color: #000; font-size: 12px; font-weight: 700; text-align: center;
    cursor: pointer; transition: opacity 0.2s; font-family: var(--sans);
  }
  .run-all-btn:hover { opacity: 0.85; }
  .run-all-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    padding: 16px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px; background: var(--bg2);
    flex-shrink: 0;
  }
  .topbar-title { font-family: var(--mono); font-size: 13px; font-weight: 600; flex: 1; }
  .topbar-url { font-size: 11px; color: var(--text2); font-family: var(--mono); }

  .summary-bar {
    display: flex; gap: 16px; padding: 10px 24px;
    border-bottom: 1px solid var(--border); background: var(--bg2); flex-shrink: 0;
  }
  .summary-item { display: flex; align-items: center; gap: 6px; font-size: 12px; }
  .summary-num { font-family: var(--mono); font-weight: 700; font-size: 14px; }
  .summary-num.green { color: var(--green); }
  .summary-num.red { color: var(--red); }
  .summary-num.yellow { color: var(--yellow); }
  .summary-num.blue { color: var(--blue); }

  .content { flex: 1; overflow-y: auto; padding: 24px; }

  /* RESULT CARD */
  .result-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 12px; margin-bottom: 12px; overflow: hidden;
    animation: fadeIn 0.25s ease both;
  }
  .result-header {
    display: flex; align-items: center; gap: 10px; padding: 14px 16px;
    cursor: pointer; transition: background 0.15s;
  }
  .result-header:hover { background: var(--bg3); }
  .result-title { font-size: 13px; font-weight: 500; flex: 1; }
  .result-meta { display: flex; align-items: center; gap: 8px; }
  .status-code {
    font-family: var(--mono); font-size: 12px; font-weight: 700;
    padding: 2px 8px; border-radius: 5px;
  }
  .status-2xx { background: var(--greenG); color: var(--green); border: 1px solid rgba(0,208,132,0.2); }
  .status-4xx { background: var(--redG); color: var(--red); border: 1px solid rgba(255,77,106,0.2); }
  .status-5xx { background: var(--redG); color: var(--red); border: 1px solid rgba(255,77,106,0.2); }
  .status-err { background: var(--yellowG); color: var(--yellow); border: 1px solid rgba(255,208,96,0.2); }
  .duration-tag { font-family: var(--mono); font-size: 11px; color: var(--text2); }
  .pass-icon { font-size: 14px; }

  .result-body { border-top: 1px solid var(--border); }
  .result-tabs { display: flex; border-bottom: 1px solid var(--border); }
  .result-tab {
    padding: 8px 16px; font-size: 11px; font-weight: 500; color: var(--text2);
    border-bottom: 2px solid transparent; transition: all 0.15s; cursor: pointer;
  }
  .result-tab.active { color: var(--text); border-bottom-color: var(--purple); }
  .code-block {
    padding: 16px; font-family: var(--mono); font-size: 11px; line-height: 1.7;
    color: var(--text2); white-space: pre-wrap; word-break: break-all;
    max-height: 300px; overflow-y: auto; background: var(--bg);
  }
  .code-block .key { color: var(--purple); }
  .code-block .str { color: var(--green); }
  .code-block .num { color: var(--yellow); }
  .code-block .bool { color: var(--blue); }
  .code-block .null { color: var(--red); }

  /* ASSERTIONS */
  .assertions { padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; }
  .assertion {
    display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 6px 10px;
    border-radius: 6px; background: var(--bg3);
  }
  .assertion.pass { border-left: 3px solid var(--green); }
  .assertion.fail { border-left: 3px solid var(--red); }
  .assertion-icon { font-size: 12px; }
  .assertion-text { color: var(--text2); flex: 1; font-family: var(--mono); font-size: 11px; }

  /* RUNNING STATE */
  .spinner { width: 14px; height: 14px; border: 2px solid var(--border); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.6s linear infinite; flex-shrink: 0; }

  /* EMPTY STATE */
  .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text3); gap: 12px; }
  .empty-icon { font-size: 48px; opacity: 0.3; }
  .empty-title { font-family: var(--mono); font-size: 16px; font-weight: 600; color: var(--text2); }
  .empty-sub { font-size: 13px; }

  /* TOKEN DISPLAY */
  .token-banner {
    margin-bottom: 16px; padding: 12px 16px; border-radius: 10px;
    background: var(--purpleG); border: 1px solid rgba(167,139,250,0.2);
    font-family: var(--mono); font-size: 11px; color: var(--purple);
    word-break: break-all; line-height: 1.6;
    animation: slideIn 0.2s ease;
  }
  .token-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; margin-bottom: 4px; }

  /* PROGRESS BAR */
  .progress-bar { height: 2px; background: var(--bg3); flex-shrink: 0; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--green), var(--blue)); transition: width 0.3s; }
`;

// ─── JSON Syntax Highlighter ──────────────────────────────────────────────────
function highlight(json) {
  if (typeof json !== "string") json = JSON.stringify(json, null, 2);
  return json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = "num";
      if (/^"/.test(match)) cls = /:$/.test(match) ? "key" : "str";
      else if (/true|false/.test(match)) cls = "bool";
      else if (/null/.test(match)) cls = "null";
      return `<span class="${cls}">${match}</span>`;
    });
}

// ─── API CALL HELPER ──────────────────────────────────────────────────────────
async function apiCall(method, path, body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const start = Date.now();
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const duration = Date.now() - start;
    let data;
    try { data = await res.json(); } catch { data = { raw: await res.text() }; }
    return { ok: res.status < 300, status: res.status, data, duration };
  } catch (err) {
    return { ok: false, status: 0, data: { error: err.message }, duration: Date.now() - start };
  }
}

// ─── TEST DEFINITIONS ─────────────────────────────────────────────────────────
function buildTests(state) {
  const ts = Date.now();
  const user = { email: `tester_${ts}@pulse.dev`, password: "Test1234!", username: `tester${ts}`, displayName: "Test User" };
  const user2 = { email: `tester2_${ts}@pulse.dev`, password: "Test1234!", username: `tester2${ts}`, displayName: "Test User 2" };

  return [
    // ── Health ──
    {
      id: "health", group: "Health", name: "Health check", method: "GET", path: "/health".replace("/api",""),
      run: async () => {
        const r = await fetch(`http://localhost:5001/health`);
        const d = await r.json();
        return { ok: r.ok, status: r.status, data: d, duration: 0 };
      },
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: 'has "status" field', pass: !!r.data?.status },
      ],
    },

    // ── Auth ──
    {
      id: "register", group: "Auth", name: "Register user", method: "POST", path: "/auth/register",
      run: async (s) => {
        const r = await apiCall("POST", "/auth/register", { ...user });
        if (r.ok) { s.accessToken = r.data?.data?.accessToken; s.refreshToken = r.data?.data?.refreshToken; s.userId = r.data?.data?.user?.id; s.username = user.username; }
        return r;
      },
      assert: (r) => [
        { label: "status 201", pass: r.status === 201 },
        { label: "success: true", pass: r.data?.success === true },
        { label: "has accessToken", pass: !!r.data?.data?.accessToken },
        { label: "has refreshToken", pass: !!r.data?.data?.refreshToken },
        { label: "has user object", pass: !!r.data?.data?.user },
      ],
    },
    {
      id: "register2", group: "Auth", name: "Register user 2", method: "POST", path: "/auth/register",
      run: async (s) => {
        const r = await apiCall("POST", "/auth/register", { ...user2 });
        if (r.ok) { s.username2 = user2.username; }
        return r;
      },
      assert: (r) => [
        { label: "status 201", pass: r.status === 201 },
        { label: "has accessToken", pass: !!r.data?.data?.accessToken },
      ],
    },
    {
      id: "login", group: "Auth", name: "Login", method: "POST", path: "/auth/login",
      run: async (s) => {
        const r = await apiCall("POST", "/auth/login", { email: user.email, password: user.password });
        if (r.ok) { s.accessToken = r.data?.data?.accessToken; s.refreshToken = r.data?.data?.refreshToken; }
        return r;
      },
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "has accessToken", pass: !!r.data?.data?.accessToken },
        { label: "has user.email", pass: !!r.data?.data?.user?.email },
      ],
    },
    {
      id: "login-bad", group: "Auth", name: "Login wrong password (expect 401)", method: "POST", path: "/auth/login",
      run: async () => apiCall("POST", "/auth/login", { email: user.email, password: "wrongpass" }),
      assert: (r) => [
        { label: "status 401", pass: r.status === 401 },
        { label: "success: false", pass: r.data?.success === false },
      ],
    },
    {
      id: "me", group: "Auth", name: "Get /me", method: "GET", path: "/auth/me",
      run: async (s) => apiCall("GET", "/auth/me", null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "has user id", pass: !!r.data?.data?.id },
      ],
    },
    {
      id: "refresh", group: "Auth", name: "Refresh token", method: "POST", path: "/auth/refresh",
      run: async (s) => {
        const r = await apiCall("POST", "/auth/refresh", { refreshToken: s.refreshToken });
        if (r.ok) s.accessToken = r.data?.data?.accessToken;
        return r;
      },
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "new accessToken", pass: !!r.data?.data?.accessToken },
      ],
    },

    // ── Posts ──
    {
      id: "create-post", group: "Posts", name: "Create post", method: "POST", path: "/posts",
      run: async (s) => {
        const r = await apiCall("POST", "/posts", { content: "Hello from the Pulse API tester! 🚀" }, s.accessToken);
        if (r.ok) s.postId = r.data?.data?.id;
        return r;
      },
      assert: (r) => [
        { label: "status 201", pass: r.status === 201 },
        { label: "has post id", pass: !!r.data?.data?.id },
        { label: "has content", pass: !!r.data?.data?.content },
        { label: "has author", pass: !!r.data?.data?.author },
      ],
    },
    {
      id: "get-post", group: "Posts", name: "Get post by ID", method: "GET", path: "/posts/:id",
      run: async (s) => apiCall("GET", `/posts/${s.postId}`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "has likesCount", pass: r.data?.data?.likesCount !== undefined },
        { label: "has commentsCount", pass: r.data?.data?.commentsCount !== undefined },
      ],
    },
    {
      id: "update-post", group: "Posts", name: "Update post", method: "PATCH", path: "/posts/:id",
      run: async (s) => apiCall("PATCH", `/posts/${s.postId}`, { content: "Updated content ✏️" }, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "content updated", pass: r.data?.data?.content?.includes("Updated") },
      ],
    },
    {
      id: "create-post-no-auth", group: "Posts", name: "Create post (no auth, expect 401)", method: "POST", path: "/posts",
      run: async () => apiCall("POST", "/posts", { content: "Should fail" }),
      assert: (r) => [
        { label: "status 401", pass: r.status === 401 },
      ],
    },

    // ── Likes ──
    {
      id: "like-post", group: "Likes", name: "Like post", method: "POST", path: "/posts/:id/like",
      run: async (s) => apiCall("POST", `/posts/${s.postId}/like`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "success: true", pass: r.data?.success === true },
      ],
    },
    {
      id: "like-post-dupe", group: "Likes", name: "Like again (expect 409)", method: "POST", path: "/posts/:id/like",
      run: async (s) => apiCall("POST", `/posts/${s.postId}/like`, null, s.accessToken),
      assert: (r) => [
        { label: "status 409", pass: r.status === 409 },
      ],
    },
    {
      id: "unlike-post", group: "Likes", name: "Unlike post", method: "DELETE", path: "/posts/:id/like",
      run: async (s) => apiCall("DELETE", `/posts/${s.postId}/like`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
      ],
    },

    // ── Comments ──
    {
      id: "add-comment", group: "Comments", name: "Add comment", method: "POST", path: "/posts/:id/comments",
      run: async (s) => {
        const r = await apiCall("POST", `/posts/${s.postId}/comments`, { content: "Great post!" }, s.accessToken);
        if (r.ok) s.commentId = r.data?.data?.id;
        return r;
      },
      assert: (r) => [
        { label: "status 201", pass: r.status === 201 },
        { label: "has comment id", pass: !!r.data?.data?.id },
        { label: "has author", pass: !!r.data?.data?.author },
      ],
    },
    {
      id: "get-comments", group: "Comments", name: "Get comments", method: "GET", path: "/posts/:id/comments",
      run: async (s) => apiCall("GET", `/posts/${s.postId}/comments`),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "has comments array", pass: Array.isArray(r.data?.data?.comments) },
        { label: "comment count >= 1", pass: (r.data?.data?.comments?.length || 0) >= 1 },
      ],
    },
    {
      id: "delete-comment", group: "Comments", name: "Delete comment", method: "DELETE", path: "/posts/:id/comments/:cid",
      run: async (s) => apiCall("DELETE", `/posts/${s.postId}/comments/${s.commentId}`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
      ],
    },

    // ── Users ──
    {
      id: "get-profile", group: "Users", name: "Get profile", method: "GET", path: "/users/:username",
      run: async (s) => apiCall("GET", `/users/${s.username}`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "has username", pass: !!r.data?.data?.username },
        { label: "has _count", pass: !!r.data?.data?._count },
      ],
    },
    {
      id: "update-profile", group: "Users", name: "Update profile", method: "PATCH", path: "/users/me/profile",
      run: async (s) => apiCall("PATCH", "/users/me/profile", { bio: "Tested by Pulse API tester ✓" }, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "bio updated", pass: r.data?.data?.bio?.includes("Tested") },
      ],
    },
    {
      id: "search-users", group: "Users", name: "Search users", method: "GET", path: "/users/search",
      run: async (s) => apiCall("GET", `/users/search?q=tester`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "returns array", pass: Array.isArray(r.data?.data) },
      ],
    },

    // ── Follow ──
    {
      id: "follow", group: "Follow", name: "Follow user", method: "POST", path: "/users/:username/follow",
      run: async (s) => apiCall("POST", `/users/${s.username2}/follow`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "success: true", pass: r.data?.success === true },
      ],
    },
    {
      id: "get-followers", group: "Follow", name: "Get followers", method: "GET", path: "/users/:username/followers",
      run: async (s) => apiCall("GET", `/users/${s.username2}/followers`),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "returns array", pass: Array.isArray(r.data?.data) },
        { label: "has follower", pass: (r.data?.data?.length || 0) >= 1 },
      ],
    },
    {
      id: "get-following", group: "Follow", name: "Get following", method: "GET", path: "/users/:username/following",
      run: async (s) => apiCall("GET", `/users/${s.username}/following`),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "returns array", pass: Array.isArray(r.data?.data) },
      ],
    },
    {
      id: "follow-self", group: "Follow", name: "Follow self (expect 400)", method: "POST", path: "/users/:username/follow",
      run: async (s) => apiCall("POST", `/users/${s.username}/follow`, null, s.accessToken),
      assert: (r) => [
        { label: "status 400", pass: r.status === 400 },
      ],
    },
    {
      id: "unfollow", group: "Follow", name: "Unfollow user", method: "DELETE", path: "/users/:username/follow",
      run: async (s) => apiCall("DELETE", `/users/${s.username2}/follow`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
      ],
    },

    // ── Feed ──
    {
      id: "global-feed", group: "Feed", name: "Global feed", method: "GET", path: "/feed/global",
      run: async (s) => apiCall("GET", "/feed/global?page=1&limit=10", null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "has posts array", pass: Array.isArray(r.data?.data?.posts) },
        { label: "has pagination", pass: !!r.data?.data?.pagination },
      ],
    },
    {
      id: "following-feed", group: "Feed", name: "Following feed", method: "GET", path: "/feed/following",
      run: async (s) => apiCall("GET", "/feed/following?page=1&limit=10", null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
        { label: "has posts array", pass: Array.isArray(r.data?.data?.posts) },
      ],
    },

    // ── Cleanup ──
    {
      id: "delete-post", group: "Cleanup", name: "Delete post", method: "DELETE", path: "/posts/:id",
      run: async (s) => apiCall("DELETE", `/posts/${s.postId}`, null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
      ],
    },
    {
      id: "logout", group: "Cleanup", name: "Logout", method: "POST", path: "/auth/logout",
      run: async (s) => apiCall("POST", "/auth/logout", null, s.accessToken),
      assert: (r) => [
        { label: "status 200", pass: r.status === 200 },
      ],
    },
  ];
}

// ─── RESULT CARD ──────────────────────────────────────────────────────────────
function ResultCard({ test, result }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("response");

  const statusClass = !result ? "" : result.status === 0 ? "status-err" : result.status < 300 ? "status-2xx" : result.status < 500 ? "status-4xx" : "status-5xx";
  const assertions = result ? test.assert(result) : [];
  const allPass = assertions.every(a => a.pass);

  return (
    <div className="result-card">
      <div className="result-header" onClick={() => result && setOpen(o => !o)}>
        <span className={`method-tag ${test.method}`}>{test.method}</span>
        <span className="result-title">{test.name}</span>
        <div className="result-meta">
          {result ? (
            <>
              <span className={`status-code ${statusClass}`}>{result.status || "ERR"}</span>
              <span className="duration-tag">{result.duration}ms</span>
              <span className="pass-icon">{allPass ? "✅" : "❌"}</span>
            </>
          ) : (
            <span style={{ fontSize: 11, color: "var(--text3)" }}>pending</span>
          )}
        </div>
      </div>

      {open && result && (
        <div className="result-body">
          <div className="result-tabs">
            <div className={`result-tab ${tab === "response" ? "active" : ""}`} onClick={() => setTab("response")}>Response</div>
            <div className={`result-tab ${tab === "assertions" ? "active" : ""}`} onClick={() => setTab("assertions")}>
              Assertions ({assertions.filter(a => a.pass).length}/{assertions.length})
            </div>
          </div>
          {tab === "response" && (
            <div className="code-block" dangerouslySetInnerHTML={{ __html: highlight(result.data) }} />
          )}
          {tab === "assertions" && (
            <div className="assertions">
              {assertions.map((a, i) => (
                <div key={i} className={`assertion ${a.pass ? "pass" : "fail"}`}>
                  <span className="assertion-icon">{a.pass ? "✓" : "✗"}</span>
                  <span className="assertion-text">{a.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PulseTester() {
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [apiAlive, setApiAlive] = useState(null);
  const [token, setToken] = useState(null);
  const stateRef = useRef({});
  const tests = buildTests(stateRef.current);

  // Check API health on mount
  useEffect(() => {
    fetch("http://localhost:5001/health")
      .then(r => r.ok ? setApiAlive(true) : setApiAlive(false))
      .catch(() => setApiAlive(false));
  }, []);

  const groups = ["All", ...new Set(tests.map(t => t.group))];
  const visibleTests = selectedGroup === "All" ? tests : tests.filter(t => t.group === selectedGroup);

  const passed = Object.values(results).filter(r => r && tests.find(t => results[t.id] === r)?.assert(r).every(a => a.pass)).length;
  const failed = Object.values(results).filter(r => r && !tests.find(t => results[t.id] === r)?.assert(r).every(a => a.pass)).length;

  const runAll = async () => {
    setRunning(true);
    setResults({});
    stateRef.current = {};
    const s = stateRef.current;

    for (const test of tests) {
      setCurrentTest(test.id);
      try {
        const result = await test.run(s);
        if (result.data?.data?.accessToken) setToken(result.data.data.accessToken);
        setResults(prev => ({ ...prev, [test.id]: result }));
      } catch (err) {
        setResults(prev => ({ ...prev, [test.id]: { ok: false, status: 0, data: { error: err.message }, duration: 0 } }));
      }
      await new Promise(r => setTimeout(r, 150));
    }
    setCurrentTest(null);
    setRunning(false);
  };

  const runSingle = async (test) => {
    setCurrentTest(test.id);
    try {
      const result = await test.run(stateRef.current);
      setResults(prev => ({ ...prev, [test.id]: result }));
    } catch (err) {
      setResults(prev => ({ ...prev, [test.id]: { ok: false, status: 0, data: { error: err.message }, duration: 0 } }));
    }
    setCurrentTest(null);
  };

  const totalRun = Object.keys(results).length;
  const progress = running ? (totalRun / tests.length) * 100 : totalRun > 0 ? 100 : 0;

  const getBtnClass = (test) => {
    if (currentTest === test.id) return "test-btn running";
    const r = results[test.id];
    if (!r) return "test-btn";
    const allPass = test.assert(r).every(a => a.pass);
    return `test-btn ${allPass ? "pass" : "fail"}`;
  };

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-mark">⚡</div>
              <span className="logo-text">Pulse Tester</span>
              <span className="logo-badge">v1</span>
            </div>
            <div className="status-bar">
              <div className={`status-dot ${apiAlive === false ? "dead" : ""}`} />
              <span>
                {apiAlive === null ? "Checking API..." : apiAlive ? "API online · localhost:5001" : "API offline — start backend"}
              </span>
            </div>
          </div>

          <div className="sidebar-scroll">
            {/* Group filter */}
            <div className="section-label">Filter</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "0 8px 8px" }}>
              {groups.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                    background: selectedGroup === g ? "var(--purple)" : "var(--bg3)",
                    color: selectedGroup === g ? "#fff" : "var(--text2)",
                    border: "none", cursor: "pointer", transition: "all 0.15s",
                  }}
                >{g}</button>
              ))}
            </div>

            {/* Test list */}
            {groups.slice(1).filter(g => selectedGroup === "All" || g === selectedGroup).map(group => (
              <div key={group}>
                <div className="section-label">{group}</div>
                {tests.filter(t => t.group === group).map(test => (
                  <div key={test.id} className={getBtnClass(test)} onClick={() => !running && runSingle(test)}>
                    <span className={`method-tag ${test.method}`}>{test.method}</span>
                    <span className="test-name">{test.name}</span>
                    {currentTest === test.id && <div className="spinner" />}
                    {results[test.id] && currentTest !== test.id && (
                      <span className="test-status-icon">
                        {test.assert(results[test.id]).every(a => a.pass) ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button className="run-all-btn" onClick={runAll} disabled={running || apiAlive === false}>
            {running ? `Running ${totalRun}/${tests.length}…` : `▶ Run All ${tests.length} Tests`}
          </button>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <span className="topbar-title">
              {currentTest ? `Running: ${tests.find(t => t.id === currentTest)?.name}` : "Pulse API Integration Tests"}
            </span>
            <span className="topbar-url">POST http://localhost:5001/api</span>
          </div>

          {/* Progress */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Summary */}
          {totalRun > 0 && (
            <div className="summary-bar">
              <div className="summary-item">
                <span className="summary-num blue">{totalRun}</span>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>run</span>
              </div>
              <div className="summary-item">
                <span className="summary-num green">{Object.entries(results).filter(([id, r]) => r && tests.find(t => t.id === id)?.assert(r).every(a => a.pass)).length}</span>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>passed</span>
              </div>
              <div className="summary-item">
                <span className="summary-num red">{Object.entries(results).filter(([id, r]) => r && !tests.find(t => t.id === id)?.assert(r).every(a => a.pass)).length}</span>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>failed</span>
              </div>
              <div className="summary-item">
                <span className="summary-num yellow">
                  {Math.round(Object.values(results).reduce((a, r) => a + (r?.duration || 0), 0))}ms
                </span>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>total time</span>
              </div>
            </div>
          )}

          <div className="content">
            {token && (
              <div className="token-banner">
                <div className="token-label">Active Access Token</div>
                {token.slice(0, 60)}…
              </div>
            )}

            {totalRun === 0 && !running ? (
              <div className="empty">
                <div className="empty-icon">⚡</div>
                <div className="empty-title">Ready to test</div>
                <div className="empty-sub">Click "Run All Tests" or click any test in the sidebar</div>
              </div>
            ) : (
              visibleTests.map(test => (
                <ResultCard key={test.id} test={test} result={results[test.id]} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
