# Image Generation Feature - Implementation Document

## Overview

This feature allows users to generate branded images for posts in the calendar. The system uses SVG templates parametrized with the user's brand profile data (colors, typography, visual style) and contextual information from Strategy, Trends, and Campaigns to create professional, on-brand images.

**Key Benefits:**
- ✅ **Low token cost**: GPT is only used optionally for copy optimization (~$0.00002 per image)
- ✅ **Brand consistency**: Uses colors, fonts, and style from Brand Profile automatically
- ✅ **Context-aware**: Leverages data from multiple sources (Brand Profile, Strategy, Trends, Campaigns)
- ✅ **Multiple formats**: Download as SVG (editable), PNG, or JPG
- ✅ **Multiple templates**: Different designs for different content types and platforms

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                               │
├─────────────────────────────────────────────────────────────────────────┤
│  CampaignForm.jsx                                                        │
│  └── ImageGeneratorButton.jsx      (Triggers generation)                │
│      └── ImagePreviewModal.jsx     (Shows preview + download options)   │
│          └── TemplateSelector.jsx  (Switch between templates)           │
│                                                                          │
│  Services:                                                               │
│  - imageApi.js                     (API calls to backend)               │
│  - useImageGenerator.js            (React hook for state management)    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (FastAPI/Python)                        │
├─────────────────────────────────────────────────────────────────────────┤
│  POST /api/v1/images/generate                                           │
│  └── images.py (Router)                                                 │
│      ├── ContextAggregator          (Fetches all user data)            │
│      │   ├── Brand Profile          (colors, typography, style)         │
│      │   ├── Strategy               (goals, video ideas)                │
│      │   ├── Trends                 (keywords, viral topics)            │
│      │   └── Campaigns              (active campaigns)                  │
│      │                                                                   │
│      └── ImageGenerator             (Renders SVG + converts to PNG)     │
│          ├── Template Selection     (Based on platform + contentType)   │
│          ├── Brand Params Extraction (From Brand Profile)              │
│          ├── SVG Rendering          (Jinja2 templates)                  │
│          └── PNG Conversion         (CairoSVG)                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User clicks "Generate Image"** in CampaignForm
2. **Frontend sends request** to `/api/v1/images/generate` with:
   - `founderId`
   - `postData` (hook, body, cta, pillar, platform, contentType)
   - Optional: `templateType`, `outputFormat`
3. **Backend processes request**:
   - ContextAggregator fetches Brand Profile, Strategy, Trends, Campaigns
   - ImageGenerator selects optimal template
   - Renders SVG with Jinja2
   - Converts to PNG with CairoSVG
4. **Frontend receives response** with:
   - SVG content
   - PNG in base64
   - Template used
   - Dimensions
   - Context sources used
5. **User previews and downloads** in modal

## Backend Implementation

### Files Created

```
app/
├── models/
│   └── schemas.py                      [MODIFIED] Added image schemas
│
├── services/
│   ├── context_aggregator.py          [NEW] Fetches all user data
│   └── image_generator.py             [NEW] Generates images
│
├── routers/
│   └── images.py                       [NEW] Image endpoints
│
├── templates/images/
│   ├── quote-minimal.svg.j2            [NEW] Minimal quote template
│   ├── quote-bold.svg.j2               [NEW] Bold quote template
│   ├── tip-card.svg.j2                 [NEW] Tip card template
│   └── story-cta.svg.j2                [NEW] Story CTA template
│
└── main.py                             [MODIFIED] Registered images router
```

### Services

#### ContextAggregator (`services/context_aggregator.py`)

**Responsibility:** Fetch and consolidate user data from all available sources.

**Methods:**
- `get_full_context(founder_id, post_data)` - Main entry point, returns `ImageContext`
- `_get_brand_visual_data(founder_id)` - Extracts visual data from Brand Profile
- `_get_strategy_context(founder_id)` - Fetches Strategy goals and video ideas
- `_get_trends_context(founder_id)` - Fetches trending keywords and viral topics
- `_get_campaigns_context(founder_id)` - Fetches active campaigns
- `_find_related_campaign(campaigns, post_data)` - Matches campaign to post

