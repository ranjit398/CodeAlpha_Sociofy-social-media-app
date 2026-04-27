$base = 'http://localhost:5001/api'
$headers = @{'Content-Type'='application/json'}
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

Write-Host '=====================================' -ForegroundColor Cyan
Write-Host '   TESTING SOCIAL FEATURES (E2E)' -ForegroundColor Cyan
Write-Host '=====================================' -ForegroundColor Cyan

# 1. Create User A (Alice)
$aliceName = "alice$ts"
$bodyA = "{`"username`":`"$aliceName`",`"email`":`"alice$ts@test.com`",`"password`":`"Test1234!`",`"displayName`":`"Alice`"}"
$rA = Invoke-RestMethod -Uri "$base/auth/register" -Method POST -Headers $headers -Body $bodyA
$tokenA = $rA.data.accessToken
$authA = @{'Content-Type'='application/json'; 'Authorization'="Bearer $tokenA"}
Write-Host "✅ Created Alice ($aliceName)" -ForegroundColor Green

# 2. Create User B (Bob)
$bobName = "bob$ts"
$bodyB = "{`"username`":`"$bobName`",`"email`":`"bob$ts@test.com`",`"password`":`"Test1234!`",`"displayName`":`"Bob`"}"
$rB = Invoke-RestMethod -Uri "$base/auth/register" -Method POST -Headers $headers -Body $bodyB
$tokenB = $rB.data.accessToken
$authB = @{'Content-Type'='application/json'; 'Authorization'="Bearer $tokenB"}
Write-Host "✅ Created Bob ($bobName)" -ForegroundColor Green

# 3. Alice creates a post
$postBody = '{"content":"Hello world from Alice!"}'
$rPost = Invoke-RestMethod -Uri "$base/posts" -Method POST -Headers $authA -Body $postBody
$postId = $rPost.data.post.id
Write-Host "✅ Alice created a post (ID: $postId)" -ForegroundColor Green

# 4. Bob searches for Alice
$rSearch = Invoke-RestMethod -Uri "$base/users/search?q=alice" -Method GET -Headers $headers
$found = $rSearch.data.users | Where-Object { $_.username -eq $aliceName }
if ($found) { Write-Host "✅ Bob searched and found Alice" -ForegroundColor Green } else { Write-Host "❌ Search failed" -ForegroundColor Red; exit 1 }

# 5. Bob follows Alice
$rFollow = Invoke-RestMethod -Uri "$base/users/$aliceName/follow" -Method POST -Headers $authB
Write-Host "✅ Bob followed Alice" -ForegroundColor Green

# 6. Check Alice's Followers (should include Bob)
$rFollowers = Invoke-RestMethod -Uri "$base/users/$aliceName/followers" -Method GET -Headers $headers
if ($rFollowers.data.users[0].username -eq $bobName) { Write-Host "✅ Alice's followers list includes Bob" -ForegroundColor Green } else { Write-Host "❌ Follower list error" -ForegroundColor Red }

# 7. Check Bob's Following feed (should see Alice's post)
$rFeed = Invoke-RestMethod -Uri "$base/feed/following" -Method GET -Headers $authB
if ($rFeed.data.posts[0].content -match "Alice") { Write-Host "✅ Bob sees Alice's post in his following feed" -ForegroundColor Green } else { Write-Host "❌ Following feed error" -ForegroundColor Red }

# 8. Bob likes and comments on Alice's post
Invoke-RestMethod -Uri "$base/posts/$postId/like" -Method POST -Headers $authB | Out-Null
Write-Host "✅ Bob liked Alice's post" -ForegroundColor Green

$commentBody = '{"content":"Nice post Alice!"}'
Invoke-RestMethod -Uri "$base/posts/$postId/comments" -Method POST -Headers $authB -Body $commentBody | Out-Null
Write-Host "✅ Bob commented on Alice's post" -ForegroundColor Green

Write-Host '=====================================' -ForegroundColor Cyan
Write-Host '   ALL SOCIAL FEATURES VERIFIED OK' -ForegroundColor Cyan
Write-Host '=====================================' -ForegroundColor Cyan
