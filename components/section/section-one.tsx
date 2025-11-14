import ArticleOne from "./roby/article-one";
import ArticleTwo from "./roby/article-two";

export default function SectionOne() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ArticleOne />
        <ArticleTwo />
      </div>
    </>
  );
}