**Data Sources:**
| Source | Repository | Data Extracted |
|--------|-----------|----------------|
| Brand Profile | `brand_profile_repository.get_brand_profile()` | Colors, typography, visual style, voice, purpose |
| Strategy | `strategy_repository.get_strategy()` | Goals, video ideas |
| Trends | `trends_repository.get_trends()` | Trending keywords, viral topics |
| Campaigns | `campaign_repository.get_campaigns_by_founder()` | Active campaigns, AI suggestions |

#### ImageGenerator (`services/image_generator.py`)

**Responsibility:** Select templates, render SVG, and convert to PNG.

**Methods:**
- `generate_image(context, template_type, optimized_hook, output_format)` - Main entry point
- `select_template(platform, content_type, requested_template)` - Template selection logic
- `prepare_brand_params(brand)` - Extracts and normalizes Brand Profile data
- `render_template(template_name, context, brand_params, optimized_hook)` - Renders SVG
- `svg_to_png(svg_content, width, height)` - Converts SVG to PNG using CairoSVG
- `get_dimensions(template_name)` - Returns template dimensions

**Template Mapping:**
```python
{
    ("Instagram", "Viral"): "quote-bold",
    ("Instagram", "Educational"): "tip-card",
    ("Instagram", "Authority"): "quote-minimal",
    ("TikTok", "Viral"): "quote-bold",
    ("LinkedIn", "Educational"): "tip-card",
    ("Story", None): "story-cta",
}
```

### Pydantic Schemas

```python
class PostImageData(BaseModel):
    hook: str
    body: Optional[str]
    cta: Optional[str]
    pillar: Optional[str]
    platform: Optional[str]
    contentType: Optional[str]
    format: Optional[str]
    angle: Optional[str]

class BrandVisualData(BaseModel):
    colorPalette: Optional[Dict[str, List[str]]]
    typography: Optional[List[Dict[str, str]]]
    visualStyle: Optional[List[Dict[str, str]]]
    purpose: Optional[str]
    voice: Optional[str]

class ImageContext(BaseModel):
    post: PostImageData
    brand: Optional[BrandVisualData]
    strategy: Optional[StrategyContextData]
    trends: Optional[TrendsContextData]
    campaign: Optional[CampaignContextData]

class GenerateImageRequest(BaseModel):
    founderId: str
    postData: PostImageData
    templateType: Optional[str]
    optimizeCopy: bool = False
    outputFormat: Literal["svg", "png", "both"] = "both"

class GenerateImageResponse(BaseModel):
    success: bool
    svg: str
    pngBase64: Optional[str]
    pngUrl: Optional[str]
    templateUsed: str
    dimensions: Dict[str, int]
    contextUsed: List[str]
    optimizedCopy: Optional[OptimizedCopyResult]
```

## Frontend Implementation

### Files Created

```
src/
├── services/
│   └── imageApi.js                     [NEW] API service for images
│
├── hooks/
│   └── useImageGenerator.js            [NEW] React hook for state
│
├── Component/ImageGenerator/
│   ├── ImageGeneratorButton.jsx        [NEW] Main button component
│   ├── ImagePreviewModal.jsx           [NEW] Preview modal
│   └── TemplateSelector.jsx            [NEW] Template selector
│
└── Pages/Tools/Calendar/
    └── CampaignForm.jsx                [MODIFIED] Added Visual Content section
```

### Components

#### ImageGeneratorButton.jsx

- Main trigger button
- Shows loading state during generation
- Opens modal with generated image
- Displays error messages if generation fails

**Props:**
- `post` - Post object with hook, body, cta, etc.
- `founderId` - User's founder ID

#### ImagePreviewModal.jsx

- Full-screen modal with image preview
- Download options (PNG, SVG, JPG)
- Template switcher (regenerate with different template)
- Shows context sources used
- Shows dimensions and template info

