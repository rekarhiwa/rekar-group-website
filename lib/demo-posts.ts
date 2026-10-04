import type { Post, PostCategory, Tag } from "@/types/database";
import {
  EDU_POST_CATEGORY_SLUGS,
  createDemoEduPosts,
} from "@/lib/demo-edu-posts";
import {
  NEWS_POST_CATEGORY_SLUGS,
  createDemoNewsPosts,
} from "@/lib/demo-news-posts";
import {
  SOCIAL_POST_CATEGORY_SLUGS,
  createDemoSocialPosts,
} from "@/lib/demo-social-posts";

export const demoPostCategories: PostCategory[] = [
  { id: "pc-web", name: "وێب", slug: "web" },
  { id: "pc-mobile", name: "مۆبایل", slug: "mobile" },
  { id: "pc-data", name: "داتابەیس", slug: "database" },
  { id: "pc-ai", name: "AI", slug: "ai" },
  { id: "pc-coding", name: "کۆدینگ", slug: "coding" },
  { id: "pc-image", name: "وێنە", slug: "image" },
  { id: "pc-video", name: "ڤیدیۆ", slug: "video" },
  { id: "pc-research", name: "توێژینەوە", slug: "research" },
  { id: "pc-medical", name: "پزیشکی", slug: "medical" },
  { id: "pc-engineering", name: "ئەندازیاری", slug: "engineering" },
  { id: "pc-hardware", name: "هاردوێر", slug: "hardware" },
  { id: "pc-tips", name: "ڕێنمایی", slug: "tips" },
  { id: "pc-news", name: "هەواڵ", slug: "news" },
  { id: "pc-social", name: "سۆشیال", slug: "social" },
  { id: "pc-edu", name: "فێرکاری", slug: "edu" },
];

export const demoTags: Tag[] = [
  { id: "tg-next", name: "Next.js", slug: "nextjs" },
  { id: "tg-mobile", name: "مۆبایل", slug: "mobile" },
  { id: "tg-db", name: "PostgreSQL", slug: "postgresql" },
  { id: "tg-seo", name: "SEO", slug: "seo" },
  { id: "tg-ai", name: "AI", slug: "ai" },
  { id: "tg-coding", name: "کۆدینگ", slug: "coding" },
  { id: "tg-image", name: "وێنە", slug: "image" },
  { id: "tg-video", name: "ڤیدیۆ", slug: "video" },
  { id: "tg-research", name: "توێژینەوە", slug: "research" },
  { id: "tg-medical", name: "پزیشکی", slug: "medical" },
  { id: "tg-engineering", name: "ئەندازیاری", slug: "engineering" },
  { id: "tg-nvidia", name: "NVIDIA", slug: "nvidia" },
  { id: "tg-huawei", name: "Huawei", slug: "huawei" },
  { id: "tg-windows", name: "Windows", slug: "windows" },
  { id: "tg-gpu", name: "GPU", slug: "gpu" },
  { id: "tg-tips", name: "ڕێنمایی", slug: "tips" },
  { id: "tg-news", name: "هەواڵ", slug: "news" },
  { id: "tg-social", name: "سۆشیال", slug: "social" },
  { id: "tg-edu", name: "فێرکاری", slug: "edu" },
];

function post(partial: Post): Post {
  return partial;
}

