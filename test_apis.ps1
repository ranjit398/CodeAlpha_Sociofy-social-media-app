$base = 'http://localhost:5001/api'
$headers = @{'Content-Type'='application/json'}
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$email = "test${ts}@pulse.dev"
$uname = "testuser${ts}"

Write-Host '=== TEST 1: Register ===' -ForegroundColor Cyan
$body1 = "{`"username`":`"$uname`",`"email`":`"$email`",`"password`":`"Test1234!`",`"displayName`":`"Test User`"}"
try {
  $r1 = Invoke-RestMethod -Uri "$base/auth/register" -Method POST -Headers $headers -Body $body1
  Write-Host "  OK  user=$($r1.data.user.username)  hasToken=$(($null -ne $r1.data.accessToken))" -ForegroundColor Green
  $token   = $r1.data.accessToken
  $refresh = $r1.data.refreshToken
  $username = $r1.data.user.username
} catch {
  Write-Host "  FAIL $_" -ForegroundColor Red
  exit 1
}

Write-Host '=== TEST 2: Login ===' -ForegroundColor Cyan
$body2 = "{`"email`":`"$email`",`"password`":`"Test1234!`"}"
try {
  $r2 = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -Headers $headers -Body $body2
  Write-Host "  OK  user=$($r2.data.user.username)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 3: GET /auth/me ===' -ForegroundColor Cyan
$authHdr = @{'Content-Type'='application/json'; 'Authorization'="Bearer $token"}
try {
  $r3 = Invoke-RestMethod -Uri "$base/auth/me" -Method GET -Headers $authHdr
  Write-Host "  OK  user=$($r3.data.user.username)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 4: Create Post (text only) ===' -ForegroundColor Cyan
$body4 = '{"content":"Hello from API test! #pulse"}'
try {
  $r4 = Invoke-RestMethod -Uri "$base/posts" -Method POST -Headers $authHdr -Body $body4
  Write-Host "  OK  postId=$($r4.data.post.id)" -ForegroundColor Green
  $postId = $r4.data.post.id
} catch { Write-Host "  FAIL $_" -ForegroundColor Red; exit 1 }

Write-Host '=== TEST 5: Get Post by ID ===' -ForegroundColor Cyan
try {
  $r5 = Invoke-RestMethod -Uri "$base/posts/$postId" -Method GET -Headers $headers
  Write-Host "  OK  content=$($r5.data.post.content.Substring(0, [Math]::Min(35,$r5.data.post.content.Length)))" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 6: Add Comment ===' -ForegroundColor Cyan
$body6 = '{"content":"Nice post from tester!"}'
try {
  $r6 = Invoke-RestMethod -Uri "$base/posts/$postId/comments" -Method POST -Headers $authHdr -Body $body6
  Write-Host "  OK  commentId=$($r6.data.comment.id)" -ForegroundColor Green
  $commentId = $r6.data.comment.id
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 7: Get Comments ===' -ForegroundColor Cyan
try {
  $r7 = Invoke-RestMethod -Uri "$base/posts/$postId/comments" -Method GET -Headers $headers
  Write-Host "  OK  count=$($r7.data.comments.Count)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 8: Like Post ===' -ForegroundColor Cyan
try {
  $r8 = Invoke-RestMethod -Uri "$base/posts/$postId/like" -Method POST -Headers $authHdr
  Write-Host "  OK  $($r8.message)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 9: Global Feed ===' -ForegroundColor Cyan
try {
  $r9 = Invoke-RestMethod -Uri "$base/feed/global" -Method GET -Headers $headers
  Write-Host "  OK  posts=$($r9.data.posts.Count)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 10: User Profile ===' -ForegroundColor Cyan
try {
  $r10 = Invoke-RestMethod -Uri "$base/users/$username" -Method GET -Headers $headers
  Write-Host "  OK  username=$($r10.data.user.username)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 11: Personalized Feed (following) ===' -ForegroundColor Cyan
try {
  $r11 = Invoke-RestMethod -Uri "$base/feed/following" -Method GET -Headers $authHdr
  Write-Host "  OK  posts=$($r11.data.posts.Count)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 12: User Search ===' -ForegroundColor Cyan
try {
  $r12 = Invoke-RestMethod -Uri "$base/users/search?q=test" -Method GET -Headers $headers
  Write-Host "  OK  results=$($r12.data.users.Count)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 13: Delete Comment ===' -ForegroundColor Cyan
try {
  $r13 = Invoke-RestMethod -Uri "$base/posts/$postId/comments/$commentId" -Method DELETE -Headers $authHdr
  Write-Host "  OK  $($r13.message)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 14: Unlike Post ===' -ForegroundColor Cyan
try {
  $r14 = Invoke-RestMethod -Uri "$base/posts/$postId/like" -Method DELETE -Headers $authHdr
  Write-Host "  OK  $($r14.message)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 15: Delete Post ===' -ForegroundColor Cyan
try {
  $r15 = Invoke-RestMethod -Uri "$base/posts/$postId" -Method DELETE -Headers $authHdr
  Write-Host "  OK  $($r15.message)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host '=== TEST 16: Logout ===' -ForegroundColor Cyan
$body16 = "{`"refreshToken`":`"$refresh`"}"
try {
  $r16 = Invoke-RestMethod -Uri "$base/auth/logout" -Method POST -Headers $authHdr -Body $body16
  Write-Host "  OK  $($r16.message)" -ForegroundColor Green
} catch { Write-Host "  FAIL $_" -ForegroundColor Red }

Write-Host ''
Write-Host '============================' -ForegroundColor Yellow
Write-Host '  ALL API TESTS COMPLETE   ' -ForegroundColor Yellow
Write-Host '============================' -ForegroundColor Yellow