**Features:**
- Download PNG (from backend or generated in frontend)
- Download SVG (editable in Figma/Canva)
- Download JPG (for platforms requiring JPG)
- Switch templates without re-entering data
- Loading state during regeneration

#### TemplateSelector.jsx

- List of available templates
- Shows template name, description, and icon
- Filters by platform if applicable
- Visual indicator for selected template

### Hooks

#### useImageGenerator.js

```javascript
const {
  generateImage,           // Main function to generate image
  regenerateWithTemplate,  // Regenerate with different template
  isGenerating,            // Loading state
  generatedImage,          // Generated image data
  error,                   // Error message
  clearError,              // Clear error state
  clearImage,              // Clear generated image
} = useImageGenerator();
```

## Templates

### Available Templates

| Template | File | Dimensions | Best For | Platforms |
|----------|------|-----------|----------|-----------|
| **Minimal Quote** | `quote-minimal.svg.j2` | 1080x1080 | Impactful quotes, authority content | Instagram, LinkedIn, Twitter |
| **Bold Quote** | `quote-bold.svg.j2` | 1080x1080 | Viral content, attention-grabbing | Instagram, TikTok, Facebook |
| **Tip Card** | `tip-card.svg.j2` | 1080x1080 | Educational tips, how-tos | Instagram, LinkedIn, Pinterest |
| **Story CTA** | `story-cta.svg.j2` | 1080x1920 | Stories with call-to-action | Instagram Stories, TikTok |

### Template Features

All templates include:
- ✅ Parametrized colors from Brand Profile
- ✅ Custom fonts from Brand Profile
- ✅ Responsive text wrapping
- ✅ Pillar/category badge
- ✅ CTA section
- ✅ Decorative elements using brand colors
- ✅ Gradient support (if enabled in Brand Profile)
- ✅ Customizable border radius and shadows

### Template Structure (Example: quote-minimal.svg.j2)

```jinja2
<svg width="1080" height="1080">
  <defs>
    <!-- Gradient if enabled -->
    <linearGradient id="bgGradient">
      <stop offset="0%" style="stop-color:{{ colors.primary }}" />
      <stop offset="100%" style="stop-color:{{ colors.secondary }}" />
    </linearGradient>

    <!-- Google Fonts import -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family={{ typography.headlineFont }}:wght@700');

      .headline {
        font-family: '{{ typography.headlineFont }}', sans-serif;
        font-size: 72px;
        fill: {{ colors.text }};
      }
    </style>
  </defs>

  <!-- Background -->
  <rect fill="{{ colors.background }}" rx="{{ visualStyle.borderRadius }}" />

  <!-- Pillar Badge -->
  {% if pillar %}
  <text class="pillar-badge">{{ pillar }}</text>
  {% endif %}

  <!-- Hook Text -->
  {% for line in hook | wordwrap(20) | split('\n') %}
  <text class="headline">{{ line }}</text>
  {% endfor %}

  <!-- CTA -->
  {% if cta %}
  <text class="cta">→ {{ cta }}</text>
  {% endif %}
</svg>
```

## Brand Profile Integration

### How Brand Data Maps to Templates

| Brand Profile Field | Template Usage | Example |
|---------------------|----------------|---------|
| `colorPalette.primary[0]` | Primary color | Badges, accents |
| `colorPalette.primary[1]` | Secondary color | Gradients |
| `colorPalette.primary[2]` | Accent color | CTAs, decorative elements |
| `colorPalette.secondary[0]` | Background | Canvas background |
| `colorPalette.secondary[2]` | Text color | Main text |
| `typography[].font` (headline) | Headline font | Hook text |
| `typography[].font` (body) | Body font | Body text, CTA |
| `visualStyle[].value` (radius) | Border radius | Card corners |
| `visualStyle[].value` (gradient) | Gradient type | Background style |

### Default Values (Fallback)