const demoPostsRaw: Post[] = [
  ...createDemoEduPosts(demoPostCategories, demoTags),
  ...createDemoSocialPosts(demoPostCategories, demoTags),
  ...createDemoNewsPosts(demoPostCategories, demoTags),
  post({
    id: "po13",
    title: "کاشی پرۆمپت: ئەو تایبەتمەندییەی کە زۆربەی خەڵک پارەکەی پێ بەفیڕۆ دەدەن",
    slug: "prompt-cache-secret",
    excerpt:
      "هەمان کۆد و یاساکان هەر جارێک دووبارە دەنێریت. کاش خوێندنەوەکە تا ٧٥٪ ارزانتر دەکات؛ تەنها دەبێت بەشی جێگیر لە سەرەوە دابنێیت.",
    content: `<h2>خەڵک چی نازانێت</h2>
<p>زۆر کەس هەر پرسیارێک وەک پەیامی نوێ دەنێرێت: یاساکان، دۆکیومێنتی API و هەزار دێڕ کۆد دووبارە دەچنە ناو مۆدێل. لە ٢٠٢٦ <strong>prompt cache</strong> ئەم بەشە جێگیرانە پاشەکەوت دەکات. لە Fable 5.1 خوێندنەوەی کاش تا ٧٥٪ ارزانتر بووە.</p>
<h2>چۆن کار دەکات</h2>
<ul>
<li>بەشی جێگیر (سیستەم، یاسا، کۆدی پڕۆژە) لە <strong>سەرەتای</strong> پرۆمپت دابنێ.</li>
<li>بەشی گۆڕاو (پرسیاری ئەمڕۆ) لە کۆتاییدا بهێڵەوە. ئەگەر سەرەتا بگۆڕیت، کاش دەشکێت.</li>
<li>ئامرازەکانی MCP ئەگەر هەر جارێک بگۆڕێن، کاشەکە دەشکێنن؛ بۆیە سێرڤەرەکان جێگیر بهێڵە.</li>
</ul>
<p>ئەمە «مۆدێلێکی نوێ» نییە. هەمان مۆدێلە، بەڵام تێچوو و خێرایی زۆر جیاواز دەبن. تیمێک کە ڕیپۆی گەورە هەڵدەگرێت، زۆرجار زیاتر لە نیوەی پارەی تۆکن پاشەکەوت دەکات تەنها بە ڕێکخستنی ڕیزبەندی دەق.</p>`,
    cover_image: "/posts/prompt-cache-secret.jpg",
    category_id: "pc-tips",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T12:00:00Z",
    seo_title: "کاشی پرۆمپت: تایبەتمەندیی شاراوەی ٢٠٢٦",
    seo_description:
      "چۆن prompt cache تێچووی AI کەم دەکاتەوە ئەگەر بەشی جێگیر لە سەرەوە دابنێیت.",
    og_image: "/posts/prompt-cache-secret.jpg",
    deleted_at: null,
    created_at: "2026-09-11T12:00:00Z",
    updated_at: "2026-09-11T12:00:00Z",
    category: demoPostCategories[11],
    tags: [demoTags[4], demoTags[15]],
  }),
  post({
    id: "po14",
    title: "MCP: AI بە داتابەیس و ئامرازەکانت ببەستە، بەبێ کۆدی چەسپاو",
    slug: "mcp-connectors-secret",
    excerpt:
      "زۆر کەس تەنها چات دەکات. Model Context Protocol دەتوانێت مۆدێلەکە بخاتە سەر Postgres، فایلی ناوخۆیی و پانێڵی کار.",
    content: `<h2>چات تەنها دەرگایەکە</h2>
<p>خەڵک AI وەک گۆگڵێکی قسەکەر بەکاردەهێنێت. <strong>MCP</strong> (Model Context Protocol) ڕێگایەکی ستانداردە بۆ ئەوەی مۆدێل ئامرازی ڕاستەقینە بەکاربهێنێت: خوێندنەوەی داتابەیس، کردنەوەی فۆڵدەر، ناردنی نامە، یان خوێندنەوەی دیزاینی Figma.</p>
<h2>ئەوەی زۆر کەس نایزانێت</h2>
<ul>
<li>پێویست ناکات بۆ هەر ئامرازێک «glue code» بنووسیت. سێرڤەرێکی MCP جارێک دەبەسترێت و هەموو مۆدێلەکان دەتوانن بیبینن.</li>
<li>دەتوانیت Postgres، Notion، GitHub یان فایلەکانی پڕۆژەکەت وەک سەرچاوە بدەیتێ، نەک هەموو شتێک کۆپی بکەیتە ناو چات.</li>
<li>مەترسی: ئەگەر MCP دەستگەیشتنی نووسینی هەبێت، مۆدێل دەتوانێت داتا بگۆڕێت. دەستپێکردن بە خوێندنەوە-تەنها عەقڵانییە.</li>
</ul>
<p>باشترین نموونە: لە جیاتی کۆپیکردنی ١٠٠ دێڕ SQL بۆ چات، بڵێ «ئەم هەفتەیە کام خزمەتگوزاری زیاتر داواکراوە» و MCP خۆی پرسیارەکە لەسەر داتای ڕاستەقینە جێبەجێ بکات. پاشان تۆ ئەنجامەکە پشکنیت.</p>`,
    cover_image: "/posts/mcp-connectors.jpg",
    category_id: "pc-tips",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T10:00:00Z",
    seo_title: "MCP: بەستنی AI بە ئامرازەکانت",
    seo_description:
      "Model Context Protocol چییە و چۆن AI دەبەستیت بە داتابەیس و فایل بەبێ کۆدی زیادە.",
    og_image: "/posts/mcp-connectors.jpg",
    deleted_at: null,
    created_at: "2026-09-11T10:00:00Z",
    updated_at: "2026-09-11T10:00:00Z",
    category: demoPostCategories[11],
    tags: [demoTags[4], demoTags[15], demoTags[5]],
  }),
  post({
    id: "po15",
    title: "Computer Use و وێنەی شاشە: کۆد لەسەر UI، نەک تەنها دەق",
    slug: "computer-use-screenshot-secret",
    excerpt:
      "زۆر گەشەپێدەر کێشەکە دەنووسێت. دەتوانیت سکرینشاتی هەڵەکە بنێریت؛ مۆدێل دوگمە و فۆرم دەبینێت و هەنگاو دەگرێت.",
    content: `<h2>دەق هەمیشە بەس نییە</h2>
<p>کاتێک فۆرمێکی RTL تێکچووە یان دوگمەیەک لە مۆبایل ونە، نووسین کات دەخایەنێت. <strong>Computer Use</strong> و تێگەیشتنی وێنە ڕێگە دەدەن مۆدێل شاشەکە ببینێت: دوگمە، مەودا، هەڵەی سوور، تەنانەت ڕیزبەندی ڕاست-بۆ-چەپ.</p>
<h2>تایبەتمەندییە شاراوەکان</h2>
<ul>
<li>سکرینشاتی هەڵەی پرۆدەکشن زۆرجار باشترە لە ١٠ دێڕ ڕوونکردنەوە.</li>
<li>هەندێک ئەجێنت دەتوانن خۆیان کلیک و تایپ بکەن لە وێبگەڕێکی کۆنترۆڵکراودا؛ ئەمە بۆ تاقیکردنەوەی فۆرم و چوونەژوورەوە بەسوودە.</li>
<li>مەترسی: نهێنی، کارت و پەڕەی ئادمین مەنێرە. وێنەی شاشە دەتوانێت تۆکن و ئیمەیڵ تێدابێت.</li>
</ul>
<p>بۆ سایتە کوردییەکان ئەمە گرنگە: مۆدێل دەتوانێت ببینێت مێنیو لە لای چەپە بە هەڵە، یان دەق دەبڕێت. پێشتر دەبوو بە وشە باسی بکەیت؛ ئێستا وێنەکە خۆی قسە دەکات.</p>`,
    cover_image: "/posts/computer-use-ui.jpg",
    category_id: "pc-coding",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T08:00:00Z",
    seo_title: "Computer Use و سکرینشات بۆ کۆدینگ",
    seo_description:
      "چۆن وێنەی شاشە و Computer Use یارمەتی چاککردنی UI و تاقیکردنەوە دەدەن.",
    og_image: "/posts/computer-use-ui.jpg",
    deleted_at: null,
    created_at: "2026-09-11T08:00:00Z",
    updated_at: "2026-09-11T08:00:00Z",
    category: demoPostCategories[4],
    tags: [demoTags[4], demoTags[5], demoTags[15]],
  }),
  post({
    id: "po16",
    title: "دەستکاری وێنە، نەک دروستکردنەوە: ئەوەی دیزاینەرەکان فەرامۆشی دەکەن",
    slug: "image-editing-not-regenerate",
    excerpt:
      "GPT Image 2 لە دەستکاریدا پێشە. وێنەی بەرهەم یان لۆگۆ هەڵمەگرەوە لە سفرەوە؛ بڵێ چی بگۆڕێت.",
    content: `<h2>هەڵەی باو</h2>
<p>زۆر کەس هەر جارێک پرۆمپتێکی نوێ دەنێرێت تا «وێنەیەکی نزیک» دێت. ڕووخسار، ڕەنگی براند و گۆشەی کامێرا هەر جارێک دەگۆڕێن. لە ٢٠٢٦ بەهێزترین بەشی زۆر مۆدێل <strong>دەستکاریکردن</strong>ە، نەک تەنها text-to-image.</p>
<h2>چی بکەیت</h2>
<ul>
<li>وێنەی ڕاستەقینەی بەرهەم یان سکرینشات باربکە، پاشان بڵێ: «پاشبنەما بسڕەوە»، «ڕەنگی مۆر زیاد بکە»، «دەستی چەپ دروست بکە».</li>
<li>GPT Image 2 لە پێوانەی دەستکاریدا لەسەرەوەیە و فەرمانی فرە-بەش باش جێبەجێ دەکات.</li>
<li>Ideogram بۆ نووسینی سەر پۆستەر؛ Midjourney بۆ کۆنسێپت. هەر سێکیان جێگای یەکتر ناگرنەوە.</li>
</ul>
<p>بۆ ڕێکار گروپ ئەمە واتە: لۆگۆ و وێنەی پڕۆژە لە سفرەوە دروست مەکەوە. وێنەی سەرچاوە بهێڵەوە و تەنها ئەو بەشە بگۆڕە کە پێویستە. کات و یەکگرتوویی براند دەپارێزیت.</p>`,
    cover_image: "/posts/image-editing-secret.jpg",
    category_id: "pc-image",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-10T18:00:00Z",
    seo_title: "دەستکاری وێنەی AI باشترە لە دروستکردنەوە",
    seo_description:
      "بۆچی editکردن لە GPT Image 2 براند و بەرهەم باشتر دەپارێزێت لە regenerate.",
    og_image: "/posts/image-editing-secret.jpg",
    deleted_at: null,
    created_at: "2026-09-10T18:00:00Z",
    updated_at: "2026-09-10T18:00:00Z",
    category: demoPostCategories[5],
    tags: [demoTags[4], demoTags[6], demoTags[15]],
  }),
  post({
    id: "po17",
    title: "سێ تایبەتمەندیی شاراوەی ڤیدیۆ: دەنگ، یەکەم فڕەیم، دوا فڕەیم",
    slug: "video-hidden-features",
    excerpt:
      "خەڵک تەنها دەق دەنێرێت بۆ ڤیدیۆ. دەنگی خۆماڵی، وێنەی دەستپێک و کۆتایی کۆنترۆڵی ڕاستەقینە دەدەن.",
    content: `<h2>پرۆمپتی دەق تەنها دەرگایە</h2>
<p>زۆر دروستکەر دەنووسێت «ڕیکلامێکی مۆبایل» و چاوەڕێی موعجیزەیە. سێ تایبەتمەندی کە زۆر کەس نایانبینێت کوالێتی دەگۆڕن.</p>
<h2>ئەوەی فەرامۆش دەکرێت</h2>
<ul>
<li><strong>دەنگی خۆماڵی (Veo 3.1):</strong> دیالۆگ و ئامبیەنت لەگەڵ وێنەکەدا دێن. پێویست ناکات دواتر دەنگ بلکێنیت؛ لیپ-سینک باشترە.</li>
<li><strong>Image-to-video:</strong> وێنەی بەرهەم یان براند وەک یەکەم فڕەیم بنێرە. Kling لەم کارەدا زۆر بەهێزە و ڕەنگی براند دەپارێزێت.</li>
<li><strong>یەکەم و دوا فڕەیم:</strong> دەتوانیت بڵێیت کلیپەکە لەم وێنەیەوە دەست پێبکات و بەو وێنەیە کۆتایی بێت. ئەمە بۆ گواستنەوەی شۆت لە ڕیکلامدا گرنگە.</li>
</ul>
<p>Sora بۆ پڕۆژەی نوێ هەڵبژاردەی کردەیی نییە. کاتەکەت لەسەر کۆنترۆڵی فڕەیم و دەنگ بەفیڕۆ مەدە؛ ئەمە جیاوازی نێوان تاقیکردنەوە و کلیپی بەکارهێنراوە.</p>`,
    cover_image: "/posts/video-hidden-features.jpg",
    category_id: "pc-video",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-10T16:00:00Z",
    seo_title: "تایبەتمەندیی شاراوەی ڤیدیۆی AI",
    seo_description:
      "دەنگی خۆماڵی، image-to-video و یەکەم/دوا فڕەیم چۆن ڤیدیۆی AI کۆنترۆڵ دەکەن.",
    og_image: "/posts/video-hidden-features.jpg",
    deleted_at: null,
    created_at: "2026-09-10T16:00:00Z",
    updated_at: "2026-09-10T16:00:00Z",
    category: demoPostCategories[6],
    tags: [demoTags[4], demoTags[7], demoTags[15]],
  }),
  post({
    id: "po18",
    title: "Deep Research: پلانەکە بگۆڕە پێش ئەوەی سەعاتێک بگەڕێت",
    slug: "deep-research-edit-the-plan",
    excerpt:
      "Gemini و ChatGPT پێش گەڕان پلان نیشان دەدەن. زۆر کەس «دەستپێبکە» لێدەدات؛ گۆڕینی پلان ڕاپۆرتەکە ڕزگار دەکات.",
    content: `<h2>تایبەتمەندییەکە لە پێش دەرەنجامەکەدایە</h2>
<p>Deep Research تەنها «ڕاپۆرتێکی درێژ» نییە. یەکەم هەنگاو پلانێکە: کام سەرچاوە، کام پرسیار، کام سنوور. Gemini ڕێگەت دەدات ئەم پلانە بگۆڕیت پێش جێبەجێکردن. زۆر کەس ئەم هەنگاوە تێدەپەڕێنێت.</p>
<h2>چی لە پلاندا بنووسیت</h2>
<ul>
<li>سەرچاوەی قەدەغە: بڵۆگی بێناو، ڕیکلام، ژمارەی بێ لینک.</li>
<li>زمان: سۆرانی + ئینگلیزی، یان تەنها سەرچاوەی فەرمی.</li>
<li>سنووری کات: «تەنها ٢٠٢٦» یان «پێش ٢٠٢٤ مەهێنە».</li>
<li>شێوەی دەرچوون: خشتە، ڕکابەر، مەترسی، نەک وتارێکی گشتی.</li>
</ul>
<p>ئەگەر پلانەکە هەڵە بێت، مۆدێل سەعاتێک لەسەر ڕێگای هەڵە دەڕوات و تۆ پارە و کات دەدەیت. پێداچوونەوەی دوو خولەکی پلان زۆرجار باشترە لە پێداچوونەوەی ٣٠ لاپەڕە. پاشان هەر لینکێک خۆت بکەوە؛ AI سەرچاوە دروست ناکات.</p>`,
    cover_image: "/posts/research-plan-edit.jpg",
    category_id: "pc-research",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-10T14:00:00Z",
    seo_title: "Deep Research: پلانەکە پێش گەڕان بگۆڕە",
    seo_description:
      "چۆن پلانی Gemini و ChatGPT Deep Research دەستکاری دەکەیت پێش ئەوەی ڕاپۆرت بنووسرێت.",
    og_image: "/posts/research-plan-edit.jpg",
    deleted_at: null,
    created_at: "2026-09-10T14:00:00Z",
    updated_at: "2026-09-10T14:00:00Z",
    category: demoPostCategories[7],
    tags: [demoTags[4], demoTags[8], demoTags[15]],
  }),
  post({
    id: "po19",
    title: "یەک ملیۆن تۆکن: خەڵک هەموو پڕۆژەکە دەهاڕێتە ناو و کوردی تێک دەچێت",
    slug: "million-token-context-mistakes",
    excerpt:
      "کۆنتێکستی گەورە واتای «هەموو فایلەکان بنێرە» نییە. RTL، ژمارە و نهێنی لەناو ئەو هەموو دەقەدا ون دەبن.",
    content: `<h2>مۆدێلە نوێیەکان ١ ملیۆن تۆکنیان هەیە؛ ئەمە مۆڵەتی شلوازی نییە</h2>
<p>Astra و Fable 5.1 کۆنتێکتی زۆر گەورەیان هەیە. خەڵک هەموو ڕیپۆکە، PDF و چاتەکانی ڕابردوو دەهاڕێتە ناو. مۆدێل «دەیبینێت»، بەڵام سەرنجی ناوەڕاست لاواز دەبێت: هەڵەی RTL، ژمارەی هەڵە، یان فایلی کۆن دەچێتە پێش نوێ.</p>
<h2>تایبەتمەندییەکانێک کە فەرامۆش دەکرێن</h2>
<ul>
<li><strong>Lost in the middle:</strong> دەقی گرنگ لە ناوەڕاستی پەیامی درێژدا پشتگوێ دەخرێت. یاسا و نموونەی RTL بخە سەرەوە یان کۆتایی.</li>
<li><strong>کوردی و ژمارە:</strong> مۆدێل هەندێک جار ئاراستەی دەق تێکەڵ دەکات یان ژمارەی عەرەبی/ئینگلیزی هەڵە دەنووسێت. نموونەی دروست لە پرۆمپتدا دابنێ.</li>
<li><strong>نهێنی:</strong> کۆنتێکستی گەورە واتە .env و کلیلی API ئاسانتر دەچنە ناو چات. پێش ناردن فایلەکان فلتەر بکە.</li>
</ul>
<p>باشترین بەکارهێنان: تەنها ئەو مۆدیوڵ و دۆکیومێنتەی پەیوەندی بە ئەرکەکەوە هەیە. کاش بۆ بەشی جێگیر، گەڕان/MCP بۆ باقی. گەورەیی کۆنتێکست ئامرازە، نەک سەبەتەی زبڵ.</p>`,
    cover_image: "/posts/million-token-context.jpg",
    category_id: "pc-tips",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-10T12:00:00Z",
    seo_title: "یەک ملیۆن تۆکن: هەڵە شاراوەکان",
    seo_description:
      "بۆچی کۆنتێکستی گەورە کوردی، RTL و نهێنی تێک دەدات ئەگەر هەموو پڕۆژەکە بنێریت.",
    og_image: "/posts/million-token-context.jpg",
    deleted_at: null,
    created_at: "2026-09-10T12:00:00Z",
    updated_at: "2026-09-10T12:00:00Z",
    category: demoPostCategories[11],
    tags: [demoTags[4], demoTags[15]],
  }),
  post({
    id: "po20",
    title: "چیپەکانی نڤیدیا چۆن کاردەکەن لەسەر ئەی ئای؟",
    slug: "nvidia-chips-and-ai",
    excerpt:
      "GPU، CUDA و Tensor Core بۆچی بوونەتە دڵی شۆڕشی ئەی ئای؛ جیاوازی RTX و چیپەکانی داتاسێنتەر.",
    content: `<h2>بۆچی نڤیدیا پاشای ئەی ئایە؟</h2>
<p>نڤیدیا تەنها کۆمپانیایەکی گەیمینگ نییە. ئەمڕۆ دڵی شۆڕشی ئەی ئایە. چیپەکانی <strong>GPU</strong> هەزاران ناوکی بچووکیان تێدایە کە لە یەک کاتدا کار دەکەن. مۆدێلی ئەی ئای پێویستی بە ملیۆنان حیساباتی هاوکات هەیە — و GPU بۆ ئەم کارە دروست کراوە.</p>
<p>CPU وەک یەک مامۆستای زیرەک وایە: کارێک زۆر باش دەکات. GPU وەک هەزار قوتابی وایە: هەموویان پێکەوە یەک جۆر کار دەکەن. بۆ ڕاهێنانی مۆدێلی گەورە، ئەمە جیاوازی سەرکەوتن و شکستە.</p>
<h2>چۆن GPU کار دەکات بۆ ئەی ئای؟</h2>
<p>ئەی ئای لە بنەڕەتدا ماتریکس لەسەر ماتریکس دەکات: ژمارەیەکی زۆر لێکدان و کۆکردنەوە. نڤیدیا سێ شتی گرنگی تێدایە:</p>
<ul>
<li><strong>CUDA:</strong> زمان و ئیکۆسیستەمێک کە بەرنامەنووسەکان پێی دەڵێن چیپەکە چی بکات.</li>
<li><strong>Tensor Cores:</strong> یەکەی تایبەت تەنها بۆ حیساباتی ئەی ئای.</li>
<li><strong>NVLink:</strong> چیپەکان پێکەوە دەبەستێتەوە وەک یەک مێشکی گەورە.</li>
</ul>
<p>بەبێ ئەم سیستەمە، ڕاهێنانی مۆدێلێکی گەورە لەبری چەند هەفتە، چەند ساڵی دەویست.</p>
<h2>جیاوازی چیپەکان</h2>
<ul>
<li><strong>RTX</strong> بۆ کۆمپیوتەری ئاسایی: گەیمینگ و ئەی ئای ناوخۆیی (وێنە، ڤیدیۆ، کۆد).</li>
<li><strong>A100 / H100 / H200</strong> بۆ داتاسێنتەر و ڕاهێنانی مۆدێلی گەورە.</li>
<li><strong>Blackwell</strong> نەوەی نوێ: خێراتر و کەمتر کارەبا دەخوات بۆ هەر حیساباتێک.</li>
</ul>
<p>کۆمپانیاکانی وەک OpenAI، گووگڵ، میتا و مایکرۆسۆفت هەزاران لەم چیپانە کۆ دەکەنەوە. هەر بۆیە بازاڕی GPU بەو شێوەیە گەورە بووە.</p>
<div data-type="callout"><p>چیپی نڤیدیا = مێشکی ئەی ئای. CUDA و Tensor Core وایان کردووە کە هەر کەسێک مۆدێلێک دروست بکات، سەرەتا بپرسێت: نڤیدیات هەیە؟</p></div>
<p>لە ڕێکار گروپ ئەی ئای بۆ خێراکردنی نووسین و تاقیکردنەوە بەکاردەهێنین؛ تەلارسازی و بڵاوکردنەوە هێشتا پێویستی بە مرۆڤە.</p>`,
    cover_image: "/posts/nvidia-chips-and-ai.jpg",
    category_id: "pc-hardware",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T12:00:00Z",
    seo_title: "چیپەکانی نڤیدیا و ئەی ئای",
    seo_description:
      "GPU، CUDA و Tensor Core چۆن ڕاهێنانی مۆدێلی ئەی ئای خێرا دەکەن؛ جیاوازی RTX و Blackwell.",
    og_image: "/posts/nvidia-chips-and-ai.jpg",
    deleted_at: null,
    created_at: "2026-09-11T12:00:00Z",
    updated_at: "2026-09-11T12:00:00Z",
    category: demoPostCategories[10],
    tags: [demoTags[4], demoTags[11], demoTags[14]],
  }),
  post({
    id: "po21",
    title: "مۆبایلەکانی هواوی و چیپی Kirin: بۆچی جیاوازن؟",
    slug: "huawei-phones-kirin-chips",
    excerpt:
      "HiSilicon و زنجیرەی Kirin چی دەکەن؛ NPU، HarmonyOS و گەڕانەوەی هواوی دوای سزاکان.",
    content: `<h2>هواوی چیپی خۆی دروست دەکات</h2>
<p>زۆر کۆمپانیا مۆبایل دروست دەکەن. کەمێکیان <strong>چیپی خۆیان</strong> دروست دەکەن. هواوی لە ڕێگەی HiSilicon و زنجیرەی <strong>Kirin</strong> چیپی تایبەت بە خۆی دروست دەکات.</p>
<p>ئەمە واتە کۆنتڕۆڵی تەواوی خێرایی، کامێرا و ئەی ئای؛ پشت نەبەستن تەنها بە کوالکۆم یان میدیا تێک؛ و گونجاندنی باشتر لەگەڵ HarmonyOS.</p>
<h2>چیپی Kirin چی تێدایە؟</h2>
<p>چیپی مۆبایل تەنها یەک شت نییە. چەند بەشێکی تێدایە:</p>
<ul>
<li><strong>CPU:</strong> کارە ئاساییەکان (ئەپ و سیستەم).</li>
<li><strong>GPU:</strong> گرافیک و یاری.</li>
<li><strong>NPU:</strong> یەکەی ئەی ئای — وەرگێڕان، فۆتۆ، دەنگ و ناسینەوەی ڕووخسار.</li>
<li><strong>ISP:</strong> پرۆسێسی کامێرا.</li>
<li><strong>مودێم:</strong> تۆڕ و ٥G.</li>
</ul>
<p>NPU ی هواوی لەسەر خودی مۆبایلەکە ئەی ئای جێبەجێ دەکات، بەبێ ناردنی هەموو شتێک بۆ کلاود. ئەمە خێراترە و پارێزراوترە بۆ داتای کەسی.</p>
<h2>چیرۆکی گەڕانەوە</h2>
<p>دوای سزاکانی ئەمریکا، هواوی بۆ ماوەیەک نەیتوانی چیپی پێشکەوتوو بەکاربهێنێت. پاشان زنجیرەی Mate و Pura گەڕانەوەیەکی گەورەیان نیشان دا: چیپی Kirin ی ناوخۆیی، ٥G و ئەدای بەهێز.</p>
<p>وانەکە: کۆمپانیایەک کە چیپی خۆی هەبێت، لە قەیراندا دەتوانێت خۆی بگرێت. ئەوەی تەنها مۆبایل کۆ دەکاتەوە، زیاتر پشت بە کەسانی دیکە دەبەستێت.</p>
<h2>بۆچی بۆ کڕیار گرنگە؟</h2>
<p>کاتێک چیپ و سیستەم پێکەوە دروست دەکرێن، باتری باشتر دەمێنێتەوە، کامێرا زیرەکترە، و ئەپەکان خێراتر دەکرێنەوە. هواوی لەم خاڵەدا وەک ئەپڵ وایە: هاردوێر و سۆفتوێر لە یەک دەستدا.</p>
<div data-type="callout"><p>هواوی = مۆبایل + چیپی Kirin + HarmonyOS. NPU ی ناو چیپەکە وێنە، دەنگ و وەرگێڕان لەسەر خودی مۆبایلەکە دەکات: کەمتر کلاود، زیاتر خێرایی.</p></div>`,
    cover_image: "/posts/huawei-phones-kirin-chips.jpg",
    category_id: "pc-mobile",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T11:00:00Z",
    seo_title: "مۆبایلەکانی هواوی و چیپی Kirin",
    seo_description:
      "HiSilicon، Kirin، NPU و HarmonyOS چۆن مۆبایلەکانی هواوی جیاواز دەکەن.",
    og_image: "/posts/huawei-phones-kirin-chips.jpg",
    deleted_at: null,
    created_at: "2026-09-11T11:00:00Z",
    updated_at: "2026-09-11T11:00:00Z",
    category: demoPostCategories[1],
    tags: [demoTags[1], demoTags[12], demoTags[4]],
  }),
  post({
    id: "po22",
    title: "زیانەکانی ئەی ئای: دیپفەیک، کار، داتا و وزە",
    slug: "ai-harms-and-risks",
    excerpt:
      "ئەی ئای یارمەتیدەرە، بەڵام درۆ، لایەنگری، لەدەستدانی کار و بەکارهێنانی وزە مەترسی ڕاستەقینەن.",
    content: `<h2>ئەی ئای تەنها یارمەتیدەر نییە</h2>
<p>ئەی ئای دەتوانێت کار ئاسان بکات. هەروەها دەتوانێت هەواڵی درۆ و دیپفەیک بڵاوبکاتەوە، داتای کەسی کۆبکاتەوە، بڕیار بدات بەبێ ڕوونکردنەوە (قەرز، دامەزراندن)، و کار لە هەندێک پیشە بگۆڕێت. ئەمە ترس نییە لە تەکنەلۆژیا؛ داواکارییە بۆ بەرپرسیارێتی.</p>
<h2>دیپفەیک و ڕاستی</h2>
<p>ئێستا دەتوانرێت ڤیدیۆی کەسێک دروست بکرێت کە قسەیەک دەکات کە هەرگیز نەیگوتووە. دەنگ، ڕووخسار، تەنانەت واژۆی دیجیتاڵی.</p>
<ul>
<li>ساختەکاری و باجگیری</li>
<li>تێکدانی هەڵبژاردن و ناوبانگی کەسەکان</li>
<li>لەناوچوونی متمانە بە وێنە و ڤیدیۆ</li>
</ul>
<p>یاسایەکی سادە: ئەگەر زۆر سەیرە یان زۆر گونجاوە لەگەڵ بۆچوونت — سەرچاوەکەی بپشکنە.</p>
<h2>کار و پیشە</h2>
<p>ئەی ئای نووسین، وەرگێڕان، دیزاین، کۆد، پشتگیری کڕیار و شیکاری داتا دەگۆڕێت. ئەوەی دەمێنێتەوە: کەسێک کە ئەی ئای بەکاربهێنێت، لە کەسێک کە بەکاری ناهێنێت پێش دەکەوێت. مەترسی گەورە بێکاری تەواو نییە؛ مەترسی گەورە <strong>دواکەوتن</strong>ە.</p>
<h2>وزە و ژینگە</h2>
<p>ڕاهێنانی مۆدێلێکی گەورە کارەبای شارێکی بچووک دەخوات. ساردکردنەوەی داتاسێنتەر ئاو و وزەی زۆری دەوێت. هەر پرسیارێک لە چاتبۆتێک تێچووی کارەبای هەیە. ئەی ئای «هەور» نییە — سێنتەری ڕاستەقینە و چیپی گەرم و کارەبایە.</p>
<h2>لایەنگری و بڕیاری نادادپەروەر</h2>
<p>ئەی ئای لە داتا فێر دەبێت. ئەگەر داتاکە نادادپەروەر بێت، بڕیارەکەش وادەبێت. نموونە: سیستەمی دامەزراندن، قەرز، چاودێری تەندروستی. کەسێک ڕەت دەکرێتەوە و ناتوانێت بپرسێت بۆچی.</p>
<div data-type="callout"><p>٥ زیان: درۆ و دیپفەیک، لەدەستدانی کار، دزینی داتا، بڕیاری نادادپەروەر، وزەی زۆر. چارەسەر فێربوون، یاسا و بەکارهێنانی زیرەکانەیە — نەک قەدەغەکردنی تەواو.</p></div>`,
    cover_image: "/posts/ai-harms-and-risks.jpg",
    category_id: "pc-ai",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T10:00:00Z",
    seo_title: "زیانەکانی ئەی ئای",
    seo_description:
      "دیپفەیک، کار، نهێنی، لایەنگری و وزە؛ مەترسییەکانی ئەی ئای و چۆن بەرپرسیارانە مامەڵەی لەگەڵدا بکەیت.",
    og_image: "/posts/ai-harms-and-risks.jpg",
    deleted_at: null,
    created_at: "2026-09-11T10:00:00Z",
    updated_at: "2026-09-11T10:00:00Z",
    category: demoPostCategories[3],
    tags: [demoTags[4], demoTags[8]],
  }),
  post({
    id: "po23",
    title: "چۆن لەگەڵ ئەی ئای قازانج بکەیت: ١٠ بیرۆکەی کرداری",
    slug: "make-money-with-ai-ideas",
    excerpt:
      "ئەی ئای خۆی پارە ناهێنێت. کێشەیەکی ڕاستەقینە بە ئەی ئای چارەسەر بکە: بۆت، ناوەڕۆک، کۆرس و ئۆتۆمەیشن.",
    content: `<h2>یاسای سەرەکی</h2>
<p>ئەی ئای خۆی پارەت بۆ ناهێنێت. <strong>کێشەیەکی ڕاستەقینە + ئەی ئای = قازانج</strong>. بپرسە: خەڵک ئێستا چی دەکەن بە دەست، خاو، گران؟ ئەوە بکە خێراتر، هەرزانتر، یان باشتر.</p>
<h2>١٠ بیرۆکەی کرداری</h2>
<ol>
<li><strong>ئەجنسی ناوەڕۆک:</strong> پۆست، ڕیکلام، ڤیدیۆ و وەرگێڕان بۆ فرۆشگا و براندە ناوخۆییەکان.</li>
<li><strong>چاتبۆتی واتساپ / ئینستاگرام</strong> بۆ وەڵامی کڕیار (چێشتخانە، کلینیک، فرۆشگای ئۆنلاین).</li>
<li><strong>کۆرسی ئۆنلاین</strong> لەسەر ئەی ئای بە زمانی کوردی یان عەرەبی.</li>
<li><strong>خزمەتگوزاری CV، نامەی کار و لینکدین</strong> بۆ گەنجان.</li>
<li><strong>ئۆتۆمەیشنی ئۆفیس:</strong> ئێکسێل، ڕاپۆرت و ئیمەیڵ بۆ کۆمپانیا بچووکەکان.</li>
<li><strong>دیزاین و ڕیکلام:</strong> لۆگۆ، پۆستەر و ڤیدیۆی کورت.</li>
<li><strong>یارمەتی قوتابی:</strong> پوختە و ڕاهێنان، بە شێوەیەکی ئەخلاقی.</li>
<li><strong>وەرگێڕانی پیشەیی</strong> کوردی ↔ ئینگلیزی / عەرەبی بۆ کۆمپانیا.</li>
<li><strong>شیانەوەی داتا</strong> بۆ فرۆشگا: کام کاڵا دەفرۆشرێت، کەی، بۆ کێ.</li>
<li><strong>پرۆدەکتی بچووک:</strong> بۆتێک، ئەپێکی سادە یان تێمپلەیت بفرۆشە.</li>
</ol>
<h2>مۆدێلی پارە</h2>
<ul>
<li>خزمەتگوزاری مانگانە (بۆت + پشتگیری) — باشترین بۆ داهاتی جێگیر.</li>
<li>پڕۆژەی جارێک (وێبسایت، براندینگ، کۆرس).</li>
<li>فرۆشتنی تێمپلەیت و پرۆمپت.</li>
<li>کۆمیژن لە فرۆشتن (ئی-کۆمێرس + ئەی ئای بۆ وەسف و ڕیکلام).</li>
</ul>
<p>دەستپێبکە بە <strong>یەک خزمەتگوزاری بۆ یەک جۆر کڕیار</strong>. بۆ نموونە: تەنها کلینیکەکان، یان تەنها فرۆشگای جلوبەرگ.</p>
<h2>هەڵەی باو</h2>
<ul>
<li>چاوەڕوانی ئەوە بکەیت چاتبۆت خۆی کڕیارت بۆ بهێنێت.</li>
<li>١٠ بیرۆکە پێکەوە دەستپێبکەیت.</li>
<li>بەبێ نرخی دیاریکراو کار بکەیت.</li>
<li>تەنها ئامراز فێربیت، بەبێ فرۆشتن.</li>
</ul>
<div data-type="callout"><p>سەرکەوتن: یەک کێشە + یەک ئامرازی ئەی ئای + یەک کڕیاری ڕاستەقینە. نموونە: خاوەن فرۆشگایەک ڕۆژانە دوو کاتژمێر وەڵامی واتساپ دەداتەوە؛ تۆ بۆتێکی دەدەیتێ و مانگانە پارە وەردەگریت.</p></div>
<p>لە ڕێکار گروپ ئەی ئای بۆ خێراکردنی ناوەڕۆک و تاقیکردنەوە بەکاردەهێنین؛ فرۆشتن و متمانەی کڕیار هێشتا کارێکی مرۆڤە.</p>`,
    cover_image: "/posts/make-money-with-ai-ideas.jpg",
    category_id: "pc-ai",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T09:00:00Z",
    seo_title: "قازانج لەگەڵ ئەی ئای: ١٠ بیرۆکە",
    seo_description:
      "١٠ بیرۆکەی کرداری بۆ قازانج لەگەڵ ئەی ئای: بۆت، ناوەڕۆک، کۆرس، ئۆتۆمەیشن و فرۆشتن.",
    og_image: "/posts/make-money-with-ai-ideas.jpg",
    deleted_at: null,
    created_at: "2026-09-11T09:00:00Z",
    updated_at: "2026-09-11T09:00:00Z",
    category: demoPostCategories[3],
    tags: [demoTags[4], demoTags[5]],
  }),
  post({
    id: "po24",
    title: "شۆرتکاتەکانی کیبۆردی ویندۆز کە ژیانت دەگۆڕن",
    slug: "windows-keyboard-shortcuts",
    excerpt:
      "کۆپی، سکرینشۆت، کلیپبۆرد، قفڵکردن و گۆڕینی پەنجەرە؛ گرنگترین شۆرتکاتەکانی ویندۆز بۆ کار و خوێندن.",
    content: `<h2>١٠ شۆرتکات کە هەموو ڕۆژێک پێویستن</h2>
<table>
<thead><tr><th>شۆرتکات</th><th>کار</th></tr></thead>
<tbody>
<tr><td><code>Ctrl + C</code></td><td>کۆپی</td></tr>
<tr><td><code>Ctrl + V</code></td><td>پەیست</td></tr>
<tr><td><code>Ctrl + X</code></td><td>بڕین</td></tr>
<tr><td><code>Ctrl + Z</code></td><td>گەڕانەوە (Undo)</td></tr>
<tr><td><code>Ctrl + Y</code></td><td>دووبارەکردنەوە (Redo)</td></tr>
<tr><td><code>Ctrl + A</code></td><td>هەمووی هەڵبژێرە</td></tr>
<tr><td><code>Ctrl + F</code></td><td>گەڕان لە ناو پەڕە / فایل</td></tr>
<tr><td><code>Ctrl + S</code></td><td>پاشەکەوتکردن</td></tr>
<tr><td><code>Ctrl + Shift + Esc</code></td><td>تاسک مانەیەر ڕاستەوخۆ</td></tr>
<tr><td><code>Alt + Tab</code></td><td>گۆڕینی پەنجەرە</td></tr>
</tbody>
</table>
<h2>کلیلەی Windows</h2>
<table>
<thead><tr><th>شۆرتکات</th><th>کار</th></tr></thead>
<tbody>
<tr><td><code>Win</code></td><td>مێنیوی ستارت</td></tr>
<tr><td><code>Win + E</code></td><td>فایل ئێکسپلۆرەر</td></tr>
<tr><td><code>Win + I</code></td><td>سێتینگز</td></tr>
<tr><td><code>Win + S</code></td><td>گەڕان</td></tr>
<tr><td><code>Win + L</code></td><td>قفڵکردنی کۆمپیوتەر</td></tr>
<tr><td><code>Win + D</code></td><td>نیشاندانی دێسکتۆپ</td></tr>
<tr><td><code>Win + V</code></td><td>مێژووی کلیپبۆرد</td></tr>
<tr><td><code>Win + Shift + S</code></td><td>سکرینشۆتی بەشێک لە شاشە</td></tr>
<tr><td><code>Win + Tab</code></td><td>بینینی هەموو پەنجەرەکان</td></tr>
<tr><td><code>Win + .</code></td><td>ئیمۆجی و سیمبۆل</td></tr>
</tbody>
</table>
<h2>بۆ کار و نووسین</h2>
<ul>
<li><code>Ctrl + Backspace</code> سڕینەوەی وشەیەکی تەواو</li>
<li><code>Ctrl + پیکان</code> بازدان بە وشە</li>
<li><code>Ctrl + Shift + پیکان</code> هەڵبژاردنی وشە</li>
<li><code>Home</code> / <code>End</code> سەرەتا / کۆتایی هێڵ</li>
<li><code>Ctrl + Home</code> / <code>Ctrl + End</code> سەرەتا / کۆتایی بەڵگەنامە</li>
<li><code>Ctrl + B</code> تۆخ · <code>Ctrl + I</code> لار · <code>Ctrl + U</code> هێڵ لەژێرەوە</li>
</ul>
<h2>بۆ ئۆفیس و خوێندکار</h2>
<ul>
<li><code>Win + H</code> دەنگ بۆ نووسین (دیکتەیشن)</li>
<li><code>Win + Ctrl + D</code> دێسکتۆپی نوێ</li>
<li><code>Win + Ctrl + پیکانی چەپ/ڕاست</code> گۆڕینی دێسکتۆپ</li>
<li><code>Alt + F4</code> داخستنی بەرنامە</li>
<li><code>Ctrl + Shift + N</code> فۆڵدەری نوێ</li>
<li><code>F2</code> گۆڕینی ناوی فایل</li>
<li><code>Win + P</code> پڕۆجێکتەر / شاشەی دووەم</li>
</ul>
<div data-type="callout"><p>ئەگەر تەنها ٥ شۆرتکات فێربیت ئەمڕۆ: <code>Win + V</code>، <code>Win + Shift + S</code>، <code>Win + L</code>، <code>Alt + Tab</code> و <code>Ctrl + Shift + Esc</code>. ئەمانە ڕۆژانە چەند خولەکێکت بۆ دەگەڕێننەوە.</p></div>`,
    cover_image: "/posts/windows-keyboard-shortcuts.jpg",
    category_id: "pc-tips",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-11T08:00:00Z",
    seo_title: "شۆرتکاتەکانی کیبۆردی ویندۆز",
    seo_description:
      "گرنگترین شۆرتکاتەکانی ویندۆز: کۆپی، سکرینشۆت، کلیپبۆرد، قفڵکردن و گۆڕینی پەنجەرە.",
    og_image: "/posts/windows-keyboard-shortcuts.jpg",
    deleted_at: null,
    created_at: "2026-09-11T08:00:00Z",
    updated_at: "2026-09-11T08:00:00Z",
    category: demoPostCategories[11],
    tags: [demoTags[13], demoTags[15], demoTags[5]],
  }),
  post({
    id: "po7",
    title: "باشترین مۆدێلەکانی کۆدینگ لە ٢٠٢٦: Astra یان Fable؟",
    slug: "best-coding-models-2026",
    excerpt:
      "GPT-6 Astra و Claude Fable 5.1 لە سەرەتای ئەیلولدا هاتن. کامەیان بۆ کۆدی ڕۆژانە، کامەیان بۆ زانست و تێرمیناڵ.",
    content: `<h2>دوو ئاڵای نوێ لە ٧٢ کاتژمێردا</h2>
<p>لە ١ی ئەیلوولی ٢٠٢٦ Anthropic مۆدێلی <strong>Claude Fable 5.1</strong>ی بڵاوکردەوە و لە ٣ی ئەیلوول OpenAI <strong>GPT-6 Astra</strong>ی هێنا. هەردووکیان کۆنتێکستی نزیکەی یەک ملیۆن تۆکنیان هەیە. جیاوازییەکە لە نرخی لیستدا نییە؛ لە جۆری کارەکەدایە.</p>
<h2>ئەنجامی پێوانە</h2>
<ul>
<li><strong>GPT-6 Astra:</strong> لە Terminal-Bench 4.0 نزیکەی ٥٨٪، لە DeepSWE v1.1 نزیکەی ٧٤٪. باشترە بۆ زانست، بیرکاری، تێرمیناڵ و ئەرکی قورسی داتا.</li>
<li><strong>Claude Fable 5.1:</strong> لە پێوانەی سەربەخۆی Coding Agent Index پێشە؛ بۆ پێداچوونەوەی کۆد، فرۆنتئێند و کارکردنی درێژخایەن لەسەر ڕیپۆزیتۆری گەورە گونجاوترە. نرخی خوێندنەوەی کاشیشی ارزانترە.</li>
<li><strong>Gemini 3.8 Flash</strong> لە پێوانەی کۆنی تێرمیناڵ بەرز دەرکەوت، بەڵام لە Terminal-Bench 4.0ی قورستر زۆر دابەزی. ژمارەی کۆن تەنها بەس نییە.</li>
</ul>
<h2>چۆن هەڵیبژێریت</h2>
<p>ئەگەر ڕۆژانە لە Claude Code یان پێداچوونەوەی کۆد دەجیت، Fable 5.1 وەک کرێکاری سەرەکی تاقی بکە. ئەگەر پڕۆژەکەت زانستی، داتا یان ئەجێنتی تێرمیناڵە، Astra تاقی بکە. باشترین بڕیار ئەوەیە هەردووکیان لەسەر کۆدی خۆت تاقی بکەیت، نەک تەنها لەسەر خشتەی پێوانە.</p>
<p>لە ڕێکار گروپ AI بۆ خێراکردنی نووسین و تاقیکردنەوە بەکاردەهێنین؛ تەلارسازی، پاراستن و بڵاوکردنەوە هێشتا پێویستی بە مرۆڤە.</p>`,
    cover_image: "/posts/best-coding-models.jpg",
    category_id: "pc-coding",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-10T00:00:00Z",
    seo_title: "باشترین مۆدێلی کۆدینگ ٢٠٢٦",
    seo_description:
      "بەراوردی GPT-6 Astra و Claude Fable 5.1 بۆ کۆدینگ، تێرمیناڵ و پێداچوونەوەی کۆد.",
    og_image: "/posts/best-coding-models.jpg",
    deleted_at: null,
    created_at: "2026-09-10T00:00:00Z",
    updated_at: "2026-09-10T00:00:00Z",
    category: demoPostCategories[4],
    tags: [demoTags[4], demoTags[5]],
  }),
  post({
    id: "po8",
    title: "باشترین مۆدێلەکانی دروستکردنی وێنە: هیچ یەکێک هەموو شتێک نابەستێت",
    slug: "best-image-models-2026",
    excerpt:
      "GPT Image 2 بۆ فەرمانی ورد، Midjourney V8 بۆ هونەر، FLUX.2 بۆ وێنەی ڕاستەقینە، Ideogram بۆ نووسین لەسەر پۆستەر.",
    content: `<h2>بازاڕەکە بووە بە پسپۆڕ</h2>
<p>لە ٢٠٢٦ چیتر یەک «باشترین» مۆدێلی وێنە نییە. هەر مۆدێلێک بۆ جۆرێکی کار سەرکەوتووە. لە پێوانەی سەربەخۆی ئەیلولدا <strong>GPT Image 2</strong> لەسەرەوەیە بۆ گوێڕایەڵی فەرمان و دەستکاریکردنی وێنە.</p>
<h2>کامە بۆ کام کار</h2>
<ul>
<li><strong>GPT Image 2:</strong> باشترین بۆ فەرمانی ئاڵۆز، دەقی ناو وێنە و دەستکاریکردنی وێنەی ئامادە. گونجاو بۆ API و ڕیکلام.</li>
<li><strong>Midjourney V8.2:</strong> باشترین بۆ کۆنسێپت، دیزاینی سینەمایی و کوالێتی هونەری. APIـی فەرمی نییە.</li>
<li><strong>FLUX.2:</strong> باشترین بۆ وێنەی ڕاستەقینە و تێچووی کەمتر؛ دەتوانرێت لەسەر سێرڤەری خۆتیش بەڕێوە ببرێت.</li>
<li><strong>Ideogram 4:</strong> باشترین بۆ پۆستەر و نووسینی ڕوون لەسەر گرافیک.</li>
<li><strong>Nano Banana Pro:</strong> بەهێزە بۆ دەرچوونی ٤K و دەستکاریی خێرا.</li>
</ul>
<h2>بۆ تیمێکی دیزاین</h2>
<p>یەک ئامراز هەموو پڕۆژەیەک ناکات. بۆ براند و ڕیکلام زۆرجار GPT Image 2 یان Firefly بۆ مۆڵەت، بۆ کۆنسێپت Midjourney، بۆ وێنەی بەرهەم FLUX. مرۆڤ دەبێت ڕەنگی براند، دەست و نووسین پێداچوونەوە بکات پێش بڵاوکردنەوە.</p>`,
    cover_image: "/posts/best-image-models.jpg",
    category_id: "pc-image",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-09T00:00:00Z",
    seo_title: "باشترین مۆدێلی دروستکردنی وێنە ٢٠٢٦",
    seo_description:
      "بەراوردی GPT Image 2، Midjourney V8، FLUX.2 و Ideogram 4 بۆ دیزاین و ڕیکلام.",
    og_image: "/posts/best-image-models.jpg",
    deleted_at: null,
    created_at: "2026-09-09T00:00:00Z",
    updated_at: "2026-09-09T00:00:00Z",
    category: demoPostCategories[5],
    tags: [demoTags[4], demoTags[6]],
  }),
  post({
    id: "po9",
    title: "باشترین مۆدێلەکانی ڤیدیۆ: Veo، Kling یان Runway؟",
    slug: "best-video-models-2026",
    excerpt:
      "Veo 3.1 بۆ سینەما و دەنگی خۆماڵی، Kling 3.0 بۆ جووڵە و تێچوو، Runway Gen-4.5 بۆ کۆنترۆڵی کامێرا.",
    content: `<h2>ساڵی ٢٠٢٦ یارییەکەی گۆڕی</h2>
<p>ئەپلیکەیشنی Sora لە نیسانی ٢٠٢٦ وەستا و APIـیەکەی لە ئەیلوولدا کۆتایی دێت. بۆ پڕۆژەی نوێ چیتر هەڵبژاردەی سەرەکی نییە. سێ مۆدێل جێگایان گرتەوە: <strong>Google Veo 3.1</strong>، <strong>Kling 3.0</strong> و <strong>Runway Gen-4.5</strong>.</p>
<h2>کامە باشترینە؟</h2>
<ul>
<li><strong>Veo 3.1:</strong> باشترین بۆ کلیپی سینەمایی، ٤K و دەنگی خۆماڵی (دیالۆگ و ئامبیەنت) لە یەک تێپەڕدا. گونجاو بۆ ڕیکلامی قسەکردن و B-roll.</li>
<li><strong>Kling 3.0:</strong> باشترین بۆ جووڵەی مرۆڤ، ئاوی، قژ و کلیپی درێژتر بە تێچووی کەمتر. زۆر بەکاردێت بۆ سۆشیال میدیا.</li>
<li><strong>Runway Gen-4.5:</strong> باشترین بۆ کۆنترۆڵی کامێرا، دەستکاریکردنی نەوە و وۆرکفلۆی ستۆدیۆ. لە پێوانەی بینراودا زۆرجار لەسەرەوەیە.</li>
</ul>
<h2>ڕێنمایی کردەیی</h2>
<p>ستۆدیۆیەکی جددی دوو مۆدێل پێکەوە بەکاردەهێنێت: Veo بۆ پاڵەوانی کۆتایی، Kling یان Runway بۆ تاقیکردنەوە و جووڵە. هێشتا پێویستە ڕووخسار، مۆڵەت و براند بە دەستی مرۆڤ پێداچوونەوە بکرێت.</p>`,
    cover_image: "/posts/best-video-models.jpg",
    category_id: "pc-video",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-08T00:00:00Z",
    seo_title: "باشترین مۆدێلی ڤیدیۆ ٢٠٢٦",
    seo_description:
      "بەراوردی Google Veo 3.1، Kling 3.0 و Runway Gen-4.5 بۆ دروستکردنی ڤیدیۆ.",
    og_image: "/posts/best-video-models.jpg",
    deleted_at: null,
    created_at: "2026-09-08T00:00:00Z",
    updated_at: "2026-09-08T00:00:00Z",
    category: demoPostCategories[6],
    tags: [demoTags[4], demoTags[7]],
  }),
  post({
    id: "po10",
    title: "باشترین مۆدێلەکان بۆ توێژینەوە و ڕاپۆرت",
    slug: "best-research-report-models-2026",
    excerpt:
      "Deep Researchـی OpenAI و Gemini ڕاپۆرتی درێژ دەنووسن؛ Perplexity بۆ سەرچاوە. هیچیان جێگرەوەی پشکنینی مرۆڤ نین.",
    content: `<h2>لە وەڵامی کورتەوە بۆ ڕاپۆرتی چەند لاپەڕەیی</h2>
<p>مۆدێلی ئاسایی وەڵامێکی خێرا دەدات. مۆدێلی <strong>Deep Research</strong> پلان دادەنێت، دەیان سەرچاوە دەخوێنێتەوە و دواتر شیکارییەکی درێژ دەنووسێت. ئەمە بۆ بازاڕ، ڕکابەر و پێداچوونەوەی ئەدەبیات گونجاوە.</p>
<h2>سێ هەڵبژاردەی سەرەکی</h2>
<ul>
<li><strong>OpenAI Deep Research</strong> (وەک o3-deep-research): بەهێزە بۆ تێکەڵکردنی سەرچاوەی زۆر و ڕاپۆرتی شیکاری. تێچوو بەپێی ژمارەی سەرچاوە بەرز دەبێت.</li>
<li><strong>Gemini Deep Research / Deep Research Max:</strong> باشە بۆ پلانێکی ڕوون پێش گەڕان، Scholar و ناردن بۆ دۆکۆمێنت. Max بۆ توێژینەوەی قووڵترە.</li>
<li><strong>Perplexity:</strong> زۆرجار وردترە لە گێڕانەوەی سەرچاوە و خێراترە بۆ پرسیاری فەکتی.</li>
</ul>
<h2>مەترسی</h2>
<p>ڕاپۆرتێکی جوان دەتوانێت سەرچاوەی هەڵە یان کۆن تێدابێت. بۆ بڕیاری پارە، یاسا یان زانست دەبێت لینکەکان بکەیتەوە و ژمارەکان خۆت بپشکنیت. AI یارمەتیدەرە بۆ کۆکردنەوە؛ متمانە لە پێداچوونەوەدایە.</p>`,
    cover_image: "/posts/best-research-models.jpg",
    category_id: "pc-research",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-07T00:00:00Z",
    seo_title: "باشترین مۆدێلی توێژینەوە و ڕاپۆرت ٢٠٢٦",
    seo_description:
      "بەراوردی OpenAI Deep Research، Gemini Deep Research و Perplexity بۆ ڕاپۆرت و توێژینەوە.",
    og_image: "/posts/best-research-models.jpg",
    deleted_at: null,
    created_at: "2026-09-07T00:00:00Z",
    updated_at: "2026-09-07T00:00:00Z",
    category: demoPostCategories[7],
    tags: [demoTags[4], demoTags[8]],
  }),
  post({
    id: "po11",
    title: "باشترین مۆدێلەکان بۆ پزیشکی: یارمەتی، نەک جێگرەوەی پزیشک",
    slug: "best-medical-ai-models-2026",
    excerpt:
      "GPT-6 Astra لە HealthBench پێشە؛ Gemini بۆ وێنە و تیشک؛ MedGemma بۆ ئامێری ناوخۆیی. هیچیان بڕیاری کلینیکی تەنها نین.",
    content: `<h2>ئاگاداری گرنگ</h2>
<p>ئەم پۆستە پێداچوونەوەی تەکنەلۆجیایە، نەک ڕاوێژ یان دەرمان. هیچ مۆدێلێک نابێت جێگای پزیشکی بگرێتەوە. هەموو دەرەنجامێک پێویستی بە پێداچوونەوەی مرۆڤ و تاقیکردنەوەی ناوخۆیی هەیە.</p>
<h2>ئەوەی پێوانەکان دەڵێن</h2>
<ul>
<li><strong>GPT-6 Astra:</strong> لە HealthBench Professional لە سەرەتای ئەیلوولی ٢٠٢٦ لەسەرەوەیە بۆ پرسیاری قورسی کلینیکی و نووسین.</li>
<li><strong>Gemini 3.1 Pro:</strong> لە هەندێک تاقیکردنەوەی MedQA زۆر بەرزە و لە وێنە/تیشک (رادیۆلۆجی) بەهێزترە.</li>
<li><strong>Claude:</strong> لە دەستنیشانکردن و بەڕێوەبردندا نزیکە لە پێشەنگەکان؛ بۆ نووسینی وریا گونجاوە.</li>
<li><strong>MedGemma 1.5:</strong> مۆدێلی کراوەی بچووک بۆ وێنەی پزیشکی (CT/MRI و پاتۆلۆجی) لەسەر ئامێری ناوخۆیی؛ بۆ هەموو بوارێکی کلینیکی بەهێز نییە.</li>
</ul>
<h2>بۆ نەخۆشخانە و ستارتئەپ</h2>
<p>توێژینەوەی Nature Medicine لە ٢٠٢٦ دەریخست مۆدێلی گشتی زۆرجار لە ئامرازی تایبەتی کلینیکی تێدەپەڕن لەسەر پێوانە، بەڵام ئەمە مۆڵەتی بەکارهێنانی کلینیکی نییە. پاراستنی داتای نەخۆش، ڕەزامەندی و چاودێری پزیشک هێڵی سوورن.</p>`,
    cover_image: "/posts/best-medical-models.jpg",
    category_id: "pc-medical",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-06T00:00:00Z",
    seo_title: "باشترین مۆدێلی پزیشکی AI ٢٠٢٦",
    seo_description:
      "پێداچوونەوەی GPT-6 Astra، Gemini و MedGemma 1.5 بۆ یارمەتی پزیشکی، بە ئاگاداری کلینیکی.",
    og_image: "/posts/best-medical-models.jpg",
    deleted_at: null,
    created_at: "2026-09-06T00:00:00Z",
    updated_at: "2026-09-06T00:00:00Z",
    category: demoPostCategories[8],
    tags: [demoTags[4], demoTags[9]],
  }),
  post({
    id: "po12",
    title: "باشترین مۆدێلەکان بۆ ئەندازیاری و CAD",
    slug: "best-engineering-ai-models-2026",
    excerpt:
      "Neural CADـی Autodesk بۆ جیۆمەتری، Omniverse و Isaac Sim بۆ سیمولەیشن، VisCAD و Astra بۆ بیرکاری و نەخشە.",
    content: `<h2>کۆد و وێنە بەس نین بۆ ئەندازیاری</h2>
<p>مۆدێلی زمان دەتوانێت ڕوونکردنەوە بنووسێت، بەڵام پارچەیەکی پیشەسازی پێویستی بە جیۆمەتری ورد، قەبارە و سیمولەیشنی فیزیکی هەیە. لە ٢٠٢٦ سێ چین دەردەکەون: CADـی زیرەک، سیمولەیشن و مۆدێلی گشتی بۆ بیرکاری.</p>
<h2>چینەکان</h2>
<ul>
<li><strong>Autodesk Neural CAD:</strong> مۆدێلێکی بنەڕەتی کە ڕاستەوخۆ لەسەر جیۆمەتری B-rep کار دەکات؛ لە Fusion بۆ کۆنسێپت و AutoConstrain دەردەکەوێت. دەرەنجامەکە دەبێت دەستکاری بکرێت، نەک تەنها وێنە.</li>
<li><strong>NVIDIA Omniverse + Isaac Sim:</strong> گۆڕانی CAD دەگوازێتەوە بۆ سیمولەیشنی فیزیکی. Onshape و PTC ئەم ڕێگایە بۆ ڕۆبۆت بەکاردەهێنن تا دیزاین و ڕاهێنان لە یەک سەرچاوەدا بن.</li>
<li><strong>VisCAD:</strong> سویتێکی ٢٠٢٦ بۆ CADـی پیشەسازی لە وێنە، دەق و وێنەی ڕاستەقینەوە؛ لە پێوانەی پارچەدا نزیک یان باشتر لە مۆدێلی گشتی.</li>
<li><strong>GPT-6 Astra:</strong> لە پێوانەی BenchCAD زۆر بەرزە بۆ بیرکاری و نەخشەی ئەندازیاری، بەڵام جێگرەوەی نەرمەکاڵای CAD نییە.</li>
</ul>
<h2>ئەندازیار هێشتا واژۆ دەکات</h2>
<p>AI خێرایی کۆنسێپت و تاقیکردنەوە زیاد دەکات. بەرپرسیاریەتی پێکهاتە، سەلامەتی و ستاندارد لەسەر ئەندازیار دەمێنێتەوە. باشترین وۆرکفلۆ: کۆنسێپت بە AI، وردکردنەوە لە CAD، پشکنین بە سیمولەیشن.</p>`,
    cover_image: "/posts/best-engineering-models.jpg",
    category_id: "pc-engineering",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-09-05T00:00:00Z",
    seo_title: "باشترین مۆدێلی ئەندازیاری و CAD ٢٠٢٦",
    seo_description:
      "پێداچوونەوەی Autodesk Neural CAD، NVIDIA Omniverse و VisCAD بۆ ئەندازیاری.",
    og_image: "/posts/best-engineering-models.jpg",
    deleted_at: null,
    created_at: "2026-09-05T00:00:00Z",
    updated_at: "2026-09-05T00:00:00Z",
    category: demoPostCategories[9],
    tags: [demoTags[4], demoTags[10]],
  }),
  post({
    id: "po1",
    title: "چۆن وێبسایتێکی مۆدێرن بۆ بازاڕی کوردی دروست دەکرێت؟",
    slug: "modern-web-design",
    excerpt:
      "خێرایی، RTL، SEO و ئەزموونی بەکارهێنەر؛ ئەو بنەمایانەی وێبسایتێکی سەرکەوتوو لە کوردستان پێویستی پێیەتی.",
    content: `<h2>وێبسایتی مۆدێرن تەنها جوانی نییە</h2>
<p>زۆر پڕۆژە دەست پێدەکەن بە دیزاینێکی جوان، بەڵام دوای بڵاوکردنەوە خەڵک ناتوانێت بە خێرایی بیدۆزێتەوە یان لە مۆبایل ناخوێنرێتەوە. لە بازاڕی کوردی، زۆربەی هاتنەکان لە مۆبایلەوەن و زمانی سەرەکی ڕاست بۆ چەپە.</p>
<h2>چوار بنەما</h2>
<ul>
<li>RTL لە سەرەتاوە: مێنیو، فۆرم، خشتە و دوگمەکان دەبێت بۆ سۆرانی دروست بن.</li>
<li>خێرایی: وێنەی قورس و جاڤاسکریپتی زیادە فرۆشتن دەکوژێت.</li>
<li>ناوەڕۆکی ڕوون: سەردێڕ، خزمەتگوزاری و پەیوەندی دەبێت لە یەک چاوگەدا دەربکەون.</li>
<li>SEO: ناونیشان، وەسف و ناونیشانی URL بە کوردی و ئینگلیزیی تێکەڵ.</li>
</ul>
<p>لە ڕێکار گروپ وێبسایت وەک بەرهەمێکی تەکنەلۆجی دادەنێین: داتابەیس، پانێڵی بەڕێوەبردن و پێوانە، نەک تەنها لاپەڕەیەکی جێگیر.</p>`,
    cover_image: "/posts/modern-web-design.jpg",
    category_id: "pc-web",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-08-18T00:00:00Z",
    seo_title: "وێبسایتی مۆدێرن بۆ بازاڕی کوردی",
    seo_description:
      "ڕێنمایی دروستکردنی وێبسایتی خێرا، RTL و SEO بۆ کاروباری کوردی.",
    og_image: "/posts/modern-web-design.jpg",
    deleted_at: null,
    created_at: "2026-08-18T00:00:00Z",
    updated_at: "2026-08-18T00:00:00Z",
    category: demoPostCategories[0],
    tags: [demoTags[0], demoTags[3]],
  }),
  post({
    id: "po2",
    title: "Next.js و App Router: بۆچی بۆ پڕۆژەی ئەجێنسی گونجاوە؟",
    slug: "nextjs-app-router",
    excerpt:
      "ڕێگایەکی ڕوون بۆ ئەوەی چۆن App Router، Server Actions و کاشکردن یارمەتی سایتێکی CMS دەدەن.",
    content: `<h2>کێشەی سایتە کلاسیکەکان</h2>
<p>ئەگەر هەر گۆڕانکارییەک پێویستی بە گەشەپێدەر هەبێت، سایتەکە زوو دەوەستێت. ئەجێنسی پێویستی بەوەیە ناوەڕۆک لە پانێڵەوە بگۆڕدرێت و پەڕەکان خێرا نوێ ببنەوە.</p>
<h2>App Router چی دەگۆڕێت؟</h2>
<p>پەڕەکان دەتوانن لە سێرڤەرەوە داتا بخوێننەوە، مێتاداتا بۆ SEO دابنێن و تەنها ئەو بەشانەی پێویستن بکەنە کلاینت. Server Actions بۆ فۆرمی پەیوەندی و CMS گونجاون، چونکە کلیلی نهێنی نانێرن بۆ وێبگەڕ.</p>
<p>بۆ ڕێکار گروپ ئەم مۆدێلە واتە: سایتێکی گشتی خێرا، و پانێڵێکی ئادمین پارێزراو لە هەمان پڕۆژەدا.</p>`,
    cover_image: "/posts/nextjs-app-router.jpg",
    category_id: "pc-web",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-07-22T00:00:00Z",
    seo_title: null,
    seo_description: null,
    og_image: "/posts/nextjs-app-router.jpg",
    deleted_at: null,
    created_at: "2026-07-22T00:00:00Z",
    updated_at: "2026-07-22T00:00:00Z",
    category: demoPostCategories[0],
    tags: [demoTags[0]],
  }),
  post({
    id: "po3",
    title: "ئەپی مۆبایل یان وێبسایت؟ چۆن بڕیار بدەیت",
    slug: "app-vs-website",
    excerpt:
      "بودجە، ئۆفلاین، ئاگاداری و فرۆشتن؛ خشتەیەکی بڕیاردان بۆ خاوەن کار لە کوردستان.",
    content: `<h2>یەکەم پرسیار: بەکارهێنەرەکەت ڕۆژانە دەگەڕێتەوە؟</h2>
<p>ئەگەر خزمەتگوزارییەکەت وەک بینینی تەلەڤیزیۆن، پارەدان یان خوێندنەوەی قورئان ڕۆژانەیە، ئەپ سوودی زیاترە: ئاگاداری، ئیکۆن لە مۆبایل و کارکردنی بەبێ ئینتەرنێت.</p>
<p>ئەگەر مەبەست ناسینی براند، پۆرتفۆلیۆ یان وەرگرتنی داواکارییە، وێبسایت خێراتر و هەرزانتر دەگاتە گووگڵ.</p>
<h2>ڕێگای تێکەڵ</h2>
<p>زۆر پڕۆژەی ڕێکار گروپ بە وێب دەست پێدەکەن، پاشان ئەپی مۆبایل بۆ هەمان داتابەیس زیاد دەکەن. گرنگ ئەوەیە داتا و لۆجیک لە یەک جێگادا بن، نەک دوو سیستەمی جیا.</p>`,
    cover_image: "/posts/app-vs-website.jpg",
    category_id: "pc-mobile",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-06-14T00:00:00Z",
    seo_title: null,
    seo_description: null,
    og_image: "/posts/app-vs-website.jpg",
    deleted_at: null,
    created_at: "2026-06-14T00:00:00Z",
    updated_at: "2026-06-14T00:00:00Z",
    category: demoPostCategories[1],
    tags: [demoTags[1]],
  }),
  post({
    id: "po4",
    title: "داتابەیس و RLS: چۆن داتای کڕیار دەپارێزیت",
    slug: "database-rls-security",
    excerpt:
      "بۆچی Row Level Security گرنگە و چۆن میوانی گشتی تەنها ناوەڕۆکی بڵاوکراو دەبینێت.",
    content: `<h2>هەڵەی باو</h2>
<p>هەندێک سایت کلیلی داتابەیس دەخەنە ناو وێبگەڕ. ئەگەر سیاسەتی خشتەکان کراوە بن، هەر کەسێک دەتوانێت پڕۆژەی نەبڵاوکراو یان نامەی کڕیار بخوێنێتەوە.</p>
<h2>RLS چی دەکات؟</h2>
<p>لە PostgreSQL/Supabase هەر خشتەیەک دەتوانێت یاسای خۆی هەبێت: میوان تەنها ڕیزە بڵاوکراوەکان دەبینێت، فۆرمی پەیوەندی تەنها insert دەکات، و ئادمین بە ڕۆڵ مامەڵە دەکات.</p>
<p>ئەمە بنەمای CMSـی ڕێکار گروپە: سایتە گشتییەکە جوان بێت، بەڵام داتا نابێت بە هەمان جوانی کراوە بێت.</p>`,
    cover_image: "/posts/database-rls-security.jpg",
    category_id: "pc-data",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-05-28T00:00:00Z",
    seo_title: null,
    seo_description: null,
    og_image: "/posts/database-rls-security.jpg",
    deleted_at: null,
    created_at: "2026-05-28T00:00:00Z",
    updated_at: "2026-05-28T00:00:00Z",
    category: demoPostCategories[2],
    tags: [demoTags[2]],
  }),
  post({
    id: "po5",
    title: "AI لە گەشەپێدانی وێب: کەی یارمەتیدەرە و کەی زیانە؟",
    slug: "ai-in-web-development",
    excerpt:
      "بۆ نواندنەوە، نووسین و کۆد AI خێراتر دەکات؛ بۆ بڕیاری تەلارسازی و پاراستن هێشتا پێویستت بە مرۆڤە.",
    content: `<h2>AI وەک هاوکار، نەک جێگرەوە</h2>
<p>دەتوانیت پێشنیاری دیزاین، دەقی سۆرانی یان کۆدی سەرەتایی بە AI دروست بکەیت. بەڵام بڵاوکردنەوەی ڕاستەوخۆ بەبێ پێداچوونەوە مەترسی هەیە: هەڵەی ئاسایش، دەقی ناڕاست و کۆدی نەگونجاو لەگەڵ پڕۆژەکەت.</p>
<h2>ئەوەی ئێمە پێشنیار دەکەین</h2>
<ul>
<li>AI بۆ خێراکردنی ڕەشنووس و تاقیکردنەوە.</li>
<li>مرۆڤ بۆ تەلارسازی، RLS، پارەدان و ناوەڕۆکی کۆتایی.</li>
<li>هیچ نهێنییەک نەچێتە ناو پێشنیارە گشتییەکان.</li>
</ul>
<p>تەکنەلۆجیا خێراتر دەبێت، بەڵام متمانەی کڕیار هێشتا لە کوالێتی و ڕوونی کارەکەدایە.</p>`,
    cover_image: "/posts/ai-in-web-development.jpg",
    category_id: "pc-ai",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-04-09T00:00:00Z",
    seo_title: null,
    seo_description: null,
    og_image: "/posts/ai-in-web-development.jpg",
    deleted_at: null,
    created_at: "2026-04-09T00:00:00Z",
    updated_at: "2026-04-09T00:00:00Z",
    category: demoPostCategories[3],
    tags: [demoTags[4], demoTags[0]],
  }),
  post({
    id: "po6",
    title: "SEO بۆ سایتە کوردییەکان: گووگڵ چی دەبینێت؟",
    slug: "kurdish-seo-guide",
    excerpt:
      "ناونیشانی سۆرانی، خێرایی مۆبایل و داتای پێکهاتەیی؛ هەنگاوەکانێک کە دەتوانن هاتنی ئۆرگانیک زیاد بکەن.",
    content: `<h2>زمان و ناونیشان</h2>
<p>گووگڵ پەڕەی کوردی دەخوێنێتەوە ئەگەر <code>lang</code> ڕاست بێت، سەردێڕ ڕوون بێت و وەسفی مێتا درێژایی گونجاوی هەبێت. تێکەڵکردنی وشەی کوردی و ئینگلیزی بۆ براند (وەک ڕێکار گروپ) یارمەتی دەدات.</p>
<h2>تەکنیک</h2>
<p>sitemap، robots، خێرایی LCP و وێنەی Open Graph زۆر جار لە سایتە ناوخۆییەکان فەرامۆش دەکرێن. هەر پڕۆژە و پۆستێک دەبێت ناونیشانی تایبەت و وەسفی خۆی هەبێت، نەک هەمان دەق بۆ هەموو پەڕەکان.</p>
<p>SEO جادوو نییە؛ پێوانە و ناوەڕۆکی بەردەوامە. بلۆگی تەکنەلۆجیا یەکێکە لە باشترین ڕێگاکان بۆ ئەوەی سایتەکەت لە گەڕاندا بژی.</p>`,
    cover_image: "/posts/kurdish-seo-guide.jpg",
    category_id: "pc-web",
    author_id: null,
    featured: false,
    status: "published",
    published_at: "2026-03-02T00:00:00Z",
    seo_title: null,
    seo_description: null,
    og_image: "/posts/kurdish-seo-guide.jpg",
    deleted_at: null,
    created_at: "2026-03-02T00:00:00Z",
    updated_at: "2026-03-02T00:00:00Z",
    category: demoPostCategories[0],
    tags: [demoTags[3], demoTags[0]],
  }),
];

