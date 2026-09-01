"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { usePublicBlog } from "@/hooks/use-blogs";
import { BlogDetailSkeleton } from "@/components/skeletons";
import { BlogDetailError } from "@/components/errors";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { data: blog, isLoading, isError, error, refetch } = usePublicBlog(slug);

  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  // A failed request and a post that does not exist are different things.
  // Telling a reader with flaky wifi that the post was removed is a lie, and
  // it hides the retry that would actually fix it.
  if (isError) {
    return <BlogDetailError onRetry={() => refetch()} error={error} />;
  }

  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="border-border mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <span className="text-muted-foreground text-2xl">404</span>
        </div>
        <h1 className="text-foreground text-xl font-semibold">Post not found</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Title and meta */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          {blog.title}
        </h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
          <Calendar className="h-4 w-4" />
          <time dateTime={blog.published_at || blog.created_at}>
            {new Date(blog.published_at || blog.created_at).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </time>
        </div>
      </header>

      {/* Cover image */}
      {blog.image && (
        <div className="mb-12 rounded-xl overflow-hidden border border-border">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Bottom nav */}
      <div className="mt-16 pt-8 border-t border-border/50">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>
      </div>
    </article>
  );
}