If Brand Profile data is missing:
```javascript
{
  colors: {
    primary: "#9AA7FF",
    secondary: "#D6B4FF",
    accent: "#FF4DB8",
    background: "#FFFFFF",
    text: "#111827",
    textSecondary: "#6B7280",
  },
  typography: {
    headlineFont: "Sora",
    bodyFont: "Inter",
  },
  visualStyle: {
    borderRadius: "12px",
    shadowStyle: "soft",
    gradientType: "linear",
  }
}
```

## API Reference

### POST /api/v1/images/generate

Generate an image for a post.

**Request Body:**
```json
{
  "founderId": "founder-uuid",
  "postData": {
    "hook": "Transform your content strategy",
    "body": "Learn data-driven methods",
    "cta": "Read more",
    "pillar": "Tips",
    "platform": "Instagram",
    "contentType": "Educational"
  },
  "templateType": "tip-card",
  "optimizeCopy": false,
  "outputFormat": "both"
}
```

**Response:**
```json
{
  "success": true,
  "svg": "<svg>...</svg>",
  "pngBase64": "iVBORw0KGgoAAAANS...",
  "pngUrl": null,
  "templateUsed": "tip-card",
  "dimensions": {
    "width": 1080,
    "height": 1080
  },
  "contextUsed": ["brand_profile", "strategy", "trends"],
  "optimizedCopy": null
}
```

**Error Response:**
```json
{
  "detail": "Failed to generate image: Template not found"
}
```

### GET /api/v1/images/templates

Get available templates.

**Query Parameters:**
- `platform` (optional) - Filter templates by platform

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "quote-minimal",
      "name": "Minimal Quote",
      "description": "Clean, minimal design for impactful quotes",
      "platforms": ["Instagram", "LinkedIn", "Twitter/X"],
      "dimensions": {"width": 1080, "height": 1080},
      "bestFor": ["Authority", "Educational"]
    }
  ],
  "total": 4
}
```

## Installation & Setup

### Backend Dependencies

```bash
cd /Users/tonyprado/Documents/Proyectos/DNHub/dnhubAI
pip install -r requirements.txt
```

**New dependencies added:**
- `cairosvg>=2.7.1` - SVG to PNG conversion
- `Jinja2>=3.1.3` - Template engine
- `Pillow>=10.2.0` - Image processing
- `openai>=1.12.0` - (Already installed)

### Frontend Dependencies

```bash
cd /Users/tonyprado/IdeaProjects/marnee-front
npm install
```

**New dependencies added:**
- `html-to-image@^1.11.11` - Convert HTML/SVG to PNG/JPG
- `file-saver@^2.0.5` - Download files

## Usage

### For Users

1. Open a post in the calendar
2. Scroll to "Visual Content" section
3. Click "Generate Image"
4. Wait for generation (usually 1-3 seconds)
5. Preview image in modal
6. Optionally switch templates
7. Download as PNG, SVG, or JPG

### For Developers

#### Generate Image Programmatically

**Backend:**
```python
from app.services.context_aggregator import ContextAggregator
from app.services.image_generator import ImageGenerator

# Get context
aggregator = ContextAggregator()
context = await aggregator.get_full_context(
    founder_id="founder-uuid",
    post_data={
        "hook": "Your hook here",
        "platform": "Instagram",
        "contentType": "Educational"
    }
)

# Generate image
generator = ImageGenerator()
svg, png_base64, template, dimensions = generator.generate_image(
    context=context,
    output_format="both"
)
```

**Frontend:**
```javascript
import useImageGenerator from './hooks/useImageGenerator';