/** 1 primary + at most 2 extras — like The Verge / TechCrunch topic labels */
const POST_CATEGORY_SLUGS: Record<string, string[]> = {
  ...EDU_POST_CATEGORY_SLUGS,
  ...SOCIAL_POST_CATEGORY_SLUGS,
  ...NEWS_POST_CATEGORY_SLUGS,
  "prompt-cache-secret": ["tips", "coding", "ai"],
  "mcp-connectors-secret": ["tips", "coding", "ai"],
  "computer-use-screenshot-secret": ["coding", "ai", "tips"],
  "image-editing-not-regenerate": ["image", "ai", "tips"],
  "video-hidden-features": ["video", "ai", "tips"],
  "deep-research-edit-the-plan": ["research", "ai", "tips"],
  "million-token-context-mistakes": ["tips", "coding", "ai"],
  "nvidia-chips-and-ai": ["hardware", "ai"],
  "huawei-phones-kirin-chips": ["mobile", "hardware"],
  "ai-harms-and-risks": ["ai"],
  "make-money-with-ai-ideas": ["ai", "tips"],
  "windows-keyboard-shortcuts": ["tips"],
  "best-coding-models-2026": ["coding", "ai"],
  "best-image-models-2026": ["image", "ai"],
  "best-video-models-2026": ["video", "ai"],
  "best-research-report-models-2026": ["research", "ai"],
  "best-medical-ai-models-2026": ["medical", "ai"],
  "best-engineering-ai-models-2026": ["engineering", "ai"],
  "modern-web-design": ["web", "tips"],
  "nextjs-app-router": ["web", "coding"],
  "app-vs-website": ["mobile", "web"],
  "database-rls-security": ["database", "web"],
  "ai-in-web-development": ["ai", "web", "coding"],
  "kurdish-seo-guide": ["web", "tips"],
};

function attachCategories(post: Post): Post {
  const slugs = POST_CATEGORY_SLUGS[post.slug];
  const categories = (slugs?.length
    ? slugs.map((slug) => demoPostCategories.find((item) => item.slug === slug))
    : [post.category]
  ).filter((item): item is PostCategory => Boolean(item));
  const unique = [...new Map(categories.map((item) => [item.id, item])).values()];
  const primary = unique[0] ?? post.category ?? null;

  return {
    ...post,
    category_id: primary?.id ?? post.category_id,
    category: primary,
    categories: unique,
  };
}

export const demoPosts: Post[] = demoPostsRaw.map(attachCategories);
