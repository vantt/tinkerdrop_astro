# Blog Migration Script
# Downloads remote hero images and restructures blog posts to colocation format

$blogDir = "d:\_1.FWG_PARA\1.Projects\dev\astro\tinker-drop\src\content\blog"

# Blog posts with their remote image URLs
$posts = @(
    @{
        slug = "connecting-with-locals-the-true-essence-of-travel"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/e0117e2b-bdfe-411d-809f-a06ebd9aff09.png/public"
    },
    @{
        slug = "dealing-with-loneliness-the-realities-of-solo-travel"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/5e783ab5-0344-4f1c-b420-38274c233202.png/public"
    },
    @{
        slug = "eating-my-way-through-vietnam-a-culinary-adventure"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/6976cca4-c4f1-47e1-9d7a-fabfd031b708.png/public"
    },
    @{
        slug = "embracing-the-unexpected-when-travel-plans-go-awry"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/b918f61e-6c5a-4dff-8c9f-3e5055a78bd9.png/public"
    },
    @{
        slug = "getting-lost-in-tokyo-navigating-the-organized-chaos"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/87ab0720-a5f1-4554-adf5-738084e45a20.png/public"
    },
    @{
        slug = "healing-power-of-travel"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/13073549-f997-43ab-b145-3d50444bc356.png/public"
    },
    @{
        slug = "lessons-from-the-road-how-travel-changed-my-perspective"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/a5fe8f31-bc8b-4b3a-ab3f-9abac355e554.png/public"
    },
    @{
        slug = "sustainable-travel-reducing-your-footprint-on-the-road"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/7f6f52d6-cdd5-4b8d-9f7e-1be06e031028.png/public"
    },
    @{
        slug = "the-art-of-slow-travel-savoring-every-moment-in-chiang-rai-thailand"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/dc98e750-6d86-4101-8907-480c1782e3d0.png/public"
    },
    @{
        slug = "the-digital-nomad-life-working-remotely-from-paradise"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/70cf4cd7-238d-4481-805a-ac0ef7b7f861.png/public"
    },
    @{
        slug = "the-healing-power-of-travel-finding-myself-again"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/13073549-f997-43ab-b145-3d50444bc356.png/public"
    },
    @{
        slug = "the-magic-of-spontaneity-unplanned-adventures"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/db4ef086-b017-43f9-b1b8-09f43fd934e3.png/public"
    },
    @{
        slug = "trekking-the-himalayas-pushing-my-limits-in-nepal"
        url = "https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/c3b40bdd-8db9-458d-8cec-df6a1739da92.png/public"
    }
)

Write-Host "Starting blog migration..." -ForegroundColor Green
Write-Host ""

foreach ($post in $posts) {
    $slug = $post.slug
    $imageUrl = $post.url
    
    Write-Host "Processing: $slug" -ForegroundColor Cyan
    
    # Paths
    $mdFile = Join-Path $blogDir "$slug.md"
    $newFolder = Join-Path $blogDir $slug
    $newMdFile = Join-Path $newFolder "index.md"
    $heroImageFile = Join-Path $newFolder "hero.jpg"
    
    # Check if .md file exists
    if (-not (Test-Path $mdFile)) {
        Write-Host "  ⚠️  File not found: $mdFile" -ForegroundColor Yellow
        continue
    }
    
    # Create folder
    if (-not (Test-Path $newFolder)) {
        New-Item -ItemType Directory -Path $newFolder -Force | Out-Null
        Write-Host "  ✓ Created folder" -ForegroundColor Green
    }
    
    # Download hero image
    try {
        Write-Host "  ⬇️  Downloading image..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $imageUrl -OutFile $heroImageFile -ErrorAction Stop
        Write-Host "  ✓ Image downloaded" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed to download image: $_" -ForegroundColor Red
        continue
    }
    
    # Read and update markdown content
    $content = Get-Content $mdFile -Raw
    
    # Update heroImage path in frontmatter
    $content = $content -replace 'heroImage: "https://[^"]*"', 'heroImage: ./hero.jpg'
    
    # Write to new location
    Set-Content -Path $newMdFile -Value $content -NoNewline
    Write-Host "  ✓ Created index.md with updated frontmatter" -ForegroundColor Green
    
    # Delete old .md file
    Remove-Item $mdFile -Force
    Write-Host "  ✓ Removed old .md file" -ForegroundColor Green
    
    Write-Host ""
}

Write-Host "Migration complete! ✨" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "- Migrated $($posts.Count) blog posts to colocation structure"
Write-Host "- Downloaded $($posts.Count) hero images locally"
Write-Host "- Updated all heroImage references to use local paths"