function MyComponent() {
  const { generateImage, generatedImage } = useImageGenerator();

  const handleGenerate = async () => {
    const image = await generateImage({
      founderId: "founder-uuid",
      postData: {
        hook: "Your hook here",
        platform: "Instagram",
        contentType: "Educational",
      },
      outputFormat: "both",
    });

    console.log(image.svg);        // SVG content
    console.log(image.pngBase64);  // PNG in base64
  };
}
```

## Token Costs

| Scenario | OpenAI Tokens | Cost per Image |
|----------|---------------|----------------|
| **Without copy optimization** | 0 | $0.00 |
| **With copy optimization** (gpt-4o-mini) | ~70 | ~$0.00002 |
| **1,000 images optimized** | ~70,000 | ~$0.02 |

## Future Enhancements

### Planned Features

- [ ] **DALL-E Integration** - Generate unique images for special posts
- [ ] **Upload Custom Assets** - User-uploaded logos, photos
- [ ] **More Templates** - Carousel slides, list posts, before/after
- [ ] **A/B Testing** - Test multiple templates for best performance
- [ ] **Scheduled Generation** - Auto-generate images for scheduled posts
- [ ] **Batch Generation** - Generate images for multiple posts at once
- [ ] **Template Customization** - User can tweak templates visually
- [ ] **Video Thumbnails** - Generate thumbnails for video content
- [ ] **Multi-Language Support** - Templates with RTL text support

### Possible Improvements

- Cache generated images in S3 or CDN
- Add watermark/branding automatically
- Optimize PNG file size
- Add image preview before download
- Support custom dimensions
- Add animation effects (GIF export)
- Integrate with Canva API for advanced editing

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'cairosvg'`

**Solution:**
```bash
pip install cairosvg Jinja2 Pillow
```

**Problem:** `TemplateNotFound: quote-minimal.svg.j2`

**Solution:** Ensure templates are in correct location:
```bash
ls app/templates/images/
# Should show: quote-minimal.svg.j2, quote-bold.svg.j2, etc.
```

**Problem:** PNG conversion fails with CairoSVG error

**Solution:** Install system dependencies:
```bash
# macOS
brew install cairo

# Ubuntu/Debian
sudo apt-get install libcairo2

# Windows
# Download from https://cairographics.org/download/
```

### Frontend Issues

**Problem:** `Cannot find module 'html-to-image'`

**Solution:**
```bash
npm install html-to-image file-saver
```

**Problem:** Modal doesn't open after clicking "Generate Image"

**Solution:** Check browser console for errors. Ensure backend is running and API endpoint is accessible.

**Problem:** Download fails

**Solution:** Check browser permissions for downloads. Try different format (SVG vs PNG).

### Common Errors

**422 Unprocessable Entity**
- Missing required fields in request
- Invalid `founderId` or `postData`

**500 Internal Server Error**
- Backend error during generation
- Check backend logs for details

**Network Error**
- Backend not running
- CORS issue (check CORS settings in backend)

## Testing

### Manual Testing Checklist

Backend:
- [ ] POST `/api/v1/images/generate` returns valid SVG
- [ ] PNG conversion works (check pngBase64 is valid base64)
- [ ] Template selection logic works for different platforms
- [ ] Brand Profile data is correctly extracted
- [ ] Works with missing Brand Profile (uses defaults)
- [ ] Context aggregator fetches all data sources
- [ ] Error handling works (invalid founderId, missing post data)

Frontend:
- [ ] Button appears in CampaignForm
- [ ] Loading state shows during generation
- [ ] Modal opens with generated image
- [ ] Image preview displays correctly
- [ ] Template selector works (regenerates image)
- [ ] PNG download works
- [ ] SVG download works
- [ ] JPG download works
- [ ] Error messages display correctly
- [ ] Modal closes properly

## Contact & Support

For questions or issues:
- Check this documentation first
- Check backend logs: `tail -f dnhubAI/logs/app.log`
- Check frontend console in browser DevTools
- Review API response in Network tab

---

**Implementation Date:** April 2026

**Version:** 1.0.0

**Contributors:**
- Claude Sonnet 4.5

**Related Documents:**
- `/Users/tonyprado/.claude/plans/abundant-skipping-chipmunk.md` (Implementation Plan)
- `BRAND_PROFILE_IMPLEMENTATION.md` (Brand Profile Setup)
- `CAMPAIGNS_IMPLEMENTATION.md` (Campaigns Setup)
