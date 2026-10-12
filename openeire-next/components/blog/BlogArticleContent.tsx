import { PortfolioVideo } from "@/components/real-estate/PortfolioVideo";
import { getBlogContentBlocks } from "@/lib/blog/videoBlocks";

export function BlogArticleContent({ content, slug }: { content: string; slug: string }) {
  return <article>{getBlogContentBlocks(content).map((block, index) =>
    block.kind === "html"
      ? <div key={index} className="blog-content" dangerouslySetInnerHTML={{ __html: block.html }} />
      : <div key={index} className={`my-8 ${block.video.width === 9 ? "mx-auto w-full max-w-sm" : "w-full"}`}>
          <PortfolioVideo video={block.video} projectSlug={`blog-${slug}`} />
        </div>,
  )}</article>;
}
